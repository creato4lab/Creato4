"use client";

import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { Loader2, Layers, CheckCircle2, Cpu, Eye, X, Zap } from "lucide-react";
import { PcbViewer3D, type GerberData } from "../PcbViewer3D";
import { motion, AnimatePresence } from "motion/react";

interface GerberViewerProps {
  file?: File | null;
  fileUrl?: string | null;
  boardTitle?: string;
  pcbImage?: string | null;
}

interface GerberLayer {
  name: string;
  type: string;
  size: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Gerber RS-274X parser
// Returns trace segments and pad flashes for one layer.
// ─────────────────────────────────────────────────────────────────────────────
interface TraceSegment { x1: number; y1: number; x2: number; y2: number; width: number }
interface PadPoint    { x: number; y: number; size: number }

function parseGerberContent(content: string): { traces: TraceSegment[]; pads: PadPoint[] } {
  const traces: TraceSegment[] = [];
  const pads: PadPoint[]    = [];

  // ── Coordinate format ────────────────────────────────────────────────────
  // %FSLAX{i}{d}Y{i}{d}*%  →  d = decimal digits in X
  let decDigits = 6; // default: FSLAX46Y46 (most modern Gerbers)
  const fmtM = content.match(/%FS[LT][AI]X\d(\d)Y\d\d\*%/);
  if (fmtM) decDigits = parseInt(fmtM[1], 10);

  // ── Units ────────────────────────────────────────────────────────────────
  const isImperial = content.includes("%MOIN*%");
  const unitScale  = isImperial ? 25.4 : 1.0; // always convert to mm
  const divisor    = Math.pow(10, decDigits);

  const coord = (raw: string): number =>
    (parseInt(raw, 10) / divisor) * unitScale;

  // ── Aperture definitions ──────────────────────────────────────────────────
  // %ADD{code}{shape},{params}*%
  const apertures = new Map<string, { size: number }>();
  const addRe = /%ADD(\d+)([A-Z]+),?([^*]*)\*%/g;
  let addM: RegExpExecArray | null;
  while ((addM = addRe.exec(content)) !== null) {
    const params = addM[3].split("X").map(Number).filter(isFinite);
    const raw    = (params[0] ?? 0.2) * unitScale;
    apertures.set(addM[1], { size: raw });
  }

  // ── Parse draw commands line-by-line ─────────────────────────────────────
  // Handles: [G01|G02|G03] [X...] [Y...] [I...] [J...] D{01|02|03}*
  const cmdRe = /^(?:G0*[123]\*?)?(?:X(-?\d+))?(?:Y(-?\d+))?(?:I-?\d+)?(?:J-?\d+)?D(0[123])\*$/;
  const selRe = /^D(\d{2,})\*$/;

  let curX = 0, curY = 0;
  let curApt = "";

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("%") || line === "M02*" || line === "M00*") continue;

    // Aperture selection  (D10, D11 … )
    const selM = line.match(selRe);
    if (selM && parseInt(selM[1], 10) >= 10) {
      curApt = selM[1];
      continue;
    }

    // Coordinate + D-code
    const cmdM = line.match(cmdRe);
    if (!cmdM) continue;

    const newX = cmdM[1] !== undefined ? coord(cmdM[1]) : curX;
    const newY = cmdM[2] !== undefined ? coord(cmdM[2]) : curY;
    const dCode = cmdM[3];

    if (dCode === "01") {
      const w = apertures.get(curApt)?.size ?? 0.15;
      traces.push({ x1: curX, y1: curY, x2: newX, y2: newY, width: w });
      curX = newX; curY = newY;
    } else if (dCode === "02") {
      curX = newX; curY = newY;
    } else if (dCode === "03") {
      const sz = apertures.get(curApt)?.size ?? 0.5;
      pads.push({ x: newX, y: newY, size: sz });
      curX = newX; curY = newY;
    }
  }

  return { traces, pads };
}

