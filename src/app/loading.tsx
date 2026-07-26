export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#FAF8F5]/95 backdrop-blur-md border border-[#C4A35A]/30 shadow-xl shadow-stone-900/10">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[1.5px] border-[#C4A35A]/25 border-t-[#C4A35A] animate-spin [animation-duration:0.8s]" />
          <div className="w-6 h-6 rounded-md bg-[#1A3C2F] flex items-center justify-center shadow-xs">
            <span className="text-[10px] font-extrabold text-[#C4A35A] tracking-wider">
              C4
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A3C2F]">
          CREATO4
        </span>
      </div>
    </div>
  );
}


