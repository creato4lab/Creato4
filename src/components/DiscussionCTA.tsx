import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Clock, ShieldCheck, MessageSquareCode } from 'lucide-react';

interface DiscussionCTAProps {
  onOpenDiscuss: () => void;
}

export const DiscussionCTA: React.FC<DiscussionCTAProps> = ({ onOpenDiscuss }) => {
  return (
    <section className="py-24 lg:py-32 bg-[#FAF8F5] border-t border-[#E8E2D9] px-6 lg:px-12 text-center">
      <div className="max-w-[700px] mx-auto">
        
        {/* Label Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-16 h-16 rounded-2xl bg-[#1A3C2F]/10 border border-[#1A3C2F]/20 flex items-center justify-center mx-auto mb-8 shadow-xs"
        >
          <MessageSquareCode className="w-8 h-8 text-[#1A3C2F]" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="heading-h1 font-extrabold text-[#1A3C2F] tracking-tight leading-tight mb-6"
        >
          HAVE A PRODUCT CONCEPT? <br />
          LET’S ARCHITECT & ENGINEER IT TOGETHER.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base sm:text-lg text-[#5C6B60] leading-relaxed mb-6"
        >
          Whether you're developing physical hardware, embedded IoT devices, custom web platforms, or automation systems — schedule a technical strategy call with our engineering leads to evaluate feasibility and roadmap your project.
        </motion.p>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-center gap-3 text-xs font-semibold text-[#5C6B60] uppercase tracking-wider mb-10"
        >
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#C4A35A]" /> No Obligation
          </span>
          <span>·</span>
          <span>Direct Tech Lead Consultation</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#1A3C2F]" /> 20-Min Strategy Call
          </span>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={onOpenDiscuss}
          className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-base font-semibold tracking-wide hover:bg-[#234B3C] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
        >
          <span>Schedule Free Tech Call</span>
          <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
        </motion.button>

      </div>
    </section>
  );
};
