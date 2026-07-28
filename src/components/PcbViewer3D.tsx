"use client";

import React, { useState, useRef, useEffect } from "react";
import { Cpu, RotateCcw, Layers, ShieldCheck, Box } from "lucide-react";

// ── Shared Gerber data types (also imported by GerberViewer) ─────────────────
export interface GerberData {
  /** Line segments from board-outline layer (Edge.Cuts / .GKO / .GM1) */
  outline: Array<{ x1: number; y1: number; x2: number; y2: number }>;
  /** Copper trace segments from the top copper layer (.GTL) */
  topTraces: Array<{ x1: number; y1: number; x2: number; y2: number; width: number }>;
  /** Pad / flash locations */
  pads: Array<{ x: number; y: number; size: number }>;
  /** Through-hole drill positions */
  drillHoles: Array<{ x: number; y: number; diameter: number }>;
  /** Bounding box of all geometry in mm */
  boardBounds: {
    minX: number; maxX: number;
    minY: number; maxY: number;
    width: number; height: number;
  };
  hasRealData: boolean;
}

interface PcbViewer3DProps {
  boardTitle?: string;
  pcbImage?: string | null;
  gerberData?: GerberData | null;
}

export function PcbViewer3D({
  boardTitle = "Creato4 Custom PCB",
  pcbImage,
  gerberData,
}: PcbViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 25, y: -35 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showComponents, setShowComponents] = useState(true);
  const [showTraces, setShowTraces] = useState(true);
  const [colorMode, setColorMode] = useState<"emerald" | "matte" | "blue">("emerald");

  const hasRealGerber = !!(
    gerberData?.hasRealData &&
    (gerberData.outline.length > 0 ||
      gerberData.topTraces.length > 0 ||
      gerberData.pads.length > 0 ||
      gerberData.drillHoles.length > 0)
  );

  // Canvas 3D rendering loop
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
      ctx.translate(w / 2, h / 2);

      const radX = (rotation.x * Math.PI) / 180;
      const radY = (rotation.y * Math.PI) / 180;

      // Virtual canvas coordinate extents for the board
      const pcbVW = 250;
      const pcbVH = 150;
      const pcbDepth = 8;
      const W2 = pcbVW / 2;
      const H2 = pcbVH / 2;

      // ── Color palette ──────────────────────────────────────────────────
      const boardBg =
        colorMode === "emerald" ? "#1B4332"
        : colorMode === "matte" ? "#1E1E1E"
        : "#0D3B66";
      const boardEdge =
        colorMode === "emerald" ? "#0D2B1D"
        : colorMode === "matte" ? "#121212"
        : "#082440";
      const traceCol =
        colorMode === "emerald" ? "rgba(196,163,90,0.72)"
        : colorMode === "matte" ? "rgba(220,220,255,0.50)"
        : "rgba(80,170,255,0.65)";
      const padGold = "#D4AF37";

      // ── 3-D projection ─────────────────────────────────────────────────
      const project = (x: number, y: number, z: number) => {
        const cosX = Math.cos(radX), sinX = Math.sin(radX);
        const cosY = Math.cos(radY), sinY = Math.sin(radY);
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;
        const x2 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;
        return { px: x2, py: y1 };
      };

      // ── Gerber-mm → virtual-canvas-space transform ──────────────────────
      // Maps real board coordinates (mm) to the virtual ±W2/±H2 space so
      // the project() function can render them in the right place.
      const gb = gerberData?.boardBounds;
      const toV = (gx: number, gy: number) => {
        if (!gb || gb.width < 0.001 || gb.height < 0.001) return { vx: gx, vy: gy };
        const sx = (pcbVW * 0.86) / gb.width;
        const sy = (pcbVH * 0.86) / gb.height;
        const s = Math.min(sx, sy); // uniform scale – preserve aspect ratio
        const cx = (gb.minX + gb.maxX) / 2;
        const cy = (gb.minY + gb.maxY) / 2;
        return {
          vx: (gx - cx) * s,
          vy: -(gy - cy) * s, // flip Y: Gerber Y+ up, canvas Y+ down
        };
      };

      // ── Draw PCB board body ─────────────────────────────────────────────

      // Bottom face (darker)
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

      // Top surface with gradient
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
        grad.addColorStop(
          0.45,
          colorMode === "emerald" ? "#234D3B"
          : colorMode === "matte" ? "#2C2C2C"
          : "#104F85"
        );
        grad.addColorStop(1, boardEdge);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = padGold;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── Real Gerber board rendering ─────────────────────────────────────
      if (hasRealGerber && gerberData) {

        // Board outline (gold border, drawn on the top surface)
        if (gerberData.outline.length > 0) {
          ctx.strokeStyle = padGold;
          ctx.lineWidth = 1.8;
          gerberData.outline.forEach((seg) => {
            const { vx: vx1, vy: vy1 } = toV(seg.x1, seg.y1);
            const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
            // Skip degenerate segments
            if (Math.abs(vx2 - vx1) + Math.abs(vy2 - vy1) < 0.05) return;
            const p1 = project(vx1, vy1, 1);
            const p2 = project(vx2, vy2, 1);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          });
        }

        // Copper traces — batched into a single path for performance
        if (showTraces && gerberData.topTraces.length > 0) {
          ctx.strokeStyle = traceCol;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          gerberData.topTraces.forEach((seg) => {
            const { vx: vx1, vy: vy1 } = toV(seg.x1, seg.y1);
            const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
            if (Math.abs(vx2 - vx1) + Math.abs(vy2 - vy1) < 0.05) return;
            const p1 = project(vx1, vy1, 1.5);
            const p2 = project(vx2, vy2, 1.5);
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
          });
          ctx.stroke();
        }

        // SMD / through-hole pads (shown as gold rings)
        if (showComponents && gerberData.pads.length > 0) {
          gerberData.pads.forEach((pad) => {
            const { vx, vy } = toV(pad.x, pad.y);
            const p = project(vx, vy, 2);
            const r = Math.max(2, Math.min(7, (pad.size || 1) * 2.5));
            ctx.beginPath();
            ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
            ctx.fillStyle = padGold;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.px, p.py, r * 0.38, 0, Math.PI * 2);
            ctx.fillStyle = "#1A1A1A";
            ctx.fill();
          });
        }

        // Drill holes (gold annular ring + dark center)
        gerberData.drillHoles.forEach((h) => {
          const { vx, vy } = toV(h.x, h.y);
          const p = project(vx, vy, 1);
          const r = Math.max(1.5, Math.min(5, (h.diameter || 0.8) * 2.2));
          ctx.beginPath();
          ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
          ctx.fillStyle = padGold;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.px, p.py, r * 0.52, 0, Math.PI * 2);
          ctx.fillStyle = "#0A0A0A";
          ctx.fill();
        });

        // Subtle watermark label
        const ctr = project(0, 0, 2);
        ctx.fillStyle = "rgba(255,255,255,0.10)";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(boardTitle.slice(0, 28).toUpperCase(), ctr.px, ctr.py);

      } else {
        // ── Generic / placeholder rendering (no Gerber file) ─────────────

        if (showTraces) {
          ctx.strokeStyle =
            colorMode === "emerald" ? "rgba(196, 163, 90, 0.4)" : "rgba(255, 255, 255, 0.3)";
          ctx.lineWidth = 2;

          const traceSegs = [
            [-90, -40, -90, 40],
            [-90, 40, -30, 40],
            [-30, 40, -30, -40],
            [30, -50, 30, 50],
            [30, 50, 90, 50],
            [90, 50, 90, -50],
          ];
          traceSegs.forEach(([x1, y1, x2, y2]) => {
            const p1 = project(x1, y1, 1);
            const p2 = project(x2, y2, 1);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          });

          // Corner mounting holes
          const holes: [number, number][] = [
            [-W2 + 15, -H2 + 15],
            [W2 - 15, -H2 + 15],
            [W2 - 15, H2 - 15],
            [-W2 + 15, H2 - 15],
          ];
          holes.forEach(([hx, hy]) => {
            const hp = project(hx, hy, 1);
            ctx.beginPath();
            ctx.arc(hp.px, hp.py, 6, 0, Math.PI * 2);
            ctx.fillStyle = padGold;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(hp.px, hp.py, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#111";
            ctx.fill();
          });
        }

        // MCU chip block + header pins
        if (showComponents) {
          const chipW = 55, chipH = 55, chipZ = 12;
          const pts = [
            project(-chipW / 2, -chipH / 2, chipZ),
            project(chipW / 2, -chipH / 2, chipZ),
            project(chipW / 2, chipH / 2, chipZ),
            project(-chipW / 2, chipH / 2, chipZ),
          ];
          ctx.beginPath();
          ctx.moveTo(pts[0].px, pts[0].py);
          pts.slice(1).forEach((p) => ctx.lineTo(p.px, p.py));
          ctx.closePath();
          ctx.fillStyle = "#111111";
          ctx.fill();
          ctx.strokeStyle = "#333333";
          ctx.lineWidth = 1;
          ctx.stroke();

          const ctr = project(0, 0, chipZ + 1);
          ctx.fillStyle = "#E0E0E0";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText("CREATO4 MCU", ctr.px, ctr.py + 3);

          for (let i = -80; i <= 80; i += 20) {
            const pin = project(i, -H2 + 12, 10);
            ctx.beginPath();
            ctx.arc(pin.px, pin.py, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#D4AF37";
            ctx.fill();
          }
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => { cancelAnimationFrame(animationFrameId); };
  }, [rotation, showComponents, showTraces, colorMode, gerberData, hasRealGerber, boardTitle]);

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
    <div className="bg-[#1A3C2F] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-[#C4A35A]/30">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#C4A35A]/10 rounded-full blur-3xl" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-[#C4A35A]" />
            <span className="text-[0.65rem] font-bold text-[#C4A35A] uppercase tracking-widest">
              {hasRealGerber ? "3D Live Inspection" : "3D Interactive Inspection"}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">{boardTitle}</h3>
          <p className="text-xs text-[#FAF8F5]/60 mt-0.5">
            {hasRealGerber
              ? `Board: ${gerberData!.boardBounds.width.toFixed(1)} × ${gerberData!.boardBounds.height.toFixed(1)} mm — drag to rotate`
              : "Click & drag mouse to rotate board in 3D space"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTraces(!showTraces)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              showTraces ? "bg-[#C4A35A] text-[#1A3C2F]" : "bg-white/10 text-white"
            }`}
            title="Toggle Copper Traces"
          >
            <Layers className="w-3.5 h-3.5" /> Traces
          </button>

          <button
            onClick={() => setShowComponents(!showComponents)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              showComponents ? "bg-[#C4A35A] text-[#1A3C2F]" : "bg-white/10 text-white"
            }`}
            title="Toggle 3D Components"
          >
            <Box className="w-3.5 h-3.5" /> 3D ICs
          </button>

          <button
            onClick={() => setRotation({ x: 25, y: -35 })}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-[320px] bg-[#0E241C] rounded-2xl border border-white/10 flex items-center justify-center relative cursor-grab active:cursor-grabbing overflow-hidden shadow-inner"
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={320}
          className="w-full h-full object-contain"
        />

        {/* Color Palette Switcher */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
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

        <div className="absolute bottom-3 right-3 text-[0.6rem] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#C4A35A]" />
          {hasRealGerber ? "Real Gerber Data" : "PCB Gerber Engine"}
        </div>
      </div>
    </div>
  );
}
