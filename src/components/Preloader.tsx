import React, { useEffect, useRef } from 'react';
import { IdeaToPrototype } from './IdeaToPrototype';

interface PreloaderProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store callback in a ref so the effect never re-runs when the parent re-renders
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // Single-run effect — timer and canvas only start once on mount
  useEffect(() => {
    // if (document.documentElement.getAttribute('data-preloader-seen') === 'true') {
    //   return;
    // }

    // Prevent scrolling during splash
    document.body.style.overflow = 'hidden';

    // Canvas particle constellation: 60 gold particles floating with connecting lines within 140px
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 0.8 + 1.2,
        alpha: Math.random() * 0.25 + 0.05,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(201, 169, 110, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connecting lines within 140px distance
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * 0.3;
            if (lineAlpha >= 0.05) {
              ctx.strokeStyle = `rgba(201, 169, 110, ${lineAlpha.toFixed(3)})`;
              ctx.lineWidth = 0.25;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Timer fires at 9.2s — IdeaToPrototype Phase 4 ends at ~8s, splashExit at 8.5–9.1s
    const timer = setTimeout(() => {
      document.body.style.overflow = 'unset';
      onCompleteRef.current();
    }, 9200);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []); // empty deps — runs once on mount only

  return (
    <div
      className="preloader-container fixed inset-0 z-[9999] select-none flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#050f0a',
        backgroundImage:
          'radial-gradient(ellipse at 50% 0%, #1a3a2e 0%, #0a1f15 60%, #050f0a 100%)',
        animation: 'splashExit 0.6s cubic-bezier(0.65, 0, 0.35, 1) 8.5s forwards',
      }}
    >
      {/* Skip button */}
      <button
        onClick={() => {
          document.body.style.overflow = '';
          onComplete();
        }}
        className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full border border-[rgba(201,169,110,.3)] bg-[#050f0a]/60 text-[#c9a96e] text-xs font-bold uppercase tracking-widest hover:bg-[#c9a96e] hover:text-[#050f0a] transition-all cursor-pointer shadow-lg"
      >
        Skip Intro →
      </button>
      {/* Keyframe Styles */}
      <style>{`
        /* PHASE 1 — handled by IdeaToPrototype component */

        /* PHASE 2 KEYFRAMES */
        @keyframes atmosphereEntrance {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes atmosphereLoop {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        @keyframes crystalCubeEntrance {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes crystalCubeSpin {
          0% {
            transform: rotateX(-25deg) rotateY(45deg);
          }
          100% {
            transform: rotateX(-25deg) rotateY(405deg);
          }
        }

        @keyframes crystalCubeFloat {
          0% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(10px);
          }
        }

        @keyframes faceShimmerSweep {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) rotate(45deg);
          }
        }

        @keyframes shockwaveBurst {
          0% {
            width: 0px;
            height: 0px;
            border: 1px solid rgba(201,169,110,.3);
            opacity: 0.6;
          }
          100% {
            width: 400px;
            height: 400px;
            border: 1px solid rgba(201,169,110,.3);
            opacity: 0;
          }
        }

        @keyframes gyroRingsEntrance {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes gyro1Rotation {
          0% {
            transform: rotateX(70deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(70deg) rotateZ(360deg);
          }
        }

        @keyframes gyro2Rotation {
          0% {
            transform: rotateY(70deg) rotateZ(0deg);
          }
          100% {
            transform: rotateY(70deg) rotateZ(-360deg);
          }
        }

        @keyframes gyro3Rotation {
          0% {
            transform: rotateX(55deg) rotateY(15deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(55deg) rotateY(15deg) rotateZ(360deg);
          }
        }

        @keyframes orbit4Dot0 {
          0% {
            transform: rotate(0deg) translateX(75px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(75px) rotate(-360deg);
          }
        }

        @keyframes orbit4Dot90 {
          0% {
            transform: rotate(90deg) translateX(75px) rotate(-90deg);
          }
          100% {
            transform: rotate(450deg) translateX(75px) rotate(-450deg);
          }
        }

        @keyframes orbit4Dot180 {
          0% {
            transform: rotate(180deg) translateX(75px) rotate(-180deg);
          }
          100% {
            transform: rotate(540deg) translateX(75px) rotate(-540deg);
          }
        }

        @keyframes orbit4Dot270 {
          0% {
            transform: rotate(270deg) translateX(75px) rotate(-270deg);
          }
          100% {
            transform: rotate(630deg) translateX(75px) rotate(-630deg);
          }
        }

        @keyframes dotPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }

        @keyframes dotTrailFade {
          0% {
            opacity: 0.4;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.3);
          }
        }

        @keyframes particleDrift {
          0% {
            transform: translateY(-20px) translateX(-15px);
          }
          100% {
            transform: translateY(20px) translateX(15px);
          }
        }

        @keyframes lightSweepScan {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(100px);
            opacity: 0;
          }
        }

        @keyframes letterFlipIn {
          0% {
            opacity: 0;
            filter: blur(15px);
            transform: translateY(40px) rotateX(-90deg);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0) rotateX(0deg);
          }
        }

        @keyframes containerGlowFade {
          0% {
            opacity: 1;
            text-shadow: 0 0 0px rgba(201,169,110,0);
          }
          100% {
            opacity: 1;
            text-shadow: 0 0 50px rgba(201,169,110,.12);
          }
        }

        @keyframes goldShimmerSweep {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes taglineCinematic {
          0% {
            opacity: 0;
            transform: translateY(15px);
            letter-spacing: 10px;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            letter-spacing: 6px;
          }
        }

        @keyframes progressFill {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes splashExit {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        html[data-preloader-seen="true"] .preloader-container {
          display: none !important;
        }
      `}</style>

      {/* Canvas for Particle Constellation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* ── PHASE 1: Idea → Prototype (0.0s — 3.8s) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <IdeaToPrototype />
      </div>

      {/* Progress Bar — fills over 8s matching new animation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[200px] h-[2px] rounded-[2px] bg-[rgba(255,255,255,.06)] overflow-hidden">
        <div
          className="h-full rounded-[2px] w-0"
          style={{
            background: 'linear-gradient(90deg, #c9a96e, #e8d5a3, #c9a96e)',
            boxShadow: '0 0 10px rgba(201,169,110,.3)',
            animation: 'progressFill 8s cubic-bezier(.23,1,.32,1) 0.2s forwards',
          }}
        />
      </div>
    </div>
  );
};
