'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, MousePointerClick } from 'lucide-react';

interface IdeaToPrototypeProps {
  onEnded?: () => void;
  isMuted?: boolean;
  onToggleSound?: () => void;
  onDismiss?: () => void;
}

export const IdeaToPrototype: React.FC<IdeaToPrototypeProps> = ({
  onEnded,
  isMuted = true,
  onToggleSound,
  onDismiss,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Global event listeners: ANY key press, ANY mouse click, or ANY touch event turns off the splash screen!
  useEffect(() => {
    const handleTriggerDismiss = (e: Event) => {
      // Don't trigger if user clicked sound button
      const target = e.target as HTMLElement;
      if (target && target.closest('.sound-toggle-btn')) {
        return;
      }
      onDismiss?.();
    };

    window.addEventListener('keydown', handleTriggerDismiss, { passive: true });
    window.addEventListener('mousedown', handleTriggerDismiss, { passive: true });
    window.addEventListener('touchstart', handleTriggerDismiss, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleTriggerDismiss);
      window.removeEventListener('mousedown', handleTriggerDismiss);
      window.removeEventListener('touchstart', handleTriggerDismiss);
    };
  }, [onDismiss]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 w-screen h-screen z-[99999] select-none bg-black overflow-hidden flex flex-col justify-between">
      {/* Edge-to-Edge Fullscreen Video */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={() => onEnded?.()}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/intro-video.mp4"
      />

      {/* Subtle Fullscreen Sci-Fi HUD Border Accents */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#c9a96e] z-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#c9a96e] z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#c9a96e] z-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#c9a96e] z-30 pointer-events-none" />

      {/* Top HUD Header Bar */}
      <div className="relative z-30 w-full p-6 sm:p-8 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a96e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#c9a96e]"></span>
          </span>
          <span className="text-[#c9a96e] text-xs sm:text-sm font-black tracking-widest uppercase flex items-center gap-2 drop-shadow-md">
            <Sparkles className="w-4 h-4 text-[#c9a96e]" />
            CREATO4 LAB // CINEMATIC INTRO
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Time Code */}
          <span className="text-white/80 font-mono text-xs sm:text-sm bg-black/70 px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Sound Toggle Button */}
          {onToggleSound && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSound();
              }}
              className="sound-toggle-btn flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e]/50 text-[#c9a96e] hover:bg-[#c9a96e] hover:text-black transition-all text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg z-40"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
            </button>
          )}

          {/* Turn Off Button */}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="px-5 py-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white border border-red-400 transition-all text-xs font-black uppercase tracking-wider cursor-pointer shadow-xl z-40"
            >
              Turn Off ✕
            </button>
          )}
        </div>
      </div>

      {/* Center Interactive Screen Prompt */}
      <div className="relative z-30 w-full flex items-center justify-center p-4 pointer-events-none mb-12">
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border border-[#c9a96e]/40 text-[#c9a96e] text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-2xl animate-pulse">
          <MousePointerClick className="w-5 h-5 text-[#c9a96e]" />
          <span>PRESS ANY KEY, CLICK OR TOUCH TO ENTER</span>
        </div>
      </div>

      {/* Bottom Fullscreen Progress Bar */}
      <div className="relative z-30 w-full p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
        <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#10b981] via-[#c9a96e] to-[#f59e0b] rounded-full transition-all duration-150 shadow-[0_0_15px_#c9a96e]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

    </div>
  );
};
