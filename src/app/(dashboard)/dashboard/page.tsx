import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Folder, Settings, Download } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-6 sm:px-10 lg:px-16 xl:px-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1A3C2F]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C4A35A]/10 rounded-full blur-3xl" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1A3C2F] tracking-tight">Client Portal</h1>
            <p className="text-[#5C6B60] mt-2">Welcome back, {session.user.name || session.user.email}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/" className="px-5 py-2.5 rounded-full bg-white border border-[#E8E2D9] text-[#1A3C2F] text-xs font-bold uppercase tracking-wider hover:bg-[#F5F0EA] shadow-sm transition-colors">
              Return Home
            </Link>
            
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C] shadow-sm transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <div className="bg-white/60 backdrop-blur-xl border border-[#E8E2D9] rounded-3xl p-8 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F0EA] text-[#1A3C2F] flex items-center justify-center mb-6">
              {session.user.image ? (
                <img src={session.user.image} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <h3 className="text-xl font-bold text-[#1A3C2F] mb-1">{session.user.name}</h3>
            <p className="text-xs text-[#5C6B60] mb-6">{session.user.email}</p>
            
            <div className="pt-6 border-t border-[#E8E2D9]">
              <button className="w-full flex items-center justify-between text-sm font-semibold text-[#1A3C2F] hover:text-[#C4A35A] transition-colors">
                <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Account Settings</span>
              </button>
            </div>
          </div>

          {/* Main Content Area (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Active Projects */}
            <div className="bg-white/60 backdrop-blur-xl border border-[#E8E2D9] rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#1A3C2F]/10 text-[#1A3C2F] flex items-center justify-center">
                  <Folder className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1A3C2F]">Active Consultations</h3>
              </div>
              <div className="p-6 rounded-2xl border border-dashed border-[#E8E2D9] text-center bg-[#FAF8F5]/50">
                <p className="text-sm text-[#5C6B60]">You don't have any active project consultations yet.</p>
                <Link href="/" className="inline-block mt-4 px-6 py-2.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C]">
                  Start a Project
                </Link>
              </div>
            </div>

            {/* Downloads / Licenses */}
            <div className="bg-white/60 backdrop-blur-xl border border-[#E8E2D9] rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#C4A35A]/10 text-[#C4A35A] flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1A3C2F]">Digital Engineering Assets</h3>
              </div>
              <div className="p-6 rounded-2xl border border-dashed border-[#E8E2D9] text-center bg-[#FAF8F5]/50">
                <p className="text-sm text-[#5C6B60]">No digital products or CAD files purchased yet.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
