"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";

interface ProductVideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function ProductVideoPlayer({ videoUrl, title }: ProductVideoPlayerProps) {
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isEmbed =
    videoUrl.includes("youtube.com") ||
    videoUrl.includes("youtu.be") ||
    videoUrl.includes("vimeo.com");

  if (isEmbed) {
    let embedSrc = videoUrl;
    if (videoUrl.includes("watch?v=")) {
      embedSrc = videoUrl.replace("watch?v=", "embed/");
    } else if (videoUrl.includes("youtu.be/")) {
      const id = videoUrl.split("youtu.be/")[1]?.split("?")[0];
      embedSrc = `https://www.youtube.com/embed/${id}`;
    }

    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#1A3C2F]/10 bg-black shadow-md">
        <iframe
          src={embedSrc}
          title={`${title} Demo Video`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  const mediaSrc = getImageUrl(videoUrl);

  if (error) {
    return (
      <div className="w-full h-48 bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-[#1A3C2F]/50">
        <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
        <p className="text-sm font-bold text-[#1A3C2F]">Unable to load video</p>
        <p className="text-xs text-[#1A3C2F]/50 mt-1">Check video URL or file format.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#1A3C2F]/10 bg-black/90 shadow-xl flex items-center justify-center min-h-[300px] max-h-[600px] group">
      {/* Ambient Blurred Backdrop for vertical/portrait videos */}
      <video
        src={mediaSrc}
        className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 pointer-events-none scale-110"
        aria-hidden="true"
        muted
        loop
        playsInline
      />

      {/* Main Video Element */}
      <video
        ref={videoRef}
        src={mediaSrc}
        controls
        controlsList="nodownload"
        playsInline
        preload="metadata"
        onError={() => setError(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="relative z-10 w-full max-h-[580px] object-contain rounded-xl shadow-2xl"
      />
    </div>
  );
}
