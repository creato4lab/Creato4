import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface TeamMember {
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

const TEAM_MEMBERS: TeamMember[] = [
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
      { emoji: '🚀', posClass: '-top-[2px] -right-[2px]' },
      { emoji: '💡', posClass: 'top-[40px] -right-[10px]' },
      { emoji: '⚡', posClass: '-bottom-[2px] -left-[2px]' },
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
      { emoji: '🔧', posClass: '-top-[2px] -right-[2px]' },
      { emoji: '⚡', posClass: 'top-[40px] -right-[10px]' },
      { emoji: '📟', posClass: '-bottom-[2px] -left-[2px]' },
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
      { emoji: '📐', posClass: '-top-[2px] -right-[2px]' },
      { emoji: '🎨', posClass: 'top-[40px] -right-[10px]' },
      { emoji: '✨', posClass: '-bottom-[2px] -left-[2px]' },
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
      { emoji: '💻', posClass: '-top-[2px] -right-[2px]' },
      { emoji: '🌐', posClass: 'top-[40px] -right-[10px]' },
      { emoji: '🎮', posClass: '-bottom-[2px] -left-[2px]' },
    ],
    skills: ['Full-Stack Web', 'Cloud Infrastructure', '3D WebGL'],
  },
];

interface TeamTiltCardProps {
  member: TeamMember;
  imgState: string;
  imgSrc: string;
  onImgError: (member: TeamMember) => void;
}

const TeamTiltCard: React.FC<TeamTiltCardProps> = ({ member, imgState, imgSrc, onImgError }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * 12;
    const rX = -((y - centerY) / centerY) * 12;

    setRotateX(rX);
    setRotateY(rY);

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    setGlowPos({ x: glowX, y: glowY, opacity: 1 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlowPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div style={{ perspective: '1000px' }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="bg-white rounded-[40px] p-[36px_28px_32px] shadow-[0_12px_40px_rgba(26,58,46,0.06)] hover:shadow-[0_25px_50px_rgba(26,58,46,0.18)] border border-white/90 flex flex-col items-center text-center relative transition-shadow duration-500 cursor-pointer overflow-hidden group select-none h-full"
      >
        {/* Dynamic Sheen / Light Reflection Overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 rounded-[40px]"
          style={{
            opacity: glowPos.opacity,
            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`,
          }}
        />

        {/* 1. Avatar Area (TranslateZ 35px for 3D depth) */}
        <div
          style={{ transform: 'translateZ(35px)', transformStyle: 'preserve-3d' }}
          className="relative w-[120px] h-[120px] mb-5 shrink-0 transition-transform duration-300"
        >
          <div className="w-[120px] h-[120px] rounded-full p-1 bg-gradient-to-br from-[#1a3a2e] via-[#3d7a5a] to-[#1a3a2e] shadow-[0_8px_25px_rgba(26,58,46,0.18)]">
            <div className="w-full h-full rounded-full border-[4px] border-white overflow-hidden bg-[#1a3a2e] flex items-center justify-center relative">
              {imgState !== 'initials' && imgSrc ? (
                <img
                  src={imgSrc}
                  alt={member.name}
                  onError={() => onImgError(member)}
                  className="w-full h-full object-cover select-none block"
                />
              ) : (
                <span className="text-white text-2xl font-extrabold select-none">
                  {member.initials}
                </span>
              )}
            </div>
          </div>

          {/* Floating Badges (TranslateZ 45px for ultra depth) */}
          {member.floatingBadges.map((badge, bIdx) => (
            <div
              key={bIdx}
              style={{ transform: 'translateZ(45px)' }}
              className={`absolute ${badge.posClass} w-[30px] h-[30px] rounded-full bg-white text-[14px] shadow-[0_4px_12px_rgba(26,58,46,0.14)] border-2 border-white/95 flex items-center justify-center z-10 animate-pulse`}
            >
              <span>{badge.emoji}</span>
            </div>
          ))}
        </div>

        {/* 2. Name + Emoji (TranslateZ 25px) */}
        <h3
          style={{ transform: 'translateZ(25px)' }}
          className="text-[1.6rem] font-extrabold text-[#1a3a2e] text-center flex items-center justify-center gap-1.5 mb-1.5 tracking-tight leading-tight transition-transform duration-300"
        >
          <span>{member.name}</span>
          <span className="text-[1.25rem]">{member.emoji}</span>
        </h3>

        {/* 3. Role (TranslateZ 18px) */}
        <div
          style={{ transform: 'translateZ(18px)' }}
          className="text-[0.85rem] font-semibold text-[#4a7a5a] text-center leading-[1.45] mb-4 min-h-[40px] flex items-center justify-center transition-transform duration-300"
        >
          {member.role}
        </div>

        {/* 4. Description Paragraph (TranslateZ 12px) */}
        <p
          style={{ transform: 'translateZ(12px)' }}
          className="text-[0.82rem] font-normal text-[#7a7a7a] leading-[1.65] text-center mb-5 flex-grow transition-transform duration-300"
        >
          {member.description}
        </p>

        {/* 5. Skill Tag Pills (TranslateZ 20px) */}
        <div
          style={{ transform: 'translateZ(20px)' }}
          className="flex flex-wrap justify-center gap-2 w-full mt-auto transition-transform duration-300"
        >
          {member.skills.map((skill, sIdx) => (
            <span
              key={sIdx}
              className="bg-[#ece9e4] text-[#2a4a3e] px-[15px] py-[7px] rounded-[100px] text-[0.74rem] font-semibold transition-all duration-200 hover:bg-[#1a3a2e] hover:text-white hover:-translate-y-0.5"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const TeamSection: React.FC = () => {
  const [failedImgs, setFailedImgs] = useState<{ [id: string]: 'none' | 'dicebear' | 'initials' }>({});

  const handleImgError = (member: TeamMember) => {
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
    <section id="team" className="w-full bg-[#f5f0eb] py-20 px-6 sm:px-10 lg:px-16 xl:px-20 font-sans">
      <div className="max-w-[1800px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#4a7a5a] block mb-2">
            The People Behind The Work
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a3a2e] tracking-tight">
            MEET THE TEAM
          </h2>
        </div>

        {/* 4-Card Responsive Grid Layout with 3D Tilt Sheen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {TEAM_MEMBERS.map((member) => {
            const imgState = failedImgs[member.id] || 'none';
            const imgSrc =
              imgState === 'none'
                ? member.avatarUrl
                : imgState === 'dicebear'
                ? member.dicebearUrl
                : '';

            return (
              <TeamTiltCard
                key={member.id}
                member={member}
                imgState={imgState}
                imgSrc={imgSrc}
                onImgError={handleImgError}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
