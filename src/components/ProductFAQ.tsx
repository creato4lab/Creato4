"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  faqs: FAQ[];
}

export function ProductFAQ({ faqs }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`border rounded-2xl overflow-hidden transition-colors ${
              isOpen ? "border-[#1A3C2F]/30 bg-[#1A3C2F]/[0.03]" : "border-[#1A3C2F]/10 bg-white"
            }`}
          >
            <button
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-[#C4A35A] shrink-0 mt-0.5" />
                <span className="text-sm font-bold text-[#1A3C2F] leading-snug">{faq.question}</span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0"
              >
                <ChevronDown className="w-4 h-4 text-[#1A3C2F]/50" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pl-12 text-sm text-[#1A3C2F]/70 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
