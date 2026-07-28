import Link from "next/link";
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#C4A35A]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#1A3C2F]/10 rounded-full blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-[#1A3C2F] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-[#FAF8F5] font-extrabold text-xl">C4</span>
          </div>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#1A3C2F] tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-[#5C6B60]">
          Sign in to access your engineering projects
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/60 backdrop-blur-xl py-8 px-4 shadow-xl border border-[#E8E2D9]/50 sm:rounded-3xl sm:px-10">
          
          {/* Direct Email Sign In Form */}
          <form
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email") as string;
              if (email) {
                await signIn("credentials", { email, redirectTo: "/dashboard" });
              }
            }}
            className="space-y-4 mb-6"
          >
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#1A3C2F] uppercase tracking-wider mb-2">
                Sign in with Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:ring-2 focus:ring-[#1A3C2F] bg-white text-sm text-[#1A3C2F]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#1A3C2F] text-white text-sm font-bold hover:bg-[#234B3C] transition-colors shadow-md cursor-pointer"
            >
              Sign In with Email
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8E2D9]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FAF8F5] px-2 text-[#5C6B60] font-semibold">Or</span>
            </div>
          </div>

          {/* Google OAuth Form */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-[#E8E2D9] rounded-xl shadow-sm bg-white text-sm font-semibold text-[#1A3C2F] hover:bg-gray-50 focus:outline-none transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
