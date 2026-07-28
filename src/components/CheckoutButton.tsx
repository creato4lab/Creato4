"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Loader2, ShoppingBag, Zap, CheckCircle2 } from 'lucide-react';
import { createRazorpayOrder, verifyPayment, claimFreeLicense } from '@/actions/payment';

interface CheckoutButtonProps {
  productId: string;
  licenseType: "STUDENT" | "COMMERCIAL" | "ENTERPRISE" | "SOURCE_CODE_ONLY" | "REPORT_WATERMARKED" | "REPORT_SUBMISSION" | "REPORT_EDITABLE" | "FIRMWARE_FLASH" | "PCB_DESIGN_FILES" | "CAD_3D_MODELS";
  productName: string;
  price?: number;
  variant?: "default" | "compact";
}

export function CheckoutButton({ productId, licenseType, productName, price = 0, variant = "default" }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const isFree = price === 0 || licenseType === "FIRMWARE_FLASH";

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
    setSuccessMsg("");

    // ── Direct Free License Claim (No Payment Gateway / No Money Requested) ──
    if (isFree) {
      const claimRes = await claimFreeLicense(productId, licenseType);
      if (claimRes.error) {
        if (claimRes.error.includes("logged in")) {
          alert("Please log in or create an account to claim your free license.");
          router.push("/login");
        } else {
          alert(claimRes.error);
        }
        setLoading(false);
        return;
      }

      setSuccessMsg("🎉 Free license added to your account! Redirecting to Dashboard...");
      setTimeout(() => {
        router.push(claimRes.redirectUrl || "/dashboard?claimed=success");
      }, 1000);
      return;
    }
    
    // ── Paid License Checkout via Razorpay ──
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    const result = await createRazorpayOrder(productId, licenseType);
    if (result.error) {
      alert(result.error);
      setLoading(false);
      if (result.error === "You must be logged in to purchase.") {
        router.push("/login");
      }
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TI1ljnh317iEKJ', 
      amount: result.amount, 
      currency: result.currency,
      name: "Creato4 Lab",
      description: `Purchase ${productName} - ${licenseType} License`,
      order_id: result.orderId,
      handler: async function (response: any) {
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
        name: "",
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

  const isCompact = variant === "compact";

  return (
    <div>
      {successMsg && (
        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-xs text-green-800 font-bold">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          {successMsg}
        </div>
      )}

      <button 
        onClick={handleCheckout} 
        disabled={loading}
        className={
          isCompact
            ? "w-full flex items-center justify-center gap-1.5 bg-[#1A3C2F] text-[#FAF8F5] py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-[#C4A35A] transition-colors disabled:opacity-70 cursor-pointer shadow-xs"
            : isFree
            ? "w-full flex items-center justify-center gap-2 bg-[#2D5929] text-[#FAF8F5] py-4 rounded-xl font-bold text-sm hover:bg-[#1A3C2F] transition-all mb-4 disabled:opacity-70 cursor-pointer shadow-md"
            : "w-full flex items-center justify-center gap-2 bg-[#1A3C2F] text-[#FAF8F5] py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity mb-4 disabled:opacity-70 cursor-pointer"
        }
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFree ? (
          <Zap className="w-4 h-4 text-[#C4A35A]" />
        ) : isCompact ? (
          <ShoppingBag className="w-3.5 h-3.5" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        {loading ? "Processing..." : isFree ? "Claim Free Access" : isCompact ? "Buy Now" : "Proceed to Checkout"}
      </button>
    </div>
  );
}
