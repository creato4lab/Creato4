"use client";

import React, { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { Cpu, Layers, ShieldCheck, AlertTriangle, Eye, EyeOff, X, ZoomIn, ZoomOut, RotateCcw, Box } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

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
  defaultViewMode?: "both" | "top" | "bottom" | "3d";
}

function Pcb3DBoardMesh({
  gerberData,
  colorMode,
  showTopCopper,
  showBottomCopper,
  showSilkscreen,
  showDrills,
}: {
  gerberData: GerberData | null | undefined;
  colorMode: string;
  showTopCopper: boolean;
  showBottomCopper: boolean;
  showSilkscreen: boolean;
  showDrills: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [topTex, setTopTex] = useState<THREE.CanvasTexture | null>(null);
  const [botTex, setBotTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    if (!gerberData) return;
    const canvasT = document.createElement("canvas");
    canvasT.width = 1024;
    canvasT.height = 512;
    const ctxT = canvasT.getContext("2d");

    const canvasB = document.createElement("canvas");
    canvasB.width = 1024;
    canvasB.height = 512;
    const ctxB = canvasB.getContext("2d");

    if (ctxT && ctxB) {
      const maskColors = {
        "jlc-green": { fr4: "#227B3E", copper: "#144D25", relief: "#195C2D", pad: "#C98663", padHighlight: "#E5B094" },
        emerald: { fr4: "#0F3A22", copper: "#1A5C38", relief: "#13492D", pad: "#D4AF37", padHighlight: "#F0E199" },
        matte: { fr4: "#1E1E1E", copper: "#333333", relief: "#282828", pad: "#C0C0C0", padHighlight: "#EAEAEA" },
        blue: { fr4: "#0B2E52", copper: "#174D82", relief: "#113D68", pad: "#D4AF37", padHighlight: "#F0E199" },
      }[colorMode] || { fr4: "#227B3E", copper: "#144D25", relief: "#195C2D", pad: "#C98663", padHighlight: "#E5B094" };

      const gb = gerberData.boardBounds;
      const w = 1024;
      const h = 512;

      [ctxT, ctxB].forEach((ctx) => {
        ctx.fillStyle = maskColors.fr4;
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 5;
        ctx.strokeRect(4, 4, w - 8, h - 8);
      });

      const toCanvasCoords = (gx: number, gy: number, isBottom = false) => {
        const sx = (w * 0.92) / (gb.width || 1);
        const sy = (h * 0.92) / (gb.height || 1);
        const s = Math.min(sx, sy);
        const origCx = (gb.minX + gb.maxX) / 2;
        const origCy = (gb.minY + gb.maxY) / 2;
        let vx = w / 2 + (gx - origCx) * s;
        let vy = h / 2 - (gy - origCy) * s;
        if (isBottom) vx = w - vx;
        return { vx, vy, s };
      };

      // Top Copper Traces & Pads
      if (showTopCopper) {
        ctxT.strokeStyle = maskColors.copper;
        ctxT.lineCap = "round"; ctxT.lineJoin = "round";
        gerberData.topTraces.forEach((seg) => {
          const { vx: vx1, vy: vy1, s } = toCanvasCoords(seg.x1, seg.y1);
          const { vx: vx2, vy: vy2 } = toCanvasCoords(seg.x2, seg.y2);
          ctxT.lineWidth = Math.max(5, (seg.width || 0.35) * s);
          ctxT.beginPath(); ctxT.moveTo(vx1, vy1); ctxT.lineTo(vx2, vy2); ctxT.stroke();
        });

        const topPads = gerberData.topPads.length > 0 ? gerberData.topPads : gerberData.bottomPads;
        topPads.forEach((pad) => {
          const { vx, vy, s } = toCanvasCoords(pad.x, pad.y);
          const pw = Math.max(7, (pad.w || 0.8) * s);
          const ph = Math.max(7, (pad.h || 0.8) * s);
          ctxT.fillStyle = maskColors.pad;
          if (pad.shape === "R" || pad.shape === "O") {
            ctxT.fillRect(vx - pw / 2, vy - ph / 2, pw, ph);
          } else {
            ctxT.beginPath(); ctxT.arc(vx, vy, pw * 0.5, 0, Math.PI * 2); ctxT.fill();
          }
          if (showDrills) {
            ctxT.fillStyle = "#FFFFFF";
            ctxT.beginPath(); ctxT.arc(vx, vy, Math.max(2, Math.min(pw, ph) * 0.3), 0, Math.PI * 2); ctxT.fill();
          }
        });
      }

      // Top Silkscreen Labels
      if (showSilkscreen) {
        ctxT.strokeStyle = "#FFFFFF";
        ctxT.lineWidth = 3.0;
        gerberData.topSilkscreen.forEach((seg) => {
          const { vx: vx1, vy: vy1 } = toCanvasCoords(seg.x1, seg.y1);
          const { vx: vx2, vy: vy2 } = toCanvasCoords(seg.x2, seg.y2);
          ctxT.beginPath(); ctxT.moveTo(vx1, vy1); ctxT.lineTo(vx2, vy2); ctxT.stroke();
        });
      }

      // Bottom Copper Traces & Pads
      if (showBottomCopper) {
        ctxB.strokeStyle = maskColors.copper;
        ctxB.lineCap = "round"; ctxB.lineJoin = "round";
        gerberData.bottomTraces.forEach((seg) => {
          const { vx: vx1, vy: vy1, s } = toCanvasCoords(seg.x1, seg.y1, true);
          const { vx: vx2, vy: vy2 } = toCanvasCoords(seg.x2, seg.y2, true);
          ctxB.lineWidth = Math.max(5, (seg.width || 0.35) * s);
          ctxB.beginPath(); ctxB.moveTo(vx1, vy1); ctxB.lineTo(vx2, vy2); ctxB.stroke();
        });

        const botPads = gerberData.bottomPads.length > 0 ? gerberData.bottomPads : gerberData.topPads;
        botPads.forEach((pad) => {
          const { vx, vy, s } = toCanvasCoords(pad.x, pad.y, true);
          const pw = Math.max(7, (pad.w || 0.8) * s);
          const ph = Math.max(7, (pad.h || 0.8) * s);
          ctxB.fillStyle = maskColors.pad;
          if (pad.shape === "R" || pad.shape === "O") {
            ctxB.fillRect(vx - pw / 2, vy - ph / 2, pw, ph);
          } else {
            ctxB.beginPath(); ctxB.arc(vx, vy, pw * 0.5, 0, Math.PI * 2); ctxB.fill();
          }
          if (showDrills) {
            ctxB.fillStyle = "#FFFFFF";
            ctxB.beginPath(); ctxB.arc(vx, vy, Math.max(2, Math.min(pw, ph) * 0.3), 0, Math.PI * 2); ctxB.fill();
          }
        });
      }

      // Render All Drill Holes (Through-hole Pins & Corner Mounting Holes)
      if (showDrills) {
        // 1. Draw pad drill centers
        const topPads = gerberData.topPads.length > 0 ? gerberData.topPads : gerberData.bottomPads;
        topPads.forEach((pad) => {
          const { vx: tVx, vy: tVy, s: tS } = toCanvasCoords(pad.x, pad.y);
          const pwT = Math.max(7, (pad.w || 0.8) * tS);
          const phT = Math.max(7, (pad.h || 0.8) * tS);
          const rT = Math.max(3, Math.min(pwT, phT) * 0.32);

          // Top Canvas pad drill hole
          ctxT.fillStyle = maskColors.pad;
          ctxT.beginPath(); ctxT.arc(tVx, tVy, rT * 1.25, 0, Math.PI * 2); ctxT.fill();
          ctxT.fillStyle = "#FFFFFF";
          ctxT.beginPath(); ctxT.arc(tVx, tVy, rT * 0.85, 0, Math.PI * 2); ctxT.fill();
          ctxT.fillStyle = "#1A1A1A";
          ctxT.beginPath(); ctxT.arc(tVx, tVy, rT * 0.55, 0, Math.PI * 2); ctxT.fill();

          // Bottom Canvas pad drill hole
          const { vx: bVx, vy: bVy, s: bS } = toCanvasCoords(pad.x, pad.y, true);
          const pwB = Math.max(7, (pad.w || 0.8) * bS);
          const phB = Math.max(7, (pad.h || 0.8) * bS);
          const rB = Math.max(3, Math.min(pwB, phB) * 0.32);

          ctxB.fillStyle = maskColors.pad;
          ctxB.beginPath(); ctxB.arc(bVx, bVy, rB * 1.25, 0, Math.PI * 2); ctxB.fill();
          ctxB.fillStyle = "#FFFFFF";
          ctxB.beginPath(); ctxB.arc(bVx, bVy, rB * 0.85, 0, Math.PI * 2); ctxB.fill();
          ctxB.fillStyle = "#1A1A1A";
          ctxB.beginPath(); ctxB.arc(bVx, bVy, rB * 0.55, 0, Math.PI * 2); ctxB.fill();
        });

        // 2. Draw explicit Gerber drill holes (e.g. 4 corner mounting holes & drills)
        if (gerberData.drillHoles.length > 0) {
          gerberData.drillHoles.forEach((hole) => {
            // Top canvas drill hole
            const { vx: tVx, vy: tVy, s: tS } = toCanvasCoords(hole.x, hole.y);
            const diaT = Math.max(9, (hole.diameter || 1.0) * tS);
            ctxT.fillStyle = maskColors.pad;
            ctxT.beginPath(); ctxT.arc(tVx, tVy, diaT * 0.9, 0, Math.PI * 2); ctxT.fill();
            ctxT.fillStyle = "#FFFFFF";
            ctxT.beginPath(); ctxT.arc(tVx, tVy, diaT * 0.62, 0, Math.PI * 2); ctxT.fill();
            ctxT.fillStyle = "#1A1A1A";
            ctxT.beginPath(); ctxT.arc(tVx, tVy, diaT * 0.42, 0, Math.PI * 2); ctxT.fill();

            // Bottom canvas drill hole
            const { vx: bVx, vy: bVy, s: bS } = toCanvasCoords(hole.x, hole.y, true);
            const diaB = Math.max(9, (hole.diameter || 1.0) * bS);
            ctxB.fillStyle = maskColors.pad;
            ctxB.beginPath(); ctxB.arc(bVx, bVy, diaB * 0.9, 0, Math.PI * 2); ctxB.fill();
            ctxB.fillStyle = "#FFFFFF";
            ctxB.beginPath(); ctxB.arc(bVx, bVy, diaB * 0.62, 0, Math.PI * 2); ctxB.fill();
            ctxB.fillStyle = "#1A1A1A";
            ctxB.beginPath(); ctxB.arc(bVx, bVy, diaB * 0.42, 0, Math.PI * 2); ctxB.fill();
          });
        }
      }

      const tTexture = new THREE.CanvasTexture(canvasT);
      const bTexture = new THREE.CanvasTexture(canvasB);
      tTexture.colorSpace = THREE.SRGBColorSpace;
      bTexture.colorSpace = THREE.SRGBColorSpace;
      tTexture.needsUpdate = true;
      bTexture.needsUpdate = true;
      setTopTex(tTexture);
      setBotTex(bTexture);
    }
  }, [gerberData, colorMode, showTopCopper, showBottomCopper, showSilkscreen, showDrills]);

  const gb = gerberData?.boardBounds;
  const realWidth = gb?.width && gb.width > 0.1 ? gb.width : 57.79;
  const realHeight = gb?.height && gb.height > 0.1 ? gb.height : 25.4;
  const aspect = realWidth / realHeight;

  const boardW = 2.6;
  const boardH = boardW / aspect;
  const thickness = 0.08;

  return (
    <mesh ref={meshRef} castShadow receiveShadow rotation={[0.3, 0.4, 0]}>
      <boxGeometry args={[boardW, boardH, thickness]} />
      <meshStandardMaterial attach="material-0" color="#165A2C" roughness={0.4} />
      <meshStandardMaterial attach="material-1" color="#165A2C" roughness={0.4} />
      <meshStandardMaterial attach="material-2" color="#165A2C" roughness={0.4} />
      <meshStandardMaterial attach="material-3" color="#165A2C" roughness={0.4} />
      <meshStandardMaterial attach="material-4" map={topTex || undefined} roughness={0.25} metalness={0.35} />
      <meshStandardMaterial attach="material-5" map={botTex || undefined} roughness={0.25} metalness={0.35} />
    </mesh>
  );
}

