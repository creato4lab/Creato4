"use client";

import React, { useState } from "react";
import { Cpu, Search, Trash2, CheckCircle, Clock } from "lucide-react";
import { adminUnregisterDevice } from "@/actions/admin";

interface ActivationItem {
  id: string;
  chipId: string;
  boardType: string;
  nickname: string | null;
  isActive: boolean;
  lastSeenAt: string;
  createdAt: string;
  userEmail: string | null;
  userName: string | null;
  productTitle: string;
  licenseKey: string;
}

export function AdminActivationsClient({ activations: initial }: { activations: ActivationItem[] }) {
  const [activations, setActivations] = useState(initial);
  const [search, setSearch] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filtered = activations.filter(
    (a) =>
      a.chipId.toLowerCase().includes(search.toLowerCase()) ||
      a.boardType.toLowerCase().includes(search.toLowerCase()) ||
      a.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      a.productTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate and unregister this device slot?")) return;
    setRemovingId(id);
    const res = await adminUnregisterDevice(id);
    if (res.success) {
      setActivations((prev) => prev.map((a) => (a.id === id ? { ...a, isActive: false } : a)));
    } else {
      alert(res.error || "Failed to deactivate device");
    }
    setRemovingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#1A3C2F]/40 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Chip ID, board type, customer or product..."
          className="w-full bg-white border border-[#1A3C2F]/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#1A3C2F]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#1A3C2F]/5 text-[0.65rem] font-black uppercase tracking-wider text-[#1A3C2F]/50">
                <th className="px-6 py-4">Hardware & Chip ID</th>
                <th className="px-6 py-4">Product & License</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Last Ping</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A3C2F]/5 text-xs text-[#1A3C2F]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#1A3C2F]/40 italic">
                    No device activations found.
                  </td>
                </tr>
              ) : (
                filtered.map((device) => (
                  <tr key={device.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#1A3C2F]">{device.nickname || device.boardType}</div>
                      <div className="text-[0.65rem] font-mono text-[#1A3C2F]/50 truncate max-w-xs">
                        ID: {device.chipId}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {device.productTitle}
                      <span className="block font-mono text-[0.65rem] text-[#1A3C2F]/50">{device.licenseKey}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{device.userName || "Customer"}</div>
                      <div className="text-[0.65rem] text-[#1A3C2F]/50">{device.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-[#1A3C2F]/60">
                      {new Date(device.lastSeenAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase ${
                          device.isActive
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {device.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {device.isActive && (
                        <button
                          onClick={() => handleDeactivate(device.id)}
                          disabled={removingId === device.id}
                          className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
