import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickEntry } from './components/QuickEntry';
import { TrustCredibility } from './components/TrustCredibility';
import { SelectedWork } from './components/SelectedWork';
import { ServicesOverview } from './components/ServicesOverview';
import { Web3DCta } from './components/Web3DCta';
import { StudentProjects } from './components/StudentProjects';
import { HowWeDeliver } from './components/HowWeDeliver';
import { TeamSection } from './components/TeamSection';
import { DiscussionCTA } from './components/DiscussionCTA';
import { Footer } from './components/Footer';

import { DiscussionModal } from './components/DiscussionModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { SearchAccountCartModals } from './components/SearchAccountCartModals';

import { WorkProject, StudentProject, ServiceItem } from './types';

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Smooth scroll
  useEffect(() => {
    // Dynamically import Lenis to avoid any SSR issues (if next.js, but here it's Vite so it's fine either way, just standard import is ok, but we use dynamic for safety in case of build issues or just standard require)
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        orientation: 'vertical', 
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      })

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)

      return () => {
        lenis.destroy()
      }
    })
  }, []);

  // Modals state
  const [discussOpen, setDiscussOpen] = useState(false);
  const [discussType, setDiscussType] = useState('Physical Product / Hardware');

  const [selectedProject, setSelectedProject] = useState<WorkProject | StudentProject | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A3C2F] selection:bg-[#1A3C2F] selection:text-[#FAF8F5] font-sans relative">
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
        <main>
          {/* 3. Hero ("FIRST SCREEN") */}
          <Hero onOpenDiscuss={() => handleOpenDiscuss('Product & Technology Vision')} />

          {/* 4. Quick Entry ("WHAT ARE YOU LOOKING TO BUILD?") */}
          <QuickEntry onSelectOption={handleQuickEntryOption} />

          {/* 5. Trust & Credibility */}
          <TrustCredibility />

          {/* 6. Selected Engineering Work */}
          <SelectedWork onSelectProject={(project) => setSelectedProject(project)} />

          {/* 7. Services Overview */}
          <ServicesOverview
            onSelectService={(service: ServiceItem) => handleOpenDiscuss(service.title)}
          />

          {/* 8. 3D Website Service CTA */}
          <Web3DCta onOpenDiscuss={() => handleOpenDiscuss('Interactive 3D Web Experience')} />

          {/* 9. Featured Student Projects */}
          <StudentProjects onSelectProject={(project) => setSelectedProject(project)} />

          {/* 10. How We Deliver (8-Step Process) */}
          <HowWeDeliver />

          {/* 11. Team */}
          <TeamSection />

          {/* 12. Free Initial Discussion CTA */}
          <DiscussionCTA onOpenDiscuss={() => handleOpenDiscuss('Initial Project Discussion')} />
        </main>

        {/* 13. Footer */}
        <Footer onOpenDiscuss={() => handleOpenDiscuss('Footer Inquiry')} />
      </div>

      {/* Interactive Modals & Drawers */}
      <DiscussionModal
        isOpen={discussOpen}
        onClose={() => setDiscussOpen(false)}
        initialType={discussType}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenDiscuss={() => handleOpenDiscuss(selectedProject?.title)}
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
