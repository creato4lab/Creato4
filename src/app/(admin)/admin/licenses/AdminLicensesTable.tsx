"use client";

import React, { useState } from "react";
import { Search, Key, User, Cpu, ShieldCheck, ShieldAlert, Filter, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toggleLicenseStatus } from "@/actions/admin";

interface Activation {
  id: string;
  chipId: string;
  boardType: string;
  nickname: string | null;
  lastSeenAt: string;
}

interface LicenseItem {
  id: string;
  licenseKey: string;
  type: string;
  isActive: boolean;
  maxActivations: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  product: {
    id: string;
    title: string;
    slug: string;
    category: string;
  };
  activations: Activation[];
}

export function AdminLicensesTable({ initialLicenses }: { initialLicenses: LicenseItem[] }) {
  const [licenses, setLicenses] = useState<LicenseItem[]>(initialLicenses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (licenseId: string) => {
    setTogglingId(licenseId);
    const result = await toggleLicenseStatus(licenseId);
    if (result.error) {
      alert(result.error);
    } else {
      setLicenses((prev) =>
        prev.map((l) => (l.id === licenseId ? { ...l, isActive: result.isActive! } : l))
      );
    }
    setTogglingId(null);
  };

  const filteredLicenses = licenses.filter((l) => {
    const matchesType = selectedType === "ALL" || l.type === selectedType;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      l.licenseKey.toLowerCase().includes(term) ||
      (l.user.email && l.user.email.toLowerCase().includes(term)) ||
      (l.user.name && l.user.name.toLowerCase().includes(term)) ||
      l.product.title.toLowerCase().includes(term);

    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#1A3C2F]/10 space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#5C6B60] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by License Key, User Email, Name, or Product Title..."
            className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#5C6B60]" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-2xl px-4 py-3 text-xs font-bold text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50"
          >
            <option value="ALL">All License Types</option>
            <option value="STUDENT">Student</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="ENTERPRISE">Enterprise</option>
            <option value="FIRMWARE_FLASH">Firmware Flash</option>
            <option value="SOURCE_CODE_ONLY">Source Code Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#1A3C2F]">
          <thead className="bg-[#FAF8F5] border-b border-[#1A3C2F]/10 uppercase text-[0.65rem] font-extrabold text-[#5C6B60] tracking-wider">
            <tr>
              <th className="p-4 rounded-l-xl">License Key</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Product</th>
              <th className="p-4">Type</th>
              <th className="p-4">Devices</th>
              <th className="p-4">Status</th>
              <th className="p-4 rounded-r-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A3C2F]/5">
            {filteredLicenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[#5C6B60]">
                  No licenses found matching your filters.
                </td>
              </tr>
            ) : (
              filteredLicenses.map((license) => (
                <tr key={license.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                  {/* License Key */}
                  <td className="p-4 font-mono font-bold text-xs text-[#1A3C2F]">
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-[#C4A35A] shrink-0" />
                      <span className="truncate max-w-[160px]">{license.licenseKey}</span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="p-4">
                    <div className="font-bold text-[#1A3C2F]">{license.user.name || "Anonymous"}</div>
                    <div className="text-[0.65rem] text-[#5C6B60] font-mono">{license.user.email}</div>
                  </td>

                  {/* Product */}
                  <td className="p-4">
                    <div className="font-bold text-[#1A3C2F] truncate max-w-[180px]">{license.product.title}</div>
                    <div className="text-[0.65rem] text-[#C4A35A] font-bold uppercase tracking-wider">{license.product.category}</div>
                  </td>

                  {/* License Type */}
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[#1A3C2F]/8 text-[#1A3C2F]">
                      {license.type.replace(/_/g, " ")}
                    </span>
                  </td>

                  {/* Devices Slot Usage */}
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Cpu className="w-3.5 h-3.5 text-[#5C6B60]" />
                      <span>{license.activations.length}/{license.maxActivations}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    {license.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3" /> Disabled
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggle(license.id)}
                      disabled={togglingId === license.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 ${
                        license.isActive
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {togglingId === license.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : license.isActive ? (
                        "Disable"
                      ) : (
                        "Enable"
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
