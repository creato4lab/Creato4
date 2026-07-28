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
  CheckCircle, Clock, Shield, UploadCloud,
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
  STUDENT:           "bg-blue-100 text-blue-700",
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
  const [isDownloading, setIsDownloading] = useState(false);
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

  const handleDownload = async () => {
    setIsDownloading(true);
    const result = await generateDownloadUrl(license.product.id, "sourceCode");
    if (result.error) {
      alert(result.error);
    } else if (result.success && result.url) {
      if ((result as any).isMock) {
        alert((result as any).message + "\n\nURL: " + result.url);
      } else {
        const a = document.createElement("a");
        a.href = result.url;
        a.download = `${license.product.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
    setIsDownloading(false);
  };

  return (
    <>
      <div className="border border-[#E8E2D9] rounded-2xl bg-white overflow-hidden">
        {/* Card header */}
        <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className={`text-[0.65rem] font-bold uppercase px-2.5 py-1 rounded-full ${LICENSE_TYPE_COLORS[license.type] ?? "bg-gray-100 text-gray-600"}`}>
                {LICENSE_TYPE_LABELS[license.type] ?? license.type}
              </span>
              <span className="text-xs text-[#5C6B60]">
                Purchased {new Date(license.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <h4 className="text-base font-bold text-[#1A3C2F] mb-2 leading-snug">{license.product.title}</h4>
            <div className="flex items-center gap-1.5 text-[0.65rem] text-[#5C6B60]">
              <Key className="w-3 h-3" />
              <span className="font-mono truncate max-w-[200px]">{license.licenseKey}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 shrink-0 justify-center min-w-[140px]">
            {isFirmware ? (
              <button
                onClick={() => setShowFlasher(true)}
                className="flex items-center justify-center gap-2 bg-[#1A3C2F] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                Flash Firmware
              </button>
            ) : (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`flex items-center justify-center gap-2 bg-[#1A3C2F] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#234B3C] transition-colors ${isDownloading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                {isDownloading ? "Preparing..." : "Download"}
              </button>
            )}

            {/* Device activations toggle */}
            <button
              onClick={() => setShowActivations(!showActivations)}
              className="flex items-center justify-center gap-2 border border-[#E8E2D9] text-[#1A3C2F] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#F5F0EA] transition-colors"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{activeCount}/{license.maxActivations} Devices</span>
              {showActivations ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
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
