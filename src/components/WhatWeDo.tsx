'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Boxes, Code2, Rocket, ArrowUpRight, Sparkles } from 'lucide-react';

export const WhatWeDo: React.FC = () => {
  const pillars = [
    {
      id: '01',
      title: 'PCB & Electronics',
      tagline: 'Custom Circuit Design & Schematics',
      desc: 'We engineer complete hardware schematics, multilayer PCB layouts, component routing, and production-ready GERBER manufacturing files.',
      icon: Cpu,
      badge: 'GERBER & SCHEMATICS',
      accent: 'from-[#1A3C2F] to-[#2D5A47]',
      color: '#1A3C2F',
    },
    {
      id: '02',
      title: '3D CAD & Enclosures',
      tagline: 'Industrial & Mechanical Fitting',
      desc: 'Precision 3D CAD modeling for custom device bodies, snap-fit enclosures, and ergonomic physical housings available in STL & STEP formats.',
      icon: Boxes,
      badge: '3D STL & STEP',
      accent: 'from-[#C4A35A] to-[#8C7132]',
      color: '#C4A35A',
    },
    {
      id: '03',
      title: 'Embedded Firmware',
      tagline: 'Microcontroller Code & IoT Logic',
      desc: 'Production C/C++ firmware written for ESP32, STM32, Arduino, and RP2040 microcontrollers with hardware locking and encryption capabilities.',
      icon: Code2,
      badge: 'ESP32 • STM32 • ARDUINO',
      accent: 'from-[#2C4E3F] to-[#1A3C2F]',
      color: '#2C4E3F',
    },
    {
      id: '04',
      title: 'Turnkey Assets & Store',
      tagline: 'Ready-to-Build Bundles & Commissions',
      desc: 'Instant access to fully tested digital engineering bundles (Code + GERBER + CAD) or commissioned custom product development from idea to prototype.',
      icon: Rocket,
      badge: 'FULL STACK BUNDLES',
      accent: 'from-[#3A332C] to-[#1A3C2F]',
      color: '#3A332C',
    },
  ];

  return (
    <section id="what-we-do" className="py-20 lg:py-32 bg-[#FAF8F5] border-b border-[#E8E2D9] px-6 sm:px-10 lg:px-16 xl:px-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C4A35A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1800px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <Sparkles className="w-4 h-4 text-[#C4A35A]" />
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#5C6B60]">
                WHAT CREATO4 LAB DOES
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A3C2F] tracking-tight leading-tight max-w-2xl"
            >
              Full-Stack Hardware & Product Engineering.
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-[#5C6B60] max-w-md leading-relaxed font-normal"
          >
            We bridge physical electronics and digital code — giving creators, students, and engineers ready-to-build hardware assets and custom development.
          </motion.p>
        </div>

        {/* 4 Interactive 3D Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
                className="group relative bg-[#F5F0EA] border border-[#E8E2D9] hover:border-[#1A3C2F]/40 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-2xl overflow-hidden cursor-pointer"
                style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              >
                {/* Subtle Card Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${pillar.accent} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-500`} />

                <div>
                  {/* Top Row: Number & Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono font-bold text-[#C4A35A] tracking-wider bg-[#1A3C2F]/5 px-3 py-1 rounded-full border border-[#1A3C2F]/10">
                      {pillar.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#5C6B60]">
                      {pillar.badge}
                    </span>
                  </div>

                  {/* 3D Icon Box */}
                  <div className="w-14 h-14 rounded-2xl bg-[#1A3C2F] text-[#FAF8F5] group-hover:bg-[#C4A35A] group-hover:text-[#1A3C2F] flex items-center justify-center mb-6 transition-all duration-300 shadow-md group-hover:scale-110">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-[#1A3C2F] mb-1 group-hover:text-[#C4A35A] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#C4A35A] mb-4">
                    {pillar.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-[#5C6B60] leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#1A3C2F]">
                  <span>Explore Discipline</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-[#C4A35A]" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
