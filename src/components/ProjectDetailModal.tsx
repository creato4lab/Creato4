import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Cpu, ArrowUpRight, FileText, Layers, ShieldCheck, Tag } from 'lucide-react';
import { WorkProject, StudentProject } from '../types';

interface ProjectDetailModalProps {
  project: WorkProject | StudentProject | null;
  onClose: () => void;
  onOpenDiscuss: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenDiscuss,
}) => {
  if (!project) return null;

  const isWork = 'challenge' in project;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative bg-[#FAF8F5] border border-[#E8E2D9] rounded-3xl max-w-3xl w-full p-8 lg:p-10 shadow-2xl overflow-hidden my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-[#5C6B60] hover:text-[#1A3C2F] hover:bg-[#F5F0EA] transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header Image */}
          <div className="relative w-full h-64 lg:h-80 rounded-2xl overflow-hidden mb-8 border border-[#E8E2D9] bg-[#FAF8F5] flex items-center justify-center">
            {/* Blurry background image for filling space premiumly */}
            <img
              src={project.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-[8px] opacity-30 scale-110 pointer-events-none"
            />
            
            {/* Clean, contained front image (no cropping) */}
            <img
              src={project.image}
              alt={project.title}
              className="relative z-10 max-w-full max-h-full object-contain"
            />
            
            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 z-15 bg-gradient-to-t from-[#1A3C2F]/90 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 z-20 text-[#FAF8F5]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C4A35A] block mb-1">
                {isWork ? (project as WorkProject).category : `STUDENT BLUEPRINT · ${(project as StudentProject).category}`}
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold">{project.title}</h2>
            </div>
          </div>

          {/* Body Content */}
          {isWork ? (
            /* WORK CASE STUDY DETAILS */
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A3C2F] mb-2">
                  Project Overview
                </h3>
                <p className="text-sm text-[#5C6B60] leading-relaxed">
                  {(project as WorkProject).description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9]">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C4A35A]" /> Engineering Challenge
                  </h4>
                  <p className="text-xs text-[#5C6B60] leading-relaxed">
                    {(project as WorkProject).challenge}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-2 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#15803D]" /> Lab Solution
                  </h4>
                  <p className="text-xs text-[#5C6B60] leading-relaxed">
                    {(project as WorkProject).solution}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A3C2F] mb-3">
                  Technologies & Hardware Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(project as WorkProject).technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-[#F5F0EA] border border-[#E8E2D9] text-xs font-semibold text-[#1A3C2F]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A3C2F] mb-3">
                  Verified Outcomes
                </h3>
                <ul className="space-y-2">
                  {(project as WorkProject).outcomes.map((out, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-[#5C6B60]">
                      <CheckCircle className="w-4 h-4 text-[#15803D] shrink-0" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-[#E8E2D9] flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-[#5C6B60]">
                  Need a similar custom solution for your enterprise or product line?
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {(project as WorkProject).documentUrl && (
                    <a
                      href={(project as WorkProject).documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1A3C2F] text-[#1A3C2F] text-xs font-bold uppercase tracking-wider hover:bg-[#F5F0EA] transition-all"
                    >
                      <span>View PDF Report</span>
                      <FileText className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDiscuss();
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C]"
                  >
                    <span>Discuss Similar Project</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STUDENT PROJECT BLUEPRINT DETAILS */
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A3C2F] mb-2">
                  Kit Description
                </h3>
                <p className="text-sm text-[#5C6B60] leading-relaxed">
                  {(project as StudentProject).description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A3C2F] mb-3">
                  What's Included in Blueprint
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(project as StudentProject).includes.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] flex items-center gap-2 text-xs font-semibold text-[#1A3C2F]"
                    >
                      <FileText className="w-4 h-4 text-[#C4A35A] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A3C2F] mb-3">
                  Technical Specifications
                </h3>
                <div className="p-4 rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9] space-y-2">
                  {Object.entries((project as StudentProject).specifications).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-[#5C6B60] font-medium">{key}:</span>
                      <span className="text-[#1A3C2F] font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8E2D9] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5C6B60] block">
                    Kit Reference Cost
                  </span>
                  <span className="text-2xl font-extrabold text-[#1A3C2F]">
                    {(project as StudentProject).price}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenDiscuss();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C]"
                >
                  <span>Request Engineering Package</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
