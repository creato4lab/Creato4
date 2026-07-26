import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { LayoutDashboard, Package, LogOut, FileCode2, MessageSquare } from 'lucide-react';
import { signOut } from '@/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  if (user?.role !== "ADMIN") {
    redirect('/dashboard'); // Kick regular users to their dashboard
  }

  return (
    <div className="min-h-screen bg-[#F0EDE8] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A3C2F] text-[#FAF8F5] fixed h-full flex flex-col hidden md:flex">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-[#C4A35A] to-[#D4B870] rounded flex items-center justify-center font-black text-[#1A3C2F] text-lg leading-none">
              ⚡
            </div>
            <div>
              <div className="font-black text-lg leading-tight tracking-tight">CREATO4</div>
              <div className="text-[0.6rem] font-bold text-[#C4A35A] tracking-[0.2em] uppercase">Admin</div>
            </div>
          </Link>

          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold">
              <LayoutDashboard className="w-5 h-5 text-[#C4A35A]" /> Overview
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold">
              <Package className="w-5 h-5 text-[#C4A35A]" /> Products
            </Link>
            <Link href="/admin/tickets" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold">
              <MessageSquare className="w-5 h-5 text-[#C4A35A]" /> Inquiries & Tickets
            </Link>
            <Link href="/admin/licenses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold opacity-50 cursor-not-allowed">
              <FileCode2 className="w-5 h-5 text-[#C4A35A]" /> Licenses
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <form action={async () => {
            "use server";
            await signOut();
          }}>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 w-full transition-colors text-sm font-semibold text-red-400">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 sm:p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
