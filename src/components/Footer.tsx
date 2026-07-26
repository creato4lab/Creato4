import React from 'react';
import Link from 'next/link';
import { Linkedin, Instagram, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Creato4LabLogoMark } from './LogoMark';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';

interface FooterProps {
  onOpenDiscuss: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDiscuss }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const textRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  return (
    <footer onMouseMove={handleMouseMove} className="relative bg-[#1A3C2F] text-[#FAF8F5] pt-20 pb-12 border-t border-[#234B3C] px-6 sm:px-10 lg:px-16 xl:px-20 overflow-hidden">
      <div className="w-full max-w-[1700px] mx-auto relative z-10">
        
        {/* Top Row Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-16 border-b border-[#FAF8F5]/10">
          
          {/* Column 1: Brand & Bio Card (4 cols) */}
          <div className="lg:col-span-4 bg-[#FAF8F5]/[0.04] p-6 sm:p-7 rounded-2xl border border-[#FAF8F5]/10 flex flex-col justify-between space-y-6">
            <div>
              <a href="#" className="inline-flex items-center gap-3 text-2xl font-extrabold tracking-tight text-[#FAF8F5] mb-2 group">
                <Creato4LabLogoMark size={36} />
                <span className="group-hover:text-[#C4A35A] transition-colors">CREATO4</span>
              </a>
              <div className="text-xs uppercase font-mono tracking-[0.2em] text-[#C4A35A] mb-4">
                Design · Engineer · Build
              </div>
              <p className="text-xs text-[#FAF8F5]/70 leading-relaxed mb-4">
                A multidisciplinary product & technology lab transforming ideas into working physical hardware,
                embedded systems, custom software, and 3D digital experiences.
              </p>
            </div>

            <button
              onClick={onOpenDiscuss}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF8F5] text-[#1A3C2F] text-xs font-bold uppercase tracking-wider hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-all w-fit shadow-md"
            >
              <span>Schedule Tech Consultation</span>
              <div className="relative overflow-hidden w-4 h-4">
                <ArrowUpRight className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:translate-x-full group-hover:-translate-y-full" />
                <ArrowUpRight className="absolute inset-0 w-full h-full -translate-x-full translate-y-full transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>
            </button>
          </div>

          {/* Column 2: 4 Navigation Columns Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF8F5]/[0.04] p-6 sm:p-7 rounded-2xl border border-[#FAF8F5]/10 grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8">
            
            {/* WORK */}
            <div>
              <h4 className="text-[0.7rem] uppercase font-bold tracking-[0.2em] text-[#C4A35A] mb-4">
                WORK
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#work" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Featured Work
                  </a>
                </li>
                <li>
                  <a href="#work" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    All Projects
                  </a>
                </li>
                <li>
                  <a href="#work" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>

            {/* SERVICES */}
            <div>
              <h4 className="text-[0.7rem] uppercase font-bold tracking-[0.2em] text-[#C4A35A] mb-4">
                SERVICES
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#services" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Product Eng.
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    3D CAD & DFM
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Electronics & PCB
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Embedded IoT
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Software & AI
                  </a>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-[0.7rem] uppercase font-bold tracking-[0.2em] text-[#C4A35A] mb-4">
                COMPANY
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#process" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Our Process
                  </a>
                </li>
                <li>
                  <a href="#team" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    About Lab
                  </a>
                </li>
                <li>
                  <a href="#team" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Engineering Team
                  </a>
                </li>
                <li>
                  <a href="#trust" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Milestones
                  </a>
                </li>
              </ul>
            </div>

            {/* STUDENTS */}
            <div>
              <h4 className="text-[0.7rem] uppercase font-bold tracking-[0.2em] text-[#C4A35A] mb-4">
                STUDENTS
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#student-projects" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Browse Kits
                  </a>
                </li>
                <li>
                  <a href="#student-projects" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Arduino & ESP32
                  </a>
                </li>
                <li>
                  <a href="#student-projects" className="text-[#FAF8F5]/75 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Robotics Blueprints
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Column 3: Glassmorphic Contact & Socials Box (3 cols) */}
          <div className="lg:col-span-3 bg-[#FAF8F5]/[0.04] p-6 sm:p-7 rounded-2xl border border-[#FAF8F5]/10 flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-[0.7rem] uppercase font-bold tracking-[0.2em] text-[#C4A35A] mb-4">
                LAB CONTACT
              </h4>
              <div className="space-y-3 text-xs text-[#FAF8F5]/80">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#FAF8F5]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-[#C4A35A]" />
                  </div>
                  <a href="mailto:creato4lab@gmail.com" className="hover:text-[#C4A35A] transition-colors truncate">
                    creato4lab@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#FAF8F5]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-[#C4A35A]" />
                  </div>
                  <a href="tel:+919909089344" className="hover:text-[#C4A35A] transition-colors">
                    +91 99090 89344
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#FAF8F5]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#C4A35A]" />
                  </div>
                  <span className="text-[#FAF8F5]/70">
                    Gujarat, India
                  </span>
                </div>
              </div>
            </div>

            {/* Social Connect Buttons */}
            <div>
              <h4 className="text-[0.7rem] uppercase font-bold tracking-[0.2em] text-[#C4A35A] mb-3">
                CONNECT
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/creato4-lab/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF8F5]/10 hover:bg-[#C4A35A] hover:text-[#1A3C2F] text-xs font-semibold transition-all"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://www.instagram.com/creato4.lab?igsh=MWh4bGZybXBxZ3Rj&utm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF8F5]/10 hover:bg-[#C4A35A] hover:text-[#1A3C2F] text-xs font-semibold transition-all"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Giant Footer Typography with Mouse Spotlight Glow */}
        <div ref={textRef} className="w-full mt-12 mb-6 flex justify-center items-center pointer-events-none select-none relative">
          
          {/* Base faint text */}
          <h1 className="text-[clamp(4rem,14vw,16rem)] font-black tracking-[-0.04em] text-[#FAF8F5] opacity-[0.03] leading-[0.8] w-full text-center overflow-hidden">
            CREATO4
          </h1>
          
          {/* Spotlight glow text */}
          <motion.h1 
            className="absolute inset-0 text-[clamp(4rem,14vw,16rem)] font-black tracking-[-0.04em] text-[#C4A35A] leading-[0.8] w-full text-center overflow-hidden"
            style={{
              WebkitMaskImage: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
              maskImage: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`
            }}
          >
            CREATO4
          </motion.h1>

        </div>

        {/* Bottom Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[0.75rem] text-[#FAF8F5]/50 gap-4 relative z-10">
          <p>© 2026 Creato4. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <Link href="/privacy-policy" className="hover:text-[#FAF8F5] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#FAF8F5] transition-colors">Terms of Service</Link>
            <Link href="/eula" className="hover:text-[#FAF8F5] transition-colors">EULA</Link>
            <Link href="/refund-policy" className="hover:text-[#FAF8F5] transition-colors">Refund Policy</Link>
            <Link href="/shipping-policy" className="hover:text-[#FAF8F5] transition-colors">Shipping Policy</Link>
            <Link href="/intellectual-property" className="hover:text-[#FAF8F5] transition-colors">IP Rights</Link>
            <Link href="/cookie-policy" className="hover:text-[#FAF8F5] transition-colors">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
