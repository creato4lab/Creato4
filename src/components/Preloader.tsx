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
            text-shadow: 0 0 0px rgba(201,169,110,0);
          }
          100% {
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
        {/* Atmosphere Glow (300px x 300px) */}
        <div
          className="absolute w-[300px] h-[300px] rounded-full pointer-events-none opacity-0"
          style={{
            background:
              'radial-gradient(circle, rgba(201,169,110,.12) 0%, rgba(26,58,46,.2) 40%, transparent 70%)',
            animation:
              'atmosphereEntrance 1.2s cubic-bezier(.23,1,.32,1) 3.8s forwards, atmosphereLoop 4s ease-in-out 5.0s infinite alternate',
          }}
        />

        {/* Shockwave Burst (Trigger at 4.0s) */}
        <div
          className="absolute rounded-full pointer-events-none opacity-0"
          style={{
            animation: 'shockwaveBurst 1s ease-out 4.0s forwards',
          }}
        />

        {/* Floating Particles (12) around cube */}
        <div className="absolute w-[300px] h-[300px] pointer-events-none">
          {[
            { x: -110, y: -90, speed: '3.2s', delay: '0s' },
            { x: 120, y: -70, speed: '4.1s', delay: '0.4s' },
            { x: -80, y: 110, speed: '3.8s', delay: '0.8s' },
            { x: 95, y: 85, speed: '4.5s', delay: '0.2s' },
            { x: -130, y: 30, speed: '3.5s', delay: '1.0s' },
            { x: 140, y: -20, speed: '4.8s', delay: '0.6s' },
            { x: -40, y: -130, speed: '3.9s', delay: '1.2s' },
            { x: 60, y: -110, speed: '4.3s', delay: '0.3s' },
            { x: -95, y: -45, speed: '3.6s', delay: '0.7s' },
            { x: 110, y: 40, speed: '4.7s', delay: '1.1s' },
            { x: -65, y: 95, speed: '3.4s', delay: '0.5s' },
            { x: 75, y: 130, speed: '4.2s', delay: '0.9s' },
          ].map((pt, idx) => (
            <div
              key={idx}
              className="absolute w-[4px] h-[4px] rounded-full bg-[#c9a96e] opacity-60"
              style={{
                top: `calc(50% + ${pt.y}px)`,
                left: `calc(50% + ${pt.x}px)`,
                animation: `particleDrift ${pt.speed} ease-in-out ${pt.delay} infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* 3D Crystal Cube Container (160px x 160px, perspective 1200px) */}
        <div
          className="relative w-[160px] h-[160px] flex items-center justify-center opacity-0"
          style={{
            perspective: '1200px',
            animation: 'crystalCubeEntrance 1s cubic-bezier(.23,1,.32,1) 3.9s forwards',
          }}
        >
          {/* Continuous Float Wrapper */}
          <div
            className="w-full h-full flex items-center justify-center relative"
            style={{
              animation: 'crystalCubeFloat 3s ease-in-out 4.9s infinite alternate',
            }}
          >
            {/* Gyroscope Rings (Entrance 4.1s) */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0"
              style={{
                animation: 'gyroRingsEntrance 0.9s ease-out 4.1s forwards',
              }}
            >
              {/* Gyroscope Ring 1 (Inner) - inset -35px */}
              <div
                className="absolute -inset-[35px] rounded-full"
                style={{
                  border: '2px solid rgba(201,169,110,.3)',
                  boxShadow: '0 0 20px rgba(201,169,110,.08)',
                  transformStyle: 'preserve-3d',
                  animation: 'gyro1Rotation 5s linear 4.1s infinite',
                }}
              />
              {/* Gyroscope Ring 2 (Middle) - inset -55px */}
              <div
                className="absolute -inset-[55px] rounded-full"
                style={{
                  border: '1.5px solid rgba(201,169,110,.2)',
                  boxShadow: '0 0 20px rgba(201,169,110,.08)',
                  transformStyle: 'preserve-3d',
                  animation: 'gyro2Rotation 8s linear 4.1s infinite',
                }}
              />
              {/* Gyroscope Ring 3 (Outer) - inset -75px */}
              <div
                className="absolute -inset-[75px] rounded-full"
                style={{
                  border: '1px dashed rgba(201,169,110,.12)',
                  boxShadow: '0 0 20px rgba(201,169,110,.08)',
                  transformStyle: 'preserve-3d',
                  animation: 'gyro3Rotation 12s linear 4.1s infinite',
                }}
              >
                {/* Orbiting Dots (4) - 10px x 10px, bg #e8d5a3, radius 75px, speed 3.5s */}
                {/* Dot 1 (0°) */}
                <div
                  className="absolute top-1/2 left-1/2 w-[10px] h-[10px] -mt-[5px] -ml-[5px] rounded-full bg-[#e8d5a3]"
                  style={{
                    boxShadow:
                      '0 0 15px 4px rgba(201,169,110,.6), 0 0 30px 8px rgba(201,169,110,.15)',
                    animation:
                      'orbit4Dot0 3.5s linear 4.1s infinite, dotPulse 1.5s ease-in-out 4.1s infinite',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full bg-[#e8d5a3]"
                    style={{ animation: 'dotTrailFade 0.6s ease-out infinite' }}
                  />
                </div>

                {/* Dot 2 (90°) */}
                <div
                  className="absolute top-1/2 left-1/2 w-[10px] h-[10px] -mt-[5px] -ml-[5px] rounded-full bg-[#e8d5a3]"
                  style={{
                    boxShadow:
                      '0 0 15px 4px rgba(201,169,110,.6), 0 0 30px 8px rgba(201,169,110,.15)',
                    animation:
                      'orbit4Dot90 3.5s linear 4.1s infinite, dotPulse 1.5s ease-in-out 4.4s infinite',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full bg-[#e8d5a3]"
                    style={{ animation: 'dotTrailFade 0.6s ease-out infinite' }}
                  />
                </div>

                {/* Dot 3 (180°) */}
                <div
                  className="absolute top-1/2 left-1/2 w-[10px] h-[10px] -mt-[5px] -ml-[5px] rounded-full bg-[#e8d5a3]"
                  style={{
                    boxShadow:
                      '0 0 15px 4px rgba(201,169,110,.6), 0 0 30px 8px rgba(201,169,110,.15)',
                    animation:
                      'orbit4Dot180 3.5s linear 4.1s infinite, dotPulse 1.5s ease-in-out 4.7s infinite',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full bg-[#e8d5a3]"
                    style={{ animation: 'dotTrailFade 0.6s ease-out infinite' }}
                  />
                </div>

                {/* Dot 4 (270°) */}
                <div
                  className="absolute top-1/2 left-1/2 w-[10px] h-[10px] -mt-[5px] -ml-[5px] rounded-full bg-[#e8d5a3]"
                  style={{
                    boxShadow:
                      '0 0 15px 4px rgba(201,169,110,.6), 0 0 30px 8px rgba(201,169,110,.15)',
                    animation:
                      'orbit4Dot270 3.5s linear 4.1s infinite, dotPulse 1.5s ease-in-out 5.0s infinite',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full bg-[#e8d5a3]"
                    style={{ animation: 'dotTrailFade 0.6s ease-out infinite' }}
                  />
                </div>
              </div>
            </div>

            {/* 3D Crystal Cube (80px x 80px, translateZ(40px)) */}
            <div
              className="w-[80px] h-[80px] relative"
              style={{
                transformStyle: 'preserve-3d',
                animation: 'crystalCubeSpin 8s linear 3.9s infinite',
              }}
            >
              {[
                'translateZ(40px)',
                'rotateY(180deg) translateZ(40px)',
                'rotateY(90deg) translateZ(40px)',
                'rotateY(-90deg) translateZ(40px)',
                'rotateX(90deg) translateZ(40px)',
                'rotateX(-90deg) translateZ(40px)',
              ].map((transformStr, fIdx) => (
                <div
                  key={fIdx}
                  className="absolute inset-0 rounded-sm overflow-hidden"
                  style={{
                    border: '1px solid rgba(201,169,110,.5)',
                    background:
                      'linear-gradient(135deg, rgba(201,169,110,.1), rgba(232,213,163,.05))',
                    backdropFilter: 'blur(3px)',
                    boxShadow: 'inset 0 0 20px rgba(201,169,110,.15)',
                    transform: transformStr,
                  }}
                >
                  {/* Face Shimmer Sweep Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent)',
                      animation: 'faceShimmerSweep 4s linear infinite',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Light Sweep (Trigger 5.0s) */}
        <div
          className="relative w-full h-[1px] my-2 pointer-events-none opacity-0"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(201,169,110,.4), transparent)',
            animation: 'lightSweepScan 0.8s ease-out 5.0s forwards',
          }}
        />

        {/* Brand Name "CRETO4" */}
        <div
          className="flex gap-[3px] mt-8 select-none opacity-0"
          style={{
            animation: 'containerGlowFade 0.5s ease 5.3s forwards',
          }}
        >
          {/* C (4.4s) */}
          <span
            className="text-[clamp(3rem,8vw,5rem)] font-black text-white tracking-[-5px] opacity-0"
            style={{
              animation: 'letterFlipIn 0.8s cubic-bezier(.23,1,.32,1) 4.4s forwards',
            }}
          >
            C
          </span>
          {/* R (4.48s) */}
          <span
            className="text-[clamp(3rem,8vw,5rem)] font-black text-white tracking-[-5px] opacity-0"
            style={{
              animation: 'letterFlipIn 0.8s cubic-bezier(.23,1,.32,1) 4.48s forwards',
            }}
          >
            R
          </span>
          {/* E (4.56s) */}
          <span
            className="text-[clamp(3rem,8vw,5rem)] font-black text-white tracking-[-5px] opacity-0"
            style={{
              animation: 'letterFlipIn 0.8s cubic-bezier(.23,1,.32,1) 4.56s forwards',
            }}
          >
            E
          </span>
          {/* T (4.64s) */}
          <span
            className="text-[clamp(3rem,8vw,5rem)] font-black text-white tracking-[-5px] opacity-0"
            style={{
              animation: 'letterFlipIn 0.8s cubic-bezier(.23,1,.32,1) 4.64s forwards',
            }}
          >
            T
          </span>
          {/* O (4.72s) */}
          <span
            className="text-[clamp(3rem,8vw,5rem)] font-black text-white tracking-[-5px] opacity-0"
            style={{
              animation: 'letterFlipIn 0.8s cubic-bezier(.23,1,.32,1) 4.72s forwards',
            }}
          >
            O
          </span>
          {/* 4 (4.8s + Gold Shimmer) */}
          <span
            className="text-[clamp(3rem,8vw,5rem)] font-black tracking-[-5px] opacity-0"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #c9a96e, #e8d5a3, #f5f0eb, #c9a96e)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow:
                '0 0 30px rgba(201,169,110,.3), 0 0 60px rgba(201,169,110,.1)',
              animation:
                'letterFlipIn 0.8s cubic-bezier(.23,1,.32,1) 4.8s forwards, goldShimmerSweep 3s linear 4.8s infinite',
            }}
          >
            4
          </span>
        </div>

        {/* Tagline (5.3s) */}
        <p
          className="text-[0.75rem] font-medium text-[rgba(255,255,255,.35)] uppercase mt-2 opacity-0"
          style={{
            animation: 'taglineCinematic 0.7s ease 5.3s forwards',
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

