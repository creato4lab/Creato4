import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface TeamMemberSlide {
  id: string;
  name: string;
  emoji: string;
  initials: string;
  avatarUrl: string;
  dicebearUrl: string;
  role: string;
  department: string;
  location: string;
  description: string;
  highlights: string[];
  stats: { value: string; label: string }[];
  floatingBadges: { emoji: string; label: string; positionClass: string; animClass: string }[];
  skills: string[];
  socials: { emoji: string; label: string; link: string }[];
}

const TEAM_SLIDES: TeamMemberSlide[] = [
  {
    id: 'prince-tagadiya',
    name: 'Prince Tagadiya',
    emoji: '👑',
    initials: 'PT',
    avatarUrl: '/prince_memoji.png',
    dicebearUrl:
      'https://api.dicebear.com/9.x/avataaars/png?seed=PrinceCEO&backgroundColor=e8f0e8&radius=50&size=256&top=shortHairShortFlat&facialHair=beardMedium&clothing=blazerAndShirt',
    role: 'Founder, CEO & CPTO',
    department: 'PRODUCT & SYSTEM ARCHITECTURE',
    location: '📍 CRETO4 R&D Lab · Gujarat',
    description:
      'Visionary engineering lead steering multidisciplinary hardware and software products from concept to market. Drives innovation across all technical verticals with a hands-on approach to systems architecture and product strategy. Passionate about building scalable teams and fostering a culture of engineering excellence.',
    highlights: [
      'Architected Smart Health Kiosk hardware & cloud telemetry pipeline',
      'Secured SSIP Government Student Startup Innovation Grant',
    ],
    stats: [
      { value: '8+ Yrs', label: 'EXP' },
      { value: '50+', label: 'PROJECTS' },
      { value: '12', label: 'PATENTS' },
    ],
    floatingBadges: [
      { emoji: '🚀', label: 'Launch Lead', positionClass: '-top-1 -right-1', animClass: 'animate-float-1' },
      { emoji: '💡', label: 'Product Innovation', positionClass: '-bottom-1 -left-1', animClass: 'animate-float-2' },
      { emoji: '⚡', label: 'Systems Arch', positionClass: 'bottom-2 -right-3', animClass: 'animate-float-3' },
    ],
    skills: ['Product Strategy', 'Systems Architecture', 'Hardware R&D', 'Venture Strategy'],
    socials: [
      { emoji: '💼', label: 'LinkedIn', link: '#' },
      { emoji: '🐦', label: 'Twitter', link: '#' },
      { emoji: '💻', label: 'GitHub', link: '#' },
      { emoji: '✉️', label: 'Email', link: 'mailto:prince@creto4.com' },
    ],
  },
  {
    id: 'nisarg-patel',
    name: 'Nisarg Patel',
    emoji: '🔧',
    initials: 'NP',
    avatarUrl: '/nisarg_memoji.png',
    dicebearUrl:
      'https://api.dicebear.com/9.x/avataaars/png?seed=NisargEngineer&backgroundColor=d1e8d1&radius=50&size=256&top=shortHairTheCaesar&facialHair=beardLight&clothing=hoodie',
    role: 'Head of Electronics, Embedded Systems & Manufacturing',
    department: 'ELECTRONICS & EMBEDDED SYSTEMS',
    location: '📍 CRETO4 Hardware Lab · Gujarat',
    description:
      'Expert in high-reliability circuit design, power management, micro-controller firmware, and PCB manufacturing processes. Leads the electronics division with precision engineering and DFM excellence. Specializes in turning complex hardware concepts into production-ready products.',
    highlights: [
      'Designed heavy-payload PDB & RTK-GPS telemetry for Agri-Titan X6',
      'Engineered sub-100mW power management for Smart Safety Helmet',
    ],
    stats: [
      { value: '6+ Yrs', label: 'EXP' },
      { value: '35+', label: 'PCBs DESIGNED' },
      { value: '8', label: 'PRODUCTS' },
    ],
    floatingBadges: [
      { emoji: '🔧', label: 'Hardware Eng', positionClass: '-top-1 -right-1', animClass: 'animate-float-1' },
      { emoji: '⚡', label: 'Power & Circuits', positionClass: '-bottom-1 -left-1', animClass: 'animate-float-2' },
      { emoji: '📟', label: 'Embedded C++', positionClass: 'bottom-2 -right-3', animClass: 'animate-float-3' },
    ],
    skills: ['Hardware Engineering', 'Embedded C++', 'DFM Excellence', 'Power Electronics'],
    socials: [
      { emoji: '💼', label: 'LinkedIn', link: '#' },
      { emoji: '🐦', label: 'Twitter', link: '#' },
      { emoji: '💻', label: 'GitHub', link: '#' },
      { emoji: '✉️', label: 'Email', link: 'mailto:nisarg@creto4.com' },
    ],
  },
  {
    id: 'khushi-belani',
    name: 'Khushi Belani',
    emoji: '🎨',
    initials: 'KB',
    avatarUrl: '/khushi_memoji.png',
    dicebearUrl:
      'https://api.dicebear.com/9.x/avataaars/png?seed=KhushiDesigner&backgroundColor=ffe8d1&radius=50&size=256&top=longHairStraight&accessories=glasses&clothing=shirtVNeck',
    role: 'Head of PCB Design, Education & Brand Communications',
    department: 'PCB DESIGN & BRAND COMMUNICATIONS',
    location: '📍 CRETO4 Design Studio · Gujarat',
    description:
      'Directs multi-layer PCB layout, component selection, and signal integrity analysis. Oversees educational project publishing and brand outreach initiatives with creative vision and technical depth. Bridges the gap between engineering precision and creative communication.',
    highlights: [
      'Published technical research in Electronics For You magazine',
      'Routed multi-layer HDI high-density PCB layouts & EMC compliance',
    ],
    stats: [
      { value: '5+ Yrs', label: 'EXP' },
      { value: '40+', label: 'PCB DESIGNS' },
      { value: '15', label: 'WORKSHOPS' },
    ],
    floatingBadges: [
      { emoji: '🎨', label: 'Brand & UX', positionClass: '-top-1 -right-1', animClass: 'animate-float-1' },
      { emoji: '📐', label: 'PCB CAD', positionClass: '-bottom-1 -left-1', animClass: 'animate-float-2' },
      { emoji: '✨', label: 'Quality QA', positionClass: 'bottom-2 -right-3', animClass: 'animate-float-3' },
    ],
    skills: ['PCB Design', 'Signal Integrity', 'Quality Assurance', 'Technical Brand'],
    socials: [
      { emoji: '💼', label: 'LinkedIn', link: '#' },
      { emoji: '🐦', label: 'Twitter', link: '#' },
      { emoji: '🎨', label: 'Portfolio', link: '#' },
      { emoji: '✉️', label: 'Email', link: 'mailto:khushi@creto4.com' },
    ],
  },
  {
    id: 'rudra-chauhan',
    name: 'Rudra Chauhan',
    emoji: '💻',
    initials: 'RC',
    avatarUrl: '/rudra_memoji.png',
    dicebearUrl:
      'https://api.dicebear.com/9.x/avataaars/png?seed=RudraDeveloper&backgroundColor=d1d8e8&radius=50&size=256&top=shortHairShortWaved&facialHair=beardLight&clothing=graphicShirt',
    role: 'Head of Software Engineering & Digital Design',
    department: 'SOFTWARE & DIGITAL EXPERIENCES',
    location: '📍 CRETO4 Cloud Lab · Gujarat',
    description:
      'Architects modern cloud applications, real-time IoT web portals, and interactive 3D WebGL experiences. Bridges the gap between hardware and software with cutting-edge digital solutions. Passionate about creating seamless user experiences that bring hardware to life.',
    highlights: [
      'Built real-time IoT WebSocket & MQTT cloud telemetry dashboard',
      'Engineered high-performance 3D WebGL product visualizers',
    ],
    stats: [
      { value: '7+ Yrs', label: 'EXP' },
      { value: '60+', label: 'PROJECTS' },
      { value: '20', label: 'WEB APPS' },
    ],
    floatingBadges: [
      { emoji: '💻', label: 'Full-Stack Code', positionClass: '-top-1 -right-1', animClass: 'animate-float-1' },
      { emoji: '🌐', label: 'Cloud API', positionClass: '-bottom-1 -left-1', animClass: 'animate-float-2' },
      { emoji: '🎮', label: '3D WebGL', positionClass: 'bottom-2 -right-3', animClass: 'animate-float-3' },
    ],
    skills: ['Full-Stack Web', 'Cloud Infrastructure', '3D WebGL', 'IoT Telemetry'],
    socials: [
      { emoji: '💼', label: 'LinkedIn', link: '#' },
      { emoji: '🐦', label: 'Twitter', link: '#' },
      { emoji: '💻', label: 'GitHub', link: '#' },
      { emoji: '✉️', label: 'Email', link: 'mailto:rudra@creto4.com' },
    ],
  },
];

