"use client";

import React, { useState } from "react";
import { Package } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  fallbackIcon?: React.ReactNode;
}

export function SafeImage({
  src,
  alt = "",
  className = "w-full h-full object-cover",
  fallbackIcon,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#FAF8F5]">
        {fallbackIcon || <Package className="w-5 h-5 text-[#1A3C2F]/20" />}
      </div>
    );
  }

  return (
    <img
      src={getImageUrl(src)}
      alt=""
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
