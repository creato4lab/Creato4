import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDown, ShieldCheck, Sparkles } from 'lucide-react';
import { Exploded3DProduct } from './Exploded3DProduct';

interface HeroProps {
  onOpenDiscuss: () => void;
  onOpenCinematic?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDiscuss, onOpenCinematic }) => {
  const [explosionFactor, setExplosionFactor] = useState(0.8);
  const headlineLines = ['We Turn Ideas', 'Into Reality.'];

  return (
    <section className="relative min-h-screen pt-24 lg:pt-28 pb-12 w-full flex items-center bg-[#FAF8F5] overflow-hidden border-b border-[#E8E2D9]">
      <div className="max-w-[1800px] w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100vh-120px)]">
        
        {/* LEFT COLUMN (55% desktop = 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center z-20">
          
          {/* Label Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#C4A35A] shrink-0 animate-pulse" />
            <span className="text-xs sm:text-sm uppercase font-bold tracking-[0.22em] text-[#5C6B60]">
              MULTIDISCIPLINARY PRODUCT & TECHNOLOGY LAB
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-[#1A3C2F] font-extrabold tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-8 flex flex-col gap-3 sm:gap-5">
            {headlineLines.map((line, idx) => (
              <div key={idx} className="overflow-hidden pb-1 sm:pb-2">
                <motion.span
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4 + idx * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`block ${idx === 2 ? 'text-[#1A3C2F]' : ''}`}
                >
                  {line}
                </motion.span>
              </div>
            ))}
          </h1>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-4 mt-8"
          >
            {/* What We Do CTA (Triggers Cinematic Experience + Scrolls) */}
            <button
              onClick={() => {
                if (onOpenCinematic) onOpenCinematic();
                else {
                  const el = document.getElementById('what-we-do');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#C4A35A] bg-[#C4A35A]/10 text-[#1A3C2F] text-sm font-medium tracking-wide hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-all duration-300 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C4A35A] group-hover:text-[#1A3C2F] transition-colors" />
              <span>What We Do</span>
            </button>

            {/* Primary CTA */}
            <button
              onClick={onOpenDiscuss}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-sm font-medium tracking-wide hover:bg-[#234B3C] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Discuss Your Idea</span>
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            </button>

            {/* Secondary CTA */}
            <a
              href="#work"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#1A3C2F] text-[#1A3C2F] text-sm font-medium tracking-wide hover:bg-[#1A3C2F] hover:text-[#FAF8F5] transition-all duration-300 cursor-pointer"
            >
              <span>Explore Our Work</span>
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </motion.div>



        </div>

        {/* RIGHT COLUMN (45% desktop = 5 cols) - 3D EXPLODED VISUALIZATION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative w-full h-[560px] lg:h-[700px] rounded-3xl bg-[#F5F0EA] border border-[#E8E2D9] p-2 overflow-hidden shadow-sm"
        >
          <Exploded3DProduct
            explosionFactor={explosionFactor}
            onExplosionChange={setExplosionFactor}
          />
        </motion.div>

      </div>
    </section>
  );
};
