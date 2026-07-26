'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopLoading = useCallback(() => {
    setProgress(100);
    setIsFadingOut(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setVisible(false);
      setIsFadingOut(false);
      setProgress(0);
    }, 280);
  }, []);

  const startLoading = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsFadingOut(false);
    setLoading(true);
    setVisible(true);
    setProgress(18);

    // Safety fallback: auto-hide after 3.5 seconds if route change gets stuck
    timeoutRef.current = setTimeout(() => {
      stopLoading();
    }, 3500);
  }, [stopLoading]);

  // Trigger stop on route change completion
  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  // Intercept internal link clicks for instant feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a');
      if (!target) return;

      if (
        target.target === '_blank' ||
        target.hasAttribute('download') ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const href = target.getAttribute('href');
      if (!href) return;

      if (href.startsWith('/') || href.startsWith(window.location.origin)) {
        if (href.includes('#') && href.split('#')[0] === window.location.pathname) {
          return;
        }

        try {
          const url = new URL(href, window.location.origin);
          const targetSearch = url.search.replace(/^\?/, '');
          if (url.pathname !== pathname || targetSearch !== searchParams.toString()) {
            startLoading();
          }
        } catch {
          // ignore malformed URLs
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname, searchParams, startLoading]);

  // Smooth progress accumulation while loading
  useEffect(() => {
    if (!loading || isFadingOut) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const remaining = 90 - prev;
        return prev + Math.max(remaining * 0.12, 0.4);
      });
    }, 80);

    return () => clearInterval(timer);
  }, [loading, isFadingOut]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isFadingOut ? 'opacity-0 scale-[1.015]' : 'opacity-100 scale-100'
      }`}
      style={{ willChange: 'opacity, transform' }}
    >
      {/* Smooth translucent backdrop */}
      <div className="absolute inset-0 bg-[#FAF8F5]/85 dark:bg-[#0A130F]/90 backdrop-blur-md" />

      {/* Top minimal progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-stone-200/40 dark:bg-emerald-950/40 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#1A3C2F] via-[#C4A35A] to-[#E8D4A0] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(196,163,90,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Clean Minimalist Centerpiece */}
      <div className="relative z-10 flex flex-col items-center gap-4 select-none">
        {/* Sleek Ring & Emblem */}
        <div className="relative w-11 h-11 flex items-center justify-center">
          {/* Smooth spinning arc */}
          <div className="absolute inset-0 rounded-full border-[1.5px] border-stone-200/60 dark:border-emerald-900/30 border-t-[#C4A35A] dark:border-t-[#C4A35A] animate-spin [animation-duration:0.9s]" />

          {/* Inner brand badge */}
          <div className="w-7 h-7 rounded-md bg-[#1A3C2F] flex items-center justify-center shadow-md">
            <span className="text-[10px] font-bold tracking-widest text-[#C4A35A]">
              C4
            </span>
          </div>
        </div>

        {/* Minimal Brand Label */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-stone-600 dark:text-stone-300">
            CREATO4 LAB
          </span>

          {/* Subtle line glow */}
          <div className="w-10 h-[1.5px] bg-[#C4A35A]/30 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C4A35A] to-transparent animate-[shimmer_1.4s_infinite_linear]" />
          </div>
        </div>
      </div>
    </div>
  );
}

