"use client";

/**
 * LicenseCard.tsx
 *
 * Displays a single license in the dashboard with:
 * - License type badge and key
 * - Product title and purchase date
 * - Device activations list (with remove button)
 * - "Connect Board" button (for device activation)
 * - "Flash Firmware" button (only for FIRMWARE_FLASH licenses)
 * - Download button (for all other non-firmware licenses)
 */

import React, { useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Key, Cpu, Download, Loader2, Zap, Trash2, ChevronDown, ChevronUp,
  CheckCircle, Clock, Shield, UploadCloud, Box, FileText, FileSpreadsheet, Sparkles
} from "lucide-react";
import { BoardConnector } from "@/components/BoardConnector";
import { FirmwareFlasher } from "@/components/FirmwareFlasher";
import { removeDevice } from "@/actions/license";
import { generateDownloadUrl } from "@/actions/download";

// ─── Type mirroring the DB shape (serialized from server) ────────────────────
interface Activation {
  id: string;
  chipId: string;
  boardType: string;
  nickname: string | null;
  isActive: boolean;
  lastSeenAt: string; // ISO string after JSON serialization
  createdAt: string;
}

interface License {
  id: string;
  licenseKey: string;
  type: string;
  createdAt: string;
  maxActivations: number;
  isActive: boolean;
  product: {
    id: string;
    title: string;
    slug: string;
    firmwareBinPath: string | null;
    firmwareUf2Path: string | null;
    firmwareBuildVersion: string | null;
  };
  activations: Activation[];
}

interface Props {
  license: License;
}

const LICENSE_TYPE_LABELS: Record<string, string> = {
  STUDENT:           "Student",
  COMMERCIAL:        "Commercial",
  ENTERPRISE:        "Enterprise",
  SOURCE_CODE_ONLY:  "Source Code",
  REPORT_SUBMISSION: "Report (Submission)",
  REPORT_EDITABLE:   "Report (Editable)",
  FIRMWARE_FLASH:    "Firmware Flash",
};

const LICENSE_TYPE_COLORS: Record<string, string> = {
  STUDENT:           "bg-[#1A3C2F] text-white",
  COMMERCIAL:        "bg-purple-100 text-purple-700",
  ENTERPRISE:        "bg-amber-100 text-amber-700",
  SOURCE_CODE_ONLY:  "bg-teal-100 text-teal-700",
  REPORT_SUBMISSION: "bg-green-100 text-green-700",
  REPORT_EDITABLE:   "bg-emerald-100 text-emerald-700",
  FIRMWARE_FLASH:    "bg-orange-100 text-orange-700",
};

