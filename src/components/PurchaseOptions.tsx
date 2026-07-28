"use client";
import React, { useState } from "react";
import { ShieldCheck, Download, Check, Sparkles, ArrowRight, ListCheck, Zap } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./CheckoutButton";
import { claimFreeLicense } from "@/actions/payment";
import { useRouter } from "next/navigation";

export type PurchaseTierId = 
  | "STUDENT"
  | "COMMERCIAL"
  | "ENTERPRISE"
  | "SOURCE_CODE_ONLY"
  | "REPORT_WATERMARKED"
  | "REPORT_SUBMISSION"
  | "REPORT_EDITABLE"
  | "FIRMWARE_FLASH"
  | "PCB_DESIGN_FILES"
  | "CAD_3D_MODELS";

interface PurchaseOptionsProps {
  productId: string;
  productName: string;
  basePrice: number;
  purchasedTiers?: string[];
  selectedTierId?: string;
}

export function PurchaseOptions({ productId, productName, basePrice, purchasedTiers = [] }: PurchaseOptionsProps) {
  const router = useRouter();
  const [activatingFlash, setActivatingFlash] = useState(false);

  // Granular backend ownership indicators
  const hasFullAccess = purchasedTiers.some(t => ["STUDENT", "COMMERCIAL", "ENTERPRISE"].includes(t));
  const hasSourceAccess = hasFullAccess || purchasedTiers.includes("SOURCE_CODE_ONLY");
  const hasPcbAccess = hasFullAccess || purchasedTiers.includes("PCB_DESIGN_FILES");
  const hasCadAccess = hasFullAccess || purchasedTiers.includes("CAD_3D_MODELS");
  const hasFirmwareAccess = hasFullAccess || purchasedTiers.includes("FIRMWARE_FLASH");
  const hasWatermarkedReportAccess = hasFullAccess || purchasedTiers.some(t => ["REPORT_WATERMARKED", "REPORT_SUBMISSION", "REPORT_EDITABLE"].includes(t));
  const hasStudentReportAccess = hasFullAccess || purchasedTiers.some(t => ["REPORT_SUBMISSION", "REPORT_EDITABLE"].includes(t));
  const hasEditableReportAccess = hasFullAccess || purchasedTiers.includes("REPORT_EDITABLE");

  // Checklist state (Build Your Own Custom Package)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    code: !hasSourceAccess,
    pcb: !hasPcbAccess,
    cad: !hasCadAccess,
    flash: false,
    report: !hasWatermarkedReportAccess,
  });
  const [reportChoice, setReportChoice] = useState<"REPORT_WATERMARKED" | "REPORT_SUBMISSION" | "REPORT_EDITABLE">("REPORT_SUBMISSION");

  const isAlreadyPurchased = purchasedTiers.length > 0;

  // Auto unlock free firmware flash
  const handleUnlockFreeFlash = async () => {
    setActivatingFlash(true);
    const res = await claimFreeLicense(productId, "FIRMWARE_FLASH");
    setActivatingFlash(false);
    if (res.error) {
      if (res.error.includes("logged in")) {
        router.push("/login");
      } else {
        alert(res.error);
      }
    } else {
      router.refresh();
    }
  };

  // Dynamic price calculation for Custom Builder mode
  const calculateChecklistPrice = () => {
    let totalMult = 0;
    if (checkedItems.code && !hasSourceAccess) totalMult += 0.60;
    if (checkedItems.pcb && !hasPcbAccess) totalMult += 0.35;
    if (checkedItems.cad && !hasCadAccess) totalMult += 0.35;
    if (checkedItems.flash) totalMult += 0; // Firmware Flash License is FREE
    if (checkedItems.report) {
      if (reportChoice === "REPORT_WATERMARKED" && !hasWatermarkedReportAccess) totalMult += 0.30;
      else if (reportChoice === "REPORT_SUBMISSION" && !hasStudentReportAccess) totalMult += 0.40;
      else if (reportChoice === "REPORT_EDITABLE" && !hasEditableReportAccess) totalMult += 0.50;
    }
    if (totalMult === 0) return 0;
    const rawPrice = Math.round(basePrice * totalMult);
    return Math.min(rawPrice, basePrice);
  };

  const checklistPrice = calculateChecklistPrice();

  // Map checklist selection to license tier for Razorpay checkout
  const getChecklistLicenseType = (): PurchaseTierId => {
    if (checkedItems.code && checkedItems.pcb && checkedItems.cad) return "STUDENT";
    if (checkedItems.code && !checkedItems.pcb && !checkedItems.cad && !checkedItems.flash && !checkedItems.report) return "SOURCE_CODE_ONLY";
    if (checkedItems.pcb && !checkedItems.code && !checkedItems.cad && !checkedItems.flash && !checkedItems.report) return "PCB_DESIGN_FILES";
    if (checkedItems.cad && !checkedItems.code && !checkedItems.pcb && !checkedItems.flash && !checkedItems.report) return "CAD_3D_MODELS";
    if (checkedItems.flash && !checkedItems.code && !checkedItems.pcb && !checkedItems.cad && !checkedItems.report) return "FIRMWARE_FLASH";
    if (checkedItems.report && !checkedItems.code && !checkedItems.pcb && !checkedItems.cad && !checkedItems.flash) return reportChoice;
    return "STUDENT";
  };

  const selectAllChecklist = () => {
    setCheckedItems({ code: true, pcb: true, cad: true, flash: true, report: true });
  };

  const finalLicenseType = getChecklistLicenseType();
  const allSelectedItemsUnlocked = 
    (!checkedItems.code || hasSourceAccess) &&
    (!checkedItems.pcb || hasPcbAccess) &&
    (!checkedItems.cad || hasCadAccess) &&
    (!checkedItems.report || (
      reportChoice === "REPORT_WATERMARKED" ? hasWatermarkedReportAccess :
      reportChoice === "REPORT_SUBMISSION" ? hasStudentReportAccess :
      hasEditableReportAccess
    ));

  return (
    <div className="bg-white border border-[#1A3C2F]/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(26,60,47,0.12)] p-6 sm:p-7" id="purchase-options">
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-[#1A3C2F]">Purchase Options</h2>
          <p className="text-xs text-[#1A3C2F]/50 mt-0.5">Build custom package by selecting components</p>
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

      {/* ── CUSTOM BUILDER CHECKLIST (PRIMARY INTERFACE) ── */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between bg-[#FAF8F5] p-3 rounded-2xl border border-[#1A3C2F]/10">
          <span className="text-xs font-bold text-[#1A3C2F] flex items-center gap-1.5">
            <ListCheck className="w-4 h-4 text-[#C4A35A]" /> Custom Builder
          </span>
          <button
            onClick={selectAllChecklist}
            className="text-xs font-black text-[#C4A35A] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" /> Select All (₹{basePrice})
          </button>
        </div>

        {/* 1. Source Code */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#1A3C2F]/10 bg-white hover:border-[#1A3C2F]/20 transition-all">
          <input
            type="checkbox"
            checked={checkedItems.code || hasSourceAccess}
            disabled={hasSourceAccess}
            onChange={(e) => setCheckedItems((s) => ({ ...s, code: e.target.checked }))}
            className="w-4 h-4 accent-[#1A3C2F] rounded cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1A3C2F]">Firmware Source Code & Libraries</span>
              {hasSourceAccess && (
                <span className="text-[0.6rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> UNLOCKED
                </span>
              )}
            </div>
            <p className="text-[0.65rem] text-[#1A3C2F]/50">Complete Arduino / ESP32 code & setup guide</p>
          </div>
          {hasSourceAccess ? (
            <a
              href={`/api/download?productId=${productId}&fileType=sourceCode`}
              download
              className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0"
            >
              <Download className="w-3 h-3 text-[#C4A35A]" /> Download
            </a>
          ) : (
            <span className="text-xs font-black text-[#1A3C2F]">₹{Math.round(basePrice * 0.60)}</span>
          )}
        </div>

        {/* 2. PCB Files */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#1A3C2F]/10 bg-white hover:border-[#1A3C2F]/20 transition-all">
          <input
            type="checkbox"
            checked={checkedItems.pcb || hasPcbAccess}
            disabled={hasPcbAccess}
            onChange={(e) => setCheckedItems((s) => ({ ...s, pcb: e.target.checked }))}
            className="w-4 h-4 accent-[#1A3C2F] rounded cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1A3C2F]">PCB Design Files (Gerber & 3D)</span>
              {hasPcbAccess && (
                <span className="text-[0.6rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> UNLOCKED
                </span>
              )}
            </div>
            <p className="text-[0.65rem] text-[#1A3C2F]/50">RS-274X Gerber ZIP & 3D PCB layout</p>
          </div>
          {hasPcbAccess ? (
            <a
              href={`/api/download?productId=${productId}&fileType=pcbFile`}
              download
              className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0"
            >
              <Download className="w-3 h-3 text-[#C4A35A]" /> Download
            </a>
          ) : (
            <span className="text-xs font-black text-[#1A3C2F]">₹{Math.round(basePrice * 0.35)}</span>
          )}
        </div>

        {/* 3. CAD 3D Models */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#1A3C2F]/10 bg-white hover:border-[#1A3C2F]/20 transition-all">
          <input
            type="checkbox"
            checked={checkedItems.cad || hasCadAccess}
            disabled={hasCadAccess}
            onChange={(e) => setCheckedItems((s) => ({ ...s, cad: e.target.checked }))}
            className="w-4 h-4 accent-[#1A3C2F] rounded cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1A3C2F]">CAD 3D Models & Assembly</span>
              {hasCadAccess && (
                <span className="text-[0.6rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> UNLOCKED
                </span>
              )}
            </div>
            <p className="text-[0.65rem] text-[#1A3C2F]/50">Multi-part STL assembly & enclosure models</p>
          </div>
          {hasCadAccess ? (
            <a
              href={`/api/download?productId=${productId}&fileType=cadFile`}
              download
              className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0"
            >
              <Download className="w-3 h-3 text-[#C4A35A]" /> Download
            </a>
          ) : (
            <span className="text-xs font-black text-[#1A3C2F]">₹{Math.round(basePrice * 0.35)}</span>
          )}
        </div>

        {/* 4. Firmware Flash License (Always FREE) */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#1A3C2F]/10 bg-white hover:border-[#1A3C2F]/20 transition-all">
          <input
            type="checkbox"
            checked={checkedItems.flash || hasFirmwareAccess}
            disabled={hasFirmwareAccess}
            onChange={(e) => setCheckedItems((s) => ({ ...s, flash: e.target.checked }))}
            className="w-4 h-4 accent-[#1A3C2F] rounded cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1A3C2F]">Firmware Flash License</span>
              <span className="text-[0.6rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                {hasFirmwareAccess ? <><Check className="w-2.5 h-2.5" /> UNLOCKED</> : "FREE"}
              </span>
            </div>
            <p className="text-[0.65rem] text-[#1A3C2F]/50">Flash verified firmware directly via WebUSB</p>
          </div>
          {hasFirmwareAccess ? (
            <Link
              href="/dashboard"
              className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0"
            >
              <Zap className="w-3 h-3 text-[#C4A35A]" /> Flasher
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleUnlockFreeFlash}
              disabled={activatingFlash}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {activatingFlash ? "Activating..." : "Activate Free"}
            </button>
          )}
        </div>

        {/* 5. Report Options Sub-Card */}
        <div className="p-3.5 rounded-2xl border border-[#1A3C2F]/10 bg-[#FAF8F5] space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems.report}
              onChange={(e) => setCheckedItems((s) => ({ ...s, report: e.target.checked }))}
              className="w-4 h-4 accent-[#1A3C2F] rounded cursor-pointer"
            />
            <span className="text-xs font-bold text-[#1A3C2F]">Project Documentation & Report</span>
          </label>

          {checkedItems.report && (
            <div className="ml-7 space-y-1.5 pt-1">

              {/* 5a. Watermarked Printable PDF */}
              <div className="flex items-center gap-2 text-xs text-[#1A3C2F]/80 p-1.5 rounded-xl hover:bg-white transition-all">
                <input
                  type="radio"
                  name="report_type"
                  checked={reportChoice === "REPORT_WATERMARKED"}
                  onChange={() => setReportChoice("REPORT_WATERMARKED")}
                  className="accent-[#1A3C2F] cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Watermarked Printable PDF</span>
                    {hasWatermarkedReportAccess && (
                      <span className="text-[0.6rem] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-[0.6rem] text-[#1A3C2F]/50">Printable PDF with Creato4 watermark</p>
                </div>
                {hasWatermarkedReportAccess ? (
                  <a
                    href={`/api/download?productId=${productId}&fileType=reportWatermarked`}
                    download
                    className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shrink-0"
                  >
                    <Download className="w-3 h-3 text-[#C4A35A]" /> Download PDF
                  </a>
                ) : (
                  <span className="font-bold">₹{Math.round(basePrice * 0.30)}</span>
                )}
              </div>

              {/* 5b. Personalized Student PDF */}
              <div className="flex items-center gap-2 text-xs text-[#1A3C2F]/80 p-1.5 rounded-xl hover:bg-white transition-all">
                <input
                  type="radio"
                  name="report_type"
                  checked={reportChoice === "REPORT_SUBMISSION"}
                  onChange={() => setReportChoice("REPORT_SUBMISSION")}
                  className="accent-[#1A3C2F] cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A3C2F]">Personalized Student PDF</span>
                    {hasStudentReportAccess && (
                      <span className="text-[0.6rem] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-[0.6rem] text-[#1A3C2F]/50">Student Name & College in Footer</p>
                </div>
                {hasStudentReportAccess ? (
                  <a
                    href={`/api/download?productId=${productId}&fileType=reportSubmission`}
                    download
                    className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shrink-0"
                  >
                    <Download className="w-3 h-3 text-[#C4A35A]" /> Download PDF
                  </a>
                ) : (
                  <span className="font-bold">₹{Math.round(basePrice * 0.40)}</span>
                )}
              </div>

              {/* 5c. Editable Word & PPT */}
              <div className="flex items-center gap-2 text-xs text-[#1A3C2F]/80 p-1.5 rounded-xl hover:bg-white transition-all">
                <input
                  type="radio"
                  name="report_type"
                  checked={reportChoice === "REPORT_EDITABLE"}
                  onChange={() => setReportChoice("REPORT_EDITABLE")}
                  className="accent-[#1A3C2F] cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Editable Word & PPT</span>
                    {hasEditableReportAccess && (
                      <span className="text-[0.6rem] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-[0.6rem] text-[#1A3C2F]/50">Fully editable DOCX & PPTX files</p>
                </div>
                {hasEditableReportAccess ? (
                  <a
                    href={`/api/download?productId=${productId}&fileType=reportEditable`}
                    download
                    className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shrink-0"
                  >
                    <Download className="w-3 h-3 text-[#C4A35A]" /> Download PPT/Word
                  </a>
                ) : (
                  <span className="font-bold">₹{Math.round(basePrice * 0.50)}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Price Display */}
      <div className="flex items-baseline gap-2 mb-4 pt-2 border-t border-[#1A3C2F]/10">
        <span className="text-3xl font-black text-[#1A3C2F]">
          {allSelectedItemsUnlocked
            ? "Unlocked"
            : checklistPrice === 0
            ? "Free"
            : `₹${checklistPrice.toLocaleString("en-IN")}`}
        </span>
        {!allSelectedItemsUnlocked && checklistPrice < basePrice && checklistPrice > 0 && (
          <span className="text-sm text-[#1A3C2F]/40 line-through">
            ₹{basePrice.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* Checkout or Access Button */}
      {allSelectedItemsUnlocked ? (
        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center gap-2 bg-[#1A3C2F] hover:bg-[#C4A35A] hover:text-[#1A3C2F] text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md mb-4"
        >
          <Download className="w-4 h-4 text-[#C4A35A]" /> Access Downloads in Dashboard
        </Link>
      ) : (
        <CheckoutButton
          productId={productId}
          licenseType={finalLicenseType}
          productName={`${productName} — Custom Package`}
          price={checklistPrice}
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
          {checklistPrice === 0 ? "Instant Free Activation on your account" : "Secure Payment via Razorpay"}
        </div>
        <div className="flex items-center gap-2.5 text-xs text-[#1A3C2F]/60">
          <Download className="w-4 h-4 text-[#C4A35A] shrink-0" />
          {checklistPrice === 0 ? "Instant Flasher & Dashboard Access" : "Instant Digital Delivery after Payment"}
        </div>
      </div>
    </div>
  );
}
