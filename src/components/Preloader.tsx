import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

// ── Brand palette from creato4-logo.svg ──────────────────────
const C = {
  green:  '#1C482A',
  cream:  '#F6F1E5',
  gold:   '#C4A35A',
  dark:   '#14371F',
};

// Helpers ─────────────────────────────────────────────────────
const lerp    = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp   = (t: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, t));
const easeOut = (t: number, p = 3) => 1 - Math.pow(1 - t, p);
const easeIO  = (t: number) => t < 0.5 ? 4*t*t*t : 1 - (-2*t+2)**3/2;

const prog = (t: number, s: number, e: number, fn = easeOut) =>
  fn(clamp((t - s) / (e - s)));

const hex2rgb = (h: string) => {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)!;
  return [parseInt(r[1],16), parseInt(r[2],16), parseInt(r[3],16)] as const;
};
const rgba = (hex: string, a: number) => {
  const [r,g,b] = hex2rgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const startRef   = useRef<number>(0);

  const [showLogo,    setShowLogo]    = useState(false);
  const [showTag,     setShowTag]     = useState(false);
  const [dissolving,  setDissolving]  = useState(false);
  const [gone,        setGone]        = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── State flags so we only fire React state updates once ── */
    let did = { logo: false, tag: false, dissolve: false, done: false };

    /* ─────────────────────────────────────────────────────────
       DRAW LOOP — everything is drawn here, pure canvas, 60fps
    ───────────────────────────────────────────────────────── */
    const draw = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const t  = (ts - startRef.current) / 1000;   // seconds elapsed
      const W  = canvas.width;
      const H  = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const S  = Math.min(W, H);                    // shortest dimension

      /* CLEAR */
      ctx.clearRect(0, 0, W, H);

      /* ── BACKGROUND ───────────────────────────── */
      ctx.fillStyle = C.green;
      ctx.fillRect(0, 0, W, H);

      /* Soft centre radial glow */
      {
        const a = prog(t, 0.3, 1.4) * 0.4;
        if (a > 0) {
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.55);
          g.addColorStop(0,   rgba(C.dark, a));
          g.addColorStop(0.6, rgba(C.dark, a * 0.2));
          g.addColorStop(1,   rgba(C.dark, 0));
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        }
      }

      /* ── PHASE 1 ── SCANNER LINES  (0.1 → 1.1s) ─ */
      /* Horizontal cream sweep */
      {
        const p = prog(t, 0.1, 0.85);
        if (p > 0 && p < 1) {
          const x = lerp(-200, W + 40, p);
          const g = ctx.createLinearGradient(x - 280, 0, x + 8, 0);
          g.addColorStop(0,    rgba(C.cream, 0));
          g.addColorStop(0.4,  rgba(C.cream, 0.06));
          g.addColorStop(0.85, rgba(C.cream, 0.28));
          g.addColorStop(1,    rgba(C.cream, 0.75));
          ctx.strokeStyle = g;
          ctx.lineWidth   = 1.5;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(Math.max(0, x - 300), cy);
          ctx.lineTo(Math.min(W, x), cy);
          ctx.stroke();
          // leading dot
          ctx.fillStyle = rgba(C.cream, 0.9);
          ctx.beginPath(); ctx.arc(x, cy, 2, 0, Math.PI*2); ctx.fill();
        }
      }

      /* Vertical gold sweep (starts 0.25s after) */
      {
        const p = prog(t, 0.35, 1.1);
        if (p > 0 && p < 1) {
          const y = lerp(-200, H + 40, p);
          const g = ctx.createLinearGradient(0, y - 280, 0, y + 8);
          g.addColorStop(0,    rgba(C.gold, 0));
          g.addColorStop(0.4,  rgba(C.gold, 0.05));
          g.addColorStop(0.85, rgba(C.gold, 0.22));
          g.addColorStop(1,    rgba(C.gold, 0.65));
          ctx.strokeStyle = g;
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.moveTo(cx, Math.max(0, y - 300));
          ctx.lineTo(cx, Math.min(H, y));
          ctx.stroke();
          ctx.fillStyle = rgba(C.gold, 0.85);
          ctx.beginPath(); ctx.arc(cx, y, 1.5, 0, Math.PI*2); ctx.fill();
        }
      }

      /* After sweep, faint crosshair stays */
      {
        const a = prog(t, 1.0, 1.6) * 0.08 * (1 - prog(t, 3.6, 4.2));
        if (a > 0) {
          ctx.strokeStyle = rgba(C.cream, a);
          ctx.lineWidth   = 0.5;
          ctx.setLineDash([]);
          ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
        }
      }

      /* ── PHASE 2 ── SPARSE DOT GRID  (0.8 → 3.8s) ─ */
      {
        const fadeIn  = prog(t, 0.8, 1.6);
        const fadeOut = 1 - prog(t, 3.6, 4.3);
        const a       = fadeIn * fadeOut;
        if (a > 0.01) {
          const sp = S * 0.065;
          const cols = Math.ceil(W / sp) + 2;
          const rows = Math.ceil(H / sp) + 2;
          for (let c = -1; c <= cols; c++) {
            for (let r = -1; r <= rows; r++) {
              const dx = (c + 0.5) * sp - cx;
              const dy = (r + 0.5) * sp - cy;
              const dist   = Math.hypot(dx, dy);
              const falloff = 1 - dist / (Math.hypot(cx, cy) * 1.1);
              const da = a * falloff * 0.22;
              if (da > 0.01) {
                ctx.fillStyle = rgba(C.cream, da);
                ctx.beginPath();
                ctx.arc(cx + dx, cy + dy, 0.9, 0, Math.PI*2);
                ctx.fill();
              }
            }
          }
        }
      }

      /* ── PHASE 3 ── CONCENTRIC RINGS  (1.0 → 4.0s) ─ */
      {
        const NUM = 7;
        for (let i = 0; i < NUM; i++) {
          const delay   = 1.0 + i * 0.14;
          const fadeIn  = prog(t, delay, delay + 0.55);
          const fadeOut = 1 - prog(t, 3.4, 4.1);
          const a       = fadeIn * fadeOut;
          if (a < 0.01) continue;

          const baseR  = S * (0.055 + i * 0.065);
          const radius = baseR * lerp(0.85, 1, fadeIn);
          const gold   = i === 0 || i === 4;
          const color  = gold ? C.gold : C.cream;
          const opac   = a * (gold ? 0.45 : 0.18 - i * 0.01);

          ctx.strokeStyle = rgba(color, Math.max(0, opac));
          ctx.lineWidth   = gold ? 1 : 0.5;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI*2);
          ctx.stroke();
        }
      }

      /* ── PHASE 4 ── ORBITING ARC FRAGMENTS  (1.6 → 4.2s) ─ */
      {
        const NUM     = 5;
        const fadeOut = 1 - prog(t, 3.8, 4.3);
        const ORBIT_R = S * 0.28;

        for (let i = 0; i < NUM; i++) {
          const delay      = 1.6 + i * 0.18;
          const fadeIn     = prog(t, delay, delay + 0.7);
          const a          = fadeIn * fadeOut;
          if (a < 0.01) continue;

          const baseAngle  = (i / NUM) * Math.PI * 2;
          const converge   = prog(t, 2.8, 4.0, easeIO);  // 0=orbit, 1=center
          const orbitR     = ORBIT_R * (1 - converge);
          const spin       = t * 0.4 * (1 - converge);
          const angle      = baseAngle + spin;

          const px = cx + Math.cos(angle) * orbitR;
          const py = cy + Math.sin(angle) * orbitR;

          const colors = [C.cream, C.gold, C.cream, C.gold, C.cream];
          const col    = colors[i];

          // Arc segment
          const arcLen  = Math.PI * (0.35 + converge * 0.15);
          const arcRot  = angle + t * 0.7;
          const arcR    = 10 + (1 - converge) * 10;

          ctx.strokeStyle = rgba(col, a * (0.7 + converge * 0.3));
          ctx.lineWidth   = 1 + converge * 0.5;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(px, py, arcR, arcRot, arcRot + arcLen);
          ctx.stroke();

          // Glowing endpoint
          const epx = px + Math.cos(arcRot) * arcR;
          const epy = py + Math.sin(arcRot) * arcR;
          ctx.fillStyle = rgba(col, a * 0.9);
          ctx.beginPath(); ctx.arc(epx, epy, 1.8, 0, Math.PI*2); ctx.fill();

          // Converging dashed line to centre
          if (converge > 0.25) {
            const la = clamp((converge - 0.25) / 0.5) * fadeOut * 0.35;
            ctx.strokeStyle = rgba(col, la);
            ctx.lineWidth   = 0.5;
            ctx.setLineDash([3, 5]);
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy); ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      /* ── PHASE 5 ── PULSING CENTRE POINT  (1.2 → 4.3s) ─ */
      {
        const fadeIn  = prog(t, 1.2, 1.8);
        const fadeOut = 1 - prog(t, 4.0, 4.4);
        const a       = fadeIn * fadeOut;
        if (a > 0.01) {
          const pulse = 1 + Math.sin(t * 4) * 0.35 * (1 - prog(t, 3.5, 4.0));
          const glowR = 32 * pulse;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
          g.addColorStop(0,   rgba(C.gold, a * 0.2));
          g.addColorStop(0.5, rgba(C.gold, a * 0.08));
          g.addColorStop(1,   rgba(C.gold, 0));
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = rgba(C.gold, a * 0.95);
          ctx.beginPath(); ctx.arc(cx, cy, 2.2, 0, Math.PI*2); ctx.fill();
        }
      }

      /* ── PHASE 6 ── GOLDEN ARC TRACE  (3.8 → 4.7s) ─ */
      {
        const p      = prog(t, 3.8, 4.7);
        const fadeOut = 1 - prog(t, 4.9, 5.3);
        if (p > 0) {
          const r = S * 0.12;
          // outer gold ring draws clockwise
          ctx.strokeStyle = rgba(C.gold,  p * fadeOut * 0.75);
          ctx.lineWidth   = 1.2;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + Math.PI*2*p);
          ctx.stroke();
          // inner cream ring (slight delay)
          const p2 = prog(t, 3.95, 4.8);
          if (p2 > 0) {
            ctx.strokeStyle = rgba(C.cream, p2 * fadeOut * 0.25);
            ctx.lineWidth   = 0.5;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.72, -Math.PI/2, -Math.PI/2 + Math.PI*2*p2);
            ctx.stroke();
          }
          // bright leading dot
          if (p < 1) {
            const da = -Math.PI/2 + Math.PI*2*p;
            ctx.fillStyle = rgba(C.gold, fadeOut);
            ctx.beginPath();
            ctx.arc(cx + Math.cos(da)*r, cy + Math.sin(da)*r, 2.5, 0, Math.PI*2);
            ctx.fill();
          }
        }
      }

      /* ── CORNER L-BRACKETS ────────────────────── */
      {
        const a = prog(t, 0.3, 1.0) * 0.45;
        if (a > 0) {
          const M = 26, L = 16;
          const corners = [
            [M, M, 1, 1], [W-M, M, -1, 1], [M, H-M, 1, -1], [W-M, H-M, -1, -1],
          ];
          ctx.strokeStyle = rgba(C.cream, a);
          ctx.lineWidth   = 1;
          ctx.setLineDash([]);
          for (const [x, y, sx, sy] of corners) {
            ctx.beginPath();
            ctx.moveTo(x + sx*L, y);
            ctx.lineTo(x, y);
            ctx.lineTo(x, y + sy*L);
            ctx.stroke();
          }
        }
      }

      /* ── REACT STATE TRIGGERS ─────────────────── */
      if (t > 4.4 && !did.logo)     { did.logo    = true; setShowLogo(true); }
      if (t > 5.2 && !did.tag)      { did.tag     = true; setShowTag(true);  }
      if (t > 6.0 && !did.dissolve) { did.dissolve= true; setDissolving(true); }
      if (t > 7.6 && !did.done)     {
        did.done = true;
        document.body.style.overflow = 'unset';
        onComplete();
      }

      if (t < 8) rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.body.style.overflow = 'unset';
    };
  }, [onComplete]);

  const EXPO: [number,number,number,number] = [0.16, 1, 0.3, 1];

  if (gone) return null;

  return (
    <div className="fixed inset-0 z-[9999] select-none" style={{ pointerEvents: 'none' }}>

      {/* ── Canvas — all motion graphic elements ── */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* ── Logo — natural conclusion ─────────── */}
      <motion.div
        className="absolute flex flex-col items-center"
        style={{ top: '50%', left: '50%' }}
        initial={{ x: '-50%', y: '-54%', opacity: 0, scale: 0.88 }}
        animate={{ opacity: showLogo ? 1 : 0, scale: showLogo ? 1 : 0.88 }}
        transition={{ duration: 1.0, ease: EXPO }}
      >
        {/* Warm halo */}
        <div style={{
          position: 'absolute', width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,163,90,0.18) 0%, transparent 65%)',
          filter: 'blur(28px)',
          top: '50%', left: '50%', transform: 'translate(-50%,-54%)',
        }} />
        <img
          src="/creato4logo.png"
          alt="Creato4"
          style={{ width: 100, height: 100, borderRadius: 18, position: 'relative', zIndex: 1, objectFit: 'cover' }}
        />
      </motion.div>

      {/* ── Tagline ───────────────────────────── */}
      <motion.div
        className="absolute flex flex-col items-center gap-2"
        style={{ top: '50%', left: '50%' }}
        initial={{ x: '-50%', y: 'calc(-50% + 72px)', opacity: 0 }}
        animate={{
          opacity: showTag ? 1 : 0,
          y: showTag ? 'calc(-50% + 70px)' : 'calc(-50% + 80px)',
        }}
        transition={{ duration: 0.75, ease: EXPO }}
      >
        <motion.div
          style={{ width: 36, height: 1, background: C.gold, opacity: 0.55 }}
          initial={{ scaleX: 0 }} animate={{ scaleX: showTag ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EXPO, delay: 0.15 }}
        />
        <span style={{
          fontSize: 9, letterSpacing: '0.28em', fontWeight: 600,
          textTransform: 'uppercase', whiteSpace: 'nowrap',
          color: 'rgba(246,241,229,0.6)',
        }}>
          MULTIDISCIPLINARY PRODUCT &amp; TECHNOLOGY LAB
        </span>
      </motion.div>

      {/* ── Dissolve overlays ─────────────────── */}
      <motion.div
        className="absolute inset-0"
        style={{ background: C.green, zIndex: 50 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: dissolving ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      {dissolving && (
        <motion.div
          className="absolute inset-0"
          style={{ background: '#FAF8F5', zIndex: 51 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeIn', delay: 0.4 }}
          onAnimationComplete={() => setGone(true)}
        />
      )}
    </div>
  );
};
