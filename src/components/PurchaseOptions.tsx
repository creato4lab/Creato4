"use client";
import React, { useState } from "react";
import { ShieldCheck, Download, Check, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./CheckoutButton";

type PurchaseTier = {
  id: "STUDENT" | "COMMERCIAL" | "ENTERPRISE" | "SOURCE_CODE_ONLY" | "REPORT_SUBMISSION" | "REPORT_EDITABLE" | "FIRMWARE_FLASH";
  label: string;
  badge?: string;
  description: string;
  includes: string[];
  priceMultiplier: number;
};

const PURCHASE_TIERS: PurchaseTier[] = [
  {
    id: "STUDENT",
    label: "Complete Project",
    badge: "Most Popular",
    description: "Everything you need to build & learn.",
    includes: [
      "Full Source Code & Firmware",
      "Circuit Diagrams & Schematics",
      "PCB Design Files",
      "CAD / 3D Models",
      "Bill of Materials (BOM)",
      "Complete Documentation",
    ],
    priceMultiplier: 1.0,
  },
  {
    id: "SOURCE_CODE_ONLY",
    label: "Source Code Only",
    description: "Core firmware and libraries.",
    includes: [
      "Firmware Source Code",
      "Required Libraries",
      "Setup & Flash Guide",
    ],
    priceMultiplier: 0.6,
  },
  {
    id: "REPORT_SUBMISSION",
    label: "Submission Ready Report",
    description: "Print-ready PDF for academic submission.",
    includes: [
      "Formatted Printable PDF Report",
      "Abstract, Chapters & References",
      "Diagrams & Figures",
    ],
    priceMultiplier: 0.4,
  },
  {
    id: "REPORT_EDITABLE",
    label: "Editable Report",
    description: "Fully editable files for customization.",
    includes: [
      "DOCX (Microsoft Word)",
      "PPTX (PowerPoint Slides)",
      "PDF (Final Format)",
    ],
    priceMultiplier: 0.5,
  },
  {
    id: "FIRMWARE_FLASH",
    label: "Firmware Flash License",
    description: "Flash verified firmware directly — no source code.",
    includes: [
      "Web-based firmware flashing tool",
      "Supports popular dev boards",
      "No source code included",
    ],
    priceMultiplier: 0,
  },
];

interface PurchaseOptionsProps {
  productId: string;
  productName: string;
  basePrice: number;
}

export function PurchaseOptions({ productId, productName, basePrice }: PurchaseOptionsProps) {
  const [selected, setSelected] = useState<PurchaseTier["id"]>("STUDENT");
  const [showAll, setShowAll] = useState(false);

  const selectedTier = PURCHASE_TIERS.find((t) => t.id === selected)!;
  const price = Math.round(basePrice * selectedTier.priceMultiplier);
  const visibleTiers = showAll ? PURCHASE_TIERS : PURCHASE_TIERS.slice(0, 3);

  return (
    <div className="sticky top-28 max-h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#1A3C2F]/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent bg-white border border-[#1A3C2F]/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(26,60,47,0.12)] p-6 sm:p-7">
      <h2 className="text-lg font-black text-[#1A3C2F] mb-1">Purchase Options</h2>
      <p className="text-xs text-[#1A3C2F]/50 mb-5">Choose the package that fits your needs</p>

      {/* Tier Selection */}
      <div className="space-y-2 mb-5">
        {visibleTiers.map((tier) => {
          const tierPrice = Math.round(basePrice * tier.priceMultiplier);
          const isSelected = selected === tier.id;
          return (
            <label
              key={tier.id}
              className={`flex items-center gap-3 cursor-pointer px-4 py-3.5 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-[#1A3C2F] bg-[#1A3C2F]/[0.04]"
                  : "border-[#1A3C2F]/10 hover:border-[#1A3C2F]/25 bg-white"
              }`}
            >
              <input
                type="radio"
                name="purchase_tier"
                value={tier.id}
                className="sr-only"
                checked={isSelected}
                onChange={() => setSelected(tier.id)}
              />

              {/* Radio dot */}
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected ? "border-[#1A3C2F]" : "border-[#1A3C2F]/25"
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-[#1A3C2F]" />}
              </div>

              {/* Label + description (grows) */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#1A3C2F] leading-tight">{tier.label}</span>
                  {tier.badge && (
                    <span className="text-[0.55rem] font-black uppercase tracking-wider bg-[#C4A35A] text-[#1A3C2F] px-2 py-0.5 rounded-full leading-none">
                      {tier.badge}
                    </span>
                  )}
                </div>
                <p className="text-[0.7rem] text-[#1A3C2F]/50 leading-relaxed mt-0.5 line-clamp-1">{tier.description}</p>
              </div>

              {/* Price (fixed right) */}
              <span className="text-sm font-extrabold text-[#1A3C2F] whitespace-nowrap flex-shrink-0 ml-1">
                {tierPrice === 0 ? "Free" : `₹${tierPrice.toLocaleString("en-IN")}`}
              </span>
            </label>
          );
        })}

        {/* Show more/less toggle */}
        <button
          onClick={() => setShowAll((v) => !v)}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1A3C2F]/45 hover:text-[#1A3C2F] transition-colors py-1.5"
        >
          {showAll ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Show fewer options</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> +{PURCHASE_TIERS.length - 3} more options</>
          )}
        </button>
      </div>


      {/* What's included in selected tier */}
      <div className="bg-[#1A3C2F]/[0.03] border border-[#1A3C2F]/8 rounded-2xl p-4 mb-5">
        <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/50 mb-2.5">
          Included in this package
        </p>
        <ul className="space-y-2">
          {selectedTier.includes.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-[#1A3C2F]/80">
              <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Price display */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-black text-[#1A3C2F]">
          {price === 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}
        </span>
        {selectedTier.priceMultiplier > 0 && selectedTier.priceMultiplier < 1 && (
          <span className="text-sm text-[#1A3C2F]/40 line-through">
            ₹{basePrice.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* Checkout */}
      <CheckoutButton
        productId={productId}
        licenseType={selected}
        productName={`${productName} — ${selectedTier.label}`}
      />

      <div className="text-center mb-5">
        <Link
          href="/eula"
          className="text-xs text-[#1A3C2F]/40 hover:text-[#C4A35A] transition-colors underline underline-offset-2"
        >
          Read End User License Agreement (EULA)
        </Link>
      </div>

      {/* Trust badges */}
      <div className="pt-4 border-t border-[#1A3C2F]/8 space-y-2.5">
        <div className="flex items-center gap-2.5 text-xs text-[#1A3C2F]/60">
          <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
          Secure Payment via Razorpay
        </div>
        <div className="flex items-center gap-2.5 text-xs text-[#1A3C2F]/60">
          <Download className="w-4 h-4 text-[#C4A35A] shrink-0" />
          Instant Digital Delivery after Payment
        </div>
      </div>
    </div>
  );
}
