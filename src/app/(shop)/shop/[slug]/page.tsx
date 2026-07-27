import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/actions/product";
import {
  ArrowLeft, Check, AlertTriangle, Cpu, Code, Download,
  Tag, CalendarDays, History, Layers, Zap, Star, Package,
  GitBranch, Shield
} from "lucide-react";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductFAQ } from "@/components/ProductFAQ";
import { RelatedProducts } from "@/components/RelatedProducts";
import { PurchaseOptions } from "@/components/PurchaseOptions";
import { RatingStars } from "@/components/RatingStars";
import { PcbViewer3D } from "@/components/PcbViewer3D";
import { SITE_CONFIG } from "@/lib/constants";
import { generateProductSchema } from "@/lib/schemas";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { product } = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found — Creato4 Lab" };
  const canonicalUrl = `${SITE_CONFIG.url}/shop/${params.slug}`;
  return {
    title: `${product.title} — Creato4 Lab`,
    description: product.shortDescription || product.description.slice(0, 160),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${product.title} — Creato4 Lab`,
      description: product.shortDescription || product.description.slice(0, 160),
      url: canonicalUrl,
      type: "article",
      images: product.images?.length > 0 ? product.images : [`${SITE_CONFIG.url}/creato4-full-brand.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} — Creato4 Lab`,
      description: product.shortDescription || product.description.slice(0, 160),
      images: product.images?.length > 0 ? product.images : [`${SITE_CONFIG.url}/creato4-full-brand.png`],
    },
  };
}

const DIFFICULTY_COLOR: Record<string, string> = {
  BEGINNER:     "bg-green-100 text-green-700 border-green-200",
  INTERMEDIATE: "bg-blue-100 text-blue-700 border-blue-200",
  ADVANCED:     "bg-orange-100 text-orange-700 border-orange-200",
  EXPERT:       "bg-red-100 text-red-700 border-red-200",
};

const CATEGORY_COLOR: Record<string, string> = {
  ARDUINO:       "bg-teal-100 text-teal-700",
  ESP32:         "bg-blue-100 text-blue-700",
  STM32:         "bg-purple-100 text-purple-700",
  RASPBERRY_PI:  "bg-red-100 text-red-700",
  PCB_DESIGN:    "bg-yellow-100 text-yellow-700",
  CAD_MODEL:     "bg-orange-100 text-orange-700",
  EMBEDDED_CODE: "bg-indigo-100 text-indigo-700",
  COURSE:        "bg-green-100 text-green-700",
};

// Static placeholder reviews for Phase 1
const PLACEHOLDER_REVIEWS = [
  { name: "Rahul M.", rating: 5, title: "Excellent documentation!", body: "Best engineering blueprint I've purchased. The setup guide was crystal clear and the code is very clean.", verified: true, date: "2 weeks ago" },
  { name: "Priya S.", rating: 5, title: "Works out of the box", body: "Followed the guide step by step and had it running in under an hour. Highly recommend for students.", verified: true, date: "1 month ago" },
  { name: "Arjun K.", rating: 4, title: "Great code quality", body: "The source code is well-commented and modular. Would love a video walkthrough in future updates.", verified: false, date: "2 months ago" },
];

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { product, error } = await getProductBySlug(params.slug);

  if (error || !product) notFound();

  const { products: relatedProducts } = await getRelatedProducts(product.id, product.category as any, 3);

  const faqs = Array.isArray(product.faqs) ? (product.faqs as any[]) : [];
  const versionHistory = Array.isArray(product.versionHistory) ? (product.versionHistory as any[]) : [];

  const productSchema = generateProductSchema({
    name: product.title,
    description: product.shortDescription || product.description,
    price: product.price,
    slug: product.slug,
    category: product.category,
    image: product.images?.[0] || `${SITE_CONFIG.url}/creato4-full-brand.png`,
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-[#1A3C2F]/8 pt-24 pb-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-3">
          <div className="flex items-center gap-2 text-xs text-[#1A3C2F]/50">
            <Link href="/" className="hover:text-[#1A3C2F] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#1A3C2F] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#1A3C2F] font-semibold truncate max-w-[200px]">{product.title}</span>
          </div>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <div className="bg-white border-b border-[#1A3C2F]/8 pb-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#1A3C2F]/50 hover:text-[#1A3C2F] text-sm font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left: title & meta */}
            <div className="flex-1">
              {/* Badge row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-[0.65rem] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${CATEGORY_COLOR[product.category] || "bg-gray-100 text-gray-600"}`}>
                  {product.category.replace(/_/g, " ")}
                </span>
                <span className={`text-[0.65rem] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${DIFFICULTY_COLOR[product.difficulty] || "bg-gray-100 text-gray-600"}`}>
                  {product.difficulty}
                </span>
                {product.version && (
                  <span className="text-[0.65rem] font-mono bg-[#1A3C2F]/5 text-[#1A3C2F]/60 px-3 py-1.5 rounded-full border border-[#1A3C2F]/10">
                    {product.version}
                  </span>
                )}
                {product.lastUpdated && (
                  <span className="text-[0.65rem] text-[#1A3C2F]/40 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    Updated {new Date(product.lastUpdated).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A3C2F] tracking-tight leading-tight mb-4">
                {product.title}
              </h1>
              <p className="text-[#1A3C2F]/65 text-lg leading-relaxed mb-6 max-w-2xl">
                {product.shortDescription || product.description}
              </p>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  <Tag className="w-3.5 h-3.5 text-[#1A3C2F]/30 mt-0.5" />
                  {product.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/shop?tag=${tag}`}
                      className="text-xs font-semibold bg-[#1A3C2F]/5 text-[#1A3C2F]/60 hover:bg-[#1A3C2F]/10 px-2.5 py-1 rounded-full transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Stats bar */}
              <div className="flex flex-wrap items-center gap-6">
                {product.rating > 0 && (
                  <div>
                    <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-[#1A3C2F]/50">
                  <Download className="w-4 h-4" />
                  <span className="font-bold text-[#1A3C2F]">{product.downloadCount?.toLocaleString() || 0}</span> downloads
                </div>
                {product.hardwareUsed?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-[#1A3C2F]/50">
                    <Cpu className="w-4 h-4" />
                    {product.hardwareUsed.length} components
                  </div>
                )}
              </div>
            </div>

            {/* Right: price preview on hero */}
            <div className="lg:w-72 shrink-0">
              <div className="bg-[#1A3C2F]/[0.03] border border-[#1A3C2F]/10 rounded-2xl p-5">
                <p className="text-xs text-[#1A3C2F]/40 mb-1">Starting from</p>
                <p className="text-4xl font-black text-[#1A3C2F] mb-1">
                  ₹{Math.round(product.price * 0.35).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-[#1A3C2F]/40 mb-4">Full package: ₹{product.price.toLocaleString("en-IN")}</p>
                <Link
                  href="#purchase"
                  className="w-full flex items-center justify-center gap-2 bg-[#1A3C2F] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#C4A35A] transition-colors"
                >
                  <Package className="w-4 h-4" /> Choose Package
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── Left Column ── */}
          <div className="flex-1 min-w-0 space-y-12">

            {/* 1. Image Gallery */}
            <section>
              <ProductImageGallery images={product.images || []} title={product.title} />
            </section>

            {/* 2. Video Demo */}
            {product.videoUrl && (
              <section>
                <SectionHeader icon={<Zap className="w-4 h-4 text-[#C4A35A]" />} title="Video Demo" />
                <div className="aspect-video rounded-2xl overflow-hidden border border-[#1A3C2F]/10">
                  <iframe
                    src={product.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {/* 3. Full Description */}
            <section>
              <SectionHeader icon={<Code className="w-4 h-4 text-[#C4A35A]" />} title="About This Project" />
              <p className="text-[#1A3C2F]/70 leading-relaxed text-base">{product.description}</p>
            </section>

            {/* 4. Features */}
            {product.features?.length > 0 && (
              <section>
                <SectionHeader icon={<Star className="w-4 h-4 text-[#C4A35A]" />} title="Key Features" />
                <div className="grid sm:grid-cols-2 gap-3">
                  {product.features.map((feat: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#1A3C2F]/8">
                      <div className="w-5 h-5 rounded-full bg-[#C4A35A]/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#C4A35A]" />
                      </div>
                      <span className="text-sm text-[#1A3C2F]/80 leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Product Demo Video */}
            {product.videoUrl && (
              <section>
                <SectionHeader icon={<Zap className="w-4 h-4 text-[#C4A35A]" />} title="Product Demo Video" />
                <div className="rounded-2xl overflow-hidden border border-[#1A3C2F]/10 bg-black aspect-video shadow-md">
                  {product.videoUrl.includes("youtube.com") || product.videoUrl.includes("youtu.be") || product.videoUrl.includes("vimeo.com") ? (
                    <iframe
                      src={
                        product.videoUrl.includes("watch?v=")
                          ? product.videoUrl.replace("watch?v=", "embed/")
                          : product.videoUrl
                      }
                      title={`${product.title} Demo Video`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={
                        product.videoUrl.startsWith("http")
                          ? product.videoUrl
                          : `/api/download?productId=${product.id}&fileType=video`
                      }
                      controls
                      controlsList="nodownload"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </section>
            )}

            {/* 5. Technical Specifications */}
            <section>
              <SectionHeader icon={<Cpu className="w-4 h-4 text-[#C4A35A]" />} title="Technical Specifications" />
              <div className="grid sm:grid-cols-2 gap-6">
                {product.hardwareUsed?.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-[#1A3C2F]/8 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#1A3C2F] mb-4 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#C4A35A]" /> Hardware Requirements
                    </h3>
                    <ul className="space-y-2.5">
                      {product.hardwareUsed.map((hw: string, i: number) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm text-[#1A3C2F]/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C4A35A] shrink-0" />
                          {hw}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.softwareUsed?.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-[#1A3C2F]/8 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#1A3C2F] mb-4 flex items-center gap-2">
                      <Code className="w-4 h-4 text-[#C4A35A]" /> Software Stack
                    </h3>
                    <ul className="space-y-2.5">
                      {product.softwareUsed.map((sw: string, i: number) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm text-[#1A3C2F]/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C4A35A] shrink-0" />
                          {sw}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* 6. Compatible Boards */}
            {product.compatibleBoards?.length > 0 && (
              <section>
                <SectionHeader icon={<Layers className="w-4 h-4 text-[#C4A35A]" />} title="Compatible Hardware" />
                <div className="flex flex-wrap gap-3">
                  {product.compatibleBoards.map((board: string, i: number) => (
                    <div key={i} className="flex items-center gap-2.5 bg-white border border-[#1A3C2F]/10 rounded-xl px-4 py-3 shadow-sm">
                      <Cpu className="w-4 h-4 text-[#C4A35A]" />
                      <span className="text-sm font-semibold text-[#1A3C2F]">{board}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 7. 3D PCB Gerber Inspection */}
            {(product.pcbGerberPath || product.pcbPreviewImage || product.category === 'PCB_DESIGN' || product.category === 'ARDUINO' || product.category === 'ESP32') && (
              <section>
                <SectionHeader icon={<Layers className="w-4 h-4 text-[#C4A35A]" />} title="3D Interactive PCB Inspection" />
                <PcbViewer3D boardTitle={`${product.title} PCB`} pcbImage={product.pcbPreviewImage} />
              </section>
            )}

            {/* 8. PCB Preview Image */}
            {product.pcbPreviewImage && (
              <section>
                <SectionHeader icon={<Layers className="w-4 h-4 text-[#C4A35A]" />} title="PCB Photo Preview" />
                <div className="rounded-2xl overflow-hidden border border-[#1A3C2F]/10 bg-white">
                  <img src={product.pcbPreviewImage} alt="PCB Preview" className="w-full object-contain max-h-96" />
                </div>
              </section>
            )}

            {/* 8. CAD Preview */}
            {product.cadPreviewImage && (
              <section>
                <SectionHeader icon={<Layers className="w-4 h-4 text-[#C4A35A]" />} title="CAD Model Preview" />
                <div className="rounded-2xl overflow-hidden border border-[#1A3C2F]/10 bg-white">
                  <img src={product.cadPreviewImage} alt="CAD Preview" className="w-full object-contain max-h-96" />
                </div>
              </section>
            )}

            {/* 9. What's Included */}
            {product.whatsIncluded?.length > 0 && (
              <section>
                <SectionHeader icon={<Package className="w-4 h-4 text-[#C4A35A]" />} title="What's Included" />
                <div className="bg-[#1A3C2F] rounded-2xl p-7">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {product.whatsIncluded.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-sm text-[#FAF8F5]/90 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 10. Safety Warning */}
            {product.safetyWarning && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900 mb-1">⚠ Safety Warning</h4>
                  <p className="text-sm text-amber-800 leading-relaxed">{product.safetyWarning}</p>
                </div>
              </div>
            )}

            {/* 11. FAQs */}
            {faqs.length > 0 && (
              <section>
                <SectionHeader icon={<Shield className="w-4 h-4 text-[#C4A35A]" />} title="Frequently Asked Questions" />
                <ProductFAQ faqs={faqs} />
              </section>
            )}

            {/* 12. Customer Reviews (static placeholder) */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <SectionHeader icon={<Star className="w-4 h-4 text-[#C4A35A]" />} title="Customer Reviews" noMargin />
                <div className="flex items-center gap-3">
                  <RatingStars rating={product.rating || 4.7} reviewCount={product.reviewCount || 3} size="sm" />
                </div>
              </div>
              <div className="space-y-4">
                {PLACEHOLDER_REVIEWS.map((review, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#1A3C2F]/8 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-[#1A3C2F]">{review.name}</span>
                          {review.verified && (
                            <span className="text-[0.6rem] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RatingStars rating={review.rating} size="sm" showNumber={false} />
                          <span className="text-xs font-bold text-[#1A3C2F]/70">{review.title}</span>
                        </div>
                      </div>
                      <span className="text-xs text-[#1A3C2F]/35">{review.date}</span>
                    </div>
                    <p className="text-sm text-[#1A3C2F]/65 leading-relaxed">{review.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 13. Version History */}
            {versionHistory.length > 0 && (
              <section>
                <SectionHeader icon={<GitBranch className="w-4 h-4 text-[#C4A35A]" />} title="Version History" />
                <div className="space-y-3">
                  {versionHistory.map((v: any, i: number) => (
                    <div key={i} className="flex gap-4 bg-white rounded-xl border border-[#1A3C2F]/8 p-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-[#C4A35A]" : "bg-[#1A3C2F]/20"} mt-1 shrink-0`} />
                        {i < versionHistory.length - 1 && <div className="w-px flex-1 bg-[#1A3C2F]/10 mt-2" />}
                      </div>
                      <div className="pb-2">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-black font-mono text-[#1A3C2F]">{v.version}</span>
                          <span className="text-xs text-[#1A3C2F]/40 flex items-center gap-1">
                            <History className="w-3 h-3" /> {v.date}
                          </span>
                        </div>
                        <p className="text-sm text-[#1A3C2F]/65">{v.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 14. Related Products */}
            {relatedProducts.length > 0 && (
              <section>
                <SectionHeader icon={<Tag className="w-4 h-4 text-[#C4A35A]" />} title="Related Products" />
                <RelatedProducts products={relatedProducts as any} />
              </section>
            )}
          </div>

          {/* ── Right Column: Purchase Options (Sticky) ── */}
          <div id="purchase" className="w-full lg:w-[380px] shrink-0">
            <PurchaseOptions
              productId={product.id}
              productName={product.title}
              basePrice={product.price}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small helper component ──────────────────────────────
function SectionHeader({
  icon, title, noMargin = false
}: { icon: React.ReactNode; title: string; noMargin?: boolean }) {
  return (
    <h2 className={`flex items-center gap-2 text-base font-black text-[#1A3C2F] uppercase tracking-wide ${noMargin ? "" : "mb-5"}`}>
      {icon}
      {title}
    </h2>
  );
}
