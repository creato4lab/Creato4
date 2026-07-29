"use client";

import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { Loader2, Layers, AlertTriangle } from "lucide-react";
import { PcbViewer3D, type GerberData, type GerberPad, type GerberTrace } from "../PcbViewer3D";
import { motion, AnimatePresence } from "motion/react";

interface GerberViewerProps {
  file?: File | null;
  fileUrl?: string | null;
  boardTitle?: string;
  pcbImage?: string | null;
  defaultViewMode?: "both" | "top" | "bottom" | "3d";
}

interface GerberLayer {
  name: string;
  type: string;
  size: number;
}

interface DrillHole { x: number; y: number; diameter: number }

// ── Enhanced RS-274X Gerber Parser ──────────────────────────────────────────
// ── Enhanced RS-274X Gerber Parser ──────────────────────────────────────────
function parseGerberContent(content: string): { traces: GerberTrace[]; pads: GerberPad[] } {
  const traces: GerberTrace[] = [];
  const pads: GerberPad[] = [];

  let decDigits = 6;
  const fmtM = content.match(/%FS[LT][AI]X\d(\d)Y\d\d\*%/);
  if (fmtM) decDigits = parseInt(fmtM[1], 10);

  const isImperial = content.includes("%MOIN*%");
  const unitScale  = isImperial ? 25.4 : 1.0;
  const divisor    = Math.pow(10, decDigits);

  const coord = (raw: string): number =>
    (parseInt(raw, 10) / divisor) * unitScale;

  // Aperture definitions: %ADD10C,0.800*% or %ADD11R,1.200X0.800*% or %ADD12O,1.500X0.900*%
  const apertures = new Map<string, { shape: "C" | "R" | "O" | "P"; w: number; h: number }>();
  const addRe = /%ADD(\d+)([A-Z]+),?([^*]*)\*%/g;
  let addM: RegExpExecArray | null;
  while ((addM = addRe.exec(content)) !== null) {
    const code = addM[1];
    const shapeRaw = addM[2] as "C" | "R" | "O" | "P";
    const shape = ["C", "R", "O", "P"].includes(shapeRaw) ? shapeRaw : "C";
    const params = addM[3].split("X").map(Number).filter(isFinite);
    const w = (params[0] ?? 0.8) * unitScale;
    const h = (params[1] ?? params[0] ?? 0.8) * unitScale;
    apertures.set(code, { shape, w, h });
  }

  // Command regex supporting D01/D1, D02/D2, D03/D3
  const cmdRe = /(?:G0*[123]\*?)?(?:X(-?\d+))?(?:Y(-?\d+))?(?:I-?\d+)?(?:J-?\d+)?D(0?[123])\*/;
  const selRe = /(?:G54)?D(\d{2,})\*/;

  let curX = 0, curY = 0;
  let curApt = "";

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("%") || line === "M02*" || line === "M00*") continue;

    const selM = line.match(selRe);
    if (selM && parseInt(selM[1], 10) >= 10) {
      curApt = selM[1];
    }

    const cmdM = line.match(cmdRe);
    if (!cmdM) continue;

    const newX = cmdM[1] !== undefined ? coord(cmdM[1]) : curX;
    const newY = cmdM[2] !== undefined ? coord(cmdM[2]) : curY;
    const dCode = cmdM[3];

    if (dCode === "01" || dCode === "1") {
      const apt = apertures.get(curApt);
      const w = apt ? apt.w : 0.2;
      traces.push({ x1: curX, y1: curY, x2: newX, y2: newY, width: w });
      curX = newX; curY = newY;
    } else if (dCode === "02" || dCode === "2") {
      curX = newX; curY = newY;
    } else if (dCode === "03" || dCode === "3") {
      const apt = apertures.get(curApt) ?? { shape: "C", w: 0.8, h: 0.8 };
      pads.push({ x: newX, y: newY, shape: apt.shape, w: apt.w, h: apt.h });
      curX = newX; curY = newY;
    }
  }

  return { traces, pads };
}

