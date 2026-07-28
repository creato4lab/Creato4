import React from "react";
import Link from "next/link";
import { getProducts, getAllTags } from "@/actions/product";
import { ProductCategory, Difficulty } from "@/generated/prisma/client";
import {
  Search, SlidersHorizontal, Cpu, Code, BookOpen, Layers,
  Download, Tag, Star, ArrowRight, ImageIcon, TrendingUp, Clock, DollarSign
} from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";

export const metadata = {
  title: "Engineering Products Catalog — Creato4 Lab",
  description:
    "Browse production-ready engineering blueprints, embedded source code, PCB designs, CAD models, and project reports.",
};

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  ARDUINO:       { label: "Arduino",        icon: <Cpu className="w-3.5 h-3.5" />,      color: "bg-teal-100 text-teal-700" },
  ESP32:         { label: "ESP32",          icon: <Cpu className="w-3.5 h-3.5" />,      color: "bg-blue-100 text-blue-700" },
  STM32:         { label: "STM32",          icon: <Cpu className="w-3.5 h-3.5" />,      color: "bg-purple-100 text-purple-700" },
  RASPBERRY_PI:  { label: "Raspberry Pi",   icon: <Cpu className="w-3.5 h-3.5" />,      color: "bg-red-100 text-red-700" },
  PCB_DESIGN:    { label: "PCB Design",     icon: <Layers className="w-3.5 h-3.5" />,   color: "bg-yellow-100 text-yellow-700" },
  CAD_MODEL:     { label: "CAD Model",      icon: <Layers className="w-3.5 h-3.5" />,   color: "bg-orange-100 text-orange-700" },
  EMBEDDED_CODE: { label: "Embedded Code",  icon: <Code className="w-3.5 h-3.5" />,     color: "bg-indigo-100 text-indigo-700" },
  COURSE:        { label: "Course",         icon: <BookOpen className="w-3.5 h-3.5" />, color: "bg-green-100 text-green-700" },
};