export const TeamSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [imgErrors, setImgErrors] = useState<{ [key: string]: boolean }>({});
  const [tilts, setTilts] = useState<{ rotateX: number; rotateY: number }[]>([
    { rotateX: 0, rotateY: 0 },
    { rotateX: 0, rotateY: 0 },
    { rotateX: 0, rotateY: 0 },
    { rotateX: 0, rotateY: 0 },
  ]);

  // Track window scroll progress through the 400vh pinned team section
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Calculate slide index from 0 to 3
      const newSlide = Math.min(3, Math.floor(progress * 4));

      setCurrentSlide((prev) => {
        if (prev !== newSlide) {
          if (newSlide > 0) setHasScrolled(true);
          return newSlide;
        }
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Programmatic scroll to a specific slide when dot is clicked
  const scrollToSlide = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalScrollable = rect.height - window.innerHeight;

    const targetProgress = (index + 0.5) / 4;
    const targetScrollY = containerTop + targetProgress * totalScrollable;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  // 3D Card Tilt Mouse Move (Max 6 degrees, translateZ 8px, scale 1.01)
  const handleMouseMoveCard = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = parseFloat((((y - centerY) / centerY) * -6).toFixed(2));
    const rotateY = parseFloat((((x - centerX) / centerX) * 6).toFixed(2));

    setTilts((prev) => {
      const next = [...prev];
      next[idx] = { rotateX, rotateY };
      return next;
    });
  };

  const handleMouseLeaveCard = (idx: number) => {
    setTilts((prev) => {
      const next = [...prev];
      next[idx] = { rotateX: 0, rotateY: 0 };
      return next;
    });
  };

  // Progress Bar width percentage (1..4)
  const progressPercent = Math.round(((currentSlide + 1) / TEAM_SLIDES.length) * 100);

  return (
    <div
      id="team"
      ref={containerRef}
      className="relative h-[400vh] bg-[#f5f0eb] select-none"
    >
      {/* Sticky Viewport (Pins at top: 0 while scrolling through 400vh) */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* Slider Track with Smooth TranslateY */}
        <div
          className="w-full h-full flex flex-col will-change-transform"
          style={{
            transform: `translateY(-${currentSlide * 100}vh)`,
            transition: 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
          }}
        >
          {TEAM_SLIDES.map((member, idx) => {
            const isActive = idx === currentSlide;
            const tilt = tilts[idx];
            const isTilting = tilt.rotateX !== 0 || tilt.rotateY !== 0;
            const hasImgError = imgErrors[member.id];

            return (
              <div
                key={member.id}
                className={`w-full h-screen shrink-0 flex flex-col items-center justify-center relative p-3 sm:p-5 ${
                  isActive ? 'slide-active' : ''
                }`}
              >
                {/* Section Header on First Slide Only */}
                {idx === 0 && (
                  <div className="text-center absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-[600px] transition-opacity duration-500">
                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.25em] text-[#4a7a5a] block mb-0.5">
                      The People Behind The Work
                    </span>
                    <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#1a3a2e]">
                      MEET THE TEAM
                    </h2>
                  </div>
                )}

                {/* Extended Vertically Apple-Style Glass Card (Max-width 520px, Max-height 90vh) */}
                <div className="perspective-container w-full max-w-[520px] mx-auto my-auto">
                  <div
                    onMouseMove={(e) => handleMouseMoveCard(idx, e)}
                    onMouseLeave={() => handleMouseLeaveCard(idx)}
                    style={{
                      transform: isTilting
                        ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(8px) scale(1.01)`
                        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
                      transition: isTilting ? 'transform 0.15s ease-out' : 'transform 0.5s ease-out, opacity 0.6s ease',
                    }}
                    className={`apple-glass-card group w-full max-h-[88vh] sm:max-h-[90vh] overflow-y-auto no-scrollbar p-5 sm:p-[36px_40px_36px] flex flex-col items-center text-center relative transition-all duration-300 ${
                      isActive
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-[40px] scale-[0.96]'
                    }`}
                  >
                    {/* Top Department Tag & Location Badge */}
                    <div className="w-full flex items-center justify-between gap-2 mb-3">
                      <span className="department-badge">{member.department}</span>
                      <span className="location-badge">{member.location}</span>
                    </div>

                    {/* Avatar (140px x 140px) with 3 Floating Emoji Badges */}
                    <div className="relative mb-3">
                      {member.floatingBadges.map((badge, bIdx) => (
                        <div
                          key={bIdx}
                          title={badge.label}
                          className={`absolute ${badge.positionClass} ${badge.animClass} working-emoji-badge w-8 h-8 sm:w-9 sm:h-9 z-20 cursor-default`}
                        >
                          <span className="text-sm sm:text-base select-none">{badge.emoji}</span>
                        </div>
                      ))}

                      <div
                        style={{ animationDelay: isActive ? '0.15s' : '0s' }}
                        className={`w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full p-[5px] bg-gradient-to-br from-[#1a3a2e] via-[#3d7a5a] to-[#1a3a2e] shadow-[0_8px_30px_rgba(26,58,46,0.2)] cursor-pointer transition-transform duration-400 cubic-bezier(0.34,1.56,0.64,1) group-hover:scale-106 ${
                          isActive ? 'animate-pop-in' : 'opacity-0'
                        }`}
                      >
                        <div className="w-full h-full rounded-full border-[4px] border-white overflow-hidden bg-[#1a3a2e] flex items-center justify-center relative">
                          {!hasImgError ? (
                            <img
                              src={member.avatarUrl}
                              alt={`${member.name} Avatar`}
                              onError={() => {
                                const img = new Image();
                                img.src = member.dicebearUrl;
                                img.onload = () => {
                                  const target = document.getElementById(`avatar-img-${member.id}`) as HTMLImageElement;
                                  if (target) target.src = member.dicebearUrl;
                                };
                                img.onerror = () => setImgErrors((prev) => ({ ...prev, [member.id]: true }));
                              }}
                              id={`avatar-img-${member.id}`}
                              className="w-full h-full object-cover select-none"
                            />
                          ) : (
                            <span className="text-white text-2xl sm:text-4xl font-extrabold tracking-wider select-none">
                              {member.initials}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Name + Emoji ("Prince Tagadiya 👑") */}
                    <h3
                      style={{ animationDelay: isActive ? '0.25s' : '0s' }}
                      className={`text-xl sm:text-[1.85rem] font-extrabold text-[#1a3a2e] tracking-tight leading-tight mb-0.5 flex items-center justify-center gap-2 ${
                        isActive ? 'animate-fade-in-up' : 'opacity-0'
                      }`}
                    >
                      <span>{member.name}</span>
                      <span className="text-lg sm:text-xl transition-transform duration-300 hover:scale-125 inline-block cursor-default">
                        {member.emoji}
                      </span>
                    </h3>

                    {/* Role Text */}
                    <p
                      style={{ animationDelay: isActive ? '0.35s' : '0s' }}
                      className={`text-xs sm:text-[0.92rem] font-semibold text-[#4a7a5a] mb-2.5 leading-snug ${
                        isActive ? 'animate-fade-in-up' : 'opacity-0'
                      }`}
                    >
                      {member.role}
                    </p>

                    {/* Description Paragraph (left-aligned) */}
                    <p
                      style={{ animationDelay: isActive ? '0.45s' : '0s' }}
                      className={`text-left text-[0.84rem] sm:text-[0.86rem] font-normal text-[#6a6a6a] leading-[1.65] mb-2.5 max-w-[440px] ${
                        isActive ? 'animate-fade-in-up' : 'opacity-0'
                      }`}
                    >
                      {member.description}
                    </p>

                    {/* Key Contributions Container */}
                    <div
                      style={{ animationDelay: isActive ? '0.48s' : '0s' }}
                      className={`contributions-container ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}
                    >
                      {member.highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="contribution-item">
                          <span className="checkmark-icon">✓</span>
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats Row (3 Columns with top & bottom borders) */}
                    <div
                      style={{ animationDelay: isActive ? '0.5s' : '0s' }}
                      className={`stats-row-container ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}
                    >
                      {member.stats.map((st, sIdx) => (
                        <div key={sIdx} className="text-center">
                          <span className="text-base sm:text-[1.35rem] font-extrabold text-[#1a3a2e] block leading-none">
                            {st.value}
                          </span>
                          <span className="text-[0.65rem] font-semibold text-[#8a9a8a] uppercase tracking-wider block mt-1">
                            {st.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Social Links Row (4 Circular 38px Buttons) */}
                    <div
                      style={{ animationDelay: isActive ? '0.55s' : '0s' }}
                      className={`flex items-center justify-center gap-2.5 mb-3 ${
                        isActive ? 'animate-fade-in-up' : 'opacity-0'
                      }`}
                    >
                      {member.socials.map((soc, socIdx) => (
                        <a
                          key={socIdx}
                          href={soc.link}
                          title={soc.label}
                          className="social-icon-btn"
                        >
                          {soc.emoji}
                        </a>
                      ))}
                    </div>

                    {/* Skills Container (Pill Tags) */}
                    <div className="flex flex-wrap justify-center gap-1.5 mb-3.5">
                      {member.skills.map((skill, sIdx) => {
                        const delays = ['0.60s', '0.65s', '0.70s', '0.75s'];
                        return (
                          <span
                            key={sIdx}
                            style={{ animationDelay: isActive ? delays[sIdx] || '0.6s' : '0s' }}
                            className={`skill-tag-pill-v2 ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>

                    {/* "Get in Touch 📧" Button */}
                    <div
                      style={{ animationDelay: isActive ? '0.75s' : '0s' }}
                      className={isActive ? 'animate-fade-in-up' : 'opacity-0'}
                    >
                      <a href={`mailto:${member.id}@creto4.com`} className="get-in-touch-btn">
                        <span>Get in Touch</span>
                        <span className="text-sm">📧</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed Right-Side Navigation Dots */}
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 z-50">
          {TEAM_SLIDES.map((m, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={m.id}
                onClick={() => scrollToSlide(idx)}
                title={`${m.name} ${m.emoji}`}
                aria-label={`Go to slide ${idx + 1}: ${m.name}`}
                className={`w-[10px] h-[10px] rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#1a3a2e] scale-150 ring-4 ring-[#1a3a2e]/20'
                    : 'bg-[#1a3a2e]/25 hover:bg-[#1a3a2e]/60'
                }`}
              />
            );
          })}
        </div>

        {/* Bottom Overlay Bar (Pill Slide Counter & Scroll Hint) */}
        <div className="absolute bottom-5 left-0 w-full flex items-center justify-center z-40 pointer-events-none px-4 sm:px-8">
          {/* Slide Counter */}
          <div className="absolute left-4 sm:left-10 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-black/5 text-[#1a3a2e] font-extrabold text-xs tracking-widest">
            {String(currentSlide + 1).padStart(2, '0')} / 04
          </div>

          {/* Scroll Hint */}
          <div
            className={`flex flex-col items-center gap-1 text-[10px] sm:text-xs font-extrabold tracking-[0.2em] text-[#4a7a5a] transition-opacity duration-500 ${
              currentSlide > 0 || hasScrolled ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span>SCROLL</span>
            <ChevronDown className="w-4 h-4 text-[#4a7a5a] animate-bounce-slow" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/5 z-50">
          <div
            className="h-full bg-[#1a3a2e] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
