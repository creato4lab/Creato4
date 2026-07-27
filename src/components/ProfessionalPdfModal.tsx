"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, FileText, CheckCircle, ShieldCheck, Download, Loader2, Sparkles, Building2, Users, Type } from "lucide-react";

interface ProfessionalPdfModalProps {
  licenseId: string;
  defaultTitle: string;
  defaultCustomerName: string;
  onClose: () => void;
}

export function ProfessionalPdfModal({
  licenseId,
  defaultTitle,
  defaultCustomerName,
  onClose,
}: ProfessionalPdfModalProps) {
  const [customerName, setCustomerName] = useState(defaultCustomerName || "");
  const [teamName, setTeamName] = useState("");
  const [college, setCollege] = useState("");
  const [customProjectTitle, setCustomProjectTitle] = useState(defaultTitle || "");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseId,
          type: "professional",
          customerName: customerName.trim() || defaultCustomerName,
          teamName: teamName.trim() || undefined,
          college: college.trim() || undefined,
          customProjectTitle: customProjectTitle.trim() || defaultTitle,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Failed to generate PDF");
        setIsGenerating(false);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = `${(customProjectTitle || defaultTitle).replace(/[^a-z0-9]/gi, "_").toLowerCase()}_professional.pdf`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setIsGenerating(false);
      onClose();
    } catch (err) {
      console.error("Error generating professional PDF:", err);
      alert("Error generating PDF document. Please try again.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#1A3C2F]/10"
      >
        {/* Header */}
        <div className="bg-[#1A3C2F] p-6 text-white relative">
          <div className="flex items-center gap-2.5 mb-1.5">
            <Sparkles className="w-5 h-5 text-[#C4A35A]" />
            <h2 className="font-black text-lg text-white">Professional Version PDF</h2>
          </div>
          <p className="text-xs text-white/70">
            Generate a clean, watermark-free report customized with your details.
          </p>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature badge banner */}
        <div className="bg-amber-50 border-b border-amber-200/60 px-6 py-3 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <p className="text-xs text-amber-900 leading-snug">
            <strong>No Watermark:</strong> Embedded with official license metadata, ready for academic or commercial submission.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#1A3C2F] uppercase tracking-wider mb-1">
              <Type className="w-3.5 h-3.5 text-[#C4A35A]" /> What name should appear on the report?
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rahul Patel"
              className="w-full border border-[#1A3C2F]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#1A3C2F] uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5 text-[#C4A35A]" /> Team / Group Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder='e.g. "RoboTech Squad" or "Individual Project"'
              className="w-full border border-[#1A3C2F]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#1A3C2F] uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5 text-[#C4A35A]" /> College / University / Organization
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. IIT Bombay / Nirma University"
              className="w-full border border-[#1A3C2F]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#1A3C2F] uppercase tracking-wider mb-1">
              <FileText className="w-3.5 h-3.5 text-[#C4A35A]" /> Project Title
            </label>
            <input
              type="text"
              required
              value={customProjectTitle}
              onChange={(e) => setCustomProjectTitle(e.target.value)}
              placeholder="e.g. IoT Weather Station & Microclimate Hub"
              className="w-full border border-[#1A3C2F]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#1A3C2F]/15 rounded-2xl text-sm font-semibold text-[#1A3C2F]/70 hover:bg-[#1A3C2F]/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-[2] flex items-center justify-center gap-2 py-3 bg-[#1A3C2F] text-white rounded-2xl text-sm font-bold hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download Professional PDF
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
