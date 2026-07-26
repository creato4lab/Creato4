'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const startLoading = useCallback(() => {
    setLoading(true);
    setVisible(true);
    setProgress(0);
    
    // Safety fallback: auto-hide after 3 seconds if route change fails or gets stuck
    setTimeout(() => {
      stopLoading();
    }, 3000);
  }, []);

  const stopLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => setVisible(false), 200); // reduced from 400ms to feel faster
    }, 50); // reduced from 300ms to make it lightning fast
  }, []);

  // Trigger on route change
  useEffect(() => {
    stopLoading();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept all link clicks to start loader instantly
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;
      // Only trigger for internal links
      if (href.startsWith('/') || href.startsWith(window.location.origin)) {
        // Ignore purely anchor links
        if (href.includes('#') && href.split('#')[0] === window.location.pathname) {
            return;
        }
        
        const url = new URL(href, window.location.origin);
        const targetSearch = url.search.replace(/^\?/, '');
        if (url.pathname !== pathname || targetSearch !== searchParams.toString()) {
          startLoading();
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname, startLoading]);

  // Animate progress bar while loading
  useEffect(() => {
    if (!loading) return;

    let current = 0;
    // Fast initial burst to 70%, then slow crawl
    const intervals = [
      { target: 30, speed: 80 },
      { target: 60, speed: 150 },
      { target: 75, speed: 300 },
      { target: 85, speed: 600 },
      { target: 92, speed: 1000 },
    ];

    let phase = 0;
    const tick = () => {
      if (phase >= intervals.length) return;
      const { target, speed } = intervals[phase];
      if (current < target) {
        current += 1;
        setProgress(current);
        setTimeout(tick, speed / (target - (intervals[phase - 1]?.target || 0)));
      } else {
        phase++;
        tick();
      }
    };
    tick();
  }, [loading]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes loaderSlideUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-8px); opacity: 0; }
        }
        @keyframes loaderFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes spinnerRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-none"
        style={{
          animation: loading ? 'loaderFadeIn 0.15s ease forwards' : 'loaderSlideUp 0.4s cubic-bezier(0.4,0,0.2,1) forwards',
        }}
      >
        {/* Frosted glass panel that slides in from top */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(250, 248, 245, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />

        {/* Ambient orbs */}
        <div
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(196,163,90,0.15) 0%, transparent 70%)',
            animation: 'orbPulse 2s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(26,60,47,0.08) 0%, transparent 70%)',
            animation: 'orbPulse 2.5s ease-in-out infinite 0.5s',
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
          {/* Logo mark */}
          <div
            className="flex flex-col items-center gap-4"
            style={{ animation: 'logoFloat 2s ease-in-out infinite' }}
          >
            {/* C4 Logo */}
            <div className="relative">
              {/* Spinning ring */}
              <div
                className="absolute -inset-3 rounded-full"
                style={{
                  border: '1.5px solid transparent',
                  borderTopColor: '#C4A35A',
                  borderRightColor: 'rgba(196,163,90,0.3)',
                  animation: 'spinnerRing 1.2s linear infinite',
                }}
              />
              {/* Outer ring */}
              <div
                className="absolute -inset-5 rounded-full"
                style={{
                  border: '1px solid rgba(196,163,90,0.15)',
                  animation: 'spinnerRing 2.5s linear infinite reverse',
                }}
              />
              {/* Logo box */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #1A3C2F 0%, #234B3C 100%)',
                  boxShadow: '0 8px 32px rgba(26,60,47,0.25), 0 0 0 1px rgba(196,163,90,0.2)',
                }}
              >
                <span
                  className="font-extrabold text-xl"
                  style={{
                    background: 'linear-gradient(135deg, #C4A35A, #E8D4A0, #C4A35A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200%',
                    animation: 'shimmer 2s linear infinite',
                  }}
                >
                  C4
                </span>
              </div>
            </div>

            {/* Brand name */}
            <div className="text-center">
              <p
                className="text-xs font-bold tracking-[4px] uppercase"
                style={{ color: '#5C6B60' }}
              >
                Creato4 Lab
              </p>
            </div>
          </div>

          {/* Animated dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: '#C4A35A',
                  animation: `dotBounce 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-[3px] overflow-hidden" style={{ background: 'rgba(196,163,90,0.1)' }}>
          <div
            className="h-full relative"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #1A3C2F, #C4A35A, #E8D4A0)',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 12px rgba(196,163,90,0.8), 0 0 4px rgba(196,163,90,1)',
            }}
          >
            {/* Shimmer on progress bar */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                animation: 'shimmer 1s linear infinite',
              }}
            />
          </div>
        </div>

        {/* Corner accent lines */}
        <div className="absolute top-[3px] left-0 w-8 h-8 pointer-events-none">
          <div className="absolute top-0 left-0 w-px h-6" style={{ background: 'linear-gradient(to bottom, #C4A35A, transparent)' }} />
          <div className="absolute top-0 left-0 h-px w-6" style={{ background: 'linear-gradient(to right, #C4A35A, transparent)' }} />
        </div>
        <div className="absolute top-[3px] right-0 w-8 h-8 pointer-events-none">
          <div className="absolute top-0 right-0 w-px h-6" style={{ background: 'linear-gradient(to bottom, #C4A35A, transparent)' }} />
          <div className="absolute top-0 right-0 h-px w-6" style={{ background: 'linear-gradient(to left, #C4A35A, transparent)' }} />
        </div>
      </div>
    </>
  );
}