export function LicenseCard({ license }: Props) {
  const [showActivations, setShowActivations] = useState(false);
  const [showConnector, setShowConnector] = useState(false);
  const [showFlasher, setShowFlasher] = useState(false);
  const [activations, setActivations] = useState<Activation[]>(license.activations);
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isFirmware = license.type === "FIRMWARE_FLASH";
  const isUf2 = !!license.product.firmwareUf2Path;
  const activeCount = activations.filter((a) => a.isActive).length;

  const handleRemoveDevice = async (activationId: string) => {
    setRemovingId(activationId);
    const result = await removeDevice(activationId);
    if (result.error) {
      alert(result.error);
    } else {
      setActivations((prev) =>
        prev.map((a) => (a.id === activationId ? { ...a, isActive: false } : a))
      );
    }
    setRemovingId(null);
  };

  const triggerDownload = async (fileType: "pcbFile" | "cadFile" | "sourceCode" | "reportSubmission" | "docx") => {
    setDownloadingType(fileType);
    const a = document.createElement("a");
    a.href = `/api/download?productId=${encodeURIComponent(license.product.id)}&fileType=${encodeURIComponent(fileType)}`;
    a.download = `${license.product.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloadingType(null), 1000);
  };

  return (
    <>
      <div className="border border-[#E8E2D9] rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
        {/* Card header */}
        <div className="p-5 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className={`text-[0.65rem] font-bold uppercase px-2.5 py-1 rounded-full ${LICENSE_TYPE_COLORS[license.type] ?? "bg-gray-100 text-gray-600"}`}>
                {LICENSE_TYPE_LABELS[license.type] ?? license.type}
              </span>
              <span className="text-xs text-[#5C6B60]">
                Purchased {new Date(license.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <h4 className="text-base font-black text-[#1A3C2F] mb-1.5 leading-snug">{license.product.title}</h4>
            <div className="flex items-center gap-1.5 text-[0.65rem] text-[#5C6B60]">
              <Key className="w-3 h-3 text-[#C4A35A]" />
              <span className="font-mono truncate max-w-[240px]">{license.licenseKey}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
            {isFirmware && (
              <button
                onClick={() => setShowFlasher(true)}
                className="flex items-center gap-1.5 bg-[#1A3C2F] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-all cursor-pointer shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Flash Firmware
              </button>
            )}

            {/* Device activations toggle */}
            <button
              onClick={() => setShowActivations(!showActivations)}
              className="flex items-center gap-1.5 border border-[#E8E2D9] text-[#1A3C2F] px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#F5F0EA] transition-all cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>{activeCount}/{license.maxActivations} Devices</span>
              {showActivations ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* ── Separate Asset Download Buttons Bar ── */}
        <div className="px-5 pb-5 pt-1 border-t border-[#F0EBE1] bg-[#FAF8F5]">
          <p className="text-[0.65rem] font-bold text-[#1A3C2F]/50 uppercase tracking-widest mb-2.5">
            Download Included Assets:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => triggerDownload("pcbFile")}
              disabled={!!downloadingType}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-emerald-400"
            >
              {downloadingType === "pcbFile" ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" /> : <Cpu className="w-3.5 h-3.5 text-emerald-600" />}
              <span>Gerber ZIP</span>
            </button>

            <button
              onClick={() => triggerDownload("cadFile")}
              disabled={!!downloadingType}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-amber-400"
            >
              {downloadingType === "cadFile" ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" /> : <Box className="w-3.5 h-3.5 text-amber-600" />}
              <span>PCB 3D ZIP</span>
            </button>

            <button
              onClick={() => triggerDownload("sourceCode")}
              disabled={!!downloadingType}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-[#1A3C2F]/5 text-[#1A3C2F] border border-[#1A3C2F]/20 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-[#1A3C2F]/40"
            >
              {downloadingType === "sourceCode" ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1A3C2F]" /> : <Zap className="w-3.5 h-3.5 text-amber-500" />}
              <span>Source Code</span>
            </button>

            <button
              onClick={() => triggerDownload("reportSubmission")}
              disabled={!!downloadingType}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-blue-50 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-blue-400"
            >
              {downloadingType === "reportSubmission" ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> : <FileText className="w-3.5 h-3.5 text-blue-600" />}
              <span>Report PDF</span>
            </button>
          </div>
        </div>

        {/* Device Activations Panel */}
        <AnimatePresence>
          {showActivations && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#E8E2D9] bg-[#FAF8F5] px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-[#1A3C2F]/60 uppercase tracking-wider">Registered Devices</p>
                  <button
                    onClick={() => setShowConnector(true)}
                    disabled={activeCount >= license.maxActivations}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A3C2F] text-white rounded-lg text-[0.65rem] font-bold hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <UploadCloud className="w-3 h-3" />
                    Add Board
                  </button>
                </div>

                {activations.filter((a) => a.isActive).length === 0 ? (
                  <div className="text-center py-4 border border-dashed border-[#E8E2D9] rounded-xl">
                    <Cpu className="w-6 h-6 text-[#1A3C2F]/30 mx-auto mb-2" />
                    <p className="text-xs text-[#5C6B60]">No boards registered yet.</p>
                    <p className="text-[0.65rem] text-[#5C6B60]">Click "Add Board" to connect your microcontroller.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activations.filter((a) => a.isActive).map((activation) => (
                      <div
                        key={activation.id}
                        className="flex items-center justify-between bg-white border border-[#E8E2D9] rounded-xl px-4 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#1A3C2F]/5 flex items-center justify-center shrink-0">
                            <Cpu className="w-4 h-4 text-[#1A3C2F]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1A3C2F] truncate">
                              {activation.nickname || activation.boardType}
                            </p>
                            <p className="text-[0.6rem] font-mono text-[#5C6B60] truncate">{activation.chipId}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className="w-2.5 h-2.5 text-[#5C6B60]" />
                              <span className="text-[0.6rem] text-[#5C6B60]">
                                Last seen {new Date(activation.lastSeenAt).toLocaleDateString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Slot bar */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: license.maxActivations }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 transition-colors ${
                          i < activeCount
                            ? "bg-[#1A3C2F] border-[#1A3C2F]"
                            : "bg-white border-[#1A3C2F]/25"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[0.65rem] font-semibold ${activeCount >= license.maxActivations ? "text-red-500" : "text-[#5C6B60]"}`}>
                    {activeCount}/{license.maxActivations} slots used
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Board Connector Modal */}
      <AnimatePresence>
        {showConnector && (
          <BoardConnector
            licenseId={license.id}
            productName={license.product.title}
            maxActivations={license.maxActivations}
            activeCount={activeCount}
            onActivated={() => {
              setShowConnector(false);
              // Refresh activations list by re-fetching
              window.location.reload();
            }}
            onClose={() => setShowConnector(false)}
          />
        )}
      </AnimatePresence>

      {/* Firmware Flasher Modal */}
      <AnimatePresence>
        {showFlasher && (
          <FirmwareFlasher
            licenseId={license.id}
            productTitle={license.product.title}
            isUf2={isUf2}
            activations={license.activations}
            onClose={() => setShowFlasher(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
