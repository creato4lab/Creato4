'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Calendar } from 'lucide-react';

interface Section {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  effectiveDate: string;
  sections: Section[];
  children: React.ReactNode;
}

export default function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  effectiveDate,
  sections,
  children,
}: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -60% 0%' }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-[80px] lg:pt-[104px]">

      {/* Hero Header */}
      <header className="bg-[#1A3C2F] text-[#FAF8F5] px-6 sm:px-10 lg:px-16 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #FAF8F5 0, #FAF8F5 1px, transparent 0, transparent 50%)`,
          backgroundSize: '24px 24px'
        }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#C4A35A] text-xs font-semibold uppercase tracking-widest mb-8 hover:opacity-80 transition-opacity group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Creato4 Lab
          </Link>
          <div className="inline-flex items-center gap-2 bg-[#C4A35A]/15 border border-[#C4A35A]/30 rounded-full px-3 py-1.5 text-[#C4A35A] text-xs font-mono tracking-widest uppercase mb-5">
            Legal Document
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FAF8F5] mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-sm text-[#FAF8F5]/60 max-w-2xl leading-relaxed mb-8">
            {subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[#FAF8F5]/10 text-xs text-[#FAF8F5]/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C4A35A]" />
              <span>Last Updated: <strong className="text-[#FAF8F5]/80">{lastUpdated}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C4A35A]" />
              <span>Effective: <strong className="text-[#FAF8F5]/80">{effectiveDate}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Governing Law: <strong className="text-[#FAF8F5]/80">Republic of India</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-16">
        <div className="flex gap-12 lg:gap-16">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-8">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#1A3C2F]/40 mb-4">Contents</p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-[#1A3C2F] text-[#FAF8F5] font-semibold'
                        : 'text-[#1A3C2F]/60 hover:text-[#1A3C2F] hover:bg-[#1A3C2F]/5'
                    }`}
                  >
                    <ChevronRight className={`w-3 h-3 shrink-0 transition-transform ${activeSection === section.id ? 'translate-x-0.5' : ''}`} />
                    {section.title}
                  </a>
                ))}
              </nav>
              <div className="mt-8 p-4 bg-[#1A3C2F]/5 rounded-xl border border-[#1A3C2F]/10">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#1A3C2F]/40 mb-2">Jurisdiction</p>
                <p className="text-xs text-[#1A3C2F]/70 leading-relaxed">
                  All disputes are subject to exclusive jurisdiction of courts in <strong>Ahmedabad, Gujarat, India</strong>.
                </p>
              </div>
            </div>
          </aside>
          <main className="flex-1 min-w-0 text-[#1A3C2F]">
            {children}
          </main>
        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t border-[#1A3C2F]/10 bg-[#1A3C2F]/[0.03] px-6 sm:px-10 lg:px-16 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#1A3C2F]/50">
          <p>© 2026 Creato4 Technologies. All rights reserved.</p>
          <div className="flex items-center gap-5 flex-wrap">
            <Link href="/privacy-policy" className="hover:text-[#1A3C2F] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#1A3C2F] transition-colors">Terms of Service</Link>
            <Link href="/eula" className="hover:text-[#1A3C2F] transition-colors">EULA</Link>
            <Link href="/refund-policy" className="hover:text-[#1A3C2F] transition-colors">Refund Policy</Link>
            <Link href="/shipping-policy" className="hover:text-[#1A3C2F] transition-colors">Shipping Policy</Link>
            <Link href="/intellectual-property" className="hover:text-[#1A3C2F] transition-colors">IP Rights</Link>
            <Link href="/cookie-policy" className="hover:text-[#1A3C2F] transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