// ─────────────────────────────────────────────────────────────────────────────
// Excellon drill file parser
// Handles both fixed-format integer coords and explicit decimal-point coords.
// ─────────────────────────────────────────────────────────────────────────────
interface DrillHole { x: number; y: number; diameter: number }

function parseExcellonDrill(content: string): DrillHole[] {
  const holes: DrillHole[] = [];
  const tools  = new Map<string, number>(); // toolCode → diameter (mm)
  let curTool  = "";

  // Metric if header says METRIC or ,LZ / ,TZ
  const isMetric = /METRIC|,LZ|,TZ/i.test(content);
  const unitScale = isMetric ? 1.0 : 25.4;
  // Divisor for fixed-format: 3 decimal places in metric, 4 in imperial
  const divisor   = isMetric ? 1_000 : 10_000;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith(";") || line === "M48" || line === "M30" || line === "%") continue;

    // Tool definition:  T1C0.800  or  T01C1.0
    const toolDef = line.match(/^T(\d+)C([\d.]+)/);
    if (toolDef) {
      tools.set(toolDef[1], parseFloat(toolDef[2]) * unitScale);
      continue;
    }

    // Tool selection:  T1  (line is ONLY the tool number)
    const toolSel = line.match(/^T(\d+)$/);
    if (toolSel) { curTool = toolSel[1]; continue; }

    // Hole position:  X{n}Y{n}  — with or without decimal point
    const holeM = line.match(/^X(-?[\d.]+)Y(-?[\d.]+)/);
    if (holeM) {
      let x: number, y: number;
      if (holeM[1].includes(".") || holeM[2].includes(".")) {
        // Explicit decimal notation
        x = parseFloat(holeM[1]) * unitScale;
        y = parseFloat(holeM[2]) * unitScale;
      } else {
        // Fixed-format integer
        x = parseInt(holeM[1], 10) / divisor * unitScale;
        y = parseInt(holeM[2], 10) / divisor * unitScale;
      }
      holes.push({ x, y, diameter: tools.get(curTool) ?? 0.8 });
    }
  }

  return holes;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build GerberData from parsed layers
