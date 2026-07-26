"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Preloader } from '@/components/Preloader';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { QuickEntry } from '@/components/QuickEntry';
import { TrustCredibility } from '@/components/TrustCredibility';
import { SelectedWork } from '@/components/SelectedWork';
import { ServicesOverview } from '@/components/ServicesOverview';
import { Web3DCta } from '@/components/Web3DCta';
import { StudentProjects } from '@/components/StudentProjects';
import { HowWeDeliver } from '@/components/HowWeDeliver';
import { TeamSection } from '@/components/TeamSection';
import { DiscussionCTA } from '@/components/DiscussionCTA';
import { Footer } from '@/components/Footer';

import { DiscussionModal } from '@/components/DiscussionModal';
import { SearchAccountCartModals } from '@/components/SearchAccountCartModals';
import { CustomCursor } from '@/components/CustomCursor';

import { ServiceItem } from '@/types';

export default function HomeClient() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Smooth scroll
  useEffect(() => {
    import('lenis')
      .then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
          orientation: 'vertical', 
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        });

        (window as any).lenis = lenis;

        function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
          delete (window as any).lenis;
          lenis.destroy();
        };
      })
      .catch((err) => {
        console.warn('Lenis smooth scroll failed to load:', err);
      });
  }, []);

  // Modals state
  const [discussOpen, setDiscussOpen] = useState(false);
  const [discussType, setDiscussType] = useState('Physical Product / Hardware');



  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const isAnyModalOpen = Boolean(discussOpen || searchOpen || accountOpen || cartOpen);


  useEffect(() => {
    const lenisInstance = (window as any).lenis;
    if (isAnyModalOpen) {
      if (lenisInstance) lenisInstance.stop();
      document.body.style.overflow = 'hidden';
    } else {
      if (lenisInstance) lenisInstance.start();
      document.body.style.overflow = '';
    }
  }, [isAnyModalOpen]);

  // Saved student project blueprints
  const [cartItems, setCartItems] = useState<string[]>(['iot-weather-station', 'robotic-arm-6dof']);

  const handleOpenDiscuss = (type?: string) => {
    if (type) setDiscussType(type);
    setDiscussOpen(true);
  };

  const handleQuickEntryOption = (option: 'idea' | 'student' | 'digital') => {
    if (option === 'idea') {
      handleOpenDiscuss('Physical Product / Hardware');
    } else if (option === 'student') {
      const el = document.getElementById('student-projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (option === 'digital') {
      handleOpenDiscuss('Full-Stack Web / 3D Experience');
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item !== id));
  };

  // Footer parallax height measurement
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setFooterHeight(entries[0].contentRect.height);
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A3C2F] selection:bg-[#1A3C2F] selection:text-[#FAF8F5] font-sans relative">
      <CustomCursor />
      
      {/* 1. Preloader */}
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      {/* Main Content (fades in smoothly) */}
      <div className={preloaderDone ? 'opacity-100 transition-opacity duration-500' : 'opacity-0'}>
        {/* 2. Fixed Navigation */}
        <Navbar
          onOpenDiscuss={() => handleOpenDiscuss('General Consultation')}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenAccount={() => setAccountOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          cartCount={cartItems.length}
        />

        {/* Main Content Sections */}
        <main className="relative z-10 bg-[#FAF8F5] shadow-[0_20px_60px_rgba(26,60,47,0.1)]" style={{ marginBottom: footerHeight }}>
          {/* 3. Hero ("FIRST SCREEN") */}
          <Hero onOpenDiscuss={() => handleOpenDiscuss('Product & Technology Vision')} />

          {/* 4. Quick Entry ("WHAT ARE YOU LOOKING TO BUILD?") */}
          <section id="quick-entry" aria-label="What are you looking to build?">
            <QuickEntry onSelectOption={handleQuickEntryOption} />
          </section>

          {/* 5. Trust & Credibility */}
          <section id="trust" aria-label="Achievements and credentials">
            <TrustCredibility />
          </section>

          {/* 6. Selected Engineering Work */}
          <section id="selected-work" aria-label="Selected engineering projects">
            <SelectedWork />
          </section>

          {/* 7. Services Overview */}
          <section id="services" aria-label="Engineering services">
            <ServicesOverview
              onSelectService={(service: ServiceItem) => handleOpenDiscuss(service.title)}
            />
          </section>

          {/* 8. 3D Website Service CTA */}
          <Web3DCta onOpenDiscuss={() => handleOpenDiscuss('Interactive 3D Web Experience')} />

          {/* 9. Featured Student Projects */}
          <section id="student-projects" aria-label="Student engineering project blueprints">
            <StudentProjects />
          </section>

          {/* 10. How We Deliver (8-Step Process) */}
          <section id="how-we-deliver" aria-label="Our 8-step development process">
            <HowWeDeliver />
          </section>

          {/* 11. Team */}
          <section id="team" aria-label="Our engineering team">
            <TeamSection />
          </section>

          {/* 12. Free Initial Discussion CTA */}
          <DiscussionCTA onOpenDiscuss={() => handleOpenDiscuss('Initial Project Discussion')} />
        </main>

        {/* 13. Footer */}
        <div ref={footerRef} className="fixed bottom-0 left-0 right-0 z-0">
          <Footer onOpenDiscuss={() => handleOpenDiscuss('Footer Inquiry')} />
        </div>
      </div>

      {/* Interactive Modals & Drawers */}
      <DiscussionModal
        isOpen={discussOpen}
        onClose={() => setDiscussOpen(false)}
        initialType={discussType}
      />



      <SearchAccountCartModals
        searchOpen={searchOpen}
        accountOpen={accountOpen}
        cartOpen={cartOpen}
        onCloseSearch={() => setSearchOpen(false)}
        onCloseAccount={() => setAccountOpen(false)}
        onCloseCart={() => setCartOpen(false)}
        onOpenDiscuss={() => handleOpenDiscuss('Search/Account Portal Inquiry')}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
      />
    </div>
  );
}

