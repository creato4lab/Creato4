"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";

interface ProductVideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function ProductVideoPlayer({ videoUrl, title }: ProductVideoPlayerProps) {
  const [error, setError] = useState(false);

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
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#1A3C2F]/10 bg-black shadow-lg">
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
    <div className="w-full rounded-2xl overflow-hidden border border-[#1A3C2F]/15 bg-black shadow-xl flex items-center justify-center min-h-[320px] max-h-[580px] p-2">
      <video
        src={mediaSrc}
        controls
        controlsList="nodownload"
        playsInline
        preload="auto"
        onError={() => setError(true)}
        className="w-full max-h-[560px] object-contain rounded-xl"
      />
    </div>
  );
}
