"use client";

import React, { useState } from 'react';
import { ShieldCheck, Download } from 'lucide-react';
import Link from 'next/link';
import { CheckoutButton } from './CheckoutButton';

interface LicenseCheckoutProps {
  productId: string;
  productName: string;
  basePrice: number;
}

export function LicenseCheckout({ productId, productName, basePrice }: LicenseCheckoutProps) {
  const [selectedLicense, setSelectedLicense] = useState<"STUDENT" | "COMMERCIAL" | "ENTERPRISE">("STUDENT");

  const commercialPrice = Math.round(basePrice * 2.5);
  const enterprisePrice = Math.round(basePrice * 8);

  return (
    <div className="sticky top-32 bg-white border border-[#1A3C2F]/10 rounded-3xl shadow-[0_20px_40px_-15px_rgba(26,60,47,0.1)] p-6 sm:p-8">
      <h2 className="text-xl font-black text-[#1A3C2F] mb-6">Select License</h2>
      
      <div className="space-y-4 mb-8">
        {/* Student Tier */}
        <label className={`flex items-center justify-between cursor-pointer p-4 rounded-2xl border-2 transition-all ${selectedLicense === 'STUDENT' ? 'border-[#1A3C2F] bg-[#1A3C2F]/5' : 'border-[#1A3C2F]/10 hover:border-[#1A3C2F]/20'}`}>
          <input 
            type="radio" 
            name="license" 
            value="STUDENT" 
            className="peer sr-only" 
            checked={selectedLicense === 'STUDENT'}
            onChange={() => setSelectedLicense('STUDENT')}
          />
          <div className="flex-1 pr-4">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-[#1A3C2F]">Student</span>
              <span className="font-black text-lg text-[#1A3C2F]">₹{basePrice.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-[#1A3C2F]/60">Personal projects & academic use only. No commercial distribution.</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedLicense === 'STUDENT' ? 'border-[#1A3C2F]' : 'border-[#1A3C2F]/20'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${selectedLicense === 'STUDENT' ? 'bg-[#1A3C2F]' : 'bg-transparent'}`}></div>
          </div>
        </label>

        {/* Commercial Tier */}
        <label className={`flex items-center justify-between cursor-pointer p-4 rounded-2xl border-2 transition-all ${selectedLicense === 'COMMERCIAL' ? 'border-[#1A3C2F] bg-[#1A3C2F]/5' : 'border-[#1A3C2F]/10 hover:border-[#1A3C2F]/20'}`}>
          <input 
            type="radio" 
            name="license" 
            value="COMMERCIAL" 
            className="peer sr-only" 
            checked={selectedLicense === 'COMMERCIAL'}
            onChange={() => setSelectedLicense('COMMERCIAL')}
          />
          <div className="flex-1 pr-4">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-[#1A3C2F]">Commercial</span>
              <span className="font-black text-lg text-[#1A3C2F]">₹{commercialPrice.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-[#1A3C2F]/60">Use in up to 3 client projects. Internal team use (up to 5 users).</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedLicense === 'COMMERCIAL' ? 'border-[#1A3C2F]' : 'border-[#1A3C2F]/20'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${selectedLicense === 'COMMERCIAL' ? 'bg-[#1A3C2F]' : 'bg-transparent'}`}></div>
          </div>
        </label>

        {/* Enterprise Tier */}
        <label className={`flex items-center justify-between cursor-pointer p-4 rounded-2xl border-2 transition-all ${selectedLicense === 'ENTERPRISE' ? 'border-[#1A3C2F] bg-[#1A3C2F]/5' : 'border-[#1A3C2F]/10 hover:border-[#1A3C2F]/20'}`}>
          <input 
            type="radio" 
            name="license" 
            value="ENTERPRISE" 
            className="peer sr-only" 
            checked={selectedLicense === 'ENTERPRISE'}
            onChange={() => setSelectedLicense('ENTERPRISE')}
          />
          <div className="flex-1 pr-4">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-[#1A3C2F]">Enterprise</span>
              <span className="font-black text-lg text-[#1A3C2F]">₹{enterprisePrice.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-[#1A3C2F]/60">Unlimited projects within a single legal entity.</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedLicense === 'ENTERPRISE' ? 'border-[#1A3C2F]' : 'border-[#1A3C2F]/20'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${selectedLicense === 'ENTERPRISE' ? 'bg-[#1A3C2F]' : 'bg-transparent'}`}></div>
          </div>
        </label>
      </div>

      <CheckoutButton 
        productId={productId} 
        licenseType={selectedLicense} 
        productName={productName} 
      />

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
  );
}
