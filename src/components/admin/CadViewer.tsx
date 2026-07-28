"use client";

import React, { useState, useEffect, Suspense } from "react";
import JSZip from "jszip";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, Grid } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import {
  Loader2, Eye, X, Cpu, Box, RotateCcw, ZoomIn,
  FileQuestion, CheckCircle2, AlertTriangle,
} from "lucide-react";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";

interface CadViewerProps {
  file?: File | null;
  fileUrl?: string | null;
  cadTitle?: string;
}

// Supported formats that can actually be rendered
const RENDERABLE = [".stl"];
// Supported formats that are valid CAD files but can't be rendered in-browser
const ACKNOWLEDGED = [".step", ".stp", ".f3d", ".f3z", ".iges", ".igs", ".brep"];

type LoadStatus = "idle" | "loading" | "ready" | "unsupported" | "error";

// ── Error Boundary to prevent Three.js crashes from killing the page ─────────
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message ?? "3D renderer error" };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#0A1A12] text-white/60 p-6">
          <AlertTriangle className="w-8 h-8 text-yellow-400" />
          <p className="text-sm font-bold text-white/70">3D Viewer Error</p>
          <p className="text-xs text-center">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface CadInfo {
  format: string;
  fileName: string;
  fileSizeKb: number;
  vertexCount?: number;
  triangleCount?: number;
  boundingBox?: { x: number; y: number; z: number };
}

