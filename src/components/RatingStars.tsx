"use client";
import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number; // e.g. 4.7
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export function RatingStars({ rating, reviewCount, size = "md", showNumber = true }: RatingStarsProps) {
  const sizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };
  const starSize = sizes[size];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.min(Math.max(rating - (star - 1), 0), 1);
          return (
            <span key={star} className="relative inline-block">
              {/* Empty star */}
              <Star className={`${starSize} text-[#1A3C2F]/15`} fill="currentColor" />
              {/* Filled portion */}
              {fill > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star className={`${starSize} text-[#C4A35A]`} fill="currentColor" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showNumber && (
        <span className={`${textSizes[size]} font-bold text-[#1A3C2F]`}>{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className={`${textSizes[size]} text-[#1A3C2F]/50`}>({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
