"use client";

import React, { useState, useRef, useEffect } from "react";
import { Cpu, RotateCcw, Layers, ShieldCheck, Box, AlertTriangle, Eye, EyeOff, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ── Enhanced Gerber Data Structures (1:1 PCBWay Style Layers) ────────────────
export interface GerberPad {
  x: number;
  y: number;
  shape: "C" | "R" | "O" | "P";
  w: number;
  h: number;
}

export interface GerberTrace {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
}

export interface GerberData {
  outline: GerberTrace[];
  topTraces: GerberTrace[];
  topPads: GerberPad[];
  bottomTraces: GerberTrace[];
  bottomPads: GerberPad[];
  topSilkscreen: GerberTrace[];
  bottomSilkscreen: GerberTrace[];
  drillHoles: Array<{ x: number; y: number; diameter: number }>;
  boardBounds: {
    minX: number; maxX: number;
    minY: number; maxY: number;
    width: number; height: number;
  };
  parsedLayerNames: string[];
  hasRealData: boolean;
  isComplete: boolean;
}

interface PcbViewer3DProps {
  boardTitle?: string;
  pcbImage?: string | null;
  gerberData?: GerberData | null;
  layers?: Array<{ name: string; type: string; size: number }>;
}

export function PcbViewer3D({
  boardTitle = "Creato4 Custom PCB",
  pcbImage,
  gerberData,
  layers = [],
}: PcbViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 25, y: -35 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Layer Toggles
  const [showTopCopper, setShowTopCopper] = useState(true);
  const [showBottomCopper, setShowBottomCopper] = useState(true);
  const [showSilkscreen, setShowSilkscreen] = useState(true);
  const [showDrills, setShowDrills] = useState(true);
  const [showOutline, setShowOutline] = useState(true);
  const [colorMode, setColorMode] = useState<"emerald" | "matte" | "blue">("emerald");
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const hasRealGerber = !!(
    gerberData?.hasRealData &&
    (gerberData.outline.length > 0 ||
      gerberData.topTraces.length > 0 ||
      gerberData.topPads.length > 0 ||
      gerberData.topSilkscreen.length > 0 ||
      gerberData.drillHoles.length > 0)
  );

  const isCompleteRender = !!(hasRealGerber && gerberData?.isComplete !== false);

  // 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      // Center PCB down-left so top-right dropdowns never obscure the board
      ctx.translate(w / 2 - 35, h / 2 + 25);

      const radX = (rotation.x * Math.PI) / 180;
      const radY = (rotation.y * Math.PI) / 180;

      const pcbVW = 260;
      const pcbVH = 160;
      const pcbDepth = 8;
      const W2 = pcbVW / 2;
      const H2 = pcbVH / 2;

      // Color Palette
      const boardBg =
        colorMode === "emerald" ? "#1B4332"
        : colorMode === "matte" ? "#1E1E1E"
        : "#0D3B66";
      const boardEdge =
        colorMode === "emerald" ? "#0D2B1D"
        : colorMode === "matte" ? "#121212"
        : "#082440";
      const topCopperCol =
        colorMode === "emerald" ? "rgba(212, 175, 55, 0.85)"
        : colorMode === "matte" ? "rgba(220, 220, 255, 0.70)"
        : "rgba(100, 180, 255, 0.80)";
      const botCopperCol = "rgba(184, 115, 51, 0.60)";
      const padGold = "#D4AF37";
      const silkWhite = "#FFFFFF";

      // 3D Projection
      const project = (x: number, y: number, z: number) => {
        const cosX = Math.cos(radX), sinX = Math.sin(radX);
        const cosY = Math.cos(radY), sinY = Math.sin(radY);
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;
        const x2 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;
        return { px: x2, py: y1 };
      };

      // Transform Gerber mm coordinates to canvas space
      const gb = gerberData?.boardBounds;
      const toV = (gx: number, gy: number) => {
        if (!gb || gb.width < 0.001 || gb.height < 0.001) return { vx: gx, vy: gy };
        const sx = (pcbVW * 0.86) / gb.width;
        const sy = (pcbVH * 0.86) / gb.height;
        const s = Math.min(sx, sy);
        const cx = (gb.minX + gb.maxX) / 2;
        const cy = (gb.minY + gb.maxY) / 2;
        return {
          vx: (gx - cx) * s,
          vy: -(gy - cy) * s,
          scale: s,
        };
      };

      // Bottom face
      {
        const pts = [
          project(-W2, -H2, -pcbDepth),
          project(W2, -H2, -pcbDepth),
          project(W2, H2, -pcbDepth),
          project(-W2, H2, -pcbDepth),
        ];
        ctx.beginPath();
        ctx.moveTo(pts[0].px, pts[0].py);
        pts.slice(1).forEach((p) => ctx.lineTo(p.px, p.py));
        ctx.closePath();
        ctx.fillStyle = boardEdge;
        ctx.fill();
      }

      // Top face
      {
        const t1 = project(-W2, -H2, 0);
        const t2 = project(W2, -H2, 0);
        const t3 = project(W2, H2, 0);
        const t4 = project(-W2, H2, 0);
        ctx.beginPath();
        ctx.moveTo(t1.px, t1.py);
        ctx.lineTo(t2.px, t2.py);
        ctx.lineTo(t3.px, t3.py);
        ctx.lineTo(t4.px, t4.py);
        ctx.closePath();
        const grad = ctx.createLinearGradient(t1.px, t1.py, t3.px, t3.py);
        grad.addColorStop(0, boardBg);
        grad.addColorStop(0.5, colorMode === "emerald" ? "#234D3B" : colorMode === "matte" ? "#2C2C2C" : "#104F85");
        grad.addColorStop(1, boardEdge);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = padGold;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── Real Gerber Data Layers ──────────────────────────────────────────
      if (hasRealGerber && gerberData) {

        // 1. Board Outline (Edge Cuts)
        if (showOutline && gerberData.outline.length > 0) {
          ctx.strokeStyle = padGold;
          ctx.lineWidth = 1.8;
          gerberData.outline.forEach((seg) => {
            const { vx: vx1, vy: vy1 } = toV(seg.x1, seg.y1);
            const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
            if (Math.abs(vx2 - vx1) + Math.abs(vy2 - vy1) < 0.05) return;
            const p1 = project(vx1, vy1, 1);
            const p2 = project(vx2, vy2, 1);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          });
        }

        // 2. Bottom Copper Layer
        if (showBottomCopper && (gerberData.bottomTraces.length > 0 || gerberData.bottomPads.length > 0)) {
          ctx.strokeStyle = botCopperCol;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          gerberData.bottomTraces.forEach((seg) => {
            const { vx: vx1, vy: vy1 } = toV(seg.x1, seg.y1);
            const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
            const p1 = project(vx1, vy1, -0.5);
            const p2 = project(vx2, vy2, -0.5);
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
          });
          ctx.stroke();
        }

        // 3. Top Copper Traces
        if (showTopCopper && gerberData.topTraces.length > 0) {
          ctx.strokeStyle = topCopperCol;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          gerberData.topTraces.forEach((seg) => {
            const { vx: vx1, vy: vy1, scale } = toV(seg.x1, seg.y1);
            const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
            if (Math.abs(vx2 - vx1) + Math.abs(vy2 - vy1) < 0.05) return;
            const p1 = project(vx1, vy1, 1.2);
            const p2 = project(vx2, vy2, 1.2);
            ctx.lineWidth = Math.max(1.0, (seg.width || 0.2) * (scale || 2));
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          });
        }

        // 4. Top Copper Pads (Rectangular, Obround & Circular)
        if (showTopCopper && gerberData.topPads.length > 0) {
          gerberData.topPads.forEach((pad) => {
            const { vx, vy, scale } = toV(pad.x, pad.y);
            const p = project(vx, vy, 1.8);
            const pw = Math.max(2, (pad.w || 0.8) * (scale || 2.2));
            const ph = Math.max(2, (pad.h || 0.8) * (scale || 2.2));

            ctx.fillStyle = padGold;

            if (pad.shape === "R" || pad.shape === "O") {
              ctx.beginPath();
              ctx.rect(p.px - pw / 2, p.py - ph / 2, pw, ph);
              ctx.fill();
              ctx.strokeStyle = "#8A6D1C";
              ctx.lineWidth = 0.5;
              ctx.stroke();
            } else {
              const r = Math.max(1.8, Math.min(8, (pad.w || 0.8) * (scale || 2.2) * 0.5));
              ctx.beginPath();
              ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(p.px, p.py, r * 0.4, 0, Math.PI * 2);
              ctx.fillStyle = "#1A1A1A";
              ctx.fill();
            }
          });
        }

        // 5. Silkscreen Top Layer (Component Designators J1, J2, Q1, Q2, U1, R1, R2, R3, C2, etc.)
        if (showSilkscreen && gerberData.topSilkscreen.length > 0) {
          ctx.strokeStyle = silkWhite;
          ctx.fillStyle = silkWhite;
          ctx.lineWidth = 1.0;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          gerberData.topSilkscreen.forEach((seg) => {
            const { vx: vx1, vy: vy1 } = toV(seg.x1, seg.y1);
            const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
            if (Math.abs(vx2 - vx1) + Math.abs(vy2 - vy1) < 0.02) return;
            const p1 = project(vx1, vy1, 2.2);
            const p2 = project(vx2, vy2, 2.2);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          });
        }

        // 6. Drill Holes & Plated Vias
        if (showDrills && gerberData.drillHoles.length > 0) {
          gerberData.drillHoles.forEach((h) => {
            const { vx, vy, scale } = toV(h.x, h.y);
            const p = project(vx, vy, 1.0);
            const r = Math.max(1.5, Math.min(6, (h.diameter || 0.8) * (scale || 2.0) * 0.4));
            ctx.beginPath();
            ctx.arc(p.px, p.py, r * 1.6, 0, Math.PI * 2);
            ctx.fillStyle = padGold;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.px, p.py, r * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = "#0A0A0A";
            ctx.fill();
          });
        }

        // Board Title Label
        const ctr = project(0, 0, 2.4);
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(boardTitle.slice(0, 32).toUpperCase(), ctr.px, ctr.py);

      } else {
        const ctr = project(0, 0, 2);
        ctx.fillStyle = "rgba(255, 180, 0, 0.75)";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Incomplete Gerber Data — Layer missing or unreadable", ctr.px, ctr.py);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => { cancelAnimationFrame(animationFrameId); };
  }, [
    rotation, showTopCopper, showBottomCopper, showSilkscreen, showDrills, showOutline,
    colorMode, gerberData, hasRealGerber, boardTitle
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotation((prev) => ({ x: prev.x + dy * 0.4, y: prev.y + dx * 0.4 }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#0E241C] text-white p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 z-20 shrink-0 pr-12">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Cpu className="w-3.5 h-3.5 text-[#C4A35A]" />
            <span className="text-[0.65rem] font-bold text-[#C4A35A] uppercase tracking-widest">
              {isCompleteRender ? "3D Gerber Inspector" : "Hardware Inspector"}
            </span>
          </div>
          <h3 className="text-base font-black text-white tracking-tight leading-snug">{boardTitle}</h3>
          <p className="text-[0.68rem] text-white/60">
            {hasRealGerber && gerberData?.boardBounds
              ? `Board: ${gerberData.boardBounds.width.toFixed(1)} × ${gerberData.boardBounds.height.toFixed(1)} mm — drag to rotate`
              : "Click & drag to rotate board in 3D space"}
          </p>
        </div>

        {/* Clean Controls Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setShowTopCopper(!showTopCopper)}
            className={`px-2.5 py-1.5 rounded-xl text-[0.68rem] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              showTopCopper ? "bg-[#C4A35A] text-[#1A3C2F]" : "bg-white/10 text-white/50"
            }`}
            title="Toggle Top Copper Layer"
          >
            {showTopCopper ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Top Cu
          </button>

          <button
            onClick={() => setShowSilkscreen(!showSilkscreen)}
            className={`px-2.5 py-1.5 rounded-xl text-[0.68rem] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              showSilkscreen ? "bg-white text-[#1A3C2F]" : "bg-white/10 text-white/50"
            }`}
            title="Toggle Silkscreen Component Designators (J1, Q1, U1, R1, C2)"
          >
            {showSilkscreen ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Silk Labels
          </button>

          <button
            onClick={() => setShowBottomCopper(!showBottomCopper)}
            className={`px-2.5 py-1.5 rounded-xl text-[0.68rem] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              showBottomCopper ? "bg-amber-700 text-white" : "bg-white/10 text-white/50"
            }`}
            title="Toggle Bottom Copper Layer"
          >
            {showBottomCopper ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Bot Cu
          </button>

          <button
            onClick={() => setShowDrills(!showDrills)}
            className={`px-2.5 py-1.5 rounded-xl text-[0.68rem] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              showDrills ? "bg-teal-600 text-white" : "bg-white/10 text-white/50"
            }`}
            title="Toggle Drill Vias & Holes"
          >
            {showDrills ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Drills
          </button>

          <button
            onClick={() => setRotation({ x: 25, y: -35 })}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
            title="Reset Camera Angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 w-full bg-[#091712] rounded-2xl border border-white/10 flex items-center justify-center relative cursor-grab active:cursor-grabbing overflow-hidden min-h-[300px]"
      >
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full h-full object-contain"
        />

        {/* ── Layer (8) Icon Floating in Top Right Corner inside Live PCB Screen ── */}
        {layers.length > 0 && (
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="flex items-center gap-1.5 bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xl"
            >
              <Layers className="w-3.5 h-3.5 text-[#C4A35A]" />
              <span>Layers ({layers.length})</span>
            </button>

            <AnimatePresence>
              {showLayerMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-2 w-60 bg-black/75 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl space-y-1.5 max-h-48 overflow-y-auto z-40"
                >
                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/10">
                    <span className="text-[0.65rem] font-black text-[#C4A35A] uppercase tracking-wider">Gerber Stackup</span>
                    <button
                      onClick={() => setShowLayerMenu(false)}
                      className="p-1 text-white/50 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {layers.map((l, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="font-medium text-white/90 truncate max-w-[130px]">{l.name}</span>
                      <span className="text-[0.6rem] text-[#C4A35A] font-mono">{l.type}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Color Switcher */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-10">
          <button
            onClick={() => setColorMode("emerald")}
            className={`w-3.5 h-3.5 rounded-full bg-emerald-600 border ${
              colorMode === "emerald" ? "border-white scale-110" : "border-transparent"
            }`}
            title="Emerald Mask"
          />
          <button
            onClick={() => setColorMode("matte")}
            className={`w-3.5 h-3.5 rounded-full bg-neutral-800 border ${
              colorMode === "matte" ? "border-white scale-110" : "border-transparent"
            }`}
            title="Matte Black Mask"
          />
          <button
            onClick={() => setColorMode("blue")}
            className={`w-3.5 h-3.5 rounded-full bg-blue-700 border ${
              colorMode === "blue" ? "border-white scale-110" : "border-transparent"
            }`}
            title="Royal Blue Mask"
          />
        </div>

        {/* Strict Integrity Badge */}
        <div className="absolute bottom-3 right-3 text-[0.6rem] font-bold uppercase tracking-widest flex items-center gap-1 z-10">
          {isCompleteRender ? (
            <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> REAL GERBER DATA
            </span>
          ) : (
            <span className="text-[#C4A35A] bg-amber-950/80 border border-[#C4A35A]/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
              <AlertTriangle className="w-3.5 h-3.5 text-[#C4A35A]" /> INCOMPLETE DATA
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