// ─────────────────────────────────────────────────────────────────────────────
function buildGerberData(
  outlineTraces: TraceSegment[],
  copperTraces:  TraceSegment[],
  pads:          PadPoint[],
  drillHoles:    DrillHole[],
): GerberData | null {
  // Collect all coordinates to derive bounding box
  const allX: number[] = [];
  const allY: number[] = [];

  const addPt = (x: number, y: number) => { allX.push(x); allY.push(y); };

  outlineTraces.forEach(s => { addPt(s.x1, s.y1); addPt(s.x2, s.y2); });
  copperTraces.forEach(s  => { addPt(s.x1, s.y1); addPt(s.x2, s.y2); });
  pads.forEach(p         => addPt(p.x, p.y));
  drillHoles.forEach(h   => addPt(h.x, h.y));

  if (allX.length === 0) return null;

  const minX = allX.reduce((a, b) => Math.min(a, b), Infinity);
  const maxX = allX.reduce((a, b) => Math.max(a, b), -Infinity);
  const minY = allY.reduce((a, b) => Math.min(a, b), Infinity);
  const maxY = allY.reduce((a, b) => Math.max(a, b), -Infinity);
  const width  = maxX - minX;
  const height = maxY - minY;

  if (width < 0.1 || height < 0.1) return null; // too small to be a real board

  return {
    outline:    outlineTraces.slice(0, 3000),
    topTraces:  copperTraces.slice(0, 3000),
    pads:       pads.slice(0, 600),
    drillHoles: drillHoles.slice(0, 400),
    boardBounds: { minX, maxX, minY, maxY, width, height },
    hasRealData: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Layer-type heuristic (filename → human label)
// ─────────────────────────────────────────────────────────────────────────────
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
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function GerberViewer({ file, fileUrl, boardTitle, pcbImage }: GerberViewerProps) {
  const [layers,      setLayers]      = useState<GerberLayer[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [gerberData,  setGerberData]  = useState<GerberData | null>(null);
  const [parseStatus, setParseStatus] = useState<"idle" | "parsing" | "done" | "partial">("idle");

  useEffect(() => {
    if (!file && !fileUrl) {
      setLayers([]);
      setGerberData(null);
      setParseStatus("idle");
      return;
    }

    const inspectZip = async () => {
      setLoading(true);
      setError("");
      setLayers([]);
      setGerberData(null);
      setParseStatus("parsing");

      try {
        let zipBuffer: ArrayBuffer | File | null = file || null;
        if (!zipBuffer && fileUrl) {
          const res = await fetch(fileUrl);
          if (!res.ok) throw new Error(`Failed to download Gerber zip (${res.status})`);
          zipBuffer = await res.arrayBuffer();
        }

        if (!zipBuffer) return;

        const zip     = new JSZip();
        const zipData = await zip.loadAsync(zipBuffer);

        const gerberExtensions = [
          ".gbr", ".grb", ".drl", ".gbl", ".gtl",
          ".gto", ".gbo", ".gts", ".gbs", ".gko", ".gm1", ".txt",
        ];

        const foundLayers: GerberLayer[] = [];

        // Categorise files we care about for deep parsing
        let outlineFile   = "";
        let topCopperFile = "";
        let drillFile     = "";

        // Priority scoring — pick the best match per category
        let outlinePrio   = 0;
        let topCopperPrio = 0;
        let drillPrio     = 0;

        for (const [filename, fileObj] of Object.entries(zipData.files)) {
          if (fileObj.dir) continue;

          const lowerName = filename.toLowerCase();
          const baseName  = (filename.split("/").pop() ?? filename).toLowerCase();

          if (!gerberExtensions.some((ext) => lowerName.endsWith(ext))) continue;

          const type = detectLayerType(baseName);
          foundLayers.push({ name: filename.split("/").pop() ?? filename, type, size: 0 });

          // Score each candidate so we always pick the most specific match
          if (type === "Board Outline") {
            const p = baseName.includes("gko") ? 3 : baseName.includes("gm1") ? 2 : 1;
            if (p > outlinePrio) { outlineFile = filename; outlinePrio = p; }
          }
          if (type === "Top Copper") {
            const p = baseName.includes("gtl") ? 3 : baseName.includes("top") ? 2 : 1;
            if (p > topCopperPrio) { topCopperFile = filename; topCopperPrio = p; }
          }
          if (type === "NC Drill File") {
            const p = baseName.includes("drl") ? 3 : baseName.includes("drill") ? 2 : 1;
            if (p > drillPrio) { drillFile = filename; drillPrio = p; }
          }

          // If no explicit outline yet, try any .gbr/.grb with "outline" or "edge"
          if (!outlineFile && (baseName.includes("outline") || baseName.includes("edge"))) {
            outlineFile = filename;
          }
        }

        if (foundLayers.length === 0) {
          setError("No valid Gerber or Drill files found inside the ZIP.");
          setParseStatus("idle");
          return;
        }

        foundLayers.sort((a, b) => a.type.localeCompare(b.type));
        setLayers(foundLayers);

        // ── Deep parse key layers ─────────────────────────────────────────
        const readText = async (path: string) => {
          if (!path) return "";
          try { return await zipData.files[path].async("text"); }
          catch { return ""; }
        };

        const [outlineContent, copperContent, drillContent] = await Promise.all([
          readText(outlineFile),
          readText(topCopperFile),
          readText(drillFile),
        ]);

        const outlineParsed = outlineContent ? parseGerberContent(outlineContent) : { traces: [], pads: [] };
        const copperParsed  = copperContent  ? parseGerberContent(copperContent)  : { traces: [], pads: [] };
        const drillHoles    = drillContent   ? parseExcellonDrill(drillContent)   : [];

        const data = buildGerberData(
          outlineParsed.traces,
          copperParsed.traces,
          copperParsed.pads,
          drillHoles,
        );

        if (data) {
          setGerberData(data);
          setParseStatus("done");
        } else {
          // Layers listed but geometry couldn't be extracted (older format?)
          setParseStatus("partial");
        }

      } catch (err: any) {
        console.error("Error inspecting Gerber zip:", err);
        setError(err.message ?? "Failed to extract ZIP file.");
        setParseStatus("idle");
      } finally {
        setLoading(false);
      }
    };

    inspectZip();
  }, [file]);

  if (!file) return null;

  return (
    <>
      <div className="w-full bg-[#1A3C2F] rounded-xl border border-[#C4A35A]/30 overflow-hidden relative mt-4 shadow-xl">
        <div className="bg-[#102A20] px-4 py-2.5 flex items-center gap-3 border-b border-[#C4A35A]/20">
          {/* Left: title — can shrink */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Cpu className="w-4 h-4 text-[#C4A35A] shrink-0" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest truncate">
              PCB Gerber Inspector
            </h3>
          </div>

          {/* Right: badges + button — never wrap */}
          {!loading && !error && layers.length > 0 && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="whitespace-nowrap text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20 leading-5">
                {layers.length} Layers
              </span>

              {parseStatus === "done" && (
                <span className="whitespace-nowrap text-[10px] font-bold text-[#C4A35A] bg-[#C4A35A]/10 px-2 py-0.5 rounded border border-[#C4A35A]/20 flex items-center gap-1 leading-5">
                  <Zap className="w-2.5 h-2.5 shrink-0" /> 3D Ready
                </span>
              )}
              {parseStatus === "partial" && (
                <span className="whitespace-nowrap text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20 leading-5">
                  Preview
                </span>
              )}

              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="whitespace-nowrap text-[10px] font-bold text-white bg-[#C4A35A]/20 hover:bg-[#C4A35A]/30 px-2 py-0.5 rounded border border-[#C4A35A]/30 flex items-center gap-1 transition-colors cursor-pointer leading-5"
              >
                <Eye className="w-2.5 h-2.5 text-[#C4A35A] shrink-0" />
                View 3D
              </button>
            </div>
          )}
        </div>

        <div className="p-6 relative min-h-[200px]">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#C4A35A] mb-3" />
              <p className="text-sm font-bold text-white/80">
                {parseStatus === "parsing" ? "Parsing Gerber layers…" : "Scanning Manufacturing Files…"}
              </p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10">
              <p className="text-sm font-bold text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && layers.length > 0 && (
            <div className="space-y-3 relative z-10 max-h-[300px] overflow-y-auto pr-2">
              {layers.map((layer, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
                >
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
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(#C4A35A 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          />
        </div>
      </div>

      {/* 3D Visualizer Modal */}
      <AnimatePresence>
        {showPreview && (
          <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A3C2F] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-[#C4A35A]/30 relative flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-[#102A20] px-6 py-4 border-b border-[#C4A35A]/20 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-[#C4A35A]" />
                  <div className="min-w-0">
                    <h2 className="font-extrabold text-sm text-white uppercase tracking-wider">PCB Gerber 3D Visualizer</h2>
                    <p className="text-[10px] text-[#FAF8F5]/60 mt-0.5 truncate max-w-[400px]">
                      {file?.name}
                      {gerberData && (
                        <span className="ml-2 text-[#C4A35A]">
                          · {gerberData.boardBounds.width.toFixed(1)} × {gerberData.boardBounds.height.toFixed(1)} mm
                          · {gerberData.topTraces.length} traces
                          · {gerberData.drillHoles.length} holes
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body — PcbViewer3D now receives real Gerber data */}
              <div className="p-6 bg-[#0E241C]">
                <PcbViewer3D
                  boardTitle={boardTitle ?? file?.name.replace(/\.[^/.]+$/, "") ?? "Uploaded PCB"}
                  pcbImage={pcbImage}
                  gerberData={gerberData}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
