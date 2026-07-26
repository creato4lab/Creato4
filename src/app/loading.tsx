export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#1A3C2F]/95 dark:bg-[#0A130F]/95 backdrop-blur-md border border-[#C4A35A]/30 shadow-2xl shadow-black/30">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[1.5px] border-[#C4A35A]/20 border-t-[#C4A35A] animate-spin [animation-duration:0.8s]" />
          <span className="text-xs font-extrabold text-[#C4A35A] tracking-wider">
            C4
          </span>
        </div>
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-300">
          CREATO4
        </span>
      </div>
    </div>
  );
}

