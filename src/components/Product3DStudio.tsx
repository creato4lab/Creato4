"use client";

import React, { useState } from "react";
import { Cpu, Box, Layers, Download } from "lucide-react";
import { GerberViewer } from "@/components/admin/GerberViewer";
import { CadViewer } from "@/components/admin/CadViewer";
import { getImageUrl } from "@/lib/imageUrl";

interface Product3DStudioProps {
  title: string;
  gerberPath?: string | null;
  cadPath?: string | null;
  pcbImage?: string | null;
}

export function Product3DStudio({
  title,
  gerberPath,
  cadPath,
  pcbImage,
}: Product3DStudioProps) {
  const hasGerber = !!gerberPath;
  const hasCad = !!cadPath;

  const [activeTab, setActiveTab] = useState<"gerber" | "cad">(
    hasGerber ? "gerber" : "cad"
  );

  if (!hasGerber && !hasCad) return null;

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A3C2F]/8 shadow-sm space-y-6">
      {/* Studio Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A3C2F]/8 pb-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-[#1A3C2F] uppercase tracking-wide">
            <Layers className="w-5 h-5 text-[#C4A35A]" />
            Interactive 3D Hardware Studio
          </h2>
          <p className="text-xs text-[#1A3C2F]/50 mt-1">
            Rotate, zoom, and inspect production Gerber PCBs & 3D CAD models in 3D
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#1A3C2F]/10 self-start sm:self-auto">
          {hasGerber && (
            <button
              onClick={() => setActiveTab("gerber")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "gerber"
                  ? "bg-[#1A3C2F] text-white shadow-md"
                  : "text-[#1A3C2F]/60 hover:text-[#1A3C2F]"
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#C4A35A]" />
              3D PCB Gerber
            </button>
          )}

          {hasCad && (
            <button
              onClick={() => setActiveTab("cad")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "cad"
                  ? "bg-[#1A3C2F] text-white shadow-md"
                  : "text-[#1A3C2F]/60 hover:text-[#1A3C2F]"
              }`}
            >
              <Box className="w-3.5 h-3.5 text-[#C4A35A]" />
              3D CAD Enclosure
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl overflow-hidden bg-[#0A1A12] border border-[#1A3C2F]/20 relative min-h-[420px] flex flex-col justify-center">
        {activeTab === "gerber" && gerberPath && (
          <GerberViewer
            fileUrl={getImageUrl(gerberPath)}
            boardTitle={`${title} PCB`}
            pcbImage={pcbImage}
          />
        )}

        {activeTab === "cad" && cadPath && (
          <CadViewer
            fileUrl={getImageUrl(cadPath)}
            cadTitle={`${title} CAD Model`}
          />
        )}
      </div>

      {/* Download Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#1A3C2F]/60">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live WebGL 3D Engine Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasGerber && (
            <a
              href={getImageUrl(gerberPath)}
              download
              className="flex items-center gap-1.5 font-bold text-[#1A3C2F] bg-[#1A3C2F]/5 hover:bg-[#1A3C2F]/10 border border-[#1A3C2F]/10 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Download className="w-3 h-3 text-[#C4A35A]" /> Gerber Zip
            </a>
          )}
          {hasCad && (
            <a
              href={getImageUrl(cadPath)}
              download
              className="flex items-center gap-1.5 font-bold text-[#1A3C2F] bg-[#1A3C2F]/5 hover:bg-[#1A3C2F]/10 border border-[#1A3C2F]/10 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Download className="w-3 h-3 text-[#C4A35A]" /> CAD 3D Zip
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
