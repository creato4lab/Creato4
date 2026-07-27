'use client';
import React from 'react';

export const IdeaToPrototype: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-[#030507]">
      <video
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover opacity-90 mix-blend-screen"
        src="/videos/intro-video.mp4"
      />
    </div>
  );
};
