import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

// Easing curves for premium motion
const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const CIRC_OUT = [0, 0.55, 0.45, 1] as const;
const SOFT_SPRING = { type: 'spring', stiffness: 60, damping: 20 };

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [tick, setTick] = useState(0); // 0–7 phases over 5s
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Phase schedule (ms from start):
    // 0ms   → phase 0: black canvas
    // 300ms → phase 1: first geometric forms emerge
    // 1000ms → phase 2: second layer, forms breathe
    // 2000ms → phase 3: elements begin gravitating
    // 3000ms → phase 4: convergence, alignment
    // 4000ms → phase 5: logo appears
    // 4500ms → phase 6: hold
    // 5000ms → phase 7: dissolve out

    const schedule = prefersReducedMotion
      ? [0, 100, 200, 300, 400, 500, 600, 700]
      : [0, 300, 1000, 2000, 3000, 4000, 4600, 5400];

    const timers = schedule.map((ms, i) =>
      setTimeout(() => setTick(i), ms)
    );

    const done = setTimeout(() => {
      document.body.style.overflow = 'unset';
      onComplete();
    }, prefersReducedMotion ? 900 : 6000);

    return () => {
      [...timers, done].forEach(clearTimeout);
      document.body.style.overflow = 'unset';
    };
  }, [onComplete, prefersReducedMotion]);

  const isVisible = tick >= 1 && tick < 7;
  const formsActive = tick >= 1;
  const secondLayerActive = tick >= 2;
  const gravitating = tick >= 3;
  const converging = tick >= 4;
  const logoVisible = tick >= 5;
  const dissolving = tick === 7;

  return (
    <AnimatePresence>
      {tick < 7 && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: dissolving ? 0 : 1 }}
          transition={{ duration: dissolving ? 1.2 : 0, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none select-none"
          style={{ background: '#FAF8F5' }}
        >
          {/* ─────────────────────────────────────────────
              LAYER A: Large ambient orbs (slowest, furthest back)
          ───────────────────────────────────────────── */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '60vmax',
              height: '60vmax',
              background: 'radial-gradient(circle, rgba(26,60,47,0.05) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
            }}
            initial={{ x: '-50%', y: '-50%', scale: 0.3, opacity: 0 }}
            animate={{
              x: '-50%',
              y: '-50%',
              scale: formsActive ? (converging ? 1.0 : 1.2) : 0.3,
              opacity: formsActive ? (dissolving ? 0 : 0.8) : 0,
            }}
            transition={{ duration: 2.5, ease: EXPO_OUT }}
          />

          {/* ─────────────────────────────────────────────
              LAYER B: Precision rings — The discipline circles
              Each starts offset, then converges to centre
          ───────────────────────────────────────────── */}

          {/* Ring 1 — top-left origin → converges */}
          <motion.div
            className="absolute rounded-full border"
            style={{ borderColor: 'rgba(26,60,47,0.12)', width: '36vmin', height: '36vmin' }}
            initial={{ x: '-45vw', y: '-30vh', opacity: 0, scale: 0.6 }}
            animate={{
              x: formsActive ? (converging ? '-50%' : '-40vw') : '-45vw',
              y: formsActive ? (converging ? '-50%' : '-25vh') : '-30vh',
              opacity: formsActive ? (dissolving ? 0 : converging ? 0 : 0.7) : 0,
              scale: formsActive ? (converging ? 1.4 : 1) : 0.6,
              top: '50%',
              left: '50%',
            }}
            transition={converging
              ? { duration: 1.0, ease: CIRC_OUT }
              : { duration: 1.4, ease: EXPO_OUT }
            }
          />

          {/* Ring 2 — bottom-right origin → converges */}
          <motion.div
            className="absolute rounded-full border"
            style={{ borderColor: 'rgba(26,60,47,0.08)', width: '52vmin', height: '52vmin' }}
            initial={{ x: '42vw', y: '28vh', opacity: 0, scale: 0.5 }}
            animate={{
              x: formsActive ? (converging ? '-50%' : '38vw') : '42vw',
              y: formsActive ? (converging ? '-50%' : '22vh') : '28vh',
              opacity: formsActive ? (dissolving ? 0 : converging ? 0 : 0.5) : 0,
              scale: formsActive ? (converging ? 1.6 : 1) : 0.5,
              top: '50%',
              left: '50%',
            }}
            transition={converging
              ? { duration: 1.1, ease: CIRC_OUT, delay: 0.05 }
              : { duration: 1.6, ease: EXPO_OUT, delay: 0.1 }
            }
          />

          {/* Ring 3 — right-side origin → converges to gold */}
          <motion.div
            className="absolute rounded-full border"
            style={{ borderColor: 'rgba(196,163,90,0.2)', width: '24vmin', height: '24vmin' }}
            initial={{ x: '40vw', y: '-15vh', opacity: 0, scale: 0.4 }}
            animate={{
              x: secondLayerActive ? (converging ? '-50%' : '32vw') : '40vw',
              y: secondLayerActive ? (converging ? '-50%' : '-12vh') : '-15vh',
              opacity: secondLayerActive ? (dissolving ? 0 : converging ? 0 : 0.9) : 0,
              scale: secondLayerActive ? (converging ? 1.2 : 1) : 0.4,
              top: '50%',
              left: '50%',
            }}
            transition={converging
              ? { duration: 0.9, ease: CIRC_OUT, delay: 0.1 }
              : { duration: 1.2, ease: EXPO_OUT, delay: 0.15 }
            }
          />

          {/* ─────────────────────────────────────────────
              LAYER C: Translucent rectangle slabs
              Represent discipline layers, glass-like
          ───────────────────────────────────────────── */}

          {/* Slab 1 — horizontal, top, from left */}
          <motion.div
            className="absolute"
            style={{
              width: '40vw',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(26,60,47,0.15), transparent)',
              top: '50%',
              left: '50%',
            }}
            initial={{ x: '-80vw', y: '-18vh', opacity: 0, scaleX: 0.2 }}
            animate={{
              x: formsActive ? (converging ? '-50%' : '-55vw') : '-80vw',
              y: formsActive ? (converging ? '-50%' : '-15vh') : '-18vh',
              opacity: formsActive ? (dissolving ? 0 : converging ? 0 : 1) : 0,
              scaleX: formsActive ? 1 : 0.2,
            }}
            transition={converging
              ? { duration: 0.8, ease: EXPO_OUT }
              : { duration: 1.2, ease: EXPO_OUT, delay: 0.2 }
            }
          />

          {/* Slab 2 — horizontal, bottom, from right */}
          <motion.div
            className="absolute"
            style={{
              width: '30vw',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(196,163,90,0.3), transparent)',
              top: '50%',
              left: '50%',
            }}
            initial={{ x: '50vw', y: '20vh', opacity: 0, scaleX: 0.2 }}
            animate={{
              x: secondLayerActive ? (converging ? '-50%' : '30vw') : '50vw',
              y: secondLayerActive ? (converging ? '-50%' : '16vh') : '20vh',
              opacity: secondLayerActive ? (dissolving ? 0 : converging ? 0 : 1) : 0,
              scaleX: secondLayerActive ? 1 : 0.2,
            }}
            transition={converging
              ? { duration: 0.85, ease: EXPO_OUT, delay: 0.05 }
              : { duration: 1.2, ease: EXPO_OUT, delay: 0.3 }
            }
          />

          {/* Slab 3 — vertical accent */}
          <motion.div
            className="absolute"
            style={{
              width: '1px',
              height: '22vh',
              background: 'linear-gradient(180deg, transparent, rgba(26,60,47,0.12), transparent)',
              top: '50%',
              left: '50%',
            }}
            initial={{ x: '28vw', y: '-30vh', opacity: 0, scaleY: 0.2 }}
            animate={{
              x: secondLayerActive ? (converging ? '-50%' : '22vw') : '28vw',
              y: secondLayerActive ? (converging ? '-50%' : '-25vh') : '-30vh',
              opacity: secondLayerActive ? (dissolving ? 0 : converging ? 0 : 0.8) : 0,
              scaleY: secondLayerActive ? 1 : 0.2,
            }}
            transition={converging
              ? { duration: 0.9, ease: EXPO_OUT, delay: 0.08 }
              : { duration: 1.3, ease: EXPO_OUT, delay: 0.4 }
            }
          />

          {/* ─────────────────────────────────────────────
              LAYER D: Small precision dots — alignment anchors
          ───────────────────────────────────────────── */}

          {[
            { x: '-38vw', y: '-22vh', delay: 0.3, cx: '-38vw', cy: '-22vh', size: 3 },
            { x: '35vw',  y: '18vh',  delay: 0.4, cx: '35vw',  cy: '18vh',  size: 2.5 },
            { x: '-20vw', y: '28vh',  delay: 0.5, cx: '-20vw', cy: '28vh',  size: 2 },
            { x: '18vw',  y: '-30vh', delay: 0.6, cx: '18vw',  cy: '-30vh', size: 3 },
            { x: '-30vw', y: '8vh',   delay: 0.7, cx: '-30vw', cy: '8vh',   size: 2.5 },
          ].map((dot, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${dot.size * 2}px`,
                height: `${dot.size * 2}px`,
                background: i % 2 === 0 ? 'rgba(26,60,47,0.3)' : 'rgba(196,163,90,0.5)',
                top: '50%',
                left: '50%',
              }}
              initial={{ x: `calc(${dot.x} - ${dot.size}px)`, y: `calc(${dot.y} - ${dot.size}px)`, opacity: 0, scale: 0 }}
              animate={{
                x: secondLayerActive
                  ? converging
                    ? `calc(-50% - ${dot.size}px)`
                    : `calc(${dot.cx} - ${dot.size}px)`
                  : `calc(${dot.x} - ${dot.size}px)`,
                y: secondLayerActive
                  ? converging
                    ? `calc(-50% - ${dot.size}px)`
                    : `calc(${dot.cy} - ${dot.size}px)`
                  : `calc(${dot.y} - ${dot.size}px)`,
                opacity: secondLayerActive ? (dissolving ? 0 : converging ? 0 : 1) : 0,
                scale: secondLayerActive ? 1 : 0,
              }}
              transition={converging
                ? { duration: 0.7, ease: EXPO_OUT, delay: i * 0.04 }
                : { duration: 0.6, ease: EXPO_OUT, delay: dot.delay }
              }
            />
          ))}

          {/* ─────────────────────────────────────────────
              LAYER E: Glass panels (frosted rectangles — the disciplines)
          ───────────────────────────────────────────── */}

          {[
            { label: 'PRODUCT',     startX: '-60vw', startY: '-12vh', convergeX: '-50%', convergeY: '-50%', delay: 0, h: '28vmin' },
            { label: 'MECHANICAL',  startX: '55vw',  startY: '-8vh',  convergeX: '-50%', convergeY: '-50%', delay: 0.06, h: '20vmin' },
            { label: 'ELECTRONICS', startX: '-50vw', startY: '22vh',  convergeX: '-50%', convergeY: '-50%', delay: 0.12, h: '16vmin' },
            { label: 'EMBEDDED',    startX: '48vw',  startY: '20vh',  convergeX: '-50%', convergeY: '-50%', delay: 0.18, h: '24vmin' },
            { label: 'SOFTWARE',    startX: '0vw',   startY: '-38vh', convergeX: '-50%', convergeY: '-50%', delay: 0.24, h: '18vmin' },
          ].map((panel, i) => (
            <motion.div
              key={`panel-${i}`}
              className="absolute flex items-end justify-start overflow-hidden"
              style={{
                width: '1px',
                height: panel.h,
                background: 'rgba(26,60,47,0.03)',
                borderLeft: '1px solid rgba(26,60,47,0.08)',
                top: '50%',
                left: '50%',
              }}
              initial={{
                x: panel.startX,
                y: panel.startY,
                opacity: 0,
                scaleY: 0,
                originY: '100%',
              }}
              animate={{
                x: gravitating ? (converging ? panel.convergeX : panel.startX) : panel.startX,
                y: gravitating ? (converging ? panel.convergeY : panel.startY) : panel.startY,
                opacity: gravitating ? (dissolving ? 0 : converging ? 0 : 0.9) : 0,
                scaleY: gravitating ? 1 : 0,
              }}
              transition={converging
                ? { duration: 0.8, ease: CIRC_OUT, delay: panel.delay }
                : { duration: 1.0, ease: EXPO_OUT, delay: panel.delay }
              }
            />
          ))}

          {/* ─────────────────────────────────────────────
              LAYER F: Converging golden arc
              Appears only during convergence phase
          ───────────────────────────────────────────── */}
          <svg
            className="absolute pointer-events-none"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30vmin', height: '30vmin', overflow: 'visible' }}
          >
            <motion.circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="rgba(196,163,90,0.25)"
              strokeWidth="0.5"
              pathLength="1"
              initial={{ pathLength: 0, opacity: 0, scale: 0.5 }}
              animate={{
                pathLength: converging ? 1 : 0,
                opacity: converging ? (logoVisible ? 0 : 1) : 0,
                scale: converging ? 1 : 0.5,
              }}
              transition={{ duration: 0.9, ease: EXPO_OUT }}
            />
          </svg>

          {/* ─────────────────────────────────────────────
              LAYER G: LOGO — appears as the natural conclusion
          ───────────────────────────────────────────── */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{ top: '50%', left: '50%' }}
            initial={{ x: '-50%', y: '-50%', opacity: 0, scale: 0.85 }}
            animate={{
              x: '-50%',
              y: '-50%',
              opacity: logoVisible ? (dissolving ? 0 : 1) : 0,
              scale: logoVisible ? 1 : 0.85,
            }}
            transition={{ duration: 0.8, ease: EXPO_OUT }}
          >
            {/* Soft ambient glow behind logo */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '160px',
                height: '160px',
                background: 'radial-gradient(circle, rgba(26,60,47,0.06) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: logoVisible ? 1.5 : 0.5,
                opacity: logoVisible ? (dissolving ? 0 : 1) : 0,
              }}
              transition={{ duration: 1.2, ease: EXPO_OUT }}
            />

            {/* The official Creato4 logo — untouched, unmodified */}
            <img
              src="/creato4-logo.svg"
              alt="Creato4"
              className="relative z-10"
              style={{ width: '96px', height: '96px', borderRadius: '18px' }}
            />
          </motion.div>

          {/* ─────────────────────────────────────────────
              LAYER H: Tagline beneath logo — fades in after logo
          ───────────────────────────────────────────── */}
          <motion.div
            className="absolute flex flex-col items-center gap-1"
            style={{ top: '50%', left: '50%' }}
            initial={{ x: '-50%', y: 'calc(-50% + 76px)', opacity: 0 }}
            animate={{
              x: '-50%',
              y: 'calc(-50% + 76px)',
              opacity: logoVisible ? (dissolving ? 0 : 1) : 0,
            }}
            transition={{ duration: 0.6, ease: EXPO_OUT, delay: logoVisible ? 0.3 : 0 }}
          >
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.28em',
                color: 'rgba(92,107,96,0.8)',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontFamily: 'inherit',
              }}
            >
              MULTIDISCIPLINARY PRODUCT & TECHNOLOGY LAB
            </div>
          </motion.div>

          {/* ─────────────────────────────────────────────
              LAYER I: Corner alignment marks — precision cues
          ───────────────────────────────────────────── */}
          {[
            { corner: 'top-8 left-8', tx: '0', ty: '0' },
            { corner: 'top-8 right-8', tx: '0', ty: '0' },
            { corner: 'bottom-8 left-8', tx: '0', ty: '0' },
            { corner: 'bottom-8 right-8', tx: '0', ty: '0' },
          ].map((mark, i) => (
            <motion.div
              key={`mark-${i}`}
              className={`absolute ${mark.corner}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: formsActive ? (dissolving ? 0 : 0.25) : 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 + i * 0.08 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {/* L-shaped corner mark */}
                <line
                  x1={i === 1 || i === 3 ? '16' : '0'}
                  y1={i >= 2 ? '16' : '0'}
                  x2={i === 1 || i === 3 ? '8' : '8'}
                  y2={i >= 2 ? '16' : '0'}
                  stroke="rgba(26,60,47,0.6)" strokeWidth="1"
                />
                <line
                  x1={i === 1 || i === 3 ? '16' : '0'}
                  y1={i >= 2 ? '8' : '8'}
                  x2={i === 1 || i === 3 ? '16' : '0'}
                  y2={i >= 2 ? '16' : '0'}
                  stroke="rgba(26,60,47,0.6)" strokeWidth="1"
                />
              </svg>
            </motion.div>
          ))}

          {/* ─────────────────────────────────────────────
              LAYER J: Final curtain dissolve (white overlay)
              Seamlessly merges preloader into homepage
          ───────────────────────────────────────────── */}
          <motion.div
            className="absolute inset-0"
            style={{ background: '#FAF8F5', pointerEvents: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: dissolving ? 1 : 0 }}
            transition={{ duration: 1.0, ease: 'easeInOut' }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  );
};
