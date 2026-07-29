"use client";

/**
 * InteractiveHardwareStudio.tsx
 * Premium 3-mode hardware viewer — PCB Gerber | 3D PCB | 3D Assembly (Step-by-step part inspection)
 */

import React, {
  useState, useRef, useEffect, useCallback, useMemo,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu, Box, Layers, Download, RotateCcw, Maximize2, Eye,
  EyeOff, Grid3X3, Play, Pause, Search, ChevronLeft, ChevronRight,
  Loader2, AlertTriangle, X, Zap, Monitor, List, CheckCircle2, Focus, Lock, Check,
} from "lucide-react";
import JSZip from "jszip";
import * as THREE from "three";
import { getImageUrl } from "@/lib/imageUrl";
import { GerberViewer } from "@/components/admin/GerberViewer";
import { CadViewer } from "@/components/admin/CadViewer";

// ─── Types ─────────────────────────────────────────────────────────────────────
type StudioMode = "gerber" | "pcb3d" | "assembly";

interface StudioProps {
  title: string;
  gerberPath?: string | null;
  cadPath?: string | null;
  pcbImage?: string | null;
  assemblyZipPath?: string | null;
  hasPcbAccess?: boolean;
  hasCadAccess?: boolean;
  hasFullAccess?: boolean;
  basePrice?: number;
}

interface AssemblyPart {
  id: string;
  name: string;
  geometry: THREE.BufferGeometry;
  visible: boolean;
  color: string;
  originalPosition: THREE.Vector3;
}

// ─── Error Boundary ────────────────────────────────────────────────────────────
class ViewerErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; msg: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, msg: "" };
  }
  static getDerivedStateFromError(err: Error) { return { hasError: true, msg: err.message }; }
  render() {
    if (this.state.hasError) return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/60 p-8">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
        <p className="text-sm font-bold text-white/80">Viewer Error</p>
        <p className="text-xs text-center max-w-xs">{this.state.msg}</p>
      </div>
    );
    return this.props.children;
  }
}

// ─── Animated Tab Button ────────────────────────────────────────────────────────
function StudioTab({ mode, activeMode, icon: Icon, label, badge, onClick }: {
  mode: StudioMode; activeMode: StudioMode; icon: any;
  label: string; badge?: string; onClick: () => void;
}) {
  const isActive = activeMode === mode;
  return (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
        isActive ? "bg-[#1A3C2F] text-white shadow-lg shadow-[#1A3C2F]/25"
                 : "text-[#1A3C2F]/60 hover:text-[#1A3C2F] hover:bg-[#1A3C2F]/5"
      }`}
    >
      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C4A35A]" : "text-[#1A3C2F]/40"}`} />
      {label}
      {badge && (
        <span className={`text-[0.55rem] font-black px-1.5 py-0.5 rounded-full ${
          isActive ? "bg-[#C4A35A] text-[#1A3C2F]" : "bg-[#1A3C2F]/10 text-[#1A3C2F]/50"
        }`}>{badge}</span>
      )}
    </motion.button>
  );
}

