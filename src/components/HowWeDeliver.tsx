import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Check, ArrowRight, Layers, Box, Cpu, Sparkles, Compass, ShieldAlert, Settings, PackageCheck } from 'lucide-react';
import { PROCESS_STEPS } from '../data';

export const HowWeDeliver: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const currentStep = PROCESS_STEPS[activeStepIndex];

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

  return (
    <section id="process" className="py-20 lg:py-32 bg-[#F5F0EA] border-b border-[#E8E2D9] overflow-hidden">
      
      {/* Header */}
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 text-center mb-16">
        <span className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#5C6B60] block mb-3">
          YOUR IDEA. OUR ENGINEERING.
        </span>
        <h2 className="heading-h1 text-[#1A3C2F] font-extrabold tracking-tight">
          A WORKING PRODUCT
        </h2>
      </div>

      {/* Interactive Step Selector Bar */}
      <div className="max-w-[1200px] mx-auto px-6 mb-12">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-[#E8E2D9]">
          {PROCESS_STEPS.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStepIndex(idx)}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#1A3C2F] text-[#FAF8F5] shadow-md'
                    : 'bg-[#FAF8F5] text-[#5C6B60] hover:text-[#1A3C2F] border border-[#E8E2D9]'
                }`}
              >
                <span className={`font-mono text-xs font-bold ${isActive ? 'text-[#C4A35A]' : 'text-[#5C6B60]'}`}>
                  {step.number}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Active Panel Display */}
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.number}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-3xl p-8 lg:p-14 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px] relative overflow-hidden"
          >
            {/* Giant Background Number */}
            <div className="absolute top-4 right-8 font-extrabold text-[10rem] lg:text-[14rem] text-[#1A3C2F]/5 select-none pointer-events-none leading-none font-mono">
              {currentStep.number}
            </div>

            {/* Left Content (40% = 5 cols) */}
            <div className="lg:col-span-6 z-10">
              <span className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#C4A35A] block mb-2">
                METHODOLOGY STEP {currentStep.number} / 08
              </span>
              <h3 className="heading-h1 font-extrabold text-[#1A3C2F] mb-2 tracking-tight">
                {currentStep.title}
              </h3>
              <p className="text-sm font-semibold text-[#5C6B60] uppercase tracking-wider mb-6">
                {currentStep.subtitle}
              </p>
              <p className="text-sm lg:text-base text-[#5C6B60] leading-relaxed max-w-lg mb-8">
                {currentStep.description}
              </p>

              {/* Deliverables */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A3C2F] block mb-3">
                  Key Deliverables:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentStep.deliverables.map((del, dIdx) => (
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

            {/* Right Abstract Visualizer (60% = 7 cols) */}
            <div className="lg:col-span-6 z-10 flex flex-col items-center justify-center p-8 bg-[#F5F0EA] rounded-2xl border border-[#E8E2D9] relative min-h-[260px]">
              <div className="w-32 h-32 rounded-3xl bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center shadow-lg mb-4">
                {getStepIcon(currentStep.shapeType)}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1A3C2F]">
                {currentStep.title} PHASE VERIFIED
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : PROCESS_STEPS.length - 1))}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-xs font-bold uppercase tracking-wider text-[#1A3C2F] hover:bg-[#1A3C2F] hover:text-[#FAF8F5] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>

          {/* 8 Dots Indicator */}
          <div className="flex items-center gap-2">
            {PROCESS_STEPS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveStepIndex(dotIdx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeStepIndex === dotIdx ? 'w-8 bg-[#1A3C2F]' : 'w-2.5 bg-[#E8E2D9] hover:bg-[#1A3C2F]/50'
                }`}
                aria-label={`Go to step ${dotIdx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveStepIndex((prev) => (prev < PROCESS_STEPS.length - 1 ? prev + 1 : 0))}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C] transition-colors cursor-pointer"
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </section>
  );
};
