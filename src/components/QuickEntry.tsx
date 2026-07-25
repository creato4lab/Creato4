import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Box, Sparkles, PencilRuler, Cpu, Layers, Layout } from 'lucide-react';

interface QuickEntryProps {
  onSelectOption: (option: 'idea' | 'student' | 'digital') => void;
}

export const QuickEntry: React.FC<QuickEntryProps> = ({ onSelectOption }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="py-20 lg:py-32 bg-[#F5F0EA] border-b border-[#E8E2D9] px-6 sm:px-10 lg:px-16 xl:px-20">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#5C6B60] block mb-3">
            QUICK ENTRY
          </span>
          <h2 className="heading-h2 text-[#1A3C2F] font-bold">
            WHAT ARE YOU LOOKING TO BUILD?
          </h2>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CARD 01: I HAVE AN IDEA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHoveredCard('idea')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelectOption('idea')}
            className="group relative bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#1A3C2F] rounded-3xl p-8 lg:p-10 flex flex-col justify-between transition-all duration-400 hover:-translate-y-1.5 shadow-xs hover:shadow-xl cursor-pointer overflow-hidden"
          >
            {/* 3D Visual Box: Pencil Sketch to Photorealistic Transformation */}
            <div className="relative w-full h-[200px] rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9] flex items-center justify-center overflow-hidden mb-8">
              
              {/* Sketch Wireframe layer */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  hoveredCard === 'idea' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div className="relative w-28 h-28 border-2 border-dashed border-[#5C6B60] rounded-xl flex items-center justify-center rotate-6">
                  <PencilRuler className="w-10 h-10 text-[#5C6B60]" />
                  <span className="absolute -top-3 -left-3 text-[9px] font-mono text-[#5C6B60] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8E2D9]">
                    CAD_SKETCH.dxf
                  </span>
                </div>
              </div>

              {/* Photorealistic Product Transformation Layer */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
                  hoveredCard === 'idea'
                    ? 'opacity-100 scale-105 bg-gradient-to-br from-[#1A3C2F] to-[#234B3C] text-[#FAF8F5]'
                    : 'opacity-0 scale-90'
                }`}
              >
                <motion.div
                  animate={hoveredCard === 'idea' ? { rotateY: 360 } : {}}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 rounded-2xl bg-[#C4A35A]/20 border border-[#C4A35A] flex items-center justify-center mb-2 shadow-lg"
                >
                  <Cpu className="w-10 h-10 text-[#C4A35A]" />
                </motion.div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C4A35A]">
                  PROTOTYPE_RENDER.3D
                </span>
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-2xl font-bold text-[#1A3C2F] mb-3 group-hover:text-[#1A3C2F]">
                I HAVE AN IDEA
              </h3>
              <p className="text-sm text-[#5C6B60] leading-relaxed mb-6">
                Need a custom product, prototype, machine, hardware system, or custom software solution tailored to your exact specifications?
              </p>
            </div>

            {/* CTA */}
            <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A3C2F] group-hover:text-[#1A3C2F]">
              <span>Start a Custom Project</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45 group-hover:translate-x-1" />
            </div>
          </motion.div>

          {/* CARD 02: I NEED A STUDENT PROJECT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHoveredCard('student')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelectOption('student')}
            className="group relative bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#1A3C2F] rounded-3xl p-8 lg:p-10 flex flex-col justify-between transition-all duration-400 hover:-translate-y-1.5 shadow-xs hover:shadow-xl cursor-pointer overflow-hidden"
          >
            {/* 3D Visual Box: Project Box Lid Opening */}
            <div className="relative w-full h-[200px] rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9] flex items-center justify-center overflow-hidden mb-8">
              
              <div className="relative w-32 h-24 bg-[#E8E2D9] border border-[#5C6B60]/30 rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                {/* Lid animation */}
                <div
                  className={`absolute top-0 left-0 right-0 h-8 bg-[#C4A35A]/30 border-b border-[#C4A35A] rounded-t-lg origin-top transition-transform duration-500 flex items-center justify-center ${
                    hoveredCard === 'student' ? '-rotate-x-120 opacity-40' : 'rotate-x-0'
                  }`}
                >
                  <span className="text-[8px] font-bold text-[#1A3C2F]">ENGINEERING KIT</span>
                </div>

                {/* Floating components inside */}
                <div className="flex items-center gap-2">
                  <Box className="w-8 h-8 text-[#1A3C2F]" />
                  <div
                    className={`flex flex-col gap-1 transition-all duration-500 ${
                      hoveredCard === 'student' ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-50'
                    }`}
                  >
                    <span className="w-6 h-1.5 bg-[#15803D] rounded-full" />
                    <span className="w-8 h-1.5 bg-[#C4A35A] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-2xl font-bold text-[#1A3C2F] mb-3">
                I NEED A STUDENT PROJECT
              </h3>
              <p className="text-sm text-[#5C6B60] leading-relaxed mb-6">
                Explore ready-made engineering projects, hardware kits, complete documentation, circuit schematics, and learning blueprints.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A3C2F]">
              <span>Browse Projects</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45 group-hover:translate-x-1" />
            </div>
          </motion.div>

          {/* CARD 03: I NEED A DIGITAL EXPERIENCE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHoveredCard('digital')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelectOption('digital')}
            className="group relative bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#1A3C2F] rounded-3xl p-8 lg:p-10 flex flex-col justify-between transition-all duration-400 hover:-translate-y-1.5 shadow-xs hover:shadow-xl cursor-pointer overflow-hidden"
          >
            {/* 3D Visual Box: 3D Extruded Browser Window */}
            <div className="relative w-full h-[200px] rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9] flex items-center justify-center overflow-hidden mb-8">
              
              <div
                className={`relative w-36 h-24 rounded-xl border border-[#1A3C2F]/20 bg-[#FAF8F5] p-2 flex flex-col gap-1.5 shadow-md transition-all duration-500 ${
                  hoveredCard === 'digital' ? 'scale-110 shadow-2xl -rotate-2' : ''
                }`}
              >
                {/* Browser bar */}
                <div className="flex items-center gap-1 border-b border-[#E8E2D9] pb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-[8px] text-[#5C6B60] font-mono ml-auto">WebGL 3D</span>
                </div>

                {/* Floating WebGL Elements */}
                <div className="flex-1 flex items-center justify-center relative">
                  <Layout className="w-6 h-6 text-[#1A3C2F]" />
                  <motion.div
                    animate={hoveredCard === 'digital' ? { scale: [1, 1.2, 1], rotate: 180 } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-1 -right-1 text-[#C4A35A]"
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-2xl font-bold text-[#1A3C2F] mb-3">
                I NEED A DIGITAL EXPERIENCE
              </h3>
              <p className="text-sm text-[#5C6B60] leading-relaxed mb-6">
                Websites, 3D interactive experiences, web applications, real-time dashboards, cloud platforms, and AI-powered solutions.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A3C2F]">
              <span>Explore Digital Services</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45 group-hover:translate-x-1" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
