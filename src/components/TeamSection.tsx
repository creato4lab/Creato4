import React, { useState } from 'react';

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

        {/* 4-Card Responsive Grid Layout (All in one view) */}
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
              <div
                key={member.id}
                className="bg-white rounded-[40px] p-[36px_28px_32px] shadow-[0_12px_40px_rgba(26,58,46,0.06)] border border-white/90 flex flex-col items-center text-center relative transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(26,58,46,0.12)]"
              >
                {/* 1. Avatar Area (120px x 120px) */}
                <div className="relative w-[120px] h-[120px] mb-5 shrink-0">
                  <div className="w-[120px] h-[120px] rounded-full p-1 bg-gradient-to-br from-[#1a3a2e] via-[#3d7a5a] to-[#1a3a2e] shadow-[0_8px_25px_rgba(26,58,46,0.15)]">
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
                      className={`absolute ${badge.posClass} w-[30px] h-[30px] rounded-full bg-white text-[14px] shadow-[0_4px_12px_rgba(26,58,46,0.12)] border-2 border-white/95 flex items-center justify-center z-10 animate-pulse`}
                    >
                      <span>{badge.emoji}</span>
                    </div>
                  ))}
                </div>

                {/* 2. Name + Emoji */}
                <h3 className="text-[1.6rem] font-extrabold text-[#1a3a2e] text-center flex items-center justify-center gap-1.5 mb-1.5 tracking-tight leading-tight">
                  <span>{member.name}</span>
                  <span className="text-[1.25rem]">{member.emoji}</span>
                </h3>

                {/* 3. Role */}
                <div className="text-[0.85rem] font-semibold text-[#4a7a5a] text-center leading-[1.45] mb-4 min-h-[40px] flex items-center justify-center">
                  {member.role}
                </div>

                {/* 4. Description Paragraph */}
                <p className="text-[0.82rem] font-normal text-[#7a7a7a] leading-[1.65] text-center mb-5 flex-grow">
                  {member.description}
                </p>

                {/* 5. Skill Tag Pills */}
                <div className="flex flex-wrap justify-center gap-2 w-full mt-auto">
                  {member.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="bg-[#ece9e4] text-[#2a4a3e] px-[15px] py-[7px] rounded-[100px] text-[0.74rem] font-semibold transition-all duration-200 hover:bg-[#1a3a2e] hover:text-white hover:-translate-y-0.5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
