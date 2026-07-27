"use client";
import React, { useState } from "react";
import { Zap, Upload, CheckCircle, Loader2, FileCode } from "lucide-react";
import { pushFirmwareUpdateAction } from "@/actions/admin";
import { FileUpload } from "@/components/admin/FileUpload";

interface ProductItem {
  id: string;
  title: string;
  version: string;
  firmwareBuildVersion?: string | null;
  firmwareBinPath?: string | null;
}

export function FirmwarePushClient({ products }: { products: ProductItem[] }) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [version, setVersion] = useState("v2.1.0");
  const [notes, setNotes] = useState("");
  const [firmwareBinPath, setFirmwareBinPath] = useState("");
  const [firmwareUf2Path, setFirmwareUf2Path] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !version.trim() || !notes.trim()) {
      setErrorMsg("Please select a product, enter version tag, and provide build release notes.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await pushFirmwareUpdateAction({
      productId: selectedProductId,
      version: version.trim(),
      notes: notes.trim(),
      firmwareBinPath: firmwareBinPath.trim() || undefined,
      firmwareUf2Path: firmwareUf2Path.trim() || undefined,
    });

    if (result.success) {
      setIsSubmitting(false);
      setSuccessMsg(`Firmware update ${version} successfully pushed for ${selectedProduct?.title}!`);
      setNotes("");
    } else {
      setIsSubmitting(false);
      setErrorMsg(result.error || "Failed to push firmware update.");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#1A3C2F]/10 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {successMsg && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-bold">
            {errorMsg}
          </div>
        )}

        {/* Product selection */}
        <div>
          <label className="text-xs font-bold text-[#1A3C2F] uppercase tracking-wider block mb-1.5">
            Select Target Product
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full border border-[#1A3C2F]/15 rounded-xl px-4 py-3 text-sm text-[#1A3C2F] font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} (Current: {p.version || "v1.0.0"})
              </option>
            ))}
          </select>
        </div>

        {/* Version tag */}
        <div>
          <label className="text-xs font-bold text-[#1A3C2F] uppercase tracking-wider block mb-1.5">
            New Version Tag
          </label>
          <input
            type="text"
            required
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. v2.1.0"
            className="w-full border border-[#1A3C2F]/15 rounded-xl px-4 py-3 text-sm font-mono text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
          />
        </div>

        {/* Binary Uploads */}
        <div className="space-y-4 pt-2 border-t border-[#1A3C2F]/10">
          <FileUpload
            label="Upload Binary (.bin / .hex) to R2"
            value={firmwareBinPath}
            onChange={setFirmwareBinPath}
            accept=".bin,.hex"
            prefix="firmware"
          />

          <FileUpload
            label="Upload UF2 Firmware (.uf2) to R2 (optional)"
            value={firmwareUf2Path}
            onChange={setFirmwareUf2Path}
            accept=".uf2"
            prefix="firmware"
          />
        </div>

        {/* Release Notes */}
        <div>
          <label className="text-xs font-bold text-[#1A3C2F] uppercase tracking-wider block mb-1.5">
            Changelog / Release Notes
          </label>
          <textarea
            required
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Fixed ESP32 Wi-Fi reconnect memory leak; added WebSerial firmware flashing compatibility."
            className="w-full border border-[#1A3C2F]/15 rounded-xl px-4 py-3 text-sm text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-[#1A3C2F] text-white rounded-2xl font-bold text-sm hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Pushing Firmware Build...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-400" /> Push Firmware Update
            </>
          )}
        </button>
      </form>
    </div>
  );
}
