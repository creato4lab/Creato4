"use client";
import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getImageUrl } from "@/lib/imageUrl";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  // Track error per image index so one broken image doesn't hide others
  const [errorSet, setErrorSet] = useState<Set<number>>(new Set());

  const validImages = images.filter(Boolean).map(getImageUrl);

  // Only show images that haven't errored
  const displayImages = validImages.filter((_, i) => !errorSet.has(i));
  const hasImages = displayImages.length > 0;

  const markError = (idx: number) => {
    setErrorSet((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  };

  const prev = useCallback(() => setActive((a) => (a - 1 + displayImages.length) % displayImages.length), [displayImages.length]);
  const next = useCallback(() => setActive((a) => (a + 1) % displayImages.length), [displayImages.length]);

  if (!hasImages) {
    return (
      <div className="aspect-[16/9] bg-gradient-to-br from-[#1A3C2F] via-[#2D5929] to-[#102A20] rounded-3xl border border-[#1A3C2F]/20 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(#C4A35A_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5]/10 border border-[#C4A35A]/30 flex items-center justify-center mb-4 text-[#C4A35A] shadow-xl relative z-10 backdrop-blur-md">
          <ImageIcon className="w-8 h-8 text-[#C4A35A]" />
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C4A35A] bg-[#C4A35A]/10 px-3 py-1 rounded-full border border-[#C4A35A]/20 mb-2 relative z-10">
          HARDWARE ASSET GALLERY
        </span>
        <h3 className="text-[#FAF8F5] text-lg font-bold relative z-10">{title}</h3>
        <p className="text-[#FAF8F5]/60 text-xs mt-1 relative z-10">Verified Product Blueprint & Schematics</p>
      </div>
    );
  }

  return (
    <>
      {/* Main display */}
      <div className="space-y-3">
        <div
          className="relative aspect-[16/9] bg-[#1A3C2F]/5 rounded-3xl overflow-hidden border border-[#1A3C2F]/10 cursor-zoom-in group"
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={displayImages[active]}
              alt={title}
              onError={() => {
                // Find the original index in validImages that matches the display index
                let origIdx = 0;
                let displayCount = 0;
                for (let i = 0; i < validImages.length; i++) {
                  if (!errorSet.has(i)) {
                    if (displayCount === active) { origIdx = i; break; }
                    displayCount++;
                  }
                }
                markError(origIdx);
                if (active > 0) setActive(0);
              }}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          </AnimatePresence>
          {/* Zoom hint */}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-4 h-4 text-white" />
          </div>
          {/* Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4 text-[#1A3C2F]" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="w-4 h-4 text-[#1A3C2F]" />
              </button>
            </>
          )}
          {/* Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-3 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-mono rounded-full px-3 py-1">
              {active + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {displayImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  i === active ? "border-[#1A3C2F] shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"
              onClick={() => setLightbox(false)}
            >
              <X className="w-7 h-7" />
            </button>
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-9 h-9" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-9 h-9" />
                </button>
              </>
            )}
            <motion.img
              key={active}
              src={displayImages[active]}
              alt={title}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