// ─── Tool Button ────────────────────────────────────────────────────────────────
function ToolBtn({ icon: Icon, label, onClick, active }: {
  icon: any; label: string; onClick: () => void; active?: boolean;
}) {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
      onClick={onClick} title={label}
      className={`p-2 rounded-xl transition-all ${
        active
          ? "bg-[#C4A35A]/15 text-[#C4A35A] border border-[#C4A35A]/40"
          : "bg-white/5 hover:bg-white/12 text-white/60 hover:text-white border border-white/10"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
    </motion.button>
  );
}

// ─── Loading Overlay ────────────────────────────────────────────────────────────
function LoadingOverlay({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0A1A12]/90 backdrop-blur-sm z-20 rounded-2xl">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-[#C4A35A]/20 border-t-[#C4A35A] animate-spin" />
        <Zap className="w-5 h-5 text-[#C4A35A] absolute inset-0 m-auto" />
      </div>
      <p className="text-xs text-white/60 font-semibold">{label}</p>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ mode }: { mode: StudioMode }) {
  const configs: Record<StudioMode, { icon: any; title: string; sub: string }> = {
    gerber: { icon: Cpu, title: "No Gerber File", sub: "Upload a Gerber ZIP to view PCB layers" },
    pcb3d: { icon: Box, title: "No 3D PCB File", sub: "Upload a PCB 3D ZIP for interactive 3D view" },
    assembly: { icon: Layers, title: "No Assembly File", sub: "Upload a CAD Assembly ZIP with STL parts" },
  };
  const { icon: Icon, title, sub } = configs[mode];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <Icon className="w-8 h-8 text-[#C4A35A]/60" />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-white/60">{title}</p>
        <p className="text-xs text-white/30 mt-1">{sub}</p>
      </div>
    </div>
  );
}

// ─── Assembly Three.js Canvas ────────────────────────────────────────────────
function AssemblyCanvas({
  parts, wireframe, showGrid, autoRotate,
}: {
  parts: AssemblyPart[]; wireframe: boolean; showGrid: boolean;
  autoRotate: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const frameRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef(new THREE.Spherical(25, Math.PI / 3, Math.PI / 4));
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const gridRef = useRef<THREE.GridHelper | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth, h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0A1A12");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 500);
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(20, 30, 20);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    scene.add(dir);

    const fillLight = new THREE.DirectionalLight(0x88ffcc, 0.4);
    fillLight.position.set(-20, 10, -20);
    scene.add(fillLight);

    const rim = new THREE.PointLight(0xC4A35A, 0.8, 50);
    rim.position.set(10, 15, -10);
    scene.add(rim);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: "#0D2018", roughness: 1 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(80, 80, "#1A3C2F", "#1A3C2F");
    (grid.material as THREE.Material).opacity = 0.3;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);
    gridRef.current = grid;

    const handleResize = () => {
      if (!mount || !renderer || !camera) return;
      const w2 = mount.clientWidth, h2 = mount.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);

    let rotAngle = sphericalRef.current.theta;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (!isDraggingRef.current && autoRotate) {
        rotAngle += 0.003;
        sphericalRef.current.theta = rotAngle;
      }
      const pos = new THREE.Vector3().setFromSpherical(sphericalRef.current);
      camera.position.copy(pos.add(targetRef.current));
      camera.lookAt(targetRef.current);
      renderer.render(scene, camera);
    };
    animate();

    const onDown = (e: PointerEvent) => { isDraggingRef.current = true; prevPointerRef.current = { x: e.clientX, y: e.clientY }; };
    const onMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevPointerRef.current.x, dy = e.clientY - prevPointerRef.current.y;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
      sphericalRef.current.theta -= dx * 0.008;
      sphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sphericalRef.current.phi - dy * 0.008));
      rotAngle = sphericalRef.current.theta;
    };
    const onUp = () => { isDraggingRef.current = false; };
    const onWheel = (e: WheelEvent) => { e.preventDefault(); sphericalRef.current.radius = Math.max(5, Math.min(150, sphericalRef.current.radius + e.deltaY * 0.04)); };
    const onReset = () => { sphericalRef.current.set(25, Math.PI / 3, Math.PI / 4); rotAngle = sphericalRef.current.theta; targetRef.current.set(0, 0, 0); };

    mount.addEventListener("pointerdown", onDown);
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerup", onUp);
    mount.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("__studio_reset_camera", onReset);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      mount.removeEventListener("pointerdown", onDown);
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerup", onUp);
      mount.removeEventListener("wheel", onWheel);
      window.removeEventListener("__studio_reset_camera", onReset);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => { if (gridRef.current) gridRef.current.visible = showGrid; }, [showGrid]);

  // Sync parts into scene and calculate camera framing
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    meshesRef.current.forEach((m) => scene.remove(m));
    meshesRef.current.clear();

    const visibleBox = new THREE.Box3();

    parts.forEach((part) => {
      const geo = part.geometry.clone();
      geo.computeVertexNormals();
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(part.color),
        roughness: 0.4, metalness: 0.3,
        wireframe, transparent: wireframe, opacity: wireframe ? 0.7 : 1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.visible = part.visible;
      mesh.position.copy(part.originalPosition);
      scene.add(mesh);
      meshesRef.current.set(part.id, mesh);

      if (part.visible) {
        const partBox = new THREE.Box3().setFromObject(mesh);
        visibleBox.union(partBox);
      }
    });

    // Auto-fit camera framing to visible parts
    if (!visibleBox.isEmpty()) {
      const center = new THREE.Vector3();
      visibleBox.getCenter(center);
      const size = new THREE.Vector3();
      visibleBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const fitRadius = Math.max(maxDim * 2.2, 12);
        sphericalRef.current.radius = fitRadius;
        targetRef.current.copy(center);
      }
    }
  }, [parts, wireframe]);

  return <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />;
}

// ─── Assembly Panel ─────────────────────────────────────────────────────────────
function AssemblyViewerPanel({ zipPath, title }: { zipPath?: string | null; title: string }) {
  const [parts, setParts] = useState<AssemblyPart[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [err, setErr] = useState("");
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [modeSingle, setModeSingle] = useState(true); // Default to one-by-one inspection!
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);

  const COLORS = ["#4ade80","#60a5fa","#f472b6","#fb923c","#a78bfa","#34d399","#fbbf24","#e879f9","#22d3ee","#f87171"];

  useEffect(() => {
    if (!zipPath) return;
    const url = getImageUrl(zipPath);
    setStatus("loading");
    fetch(url).then((r) => r.arrayBuffer()).then(async (buf) => {
      const zip = await JSZip.loadAsync(buf);
      const stlFiles = Object.entries(zip.files).filter(([n]) => n.toLowerCase().endsWith(".stl") && !zip.files[n].dir);
      if (!stlFiles.length) { setErr("Component placement data not provided in upload"); setStatus("error"); return; }
      const { STLLoader } = await import("three-stdlib");
      const loader = new STLLoader();
      const loaded: AssemblyPart[] = [];
      const combinedBbox = new THREE.Box3();
      for (const [name, file] of stlFiles) {
        try {
          const ab = await file.async("arraybuffer");
          const geo = loader.parse(ab);
          geo.computeBoundingBox();
          if (geo.boundingBox) combinedBbox.union(geo.boundingBox);
          loaded.push({ id: name, name: name.replace(".stl","").replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase()), geometry: geo, visible: false, color: COLORS[loaded.length % COLORS.length], originalPosition: new THREE.Vector3() });
        } catch {}
      }
      const center = new THREE.Vector3();
      combinedBbox.getCenter(center);
      loaded.forEach((p) => {
        const box = new THREE.Box3().setFromObject(new THREE.Mesh(p.geometry));
        const pc = new THREE.Vector3();
        box.getCenter(pc);
        p.originalPosition = pc.clone().sub(center);
        p.geometry.translate(-center.x, -center.y, -center.z);
      });

      // Show first part by default for step-by-step JLCPCB style inspection!
      if (loaded.length > 0) {
        loaded[0].visible = true;
      }
      setParts(loaded);
      setActivePartIndex(0);
      setStatus("ready");
    }).catch((e) => { setErr(e.message); setStatus("error"); });
  }, [zipPath]);

  // Select single part mode or toggle part visibility
  const selectPart = useCallback((index: number) => {
    setActivePartIndex(index);
    setParts((prev) => prev.map((pt, idx) => ({
      ...pt,
      visible: modeSingle ? idx === index : (idx === index ? !pt.visible : pt.visible),
    })));
  }, [modeSingle]);

  const toggleAll = (visible: boolean) => {
    setModeSingle(false);
    setParts((p) => p.map((pt) => ({ ...pt, visible })));
  };

  const nextPart = () => {
    if (parts.length === 0) return;
    const nextIdx = (activePartIndex + 1) % parts.length;
    selectPart(nextIdx);
  };

  const prevPart = () => {
    if (parts.length === 0) return;
    const prevIdx = (activePartIndex - 1 + parts.length) % parts.length;
    selectPart(prevIdx);
  };

  const filtered = useMemo(() => parts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())), [parts, search]);

  if (!zipPath) return <EmptyState mode="assembly" />;

  return (
    <div className="absolute inset-0 flex">
      {/* Side Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div initial={{ x: -280, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-64 flex-shrink-0 bg-black/60 backdrop-blur-md border-r border-white/10 flex flex-col z-10"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Focus className="w-3.5 h-3.5 text-[#C4A35A]" />
                  <span className="text-xs font-black text-white/90 uppercase tracking-wider">Part Inspector</span>
                  <span className="text-[0.6rem] bg-[#C4A35A]/20 text-[#C4A35A] px-2 py-0.5 rounded-full font-bold">
                    {activePartIndex + 1}/{parts.length}
                  </span>
                </div>
                <button onClick={() => setPanelOpen(false)} className="text-white/30 hover:text-white/70 transition-colors"><X className="w-3.5 h-3.5" /></button>
              </div>

              {/* Step Navigation Bar */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 mb-3">
                <button onClick={prevPart} className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors" title="Previous Part">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center truncate">
                  <p className="text-[0.65rem] font-bold text-white/90 truncate">{parts[activePartIndex]?.name || "Select Part"}</p>
                </div>
                <button onClick={nextPart} className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors" title="Next Part">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 mb-3">
                <button
                  onClick={() => { setModeSingle(true); selectPart(activePartIndex); }}
                  className={`flex-1 text-[0.6rem] font-bold py-1 rounded-lg transition-colors ${modeSingle ? "bg-[#C4A35A] text-[#1A3C2F]" : "text-white/50 hover:text-white"}`}
                >
                  Step Inspection
                </button>
                <button
                  onClick={() => toggleAll(true)}
                  className={`flex-1 text-[0.6rem] font-bold py-1 rounded-lg transition-colors ${!modeSingle ? "bg-[#C4A35A] text-[#1A3C2F]" : "text-white/50 hover:text-white"}`}
                >
                  Full Assembly
                </button>
              </div>

              <div className="relative">
                <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter parts..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white/80 placeholder-white/30 focus:outline-none focus:border-[#C4A35A]/50" />
              </div>
            </div>

            {/* Parts List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {status === "loading" && <div className="flex items-center gap-2 p-3 text-white/40 text-xs"><Loader2 className="w-4 h-4 animate-spin text-[#C4A35A]" />Parsing STL assembly files...</div>}
              {status === "error" && <div className="p-3 text-xs text-red-400">{err}</div>}
              {filtered.map((part) => {
                const originalIdx = parts.findIndex(p => p.id === part.id);
                const isSelected = originalIdx === activePartIndex;
                return (
                  <motion.button key={part.id} whileHover={{ x: 2 }} onClick={() => selectPart(originalIdx)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                      isSelected ? "bg-[#C4A35A]/20 border border-[#C4A35A]/40 text-white font-bold" : part.visible ? "bg-white/5 hover:bg-white/10 text-white/70" : "opacity-40 hover:opacity-70 text-white/50"
                    }`}
                  >
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: part.color }} />
                    <span className="text-xs font-semibold flex-1 truncate">{part.name}</span>
                    {part.visible ? <Eye className="w-3 h-3 text-green-400 flex-shrink-0" /> : <EyeOff className="w-3 h-3 text-white/20 flex-shrink-0" />}
                  </motion.button>
                );
              })}
            </div>

            <div className="p-3 border-t border-white/10 flex gap-2">
              <button onClick={() => toggleAll(true)} className="flex-1 text-[0.65rem] font-bold py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-all">Show All</button>
              <button onClick={() => toggleAll(false)} className="flex-1 text-[0.65rem] font-bold py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-all">Hide All</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <div className="flex-1 relative">
        {status === "loading" && <LoadingOverlay label="Extracting STL parts from assembly ZIP..." />}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
            <AlertTriangle className="w-10 h-10 text-amber-400" />
            <p className="text-sm font-bold text-white/70">Load Failed</p>
            <p className="text-xs text-white/40 text-center">{err}</p>
          </div>
        )}
        {status === "ready" && <AssemblyCanvas parts={parts} wireframe={wireframe} showGrid={showGrid} autoRotate={autoRotate} />}

        {!panelOpen && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => setPanelOpen(true)}
            className="absolute left-3 top-3 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
          >
            <List className="w-3.5 h-3.5 text-[#C4A35A]" /> Parts
          </motion.button>
        )}

        {/* Top Controls */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <ToolBtn icon={showGrid ? Grid3X3 : Grid3X3} label="Grid" onClick={() => setShowGrid(g => !g)} active={showGrid} />
          <ToolBtn icon={wireframe ? Eye : Eye} label="Wireframe" onClick={() => setWireframe(w => !w)} active={wireframe} />
          <ToolBtn icon={autoRotate ? Pause : Play} label="Auto Rotate" onClick={() => setAutoRotate(a => !a)} active={autoRotate} />
          <ToolBtn icon={RotateCcw} label="Reset Camera" onClick={() => window.dispatchEvent(new Event("__studio_reset_camera"))} />
        </div>

        {/* Bottom Part Step Bar */}
        {status === "ready" && parts.length > 0 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-3">
            <button onClick={prevPart} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center px-2">
              <p className="text-[0.65rem] font-black text-[#C4A35A] uppercase tracking-wider">Part {activePartIndex + 1} of {parts.length}</p>
              <p className="text-xs font-bold text-white max-w-[150px] truncate">{parts[activePartIndex]?.name}</p>
            </div>

            <button onClick={nextPart} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export function InteractiveHardwareStudio({
  title, gerberPath, cadPath, pcbImage, assemblyZipPath,
  hasPcbAccess = false, hasCadAccess = false, hasFullAccess = false, basePrice = 49,
}: StudioProps) {
  const hasGerber = !!gerberPath;
  const hasCad = !!cadPath;
  const hasAssembly = !!assemblyZipPath;

  const defaultMode: StudioMode = hasGerber ? "gerber" : hasCad ? "pcb3d" : "assembly";
  const [activeMode, setActiveMode] = useState<StudioMode>(defaultMode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  if (!hasGerber && !hasCad && !hasAssembly) return null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { sectionRef.current?.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };

  const dlUrl = (path?: string | null) => path ? getImageUrl(path) : "";

  const pcbPrice = Math.round(basePrice * 0.35);
  const cadPrice = Math.round(basePrice * 0.35);

  const canDownloadPcb = hasPcbAccess || hasFullAccess;
  const canDownloadCad = hasCadAccess || hasFullAccess;

  return (
    <section ref={sectionRef} className="space-y-0">
      <div className="bg-white rounded-3xl border border-[#1A3C2F]/8 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-[#1A3C2F]/8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2.5 text-base font-black text-[#1A3C2F] uppercase tracking-wider">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1A3C2F] to-[#2A5C4F] flex items-center justify-center shadow-md">
                  <Zap className="w-4 h-4 text-[#C4A35A]" />
                </div>
                Interactive Hardware Studio
              </h2>
              <p className="text-xs text-[#1A3C2F]/45 mt-1.5 ml-10">
                Inspect Gerber layers, view 3D PCB, and explore the full assembly — no software required
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#1A3C2F]/10 self-start sm:self-auto flex-wrap">
              {hasGerber && <StudioTab mode="gerber" activeMode={activeMode} icon={Cpu} label="PCB Gerber" onClick={() => setActiveMode("gerber")} />}
              {hasCad && <StudioTab mode="pcb3d" activeMode={activeMode} icon={Box} label="3D PCB" onClick={() => setActiveMode("pcb3d")} />}
              {hasAssembly && <StudioTab mode="assembly" activeMode={activeMode} icon={Layers} label="3D Assembly" badge="NEW" onClick={() => setActiveMode("assembly")} />}
            </div>
          </div>
        </div>

        {/* Viewer */}
        <div className="relative bg-[#0A1A12] overflow-hidden" style={{ height: isFullscreen ? "100vh" : "540px" }}>
          {/* Fullscreen Toggle */}
          <div className="absolute top-3.5 right-3.5 z-30">
            <button onClick={toggleFullscreen}
              className="p-2 bg-black/60 backdrop-blur-md border border-white/15 rounded-xl text-white/70 hover:text-white transition-all hover:bg-black/80 shadow-lg cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            >
              <Maximize2 className="w-4 h-4 text-[#C4A35A]" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0">
              <ViewerErrorBoundary>
                {activeMode === "gerber" && (hasGerber
                  ? <GerberViewer fileUrl={getImageUrl(gerberPath!)} boardTitle={`${title} PCB`} pcbImage={pcbImage} defaultViewMode="both" />
                  : <EmptyState mode="gerber" />
                )}
                {activeMode === "pcb3d" && (
                  hasCad ? (
                    <CadViewer
                      fileUrl={getImageUrl(cadPath!)}
                      cadTitle={`${title} 3D PCB`}
                      gerberFallbackUrl={hasGerber ? getImageUrl(gerberPath!) : undefined}
                      pcbImage={pcbImage}
                    />
                  ) : hasGerber ? (
                    <GerberViewer
                      fileUrl={getImageUrl(gerberPath!)}
                      boardTitle={`${title} 3D PCB`}
                      pcbImage={pcbImage}
                      defaultViewMode="3d"
                    />
                  ) : (
                    <EmptyState mode="pcb3d" />
                  )
                )}
                {activeMode === "assembly" && (
                  <AssemblyViewerPanel zipPath={assemblyZipPath} title={title} />
                )}
              </ViewerErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Bar */}
        <div className="px-6 sm:px-8 py-4 border-t border-[#1A3C2F]/8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-[#1A3C2F]/50">
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-[#C4A35A]" />
              <span className="font-semibold">Live WebGL Engine</span>
            </div>
            <span className="text-[#1A3C2F]/30">
              {activeMode === "gerber" && "• RS-274X Gerber Parser Active"}
              {activeMode === "pcb3d" && "• Three.js STL Renderer Active"}
              {activeMode === "assembly" && "• JLCPCB-Style Step Part Inspector"}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {hasGerber && (
              canDownloadPcb ? (
                <a href={dlUrl(gerberPath)} download className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Gerber ZIP (Unlocked)
                </a>
              ) : (
                <a href="#purchase-options" className="flex items-center gap-1.5 text-xs font-bold text-[#1A3C2F] bg-[#C4A35A]/15 hover:bg-[#C4A35A]/30 border border-[#C4A35A]/40 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                  <Lock className="w-3.5 h-3.5 text-[#C4A35A]" /> Buy Gerber ZIP (₹{pcbPrice})
                </a>
              )
            )}

            {hasCad && (
              canDownloadPcb ? (
                <a href={dlUrl(cadPath)} download className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> PCB 3D ZIP (Unlocked)
                </a>
              ) : (
                <a href="#purchase-options" className="flex items-center gap-1.5 text-xs font-bold text-[#1A3C2F] bg-[#C4A35A]/15 hover:bg-[#C4A35A]/30 border border-[#C4A35A]/40 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                  <Lock className="w-3.5 h-3.5 text-[#C4A35A]" /> Buy PCB 3D ZIP (₹{pcbPrice})
                </a>
              )
            )}

            {hasAssembly && (
              canDownloadCad ? (
                <a href={dlUrl(assemblyZipPath)} download className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 border border-emerald-600 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                  <Check className="w-3.5 h-3.5 text-white" /> CAD Assembly ZIP (Unlocked)
                </a>
              ) : (
                <a href="#purchase-options" className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#1A3C2F] hover:bg-[#C4A35A] hover:text-[#1A3C2F] px-3.5 py-2 rounded-xl transition-all shadow-sm">
                  <Lock className="w-3.5 h-3.5 text-[#C4A35A]" /> Buy CAD Assembly ZIP (₹{cadPrice})
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
