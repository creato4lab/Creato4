import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
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

    // Auto-remove splash from DOM after 7.2s
    const timer = setTimeout(() => {
      document.body.style.overflow = 'unset';
      onComplete();
    }, 7200);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] select-none flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#050f0a',
        backgroundImage:
          'radial-gradient(ellipse at 50% 0%, #1a3a2e 0%, #0a1f15 60%, #050f0a 100%)',
        animation: 'splashExit 0.8s cubic-bezier(0.65, 0, 0.35, 1) 6.5s forwards',
      }}
    >
      {/* Keyframe Styles */}
      <style>{`
        /* PHASE 1 KEYFRAMES */
        @keyframes stepPopIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          60% {
            opacity: 1;
            transform: translateY(-5px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 0 0px rgba(201, 169, 110, 0);
          }
          50% {
            box-shadow: 0 0 20px 5px rgba(201, 169, 110, 0.1);
          }
        }

        @keyframes fadeInLabel {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes checkmarkPop {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes lineExpand {
          0% {
            width: 0px;
          }
          100% {
            width: 40px;
          }
        }

        @keyframes processFadeOut {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.96);
          }
        }

        /* PHASE 2 KEYFRAMES */
        @keyframes radialBurstEntrance {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes radialBurstPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes crystalEntrance {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes crystalFloat {
          0% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(8px);
          }
        }

        @keyframes crystalSpin {
          0% {
            transform: rotateX(-20deg) rotateY(30deg);
          }
          100% {
            transform: rotateX(-20deg) rotateY(390deg);
          }
        }

        @keyframes gyroEntrance {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes gyroRing1Spin {
          0% {
            transform: rotateX(75deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(75deg) rotateZ(360deg);
          }
        }

        @keyframes gyroRing2Spin {
          0% {
            transform: rotateY(75deg) rotateZ(0deg);
          }
          100% {
            transform: rotateY(75deg) rotateZ(-360deg);
          }
        }

        @keyframes gyroRing3Spin {
          0% {
            transform: rotateX(60deg) rotateY(20deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(60deg) rotateY(20deg) rotateZ(360deg);
          }
        }

        @keyframes orbitDot0 {
          0% {
            transform: rotate(0deg) translateX(70px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(70px) rotate(-360deg);
          }
        }

        @keyframes orbitDot120 {
          0% {
            transform: rotate(120deg) translateX(70px) rotate(-120deg);
          }
          100% {
            transform: rotate(480deg) translateX(70px) rotate(-480deg);
          }
        }

        @keyframes orbitDot240 {
          0% {
            transform: rotate(240deg) translateX(70px) rotate(-240deg);
          }
          100% {
            transform: rotate(600deg) translateX(70px) rotate(-600deg);
          }
        }

        @keyframes trailFade {
          0% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          100% {
            opacity: 0;
            transform: scale(0.4);
          }
        }

        @keyframes letterReveal {
          0% {
            opacity: 0;
            filter: blur(12px);
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
        }

        @keyframes goldShimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes taglineFadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
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
      `}</style>

      {/* Canvas for Particle Constellation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* ── PHASE 1: Process Steps (0.3s — 3.8s) ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          animation: 'processFadeOut 0.5s ease 3.5s forwards',
        }}
      >
        <div className="flex items-center gap-10">
          {/* STEP 1: Ideate */}
          <div className="flex flex-col items-center gap-3 relative">
            <div className="relative">
              {/* Icon Circle */}
              <div
                className="w-[70px] h-[70px] rounded-full flex items-center justify-center text-[1.8rem] backdrop-blur-[5px] opacity-0"
                style={{
                  border: '2px solid rgba(201,169,110,.3)',
                  backgroundColor: 'rgba(201,169,110,.05)',
                  animation:
                    'stepPopIn 0.7s cubic-bezier(.34,1.56,.64,1) 0.5s forwards, pulseGlow 2s ease-in-out 0.5s infinite',
                }}
              >
                💡
              </div>
              {/* Checkmark */}
              <div
                className="absolute -top-1 -right-1 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] font-bold opacity-0"
                style={{
                  backgroundColor: '#c9a96e',
                  color: '#050f0a',
                  animation: 'checkmarkPop 0.4s cubic-bezier(.34,1.56,.64,1) 1.1s forwards',
                }}
              >
                ✓
              </div>
            </div>
            {/* Label */}
            <span
              className="text-[0.65rem] font-semibold text-[rgba(255,255,255,.4)] tracking-[2px] uppercase opacity-0"
              style={{
                animation: 'fadeInLabel 0.5s ease 0.8s forwards',
              }}
            >
              IDEATE
            </span>
          </div>

          {/* Connector Line 1 */}
          <div className="relative w-[40px] h-[2px] mb-6 overflow-hidden">
            <div
              className="h-full rounded-full w-0"
              style={{
                background: 'linear-gradient(90deg, rgba(201,169,110,.3), rgba(201,169,110,.6))',
                animation: 'lineExpand 0.6s ease 1.1s forwards',
              }}
            />
          </div>

          {/* STEP 2: Design */}
          <div className="flex flex-col items-center gap-3 relative">
            <div className="relative">
              <div
                className="w-[70px] h-[70px] rounded-full flex items-center justify-center text-[1.8rem] backdrop-blur-[5px] opacity-0"
                style={{
                  border: '2px solid rgba(201,169,110,.3)',
                  backgroundColor: 'rgba(201,169,110,.05)',
                  animation:
                    'stepPopIn 0.7s cubic-bezier(.34,1.56,.64,1) 1.3s forwards, pulseGlow 2s ease-in-out 1.3s infinite',
                }}
              >
                ⚡
              </div>
              <div
                className="absolute -top-1 -right-1 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] font-bold opacity-0"
                style={{
                  backgroundColor: '#c9a96e',
                  color: '#050f0a',
                  animation: 'checkmarkPop 0.4s cubic-bezier(.34,1.56,.64,1) 1.9s forwards',
                }}
              >
                ✓
              </div>
            </div>
            <span
              className="text-[0.65rem] font-semibold text-[rgba(255,255,255,.4)] tracking-[2px] uppercase opacity-0"
              style={{
                animation: 'fadeInLabel 0.5s ease 1.6s forwards',
              }}
            >
              DESIGN
            </span>
          </div>

          {/* Connector Line 2 */}
          <div className="relative w-[40px] h-[2px] mb-6 overflow-hidden">
            <div
              className="h-full rounded-full w-0"
              style={{
                background: 'linear-gradient(90deg, rgba(201,169,110,.3), rgba(201,169,110,.6))',
                animation: 'lineExpand 0.6s ease 1.9s forwards',
              }}
            />
          </div>

          {/* STEP 3: Build */}
          <div className="flex flex-col items-center gap-3 relative">
            <div className="relative">
              <div
                className="w-[70px] h-[70px] rounded-full flex items-center justify-center text-[1.8rem] backdrop-blur-[5px] opacity-0"
                style={{
                  border: '2px solid rgba(201,169,110,.3)',
                  backgroundColor: 'rgba(201,169,110,.05)',
                  animation:
                    'stepPopIn 0.7s cubic-bezier(.34,1.56,.64,1) 2.1s forwards, pulseGlow 2s ease-in-out 2.1s infinite',
                }}
              >
                🔧
              </div>
              <div
                className="absolute -top-1 -right-1 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] font-bold opacity-0"
                style={{
                  backgroundColor: '#c9a96e',
                  color: '#050f0a',
                  animation: 'checkmarkPop 0.4s cubic-bezier(.34,1.56,.64,1) 2.7s forwards',
                }}
              >
                ✓
              </div>
            </div>
            <span
              className="text-[0.65rem] font-semibold text-[rgba(255,255,255,.4)] tracking-[2px] uppercase opacity-0"
              style={{
                animation: 'fadeInLabel 0.5s ease 2.4s forwards',
              }}
            >
              BUILD
            </span>
          </div>

          {/* Connector Line 3 */}
          <div className="relative w-[40px] h-[2px] mb-6 overflow-hidden">
            <div
              className="h-full rounded-full w-0"
              style={{
                background: 'linear-gradient(90deg, rgba(201,169,110,.3), rgba(201,169,110,.6))',
                animation: 'lineExpand 0.6s ease 2.7s forwards',
              }}
            />
          </div>

          {/* STEP 4: Launch */}
          <div className="flex flex-col items-center gap-3 relative">
            <div className="relative">
              <div
                className="w-[70px] h-[70px] rounded-full flex items-center justify-center text-[1.8rem] backdrop-blur-[5px] opacity-0"
                style={{
                  border: '2px solid rgba(201,169,110,.3)',
                  backgroundColor: 'rgba(201,169,110,.05)',
                  animation:
                    'stepPopIn 0.7s cubic-bezier(.34,1.56,.64,1) 2.9s forwards, pulseGlow 2s ease-in-out 2.9s infinite',
                }}
              >
                🚀
              </div>
              <div
                className="absolute -top-1 -right-1 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] font-bold opacity-0"
                style={{
                  backgroundColor: '#c9a96e',
                  color: '#050f0a',
                  animation: 'checkmarkPop 0.4s cubic-bezier(.34,1.56,.64,1) 3.5s forwards',
                }}
              >
                ✓
              </div>
            </div>
            <span
              className="text-[0.65rem] font-semibold text-[rgba(255,255,255,.4)] tracking-[2px] uppercase opacity-0"
              style={{
                animation: 'fadeInLabel 0.5s ease 3.2s forwards',
              }}
            >
              LAUNCH
            </span>
          </div>
        </div>
      </div>

      {/* ── PHASE 2: Logo Reveal (3.8s — 6.0s) ── */}
      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
        {/* Radial Burst Glow */}
        <div
          className="absolute w-[200px] h-[200px] rounded-full pointer-events-none opacity-0"
          style={{
            background: 'radial-gradient(circle, rgba(201,169,110,.15) 0%, transparent 70%)',
            animation:
              'radialBurstEntrance 1s ease-out 3.9s forwards, radialBurstPulse 3s ease-in-out 4.9s infinite alternate',
          }}
        />

        {/* 3D Crystal Cube Floating & Entrance Container */}
        <div
          className="relative w-[140px] h-[140px] flex items-center justify-center opacity-0"
          style={{
            perspective: '1000px',
            animation: 'crystalEntrance 0.9s cubic-bezier(.23,1,.32,1) 3.8s forwards',
          }}
        >
          {/* Continuous Float Wrapper */}
          <div
            className="w-full h-full flex items-center justify-center relative"
            style={{
              animation: 'crystalFloat 3s ease-in-out 4.7s infinite alternate',
            }}
          >
            {/* Triple Gyroscope Rings */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0"
              style={{
                animation: 'gyroEntrance 0.8s ease-out 4.0s forwards',
              }}
            >
              {/* Ring 1 */}
              <div
                className="absolute -inset-[30px] rounded-full"
                style={{
                  border: '1.5px solid rgba(201,169,110,.25)',
                  transformStyle: 'preserve-3d',
                  animation: 'gyroRing1Spin 6s linear 4.0s infinite',
                }}
              />
              {/* Ring 2 */}
              <div
                className="absolute -inset-[50px] rounded-full"
                style={{
                  border: '1px solid rgba(201,169,110,.15)',
                  transformStyle: 'preserve-3d',
                  animation: 'gyroRing2Spin 10s linear 4.0s infinite',
                }}
              />
              {/* Ring 3 */}
              <div
                className="absolute -inset-[70px] rounded-full"
                style={{
                  border: '1px dashed rgba(201,169,110,.1)',
                  transformStyle: 'preserve-3d',
                  animation: 'gyroRing3Spin 14s linear 4.0s infinite',
                }}
              >
                {/* Orbiting Gold Dots & Fading Trails on Ring 3 Path */}
                {/* Dot 1 (0°) */}
                <div
                  className="absolute top-1/2 left-1/2 w-[8px] h-[8px] -mt-[4px] -ml-[4px] rounded-full"
                  style={{
                    backgroundColor: '#c9a96e',
                    boxShadow: '0 0 12px 3px rgba(201,169,110,.5)',
                    animation: 'orbitDot0 4s linear 4.0s infinite',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full bg-[#c9a96e]"
                    style={{
                      animation: 'trailFade 0.8s ease-out infinite',
                    }}
                  />
                </div>
                {/* Dot 2 (120°) */}
                <div
                  className="absolute top-1/2 left-1/2 w-[8px] h-[8px] -mt-[4px] -ml-[4px] rounded-full"
                  style={{
                    backgroundColor: '#c9a96e',
                    boxShadow: '0 0 12px 3px rgba(201,169,110,.5)',
                    animation: 'orbitDot120 4s linear 4.0s infinite',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full bg-[#c9a96e]"
                    style={{
                      animation: 'trailFade 0.8s ease-out infinite',
                    }}
                  />
                </div>
                {/* Dot 3 (240°) */}
                <div
                  className="absolute top-1/2 left-1/2 w-[8px] h-[8px] -mt-[4px] -ml-[4px] rounded-full"
                  style={{
                    backgroundColor: '#c9a96e',
                    boxShadow: '0 0 12px 3px rgba(201,169,110,.5)',
                    animation: 'orbitDot240 4s linear 4.0s infinite',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full bg-[#c9a96e]"
                    style={{
                      animation: 'trailFade 0.8s ease-out infinite',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 3D Crystal Cube (70px x 70px, translateZ(35px)) */}
            <div
              className="w-[70px] h-[70px] relative"
              style={{
                transformStyle: 'preserve-3d',
                animation: 'crystalSpin 7s linear 3.8s infinite',
              }}
            >
              {/* Face 1: Front */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: '1px solid rgba(201,169,110,.4)',
                  background:
                    'linear-gradient(135deg, rgba(201,169,110,.08), rgba(232,213,163,.03))',
                  backdropFilter: 'blur(2px)',
                  boxShadow: 'inset 0 0 15px rgba(201,169,110,.1)',
                  transform: 'translateZ(35px)',
                }}
              />
              {/* Face 2: Back */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: '1px solid rgba(201,169,110,.4)',
                  background:
                    'linear-gradient(135deg, rgba(201,169,110,.08), rgba(232,213,163,.03))',
                  backdropFilter: 'blur(2px)',
                  boxShadow: 'inset 0 0 15px rgba(201,169,110,.1)',
                  transform: 'rotateY(180deg) translateZ(35px)',
                }}
              />
              {/* Face 3: Right */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: '1px solid rgba(201,169,110,.4)',
                  background:
                    'linear-gradient(135deg, rgba(201,169,110,.08), rgba(232,213,163,.03))',
                  backdropFilter: 'blur(2px)',
                  boxShadow: 'inset 0 0 15px rgba(201,169,110,.1)',
                  transform: 'rotateY(90deg) translateZ(35px)',
                }}
              />
              {/* Face 4: Left */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: '1px solid rgba(201,169,110,.4)',
                  background:
                    'linear-gradient(135deg, rgba(201,169,110,.08), rgba(232,213,163,.03))',
                  backdropFilter: 'blur(2px)',
                  boxShadow: 'inset 0 0 15px rgba(201,169,110,.1)',
                  transform: 'rotateY(-90deg) translateZ(35px)',
                }}
              />
              {/* Face 5: Top */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: '1px solid rgba(201,169,110,.4)',
                  background:
                    'linear-gradient(135deg, rgba(201,169,110,.08), rgba(232,213,163,.03))',
                  backdropFilter: 'blur(2px)',
                  boxShadow: 'inset 0 0 15px rgba(201,169,110,.1)',
                  transform: 'rotateX(90deg) translateZ(35px)',
                }}
              />
              {/* Face 6: Bottom */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: '1px solid rgba(201,169,110,.4)',
                  background:
                    'linear-gradient(135deg, rgba(201,169,110,.08), rgba(232,213,163,.03))',
                  backdropFilter: 'blur(2px)',
                  boxShadow: 'inset 0 0 15px rgba(201,169,110,.1)',
                  transform: 'rotateX(-90deg) translateZ(35px)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Brand Name "CRETO4" */}
        <div
          className="flex gap-[2px] mt-10 select-none"
          style={{
            textShadow: '0 0 40px rgba(201,169,110,.15)',
          }}
        >
          {/* C */}
          <span
            className="text-[clamp(2.8rem,7vw,4.5rem)] font-black text-white tracking-[-4px] opacity-0"
            style={{
              animation: 'letterReveal 0.7s cubic-bezier(.23,1,.32,1) 4.3s forwards',
            }}
          >
            C
          </span>
          {/* R */}
          <span
            className="text-[clamp(2.8rem,7vw,4.5rem)] font-black text-white tracking-[-4px] opacity-0"
            style={{
              animation: 'letterReveal 0.7s cubic-bezier(.23,1,.32,1) 4.38s forwards',
            }}
          >
            R
          </span>
          {/* E */}
          <span
            className="text-[clamp(2.8rem,7vw,4.5rem)] font-black text-white tracking-[-4px] opacity-0"
            style={{
              animation: 'letterReveal 0.7s cubic-bezier(.23,1,.32,1) 4.46s forwards',
            }}
          >
            E
          </span>
          {/* T */}
          <span
            className="text-[clamp(2.8rem,7vw,4.5rem)] font-black text-white tracking-[-4px] opacity-0"
            style={{
              animation: 'letterReveal 0.7s cubic-bezier(.23,1,.32,1) 4.54s forwards',
            }}
          >
            T
          </span>
          {/* O */}
          <span
            className="text-[clamp(2.8rem,7vw,4.5rem)] font-black text-white tracking-[-4px] opacity-0"
            style={{
              animation: 'letterReveal 0.7s cubic-bezier(.23,1,.32,1) 4.62s forwards',
            }}
          >
            O
          </span>
          {/* 4 (Gold Gradient + Shimmer) */}
          <span
            className="text-[clamp(2.8rem,7vw,4.5rem)] font-black tracking-[-4px] opacity-0"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #c9a96e, #e8d5a3, #f5f0eb, #c9a96e)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation:
                'letterReveal 0.7s cubic-bezier(.23,1,.32,1) 4.7s forwards, goldShimmer 3s linear 4.7s infinite',
            }}
          >
            4
          </span>
        </div>

        {/* Tagline */}
        <p
          className="text-[0.75rem] font-medium text-[rgba(255,255,255,.35)] tracking-[5px] uppercase mt-2 opacity-0"
          style={{
            animation: 'taglineFadeIn 0.6s ease 5.2s forwards',
          }}
        >
          MULTIDISCIPLINARY PRODUCT DESIGN STUDIO
        </p>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[180px] h-[2px] rounded-[2px] bg-[rgba(255,255,255,.06)] overflow-hidden">
        <div
          className="h-full rounded-[2px] w-0"
          style={{
            background: 'linear-gradient(90deg, #c9a96e, #e8d5a3, #c9a96e)',
            boxShadow: '0 0 10px rgba(201,169,110,.3)',
            animation: 'progressFill 5.5s cubic-bezier(.23,1,.32,1) 0.3s forwards',
          }}
        />
      </div>
    </div>
  );
};

