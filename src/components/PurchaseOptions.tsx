"use client";
import React, { useState } from "react";
import { ShieldCheck, Download, Check, ChevronDown, ChevronUp, Layers, ListCheck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./CheckoutButton";

type PurchaseTier = {
  id: "STUDENT" | "COMMERCIAL" | "ENTERPRISE" | "SOURCE_CODE_ONLY" | "REPORT_WATERMARKED" | "REPORT_SUBMISSION" | "REPORT_EDITABLE" | "FIRMWARE_FLASH" | "PCB_DESIGN_FILES" | "CAD_3D_MODELS";
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
    description: "Everything included — Source code, PCB Gerber, 3D CAD & Report.",
    includes: [
      "Full Source Code & Firmware",
      "Circuit Diagrams & Schematics",
      "PCB Design Files (Gerber & 3D)",
      "CAD / 3D Assembly Models",
      "Bill of Materials (BOM)",
      "Complete Documentation & Reports",
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
    id: "REPORT_WATERMARKED",
    label: "Watermarked Printable PDF Report",
    description: "Printable PDF with Creato4 Lab watermark footer.",
    includes: [
      "Formatted Printable PDF Report",
      "Abstract, Chapters & References",
      "Creato4 Lab watermark footer",
    ],
    priceMultiplier: 0.3,
  },
  {
    id: "REPORT_SUBMISSION",
    label: "Personalized Student PDF Report",
    badge: "Student Fav",
    description: "Customized PDF with Student Name & College in footer.",
    includes: [
      "Personalized Student & Author Name embedded",
      "College & Team Title in Header/Footer",
      "Watermark-Free Clean PDF",
    ],
    priceMultiplier: 0.4,
  },
  {
    id: "REPORT_EDITABLE",
    label: "Editable Word & PPT Report",
    description: "Fully editable Word (.docx) & PowerPoint (.pptx) files.",
    includes: [
      "DOCX (Microsoft Word editable source)",
      "PPTX (PowerPoint Presentation Slides)",
      "PDF Final Output",
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
  const [mode, setMode] = useState<"preset" | "checklist">("preset");
  const [selected, setSelected] = useState<PurchaseTier["id"]>((selectedTierId as any) || "STUDENT");
  const [showAll, setShowAll] = useState(false);

  // Checklist state (Build Your Own)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    code: true,
    pcb: true,
    cad: true,
    report: true,
  });
  const [reportChoice, setReportChoice] = useState<"REPORT_WATERMARKED" | "REPORT_SUBMISSION" | "REPORT_EDITABLE">("REPORT_SUBMISSION");

  const isAlreadyPurchased = purchasedTiers.length > 0;
  const hasFullAccess = purchasedTiers.some(t => ["STUDENT", "COMMERCIAL", "ENTERPRISE"].includes(t));

  const isSelectedPurchased = hasFullAccess || purchasedTiers.includes(selected);

  const selectedTier = PURCHASE_TIERS.find((t) => t.id === selected)!;
  const price = Math.round(basePrice * selectedTier.priceMultiplier);
  const visibleTiers = showAll ? PURCHASE_TIERS : PURCHASE_TIERS.slice(0, 4);

  // Dynamic price calculation for Checklist mode
  const calculateChecklistPrice = () => {
    if (checkedItems.code && checkedItems.pcb && checkedItems.cad && checkedItems.report) {
      return basePrice; // Capped at complete project price
    }
    let totalMult = 0;
    if (checkedItems.code) totalMult += 0.6;
    if (checkedItems.pcb) totalMult += 0.35;
    if (checkedItems.cad) totalMult += 0.35;
    if (checkedItems.report) {
      if (reportChoice === "REPORT_WATERMARKED") totalMult += 0.3;
      else if (reportChoice === "REPORT_SUBMISSION") totalMult += 0.4;
      else totalMult += 0.5;
    }
    const rawPrice = Math.round(basePrice * totalMult);
    return Math.min(rawPrice, basePrice);
  };

  const checklistPrice = calculateChecklistPrice();

  // Map checklist selection to closest license tier for Razorpay checkout
  const getChecklistLicenseType = (): PurchaseTier["id"] => {
    if (checkedItems.code && checkedItems.pcb && checkedItems.cad) return "STUDENT";
    if (checkedItems.code && !checkedItems.pcb && !checkedItems.cad) return "SOURCE_CODE_ONLY";
    if (checkedItems.pcb && !checkedItems.code) return "PCB_DESIGN_FILES";
    if (checkedItems.cad && !checkedItems.code) return "CAD_3D_MODELS";
    if (checkedItems.report) return reportChoice;
    return "STUDENT";
  };

  const selectAllChecklist = () => {
    setCheckedItems({ code: true, pcb: true, cad: true, report: true });
    setSelected("STUDENT");
  };

  return (
    <div className="bg-white border border-[#1A3C2F]/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(26,60,47,0.12)] p-6 sm:p-7" id="purchase-options">
      
      {/* Top Header & Mode Toggle */}
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div>
          <h2 className="text-lg font-black text-[#1A3C2F]">Purchase Options</h2>
          <p className="text-xs text-[#1A3C2F]/50">Choose a package or build custom</p>
        </div>

        <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#1A3C2F]/10">
          <button
            onClick={() => setMode("preset")}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              mode === "preset"
                ? "bg-[#1A3C2F] text-white shadow-sm"
                : "text-[#1A3C2F]/60 hover:text-[#1A3C2F]"
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#C4A35A]" /> Packages
          </button>
          <button
            onClick={() => setMode("checklist")}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              mode === "checklist"
                ? "bg-[#1A3C2F] text-white shadow-sm"
                : "text-[#1A3C2F]/60 hover:text-[#1A3C2F]"
            }`}
          >
            <ListCheck className="w-3 h-3 text-[#C4A35A]" /> Custom
          </button>
        </div>
      </div>

      {/* Active Account Purchase Banner */}
      {isAlreadyPurchased && (
        <div className="mb-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-black uppercase tracking-wider text-emerald-100">Purchased & Active</p>
              <p className="text-xs font-bold text-white truncate">License active on your account</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1">
            Dashboard <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* ── MODE 1: PACKAGE PRESETS ── */}
      {mode === "preset" ? (
        <>
          <div className="space-y-2 mb-5">
            {visibleTiers.map((tier) => {
              const tierPrice = Math.round(basePrice * tier.priceMultiplier);
              const isSelected = selected === tier.id;
              const isTierUnlocked = hasFullAccess || purchasedTiers.includes(tier.id);

              return (
                <div
                  key={tier.id}
                  onClick={() => {
                    if (isTierUnlocked) {
                      window.location.href = "/dashboard";
                    } else {
                      setSelected(tier.id);
                    }
                  }}
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

                  {/* Radio dot or Check */}
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isTierUnlocked
                      ? "border-emerald-600 bg-emerald-50"
                      : isSelected
                      ? "border-[#1A3C2F]"
                      : "border-[#1A3C2F]/25"
                  }`}>
                    {isTierUnlocked ? (
                      <Check className="w-3 h-3 text-emerald-600 font-black" />
                    ) : (
                      isSelected && <div className="w-2 h-2 rounded-full bg-[#1A3C2F]" />
                    )}
                  </div>

                  {/* Label & Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#1A3C2F] leading-tight">{tier.label}</span>
                      {isTierUnlocked ? (
                        <Link
                          href="/dashboard"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[0.55rem] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full leading-none flex items-center gap-1 hover:bg-emerald-200"
                        >
                          <Check className="w-2.5 h-2.5" /> Unlocked ➔
                        </Link>
                      ) : tier.badge && (
                        <span className="text-[0.55rem] font-black uppercase tracking-wider bg-[#C4A35A] text-[#1A3C2F] px-2 py-0.5 rounded-full leading-none">
                          {tier.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[0.7rem] text-[#1A3C2F]/50 leading-relaxed mt-0.5 line-clamp-1">{tier.description}</p>
                  </div>

                  {/* Price column / Direct Dashboard link */}
                  {isTierUnlocked ? (
                    <Link
                      href="/dashboard"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-black text-emerald-700 hover:text-emerald-900 underline underline-offset-2 flex items-center gap-1 shrink-0"
                    >
                      Dashboard ➔
                    </Link>
                  ) : (
                    <span className="text-sm font-extrabold text-[#1A3C2F] whitespace-nowrap flex-shrink-0 ml-1">
                      {tierPrice === 0 ? "Free" : `₹${tierPrice.toLocaleString("en-IN")}`}
                    </span>
                  )}
                </div>
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
                <><ChevronDown className="w-3.5 h-3.5" /> +{PURCHASE_TIERS.length - 4} more options</>
              )}
            </button>
          </div>

          {/* Included Features */}
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
        </>
      ) : (
        /* ── MODE 2: BUILD YOUR OWN CHECKLIST ── */
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between bg-[#FAF8F5] p-3 rounded-2xl border border-[#1A3C2F]/10">
            <span className="text-xs font-bold text-[#1A3C2F]">Custom Builder</span>
            <button
              onClick={selectAllChecklist}
              className="text-xs font-black text-[#C4A35A] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Select All (Save Big ₹{basePrice})
            </button>
          </div>

          {/* Checklist options */}
          <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#1A3C2F]/10 bg-white hover:border-[#1A3C2F]/20 cursor-pointer transition-all">
            <input
              type="checkbox"
              checked={checkedItems.code}
              onChange={(e) => setCheckedItems((s) => ({ ...s, code: e.target.checked }))}
              className="w-4 h-4 accent-[#1A3C2F] rounded"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#1A3C2F]">Firmware Source Code & Libraries</span>
              <p className="text-[0.65rem] text-[#1A3C2F]/50">Complete Arduino / ESP32 code & setup guide</p>
            </div>
            <span className="text-xs font-black text-[#1A3C2F]">₹{Math.round(basePrice * 0.6)}</span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#1A3C2F]/10 bg-white hover:border-[#1A3C2F]/20 cursor-pointer transition-all">
            <input
              type="checkbox"
              checked={checkedItems.pcb}
              onChange={(e) => setCheckedItems((s) => ({ ...s, pcb: e.target.checked }))}
              className="w-4 h-4 accent-[#1A3C2F] rounded"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#1A3C2F]">PCB Design Files (Gerber & 3D)</span>
              <p className="text-[0.65rem] text-[#1A3C2F]/50">RS-274X Gerber ZIP & 3D PCB layout</p>
            </div>
            <span className="text-xs font-black text-[#1A3C2F]">₹{Math.round(basePrice * 0.35)}</span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#1A3C2F]/10 bg-white hover:border-[#1A3C2F]/20 cursor-pointer transition-all">
            <input
              type="checkbox"
              checked={checkedItems.cad}
              onChange={(e) => setCheckedItems((s) => ({ ...s, cad: e.target.checked }))}
              className="w-4 h-4 accent-[#1A3C2F] rounded"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#1A3C2F]">CAD 3D Models & Assembly</span>
              <p className="text-[0.65rem] text-[#1A3C2F]/50">Multi-part STL assembly & enclosure models</p>
            </div>
            <span className="text-xs font-black text-[#1A3C2F]">₹{Math.round(basePrice * 0.35)}</span>
          </label>

          {/* Report Choice Sub-Card */}
          <div className="p-3.5 rounded-2xl border border-[#1A3C2F]/10 bg-[#FAF8F5] space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkedItems.report}
                onChange={(e) => setCheckedItems((s) => ({ ...s, report: e.target.checked }))}
                className="w-4 h-4 accent-[#1A3C2F] rounded"
              />
              <span className="text-xs font-bold text-[#1A3C2F]">Project Documentation & Report</span>
            </label>

            {checkedItems.report && (
              <div className="ml-7 space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1A3C2F]/80 p-1.5 rounded-xl hover:bg-white transition-all">
                  <input
                    type="radio"
                    name="report_type"
                    checked={reportChoice === "REPORT_WATERMARKED"}
                    onChange={() => setReportChoice("REPORT_WATERMARKED")}
                    className="accent-[#1A3C2F]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold">Watermarked PDF Report</span>
                    <p className="text-[0.6rem] text-[#1A3C2F]/50">Printable PDF with Creato4 watermark</p>
                  </div>
                  <span className="font-bold">₹{Math.round(basePrice * 0.3)}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1A3C2F]/80 p-1.5 rounded-xl hover:bg-white transition-all">
                  <input
                    type="radio"
                    name="report_type"
                    checked={reportChoice === "REPORT_SUBMISSION"}
                    onChange={() => setReportChoice("REPORT_SUBMISSION")}
                    className="accent-[#1A3C2F]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#1A3C2F]">Personalized Student PDF</span>
                    <p className="text-[0.6rem] text-[#1A3C2F]/50">Student Name & College in Footer</p>
                  </div>
                  <span className="font-bold">₹{Math.round(basePrice * 0.4)}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1A3C2F]/80 p-1.5 rounded-xl hover:bg-white transition-all">
                  <input
                    type="radio"
                    name="report_type"
                    checked={reportChoice === "REPORT_EDITABLE"}
                    onChange={() => setReportChoice("REPORT_EDITABLE")}
                    className="accent-[#1A3C2F]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold">Editable Word & PPT</span>
                    <p className="text-[0.6rem] text-[#1A3C2F]/50">Fully editable DOCX & PPTX files</p>
                  </div>
                  <span className="font-bold">₹{Math.round(basePrice * 0.5)}</span>
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price display */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-black text-[#1A3C2F]">
          {isSelectedPurchased
            ? "Unlocked"
            : mode === "checklist"
            ? `₹${checklistPrice.toLocaleString("en-IN")}`
            : price === 0
            ? "Free"
            : `₹${price.toLocaleString("en-IN")}`}
        </span>
        {!isSelectedPurchased && mode === "preset" && selectedTier.priceMultiplier > 0 && selectedTier.priceMultiplier < 1 && (
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
          licenseType={mode === "checklist" ? getChecklistLicenseType() : selected}
          productName={`${productName} — ${mode === "checklist" ? "Custom Package" : selectedTier.label}`}
          price={mode === "checklist" ? checklistPrice : price}
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
