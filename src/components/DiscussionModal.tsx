import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import { createConsultationTicket } from '@/actions/ticket';

interface DiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
}

export const DiscussionModal: React.FC<DiscussionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    setIsSubmitting(true);
    const res = await createConsultationTicket({
      name: formData.name,
      phone: formData.phone,
    });
    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
    } else {
      alert("Failed to submit request. Please try again.");
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    onClose();
    // small timeout to clear form after animation
    setTimeout(() => {
      setFormData({ name: '', phone: '' });
    }, 300);
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
          className="relative bg-[#FAF8F5] border border-[#E8E2D9] rounded-3xl max-w-[420px] w-full p-8 shadow-2xl overflow-y-auto my-auto max-h-[85vh] no-scrollbar overscroll-contain"
          data-lenis-prevent
          data-lenis-prevent-touch
          data-lenis-prevent-wheel
        >
          {/* Close button */}
          <button
            onClick={resetForm}
            className="absolute top-5 right-5 p-2 rounded-full text-[#5C6B60] hover:text-[#1A3C2F] hover:bg-[#E8E2D9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSubmitted ? (
            <div>
              {/* Header */}
              <div className="mb-8 text-center mt-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C4A35A] block mb-2">
                  FREE CONSULTATION
                </span>
                <h3 className="text-3xl font-extrabold text-[#1A3C2F] tracking-tight">
                  Let's Discuss
                </h3>
                <p className="text-xs text-[#5C6B60] mt-3 leading-relaxed px-4">
                  Drop your details below and our lead engineers will reach out to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#5C6B60]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-sm text-[#1A3C2F] placeholder-[#5C6B60]/80 focus:outline-none focus:border-[#1A3C2F] focus:ring-1 focus:ring-[#1A3C2F] transition-all"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-[#5C6B60]" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Mobile Number"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-sm text-[#1A3C2F] placeholder-[#5C6B60]/80 focus:outline-none focus:border-[#1A3C2F] focus:ring-1 focus:ring-[#1A3C2F] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#1A3C2F] text-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider hover:bg-[#234B3C] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Submitting... <Loader2 className="w-4 h-4 ml-1 animate-spin" /></>
                  ) : (
                    <>Request Callback <Send className="w-4 h-4 ml-1" /></>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* SUBMITTED CONFIRMATION STATE */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E6F3E6] border border-[#B3DAB3] text-[#1A3C2F] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-extrabold text-[#1A3C2F]">
                We'll Be In Touch!
              </h3>

              <p className="text-sm text-[#5C6B60] leading-relaxed">
                Thank you, <strong className="text-[#1A3C2F]">{formData.name}</strong>. We've received your request and will call you at <strong className="text-[#1A3C2F]">{formData.phone}</strong> shortly.
              </p>

              <button
                onClick={resetForm}
                className="mt-8 w-full py-4 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-[#1A3C2F] text-[11px] font-bold uppercase tracking-wider hover:bg-[#E8E2D9] transition-all"
              >
                Return to Site
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