export function PcbViewer3D({
  boardTitle = "Creato4 Custom PCB",
  pcbImage,
  gerberData,
  layers = [],
  defaultViewMode,
}: PcbViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // View Modes: Front & Back | Front View | Back View | 3D View
  const initialMode = defaultViewMode || (boardTitle.toLowerCase().includes("3d pcb") ? "3d" : "both");
  const [viewMode, setViewMode] = useState<"both" | "top" | "bottom" | "3d">(initialMode);
  const [colorMode, setColorMode] = useState<"jlc-green" | "emerald" | "matte" | "blue">("jlc-green");

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Layer Toggles
  const [showTopCopper, setShowTopCopper] = useState(true);
  const [showBottomCopper, setShowBottomCopper] = useState(true);
  const [showSilkscreen, setShowSilkscreen] = useState(true);
  const [showDrills, setShowDrills] = useState(true);
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

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const sRound = (val: number) => Math.round(val * 100) / 100;
  const handleZoomIn = () => setZoom((z) => Math.min(4, sRound(z * 1.25)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.7, sRound(z / 1.25)));

  // 1:1 JLCPCB Render Algorithm
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

      // Apply Zoom & Pan transforms around canvas center
      ctx.translate(w / 2 + pan.x, h / 2 + pan.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-w / 2, -h / 2);

      // JLCPCB Palette Colors (Exact 1:1 match to JLCPCB order preview)
      const maskColors = {
        "jlc-green": {
          fr4: "#2B8C4B",      // Lighter bright green PCB base
          copper: "#144D25",   // Darker green wire / trace fill
          relief: "#195C2D",   // Darker green trace relief contour
          border: "#FFFFFF",   // Board edge white silkscreen cut
          pad: "#C98663",      // HASL Lead-Free copper-tin pad
          padBorder: "#8C5332",
        },
        emerald: {
          fr4: "#0D2C1C",
          copper: "#164A30",
          relief: "#103924",
          border: "#D4AF37",
          pad: "#D4AF37",
          padBorder: "#8C711E",
        },
        matte: {
          fr4: "#151515",
          copper: "#282828",
          relief: "#1E1E1E",
          border: "#FFFFFF",
          pad: "#C0C0C0",
          padBorder: "#808080",
        },
        blue: {
          fr4: "#072038",
          copper: "#124375",
          relief: "#0E355D",
          border: "#FFFFFF",
          pad: "#D4AF37",
          padBorder: "#8C711E",
        },
      }[colorMode];

      const gb = gerberData?.boardBounds;
      const realWidth = gb?.width && gb.width > 0.1 ? gb.width : 57.79;
      const realHeight = gb?.height && gb.height > 0.1 ? gb.height : 25.4;
      const aspect = realWidth / realHeight;

      const renderBoard = (
        cx: number,
        cy: number,
        maxAvailableW: number,
        maxAvailableH: number,
        side: "top" | "bottom"
      ) => {
        ctx.save();
        ctx.translate(cx, cy);

        // Compute board dimensions matching real Gerber aspect ratio exactly!
        let boardW = maxAvailableW;
        let boardH = boardW / aspect;
        if (boardH > maxAvailableH) {
          boardH = maxAvailableH;
          boardW = boardH * aspect;
        }

        const W2 = boardW / 2;
        const H2 = boardH / 2;

        // 1. Board Shadow
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 6;
        ctx.beginPath();
        ctx.rect(-W2, -H2, boardW, boardH);
        ctx.fillStyle = maskColors.fr4;
        ctx.fill();
        ctx.restore();

        // 2. Base FR4 Solder Mask Rectangle (Etched FR4)
        ctx.beginPath();
        ctx.rect(-W2, -H2, boardW, boardH);
        ctx.fillStyle = maskColors.fr4;
        ctx.fill();

        // Coordinate Mapping Function
        const toV = (gx: number, gy: number) => {
          if (!gb || gb.width < 0.001 || gb.height < 0.001) return { vx: gx, vy: gy, scale: 2 };
          const sx = (boardW * 0.94) / gb.width;
          const sy = (boardH * 0.94) / gb.height;
          const s = Math.min(sx, sy);
          const origCx = (gb.minX + gb.maxX) / 2;
          const origCy = (gb.minY + gb.maxY) / 2;

          let vx = (gx - origCx) * s;
          let vy = -(gy - origCy) * s;

          if (side === "bottom") {
            vx = -vx; // Flip horizontally for Back View
          }

          return { vx, vy, scale: s };
        };

        if (hasRealGerber && gerberData) {

          if (side === "top") {
            // ── TOP VIEW (FRONT SIDE) ──

            // Top Copper Traces & Copper Pour Planes (JLCPCB 2-Tone Green Solder Mask)
            if (showTopCopper && gerberData.topTraces.length > 0) {
              // 1st Pass: Wide copper plane under solder mask
              ctx.strokeStyle = maskColors.copper;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              gerberData.topTraces.forEach((seg) => {
                const { vx: vx1, vy: vy1, scale: s } = toV(seg.x1, seg.y1);
                const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
                ctx.lineWidth = Math.max(3.5, (seg.width || 0.35) * (s || 2.2) + 2.2);
                ctx.beginPath();
                ctx.moveTo(vx1, vy1);
                ctx.lineTo(vx2, vy2);
                ctx.stroke();
              });

              // 2nd Pass: Inner trace relief core
              ctx.strokeStyle = maskColors.relief;
              gerberData.topTraces.forEach((seg) => {
                const { vx: vx1, vy: vy1, scale: s } = toV(seg.x1, seg.y1);
                const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
                ctx.lineWidth = Math.max(1.5, (seg.width || 0.25) * (s || 2.2));
                ctx.beginPath();
                ctx.moveTo(vx1, vy1);
                ctx.lineTo(vx2, vy2);
                ctx.stroke();
              });
            }

            // Top Copper Pads (HASL Lead-Free / Copper Finish with White Center Hole)
            const topPadsToDraw = gerberData.topPads.length > 0 ? gerberData.topPads : gerberData.bottomPads;
            if (showTopCopper && topPadsToDraw.length > 0) {
              topPadsToDraw.forEach((pad) => {
                const { vx, vy, scale: s } = toV(pad.x, pad.y);
                const pw = Math.max(4.0, (pad.w || 0.8) * (s || 2.4));
                const ph = Math.max(4.0, (pad.h || 0.8) * (s || 2.4));

                ctx.fillStyle = maskColors.pad;

                if (pad.shape === "R" || pad.shape === "O") {
                  ctx.beginPath();
                  ctx.rect(vx - pw / 2, vy - ph / 2, pw, ph);
                  ctx.fill();
                  ctx.strokeStyle = maskColors.padBorder;
                  ctx.lineWidth = 0.6;
                  ctx.stroke();
                } else {
                  const r = Math.max(3.5, Math.min(10, (pad.w || 0.8) * (s || 2.4) * 0.5));
                  ctx.beginPath();
                  ctx.arc(vx, vy, r, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.strokeStyle = maskColors.padBorder;
                  ctx.lineWidth = 0.6;
                  ctx.stroke();
                }

                // White Center Drill Hole (1:1 JLCPCB Drill rendering on pads)
                if (showDrills) {
                  const holeRadius = Math.max(1.2, Math.min(pw, ph) * 0.32);
                  ctx.fillStyle = "#FFFFFF";
                  ctx.beginPath();
                  ctx.arc(vx, vy, holeRadius, 0, Math.PI * 2);
                  ctx.fill();
                }
              });
            }

            // Top Silkscreen Layer (Solid White Component Designators & Outlines)
            if (showSilkscreen && gerberData.topSilkscreen.length > 0) {
              ctx.strokeStyle = "#FFFFFF";
              ctx.fillStyle = "#FFFFFF";
              ctx.lineWidth = 1.4;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";

              gerberData.topSilkscreen.forEach((seg) => {
                const { vx: vx1, vy: vy1 } = toV(seg.x1, seg.y1);
                const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
                ctx.beginPath();
                ctx.moveTo(vx1, vy1);
                ctx.lineTo(vx2, vy2);
                ctx.stroke();
              });
            }

          } else {
            // ── BOTTOM VIEW (BACK SIDE) ──

            // Bottom Copper Traces & Planes
            if (showBottomCopper && gerberData.bottomTraces.length > 0) {
              ctx.strokeStyle = maskColors.copper;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              gerberData.bottomTraces.forEach((seg) => {
                const { vx: vx1, vy: vy1, scale: s } = toV(seg.x1, seg.y1);
                const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
                ctx.lineWidth = Math.max(3.5, (seg.width || 0.35) * (s || 2.2) + 2.2);
                ctx.beginPath();
                ctx.moveTo(vx1, vy1);
                ctx.lineTo(vx2, vy2);
                ctx.stroke();
              });

              ctx.strokeStyle = maskColors.relief;
              gerberData.bottomTraces.forEach((seg) => {
                const { vx: vx1, vy: vy1, scale: s } = toV(seg.x1, seg.y1);
                const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
                ctx.lineWidth = Math.max(1.5, (seg.width || 0.25) * (s || 2.2));
                ctx.beginPath();
                ctx.moveTo(vx1, vy1);
                ctx.lineTo(vx2, vy2);
                ctx.stroke();
              });
            }

            // Bottom Copper Pads (Through-hole components pass through to back side!)
            const botPadsToDraw = gerberData.bottomPads.length > 0 ? gerberData.bottomPads : gerberData.topPads;
            if (showBottomCopper && botPadsToDraw.length > 0) {
              botPadsToDraw.forEach((pad) => {
                const { vx, vy, scale: s } = toV(pad.x, pad.y);
                const pw = Math.max(4.0, (pad.w || 0.8) * (s || 2.4));
                const ph = Math.max(4.0, (pad.h || 0.8) * (s || 2.4));

                ctx.fillStyle = maskColors.pad;

                if (pad.shape === "R" || pad.shape === "O") {
                  ctx.beginPath();
                  ctx.rect(vx - pw / 2, vy - ph / 2, pw, ph);
                  ctx.fill();
                  ctx.strokeStyle = maskColors.padBorder;
                  ctx.lineWidth = 0.6;
                  ctx.stroke();
                } else {
                  const r = Math.max(3.5, Math.min(10, (pad.w || 0.8) * (s || 2.4) * 0.5));
                  ctx.beginPath();
                  ctx.arc(vx, vy, r, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.strokeStyle = maskColors.padBorder;
                  ctx.lineWidth = 0.6;
                  ctx.stroke();
                }

                // White Center Drill Hole on Bottom Pads
                if (showDrills) {
                  const holeRadius = Math.max(1.2, Math.min(pw, ph) * 0.32);
                  ctx.fillStyle = "#FFFFFF";
                  ctx.beginPath();
                  ctx.arc(vx, vy, holeRadius, 0, Math.PI * 2);
                  ctx.fill();
                }
              });
            }

            // Bottom Silkscreen Layer
            if (showSilkscreen && gerberData.bottomSilkscreen.length > 0) {
              ctx.strokeStyle = "#FFFFFF";
              ctx.lineWidth = 1.4;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";

              gerberData.bottomSilkscreen.forEach((seg) => {
                const { vx: vx1, vy: vy1 } = toV(seg.x1, seg.y1);
                const { vx: vx2, vy: vy2 } = toV(seg.x2, seg.y2);
                ctx.beginPath();
                ctx.moveTo(vx1, vy1);
                ctx.lineTo(vx2, vy2);
                ctx.stroke();
              });
            }
          }

          // Drill Holes from Excellon file (HASL Copper Plating Ring around White Holes)
          if (showDrills && gerberData.drillHoles.length > 0) {
            gerberData.drillHoles.forEach((h) => {
              const { vx, vy, scale: s } = toV(h.x, h.y);
              const rInner = Math.max(1.6, Math.min(5.5, (h.diameter || 0.8) * (s || 2.2) * 0.45));
              const rOuter = rInner * 2.2;

              // HASL Copper Ring Plating
              ctx.beginPath();
              ctx.arc(vx, vy, rOuter, 0, Math.PI * 2);
              ctx.fillStyle = maskColors.pad;
              ctx.fill();
              ctx.strokeStyle = maskColors.padBorder;
              ctx.lineWidth = 0.5;
              ctx.stroke();

              // White Drill Hole Center
              ctx.beginPath();
              ctx.arc(vx, vy, rInner, 0, Math.PI * 2);
              ctx.fillStyle = "#FFFFFF";
              ctx.fill();
            });
          }

          // Board Outer Silkscreen Edge Cut Border (Crisp White Border like JLCPCB)
          ctx.beginPath();
          ctx.rect(-W2, -H2, boardW, boardH);
          ctx.strokeStyle = maskColors.border;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.restore();
      };

      // ── Render Modes: JLCPCB Side-by-Side (both) vs Single View ──
      if (viewMode === "both") {
        const maxW = w * 0.44;
        const maxH = h * 0.78;
        renderBoard(w * 0.27, h / 2, maxW, maxH, "top");
        renderBoard(w * 0.73, h / 2, maxW, maxH, "bottom");
      } else if (viewMode === "top" || viewMode === "bottom") {
        const maxW = w * 0.82;
        const maxH = h * 0.82;
        renderBoard(w / 2, h / 2, maxW, maxH, viewMode);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => { cancelAnimationFrame(animationFrameId); };
  }, [viewMode, colorMode, zoom, pan, showTopCopper, showBottomCopper, showSilkscreen, showDrills, gerberData, hasRealGerber, boardTitle]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((z) => Math.max(0.7, Math.min(4, sRound(z * zoomFactor))));
  };

  return (
    <div className="w-full h-full bg-[#EAECEF] text-slate-800 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2 z-20 shrink-0 pr-12">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Cpu className="w-3.5 h-3.5 text-[#1A6231]" />
            <span className="text-[0.65rem] font-bold text-[#1A6231] uppercase tracking-widest">
              JLCPCB Gerber Order Preview
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">{boardTitle}</h3>
          <p className="text-[0.68rem] text-slate-500 font-medium">
            {hasRealGerber && gerberData?.boardBounds
              ? `Dimensions: ${gerberData.boardBounds.width.toFixed(2)} × ${gerberData.boardBounds.height.toFixed(2)} mm — 2-Layer Standard FR-4`
              : "JLCPCB 1:1 Gerber Stackup Preview"}
          </p>
        </div>
        {/* View Mode Switcher: Front & Back | Front View | Back View | 3D View */}
        <div className="flex items-center gap-1 bg-slate-200/90 p-1.5 rounded-2xl border border-slate-300 shadow-sm">
          <button
            onClick={() => setViewMode("both")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "both"
                ? "bg-[#227B3E] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
            }`}
          >
            Front & Back
          </button>

          <button
            onClick={() => setViewMode("top")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "top"
                ? "bg-[#227B3E] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
            }`}
          >
            Front View
          </button>

          <button
            onClick={() => setViewMode("bottom")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "bottom"
                ? "bg-[#227B3E] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
            }`}
          >
            Back View
          </button>

          <button
            onClick={() => setViewMode("3d")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === "3d"
                ? "bg-[#227B3E] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
            }`}
          >
            <Box className="w-3.5 h-3.5" /> 3D View
          </button>
        </div>
      </div>

      {/* Toolbar, Zoom Controls & Layer Toggles */}
      <div className="flex items-center justify-between gap-2 mb-2 z-20 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowTopCopper(!showTopCopper)}
            className={`px-2.5 py-1 rounded-xl text-[0.68rem] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              showTopCopper ? "bg-[#227B3E] text-white" : "bg-slate-300 text-slate-500"
            }`}
          >
            {showTopCopper ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Top Cu
          </button>

          <button
            onClick={() => setShowSilkscreen(!showSilkscreen)}
            className={`px-2.5 py-1 rounded-xl text-[0.68rem] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              showSilkscreen ? "bg-slate-800 text-white" : "bg-slate-300 text-slate-500"
            }`}
          >
            {showSilkscreen ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Silk Labels
          </button>

          <button
            onClick={() => setShowBottomCopper(!showBottomCopper)}
            className={`px-2.5 py-1 rounded-xl text-[0.68rem] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              showBottomCopper ? "bg-amber-700 text-white" : "bg-slate-300 text-slate-500"
            }`}
          >
            {showBottomCopper ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Bot Cu
          </button>

          <button
            onClick={() => setShowDrills(!showDrills)}
            className={`px-2.5 py-1 rounded-xl text-[0.68rem] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              showDrills ? "bg-teal-700 text-white" : "bg-slate-300 text-slate-500"
            }`}
          >
            {showDrills ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Drills
          </button>
        </div>

        {/* Zoom & Color Controls */}
        <div className="flex items-center gap-2">
          {viewMode !== "3d" && (
            <div className="flex items-center gap-1 bg-slate-200/90 p-1 rounded-full border border-slate-300 shadow-sm">
              <button
                onClick={handleZoomIn}
                className="p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-300/80 rounded-full transition-colors cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-[0.65rem] font-bold text-slate-600 px-1 font-mono">{Math.round(zoom * 100)}%</span>
              <button
                onClick={handleZoomOut}
                className="p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-300/80 rounded-full transition-colors cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              {(zoom !== 1 || pan.x !== 0 || pan.y !== 0) && (
                <button
                  onClick={handleResetZoom}
                  className="p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-300/80 rounded-full transition-colors cursor-pointer ml-0.5"
                  title="Reset Zoom & Centering"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Color Palette Switcher */}
          <div className="flex items-center gap-2 bg-slate-200/90 px-3 py-1 rounded-full border border-slate-300 shadow-sm">
            <span className="text-[0.65rem] text-slate-500 font-bold uppercase">PCB Color:</span>
            <button
              onClick={() => setColorMode("jlc-green")}
              className={`w-4 h-4 rounded-full bg-[#227B3E] border ${
                colorMode === "jlc-green" ? "border-slate-800 scale-110" : "border-transparent opacity-60"
              }`}
              title="JLCPCB Green"
            />
            <button
              onClick={() => setColorMode("emerald")}
              className={`w-4 h-4 rounded-full bg-emerald-700 border ${
                colorMode === "emerald" ? "border-slate-800 scale-110" : "border-transparent opacity-60"
              }`}
              title="Dark Emerald"
            />
            <button
              onClick={() => setColorMode("matte")}
              className={`w-4 h-4 rounded-full bg-neutral-800 border ${
                colorMode === "matte" ? "border-slate-800 scale-110" : "border-transparent opacity-60"
              }`}
              title="Matte Black"
            />
            <button
              onClick={() => setColorMode("blue")}
              className={`w-4 h-4 rounded-full bg-blue-700 border ${
                colorMode === "blue" ? "border-slate-800 scale-110" : "border-transparent opacity-60"
              }`}
              title="Royal Blue"
            />
          </div>
        </div>
      </div>

      {/* Main JLCPCB Canvas Container with Mouse Drag & Wheel Zoom */}
      <div
        onMouseDown={viewMode !== "3d" ? handleMouseDown : undefined}
        onMouseMove={viewMode !== "3d" ? handleMouseMove : undefined}
        onMouseUp={viewMode !== "3d" ? handleMouseUp : undefined}
        onMouseLeave={viewMode !== "3d" ? handleMouseUp : undefined}
        onWheel={viewMode !== "3d" ? handleWheel : undefined}
        className="flex-1 w-full bg-[#F4F6F8] rounded-2xl border border-slate-300/80 flex items-center justify-center relative overflow-hidden min-h-[340px] shadow-inner cursor-grab active:cursor-grabbing"
      >
        {viewMode === "3d" ? (
          <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-[#F8FAF8] via-[#EAECEF] to-[#DDE2E5] flex items-center justify-center">
            {/* Creato4 Studio Background Watermark Logo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-20 z-0">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-[#1A3C2F] flex items-center justify-center shadow-xl border border-[#C4A35A]/40">
                  <span className="text-2xl font-black text-[#C4A35A] tracking-tighter">C4</span>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-[#1A3C2F] tracking-widest uppercase">CREATO4</h1>
                  <p className="text-[0.65rem] font-bold text-[#1A3C2F]/90 tracking-[0.25em] uppercase">HARDWARE LABS • 3D PCB STUDIO</p>
                </div>
              </div>
            </div>

            <Canvas camera={{ position: [0, 0, 3.8], fov: 40 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
              <ambientLight intensity={1.8} />
              <directionalLight position={[4, 6, 6]} intensity={3.0} color="#FFFFFF" castShadow />
              <directionalLight position={[-5, -4, -4]} intensity={1.4} color="#E2EBF5" />
              <pointLight position={[0, 4, 3]} intensity={1.8} color="#FFF8EE" />
              <pointLight position={[0, -4, -3]} intensity={1.2} color="#227B3E" />
              <Suspense fallback={null}>
                <Pcb3DBoardMesh
                  gerberData={gerberData}
                  colorMode={colorMode}
                  showTopCopper={showTopCopper}
                  showBottomCopper={showBottomCopper}
                  showSilkscreen={showSilkscreen}
                  showDrills={showDrills}
                />
              </Suspense>
              <OrbitControls autoRotate autoRotateSpeed={2.0} enableDamping dampingFactor={0.05} />
            </Canvas>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={800}
            height={420}
            className="w-full h-full object-contain"
          />
        )}

        {/* Gerber Layers Stackup Menu */}
        {layers.length > 0 && (
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 transition-all cursor-pointer shadow-md"
            >
              <Layers className="w-3.5 h-3.5 text-[#1A6231]" />
              <span>Layers ({layers.length})</span>
            </button>

            <AnimatePresence>
              {showLayerMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-2 w-60 bg-white border border-slate-300 rounded-2xl p-3 shadow-2xl space-y-1.5 max-h-48 overflow-y-auto z-40"
                >
                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200">
                    <span className="text-[0.65rem] font-black text-[#1A6231] uppercase tracking-wider">Gerber Stackup</span>
                    <button
                      onClick={() => setShowLayerMenu(false)}
                      className="p-1 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {layers.map((l, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-medium text-slate-800 truncate max-w-[130px]">{l.name}</span>
                      <span className="text-[0.6rem] text-[#1A6231] font-mono">{l.type}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Real Gerber Data Badge */}
        <div className="absolute bottom-3 right-3 text-[0.6rem] font-bold uppercase tracking-widest flex items-center gap-1 z-10">
          {isCompleteRender ? (
            <span className="text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> REAL GERBER DATA
            </span>
          ) : (
            <span className="text-amber-700 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> INCOMPLETE DATA
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