// ── Inner mesh component (receives a centered + scaled geometry) ─────────────
function CadMesh({ geometry }: { geometry: THREE.BufferGeometry }) {
  return (
    <Center>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#C4A35A"
          roughness={0.35}
          metalness={0.65}
          envMapIntensity={1.2}
        />
      </mesh>
    </Center>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function CadViewer({ file, fileUrl, cadTitle }: CadViewerProps) {
  const [geometry,    setGeometry]    = useState<THREE.BufferGeometry | null>(null);
  const [status,      setStatus]      = useState<LoadStatus>("idle");
  const [error,       setError]       = useState("");
  const [cadInfo,     setCadInfo]     = useState<CadInfo | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [autoRotate,  setAutoRotate]  = useState(true);

  useEffect(() => {
    if (!file && !fileUrl) {
      setGeometry(null);
      setStatus("idle");
      setCadInfo(null);
      setError("");
      return;
    }

    const process = async () => {
      setStatus("loading");
      setError("");
      setGeometry(null);
      setCadInfo(null);

      try {
        let activeFile: File | { name: string; size: number; arrayBuffer(): Promise<ArrayBuffer> } | null = file || null;

        if (!activeFile && fileUrl) {
          const res = await fetch(fileUrl);
          if (!res.ok) throw new Error(`Failed to download CAD file (${res.status})`);
          const blob = await res.blob();
          const fileName = cadTitle ?? fileUrl.split("/").pop() ?? "model.zip";
          activeFile = new File([blob], fileName, { type: blob.type });
        }

        if (!activeFile) return;

        const lowerName = activeFile.name.toLowerCase();
        const sizeMb    = activeFile.size / (1024 * 1024);

        // ── 1. Determine the actual STL source ──────────────────────────────
        let stlBuffer:    ArrayBuffer | null = null;
        let displayName:  string             = activeFile.name;
        let displaySize:  number             = activeFile.size / 1024;
        let innerFormat:  string             = "";

        if (lowerName.endsWith(".stl")) {
          // Direct STL file
          stlBuffer   = await activeFile.arrayBuffer();
          innerFormat = ".stl";

        } else if (lowerName.endsWith(".zip")) {
          // ZIP — look for the best 3D file inside
          const zip     = new JSZip();
          const fileBuf = await activeFile.arrayBuffer();
          const zipData = await zip.loadAsync(fileBuf);

          // Priority: STL first, then check for STEP/others for info card
          let stlEntry:  [string, JSZip.JSZipObject] | null = null;
          let stepEntry: [string, JSZip.JSZipObject] | null = null;
          let anyEntry:  [string, JSZip.JSZipObject] | null = null;

          for (const [fn, obj] of Object.entries(zipData.files)) {
            if (obj.dir) continue;
            const fnL = fn.toLowerCase();
            if (!stlEntry  && fnL.endsWith(".stl"))  stlEntry  = [fn, obj];
            if (!stepEntry && (fnL.endsWith(".step") || fnL.endsWith(".stp"))) stepEntry = [fn, obj];
            if (!anyEntry  && ACKNOWLEDGED.some(e => fnL.endsWith(e))) anyEntry = [fn, obj];
          }

          if (stlEntry) {
            stlBuffer   = await stlEntry[1].async("arraybuffer");
            displayName = stlEntry[0].split("/").pop() ?? stlEntry[0];
            innerFormat = ".stl";
            displaySize = stlBuffer.byteLength / 1024;
          } else if (stepEntry || anyEntry) {
            // ZIP with STEP/other inside — show info card, can't render
            const found = stepEntry ?? anyEntry!;
            displayName = found[0].split("/").pop() ?? found[0];
            const ext   = displayName.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
            innerFormat = ext;
            stlBuffer   = null; // explicitly not renderable
          } else {
            setError("No recognisable 3D model file (.stl, .step, .stp) found inside the ZIP.");
            setStatus("error");
            return;
          }

        } else if (ACKNOWLEDGED.some(e => lowerName.endsWith(e))) {
          // Direct STEP / F3D / IGES — info card only
          const ext   = lowerName.match(/\.[^.]+$/)?.[0] ?? "";
          innerFormat = ext;
          displayName = file.name;

        } else {
          setError(`Unsupported format. Accepted: .stl, .step, .stp, .zip`);
          setStatus("error");
          return;
        }

        // ── 2. If we have an STL buffer, parse + prepare geometry ──────────
        if (stlBuffer) {
          if (sizeMb > 150) {
            setError("File is too large to preview (max 150 MB). The file will still upload correctly.");
            setStatus("error");
            return;
          }

          const loader = new STLLoader();
          const geo    = loader.parse(stlBuffer);

          // Compute normals if missing
          geo.computeVertexNormals();

          // Center around the bounding box centroid
          geo.computeBoundingBox();
          const bbox = geo.boundingBox!;
          const center = new THREE.Vector3();
          bbox.getCenter(center);
          geo.translate(-center.x, -center.y, -center.z);

          // Scale to a fixed display size so any model fits well
          const size    = new THREE.Vector3();
          bbox.getSize(size);
          const maxDim  = Math.max(size.x, size.y, size.z);
          const scaleFactor = maxDim > 0 ? 2 / maxDim : 1; // normalize to 2-unit bounding box
          geo.scale(scaleFactor, scaleFactor, scaleFactor);

          // Recompute after transform
          geo.computeBoundingBox();
          const finalSize = new THREE.Vector3();
          geo.boundingBox!.getSize(finalSize);

          // Triangle / vertex counts
          const triCount  = (geo.index ? geo.index.count : geo.attributes.position.count) / 3;
          const vtxCount  = geo.attributes.position.count;

          setCadInfo({
            format:       ".stl",
            fileName:     displayName,
            fileSizeKb:   displaySize,
            vertexCount:  vtxCount,
            triangleCount: Math.round(triCount),
            // Report real-world size BEFORE normalization
            boundingBox: {
              x: parseFloat(size.x.toFixed(1)),
              y: parseFloat(size.y.toFixed(1)),
              z: parseFloat(size.z.toFixed(1)),
            },
          });

          setGeometry(geo);
          setStatus("ready");

        } else {
          // Non-renderable but valid CAD format — info card
          setCadInfo({
            format:     innerFormat,
            fileName:   displayName,
            fileSizeKb: displaySize,
          });
          setStatus("unsupported");
        }

      } catch (err: any) {
        console.error("CadViewer error:", err);
        setError(err.message ?? "Failed to process the CAD file.");
        setStatus("error");
      }
    };

    process();
  }, [file]);

  if (!file) return null;

  const isRenderable = status === "ready" && geometry;

  return (
    <>
      {/* ── Info card ────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#1A3C2F] rounded-xl border border-[#C4A35A]/30 overflow-hidden relative mt-4 shadow-xl">

        {/* Header */}
        <div className="bg-[#102A20] px-4 py-2.5 flex items-center gap-3 border-b border-[#C4A35A]/20">
          {/* Left: title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Cpu className="w-4 h-4 text-[#C4A35A] shrink-0" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest truncate">
              3D CAD Inspector
            </h3>
          </div>

          {/* Right: badges + action */}
          <div className="flex items-center gap-1.5 shrink-0">
            {status === "loading" && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-white/60">
                <Loader2 className="w-3 h-3 animate-spin text-[#C4A35A]" /> Loading…
              </span>
            )}

            {status === "ready" && (
              <span className="whitespace-nowrap text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20 leading-5">
                STL Ready
              </span>
            )}

            {status === "unsupported" && (
              <span className="whitespace-nowrap text-[10px] font-bold text-[#C4A35A] bg-[#C4A35A]/10 px-2 py-0.5 rounded border border-[#C4A35A]/20 leading-5">
                {cadInfo?.format?.toUpperCase() ?? "CAD"} Verified
              </span>
            )}

            {isRenderable && (
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="whitespace-nowrap text-[10px] font-bold text-white bg-[#C4A35A]/20 hover:bg-[#C4A35A]/30 px-2 py-0.5 rounded border border-[#C4A35A]/30 flex items-center gap-1 transition-colors cursor-pointer leading-5"
              >
                <Eye className="w-2.5 h-2.5 text-[#C4A35A] shrink-0" />
                View 3D
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 min-h-[100px] relative">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(#C4A35A 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          />

          {/* Loading */}
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-6 gap-2 relative z-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#C4A35A]" />
              <p className="text-xs font-bold text-white/70">Processing 3D model…</p>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="flex items-start gap-3 p-3 bg-red-900/20 rounded-lg border border-red-500/20 relative z-10">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-red-400">{error}</p>
            </div>
          )}

          {/* STL stats card */}
          {status === "ready" && cadInfo && (
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs font-bold text-white truncate">{cadInfo.fileName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Triangles", value: cadInfo.triangleCount?.toLocaleString() ?? "—" },
                  { label: "Vertices",  value: cadInfo.vertexCount?.toLocaleString()   ?? "—" },
                  { label: "Size",      value: cadInfo.fileSizeKb > 1024
                      ? `${(cadInfo.fileSizeKb / 1024).toFixed(1)} MB`
                      : `${cadInfo.fileSizeKb.toFixed(0)} KB` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-[#C4A35A] font-bold uppercase tracking-wider">{label}</p>
                    <p className="text-xs font-black text-white mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              {cadInfo.boundingBox && (
                <p className="text-[10px] text-white/40 text-center">
                  Bounding box: {cadInfo.boundingBox.x} × {cadInfo.boundingBox.y} × {cadInfo.boundingBox.z} units
                </p>
              )}
            </div>
          )}

          {/* Unsupported format — info card (STEP / F3D / IGES) */}
          {status === "unsupported" && cadInfo && (
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-3.5 h-3.5 text-[#C4A35A]" />
                <span className="text-xs font-bold text-white truncate">{cadInfo.fileName}</span>
              </div>
              <div className="bg-[#C4A35A]/10 border border-[#C4A35A]/20 rounded-lg p-3">
                <p className="text-[11px] font-bold text-[#C4A35A] mb-1">
                  {cadInfo.format?.toUpperCase()} file detected — upload will proceed normally.
                </p>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  Live browser preview is only available for <strong className="text-white/70">.STL</strong> format.
                  STEP, F3D, and IGES files require a CAD kernel and cannot be rendered in-browser.
                  The file is valid and will be delivered to customers as-is.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-between">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wide">File size</span>
                <span className="text-[10px] font-black text-white">
                  {cadInfo.fileSizeKb > 1024
                    ? `${(cadInfo.fileSizeKb / 1024).toFixed(1)} MB`
                    : `${cadInfo.fileSizeKb.toFixed(0)} KB`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3D Viewer Modal (STL only) ────────────────────────────────────── */}
      <AnimatePresence>
        {showPreview && isRenderable && (
          <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{    scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A3C2F] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-[#C4A35A]/30 flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-[#102A20] px-6 py-4 border-b border-[#C4A35A]/20 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Box className="w-5 h-5 text-[#C4A35A] shrink-0" />
                  <div className="min-w-0">
                    <h2 className="font-extrabold text-sm text-white uppercase tracking-wider">
                      3D CAD Model Viewer
                    </h2>
                    <p className="text-[10px] text-[#FAF8F5]/50 mt-0.5 truncate max-w-[380px]">
                      {cadInfo?.fileName}
                      {cadInfo?.triangleCount && (
                        <span className="ml-2 text-[#C4A35A]">
                          · {cadInfo.triangleCount.toLocaleString()} triangles
                          · {cadInfo.vertexCount?.toLocaleString()} vertices
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Auto-rotate toggle */}
                  <button
                    type="button"
                    onClick={() => setAutoRotate((v) => !v)}
                    title={autoRotate ? "Stop rotation" : "Start rotation"}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      autoRotate
                        ? "bg-[#C4A35A]/20 border-[#C4A35A]/30 text-[#C4A35A]"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors border border-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Three.js Canvas */}
              <div className="w-full h-[460px] bg-[#0A1A12] relative">

                {/* Corner labels */}
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  <span className="bg-[#1A3C2F]/90 backdrop-blur-sm text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-[#C4A35A]/20">
                    ⚡ Live 3D Preview
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                  <span className="bg-black/50 backdrop-blur-md text-white/50 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
                    Drag · Scroll · Pinch
                  </span>
                </div>

                <CanvasErrorBoundary>
                <Canvas
                  shadows
                  camera={{ position: [2, 1.5, 2], fov: 45, near: 0.01, far: 1000 }}
                  gl={{ antialias: true, alpha: false }}
                >
                  <color attach="background" args={["#0A1A12"]} />

                  {/* Lighting setup */}
                  <ambientLight intensity={0.4} />
                  <directionalLight
                    position={[5, 8, 5]}
                    intensity={2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                  />
                  <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#6699CC" />
                  <pointLight position={[0, 5, 0]} intensity={0.8} color="#C4A35A" />

                  {/* Hemisphere light for ambient reflections (no network fetch) */}
                  <hemisphereLight args={["#FFFFFF", "#223322", 0.6]} />

                  {/* Ground grid */}
                  <Grid
                    args={[10, 10]}
                    position={[0, -1.1, 0]}
                    cellColor="#C4A35A"
                    sectionColor="#1A3C2F"
                    fadeDistance={8}
                    cellSize={0.5}
                    sectionSize={2}
                    infiniteGrid
                  />

                  {/* Model */}
                  <Suspense fallback={null}>
                    <CadMesh geometry={geometry} />
                  </Suspense>

                  <OrbitControls
                    makeDefault
                    autoRotate={autoRotate}
                    autoRotateSpeed={2.5}
                    enableDamping
                    dampingFactor={0.06}
                    minDistance={0.5}
                    maxDistance={20}
                  />
                </Canvas>
                </CanvasErrorBoundary>
              </div>

              {/* Stats bar at bottom */}
              {cadInfo && (
                <div className="bg-[#102A20] px-6 py-2.5 border-t border-[#C4A35A]/10 flex items-center gap-6 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  <span>Format: <span className="text-[#C4A35A]">STL</span></span>
                  {cadInfo.triangleCount && <span>Faces: <span className="text-white/70">{cadInfo.triangleCount.toLocaleString()}</span></span>}
                  {cadInfo.boundingBox && (
                    <span>
                      Box: <span className="text-white/70">
                        {cadInfo.boundingBox.x} × {cadInfo.boundingBox.y} × {cadInfo.boundingBox.z}
                      </span>
                    </span>
                  )}
                  <span className="ml-auto">WebGL · Three.js</span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