// ── Excellon Drill File Parser with Robust Scale Auto-Alignment ────────────
function parseExcellonDrill(content: string): DrillHole[] {
  const holes: DrillHole[] = [];
  const tools  = new Map<string, number>();
  let curTool  = "";

  const isMetric  = /METRIC|MM/i.test(content);
  const unitScale = isMetric ? 1.0 : 25.4;
  const divisor   = isMetric ? 1_000 : 10_000;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith(";") || line === "M48" || line === "M30" || line === "%") continue;

    const toolDef = line.match(/T(\d+)\s*C([\d.]+)/i);
    if (toolDef) {
      const dia = parseFloat(toolDef[2]) * unitScale;
      tools.set(parseInt(toolDef[1], 10).toString(), dia);
      tools.set(toolDef[1], dia);
      continue;
    }

    const toolSel = line.match(/^T(\d+)/i);
    if (toolSel && !line.includes("X") && !line.includes("Y")) {
      curTool = parseInt(toolSel[1], 10).toString();
      continue;
    }

    const holeM = line.match(/X(-?[\d.]+)\s*Y(-?[\d.]+)/i);
    if (holeM) {
      let x: number, y: number;
      if (holeM[1].includes(".") || holeM[2].includes(".")) {
        x = parseFloat(holeM[1]) * unitScale;
        y = parseFloat(holeM[2]) * unitScale;
      } else {
        x = (parseInt(holeM[1], 10) / divisor) * unitScale;
        y = (parseInt(holeM[2], 10) / divisor) * unitScale;
      }
      holes.push({ x, y, diameter: tools.get(curTool) ?? 0.8 });
    }
  }

  return holes;
}

function detectLayerType(lowerName: string): string {
  if (lowerName.includes("gtl") || (lowerName.includes("top") && lowerName.includes("copper"))) return "Top Copper";
  if (lowerName.includes("gbl") || (lowerName.includes("bot") && lowerName.includes("copper"))) return "Bottom Copper";
  if (lowerName.includes("drl") || lowerName.includes("drill") || (lowerName.endsWith(".txt") && lowerName.includes("drill"))) return "NC Drill File";
  if (lowerName.includes("gto") || lowerName.includes("topsilkscreen") || (lowerName.includes("top") && lowerName.includes("silk"))) return "Top Silkscreen";
  if (lowerName.includes("gbo") || lowerName.includes("botsilkscreen") || (lowerName.includes("bot") && lowerName.includes("silk"))) return "Bottom Silkscreen";
  if (lowerName.includes("gts") || lowerName.includes("topsoldermask") || (lowerName.includes("top") && lowerName.includes("mask"))) return "Top Solder Mask";
  if (lowerName.includes("gbs") || lowerName.includes("botsoldermask") || (lowerName.includes("bot") && lowerName.includes("mask"))) return "Bottom Solder Mask";
  if (lowerName.includes("gko") || lowerName.includes("gm1") || lowerName.includes("outline") || lowerName.includes("edge")) return "Board Outline";
  if (lowerName.includes("gbr") || lowerName.includes("grb")) return "Gerber Layer";
  return "Unknown Layer";
}

