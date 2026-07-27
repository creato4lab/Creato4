"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Key, Download, Calendar, Package, Cpu,
  Trash2, ChevronDown, ChevronUp, Copy, Check,
  Usb, Zap, ImageIcon, Clock
} from "lucide-react";
import { removeDevice } from "@/actions/license";
import { BoardConnector } from "./BoardConnector";
import { generateDownloadUrl } from "@/actions/download";

// ─── Per-tier available file types ──────────────────────────────────────────
const TIER_FILES: Record<string, { id: "sourceCode" | "cadFile" | "pdfDoc"; label: string }[]> = {
  STUDENT:           [{ id: "sourceCode", label: "Source Code" }, { id: "cadFile", label: "CAD Files" }, { id: "pdfDoc", label: "PDF Docs" }],
  COMMERCIAL:        [{ id: "sourceCode", label: "Source Code" }, { id: "cadFile", label: "CAD Files" }, { id: "pdfDoc", label: "PDF Docs" }],
  ENTERPRISE:        [{ id: "sourceCode", label: "Source Code" }, { id: "cadFile", label: "CAD Files" }, { id: "pdfDoc", label: "PDF Docs" }],
  SOURCE_CODE_ONLY:  [{ id: "sourceCode", label: "Source Code" }],
  REPORT_SUBMISSION: [{ id: "pdfDoc", label: "PDF Report" }],
  REPORT_EDITABLE:   [{ id: "pdfDoc", label: "Editable Report" }],
  FIRMWARE_FLASH:    [], // uses BoardConnector for flashing
};

const TIER_LABELS: Record<string, string> = {
  STUDENT:           "Complete Project",
  COMMERCIAL:        "Commercial",
  ENTERPRISE:        "Enterprise",
  SOURCE_CODE_ONLY:  "Source Code Only",
  REPORT_SUBMISSION: "Submission Report",
  REPORT_EDITABLE:   "Editable Report",
  FIRMWARE_FLASH:    "Firmware Flash",
};

const TIER_COLORS: Record<string, string> = {
  STUDENT:           "bg-green-100 text-green-800",
  COMMERCIAL:        "bg-blue-100 text-blue-800",
  ENTERPRISE:        "bg-purple-100 text-purple-800",
  SOURCE_CODE_ONLY:  "bg-orange-100 text-orange-800",
  REPORT_SUBMISSION: "bg-yellow-100 text-yellow-800",
  REPORT_EDITABLE:   "bg-yellow-100 text-yellow-800",
  FIRMWARE_FLASH:    "bg-red-100 text-red-800",
};

interface DeviceActivation {
  id: string;
  chipId: string;
  boardType: string;
  nickname: string | null;
  isActive: boolean;
  lastSeenAt: Date;
  createdAt: Date;
  usbVendorId: number | null;
  usbProductId: number | null;
}

interface LicenseWithProduct {
  id: string;
  licenseKey: string;
  type: string;
  isActive: boolean;
  downloadsUsed: number;
  maxActivations: number;
  createdAt: Date;
  product: {
    id: string;
    title: string;
    slug: string;
    images: string[];
    category: string;
  };
  activations: DeviceActivation[];
}

