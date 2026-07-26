"use client";

import React, { useState } from 'react';
import { updateTicketStatus } from '@/actions/ticket';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function TicketStatusButtons({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => {
    if (newStatus === currentStatus) return;
    setLoading(true);
    try {
      await updateTicketStatus(ticketId, newStatus);
      router.refresh();
    } catch (error) {
      alert("Failed to update ticket status.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center gap-2 text-xs text-[#1A3C2F]/60 font-semibold"><Loader2 className="w-4 h-4 animate-spin" /> Updating...</div>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#1A3C2F]/10">
      <button
        onClick={() => handleUpdate("OPEN")}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
          currentStatus === "OPEN" 
            ? "bg-amber-500 text-white shadow-sm" 
            : "text-amber-800 hover:bg-amber-100/50"
        }`}
      >
        Open
      </button>

      <button
        onClick={() => handleUpdate("IN_PROGRESS")}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
          currentStatus === "IN_PROGRESS" 
            ? "bg-blue-600 text-white shadow-sm" 
            : "text-blue-800 hover:bg-blue-100/50"
        }`}
      >
        Calling / In Progress
      </button>

      <button
        onClick={() => handleUpdate("RESOLVED")}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
          currentStatus === "RESOLVED" 
            ? "bg-emerald-600 text-white shadow-sm" 
            : "text-emerald-800 hover:bg-emerald-100/50"
        }`}
      >
        Resolved
      </button>
    </div>
  );
}
