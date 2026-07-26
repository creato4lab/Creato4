"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Loader2 } from 'lucide-react';
import { createRazorpayOrder, verifyPayment } from '@/actions/payment';

interface CheckoutButtonProps {
  productId: string;
  licenseType: "STUDENT" | "COMMERCIAL" | "ENTERPRISE";
  productName: string;
}

export function CheckoutButton({ productId, licenseType, productName }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setLoading(true);
    
    // 1. Load Razorpay Script
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    // 2. Create Order on our Server
    const result = await createRazorpayOrder(productId, licenseType);
    if (result.error) {
      alert(result.error);
      setLoading(false);
      // Optional: if unauthenticated, redirect to login
      if (result.error === "You must be logged in to purchase.") {
        router.push("/login");
      }
      return;
    }

    // 3. Initialize Razorpay Modal
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TI1ljnh317iEKJ', 
      amount: result.amount, 
      currency: result.currency,
      name: "Creato4 Lab",
      description: `Purchase ${productName} - ${licenseType} License`,
      order_id: result.orderId,
      handler: async function (response: any) {
        // 4. Verify Payment Signature
        const verification = await verifyPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
          productId,
          licenseType,
          result.amount!
        );

        if (verification.success) {
          router.push("/dashboard?success=true");
        } else {
          alert(verification.error || "Payment verification failed.");
        }
      },
      prefill: {
        name: "", // can be pulled from session
        email: "",
      },
      theme: {
        color: "#1A3C2F",
      },
    };

    const rzp1 = new (window as any).Razorpay(options);
    
    rzp1.on("payment.failed", function (response: any) {
      alert(response.error.description);
    });

    rzp1.open();
    setLoading(false);
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-[#1A3C2F] text-[#FAF8F5] py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity mb-4 disabled:opacity-70"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {loading ? "Processing..." : "Proceed to Checkout"}
    </button>
  );
}