interface LicenseCardProps {
  license: LicenseWithProduct;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="text-[#1A3C2F]/30 hover:text-[#C4A35A] transition-colors p-1">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function DownloadBtn({ productId, fileType, label }: { productId: string; fileType: "sourceCode" | "cadFile" | "pdfDoc"; label: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleDownload = async () => {
    setState("loading");
    const result = await generateDownloadUrl(productId, fileType);
    if (result.error) {
      alert(result.error);
      setState("idle");
      return;
    }
    if (result.success && result.url) {
      if ((result as any).isMock) {
        alert((result as any).message + "\n\nMock URL: " + result.url);
      } else {
        const a = document.createElement("a");
        a.href = result.url;
        a.download = label;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setState("done");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={state === "loading"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
        state === "done"
          ? "bg-green-100 text-green-700"
          : "bg-[#1A3C2F]/8 text-[#1A3C2F] hover:bg-[#1A3C2F] hover:text-white"
      } disabled:opacity-60`}
    >
      {state === "loading" ? (
        <><Download className="w-3 h-3 animate-bounce" /> Preparing...</>
      ) : state === "done" ? (
        <><Check className="w-3 h-3" /> Done!</>
      ) : (
        <><Download className="w-3 h-3" /> {label}</>
      )}
    </button>
  );
}

export function LicenseCard({ license }: LicenseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showConnector, setShowConnector] = useState(false);
  const [devices, setDevices] = useState<DeviceActivation[]>(license.activations);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const activeDevices = devices.filter(d => d.isActive);
  const tierLabel = TIER_LABELS[license.type] || license.type;
  const tierColor = TIER_COLORS[license.type] || "bg-gray-100 text-gray-700";
  const availableFiles = TIER_FILES[license.type] || [];
  const isFirmwareFlash = license.type === "FIRMWARE_FLASH";

  const handleRemoveDevice = async (activationId: string) => {
    setRemovingId(activationId);
    const result = await removeDevice(activationId);
    if (result.success) {
      setDevices(prev => prev.map(d => d.id === activationId ? { ...d, isActive: false } : d));
    } else {
      alert(result.error || "Failed to remove device");
    }
    setRemovingId(null);
  };

  const handleActivated = () => {
    setShowConnector(false);
    // Refresh page to get updated activations
    window.location.reload();
  };

  return (
    <>
      <div className="bg-white border border-[#1A3C2F]/8 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-[#1A3C2F]/5 transition-all">
        {/* Card header */}
        <div className="flex gap-4 p-5">
          {/* Product image */}
          <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#1A3C2F]/5 flex items-center justify-center">
            {license.product.images?.[0] ? (
              <img src={license.product.images[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-7 h-7 text-[#1A3C2F]/20" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[0.6rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${tierColor}`}>
                  {tierLabel}
                </span>
                {!license.isActive && (
                  <span className="text-[0.6rem] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Inactive</span>
                )}
              </div>
              <span className="text-[0.65rem] text-[#1A3C2F]/40 flex items-center gap-1 shrink-0">
                <Calendar className="w-3 h-3" />
                {new Date(license.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>

            <h3 className="text-sm font-bold text-[#1A3C2F] leading-snug mb-2 truncate">{license.product.title}</h3>

            {/* License key */}
            <div className="flex items-center gap-1.5 bg-[#1A3C2F]/5 rounded-lg px-2.5 py-1.5 w-fit max-w-full">
              <Key className="w-3 h-3 text-[#C4A35A] shrink-0" />
              <span className="text-[0.65rem] font-mono text-[#1A3C2F]/70 truncate">{license.licenseKey}</span>
              <CopyButton text={license.licenseKey} />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-[#1A3C2F]/6 px-5 py-3 flex items-center justify-between gap-4 bg-[#FAF8F5]/60">
          <div className="flex items-center gap-5 text-xs text-[#1A3C2F]/50">
            <span className="flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              {license.downloadsUsed} downloads
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span className={activeDevices.length >= license.maxActivations ? "text-amber-600 font-bold" : ""}>
                {activeDevices.length}/{license.maxActivations} devices
              </span>
            </span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-semibold text-[#1A3C2F]/50 hover:text-[#1A3C2F] transition-colors"
          >
            {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Hide</> : <><ChevronDown className="w-3.5 h-3.5" /> Manage</>}
          </button>
        </div>

        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-2 border-t border-[#1A3C2F]/6 space-y-5">

                {/* Downloads section */}
                {availableFiles.length > 0 && (
                  <div>
                    <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40 mb-2.5">
                      Download Files
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableFiles.map(f => (
                        <DownloadBtn key={f.id} productId={license.product.id} fileType={f.id} label={f.label} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Device activations section */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40">
                      Registered Devices ({activeDevices.length}/{license.maxActivations})
                    </p>
                    {/* Slot bar */}
                    <div className="flex gap-1">
                      {Array.from({ length: license.maxActivations }).map((_, i) => (
                        <div key={i} className={`w-3 h-1.5 rounded-full ${i < activeDevices.length ? "bg-[#1A3C2F]" : "bg-[#1A3C2F]/15"}`} />
                      ))}
                    </div>
                  </div>

                  {activeDevices.length === 0 ? (
                    <p className="text-xs text-[#1A3C2F]/40 italic">No devices registered yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {activeDevices.map(device => (
                        <div key={device.id} className="flex items-center justify-between gap-3 bg-[#1A3C2F]/[0.03] border border-[#1A3C2F]/8 rounded-xl px-3.5 py-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Cpu className="w-4 h-4 text-[#C4A35A] shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#1A3C2F] truncate">
                                {device.nickname || device.boardType}
                              </p>
                              <p className="text-[0.6rem] text-[#1A3C2F]/40 font-mono truncate">
                                ID: {device.chipId.slice(0, 16)}...
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[0.6rem] text-[#1A3C2F]/30 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(device.lastSeenAt).toLocaleDateString("en-IN")}
                            </span>
                            <button
                              onClick={() => handleRemoveDevice(device.id)}
                              disabled={removingId === device.id}
                              className="text-[#1A3C2F]/25 hover:text-red-500 transition-colors p-1 disabled:opacity-40"
                              title="Remove device"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Connect board button */}
                <button
                  onClick={() => setShowConnector(true)}
                  disabled={activeDevices.length >= license.maxActivations}
                  className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeDevices.length >= license.maxActivations
                      ? "bg-[#1A3C2F]/5 text-[#1A3C2F]/30 cursor-not-allowed"
                      : isFirmwareFlash
                      ? "bg-gradient-to-r from-[#1A3C2F] to-[#2D5E46] text-white hover:opacity-90"
                      : "border-2 border-dashed border-[#1A3C2F]/20 text-[#1A3C2F]/60 hover:border-[#C4A35A] hover:text-[#C4A35A]"
                  }`}
                >
                  {isFirmwareFlash ? <Zap className="w-4 h-4" /> : <Usb className="w-4 h-4" />}
                  {activeDevices.length >= license.maxActivations
                    ? "All Slots Used — Remove a Device First"
                    : isFirmwareFlash
                    ? "Flash Firmware to Board"
                    : "Connect & Register Board"}
                </button>
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
            activeCount={activeDevices.length}
            onActivated={handleActivated}
            onClose={() => setShowConnector(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
