"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, X, CheckCircle, Cpu, ShieldCheck, Sparkles, Layers, Award, Wrench } from "lucide-react";
import { WORK_PROJECTS } from "../data";
import { WorkProject } from "../types";

interface SelectedWorkProps {
  onOpenDiscuss?: (projectTitle?: string) => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ onOpenDiscuss }) => {
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  return (
    <section id="work" className="pt-12 lg:pt-16 pb-16 lg:pb-24 bg-[#1A3C2F] text-[#FAF8F5] px-6 sm:px-10 lg:px-16 xl:px-20 relative">
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
              <div
                onClick={() => setSelectedProject(project)}
                className="group relative bg-[#F5F0EA] rounded-[20px] overflow-hidden border border-[#E8E2D9] shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-1.5 flex flex-col justify-between h-[420px] cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full h-[220px] overflow-hidden bg-[#FAF8F5] flex items-center justify-center border-b border-[#E8E2D9]">
                  {/* Blurry background image for filling space premiumly */}
                  <img
                    src={project.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-[6px] opacity-25 scale-110 pointer-events-none"
                  />
                  {/* Clean, contained front image */}
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
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* ── PROJECT OVERVIEW MODAL ── */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md"
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-[#FAF8F5] text-[#1A3C2F] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden border border-[#E8E2D9] relative"
            >
              {/* Header Image / Banner (Fixed top) */}
              <div className="relative w-full h-[220px] sm:h-[260px] bg-[#1A3C2F] flex items-center justify-center overflow-hidden border-b border-[#E8E2D9] shrink-0">
                <img
                  src={selectedProject.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-[8px] opacity-30 scale-110 pointer-events-none"
                />
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="relative z-10 max-w-full max-h-full object-contain p-4"
                />
                {selectedProject.badge && (
                  <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-[#C4A35A] text-[#1A3C2F] text-xs font-black uppercase tracking-wider shadow-md">
                    {selectedProject.badge}
                  </div>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#1A3C2F] flex items-center justify-center shadow-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Body (SCROLLABLE with Lenis bypass) */}
              <div
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6"
              >
                {/* Title & Category */}
                <div>
                  <span className="text-[0.65rem] font-black uppercase tracking-widest bg-[#1A3C2F]/10 text-[#1A3C2F] px-3 py-1 rounded-full">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1A3C2F] mt-3 tracking-tight">
                    {selectedProject.title}
                  </h2>
                  <p className="text-sm font-semibold text-[#5C6B60] mt-1">{selectedProject.subtitle}</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#1A3C2F]/50 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C4A35A]" /> Project Overview
                  </h4>
                  <p className="text-sm text-[#1A3C2F]/80 leading-relaxed bg-white p-4 rounded-2xl border border-[#E8E2D9]">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Challenge & Solution Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9]">
                    <h5 className="text-xs font-black uppercase tracking-wider text-red-600 mb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> The Challenge
                    </h5>
                    <p className="text-xs text-[#5C6B60] leading-relaxed">{selectedProject.challenge}</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9]">
                    <h5 className="text-xs font-black uppercase tracking-wider text-green-700 mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> The Solution
                    </h5>
                    <p className="text-xs text-[#5C6B60] leading-relaxed">{selectedProject.solution}</p>
                  </div>
                </div>

                {/* Tech Stack */}
                {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#1A3C2F]/50 mb-2.5 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-[#C4A35A]" /> Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="bg-[#1A3C2F]/5 text-[#1A3C2F] text-xs font-bold px-3 py-1.5 rounded-xl border border-[#1A3C2F]/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outcomes & Achievements */}
                {selectedProject.outcomes && selectedProject.outcomes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#1A3C2F]/50 mb-2.5 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#C4A35A]" /> Key Outcomes & Achievements
                    </h4>
                    <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#E8E2D9]">
                      {selectedProject.outcomes.map((outcome, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-[#1A3C2F]">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar (Fixed bottom) */}
              <div className="p-4 sm:p-6 bg-[#FAF8F5] border-t border-[#E8E2D9] shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto px-6 py-2.5 border border-[#1A3C2F]/20 text-[#1A3C2F] rounded-full text-xs font-bold hover:bg-[#1A3C2F]/5 transition-colors"
                >
                  Close Overview
                </button>

                {onOpenDiscuss && (
                  <button
                    onClick={() => {
                      const title = selectedProject.title;
                      setSelectedProject(null);
                      onOpenDiscuss(title);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#1A3C2F] text-white rounded-full text-xs font-bold hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-4 h-4" /> Consult on Similar Project
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
