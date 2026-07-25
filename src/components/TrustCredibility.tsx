import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Trophy, Medal, BookOpen, CheckCircle, Info, X } from 'lucide-react';
import { TRUST_ACHIEVEMENTS } from '../data';

export const TrustCredibility: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<typeof TRUST_ACHIEVEMENTS[0] | null>(null);

  const getBadgeIcon = (id: string) => {
    switch (id) {
      case '1':
        return <Award className="w-12 h-12 text-[#C4A35A]" />;
      case '2':
        return <Trophy className="w-12 h-12 text-[#1A3C2F]" />;
      case '3':
        return <Medal className="w-12 h-12 text-[#C4A35A]" />;
      case '4':
        return <BookOpen className="w-12 h-12 text-[#1A3C2F]" />;
      case '5':
      default:
        return <CheckCircle className="w-12 h-12 text-[#1A3C2F]" />;
    }
  };

  return (
    <section id="trust" className="py-20 bg-[#EDE8E0] border-y border-[#DDD8CF] px-6 sm:px-10 lg:px-16 xl:px-20">
      <div className="max-w-[1800px] mx-auto text-center">
        
        {/* Header Tag */}
        <span className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#5C6B60] block mb-3">
          ENGINEERING CREDIBILITY & AWARDS
        </span>
        <h2 className="text-xl font-semibold text-[#1A3C2F] mb-12">
          FACT-CHECKED LABORATORY MILESTONES
        </h2>

        {/* 5 Badges Container */}
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {TRUST_ACHIEVEMENTS.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
              onClick={() => setSelectedBadge(item)}
              className="group flex flex-col items-center text-center max-w-[200px] p-4 rounded-2xl hover:bg-[#F5F0EA] transition-all duration-300 cursor-pointer"
            >
              <div className="p-3 rounded-2xl bg-[#F5F0EA] group-hover:bg-[#FAF8F5] border border-[#E8E2D9] transition-transform duration-300 group-hover:scale-110 mb-4 shadow-xs">
                {getBadgeIcon(item.id)}
              </div>

              <span className="text-[0.75rem] uppercase font-extrabold tracking-[0.15em] text-[#1A3C2F] group-hover:text-[#C4A35A] transition-colors leading-tight">
                {item.label}
              </span>

              <span className="text-[10px] text-[#5C6B60] mt-1 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info className="w-3 h-3" /> Fact Details
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detail Popover Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-6 right-6 text-[#5C6B60] hover:text-[#1A3C2F] p-1 rounded-full hover:bg-[#F5F0EA]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9]">
                  {getBadgeIcon(selectedBadge.id)}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4A35A] block">
                    VERIFIED ACHIEVEMENT
                  </span>
                  <h3 className="text-lg font-bold text-[#1A3C2F]">{selectedBadge.label}</h3>
                </div>
              </div>

              <p className="text-sm text-[#5C6B60] leading-relaxed mb-6">
                {selectedBadge.detail}
              </p>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#234B3C]"
              >
                Close Verification
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
