"use client";

import React, { useState, useRef, useEffect } from "react";
import { Cpu, RotateCcw, Layers, Eye, ShieldCheck, Box } from "lucide-react";

interface PcbViewer3DProps {
  boardTitle?: string;
  pcbImage?: string | null;
}

export function PcbViewer3D({ boardTitle = "Creato4 Custom PCB", pcbImage }: PcbViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 25, y: -35 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showComponents, setShowComponents] = useState(true);
  const [showTraces, setShowTraces] = useState(true);
  const [colorMode, setColorMode] = useState<"emerald" | "matte" | "blue">("emerald");

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

      // Simple 3D projection matrix simulation
      const radX = (rotation.x * Math.PI) / 180;
      const radY = (rotation.y * Math.PI) / 180;

      const pcbWidth = 260;
      const pcbHeight = 160;
      const pcbDepth = 8;

      // Color Palette based on colorMode
      const boardBg = colorMode === "emerald" ? "#1B4332" : colorMode === "matte" ? "#1E1E1E" : "#0D3B66";
      const boardBorder = colorMode === "emerald" ? "#0D2B1D" : colorMode === "matte" ? "#121212" : "#082440";
      const traceColor = colorMode === "emerald" ? "rgba(196, 163, 90, 0.4)" : "rgba(255, 255, 255, 0.3)";
      const padColor = "#D4AF37"; // Gold

      // Isometric projection helper
      const project = (x: number, y: number, z: number) => {
        const cosX = Math.cos(radX);
        const sinX = Math.sin(radX);
        const cosY = Math.cos(radY);
        const sinY = Math.sin(radY);

        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;

        const x2 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;

        return {
          px: x2,
          py: y1,
          scale: 300 / (300 + z2),
        };
      };

      // 1. Render PCB Bottom Base (Thickness shadow)
      ctx.beginPath();
      const b1 = project(-pcbWidth / 2, -pcbHeight / 2, -pcbDepth);
      const b2 = project(pcbWidth / 2, -pcbHeight / 2, -pcbDepth);
      const b3 = project(pcbWidth / 2, pcbHeight / 2, -pcbDepth);
      const b4 = project(-pcbWidth / 2, pcbHeight / 2, -pcbDepth);

      ctx.moveTo(b1.px, b1.py);
      ctx.lineTo(b2.px, b2.py);
      ctx.lineTo(b3.px, b3.py);
      ctx.lineTo(b4.px, b4.py);
      ctx.closePath();
      ctx.fillStyle = boardBorder;
      ctx.fill();

      // 2. Render PCB Top Surface
      const t1 = project(-pcbWidth / 2, -pcbHeight / 2, 0);
      const t2 = project(pcbWidth / 2, -pcbHeight / 2, 0);
      const t3 = project(pcbWidth / 2, pcbHeight / 2, 0);
      const t4 = project(-pcbWidth / 2, pcbHeight / 2, 0);

      ctx.beginPath();
      ctx.moveTo(t1.px, t1.py);
      ctx.lineTo(t2.px, t2.py);
      ctx.lineTo(t3.px, t3.py);
      ctx.lineTo(t4.px, t4.py);
      ctx.closePath();

      // Solder Mask Gradient
      const grad = ctx.createLinearGradient(t1.px, t1.py, t3.px, t3.py);
      grad.addColorStop(0, boardBg);
      grad.addColorStop(1, boardBorder);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = padColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Render Copper Traces
      if (showTraces) {
        ctx.strokeStyle = traceColor;
        ctx.lineWidth = 2;

        const tracePoints = [
          [-90, -40, -90, 40],
          [-90, 40, -30, 40],
          [-30, 40, -30, -40],
          [30, -50, 30, 50],
          [30, 50, 90, 50],
          [90, 50, 90, -50],
        ];

        tracePoints.forEach(([x1, y1, x2, y2]) => {
          const p1 = project(x1, y1, 1);
          const p2 = project(x2, y2, 1);
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        });

        // Corner Mounting Holes
        const holes = [
          [-pcbWidth / 2 + 15, -pcbHeight / 2 + 15],
          [pcbWidth / 2 - 15, -pcbHeight / 2 + 15],
          [pcbWidth / 2 - 15, pcbHeight / 2 - 15],
          [-pcbWidth / 2 + 15, pcbHeight / 2 - 15],
        ];

        holes.forEach(([hx, hy]) => {
          const hp = project(hx, hy, 1);
          ctx.beginPath();
          ctx.arc(hp.px, hp.py, 6, 0, Math.PI * 2);
          ctx.fillStyle = padColor;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(hp.px, hp.py, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#111";
          ctx.fill();
        });
      }

      // 4. Render 3D IC Components & Header Pins
      if (showComponents) {
        // Main MCU Chip (ESP32 / STM32 Box)
        const chipW = 55;
        const chipH = 55;
        const chipZ = 12;

        const c1 = project(-chipW / 2, -chipH / 2, chipZ);
        const c2 = project(chipW / 2, -chipH / 2, chipZ);
        const c3 = project(chipW / 2, chipH / 2, chipZ);
        const c4 = project(-chipW / 2, chipH / 2, chipZ);

        ctx.beginPath();
        ctx.moveTo(c1.px, c1.py);
        ctx.lineTo(c2.px, c2.py);
        ctx.lineTo(c3.px, c3.py);
        ctx.lineTo(c4.px, c4.py);
        ctx.closePath();
        ctx.fillStyle = "#111111";
        ctx.fill();
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Chip Label text
        const center = project(0, 0, chipZ + 1);
        ctx.fillStyle = "#E0E0E0";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("CREATO4 MCU", center.px, center.py + 3);

        // Header Pins
        for (let i = -80; i <= 80; i += 20) {
          const pin = project(i, -pcbHeight / 2 + 12, 10);
          ctx.beginPath();
          ctx.arc(pin.px, pin.py, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#D4AF37"; // Gold pin head
          ctx.fill();
        }
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotation, showComponents, showTraces, colorMode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setRotation((prev) => ({
      x: prev.x + dy * 0.4,
      y: prev.y + dx * 0.4,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-[#1A3C2F] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-[#C4A35A]/30">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#C4A35A]/10 rounded-full blur-3xl" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-[#C4A35A]" />
            <span className="text-[0.65rem] font-bold text-[#C4A35A] uppercase tracking-widest">
              3D Interactive Inspection
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">{boardTitle}</h3>
          <p className="text-xs text-[#FAF8F5]/60 mt-0.5">
            Click & drag mouse to rotate board in 3D space
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
          <ShieldCheck className="w-3 h-3 text-[#C4A35A]" /> PCB Gerber Engine
        </div>
      </div>
    </div>
  );
}
