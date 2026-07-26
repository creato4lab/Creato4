import React from 'react';
import { getDashboardStats } from '@/actions/admin';
import { IndianRupee, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export const metadata = { title: "Admin Overview - Creato4" };

export default async function AdminOverviewPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1A3C2F] tracking-tight mb-2">Mission Control</h1>
        <p className="text-[#1A3C2F]/60 font-medium">Welcome to your admin overview. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A3C2F]/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1A3C2F]/50 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-black text-[#1A3C2F]">₹{stats.totalRevenue.toLocaleString("en-IN")}</h3>
            </div>
          </div>
          <div className="text-xs font-semibold text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from last month
          </div>
        </div>

        {/* Sales */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A3C2F]/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1A3C2F]/50 uppercase tracking-wider">Licenses Sold</p>
              <h3 className="text-2xl font-black text-[#1A3C2F]">{stats.totalSales}</h3>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A3C2F]/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#C4A35A]/20 rounded-xl flex items-center justify-center text-[#C4A35A]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1A3C2F]/50 uppercase tracking-wider">Total Users</p>
              <h3 className="text-2xl font-black text-[#1A3C2F]">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-black text-[#1A3C2F] mb-6">Recent Transactions</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-[#1A3C2F]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#1A3C2F]/5 text-xs uppercase tracking-wider text-[#1A3C2F]/50 font-bold">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm font-medium text-[#1A3C2F]/40">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-[#1A3C2F]/5 hover:bg-[#FAF8F5]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#1A3C2F] text-sm">{order.user.name || "Guest"}</div>
                      <div className="text-xs text-[#1A3C2F]/50">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#1A3C2F] text-sm">
                        {order.items[0]?.product.title || "Unknown Product"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1A3C2F]/70">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block bg-[#1A3C2F] text-[#FAF8F5] px-3 py-1 rounded-lg text-xs font-bold">
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
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
