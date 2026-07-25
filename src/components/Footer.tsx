import React from 'react';
import { Linkedin, Instagram, Twitter, Github, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Creato4LabLogoMark } from './LogoMark';

interface FooterProps {
  onOpenDiscuss: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDiscuss }) => {
  return (
    <footer className="bg-[#1A3C2F] text-[#FAF8F5] pt-20 pb-12 border-t border-[#234B3C] px-6 sm:px-10 lg:px-16 xl:px-20">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Top Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16">
          
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <a href="#" className="inline-flex items-center gap-3 text-2xl font-extrabold tracking-tight text-[#FAF8F5] mb-2">
                <Creato4LabLogoMark size={36} />
                <span>CREATO4</span>
              </a>
              <div className="text-xs uppercase font-mono tracking-[0.2em] text-[#C4A35A] mb-6">
                Design · Engineer · Build
              </div>
              <p className="text-xs text-[#FAF8F5]/70 max-w-sm leading-relaxed mb-8">
                A multidisciplinary product & technology lab transforming ideas into working physical hardware,
                embedded systems, custom software, and 3D digital experiences.
              </p>
            </div>

            <button
              onClick={onOpenDiscuss}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAF8F5] text-[#1A3C2F] text-xs font-bold uppercase tracking-wider hover:bg-[#FAF8F5]/90 transition-all w-fit"
            >
              <span>Schedule Tech Consultation</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Column 2: 4 Navigation Columns (6 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
            
            {/* WORK */}
            <div>
              <h4 className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#FAF8F5]/50 mb-4">
                WORK
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#work" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Featured Work
                  </a>
                </li>
                <li>
                  <a href="#work" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    All Projects
                  </a>
                </li>
                <li>
                  <a href="#work" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>

            {/* SERVICES */}
            <div>
              <h4 className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#FAF8F5]/50 mb-4">
                SERVICES
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#services" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Product Eng.
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    3D CAD & DFM
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Electronics & PCB
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Embedded IoT
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Software & AI
                  </a>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#FAF8F5]/50 mb-4">
                COMPANY
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#process" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Our Process
                  </a>
                </li>
                <li>
                  <a href="#team" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    About Lab
                  </a>
                </li>
                <li>
                  <a href="#team" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Engineering Team
                  </a>
                </li>
                <li>
                  <a href="#trust" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Milestones
                  </a>
                </li>
              </ul>
            </div>

            {/* STUDENTS */}
            <div>
              <h4 className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#FAF8F5]/50 mb-4">
                STUDENTS
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#student-projects" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Browse Kits
                  </a>
                </li>
                <li>
                  <a href="#student-projects" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Arduino & ESP32
                  </a>
                </li>
                <li>
                  <a href="#student-projects" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:translate-x-1 inline-block transition-all">
                    Robotics Blueprints
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Column 3: Contact Info & Socials (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#FAF8F5]/50 mb-4">
                LAB CONTACT
              </h4>
              <div className="space-y-3 text-xs text-[#FAF8F5]/80">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C4A35A]" />
                  <a href="mailto:contact@creato4.com" className="hover:text-[#FAF8F5]">
                    contact@creato4.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C4A35A]" />
                  <a href="tel:+18005550199" className="hover:text-[#FAF8F5]">
                    +1 (800) 555-0199
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C4A35A] shrink-0 mt-0.5" />
                  <span>Creato4 Product Lab, Innovation Corridor</span>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div>
              <h4 className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#FAF8F5]/50 mb-3">
                CONNECT
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 rounded-full bg-[#FAF8F5]/10 hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-full bg-[#FAF8F5]/10 hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter/X"
                  className="p-2 rounded-full bg-[#FAF8F5]/10 hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="p-2 rounded-full bg-[#FAF8F5]/10 hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Giant Footer Typography */}
        <div className="w-full mt-16 mb-8 flex justify-center items-center pointer-events-none select-none">
          <h1 className="text-[clamp(4rem,14vw,18rem)] font-black tracking-[-0.04em] text-[#FAF8F5] opacity-[0.03] leading-[0.8] w-full text-center overflow-hidden">
            CREATO4
          </h1>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-[#FAF8F5]/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-[0.75rem] text-[#FAF8F5]/50 gap-4 relative z-10">
          <p>© 2026 Creato4. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#FAF8F5]">Privacy Policy</a>
            <a href="#" className="hover:text-[#FAF8F5]">Terms of Service</a>
            <a href="#" className="hover:text-[#FAF8F5]">Security Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
