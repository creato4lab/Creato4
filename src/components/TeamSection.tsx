import React, { useState, useEffect, useRef } from 'react';

interface TeamMemberSlide {
  id: string;
  name: string;
  emoji: string;
  initials: string;
  avatarUrl: string;
  dicebearUrl: string;
  role: string;
  description: string;
  floatingBadges: { emoji: string; posClass: string }[];
  skills: string[];
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
    description:
      'Visionary engineering lead steering multidisciplinary hardware and software products from concept to market. Drives innovation across all technical verticals with a hands-on approach to systems architecture and product strategy.',
    floatingBadges: [
      { emoji: '🚀', posClass: 'top-0 -right-[2px]' },
      { emoji: '💡', posClass: 'top-[44px] -right-[12px]' },
      { emoji: '⚡', posClass: 'bottom-0 -left-[2px]' },
    ],
    skills: ['Product Strategy', 'Systems Architecture', 'Hardware R&D'],
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
    description:
      'Expert in high-reliability circuit design, power management, micro-controller firmware, and PCB manufacturing processes. Leads the electronics division with precision engineering and DFM excellence.',
    floatingBadges: [
      { emoji: '🔧', posClass: 'top-0 -right-[2px]' },
      { emoji: '⚡', posClass: 'top-[44px] -right-[12px]' },
      { emoji: '📟', posClass: 'bottom-0 -left-[2px]' },
    ],
    skills: ['Hardware Engineering', 'Embedded C++', 'DFM Excellence'],
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
    description:
      'Directs multi-layer PCB layout, component selection, and signal integrity analysis. Oversees educational project publishing and brand outreach initiatives with creative vision and technical depth.',
    floatingBadges: [
      { emoji: '📐', posClass: 'top-0 -right-[2px]' },
      { emoji: '🎨', posClass: 'top-[44px] -right-[12px]' },
      { emoji: '✨', posClass: 'bottom-0 -left-[2px]' },
    ],
    skills: ['PCB Design', 'Signal Integrity', 'Quality Assurance'],
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
    description:
      'Architects modern cloud applications, real-time IoT web portals, and interactive 3D WebGL experiences. Bridges the gap between hardware and software with cutting-edge digital solutions.',
    floatingBadges: [
      { emoji: '💻', posClass: 'top-0 -right-[2px]' },
      { emoji: '🌐', posClass: 'top-[44px] -right-[12px]' },
      { emoji: '🎮', posClass: 'bottom-0 -left-[2px]' },
    ],
    skills: ['Full-Stack Web', 'Cloud Infrastructure', '3D WebGL'],
  },
];

export const TeamSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [failedImgs, setFailedImgs] = useState<{ [id: string]: 'none' | 'dicebear' | 'initials' }>({});

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      const newSlide = Math.min(3, Math.floor(progress * 4));

      setCurrentSlide((prev) => (prev !== newSlide ? newSlide : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleImgError = (member: TeamMemberSlide) => {
    setFailedImgs((prev) => {
      const current = prev[member.id] || 'none';
      if (current === 'none') {
        return { ...prev, [member.id]: 'dicebear' };
      } else {
        return { ...prev, [member.id]: 'initials' };
      }
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
            const imgState = failedImgs[member.id] || 'none';
            const imgSrc =
              imgState === 'none'
                ? member.avatarUrl
                : imgState === 'dicebear'
                ? member.dicebearUrl
                : '';

            return (
              <div
                key={member.id}
                className="w-full h-screen shrink-0 flex flex-col items-center justify-center relative p-4 sm:p-5"
              >
                {/* Clean Minimal Card Container matching screenshot */}
                <div className="w-full max-w-[440px] mx-auto my-auto">
                  <div
                    className={`w-full bg-white rounded-[44px] p-[40px_36px_36px] shadow-[0_20px_60px_rgba(26,58,46,0.07)] flex flex-col items-center text-center relative transition-all duration-500 ${
                      isActive
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-[30px]'
                    }`}
                  >
                    {/* 1. Avatar Area (126px x 126px) */}
                    <div className="relative w-[126px] h-[126px] mb-6 shrink-0">
                      <div className="w-[126px] h-[126px] rounded-full p-1 bg-gradient-to-br from-[#1a3a2e] via-[#3d7a5a] to-[#1a3a2e] shadow-[0_8px_25px_rgba(26,58,46,0.15)]">
                        <div className="w-full h-full rounded-full border-[4px] border-white overflow-hidden bg-[#1a3a2e] flex items-center justify-center relative">
                          {imgState !== 'initials' && imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={member.name}
                              onError={() => handleImgError(member)}
                              className="w-full h-full object-cover select-none block"
                            />
                          ) : (
                            <span className="text-white text-2xl font-extrabold select-none">
                              {member.initials}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Floating Badges */}
                      {member.floatingBadges.map((badge, bIdx) => (
                        <div
                          key={bIdx}
                          className={`absolute ${badge.posClass} w-8 h-8 rounded-full bg-white text-[15px] shadow-[0_4px_12px_rgba(26,58,46,0.12)] border-2 border-white/95 flex items-center justify-center z-10 animate-pulse`}
                        >
                          <span>{badge.emoji}</span>
                        </div>
                      ))}
                    </div>

                    {/* 2. Name + Emoji */}
                    <h3 className="text-[1.85rem] font-extrabold text-[#1a3a2e] text-center flex items-center justify-center gap-1.5 mb-1.5 tracking-tight leading-tight">
                      <span>{member.name}</span>
                      <span className="text-[1.3rem]">{member.emoji}</span>
                    </h3>

                    {/* 3. Role */}
                    <div className="text-[0.88rem] font-semibold text-[#4a7a5a] text-center leading-[1.45] mb-4 max-w-[340px]">
                      {member.role}
                    </div>

                    {/* 4. Description Paragraph */}
                    <p className="text-[0.84rem] font-normal text-[#7a7a7a] leading-[1.65] text-center mb-6 max-w-[380px]">
                      {member.description}
                    </p>

                    {/* 5. Skill Tag Pills */}
                    <div className="flex flex-wrap justify-center gap-2 w-full">
                      {member.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-[#ece9e4] text-[#2a4a3e] px-[18px] py-[8px] rounded-[100px] text-[0.76rem] font-semibold transition-all duration-200 hover:bg-[#1a3a2e] hover:text-white hover:-translate-y-0.5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
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
                    ? 'bg-[#1a3a2e] scale-[1.4] shadow-[0_0_0_4px_rgba(26,58,46,0.15)]'
                    : 'bg-[#1a3a2e]/25 hover:bg-[#1a3a2e]/60'
                }`}
              />
            );
          })}
        </div>

        {/* Fixed Bottom-Left Slide Counter */}
        <div className="fixed bottom-6 left-6 px-[14px] py-[6px] rounded-[100px] text-[#1a3a2e] font-extrabold text-[0.78rem] tracking-[0.15em] z-50">
          0{currentSlide + 1} / 04
        </div>
      </div>
    </div>
  );
};
