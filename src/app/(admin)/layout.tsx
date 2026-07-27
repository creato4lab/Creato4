import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { LayoutDashboard, Package, LogOut, FileCode2, MessageSquare, Key, Zap, Cpu, Users } from 'lucide-react';
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
          <Link href="/admin" className="flex items-center gap-3 mb-8">
            <img src="/creato4-logo.svg" alt="Creato4 Logo" className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1" />
            <div>
              <div className="font-black text-lg leading-tight tracking-tight">CREATO4</div>
              <div className="text-[0.6rem] font-bold text-[#C4A35A] tracking-[0.2em] uppercase">Mission Control</div>
            </div>
          </Link>

          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            <Link href="/admin" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold">
              <LayoutDashboard className="w-4 h-4 text-[#C4A35A]" /> Overview & Sales
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold">
              <Package className="w-4 h-4 text-[#C4A35A]" /> Products & Assets
            </Link>
            <Link href="/admin/firmware-push" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold">
              <Zap className="w-4 h-4 text-amber-400" /> Push Firmware
            </Link>
            <Link href="/admin/licenses" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold">
              <Key className="w-4 h-4 text-[#C4A35A]" /> Licenses & Disable
            </Link>
            <Link href="/admin/activations" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold">
              <Cpu className="w-4 h-4 text-blue-400" /> Device Activations
            </Link>
            <Link href="/admin/customers" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold">
              <Users className="w-4 h-4 text-[#C4A35A]" /> Customers
            </Link>
            <Link href="/admin/inspector" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold">
              <FileCode2 className="w-4 h-4 text-[#C4A35A]" /> Forensic Inspector
            </Link>
            <Link href="/admin/tickets" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold">
              <MessageSquare className="w-4 h-4 text-[#C4A35A]" /> Tickets & Support
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 w-full transition-colors text-sm font-semibold text-red-400">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 sm:p-10">
        <div className="w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
