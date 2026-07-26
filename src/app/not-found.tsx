import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist or has been moved.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-6">
      <div className="text-center max-w-lg">
        {/* Error Code */}
        <div className="relative mb-8">
          <span className="text-[10rem] sm:text-[14rem] font-black text-[#1A3C2F]/[0.04] leading-none select-none block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#C4A35A] animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C2F] mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-[#5C6B60] text-sm sm:text-base mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-sm font-bold tracking-wide hover:bg-[#234B3C] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            ← Back to Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#1A3C2F] text-[#1A3C2F] text-sm font-bold tracking-wide hover:bg-[#1A3C2F] hover:text-[#FAF8F5] transition-all"
          >
            Browse Shop
          </Link>
        </div>

        {/* Contact */}
        <p className="mt-12 text-xs text-[#5C6B60]/60">
          Need help?{' '}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="underline hover:text-[#1A3C2F] transition-colors"
          >
            Contact us
          </a>
        </p>
      </div>
    </main>
  );
}
