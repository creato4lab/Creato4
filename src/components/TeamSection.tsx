import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface TeamMemberSlide {
  id: string;
  name: string;
  emoji: string;
  avatarUrl: string;
  role: string;
  departmentHtml: string;
  location: string;
  description: string;
  achievements: string[];
  stats: { value: string; label: string }[];
  floatingBadges: { emoji: string; posClass: string }[];
  skills: string[];
  socials: { emoji: string; label: string; link: string }[];
}

const TEAM_SLIDES: TeamMemberSlide[] = [
  {
    id: 'prince-tagadiya',
    name: 'Prince Tagadiya',
    emoji: '👑',
    avatarUrl:
      'https://api.dicebear.com/9.x/avataaars/png?seed=PrinceCEO&backgroundColor=e8f0e8&radius=50&size=256&top=shortHairShortFlat&facialHair=beardMedium&clothing=blazerAndShirt',
    role: 'Founder, CEO & CPTO',
    departmentHtml: 'PRODUCT STRATEGY &<br/>LEADERSHIP',
    location: '📍 CRETO4 Design Studio · Gujarat',
    description:
      'Visionary engineering lead steering multidisciplinary hardware and software products from concept to market. Drives innovation across all technical verticals with a hands-on approach to systems architecture.',
    achievements: [
      'Led 3 successful hardware product launches from prototype to mass production',
      'Built and scaled technical team from 2 to 15 engineers in under 2 years',
    ],
    stats: [
      { value: '8+ Yrs', label: 'EXP' },
      { value: '50+', label: 'PROJECTS' },
      { value: '12', label: 'PATENTS' },
    ],
    floatingBadges: [
      { emoji: '🚀', posClass: '-top-[2px] -right-[2px]' },
      { emoji: '💡', posClass: '-bottom-[2px] -left-[2px]' },
      { emoji: '▶️', posClass: '-bottom-[2px] -right-[2px]' },
    ],
    skills: ['Product Strategy', 'Systems Architecture', 'Hardware R&D', 'Team Leadership'],
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
    avatarUrl:
      'https://api.dicebear.com/9.x/avataaars/png?seed=NisargEngineer&backgroundColor=d1e8d1&radius=50&size=256&top=shortHairTheCaesar&facialHair=beardLight&clothing=hoodie',
    role: 'Head of Electronics, Embedded Systems & Manufacturing',
    departmentHtml: 'ELECTRONICS &<br/>MANUFACTURING',
    location: '📍 CRETO4 Design Studio · Gujarat',
    description:
      'Expert in high-reliability circuit design, power management, micro-controller firmware, and PCB manufacturing processes. Leads the electronics division with precision engineering.',
    achievements: [
      'Designed power management systems for IoT devices with 99.9% uptime',
      'Optimized PCB manufacturing workflow reducing production costs by 30%',
    ],
    stats: [
      { value: '6+ Yrs', label: 'EXP' },
      { value: '35+', label: 'PCBS' },
      { value: '8', label: 'PRODUCTS' },
    ],
    floatingBadges: [
      { emoji: '🔧', posClass: '-top-[2px] -right-[2px]' },
      { emoji: '⚡', posClass: '-bottom-[2px] -left-[2px]' },
      { emoji: '▶️', posClass: '-bottom-[2px] -right-[2px]' },
    ],
    skills: ['Hardware Engineering', 'Embedded C++', 'DFM', 'Power Systems'],
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
    avatarUrl:
      'https://api.dicebear.com/9.x/avataaars/png?seed=KhushiDesigner&backgroundColor=ffe8d1&radius=50&size=256&top=longHairStraight&accessories=glasses&clothing=shirtVNeck',
    role: 'Head of PCB Design, Education & Brand Communications',
    departmentHtml: 'PCB DESIGN & BRAND<br/>COMMUNICATIONS',
    location: '📍 CRETO4 Design Studio · Gujarat',
    description:
      'Directs multi-layer PCB layout, component selection, and signal integrity analysis. Oversees educational project publishing and brand outreach with creative vision and technical depth.',
    achievements: [
      'Published technical research in Electronics For You magazine',
      'Routed multi-layer HDI high-density PCB layouts & EMC compliance',
    ],
    stats: [
      { value: '5+ Yrs', label: 'EXP' },
      { value: '40+', label: 'PCB DESIGNS' },
      { value: '15', label: 'WORKSHOPS' },
    ],
    floatingBadges: [
      { emoji: '🎨', posClass: '-top-[2px] -right-[2px]' },
      { emoji: '✨', posClass: '-bottom-[2px] -left-[2px]' },
      { emoji: '▶️', posClass: '-bottom-[2px] -right-[2px]' },
    ],
    skills: ['PCB Design', 'Signal Integrity', 'Quality Assurance', 'Technical Brand'],
    socials: [
      { emoji: '💼', label: 'LinkedIn', link: '#' },
      { emoji: '🐦', label: 'Twitter', link: '#' },
      { emoji: '🎨', label: 'Dribbble', link: '#' },
      { emoji: '✉️', label: 'Email', link: 'mailto:khushi@creto4.com' },
    ],
  },
  {
    id: 'rudra-chauhan',
    name: 'Rudra Chauhan',
    emoji: '💻',
    avatarUrl:
      'https://api.dicebear.com/9.x/avataaars/png?seed=RudraDeveloper&backgroundColor=d1d8e8&radius=50&size=256&top=shortHairShortWaved&facialHair=beardLight&clothing=graphicShirt',
    role: 'Head of Software Engineering & Digital Design',
    departmentHtml: 'SOFTWARE ENGINEERING &<br/>DIGITAL DESIGN',
    location: '📍 CRETO4 Design Studio · Gujarat',
    description:
      'Architects modern cloud applications, real-time IoT web portals, and interactive 3D WebGL experiences. Bridges the gap between hardware and software with cutting-edge digital solutions.',
    achievements: [
      'Built real-time IoT dashboard processing 10K+ device data points/sec',
      'Developed interactive 3D product configurators for client showcases',
    ],
    stats: [
      { value: '7+ Yrs', label: 'EXP' },
      { value: '60+', label: 'PROJECTS' },
      { value: '20', label: 'WEB APPS' },
    ],
    floatingBadges: [
      { emoji: '💻', posClass: '-top-[2px] -right-[2px]' },
      { emoji: '🌐', posClass: '-bottom-[2px] -left-[2px]' },
      { emoji: '▶️', posClass: '-bottom-[2px] -right-[2px]' },
    ],
    skills: ['Full-Stack Web', 'Cloud Infrastructure', '3D WebGL', 'IoT Systems'],
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

      // Calculate slide index from 0 to 3: floor(progress * 4)
      const newSlide = Math.min(3, Math.floor(progress * 4));

      setCurrentSlide((prev) => (prev !== newSlide ? newSlide : prev));
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

  return (
    <div
      id="team"
      ref={containerRef}
      className="relative h-[400vh] bg-[#f5f0eb] select-none font-sans"
    >
      {/* Sticky Viewport */}
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

            return (
              <div
                key={member.id}
                className="w-full h-screen shrink-0 flex flex-col items-center justify-center relative p-4 sm:p-5"
              >
                {/* 460px Exact Spec Glass Card */}
                <div className="w-full max-w-[460px] mx-auto my-auto">
                  <div
                    className={`w-full max-h-[90vh] overflow-y-auto no-scrollbar bg-white/90 backdrop-blur-[30px] border border-white/95 rounded-[40px] p-[32px_40px_36px] shadow-[0_8px_40px_rgba(26,58,46,0.06)] flex flex-col items-center text-center relative transition-all duration-500 ${
                      isActive
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-[30px]'
                    }`}
                  >
                    {/* 1. Top Badge Row */}
                    <div className="w-full flex items-center justify-center gap-[12px] mb-4">
                      <div
                        className="bg-[rgba(26,58,46,0.06)] border border-[rgba(26,58,46,0.08)] text-[#1a3a2e] px-[18px] py-[8px] rounded-[100px] text-[0.7rem] font-bold tracking-[1.5px] uppercase leading-[1.4] text-center"
                        dangerouslySetInnerHTML={{ __html: member.departmentHtml }}
                      />
                      <div className="text-[0.75rem] font-medium color-[#7a8a7a] flex items-center gap-1 whitespace-nowrap">
                        {member.location}
                      </div>
                    </div>

                    {/* 2. Avatar (130px x 130px) with 3 Floating Emoji Badges */}
                    <div className="relative w-[130px] h-[130px] mb-4 shrink-0">
                      <div className="w-[130px] h-[130px] rounded-full p-1 bg-gradient-to-br from-[#1a3a2e] via-[#3d7a5a] to-[#1a3a2e] shadow-[0_8px_25px_rgba(26,58,46,0.18)]">
                        <div className="w-full h-full rounded-full border-[4px] border-white overflow-hidden bg-[#1a3a2e] flex items-center justify-center">
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-full h-full object-cover select-none"
                          />
                        </div>
                      </div>

                      {/* 3 Floating Badges (32px circles) */}
                      {member.floatingBadges.map((badge, bIdx) => (
                        <div
                          key={bIdx}
                          className={`absolute ${badge.posClass} w-8 h-8 rounded-full bg-white text-[15px] shadow-[0_4px_12px_rgba(26,58,46,0.15)] border-2 border-white/90 flex items-center justify-center z-10 animate-pulse`}
                        >
                          <span>{badge.emoji}</span>
                        </div>
                      ))}
                    </div>

                    {/* 3. Name */}
                    <h3 className="text-[1.8rem] font-extrabold text-[#1a3a2e] text-center flex items-center justify-center gap-1.5 mb-1 leading-tight">
                      <span>{member.name}</span>
                      <span className="text-[1.3rem]">{member.emoji}</span>
                    </h3>

                    {/* 4. Role */}
                    <div className="text-[0.9rem] font-semibold text-[#4a7a5a] text-center leading-[1.5] mb-3">
                      {member.role}
                    </div>

                    {/* 5. Description */}
                    <p className="text-[0.82rem] font-normal text-[#6a6a6a] leading-[1.7] text-left mb-3.5 w-full">
                      {member.description}
                    </p>

                    {/* 6. Achievements Box */}
                    <div className="bg-[rgba(26,58,46,0.03)] rounded-[16px] p-[14px_18px] w-full mb-3.5 text-left">
                      {member.achievements.map((ach, aIdx) => (
                        <div
                          key={aIdx}
                          className="flex items-start gap-2 text-[0.78rem] text-[#5a6a5a] leading-[1.6] mb-1.5 last:mb-0"
                        >
                          <span className="text-[#4a7a5a] font-bold shrink-0">✓</span>
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>

                    {/* 7. Stats Row (3 Columns) */}
                    <div className="grid grid-cols-3 gap-[28px] py-[14px] w-full border-t border-b border-black/[0.04] mb-3.5 text-center">
                      {member.stats.map((st, sIdx) => (
                        <div key={sIdx}>
                          <span className="text-[1.3rem] font-extrabold text-[#1a3a2e] block leading-none">
                            {st.value}
                          </span>
                          <span className="text-[0.6rem] font-bold text-[#9aaa9a] uppercase tracking-[1.5px] block mt-1">
                            {st.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 8. Social Links (4 Circular Buttons 38px) */}
                    <div className="flex items-center justify-center gap-[10px] mb-3.5">
                      {member.socials.map((soc, socIdx) => (
                        <a
                          key={socIdx}
                          href={soc.link}
                          title={soc.label}
                          className="w-[38px] h-[38px] rounded-full bg-[rgba(245,245,245,0.9)] border border-black/[0.05] flex items-center justify-center text-[1.05rem] transition-all duration-200 hover:bg-[#1a3a2e] hover:text-white hover:-translate-y-0.5 hover:scale-110"
                        >
                          {soc.emoji}
                        </a>
                      ))}
                    </div>

                    {/* 9. Skills (Pill Tags) */}
                    <div className="flex flex-wrap justify-center gap-[8px] w-full mb-[16px]">
                      {member.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-[rgba(245,245,245,0.9)] border border-black/[0.05] text-[#3a5a4a] px-[18px] py-[8px] rounded-[100px] text-[0.78rem] font-semibold transition-all duration-200 hover:bg-[#1a3a2e] hover:text-white hover:-translate-y-0.5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* 10. Contact Button */}
                    <a
                      href={`mailto:${member.id}@creto4.com`}
                      className="bg-[#1a3a2e] text-white px-[28px] py-[12px] rounded-[100px] text-[0.85rem] font-semibold inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(26,58,46,0.25)]"
                    >
                      <span>Get in Touch</span>
                      <span>📧</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed Right-Side Navigation Dots */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-[12px] z-50">
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
                    ? 'bg-[#1a3a2e] scale-[1.4] shadow-[0_0_0_4px_rgba(26,58,46,0.2)]'
                    : 'bg-[#1a3a2e]/25 hover:bg-[#1a3a2e]/60'
                }`}
              />
            );
          })}
        </div>

        {/* Fixed Bottom-Left Slide Counter */}
        <div className="fixed bottom-6 left-6 px-[18px] py-[8px] rounded-[100px] bg-white/80 backdrop-blur-md border border-black/5 text-[#1a3a2e] font-extrabold text-[0.8rem] tracking-[0.15em] z-50">
          0{currentSlide + 1} / 04
        </div>
      </div>
    </div>
  );
};
