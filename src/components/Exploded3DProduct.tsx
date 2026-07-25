import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Layers, RotateCw, Move3d, MousePointer, Eye, Play, Pause } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════ */

const TOTAL_FRAMES = 142;
const FRAME_PATH = '/explode-frames/frame_';
const FRAME_EXT = '.jpg';

function getFrameSrc(index: number): string {
  const num = String(Math.max(1, Math.min(TOTAL_FRAMES, index))).padStart(4, '0');
  return `${FRAME_PATH}${num}${FRAME_EXT}`;
}

// Lerp helper for smooth animations
function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor;
}

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

interface Exploded3DProductProps {
  explosionFactor?: number;
  onExplosionChange?: (val: number) => void;
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export const Exploded3DProduct: React.FC<Exploded3DProductProps> = ({
  explosionFactor: externalExplosionFactor,
  onExplosionChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Explosion state
  const [internalExplosion, setInternalExplosion] = useState(0);
  const [manualControl, setManualControl] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const explosion = manualControl ? (externalExplosionFactor ?? internalExplosion) : internalExplosion;

  // Ref for smooth animation loop
  const smoothedExplosionRef = useRef(0);
  const targetExplosionRef = useRef(0);
  const currentDrawnFrameRef = useRef(0);

  // UI state
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  // Current frame index from raw explosion factor (just for UI display)
  const uiFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(explosion * (TOTAL_FRAMES - 1)) + 1));

  // Sync React state to our target ref for the animation loop
  useEffect(() => {
    targetExplosionRef.current = explosion;
  }, [explosion]);

