export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated loader */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[#E8E2D9]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1A3C2F] animate-spin" />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#5C6B60]">
          Loading
        </p>
      </div>
    </div>
  );
}
