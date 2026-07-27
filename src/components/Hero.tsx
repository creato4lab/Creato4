import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, ArrowDown, Sparkles } from 'lucide-react';
import { Exploded3DProduct } from './Exploded3DProduct';

interface HeroProps {
  onOpenDiscuss: () => void;
  onOpenCinematic?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDiscuss, onOpenCinematic }) => {
  const [explosionFactor, setExplosionFactor] = useState(0.8);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x, y });

    const mouseXPos = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative min-h-screen pt-24 lg:pt-28 pb-12 w-full flex items-center bg-[#FAF8F5] overflow-hidden border-b border-[#E8E2D9]">
      <div className="max-w-[1800px] w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100vh-120px)]">
        
        {/* LEFT COLUMN (55% desktop = 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center z-20">
          
          {/* Interactive Mouse-Tracking Headline Container */}
          <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: 1000,
            }}
            className="relative cursor-pointer group py-4 my border-0 select-none"
          >
            {/* Magical Twinkling Stars Floating Particles on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20">
              {/* Star 1 - Top Right */}
              <motion.div
                animate={{ y: [-5, 5, -5], scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 right-12 text-[#1A3C2F]"
              >
                <Sparkles className="w-6 h-6 text-[#1A3C2F]" />
              </motion.div>

              {/* Star 2 - Center Floating */}
              <motion.div
                animate={{ y: [4, -6, 4], scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="absolute top-1/2 left-1/3 text-[#224B27]"
              >
                <Sparkles className="w-5 h-5 text-[#224B27]" />
              </motion.div>

              {/* Star 3 - Bottom Right */}
              <motion.div
                animate={{ y: [-4, 6, -4], scale: [0.9, 1.25, 0.9], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="absolute bottom-4 right-1/4 text-[#1A3C2F]"
              >
                <Sparkles className="w-5 h-5 text-[#1A3C2F]" />
              </motion.div>

              {/* Star 4 - Left Sparkle */}
              <motion.div
                animate={{ scale: [0.7, 1.1, 0.7], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
                className="absolute top-1/3 -left-4 text-[#2D5929]"
              >
                <Sparkles className="w-4 h-4 text-[#2D5929]" />
              </motion.div>
            </div>

            <h1 className="font-extrabold tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-8 flex flex-col gap-3 sm:gap-4 relative z-10 text-[#1A3C2F]">
              
              {/* Line 1: We Turn Ideas */}
              <div className="overflow-hidden pb-1 sm:pb-2 flex flex-wrap items-center gap-x-3 sm:gap-x-5">
                <motion.span
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-[#1A3C2F] group-hover:translate-z-6 transition-transform duration-300"
                >
                  We Turn
                </motion.span>

                <motion.span
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-[#1A3C2F] group-hover:scale-105 group-hover:text-[#2D5929] transition-all duration-300"
                >
                  Ideas
                </motion.span>
              </div>

              {/* Line 2: Into Reality. */}
              <div className="overflow-hidden pb-1 sm:pb-2 flex flex-wrap items-center gap-x-3 sm:gap-x-5">
                <motion.span
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.64, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-[#1A3C2F]"
                >
                  Into
                </motion.span>

                <motion.span
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.76, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-[#1A3C2F] group-hover:translate-z-8 transition-transform duration-300"
                >
                  Reality.
                </motion.span>
              </div>
            </h1>
          </motion.div>

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
