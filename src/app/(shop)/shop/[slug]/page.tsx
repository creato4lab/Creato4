import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/actions/product';
import { ArrowLeft, Check, AlertTriangle, ShieldCheck, Download, Cpu, Code } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { product } = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found - Creato4 Lab' };
  
  return {
    title: `${product.title} — Creato4 Lab`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { product, error } = await getProductBySlug(params.slug);

  if (error || !product) {
    notFound();
  }

  // Calculate pricing tiers for the UI based on base price
  const basePrice = product.price;
  const commercialPrice = Math.round(basePrice * 2.5);
  const enterprisePrice = Math.round(basePrice * 8);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-24">
      
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-8">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-[#1A3C2F]/60 hover:text-[#1A3C2F] text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Column: Media & Details */}
        <div className="flex-1 space-y-12">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#1A3C2F]/5 text-[#1A3C2F] text-[0.65rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#1A3C2F]/10">
                {product.category.replace('_', ' ')}
              </span>
              <span className={`text-[0.65rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                product.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700' :
                product.difficulty === 'INTERMEDIATE' ? 'bg-blue-100 text-blue-700' :
                product.difficulty === 'ADVANCED' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {product.difficulty}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A3C2F] tracking-tight leading-tight mb-6">
              {product.title}
            </h1>
            <p className="text-[#1A3C2F]/70 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Media Gallery Placeholder */}
          <div className="aspect-[16/9] bg-[#1A3C2F]/5 rounded-3xl border border-[#1A3C2F]/10 flex flex-col items-center justify-center overflow-hidden">
            <Cpu className="w-16 h-16 text-[#1A3C2F]/20 mb-4" />
            <p className="text-[#1A3C2F]/40 font-mono text-sm uppercase tracking-widest">Media Gallery</p>
          </div>

          {/* Technical Specifications */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-[#1A3C2F]/10 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A3C2F] mb-6 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#C4A35A]" /> Hardware Requirements
              </h3>
              <ul className="space-y-3">
                {product.hardwareUsed.map((hw, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[#1A3C2F]/75">
                    <span className="text-[#C4A35A] shrink-0">•</span> {hw}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-[#1A3C2F]/10 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A3C2F] mb-6 flex items-center gap-2">
                <Code className="w-4 h-4 text-[#C4A35A]" /> Software Stack
              </h3>
              <ul className="space-y-3">
                {product.softwareUsed.map((sw, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[#1A3C2F]/75">
                    <span className="text-[#C4A35A] shrink-0">•</span> {sw}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What's Included & Warnings */}
          <div className="space-y-6">
            <div className="bg-[#1A3C2F] text-[#FAF8F5] p-8 rounded-3xl">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#C4A35A] mb-6">What's Included in Download</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {product.whatsIncluded.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {product.safetyWarning && (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900 mb-1">Safety Warning</h4>
                  <p className="text-sm text-amber-800 leading-relaxed">{product.safetyWarning}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Checkout / License Picker */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-32 bg-white border border-[#1A3C2F]/10 rounded-3xl shadow-[0_20px_40px_-15px_rgba(26,60,47,0.1)] p-6 sm:p-8">
            
            <h2 className="text-xl font-black text-[#1A3C2F] mb-6">Select License</h2>
            
            <div className="space-y-4 mb-8">
              {/* Student Tier (Selected by default for UI mockup) */}
              <label className="relative flex cursor-pointer p-4 rounded-2xl border-2 border-[#1A3C2F] bg-[#1A3C2F]/5 transition-all">
                <input type="radio" name="license" value="STUDENT" className="peer sr-only" defaultChecked />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-[#1A3C2F]">Student</span>
                    <span className="font-black text-lg text-[#1A3C2F]">₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-[#1A3C2F]/60 pr-6">Personal projects & academic use only. No commercial distribution.</p>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-[#1A3C2F] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1A3C2F]"></div>
                </div>
              </label>

              {/* Commercial Tier */}
              <label className="relative flex cursor-pointer p-4 rounded-2xl border-2 border-transparent hover:border-[#1A3C2F]/20 transition-all">
                <input type="radio" name="license" value="COMMERCIAL" className="peer sr-only" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-[#1A3C2F]">Commercial</span>
                    <span className="font-black text-lg text-[#1A3C2F]">₹{commercialPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-[#1A3C2F]/60 pr-6">Use in up to 3 client projects. Internal team use (up to 5 users).</p>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-[#1A3C2F]/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-transparent peer-checked:bg-[#1A3C2F]"></div>
                </div>
              </label>

              {/* Enterprise Tier */}
              <label className="relative flex cursor-pointer p-4 rounded-2xl border-2 border-transparent hover:border-[#1A3C2F]/20 transition-all">
                <input type="radio" name="license" value="ENTERPRISE" className="peer sr-only" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-[#1A3C2F]">Enterprise</span>
                    <span className="font-black text-lg text-[#1A3C2F]">₹{enterprisePrice.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-[#1A3C2F]/60 pr-6">Unlimited projects within a single legal entity.</p>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-[#1A3C2F]/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-transparent peer-checked:bg-[#1A3C2F]"></div>
                </div>
              </label>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-[#1A3C2F] text-[#FAF8F5] py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity mb-4">
              <Download className="w-4 h-4" />
              Proceed to Checkout
            </button>

            <div className="text-center">
              <Link href="/eula" className="text-xs text-[#1A3C2F]/50 hover:text-[#C4A35A] transition-colors underline underline-offset-2">
                Read End User License Agreement (EULA)
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-[#1A3C2F]/10 space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#1A3C2F]/70">
                <ShieldCheck className="w-4 h-4 text-green-600" /> Secure Payment via Razorpay
              </div>
              <div className="flex items-center gap-3 text-xs text-[#1A3C2F]/70">
                <Download className="w-4 h-4 text-[#C4A35A]" /> Instant Digital Delivery
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
