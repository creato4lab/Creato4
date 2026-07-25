import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, ArrowUpRight, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Creato4LabLogoMark } from './LogoMark';

interface NavbarProps {
  onOpenDiscuss: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenCart: () => void;
  cartCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDiscuss,
  onOpenSearch,
  onOpenAccount,
  onOpenCart,
  cartCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      name: 'WORK',
      href: '#work',
      dropdown: [
        { label: 'Smart Privacy Health Kiosk', href: '#work' },
        { label: 'Agri-Titan X6 Drone', href: '#work' },
        { label: 'SmartPrint Station', href: '#work' },
        { label: 'Smart Safety Helmet', href: '#work' },
        { label: 'Autonomous Disinfection Robot', href: '#work' },
        { label: 'Smart Industrial Power Monitor', href: '#work' },
      ],
    },
    {
      name: 'SERVICES',
      href: '#services',
      dropdown: [
        { label: 'Product Engineering', href: '#services' },
        { label: 'Mechanical Design & CAD', href: '#services' },
        { label: 'Electronics & PCB', href: '#services' },
        { label: 'Embedded Systems & IoT', href: '#services' },
        { label: 'Software Development', href: '#services' },
        { label: 'AI & Automation', href: '#services' },
      ],
    },
    {
      name: 'STUDENT PROJECTS',
      href: '#student-projects',
      dropdown: [
        { label: 'Featured Blueprints', href: '#student-projects' },
        { label: 'Popular DIY Kits', href: '#student-projects' },
        { label: 'Advanced Robotics', href: '#student-projects' },
      ],
    },
    {
      name: 'PROCESS',
      href: '#process',
      dropdown: [
        { label: '8-Step Engineering Methodology', href: '#process' },
        { label: 'Proof of Concept & Feasibility', href: '#process' },
      ],
    },
    {
      name: 'ABOUT',
      href: '#team',
      dropdown: [
        { label: 'Engineering Lab Team', href: '#team' },
        { label: 'Lab Achievements & Awards', href: '#trust' },
      ],
    },
  ];

  return (
    <>
      {/* ─── TOP BAR (before scroll) ─────────────────────────── */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.header
            key="top-bar"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeIn' }}
            className="fixed top-0 left-0 right-0 h-[72px] z-[100] bg-transparent"
          >
            <div className="max-w-[1800px] w-full h-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 flex items-center justify-between">
              {/* Brand */}
              <a href="#" className="flex items-center gap-3 group text-[#1A3C2F] transition-transform duration-200 active:scale-95">
                <Creato4LabLogoMark size={40} />
                <span className="text-xl lg:text-2xl font-extrabold tracking-tight">CREATO4</span>
              </a>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="relative py-6"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-[0.72rem] font-semibold tracking-[0.18em] text-[#5C6B60] hover:text-[#1A3C2F] transition-colors duration-200 uppercase relative"
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-[#1A3C2F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                    </a>
                    <AnimatePresence>
                      {activeDropdown === link.name && link.dropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute top-full left-0 w-64 py-3 px-2 bg-[#FAF8F5]/95 border border-[#E8E2D9] rounded-2xl shadow-xl backdrop-blur-xl z-50"
                        >
                          {link.dropdown.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-4 py-2.5 rounded-xl text-xs font-medium text-[#5C6B60] hover:text-[#1A3C2F] hover:bg-[#F5F0EA] transition-all duration-150 flex items-center justify-between group/item"
                            >
                              <span>{item.label}</span>
                              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              {/* Right CTAs */}
              <div className="hidden lg:flex items-center gap-6">
                <button
                  onClick={onOpenDiscuss}
                  className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-semibold tracking-wider hover:bg-[#234B3C] transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <span>Discuss Your Idea</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                </button>
                <div className="flex items-center gap-4 border-l border-[#E8E2D9] pl-6 text-[#5C6B60]">
                  <button onClick={onOpenSearch} aria-label="Search" className="p-1.5 hover:text-[#1A3C2F] transition-colors rounded-full hover:bg-[#F5F0EA] cursor-pointer">
                    <Search className="w-5 h-5 stroke-[1.5]" />
                  </button>
                  <button onClick={onOpenAccount} aria-label="Account" className="p-1.5 hover:text-[#1A3C2F] transition-colors rounded-full hover:bg-[#F5F0EA] cursor-pointer">
                    <User className="w-5 h-5 stroke-[1.5]" />
                  </button>
                  <button onClick={onOpenCart} aria-label="Cart" className="p-1.5 hover:text-[#1A3C2F] transition-colors rounded-full hover:bg-[#F5F0EA] relative cursor-pointer">
                    <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C4A35A] text-[#1A3C2F] text-[10px] font-extrabold flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile toggle */}
              <div className="flex lg:hidden items-center gap-3">
                <button onClick={onOpenDiscuss} className="px-3.5 py-1.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-[11px] font-semibold cursor-pointer">
                  Discuss
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-[#1A3C2F] hover:bg-[#F5F0EA] rounded-lg transition-colors cursor-pointer"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ─── FLOATING PILL NAVBAR (after scroll) ─────────────── */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            key="pill-nav"
            initial={{ opacity: 0, y: -28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-4 left-1/2 z-[100] -translate-x-1/2"
            style={{ width: 'min(90vw, 920px)' }}
          >
            <div
              className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-full border border-white/20 shadow-2xl"
              style={{
                background: 'rgba(250,248,245,0.82)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 8px 40px rgba(26,60,47,0.12), 0 1px 0 rgba(255,255,255,0.5) inset',
              }}
            >
              {/* Logo mark */}
              <a href="#" className="flex items-center gap-2.5 group shrink-0">
                <Creato4LabLogoMark size={34} />
                <span className="text-sm font-extrabold tracking-tight text-[#1A3C2F] hidden sm:block">CREATO4</span>
              </a>

              {/* Nav links — compact */}
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown('pill-' + link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-0.5 px-3 py-1.5 rounded-full text-[0.68rem] font-semibold tracking-[0.14em] text-[#5C6B60] hover:text-[#1A3C2F] hover:bg-[#1A3C2F]/6 transition-all duration-200 uppercase"
                    >
                      {link.name}
                      <ChevronDown className="w-2.5 h-2.5 transition-transform duration-200" style={{ transform: activeDropdown === 'pill-' + link.name ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </a>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {activeDropdown === 'pill-' + link.name && link.dropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute top-full mt-2 left-0 w-60 py-2 px-2 rounded-2xl border border-[#E8E2D9] shadow-2xl z-50"
                          style={{
                            background: 'rgba(250,248,245,0.96)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                          }}
                        >
                          {link.dropdown.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-medium text-[#5C6B60] hover:text-[#1A3C2F] hover:bg-[#F5F0EA] transition-all group/item"
                            >
                              <span>{item.label}</span>
                              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              {/* Right side */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden lg:flex items-center gap-1 text-[#5C6B60]">
                  <button onClick={onOpenSearch} aria-label="Search" className="p-1.5 hover:text-[#1A3C2F] transition-colors rounded-full hover:bg-[#1A3C2F]/6 cursor-pointer">
                    <Search className="w-4 h-4 stroke-[1.5]" />
                  </button>
                  <button onClick={onOpenAccount} aria-label="Account" className="p-1.5 hover:text-[#1A3C2F] transition-colors rounded-full hover:bg-[#1A3C2F]/6 cursor-pointer">
                    <User className="w-4 h-4 stroke-[1.5]" />
                  </button>
                  <button onClick={onOpenCart} aria-label="Cart" className="p-1.5 hover:text-[#1A3C2F] transition-colors rounded-full hover:bg-[#1A3C2F]/6 relative cursor-pointer">
                    <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#C4A35A] text-[#1A3C2F] text-[9px] font-extrabold flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>

                <button
                  onClick={onOpenDiscuss}
                  className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-[11px] font-semibold tracking-wide hover:bg-[#234B3C] transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <span>Discuss</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45" />
                </button>

                {/* Mobile hamburger (inside pill) */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-1.5 text-[#1A3C2F] hover:bg-[#1A3C2F]/6 rounded-full transition-colors cursor-pointer"
                  aria-label="Toggle Navigation"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Mobile Drawer ───────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#FAF8F5] shadow-2xl z-[101] flex flex-col justify-between p-8 border-l border-[#E8E2D9] lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-6">
              <div className="flex items-center gap-2.5">
                <Creato4LabLogoMark size={36} />
                <span className="text-xl font-extrabold text-[#1A3C2F]">CREATO4</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[#5C6B60] hover:text-[#1A3C2F]">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 my-auto">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold tracking-[0.15em] text-[#1A3C2F] hover:text-[#C4A35A] transition-colors uppercase flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-60" />
                </a>
              ))}
            </nav>

            <div className="space-y-4 pt-6 border-t border-[#E8E2D9]">
              <div className="flex justify-around py-2 text-[#5C6B60]">
                <button onClick={() => { setMobileMenuOpen(false); onOpenSearch(); }} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <Search className="w-4 h-4" /> Search
                </button>
                <button onClick={() => { setMobileMenuOpen(false); onOpenAccount(); }} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <User className="w-4 h-4" /> Account
                </button>
                <button onClick={() => { setMobileMenuOpen(false); onOpenCart(); }} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4" /> Saved ({cartCount})
                </button>
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenDiscuss(); }}
                className="w-full py-3.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest text-center shadow-md flex items-center justify-center gap-2"
              >
                <span>Discuss Your Idea</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
