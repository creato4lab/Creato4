"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createProduct } from '@/actions/admin';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    
    const result = await createProduct(data as Parameters<typeof createProduct>[0]);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/admin/products');
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 bg-white rounded-xl shadow-sm border border-[#1A3C2F]/10 hover:bg-[#FAF8F5] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1A3C2F]" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#1A3C2F] tracking-tight">Create New Product</h1>
          <p className="text-[#1A3C2F]/60 text-sm font-medium">Add a new digital asset to the Creato4 Lab catalog.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#1A3C2F]/10 overflow-hidden max-w-4xl">
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#1A3C2F]/40 border-b border-[#1A3C2F]/5 pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Product Title *</label>
                <input required type="text" name="title" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" placeholder="e.g., STM32 Motor Controller" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Base Price (INR) *</label>
                <input required type="number" min="0" name="price" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" placeholder="e.g., 499" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Short Description *</label>
              <input required type="text" name="shortDescription" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" placeholder="A catchy 1-sentence summary..." />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Full Description *</label>
              <textarea required name="description" rows={5} className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" placeholder="Detailed explanation of the project, features, and capabilities..."></textarea>
            </div>
          </div>

          {/* Categorization */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#1A3C2F]/40 border-b border-[#1A3C2F]/5 pb-2">Categorization</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Category *</label>
                <select name="category" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]">
                  <option value="ARDUINO">Arduino</option>
                  <option value="ESP32">ESP32</option>
                  <option value="STM32">STM32</option>
                  <option value="RASPBERRY_PI">Raspberry Pi</option>
                  <option value="PCB_DESIGN">PCB Design</option>
                  <option value="CAD_MODEL">CAD Model</option>
                  <option value="EMBEDDED_CODE">Embedded Code</option>
                  <option value="COURSE">Course</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Difficulty *</label>
                <select name="difficulty" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]">
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#1A3C2F]/40 border-b border-[#1A3C2F]/5 pb-2">Technical Details</h2>
            
            <div>
              <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Hardware Used (Comma separated)</label>
              <input type="text" name="hardwareUsed" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" placeholder="e.g., STM32F401, DRV8302, 12V LiPo..." />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Software Used (Comma separated)</label>
              <input type="text" name="softwareUsed" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" placeholder="e.g., STM32CubeIDE, Altium Designer, C++..." />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">What's Included? (Comma separated)</label>
              <input type="text" name="whatsIncluded" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" placeholder="e.g., Source Code, Altium Project Files, 3D STEP files..." />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Image URLs (Comma separated)</label>
              <input type="text" name="images" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
            </div>
          </div>

          {/* Secure File Delivery (S3 Keys) */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#1A3C2F]/40 border-b border-[#1A3C2F]/5 pb-2">Digital Delivery (S3 Keys)</h2>
            <p className="text-xs text-[#1A3C2F]/50">Enter the exact S3 object keys (file paths) where these digital assets are stored. Buyers will receive a secure 5-minute presigned download link to these files.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Source Code Key</label>
                <input type="text" name="sourceCodePath" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" placeholder="e.g., projects/drone/source.zip" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">CAD File Key</label>
                <input type="text" name="cadFilePath" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" placeholder="e.g., projects/drone/cad.step" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">PDF Doc Key</label>
                <input type="text" name="pdfDocPath" className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" placeholder="e.g., projects/drone/guide.pdf" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1A3C2F]/5 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 bg-[#1A3C2F] text-[#FAF8F5] px-8 py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Saving Product..." : "Create Product"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
