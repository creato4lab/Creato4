"use client";

import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { Loader2, Layers, CheckCircle2, Cpu } from "lucide-react";

interface GerberViewerProps {
  file: File | null;
}

interface GerberLayer {
  name: string;
  type: string;
  size: number;
}

export function GerberViewer({ file }: GerberViewerProps) {
  const [layers, setLayers] = useState<GerberLayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setLayers([]);
      return;
    }

    const inspectZip = async () => {
      setLoading(true);
      setError("");
      setLayers([]);
      
      try {
        const zip = new JSZip();
        const zipData = await zip.loadAsync(file);
        
        const foundLayers: GerberLayer[] = [];
        const gerberExtensions = [".gbr", ".grb", ".drl", ".gbl", ".gtl", ".gto", ".gbo", ".gts", ".gbs", ".gko", ".gm1", ".txt"];

        for (const [filename, fileObj] of Object.entries(zipData.files)) {
          if (fileObj.dir) continue;
          
          const lowerName = filename.toLowerCase();
          if (gerberExtensions.some(ext => lowerName.endsWith(ext))) {
            // Determine layer type heuristically
            let type = "Unknown Layer";
            if (lowerName.includes("gtl") || lowerName.includes("top")) type = "Top Copper";
            else if (lowerName.includes("gbl") || lowerName.includes("bottom")) type = "Bottom Copper";
            else if (lowerName.includes("drl") || lowerName.includes("drill") || lowerName.endsWith(".txt")) type = "NC Drill File";
            else if (lowerName.includes("gto") || lowerName.includes("topsilkscreen")) type = "Top Silkscreen";
            else if (lowerName.includes("gbo") || lowerName.includes("bottomsilkscreen")) type = "Bottom Silkscreen";
            else if (lowerName.includes("gts") || lowerName.includes("topsoldermask")) type = "Top Solder Mask";
            else if (lowerName.includes("gbs") || lowerName.includes("bottomsoldermask")) type = "Bottom Solder Mask";
            else if (lowerName.includes("gko") || lowerName.includes("gm1") || lowerName.includes("outline") || lowerName.includes("edge")) type = "Board Outline";

            // Add to found layers list
            foundLayers.push({
              name: filename.split('/').pop() || filename,
              type,
              size: 0 
            });
          }
        }

        if (foundLayers.length === 0) {
          setError("No valid Gerber or Drill files found inside the ZIP.");
        } else {
          // Sort layers to put Copper/Outline first
          foundLayers.sort((a, b) => a.type.localeCompare(b.type));
          setLayers(foundLayers);
        }
      } catch (err: any) {
        console.error("Error inspecting Gerber zip:", err);
        setError(err.message || "Failed to extract ZIP file.");
      } finally {
        setLoading(false);
      }
    };

    inspectZip();
  }, [file]);

  if (!file) return null;

  return (
    <div className="w-full bg-[#1A3C2F] rounded-xl border border-[#C4A35A]/30 overflow-hidden relative mt-4 shadow-xl">
      <div className="bg-[#102A20] px-4 py-3 flex items-center justify-between border-b border-[#C4A35A]/20">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#C4A35A]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">PCB Gerber Inspector</h3>
        </div>
        {!loading && !error && layers.length > 0 && (
          <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-md border border-green-400/20">
            {layers.length} Layers Verified
          </span>
        )}
      </div>

      <div className="p-6 relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#C4A35A] mb-3" />
            <p className="text-sm font-bold text-white/80">Scanning Manufacturing Files...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10">
            <p className="text-sm font-bold text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">{error}</p>
          </div>
        )}

        {!loading && !error && layers.length > 0 && (
          <div className="space-y-3 relative z-10 max-h-[300px] overflow-y-auto pr-2">
            {layers.map((layer, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-[#C4A35A]/10 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4 text-[#C4A35A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{layer.name}</p>
                    <p className="text-xs text-[#C4A35A] truncate">{layer.type}</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 opacity-80" />
              </div>
            ))}
          </div>
        )}

        {/* Subtle background tech pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C4A35A 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>
    </div>
  );
}
