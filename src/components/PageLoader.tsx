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
    }, 250);
  }, []);

  const startLoading = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsFadingOut(false);
    setLoading(true);
    setVisible(true);
    setProgress(20);

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
        return prev + Math.max(remaining * 0.15, 0.5);
      });
    }, 80);

    return () => clearInterval(timer);
  }, [loading, isFadingOut]);

  if (!visible) return null;

  return (
    <>
      {/* Top minimal progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[10000] h-[2px] overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#1A3C2F] via-[#C4A35A] to-[#E8D4A0] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(196,163,90,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}