const DIFFICULTY_COLOR: Record<string, string> = {
  BEGINNER:     "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-blue-100 text-blue-700",
  ADVANCED:     "bg-orange-100 text-orange-700",
  EXPERT:       "bg-red-100 text-red-700",
};

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest",         icon: <Clock className="w-3.5 h-3.5" /> },
  { value: "popular",    label: "Most Downloaded", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { value: "rating",     label: "Top Rated",       icon: <Star className="w-3.5 h-3.5" /> },
  { value: "price_asc",  label: "Price: Low–High", icon: <DollarSign className="w-3.5 h-3.5" /> },
  { value: "price_desc", label: "Price: High–Low", icon: <DollarSign className="w-3.5 h-3.5" /> },
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? "text-[#C4A35A] fill-[#C4A35A]" : "text-[#1A3C2F]/15 fill-[#1A3C2F]/15"}`}
        />
      ))}
    </div>
  );
}

export default async function ShopPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categoryParam = searchParams.category as ProductCategory | undefined;
  const difficultyParam = searchParams.difficulty as Difficulty | undefined;
  const searchParam = searchParams.search as string | undefined;
  const tagParam = searchParams.tag as string | undefined;
  const sortParam = (searchParams.sort as string) || "newest";

  const [{ products, error }, allTags] = await Promise.all([
    getProducts({
      category: categoryParam,
      difficulty: difficultyParam,
      search: searchParam,
      tags: tagParam,
      sort: sortParam as any,
    }),
    getAllTags(),
  ]);

  const categories = Object.values(ProductCategory);
  const difficulties = Object.values(Difficulty);

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params: Record<string, string> = {};
    if (categoryParam) params.category = categoryParam;
    if (difficultyParam) params.difficulty = difficultyParam;
    if (searchParam) params.search = searchParam;
    if (tagParam) params.tag = tagParam;
    if (sortParam !== "newest") params.sort = sortParam;
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === undefined) delete params[k]; else params[k] = v;
    });
    const qs = new URLSearchParams(params).toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* ── Hero Header ── */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 bg-[#1A3C2F]/5 border border-[#1A3C2F]/10 rounded-full px-3 py-1.5 text-[#1A3C2F] text-[0.65rem] font-mono tracking-widest uppercase mb-4">
            <Tag className="w-3 h-3" /> Digital Marketplace
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#1A3C2F] tracking-tight mb-3">
            Engineering Blueprints
          </h1>
          <p className="text-[#1A3C2F]/60 max-w-2xl text-lg">
            Production-ready source code, PCB schematics, CAD models, and project reports.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Sidebar Filters ── */}
          <aside className="w-full lg:w-60 shrink-0">
            <div className="sticky top-28 space-y-7">

              {/* Search */}
              <form action="/shop" method="GET">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#1A3C2F]/35 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="search"
                    defaultValue={searchParam}
                    placeholder="Search projects..."
                    className="w-full bg-white border border-[#1A3C2F]/12 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#1A3C2F] placeholder:text-[#1A3C2F]/35 focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40 transition-shadow"
                  />
                </div>
                {categoryParam && <input type="hidden" name="category" value={categoryParam} />}
                {difficultyParam && <input type="hidden" name="difficulty" value={difficultyParam} />}
                {tagParam && <input type="hidden" name="tag" value={tagParam} />}
                {sortParam !== "newest" && <input type="hidden" name="sort" value={sortParam} />}
              </form>

              {/* Sort */}
              <div>
                <h3 className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40 mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Sort By
                </h3>
                <div className="space-y-1">
                  {SORT_OPTIONS.map((opt) => (
                    <Link
                      key={opt.value}
                      href={buildUrl({ sort: opt.value === "newest" ? undefined : opt.value })}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                        sortParam === opt.value || (!sortParam && opt.value === "newest")
                          ? "bg-[#1A3C2F] text-[#FAF8F5] font-semibold"
                          : "text-[#1A3C2F]/60 hover:bg-[#1A3C2F]/5"
                      }`}
                    >
                      {opt.icon} {opt.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40 mb-3">
                  Category
                </h3>
                <div className="space-y-1">
                  <Link
                    href={buildUrl({ category: undefined })}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                      !categoryParam ? "bg-[#1A3C2F] text-[#FAF8F5] font-semibold" : "text-[#1A3C2F]/60 hover:bg-[#1A3C2F]/5"
                    }`}
                  >
                    All Products
                  </Link>
                  {categories.map((cat) => {
                    const meta = CATEGORY_META[cat];
                    return (
                      <Link
                        key={cat}
                        href={buildUrl({ category: cat })}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                          categoryParam === cat ? "bg-[#1A3C2F] text-[#FAF8F5] font-semibold" : "text-[#1A3C2F]/60 hover:bg-[#1A3C2F]/5"
                        }`}
                      >
                        {meta?.icon}
                        {meta?.label || cat.replace(/_/g, " ")}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <h3 className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40 mb-3">
                  Difficulty
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  <Link
                    href={buildUrl({ difficulty: undefined })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      !difficultyParam ? "bg-[#1A3C2F] text-white" : "bg-[#1A3C2F]/5 text-[#1A3C2F]/60 hover:bg-[#1A3C2F]/10"
                    }`}
                  >
                    All
                  </Link>
                  {difficulties.map((diff) => (
                    <Link
                      key={diff}
                      href={buildUrl({ difficulty: diff })}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        difficultyParam === diff
                          ? "bg-[#C4A35A] text-[#1A3C2F]"
                          : "bg-[#1A3C2F]/5 text-[#1A3C2F]/60 hover:bg-[#1A3C2F]/10"
                      }`}
                    >
                      {diff}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {allTags.length > 0 && (
                <div>
                  <h3 className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40 mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {allTags.map((tag) => (
                      <Link
                        key={tag}
                        href={buildUrl({ tag: tagParam === tag ? undefined : tag })}
                        className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold transition-colors ${
                          tagParam === tag
                            ? "bg-[#1A3C2F] text-white"
                            : "bg-[#1A3C2F]/5 text-[#1A3C2F]/55 hover:bg-[#1A3C2F]/10"
                        }`}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear filters */}
              {(categoryParam || difficultyParam || tagParam || searchParam) && (
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-[#C4A35A] hover:text-[#1A3C2F] transition-colors"
                >
                  ✕ Clear all filters
                </Link>
              )}
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <main className="flex-1 min-w-0">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-6">{error}</div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[#1A3C2F]/50">
                <span className="font-bold text-[#1A3C2F]">{products.length}</span>{" "}
                {products.length === 1 ? "product" : "products"} found
              </p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-[#1A3C2F]/8 border-dashed">
                <Search className="w-10 h-10 text-[#1A3C2F]/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1A3C2F] mb-2">No products found</h3>
                <p className="text-[#1A3C2F]/50 text-sm mb-6">Try adjusting your filters or search query.</p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-2.5 bg-[#1A3C2F] text-white rounded-full text-sm font-semibold hover:bg-[#C4A35A] transition-colors"
                >
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => {
                  const catMeta = CATEGORY_META[product.category];
                  const diffColor = DIFFICULTY_COLOR[product.difficulty] || "bg-gray-100 text-gray-600";

                  return (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#1A3C2F]/8 hover:border-[#C4A35A]/40 hover:shadow-2xl hover:shadow-[#C4A35A]/8 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-[#1A3C2F]/5 to-[#1A3C2F]/10 relative overflow-hidden flex items-center justify-center">
                        {product.images?.[0] ? (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <>
                            <ImageIcon className="w-14 h-14 text-[#1A3C2F]/15" />
                          </>
                        )}
                        {/* Badges overlay */}
                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                          <span className={`text-[0.6rem] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm flex items-center gap-1 ${catMeta?.color || "bg-white text-[#1A3C2F]"}`}>
                            {catMeta?.icon}
                            {catMeta?.label || product.category.replace(/_/g, " ")}
                          </span>
                          <span className={`text-[0.6rem] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm ${diffColor}`}>
                            {product.difficulty}
                          </span>
                        </div>
                        {/* Version badge */}
                        {product.version && (
                          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[0.6rem] font-mono rounded-full px-2 py-0.5">
                            {product.version}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-sm font-bold text-[#1A3C2F] leading-snug mb-2 group-hover:text-[#C4A35A] transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-xs text-[#1A3C2F]/55 line-clamp-2 mb-3 flex-1 leading-relaxed">
                          {product.shortDescription}
                        </p>

                        {/* Tags */}
                        {product.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[0.58rem] font-semibold bg-[#1A3C2F]/5 text-[#1A3C2F]/60 px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                            {product.tags.length > 3 && (
                              <span className="text-[0.58rem] font-semibold bg-[#1A3C2F]/5 text-[#1A3C2F]/40 px-2 py-0.5 rounded-full">
                                +{product.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Tech stack pills */}
                        {product.hardwareUsed?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {[...product.hardwareUsed, ...product.softwareUsed].slice(0, 3).map((tech, i) => (
                              <span key={i} className="text-[0.58rem] font-mono bg-[#C4A35A]/10 text-[#C4A35A] px-2 py-0.5 rounded border border-[#C4A35A]/20">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Stats row */}
                        <div className="flex items-center gap-3 text-[0.65rem] text-[#1A3C2F]/45 mb-3">
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {product.downloadCount?.toLocaleString() || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <StarDisplay rating={product.rating || 0} />
                            {(product.rating || 0).toFixed(1)}
                          </span>
                          {product.version && (
                            <span className="font-mono">{product.version}</span>
                          )}
                        </div>

                        {/* Price + CTA */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#1A3C2F]/5 mt-auto">
                          <span className="text-lg font-black text-[#1A3C2F]">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs font-bold text-[#C4A35A] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
