"use client";

import React, { useState } from "react";
import { Users, Shield, Search, Key, ShoppingBag, CheckCircle, RefreshCw } from "lucide-react";
import { toggleUserRoleAction } from "@/actions/admin";

interface CustomerItem {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  activeLicensesCount: number;
}

export function AdminCustomersClient({ customers: initialCustomers }: { customers: CustomerItem[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleRole = async (userId: string) => {
    setUpdatingId(userId);
    const res = await toggleUserRoleAction(userId);
    if (res.success && res.role) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, role: res.role! } : c))
      );
    } else {
      alert(res.error || "Failed to update role");
    }
    setUpdatingId(null);
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
          placeholder="Search by name or email..."
          className="w-full bg-white border border-[#1A3C2F]/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#1A3C2F]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#1A3C2F]/5 text-[0.65rem] font-black uppercase tracking-wider text-[#1A3C2F]/50">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4 text-center">Active Licenses</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4 text-center">Role & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A3C2F]/5 text-xs text-[#1A3C2F]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#1A3C2F]/40 italic">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="px-6 py-4 font-bold">
                      {customer.name || "User"}
                      <span className="block font-normal text-[#1A3C2F]/50 text-[0.7rem]">
                        {customer.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#1A3C2F]/60">
                      {new Date(customer.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-center font-bold">{customer.ordersCount}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full font-bold">
                        {customer.activeLicensesCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#1A3C2F]">
                      ₹{customer.totalSpent.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleRole(customer.id)}
                        disabled={updatingId === customer.id}
                        className={`px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase transition-colors flex items-center gap-1 mx-auto ${
                          customer.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800 border border-purple-300"
                            : "bg-[#1A3C2F]/5 text-[#1A3C2F] border border-[#1A3C2F]/10 hover:bg-[#1A3C2F] hover:text-white"
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {customer.role}
                      </button>
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
