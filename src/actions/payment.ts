"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { sendEmail } from "@/lib/mailer";
import { getOrderConfirmationEmail } from "@/lib/emailTemplates";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(productId: string, licenseType: "STUDENT" | "COMMERCIAL" | "ENTERPRISE") {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { error: "You must be logged in to purchase." };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return { error: "Product not found." };
    }

    let price = product.price;
    if (licenseType === "COMMERCIAL") price = Math.round(price * 2.5);
    if (licenseType === "ENTERPRISE") price = Math.round(price * 8);

    // Razorpay amount is in the smallest currency unit (paise)
    const amountInPaise = price * 100;

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}_${productId.slice(-6)}`,
      notes: {
        userId: session.user.id,
        productId,
        licenseType,
      },
    };

    const order = await razorpay.orders.create(options);

    // We don't create Prisma Order here yet, wait for successful payment
    return { orderId: order.id, amount: options.amount, currency: options.currency };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return { error: "Failed to initialize payment." };
  }
}

export async function verifyPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  productId: string,
  licenseType: "STUDENT" | "COMMERCIAL" | "ENTERPRISE",
  amountPaid: number
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "Unauthorized" };
    }

    // 1. Prevent Replay Attack (Check if payment was already recorded)
    const existingOrder = await prisma.order.findUnique({
      where: { razorpayId: razorpay_payment_id }
    });
    if (existingOrder) {
      return { error: "Payment has already been verified and processed." };
    }

    // 2. Verify HMAC Signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return { error: "Payment verification failed. Invalid signature." };
    }

    // 3. Fetch Razorpay Order from Razorpay API to verify original server notes & amount
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    } catch (err) {
      console.error("Error fetching order from Razorpay:", err);
      return { error: "Failed to verify order details with payment gateway." };
    }

    if (!razorpayOrder) {
      return { error: "Order not found on payment gateway." };
    }

    // 4. Server-Side Price & Product Validation
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return { error: "Product not found." };
    }

    let expectedPrice = product.price;
    if (licenseType === "COMMERCIAL") expectedPrice = Math.round(expectedPrice * 2.5);
    if (licenseType === "ENTERPRISE") expectedPrice = Math.round(expectedPrice * 8);
    const expectedAmountInPaise = expectedPrice * 100;

    // Validate that the paid amount matches expected server price
    if (Number(razorpayOrder.amount) !== expectedAmountInPaise || amountPaid !== expectedAmountInPaise) {
      console.error(`🚨 Security Alert: Amount mismatch! Razorpay amount: ${razorpayOrder.amount}, Client amountPaid: ${amountPaid}, Expected: ${expectedAmountInPaise}`);
      return { error: "Payment verification failed. Amount mismatch." };
    }

    // 5. Success! Create Order and License in DB
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: expectedAmountInPaise / 100, // convert paise back to INR
        currency: "INR",
        status: "COMPLETED",
        razorpayId: razorpay_payment_id,
        items: {
          create: [
            {
              productId,
              price: expectedAmountInPaise / 100,
              licenseType,
            }
          ]
        }
      }
    });

    const license = await prisma.license.create({
      data: {
        type: licenseType,
        userId: session.user.id,
        productId,
        allowedUses: licenseType === "STUDENT" 
          ? ["Personal projects", "Academic use"] 
          : licenseType === "COMMERCIAL" 
          ? ["Client projects (up to 3)", "Internal team use"]
          : ["Unlimited projects", "Enterprise deployment"],
        restrictions: licenseType === "STUDENT" 
          ? ["No commercial distribution"] 
          : [],
      }
    });

    // Send order confirmation email
    if (session.user.email) {
      const name = session.user.name || session.user.email.split("@")[0];
      const date = new Date().toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "long",
      });
      await sendEmail({
        to: session.user.email,
        subject: `✅ Order Confirmed — ${product.title} | Creato4 Lab`,
        html: getOrderConfirmationEmail({
          name,
          email: session.user.email,
          orderId: order.id,
          productName: product.title,
          licenseType,
          amount: expectedAmountInPaise / 100,
          licenseKey: license.licenseKey,
          date,
        }),
      });
    }

    return { success: true, orderId: order.id, licenseId: license.id };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { error: "An error occurred while confirming your order." };
  }
}
