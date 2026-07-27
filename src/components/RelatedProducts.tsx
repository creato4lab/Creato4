import React from "react";
import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";
import { RatingStars } from "./RatingStars";

interface RelatedProduct {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  price: number;
  category: string;
  difficulty: string;
  rating: number;
  reviewCount: number;
  images: string[];
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const difficultyColor: Record<string, string> = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-blue-100 text-blue-700",
  ADVANCED: "bg-orange-100 text-orange-700",
  EXPERT: "bg-red-100 text-red-700",
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/shop/${product.slug}`}
          className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#1A3C2F]/8 hover:border-[#C4A35A]/50 hover:shadow-xl hover:shadow-[#C4A35A]/10 transition-all duration-300"
        >
          {/* Image */}
          <div className="aspect-[4/3] bg-[#1A3C2F]/5 relative overflow-hidden flex items-center justify-center">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <ImageIcon className="w-12 h-12 text-[#1A3C2F]/20" />
            )}
            <span
              className={`absolute top-3 right-3 text-[0.6rem] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                difficultyColor[product.difficulty] || "bg-gray-100 text-gray-600"
              }`}
            >
              {product.difficulty}
            </span>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <span className="text-[0.65rem] uppercase font-bold tracking-widest text-[#5C6B60] mb-1">
              {product.category.replace(/_/g, " ")}
            </span>
            <h4 className="text-sm font-bold text-[#1A3C2F] mb-1.5 leading-snug group-hover:text-[#C4A35A] transition-colors line-clamp-2">
              {product.title}
            </h4>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
            <div className="flex items-center justify-between mt-auto pt-3">
              <span className="text-base font-extrabold text-[#1A3C2F]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-[#C4A35A] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                View <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
