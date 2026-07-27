"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { X, HelpCircle, Send, Loader2, MessageSquare, CheckCircle } from "lucide-react";
import { createSupportTicket } from "@/actions/ticket";

interface SupportTicketModalProps {
  products: { id: string; title: string }[];
  onClose: () => void;
  onSuccess: () => void;
}

export function SupportTicketModal({ products, onClose, onSuccess }: SupportTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setErrorMsg("Please fill in the subject and message fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const fullSubject = selectedProduct
      ? `[${selectedProduct}] ${subject.trim()}`
      : subject.trim();

    const result = await createSupportTicket({
      subject: fullSubject,
      message: message.trim(),
      phone: phone.trim() || undefined,
    });

    if (result.success) {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    } else {
      setIsSubmitting(false);
      setErrorMsg(result.error || "Failed to create support ticket.");
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#1A3C2F]/10"
      >
        {/* Header */}
        <div className="bg-[#1A3C2F] p-6 text-white relative">
          <div className="flex items-center gap-2.5 mb-1">
            <MessageSquare className="w-5 h-5 text-[#C4A35A]" />
            <h2 className="font-black text-lg text-white">Create Support Ticket</h2>
          </div>
          <p className="text-xs text-white/70">
            Submit a technical inquiry or support request to Creato4 engineering team.
          </p>
          <button onClick={onClose} className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Related Product Dropdown */}
          {products.length > 0 && (
            <div>
              <label className="text-xs font-bold text-[#1A3C2F] uppercase tracking-wider block mb-1">
                Related Product (optional)
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full border border-[#1A3C2F]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40 bg-white"
              >
                <option value="">General Support / No Product Selected</option>
                {products.map((p) => (
                  <option key={p.id} value={p.title}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="text-xs font-bold text-[#1A3C2F] uppercase tracking-wider block mb-1">
              Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder='e.g. "Firmware compilation error on ESP32"'
              className="w-full border border-[#1A3C2F]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-bold text-[#1A3C2F] uppercase tracking-wider block mb-1">
              Phone Number (optional for callback)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full border border-[#1A3C2F]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-xs font-bold text-[#1A3C2F] uppercase tracking-wider block mb-1">
              Description / Message
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your technical issue, error logs, or question in detail..."
              className="w-full border border-[#1A3C2F]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#1A3C2F]/15 rounded-2xl text-sm font-semibold text-[#1A3C2F]/70 hover:bg-[#1A3C2F]/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] flex items-center justify-center gap-2 py-3 bg-[#1A3C2F] text-white rounded-2xl text-sm font-bold hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
