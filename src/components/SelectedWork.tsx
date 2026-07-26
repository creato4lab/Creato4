import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { WORK_PROJECTS } from '../data';
import { WorkProject } from '../types';

export const SelectedWork: React.FC = () => {
  return (
    <section id="work" className="pt-12 lg:pt-16 pb-16 lg:pb-24 bg-[#1A3C2F] text-[#FAF8F5] px-6 sm:px-10 lg:px-16 xl:px-20">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Section Header */}
        <div className="mb-8 lg:mb-10">
          <span className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#C4A35A] block mb-2">
            SELECTED ENGINEERING WORK
          </span>
          <h2 className="heading-h1 text-[#FAF8F5] font-extrabold tracking-tight">
            THINGS WE’VE ACTUALLY BUILT
          </h2>
        </div>

        {/* 3-Column Grid for All Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WORK_PROJECTS.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/shop/${project.id}`}
                className="group relative bg-[#F5F0EA] rounded-[20px] overflow-hidden border border-[#E8E2D9] shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1.5 flex flex-col justify-between h-[420px]"
              >
                {/* Image */}
                <div className="relative w-full h-[220px] overflow-hidden bg-[#FAF8F5] flex items-center justify-center border-b border-[#E8E2D9]">
                  {/* Blurry background image for filling space premiumly */}
                  <img
                    src={project.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-[6px] opacity-25 scale-110 pointer-events-none"
                  />
                  {/* Clean, contained front image (no cropping) */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {project.badge && (
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-[#C4A35A] text-[#1A3C2F] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      {project.badge}
                    </div>
                  )}
                </div>

                {/* Content Overlay */}
                <div className="p-6 bg-[#FAF8F5] flex-1 flex flex-col justify-between border-t border-[#E8E2D9]">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-[#5C6B60] mb-2 line-clamp-1">
                      {project.category}
                    </div>
                    <h3 className="text-xl font-bold text-[#1A3C2F] mb-2 group-hover:text-[#234B3C] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#5C6B60] line-clamp-2 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A3C2F] group-hover:text-[#C4A35A]">
                    <span>Explore Project</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
