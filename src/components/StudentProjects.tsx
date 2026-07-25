import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { STUDENT_PROJECTS } from '../data';
import { StudentProject } from '../types';

interface StudentProjectsProps {
  onSelectProject: (project: StudentProject) => void;
}

export const StudentProjects: React.FC<StudentProjectsProps> = ({ onSelectProject }) => {
  const getDifficultyBadge = (difficulty: StudentProject['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Intermediate':
        return 'bg-[#C4A35A]/20 text-[#1A3C2F] border-[#C4A35A]/40';
      case 'Advanced':
      default:
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <section id="student-projects" className="py-20 lg:py-32 bg-[#FAF8F5] border-b border-[#E8E2D9] px-6 sm:px-10 lg:px-16 xl:px-20">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Header */}
        <div>
          <span className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#5C6B60] block mb-3">
            BUILD YOUR NEXT PROJECT
          </span>
          <h2 className="heading-h1 text-[#1A3C2F] font-extrabold tracking-tight">
            READY-TO-BUILD PROJECTS
          </h2>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {STUDENT_PROJECTS.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: 'easeOut' }}
              onClick={() => onSelectProject(project)}
              className="group bg-[#F5F0EA] rounded-2xl overflow-hidden border border-[#E8E2D9] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* Image & Difficulty Pill */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#E8E2D9]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-xs ${getDifficultyBadge(
                      project.difficulty
                    )}`}
                  >
                    {project.difficulty}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-[#FAF8F5]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#5C6B60] block mb-1">
                    {project.category} BLUEPRINT
                  </span>
                  <h3 className="text-base font-bold text-[#1A3C2F] mb-2 group-hover:text-[#234B3C] line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#5C6B60] line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
                  <span className="text-base font-extrabold text-[#1A3C2F]">
                    {project.price}
                  </span>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#1A3C2F] group-hover:text-[#C4A35A] transition-colors">
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
