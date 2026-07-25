import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { DiscussionFormData } from '../types';

interface DiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
}

export const DiscussionModal: React.FC<DiscussionModalProps> = ({
  isOpen,
  onClose,
  initialType = 'Physical Product / Hardware',
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<DiscussionFormData>({
    projectType: initialType,
    description: '',
    budgetRange: '$5,000 - $15,000',
    timeline: 'Within 1 - 3 Months',
    name: '',
    email: '',
    phone: '',
    companyOrCollege: '',
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
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setStep(1);
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-scrollbar overscroll-contain"
        data-lenis-prevent
        data-lenis-prevent-touch
        data-lenis-prevent-wheel
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative bg-[#FAF8F5] border border-[#E8E2D9] rounded-3xl max-w-2xl w-full p-6 sm:p-8 lg:p-10 shadow-2xl overflow-y-auto my-auto max-h-[85vh] no-scrollbar overscroll-contain"
          data-lenis-prevent
          data-lenis-prevent-touch
          data-lenis-prevent-wheel
        >
          {/* Close button */}
          <button
            onClick={resetForm}
            className="absolute top-6 right-6 p-2 rounded-full text-[#5C6B60] hover:text-[#1A3C2F] hover:bg-[#F5F0EA] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {!isSubmitted ? (
            <div>
              {/* Header */}
              <div className="mb-8 pr-8">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C4A35A] block mb-1">
                  20-MINUTE FREE TECHNICAL CONSULTATION
                </span>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-[#1A3C2F] tracking-tight">
                  Discuss Your Project
                </h3>
                <p className="text-xs text-[#5C6B60] mt-1">
                  No commitment · Initial architecture discussion with lead engineers
                </p>
              </div>

              {/* Steps Progress */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E2D9] text-xs font-bold uppercase tracking-wider text-[#5C6B60]">
                <span className={step === 1 ? 'text-[#1A3C2F] underline underline-offset-4' : ''}>
                  1. Project Scope
                </span>
                <span>→</span>
                <span className={step === 2 ? 'text-[#1A3C2F] underline underline-offset-4' : ''}>
                  2. Requirements
                </span>
                <span>→</span>
                <span className={step === 3 ? 'text-[#1A3C2F] underline underline-offset-4' : ''}>
                  3. Contact & Schedule
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                {/* STEP 1: PROJECT TYPE */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-3">
                        What category fits your idea best?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {projectTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, projectType: type })}
                            className={`p-3.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                              formData.projectType === type
                                ? 'bg-[#1A3C2F] text-[#FAF8F5] border-[#1A3C2F] shadow-sm'
                                : 'bg-[#F5F0EA] text-[#5C6B60] border-[#E8E2D9] hover:border-[#1A3C2F] hover:text-[#1A3C2F]'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C]"
                      >
                        Next: Project Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: DETAILS */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-2">
                        Describe your product vision or problem
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="E.g., We need an autonomous IoT sensor unit with solar charging and cloud dashboard..."
                        className="w-full p-4 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none focus:border-[#1A3C2F]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-2">
                          Budget Target
                        </label>
                        <select
                          value={formData.budgetRange}
                          onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                          className="w-full p-3 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none focus:border-[#1A3C2F]"
                        >
                          <option>$1,000 - $5,000 / Student Tier</option>
                          <option>$5,000 - $15,000 / MVP Prototype</option>
                          <option>$15,000 - $50,000 / Full Production</option>
                          <option>$50,000+ / Enterprise System</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-2">
                          Timeline Goal
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full p-3 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none focus:border-[#1A3C2F]"
                        >
                          <option>Urgent (&lt; 1 Month)</option>
                          <option>Within 1 - 3 Months</option>
                          <option>3 - 6 Months</option>
                          <option>Flexible / Exploratory</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 rounded-full border border-[#E8E2D9] text-xs font-bold uppercase text-[#5C6B60]"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C]"
                      >
                        Next: Contact Info <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: CONTACT & SUBMIT */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full p-3 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full p-3 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-1">
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full p-3 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C2F] mb-1">
                          Company / Institution
                        </label>
                        <input
                          type="text"
                          value={formData.companyOrCollege}
                          onChange={(e) => setFormData({ ...formData, companyOrCollege: e.target.value })}
                          placeholder="Acme Tech / University"
                          className="w-full p-3 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F]"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-[11px] text-[#5C6B60] flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#C4A35A] shrink-0" />
                      <span>
                        Your information is strictly protected under Creato4 Lab NDA policies. We never share client concepts.
                      </span>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-5 py-2.5 rounded-full border border-[#E8E2D9] text-xs font-bold uppercase text-[#5C6B60]"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C] shadow-lg"
                      >
                        <Send className="w-4 h-4" /> Book Consultation Slot
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          ) : (
            /* SUBMITTED CONFIRMATION STATE */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-extrabold text-[#1A3C2F]">
                Consultation Confirmed!
              </h3>

              <p className="text-sm text-[#5C6B60] max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[#1A3C2F]">{formData.name}</strong>. Our engineering leads have received your scope for <strong className="text-[#1A3C2F]">{formData.projectType}</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9] max-w-sm mx-auto text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#1A3C2F] font-semibold">
                  <Calendar className="w-4 h-4 text-[#C4A35A]" /> Confirmation sent to: {formData.email}
                </div>
                <div className="flex items-center gap-2 text-[#5C6B60]">
                  <Clock className="w-4 h-4 text-[#1A3C2F]" /> Slot duration: 20 Minutes (Free Call)
                </div>
              </div>

              <button
                onClick={resetForm}
                className="mt-6 px-8 py-3 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C]"
              >
                Return to Lab Site
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
