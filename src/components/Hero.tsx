import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDown, ShieldCheck, Sparkles } from 'lucide-react';
import { Exploded3DProduct } from './Exploded3DProduct';

interface HeroProps {
  onOpenDiscuss: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDiscuss }) => {
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

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: 'easeOut' }}
            className="text-base sm:text-lg text-[#5C6B60] max-w-[560px] leading-relaxed mb-8 font-normal"
          >
            From product strategy and mechanical design to electronics, embedded systems, software,
            and immersive digital experiences — we bring multiple disciplines together to build
            things that work.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-4 mb-4"
          >
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

          {/* Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.4, delay: 1.5 }}
            className="flex items-center gap-2 text-[0.75rem] text-[#5C6B60] font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C4A35A]" />
            <span>Free initial discussion · No commitment</span>
          </motion.div>

          {/* Quick Stats Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.7 }}
            className="mt-8 pt-8 border-t border-[#E8E2D9] grid grid-cols-3 gap-4 max-w-lg"
          >
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1A3C2F]">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-[#5C6B60]">Real Hardware</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1A3C2F]">5 Layers</div>
              <div className="text-[11px] uppercase tracking-wider text-[#5C6B60]">Full Stack Lab</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1A3C2F]">20 Min</div>
              <div className="text-[11px] uppercase tracking-wider text-[#5C6B60]">Free Tech Call</div>
            </div>
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
