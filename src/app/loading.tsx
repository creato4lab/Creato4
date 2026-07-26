export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3 px-5 py-4 rounded-2xl bg-[#FAF8F5]/95 dark:bg-[#0A130F]/95 backdrop-blur-md border border-[#C4A35A]/40 shadow-xl shadow-stone-900/10 dark:shadow-black/50">
        <div className="relative w-11 h-11 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[1.5px] border-[#C4A35A]/25 border-t-[#C4A35A] animate-spin [animation-duration:0.8s]" />
          <div className="w-7 h-7 rounded-md bg-[#1A3C2F] flex items-center justify-center shadow-sm">
            <span className="text-[11px] font-bold text-[#C4A35A] tracking-wider">
              C4
            </span>
          </div>
        </div>
        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#1A3C2F] dark:text-stone-300">
          CREATO4
        </span>
      </div>
    </div>
  );
}


