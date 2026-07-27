import React from "react";
import { getAdminLicenses } from "@/actions/admin";
import { AdminLicensesTable } from "./AdminLicensesTable";
import { Key, ShieldCheck, Cpu, Zap } from "lucide-react";

export default async function AdminLicensesPage() {
  const licenses = await getAdminLicenses();

  const totalLicenses = licenses.length;
  const activeLicenses = licenses.filter((l) => l.isActive).length;
  const totalActivations = licenses.reduce((sum, l) => sum + l.activations.length, 0);
  const firmwareLicenses = licenses.filter((l) => l.type === "FIRMWARE_FLASH").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A3C2F] tracking-tight">License Management</h1>
          <p className="text-[#5C6B60] text-sm mt-1">
            View, filter, and control all digital product licenses and hardware device activations.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#1A3C2F]/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1A3C2F]/10 text-[#1A3C2F] flex items-center justify-center shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5C6B60] uppercase tracking-wider">Total Issued</p>
            <h3 className="text-2xl font-extrabold text-[#1A3C2F]">{totalLicenses}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#1A3C2F]/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5C6B60] uppercase tracking-wider">Active Licenses</p>
            <h3 className="text-2xl font-extrabold text-[#1A3C2F]">{activeLicenses}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#1A3C2F]/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5C6B60] uppercase tracking-wider">Active Devices</p>
            <h3 className="text-2xl font-extrabold text-[#1A3C2F]">{totalActivations}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#1A3C2F]/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5C6B60] uppercase tracking-wider">Firmware Flash</p>
            <h3 className="text-2xl font-extrabold text-[#1A3C2F]">{firmwareLicenses}</h3>
          </div>
        </div>
      </div>

      {/* Licenses Table & Controls */}
      <AdminLicensesTable initialLicenses={licenses} />
    </div>
  );
}
