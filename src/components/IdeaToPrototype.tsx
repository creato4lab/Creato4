'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles } from 'lucide-react';

interface IdeaToPrototypeProps {
  onEnded?: () => void;
  isMuted?: boolean;
  onToggleSound?: () => void;
  onSkip?: () => void;
}

export const IdeaToPrototype: React.FC<IdeaToPrototypeProps> = ({
  onEnded,
  isMuted = true,
  onToggleSound,
  onSkip,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoaded(true);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 select-none">
      {/* Outer Glow & Background */}
      <div className="absolute inset-0 bg-[#030507] radial-gradient(ellipse at center, #11261d 0%, #030507 80%)" />

      {/* Futuristic HUD Cinema Frame Container */}
      <div className="relative w-full max-w-[1280px] aspect-video bg-black/90 rounded-2xl sm:rounded-3xl border border-[#c9a96e]/30 shadow-[0_0_80px_rgba(201,169,110,0.15)] overflow-hidden flex flex-col justify-between group">
        
        {/* Frame Sci-Fi Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c9a96e] rounded-tl-2xl z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#c9a96e] rounded-tr-2xl z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#c9a96e] rounded-bl-2xl z-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#c9a96e] rounded-br-2xl z-30 pointer-events-none" />

        {/* Top HUD Status Bar */}
        <div className="relative z-20 w-full p-4 sm:p-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a96e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c9a96e]"></span>
            </span>
            <span className="text-[#c9a96e] text-xs sm:text-sm font-black tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c9a96e]" />
              CREATO4 // CINEMATIC INTRO
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timestamp */}
            <span className="text-white/70 font-mono text-xs sm:text-sm bg-black/60 px-3 py-1 rounded-full border border-white/10">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Sound Toggle Button */}
            {onToggleSound && (
              <button
                onClick={onToggleSound}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/40 text-[#c9a96e] hover:bg-[#c9a96e] hover:text-black transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMuted ? 'Sound Off' : 'Sound On'}</span>
              </button>
            )}

            {/* Turn Off / Skip Button */}
            {onSkip && (
              <button
                onClick={onSkip}
                className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-red-500/80 hover:border-red-500 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Turn Off ✕
              </button>
            )}
          </div>
        </div>

        {/* Center Video Viewport */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            playsInline
            onEnded={() => onEnded?.()}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-cover"
            src="/videos/intro-video.mp4"
          />

          {/* Interactive Play/Pause Overlay on Click */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all cursor-pointer group/btn"
          >
            {!isPlaying && (
              <div className="p-4 rounded-full bg-[#c9a96e]/90 text-black shadow-2xl transform scale-110 group-hover/btn:scale-125 transition-all">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            )}
          </button>
        </div>

        {/* Bottom HUD Progress Bar */}
        <div className="relative z-20 w-full p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#10b981] via-[#c9a96e] to-[#f59e0b] rounded-full transition-all duration-150 shadow-[0_0_12px_#c9a96e]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