// ─────────────────────────────────────────────────────────────────────────────
// GerberViewer Component
// ─────────────────────────────────────────────────────────────────────────────
export function GerberViewer({ file, fileUrl, boardTitle = "Uploaded Gerber PCB", pcbImage, defaultViewMode }: GerberViewerProps) {
  const [layers, setLayers] = useState<GerberLayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gerberData, setGerberData] = useState<GerberData | null>(null);
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  useEffect(() => {
    if (!file && !fileUrl) {
      setLayers([]);
      setGerberData(null);
      return;
    }

    const inspectZip = async () => {
      setLoading(true);
      setError("");
      setLayers([]);
      setGerberData(null);

      try {
        let zipBuffer: ArrayBuffer | File | null = file || null;
        if (!zipBuffer && fileUrl) {
          const res = await fetch(fileUrl);
          if (!res.ok) throw new Error(`Failed to download Gerber zip (${res.status})`);
          zipBuffer = await res.arrayBuffer();
        }

        if (!zipBuffer) return;

        const zip = new JSZip();
        const zipData = await zip.loadAsync(zipBuffer);

        const gerberExtensions = [
          ".gbr", ".grb", ".drl", ".gbl", ".gtl",
          ".gto", ".gbo", ".gts", ".gbs", ".gko", ".gm1", ".txt",
          ".art", ".pho", ".rep", ".edge", ".profile", ".copper", ".top", ".bot", ".outline"
        ];

        const foundLayers: GerberLayer[] = [];
        let outlineFile = "";
        let topCopperFile = "";
        let botCopperFile = "";
        let topSilkFile = "";
        let botSilkFile = "";
        let drillFile = "";
        let fallbackCopperFile = "";

        let outlinePrio = 0;
        let topCopperPrio = 0;
        let botCopperPrio = 0;
        let topSilkPrio = 0;
        let botSilkPrio = 0;
        let drillPrio = 0;

        for (const [filename, fileObj] of Object.entries(zipData.files)) {
          if (fileObj.dir) continue;

          const lowerName = filename.toLowerCase();
          const baseName = (filename.split("/").pop() ?? filename).toLowerCase();

          const isMatch = gerberExtensions.some((ext) => lowerName.endsWith(ext)) ||
            baseName.includes("gerber") || baseName.includes("layer") || baseName.includes("drill");

          if (!isMatch) continue;

          const type = detectLayerType(baseName);
          foundLayers.push({ name: filename.split("/").pop() ?? filename, type, size: 0 });

          if (!fallbackCopperFile && (lowerName.endsWith(".gtl") || lowerName.endsWith(".gbl") || lowerName.endsWith(".gbr"))) {
            fallbackCopperFile = filename;
          }

          if (type === "Board Outline") {
            const p = baseName.includes("gko") ? 4 : baseName.includes("gm1") ? 3 : baseName.includes("outline") ? 2 : 1;
            if (p > outlinePrio) { outlineFile = filename; outlinePrio = p; }
          }
          if (type === "Top Copper") {
            const p = baseName.includes("gtl") ? 4 : baseName.includes("top") ? 3 : 2;
            if (p > topCopperPrio) { topCopperFile = filename; topCopperPrio = p; }
          }
          if (type === "Bottom Copper") {
            const p = baseName.includes("gbl") ? 4 : baseName.includes("bot") ? 3 : 2;
            if (p > botCopperPrio) { botCopperFile = filename; botCopperPrio = p; }
          }
          if (type === "Top Silkscreen") {
            const p = baseName.includes("gto") ? 4 : baseName.includes("top") ? 3 : 2;
            if (p > topSilkPrio) { topSilkFile = filename; topSilkPrio = p; }
          }
          if (type === "Bottom Silkscreen") {
            const p = baseName.includes("gbo") ? 4 : baseName.includes("bot") ? 3 : 2;
            if (p > botSilkPrio) { botSilkFile = filename; botSilkPrio = p; }
          }
          if (type === "NC Drill File") {
            const p = baseName.includes("drl") ? 4 : baseName.includes("drill") ? 3 : 2;
            if (p > drillPrio) { drillFile = filename; drillPrio = p; }
          }
        }

        if (!topCopperFile && fallbackCopperFile) {
          topCopperFile = fallbackCopperFile;
        }

        if (foundLayers.length === 0) {
          setError("No valid Gerber or Drill files found inside the ZIP.");
          return;
        }

        foundLayers.sort((a, b) => a.type.localeCompare(b.type));
        setLayers(foundLayers);

        const readText = async (path: string) => {
          if (!path || !zipData.files[path]) return "";
          try { return await zipData.files[path].async("text"); }
          catch { return ""; }
        };

        const [
          outlineContent,
          topCopperContent,
          botCopperContent,
          topSilkContent,
          botSilkContent,
          drillContent
        ] = await Promise.all([
          readText(outlineFile),
          readText(topCopperFile),
          readText(botCopperFile),
          readText(topSilkFile),
          readText(botSilkFile),
          readText(drillFile),
        ]);

        const outlineParsed = outlineContent ? parseGerberContent(outlineContent) : { traces: [], pads: [] };
        const topCopperParsed = topCopperContent ? parseGerberContent(topCopperContent) : { traces: [], pads: [] };
        const botCopperParsed = botCopperContent ? parseGerberContent(botCopperContent) : { traces: [], pads: [] };
        const topSilkParsed = topSilkContent ? parseGerberContent(topSilkContent) : { traces: [], pads: [] };
        const botSilkParsed = botSilkContent ? parseGerberContent(botSilkContent) : { traces: [], pads: [] };
        const drillHoles = drillContent ? parseExcellonDrill(drillContent) : [];

        // Collect coordinates for board bounds calculation
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        let outlineTraces = outlineParsed.traces;

        if (outlineTraces.length > 0) {
          // Compute bounds strictly from Board Outline / Edge Cuts layer
          outlineTraces.forEach(s => {
            minX = Math.min(minX, s.x1, s.x2);
            maxX = Math.max(maxX, s.x1, s.x2);
            minY = Math.min(minY, s.y1, s.y2);
            maxY = Math.max(maxY, s.y1, s.y2);
          });
        } else {
          // Fallback to top copper, silk, and drill points
          const allPts: Array<{ x: number; y: number }> = [];
          topCopperParsed.traces.forEach(s => { allPts.push({ x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 }); });
          topCopperParsed.pads.forEach(p => allPts.push({ x: p.x, y: p.y }));
          topSilkParsed.traces.forEach(s => { allPts.push({ x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 }); });

          if (allPts.length > 0) {
            allPts.forEach(p => {
              minX = Math.min(minX, p.x);
              maxX = Math.max(maxX, p.x);
              minY = Math.min(minY, p.y);
              maxY = Math.max(maxY, p.y);
            });
          }
        }

        if (isFinite(minX) && isFinite(maxX) && isFinite(minY) && isFinite(maxY)) {
          const width = Math.max(0.1, maxX - minX);
          const height = Math.max(0.1, maxY - minY);

          // Auto-align drill holes to board bounds if scale/divisor differed in drill file
          let finalDrills = drillHoles;
          if (drillHoles.length > 0 && (topCopperParsed.pads.length > 0 || topCopperParsed.traces.length > 0)) {
            const dMinX = drillHoles.reduce((a, b) => Math.min(a, b.x), Infinity);
            const dMaxX = drillHoles.reduce((a, b) => Math.max(a, b.x), -Infinity);
            const dMinY = drillHoles.reduce((a, b) => Math.min(a, b.y), Infinity);
            const dMaxY = drillHoles.reduce((a, b) => Math.max(a, b.y), -Infinity);
            const dW = Math.max(0.01, dMaxX - dMinX);
            const dH = Math.max(0.01, dMaxY - dMinY);

            // If drill bounds are outside copper bounds, align them to copper layer space
            if (Math.abs(dMinX - minX) > width * 0.2 || Math.abs(dW - width) > width * 0.2) {
              const scaleX = width / dW;
              const scaleY = height / dH;
              finalDrills = drillHoles.map(h => ({
                x: minX + (h.x - dMinX) * scaleX,
                y: minY + (h.y - dMinY) * scaleY,
                diameter: h.diameter,
              }));
            }
          }

          // Synthesize outline if missing
          if (outlineTraces.length === 0) {
            outlineTraces = [
              { x1: minX, y1: minY, x2: maxX, y2: minY, width: 0.2 },
              { x1: maxX, y1: minY, x2: maxX, y2: maxY, width: 0.2 },
              { x1: maxX, y1: maxY, x2: minX, y2: maxY, width: 0.2 },
              { x1: minX, y1: maxY, x2: minX, y2: minY, width: 0.2 },
            ];
          }

          const parsedLayerNames = foundLayers.map(l => l.name);
          const isComplete = topCopperParsed.traces.length > 0 || topCopperParsed.pads.length > 0 || topSilkParsed.traces.length > 0;

          setGerberData({
            outline: outlineTraces,
            topTraces: topCopperParsed.traces.slice(0, 5000),
            topPads: topCopperParsed.pads.slice(0, 1000),
            bottomTraces: botCopperParsed.traces.slice(0, 3000),
            bottomPads: botCopperParsed.pads.slice(0, 1000),
            topSilkscreen: topSilkParsed.traces.slice(0, 5000),
            bottomSilkscreen: botSilkParsed.traces.slice(0, 3000),
            drillHoles: finalDrills.slice(0, 800),
            boardBounds: { minX, maxX, minY, maxY, width, height },
            parsedLayerNames,
            hasRealData: true,
            isComplete,
          });
        }
      } catch (err: any) {
        console.error("Error inspecting Gerber zip:", err);
        setError(err.message ?? "Failed to extract ZIP file.");
      } finally {
        setLoading(false);
      }
    };

    inspectZip();
  }, [file, fileUrl]);

  return (
    <div className="relative w-full h-full bg-[#0E241C] flex flex-col overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A1A12]/90 backdrop-blur-sm z-30">
          <Loader2 className="w-10 h-10 animate-spin text-[#C4A35A] mb-3" />
          <p className="text-sm font-bold text-white/90">Parsing Gerber Stackup (JLCPCB Style)...</p>
          <p className="text-xs text-[#C4A35A] mt-1 font-mono">Extracting Top/Bottom Copper, Silkscreen Labels & Drill Files</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30 bg-[#0A1A12]/95">
          <AlertTriangle className="w-10 h-10 text-amber-400 mb-2" />
          <p className="text-sm font-bold text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20 max-w-md">
            {error}
          </p>
        </div>
      )}

      {/* Primary Live PCB 3D Canvas rendering the user's uploaded Gerber data */}
      <div className="flex-1 w-full h-full relative">
        <PcbViewer3D
          boardTitle={boardTitle}
          pcbImage={pcbImage}
          gerberData={gerberData}
          layers={layers}
          defaultViewMode={defaultViewMode}
        />
      </div>
    </div>
  );
}
