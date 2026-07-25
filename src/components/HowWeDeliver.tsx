import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { Check, Compass, ShieldAlert, Layers, Box, Cpu, Sparkles, Settings, PackageCheck } from 'lucide-react';
import { PROCESS_STEPS } from '../data';

export const HowWeDeliver: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateScrollRange = () => {
      if (trackRef.current) {
        const scrollWidth = trackRef.current.scrollWidth;
        const clientWidth = window.innerWidth;
        // Calculate the exact pixel distance needed to translate the track 
        // so the last card touches the right side of the screen.
        setScrollRange(scrollWidth - clientWidth + 48);
      }
    };
    
    updateScrollRange();
    window.addEventListener('resize', updateScrollRange);
    return () => window.removeEventListener('resize', updateScrollRange);
  }, []);

  // Track vertical scroll progress over this section
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Translate the horizontal track. 
  // We use numeric pixel values [0, -scrollRange] which Framer Motion interpolates perfectly.
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  // Sync dots with scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // There are PROCESS_STEPS.length cards. Map 0-1 to 0-(length-1)
    const index = Math.min(
      Math.floor(latest * PROCESS_STEPS.length),
      PROCESS_STEPS.length - 1
    );
    if (index !== activeIndex && index >= 0) {
      setActiveIndex(index);
    }
  });

  const getStepIcon = (shapeType: string) => {
    switch (shapeType) {
      case 'cube':
        return <Compass className="w-16 h-16 text-[#1A3C2F]" />;
      case 'sphere':
        return <ShieldAlert className="w-16 h-16 text-[#C4A35A]" />;
      case 'torus':
        return <Layers className="w-16 h-16 text-[#1A3C2F]" />;
      case 'octahedron':
        return <Box className="w-16 h-16 text-[#1A3C2F]" />;
      case 'ring':
        return <Cpu className="w-16 h-16 text-[#C4A35A]" />;
      case 'pyramid':
        return <Sparkles className="w-16 h-16 text-[#1A3C2F]" />;
      case 'cylinder':
        return <Settings className="w-16 h-16 text-[#1A3C2F]" />;
      case 'knot':
      default:
        return <PackageCheck className="w-16 h-16 text-[#1A3C2F]" />;
    }
  };

  const handleDotClick = (index: number) => {
    if (!targetRef.current) return;
    
    const sectionStart = targetRef.current.offsetTop;
    // Scrollable height is total height minus viewport height
    const scrollableDistance = targetRef.current.offsetHeight - window.innerHeight;
    
    // Target progress for this card (center it in its progress window)
    const targetProgress = (index + 0.5) / PROCESS_STEPS.length;
    const targetScrollY = sectionStart + (targetProgress * scrollableDistance);
    
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  return (
    <section ref={targetRef} id="process" className="relative h-[450vh] bg-[#F5F0EA] border-b border-[#E8E2D9]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-24 lg:pt-32 pb-10">
        
        {/* Header - Stays sticky at top */}
        <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 text-center mb-10 shrink-0">
          <span className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#5C6B60] block mb-3">
            YOUR IDEA. OUR ENGINEERING.
          </span>
          <h2 className="heading-h1 text-[#1A3C2F] font-extrabold tracking-tight uppercase">
            HOW WE DELIVER YOUR PRODUCT
          </h2>
        </div>

        {/* Horizontal Track Wrapper */}
        <div className="flex-1 w-full flex items-center">
          <motion.div 
            ref={trackRef}
            style={{ x }} 
            className="flex gap-6 lg:gap-10 px-6 sm:px-10 lg:px-16 xl:px-20 w-max"
          >
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.number}
                className="w-[85vw] md:w-[600px] lg:w-[900px] bg-[#FAF8F5] border border-[#E8E2D9] rounded-3xl p-8 lg:p-12 shadow-lg shrink-0 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Giant Background Number */}
                <div className="absolute top-4 right-8 font-extrabold text-[10rem] lg:text-[14rem] text-[#1A3C2F]/5 select-none pointer-events-none leading-none font-mono">
                  {step.number}
                </div>

                {/* Left Content (7 cols) */}
                <div className="lg:col-span-7 z-10">
                  <span className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#C4A35A] block mb-2">
                    STEP {step.number} / 08
                  </span>
                  <h3 className="text-3xl lg:text-4xl font-extrabold text-[#1A3C2F] mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#5C6B60] uppercase tracking-wider mb-6">
                    {step.subtitle}
                  </p>
                  <p className="text-sm lg:text-base text-[#5C6B60] leading-relaxed max-w-lg mb-8">
                    {step.description}
                  </p>

                  {/* Deliverables */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A3C2F] block mb-3">
                      What You Get:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((del, dIdx) => (
                        <span
                          key={dIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F] font-medium"
                        >
                          <Check className="w-3.5 h-3.5 text-[#15803D]" />
                          {del}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Abstract Visualizer (5 cols) */}
                <div className="lg:col-span-5 z-10 flex flex-col items-center justify-center p-8 bg-[#F5F0EA] rounded-2xl border border-[#E8E2D9] relative min-h-[260px] h-full">
                  <div className="w-32 h-32 rounded-3xl bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center shadow-lg mb-4 transition-transform hover:scale-105 duration-300">
                    {getStepIcon(step.shapeType)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1A3C2F] text-center">
                    {step.title} VERIFIED
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Progress Dots - Stays sticky at bottom */}
        <div className="w-full flex justify-center gap-3 shrink-0 mt-6">
          {PROCESS_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx ? 'w-10 bg-[#1A3C2F]' : 'w-2.5 bg-[#E8E2D9] hover:bg-[#1A3C2F]/50'
              }`}
              aria-label={`Scroll to step ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
