"use client";
import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const validImages = images.filter(Boolean);
  const hasImages = validImages.length > 0;

  const prev = useCallback(() => setActive((a) => (a - 1 + validImages.length) % validImages.length), [validImages.length]);
  const next = useCallback(() => setActive((a) => (a + 1) % validImages.length), [validImages.length]);

  if (!hasImages) {
    return (
      <div className="aspect-[16/9] bg-[#1A3C2F]/5 rounded-3xl border border-[#1A3C2F]/10 flex flex-col items-center justify-center">
        <ImageIcon className="w-16 h-16 text-[#1A3C2F]/20 mb-3" />
        <p className="text-[#1A3C2F]/40 font-mono text-xs uppercase tracking-widest">Media Gallery</p>
        <p className="text-[#1A3C2F]/25 text-xs mt-1">Images coming soon</p>
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
              src={validImages[active]}
              alt={`${title} — image ${active + 1}`}
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
          {validImages.length > 1 && (
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
          {validImages.length > 1 && (
            <div className="absolute bottom-3 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-mono rounded-full px-3 py-1">
              {active + 1} / {validImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {validImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {validImages.map((img, i) => (
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
            {validImages.length > 1 && (
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
              src={validImages[active]}
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
