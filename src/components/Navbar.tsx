import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, ArrowUpRight, Menu, X, ChevronDown, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'motion/react';
import { useSession } from 'next-auth/react';
import { Creato4LabLogoMark } from './LogoMark';

interface NavbarProps {
  onOpenDiscuss: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenCart: () => void;
  onOpenAdmin?: () => void;
  cartCount?: number;
}

const EASING: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDiscuss,
  onOpenSearch,
  onOpenAccount,
  onOpenCart,
  onOpenAdmin,
  cartCount = 0,
}) => {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { data: session } = useSession();

  // Spring-driven scroll progress (0 = top, 1 = scrolled)
  const scrollProgress = useMotionValue(0);
  const spring = useSpring(scrollProgress, { stiffness: 160, damping: 28, mass: 0.6 });

  useEffect(() => {
    const onScroll = () => {
      const p = Math.min(window.scrollY / 100, 1);
      scrollProgress.set(p);
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollProgress]);

  // Derived animated values from the spring
  const borderRadius  = useTransform(spring, [0, 1], [0, 9999]);
  const topPad        = useTransform(spring, [0, 1], [0, 14]);
  const sidePad       = useTransform(spring, [0, 1], [0, 24]);
  const innerPadY     = useTransform(spring, [0, 1], [14, 9]);
  const innerPadX     = useTransform(spring, [0, 1], [32, 16]);
  const bgAlpha       = useTransform(spring, [0, 0.3, 1], [0, 0, 0.75]);
  const blurVal       = useTransform(spring, [0, 1], [0, 64]);
  const maxWidthVal   = useTransform(spring, [0, 1], [1800, 940]);
  const logoSize      = useTransform(spring, [0, 1], [40, 34]);
  const brandSize     = useTransform(spring, [0, 1], [22, 16]);
  const linkSize      = useTransform(spring, [0, 1], [11.5, 10.5]);

  const navLinks = [
    { name: 'SHOP', href: '/shop' },
    {
      name: 'WORK', href: '/#work',
      dropdown: [
        { label: 'Smart Privacy Health Kiosk', href: '/#work' },
        { label: 'Agri-Titan X6 Drone', href: '/#work' },
        { label: 'SmartPrint Station', href: '/#work' },
        { label: 'Smart Safety Helmet', href: '/#work' },
        { label: 'Autonomous Disinfection Robot', href: '/#work' },
        { label: 'Smart Industrial Power Monitor', href: '/#work' },
      ],
    },
    {
      name: 'SERVICES', href: '/#services',
      dropdown: [
        { label: 'Product Engineering', href: '/#services' },
        { label: 'Mechanical Design & CAD', href: '/#services' },
        { label: 'Electronics & PCB', href: '/#services' },
        { label: 'Embedded Systems & IoT', href: '/#services' },
        { label: 'Software Development', href: '/#services' },
        { label: 'AI & Automation', href: '/#services' },
      ],
    },
    {
      name: 'STUDENT ZONE', href: '/#student-projects',
      dropdown: [
        { label: 'Featured Blueprints', href: '/#student-projects' },
        { label: 'Popular DIY Kits', href: '/#student-projects' },
        { label: 'Advanced Robotics', href: '/#student-projects' },
      ],
    },
    {
      name: 'PROCESS', href: '/#process',
      dropdown: [
        { label: '8-Step Engineering Methodology', href: '/#process' },
        { label: 'Proof of Concept & Feasibility', href: '/#process' },
      ],
    },
    {
      name: 'ABOUT', href: '/#team',
      dropdown: [
        { label: 'Engineering Lab Team', href: '/#team' },
        { label: 'Lab Achievements & Awards', href: '/#trust' },
      ],
    },
  ];

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          MORPHING NAVBAR — single element, spring-animated shape
      ───────────────────────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
        style={{ paddingTop: topPad, paddingLeft: sidePad, paddingRight: sidePad }}
      >
        <motion.div
          className="pointer-events-auto w-full overflow-visible"
          style={{
            maxWidth: maxWidthVal,
            borderRadius,
            // Apple-style liquid glass
            // Apple-style liquid glass
            backgroundColor: useTransform(bgAlpha, (a) => `rgba(250,248,245,${a})`),
            backdropFilter: useTransform(blurVal, (b) => `blur(${b}px) saturate(200%)`),
            WebkitBackdropFilter: useTransform(blurVal, (b) => `blur(${b}px) saturate(200%)`),
            // Multi-layered Apple glass reflections & shadows
            boxShadow: useTransform(spring, (p) =>
              p > 0.01
                ? `0 20px 40px -10px rgba(0,0,0,${p * 0.15}), 
                   inset 0 0 0 1px rgba(255,255,255,${p * 0.4}), 
                   inset 0 1.5px 1px rgba(255,255,255,${p * 0.9}), 
                   inset 0 -1px 1px rgba(0,0,0,${p * 0.04})`
                : 'none'
            ),
          }}
        >
          <motion.div
            className="flex items-center justify-between"
            style={{ paddingTop: innerPadY, paddingBottom: innerPadY, paddingLeft: innerPadX, paddingRight: innerPadX }}
          >

            {/* ── BRAND LOGO ─────────────────────────────── */}
            <a href="#" className="flex items-center gap-2.5 group shrink-0">
              <motion.div style={{ width: logoSize, height: logoSize }}>
                <MotionLogoMark size={logoSize} />
              </motion.div>
              <motion.span
                className="font-extrabold tracking-tight text-[#1A3C2F] hidden sm:block"
                style={{ fontSize: brandSize }}
              >
                CREATO4
              </motion.span>
            </a>

            {/* ── DESKTOP NAV LINKS ─────────────────────── */}
            <nav className="hidden lg:flex items-center">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <motion.a
                    href={link.href}
                    className="group inline-flex items-center gap-0.5 font-semibold tracking-[0.16em] text-[#5C6B60] hover:text-[#1A3C2F] transition-colors duration-200 uppercase relative"
                    style={{
                      fontSize: linkSize,
                      paddingLeft: useTransform(spring, [0, 1], [16, 10]),
                      paddingRight: useTransform(spring, [0, 1], [16, 10]),
                      paddingTop: useTransform(spring, [0, 1], [24, 10]),
                      paddingBottom: useTransform(spring, [0, 1], [24, 10]),
                      borderRadius: useTransform(spring, [0, 1], [0, 999]),
                    }}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className="w-2.5 h-2.5 transition-transform duration-200 shrink-0"
                      style={{ transform: activeDropdown === link.name ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                    {/* Underline — only visible before scroll */}
                    <motion.span
                      className="absolute bottom-3 left-0 w-full h-[1px] bg-[#1A3C2F] origin-center"
                      style={{
                        scaleX: 0,
                        opacity: useTransform(spring, [0.6, 1], [1, 0]),
                      }}
                    />
                  </motion.a>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === link.name && link.dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full mt-1 left-0 w-64 py-2.5 px-2 rounded-2xl border border-[#E8E2D9] shadow-2xl z-50"
                        style={{
                          background: 'rgba(250,248,245,0.97)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                        }}
                      >
                        {link.dropdown.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#5C6B60] hover:text-[#1A3C2F] hover:bg-[#F5F0EA] transition-all group/item"
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

            {/* ── RIGHT ACTIONS ──────────────────────────── */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {/* Icon cluster */}
              <motion.div
                className="flex items-center gap-1 text-[#5C6B60]"
                style={{
                  paddingRight: useTransform(spring, [0, 1], [16, 4]),
                  borderRight: '1px solid',
                  borderColor: useTransform(spring, [0, 0.5, 1], [
                    'rgba(232,226,217,1)', 'rgba(232,226,217,0.6)', 'rgba(232,226,217,0.4)'
                  ]),
                }}
              >
                <button onClick={onOpenSearch} aria-label="Search" className="p-1.5 hover:text-[#1A3C2F] hover:bg-[#1A3C2F]/6 rounded-full transition-colors cursor-pointer">
                  <Search className="w-4 h-4 stroke-[1.5]" />
                </button>
                <Link href="/dashboard" aria-label="Account" className="p-1.5 hover:text-[#1A3C2F] hover:bg-[#1A3C2F]/6 rounded-full transition-colors cursor-pointer flex items-center justify-center">
                  <User className="w-4 h-4 stroke-[1.5]" />
                </Link>
                {onOpenAdmin && (
                  <button onClick={onOpenAdmin} aria-label="Admin Portal" title="Admin Portal" className="p-1.5 hover:text-[#1A3C2F] hover:bg-[#1A3C2F]/6 rounded-full transition-colors cursor-pointer">
                    <Shield className="w-4 h-4 stroke-[1.8] text-[#C4A35A]" />
                  </button>
                )}
                <button onClick={onOpenCart} aria-label="Cart" className="p-1.5 hover:text-[#1A3C2F] hover:bg-[#1A3C2F]/6 rounded-full transition-colors relative cursor-pointer">
                  <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#C4A35A] text-[#1A3C2F] text-[9px] font-extrabold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </motion.div>

              {/* CTA Button */}
              {session?.user ? (
                <Link
                  href="/dashboard"
                  className="group flex items-center justify-center rounded-full bg-[#1A3C2F] text-[#FAF8F5] font-semibold hover:bg-[#234B3C] shadow-sm cursor-pointer whitespace-nowrap overflow-hidden"
                  style={{
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    gap: '6px',
                  }}
                >
                  Hi, {session.user.name?.split(' ')[0] || 'User'}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="group flex items-center justify-center rounded-full bg-[#1A3C2F] text-[#FAF8F5] font-semibold hover:bg-[#234B3C] shadow-sm cursor-pointer whitespace-nowrap overflow-hidden"
                  style={{
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    gap: '6px',
                  }}
                >
                  Login
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45 shrink-0" />
                </Link>
              )}
            </div>

            {/* ── MOBILE HAMBURGER ───────────────────────── */}
            <div className="flex lg:hidden items-center gap-2">
              {session?.user ? (
                <Link href="/dashboard" className="px-3.5 py-1.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-[11px] font-semibold cursor-pointer">
                  Hi, {session.user.name?.split(' ')[0] || 'User'}
                </Link>
              ) : (
                <Link href="/login" className="px-3.5 py-1.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-[11px] font-semibold cursor-pointer">
                  Login
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1A3C2F] hover:bg-[#1A3C2F]/6 rounded-full transition-colors cursor-pointer"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </motion.div>
        </motion.div>
      </motion.div>

      {/* ─── MOBILE DRAWER ───────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
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
              <div className="grid grid-cols-4 gap-1 py-2 text-[#5C6B60] text-center">
                <button onClick={() => { setMobileMenuOpen(false); onOpenSearch(); }} className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
                  <Search className="w-4 h-4" /> Search
                </button>
                <Link href="/dashboard" onClick={() => { setMobileMenuOpen(false); }} className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
                  <User className="w-4 h-4" /> Account
                </Link>
                <button onClick={() => { setMobileMenuOpen(false); onOpenAdmin?.(); }} className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#1A3C2F]">
                  <Shield className="w-4 h-4 text-[#C4A35A]" /> Admin
                </button>
                <button onClick={() => { setMobileMenuOpen(false); onOpenCart(); }} className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4" /> Saved ({cartCount})
                </button>
              </div>
              {session?.user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest text-center shadow-md flex items-center justify-center gap-2"
                >
                  <span>Hi, {session.user.name?.split(' ')[0] || 'User'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest text-center shadow-md flex items-center justify-center gap-2"
                >
                  <span>Login</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper: animated logo size via motion value
const MotionLogoMark: React.FC<{ size: any }> = ({ size }) => {
  return (
    <motion.img
      src="/creato4logo.png"
      alt="Creato4 Lab Logo"
      style={{ width: size, height: size, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
      className="shadow-sm"
    />
  );
};
