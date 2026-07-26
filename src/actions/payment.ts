"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

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

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return { error: "Payment verification failed. Invalid signature." };
    }

    // Success! Create Order and License in DB
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: amountPaid / 100, // convert paise back to INR
        currency: "INR",
        status: "COMPLETED",
        razorpayId: razorpay_payment_id,
        items: {
          create: [
            {
              productId,
              price: amountPaid / 100,
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

    return { success: true, orderId: order.id, licenseId: license.id };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { error: "An error occurred while confirming your order." };
  }
}
