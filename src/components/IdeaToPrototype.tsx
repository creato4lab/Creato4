'use client';
import React, { useRef, useEffect } from 'react';

interface IdeaToPrototypeProps {
  onEnded?: () => void;
  isMuted?: boolean;
  onToggleSound?: () => void;
  onDismiss?: () => void;
}

export const IdeaToPrototype: React.FC<IdeaToPrototypeProps> = ({
  onEnded,
  isMuted = false,
  onDismiss,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play video with sound enabled by default
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If browser blocks unmuted autoplay, play muted & unmute on first user click/touch
        video.muted = true;
        video.play().catch(() => {});

        const unmuteOnInteraction = () => {
          if (videoRef.current) {
            videoRef.current.muted = false;
          }
          window.removeEventListener('click', unmuteOnInteraction);
          window.removeEventListener('keydown', unmuteOnInteraction);
          window.removeEventListener('touchstart', unmuteOnInteraction);
        };

        window.addEventListener('click', unmuteOnInteraction, { once: true });
        window.addEventListener('keydown', unmuteOnInteraction, { once: true });
        window.addEventListener('touchstart', unmuteOnInteraction, { once: true });
      });
    }
  }, [isMuted]);

  // Global event listeners: ANY key press, ANY mouse click, or ANY touch event turns off the splash screen!
  useEffect(() => {
    const handleTriggerDismiss = () => {
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

  return (
    <div className="fixed inset-0 w-screen h-screen z-[99999] select-none bg-black overflow-hidden flex items-center justify-center">
      {/* 100% Pure Edge-to-Edge Fullscreen Video (No overlays, notices, or text) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        onEnded={() => onEnded?.()}
        className="w-full h-full object-cover"
        src="/videos/intro-video.mp4"
      />
    </div>
  );
};