  /* ─── PRELOAD ALL FRAMES ─── */
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        count++;
        loadedCountRef.current = count;
        setLoadProgress(Math.round((count / TOTAL_FRAMES) * 100));
        if (count === TOTAL_FRAMES) {
          setLoaded(true);
        }
      };
      img.onerror = () => {
        count++;
        loadedCountRef.current = count;
        if (count === TOTAL_FRAMES) {
          setLoaded(true);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;
  }, []);

  /* ─── RENDER LOOP (BUTTERY SMOOTH CANVAS DRAWING) ─── */
  useEffect(() => {
    if (!loaded) return;
    
    let rafId: number;

    const render = () => {
      // Lerp the explosion value for buttery smooth scrubbing
      smoothedExplosionRef.current = lerp(smoothedExplosionRef.current, targetExplosionRef.current, 0.1);
      
      const frameToDraw = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(smoothedExplosionRef.current * (TOTAL_FRAMES - 1)) + 1));
      
      // Only draw if the frame actually changed or if we just loaded
      if (frameToDraw !== currentDrawnFrameRef.current) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const img = imagesRef.current[frameToDraw - 1];
            if (img && img.complete) {
              const dpr = Math.min(window.devicePixelRatio, 2);
              const cw = canvas.width / dpr;
              const ch = canvas.height / dpr;

              ctx.clearRect(0, 0, cw, ch);

              // Draw image to fit within canvas while maintaining aspect ratio (contain)
              const imgRatio = img.naturalWidth / img.naturalHeight;
              const canvasRatio = cw / ch;

              let drawW: number, drawH: number, drawX: number, drawY: number;

              if (canvasRatio > imgRatio) {
                drawH = ch;
                drawW = ch * imgRatio;
                drawX = (cw - drawW) / 2;
                drawY = 0;
              } else {
                drawW = cw;
                drawH = cw / imgRatio;
                drawX = 0;
                drawY = (ch - drawH) / 2;
              }

              ctx.drawImage(img, drawX, drawY, drawW, drawH);
              currentDrawnFrameRef.current = frameToDraw;
            }
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(rafId);
  }, [loaded]);

  /* ─── RESIZE HANDLER ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;

    const handleResize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      
      // Force a redraw on next frame
      currentDrawnFrameRef.current = 0;
    };

    // Initial resize setup
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loaded]);

  /* ─── AUTO-PLAY ANIMATION ─── */
  useEffect(() => {
    if (manualControl || !isPlaying) return;

    let running = true;
    let time = 0;
    let rafId: number;

    const animate = () => {
      if (!running) return;
      time += 0.006;
      // Smooth sine wave oscillation 0 → 1 → 0
      const t = (Math.sin(time) + 1) / 2;
      const eased = t * t * (3 - 2 * t); // smoothstep
      setInternalExplosion(eased);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => { 
      running = false; 
      cancelAnimationFrame(rafId);
    };
  }, [manualControl, isPlaying]);

  /* ─── HANDLERS ─── */
  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setManualControl(true);
    setIsPlaying(false);
    setInternalExplosion(val);
    if (onExplosionChange) onExplosionChange(val);
  }, [onExplosionChange]);

  const handleExpand = useCallback(() => {
    setManualControl(true);
    setIsPlaying(false);
    setInternalExplosion(1);
    if (onExplosionChange) onExplosionChange(1);
  }, [onExplosionChange]);

  const handleCollapse = useCallback(() => {
    setManualControl(true);
    setIsPlaying(false);
    setInternalExplosion(0);
    if (onExplosionChange) onExplosionChange(0);
  }, [onExplosionChange]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setManualControl(false);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  /* ─── LAYER INFO ─── */
  const layersInfo = [
    { id: 7, name: '07 / ENCLOSURE', color: '#1A1A1A' },
    { id: 6, name: '06 / DISPLAY & UI', color: '#E67E22' },
    { id: 5, name: '05 / PCB & ELECTRONICS', color: '#C4A35A' },
    { id: 4, name: '04 / BATTERY & POWER', color: '#111111' },
    { id: 3, name: '03 / FRAME & STRUCTURE', color: '#B8BFC6' },
    { id: 2, name: '02 / 3D PRINTED PARTS', color: '#6B7280' },
    { id: 1, name: '01 / FRONT COVER', color: '#FAF8F5' },
  ];

  return (
    <div className="relative w-full h-full min-h-[520px] lg:min-h-[680px] flex flex-col justify-between items-center group">

      {/* Loading Indicator */}
      {!loaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#F5F0EA] rounded-2xl">
          <div className="w-48 h-1 bg-[#E8E2D9] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#1A3C2F] rounded-full transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold tracking-wider text-[#5C6B60] uppercase">
            Loading Product · {loadProgress}%
          </span>
        </div>
      )}

      {/* Canvas (frame display) */}
      <div className="absolute inset-0 w-full h-full z-10 rounded-2xl overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: loaded ? 'block' : 'none' }}
        />
      </div>

      {/* Layer Tag Badges (Horizontal at top) */}
      <div className="absolute top-4 left-4 right-4 z-20 hidden sm:flex flex-wrap justify-center gap-2">
        {layersInfo.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveLayer(item.id)}
            onMouseLeave={() => setActiveLayer(null)}
            className={`px-2.5 py-1 rounded-xl border transition-all duration-300 text-[9px] font-semibold tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-md ${
              activeLayer === item.id
                ? 'bg-[#1A3C2F] text-[#FAF8F5] border-[#1A3C2F] scale-105 shadow-md'
                : 'bg-[#FAF8F5]/80 text-[#5C6B60] border-[#E8E2D9] hover:bg-[#1A3C2F] hover:text-[#FAF8F5]'
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full border border-[#E8E2D9]"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Bottom Floating Interactive Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF8F5]/90 backdrop-blur-md border border-[#E8E2D9] shadow-lg">
        {/* Explosion Range Slider */}
        <div className="flex items-center gap-3 w-full sm:flex-1">
          <Layers className="w-4 h-4 text-[#1A3C2F] shrink-0" />
          <span className="text-[11px] font-bold tracking-wider text-[#1A3C2F] uppercase whitespace-nowrap shrink-0">
            Explode 3D:
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={explosion}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-[#E8E2D9] rounded-lg appearance-none cursor-pointer accent-[#1A3C2F]"
          />
          <span className="text-[11px] font-mono text-[#5C6B60] min-w-[32px] shrink-0 text-right">
            {Math.round(explosion * 100)}%
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className={`p-1.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPlaying && !manualControl
                ? 'bg-[#1A3C2F] text-[#FAF8F5] border-[#1A3C2F]'
                : 'bg-[#FAF8F5] text-[#5C6B60] border-[#E8E2D9] hover:text-[#1A3C2F]'
            }`}
          >
            {isPlaying && !manualControl ? (
              <><Pause className="w-3.5 h-3.5" /><span>Pause</span></>
            ) : (
              <><Play className="w-3.5 h-3.5" /><span>Auto</span></>
            )}
          </button>

          <button
            onClick={handleExpand}
            className={`px-2.5 py-1 rounded-lg border text-[10px] font-semibold cursor-pointer transition-colors ${
              explosion >= 0.95
                ? 'bg-[#1A3C2F] text-[#FAF8F5] border-[#1A3C2F]'
                : 'bg-[#FAF8F5] text-[#5C6B60] border-[#E8E2D9] hover:bg-[#1A3C2F] hover:text-[#FAF8F5]'
            }`}
          >
            Expand
          </button>
          <button
            onClick={handleCollapse}
            className={`px-2.5 py-1 rounded-lg border text-[10px] font-semibold cursor-pointer transition-colors ${
              explosion <= 0.05
                ? 'bg-[#1A3C2F] text-[#FAF8F5] border-[#1A3C2F]'
                : 'bg-[#FAF8F5] text-[#5C6B60] border-[#E8E2D9] hover:bg-[#1A3C2F] hover:text-[#FAF8F5]'
            }`}
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Bottom Interaction Hints */}
      <div className="absolute bottom-[-36px] left-0 right-0 z-20 flex items-center justify-center gap-6">
        <span className="flex items-center gap-1.5 text-[10px] text-[#5C6B60] font-medium tracking-wide">
          <Eye className="w-3 h-3" /> Frame {uiFrame} / {TOTAL_FRAMES}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-[#5C6B60] font-medium tracking-wide">
          <Layers className="w-3 h-3" /> Slide to explode
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-[#5C6B60] font-medium tracking-wide">
          <MousePointer className="w-3 h-3" /> Click Expand / Collapse
        </span>
      </div>
    </div>
  );
};
