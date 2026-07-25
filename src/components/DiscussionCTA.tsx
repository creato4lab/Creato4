import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Clock, ShieldCheck, MessageSquareCode, Send, CheckCircle2 } from 'lucide-react';

interface DiscussionCTAProps {
  onOpenDiscuss?: () => void;
}

export const DiscussionCTA: React.FC<DiscussionCTAProps> = ({ onOpenDiscuss }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Physical Product / Hardware',
    message: '',
  });

  const projectTypes = [
    'Physical Product / Hardware',
    'Electronics & Custom PCB',
    'Embedded Systems / IoT',
    'Full-Stack Web / 3D Experience',
    'Student Engineering Project',
    'AI & Automation Solution',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-24 lg:py-32 bg-[#FAF8F5] border-t border-[#E8E2D9] px-6 sm:px-10 lg:px-16 xl:px-20 text-center">
      <div className="max-w-[800px] mx-auto">
        
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
          LET’S ARCHITECT &amp; ENGINEER IT TOGETHER.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base sm:text-lg text-[#5C6B60] leading-relaxed mb-6"
        >
          Whether you're developing physical hardware, embedded IoT devices, custom web platforms, or automation systems — submit your project inquiry below to connect with our engineering team.
        </motion.p>

        {/* Value Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-[#5C6B60] uppercase tracking-wider mb-10"
        >
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#C4A35A]" /> No Obligation
          </span>
          <span>·</span>
          <span>Direct Tech Lead Consultation</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#1A3C2F]" /> 24-Hour Response
          </span>
        </motion.div>

        {/* INLINE CONTACT FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[#F5F0EA] border border-[#E8E2D9] rounded-3xl p-6 sm:p-10 shadow-sm text-left relative overflow-hidden"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-[#E8E2D9] pb-4 mb-2">
                <h3 className="text-xl font-bold text-[#1A3C2F]">Contact Engineering Team</h3>
                <p className="text-xs text-[#5C6B60] mt-0.5">Fill out your project details to request a technical consultation.</p>
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full p-3.5 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none focus:border-[#1A3C2F] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full p-3.5 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none focus:border-[#1A3C2F] shadow-xs"
                  />
                </div>
              </div>

              {/* Phone & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-3.5 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none focus:border-[#1A3C2F] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-1.5">
                    Project Category
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none focus:border-[#1A3C2F] shadow-xs"
                  >
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-1.5">
                  Project Details / Vision *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your product idea, specs, or engineering requirements..."
                  className="w-full p-3.5 rounded-xl bg-white border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none focus:border-[#1A3C2F] shadow-xs"
                />
              </div>

              {/* NDA Protection Note */}
              <div className="p-3.5 rounded-xl bg-white/80 border border-[#E8E2D9] text-[11px] text-[#5C6B60] flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#C4A35A] shrink-0" />
                <span>Protected under Creato4 Lab NDA policies. Your intellectual property is 100% confidential.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-extrabold uppercase tracking-widest hover:bg-[#234B3C] transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Project Inquiry</span>
              </button>
            </form>
          ) : (
            /* SUBMITTED SUCCESS CARD */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h3 className="text-2xl font-extrabold text-[#1A3C2F]">
                Project Inquiry Sent!
              </h3>

              <p className="text-xs sm:text-sm text-[#5C6B60] max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[#1A3C2F]">{formData.name}</strong>. Our engineering leads have received your inquiry for <strong className="text-[#1A3C2F]">{formData.projectType}</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] max-w-sm mx-auto text-left text-xs space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-[#1A3C2F] font-semibold">
                  <span>✉️ Confirmation sent to:</span>
                  <span className="text-[#5C6B60] truncate">{formData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[#5C6B60]">
                  <span>🕒 Expected response: Within 24 Hours</span>
                </div>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-8 py-3 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C] cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};
