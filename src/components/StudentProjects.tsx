import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { STUDENT_PROJECTS } from '../data';
import { StudentProject } from '../types';
import { CheckoutButton } from './CheckoutButton';

export const StudentProjects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Hardware' | 'Software'>('Hardware');

  const tabs: Array<'Hardware' | 'Software'> = [
    'Hardware',
    'Software',
  ];

  const filteredProjects = STUDENT_PROJECTS.filter((p) => p.category === activeTab);

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

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-8 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-[0.75rem] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-[#1A3C2F] text-[#FAF8F5] border-[#1A3C2F] shadow-sm'
                    : 'bg-transparent text-[#5C6B60] border-[#E8E2D9] hover:border-[#1A3C2F] hover:text-[#1A3C2F]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid / Blank Category State */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1, ease: 'easeOut' }}
              >
                <div
                  className="group h-full bg-[#F5F0EA] rounded-2xl overflow-hidden border border-[#E8E2D9] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <Link href={`/shop/${project.id}`} className="block">
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
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-[#FAF8F5]">
                    <Link href={`/shop/${project.id}`} className="block flex-1">
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
                    </Link>

                    <div className="pt-4 border-t border-[#E8E2D9] flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-extrabold text-[#1A3C2F]">
                          {project.price}
                        </span>
                        <Link
                          href={`/shop/${project.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#1A3C2F] hover:text-[#C4A35A] transition-colors"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <CheckoutButton
                        productId={project.id}
                        licenseType="STUDENT"
                        productName={project.title}
                        variant="compact"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="py-20 text-center bg-[#F5F0EA] border border-[#E8E2D9] rounded-3xl mt-12 max-w-2xl mx-auto p-8 shadow-xs"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center mx-auto mb-4 text-2xl shadow-xs">
              📂
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C4A35A] block mb-1">
              CATEGORY BLANK
            </span>
            <h3 className="text-xl font-extrabold text-[#1A3C2F]">
              {activeTab} Category Currently Empty
            </h3>
            <p className="text-xs sm:text-sm text-[#5C6B60] max-w-md mx-auto mt-2 leading-relaxed">
              All projects have been removed from <strong className="text-[#1A3C2F]">{activeTab}</strong>. Select a category above to view status.
            </p>
          </motion.div>
        )}

        {/* Link Below */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[0.75rem] font-extrabold uppercase tracking-[0.2em] text-[#1A3C2F] hover:underline cursor-pointer"
          >
            <span>Explore All Student Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
