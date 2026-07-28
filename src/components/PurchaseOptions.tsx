"use client";
import React, { useState } from "react";
import { ShieldCheck, Download, Check, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./CheckoutButton";

type PurchaseTier = {
  id: "STUDENT" | "COMMERCIAL" | "ENTERPRISE" | "SOURCE_CODE_ONLY" | "REPORT_SUBMISSION" | "REPORT_EDITABLE" | "FIRMWARE_FLASH" | "PCB_DESIGN_FILES" | "CAD_3D_MODELS";
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
      "PCB Design Files (Gerber & 3D)",
      "CAD / 3D Assembly Models",
      "Bill of Materials (BOM)",
      "Complete Documentation",
    ],
    priceMultiplier: 1.0,
  },
  {
    id: "PCB_DESIGN_FILES",
    label: "PCB Design Files (Gerber & 3D)",
    description: "Production RS-274X Gerber & 3D PCB layout files.",
    includes: [
      "Top & Bottom Copper Gerber Files",
      "Silkscreen & Solder Mask Layers",
      "NC Drill & Board Outline (.DRL/.GKO)",
      "3D PCB Layout Files",
    ],
    priceMultiplier: 0.35,
  },
  {
    id: "CAD_3D_MODELS",
    label: "CAD 3D Models & Assembly",
    description: "Complete 3D CAD assembly & enclosure STL models.",
    includes: [
      "Multi-part STL 3D Assembly Package",
      "Step-by-step CAD Enclosure Files",
      "Compatible with Fusion 360 / SolidWorks",
    ],
    priceMultiplier: 0.35,
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
  purchasedTiers?: string[];
  selectedTierId?: string;
}

export function PurchaseOptions({ productId, productName, basePrice, purchasedTiers = [], selectedTierId }: PurchaseOptionsProps) {
  const [selected, setSelected] = useState<PurchaseTier["id"]>((selectedTierId as any) || "STUDENT");
  const [showAll, setShowAll] = useState(false);

  const isAlreadyPurchased = purchasedTiers.length > 0;
  const isSelectedPurchased = purchasedTiers.includes(selected) || purchasedTiers.some(t => ["STUDENT", "COMMERCIAL", "ENTERPRISE"].includes(t));

  const selectedTier = PURCHASE_TIERS.find((t) => t.id === selected)!;
  const price = Math.round(basePrice * selectedTier.priceMultiplier);
  const visibleTiers = showAll ? PURCHASE_TIERS : PURCHASE_TIERS.slice(0, 3);

  return (
    <div className="bg-white border border-[#1A3C2F]/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(26,60,47,0.12)] p-6 sm:p-7" id="purchase-options">
      <h2 className="text-lg font-black text-[#1A3C2F] mb-1">Purchase Options</h2>
      <p className="text-xs text-[#1A3C2F]/50 mb-5">Choose the package that fits your needs</p>

      {/* Purchased Banner */}
      {isAlreadyPurchased && (
        <div className="mb-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-wider text-emerald-100">Purchased & Active</p>
              <p className="text-xs font-bold text-white">License unlocked on your account</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all shrink-0">
            Dashboard ➔
          </Link>
        </div>
      )}

      {/* Tier Selection */}
      <div className="space-y-2 mb-5">
        {visibleTiers.map((tier) => {
          const tierPrice = Math.round(basePrice * tier.priceMultiplier);
          const isSelected = selected === tier.id;
          const isTierPurchased = purchasedTiers.includes(tier.id) || purchasedTiers.some(t => ["STUDENT", "COMMERCIAL", "ENTERPRISE"].includes(t));
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
                  {isTierPurchased ? (
                    <span className="text-[0.55rem] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full leading-none flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Unlocked
                    </span>
                  ) : tier.badge && (
                    <span className="text-[0.55rem] font-black uppercase tracking-wider bg-[#C4A35A] text-[#1A3C2F] px-2 py-0.5 rounded-full leading-none">
                      {tier.badge}
                    </span>
                  )}
                </div>
                <p className="text-[0.7rem] text-[#1A3C2F]/50 leading-relaxed mt-0.5 line-clamp-1">{tier.description}</p>
              </div>

              {/* Price (fixed right) */}
              <span className="text-sm font-extrabold text-[#1A3C2F] whitespace-nowrap flex-shrink-0 ml-1">
                {isTierPurchased ? "Unlocked" : tierPrice === 0 ? "Free" : `₹${tierPrice.toLocaleString("en-IN")}`}
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
          {isSelectedPurchased ? "Unlocked" : price === 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}
        </span>
        {!isSelectedPurchased && selectedTier.priceMultiplier > 0 && selectedTier.priceMultiplier < 1 && (
          <span className="text-sm text-[#1A3C2F]/40 line-through">
            ₹{basePrice.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* Checkout or Access Button */}
      {isSelectedPurchased ? (
        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center gap-2 bg-[#1A3C2F] hover:bg-[#C4A35A] hover:text-[#1A3C2F] text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md mb-4"
        >
          <Download className="w-4 h-4 text-[#C4A35A]" /> Download Files in Dashboard
        </Link>
      ) : (
        <CheckoutButton
          productId={productId}
          licenseType={selected}
          productName={`${productName} — ${selectedTier.label}`}
          price={price}
        />
      )}

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
          {price === 0 ? "Instant Free Activation on your account" : "Secure Payment via Razorpay"}
        </div>
        <div className="flex items-center gap-2.5 text-xs text-[#1A3C2F]/60">
          <Download className="w-4 h-4 text-[#C4A35A] shrink-0" />
          {price === 0 ? "Instant Flasher & Dashboard Access" : "Instant Digital Delivery after Payment"}
        </div>
      </div>
    </div>
  );
}
