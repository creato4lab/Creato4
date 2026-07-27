"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Package, Download, Zap, FileText, Key, Cpu,
  MessageSquare, ShoppingBag, History, LogOut,
  User, CheckCircle, ShieldCheck, Copy, Check,
  ExternalLink, Printer, Plus, Clock, AlertTriangle, ChevronRight, Tag
} from "lucide-react";
import { LicenseCard } from "./LicenseCard";
import { InvoiceModal, OrderInvoiceData } from "@/components/InvoiceModal";
import { SupportTicketModal } from "@/components/SupportTicketModal";

export interface DashboardClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  licenses: any[];
  orders: any[];
  tickets: any[];
  isSuccessNotification?: boolean;
}

type TabType =
  | "products"
  | "downloads"
  | "firmware"
  | "reports"
  | "licenses"
  | "devices"
  | "tickets"
  | "orders"
  | "updates";

export function DashboardClient({
  user,
  licenses,
  orders,
  tickets,
  isSuccessNotification,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderInvoiceData | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // Aggregate stats
  const totalProducts = licenses.length;
  const activeDevices = licenses.reduce((sum, l) => sum + (l.activations?.length || 0), 0);
  const totalDownloads = licenses.reduce((sum, l) => sum + (l.downloadsUsed || 0), 0);
  const openTickets = tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;

  // Flattened products list
  const purchasedProducts = licenses.map((l) => ({
    license: l,
    product: l.product,
  }));

  // Flattened version updates from purchased products
  const updateLogs = licenses.flatMap((l) => {
    const versionHistory = Array.isArray(l.product.versionHistory)
      ? l.product.versionHistory
      : [];
    return versionHistory.map((vh: any) => ({
      productTitle: l.product.title,
      productSlug: l.product.slug,
      version: vh.version,
      date: vh.date,
      notes: vh.notes,
    }));
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Flattened devices list
  const allDevices = licenses.flatMap((l) =>
    (l.activations || []).map((a: any) => ({
      ...a,
      licenseKey: l.licenseKey,
      productTitle: l.product.title,
    }))
  );

  const navigationTabs = [
    { id: "products",  label: "Purchased Products", icon: <Package className="w-4 h-4" />,  count: totalProducts },
    { id: "downloads", label: "Downloads",          icon: <Download className="w-4 h-4 text-[#C4A35A]" /> },
    { id: "firmware",  label: "Flash Firmware",     icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { id: "reports",   label: "Reports",            icon: <FileText className="w-4 h-4 text-[#C4A35A]" /> },
    { id: "licenses",  label: "Licenses",           icon: <Key className="w-4 h-4" /> },
    { id: "devices",   label: "Devices",            icon: <Cpu className="w-4 h-4 text-blue-500" />,     count: activeDevices },
    { id: "tickets",   label: "Support Tickets",    icon: <MessageSquare className="w-4 h-4 text-[#C4A35A]" />, count: openTickets },
    { id: "orders",    label: "Orders & Invoices",  icon: <ShoppingBag className="w-4 h-4" />,  count: orders.length },
    { id: "updates",   label: "Update History",     icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-24 px-6 sm:px-10 lg:px-16 xl:px-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1A3C2F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C4A35A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1300px] mx-auto relative z-10">

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-[#1A3C2F]/10">
          <div>
            <span className="inline-block text-[0.65rem] font-black uppercase tracking-widest bg-[#1A3C2F]/5 text-[#1A3C2F] px-3 py-1 rounded-full mb-2">
              Customer Portal — Phase 6
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-[#1A3C2F] tracking-tight">
              Welcome back, {user.name || user.email?.split("@")[0]}
            </h1>
            <p className="text-sm text-[#1A3C2F]/60 mt-1">
              Manage your engineering blueprints, firmware flashes, custom reports, devices, and support tickets.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-full bg-white border border-[#1A3C2F]/15 text-[#1A3C2F] text-xs font-bold uppercase tracking-wider hover:bg-[#FAF8F5] shadow-sm transition-colors flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-[#C4A35A]" /> Shop Catalog
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C] shadow-sm transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Payment Success Notification Banner */}
        {isSuccessNotification && (
          <div className="bg-green-50 border border-green-200 p-5 rounded-2xl mb-8 flex items-start gap-4 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-green-900 font-bold text-base mb-1">Payment Successful!</h4>
              <p className="text-green-800 text-xs leading-relaxed">
                Your order has been completed successfully. Your new license and digital assets have been added to your dashboard below.
              </p>
            </div>
          </div>
        )}

        {/* ── Top Stats Cards Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-[#1A3C2F]/8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40">Purchased</span>
              <Package className="w-4 h-4 text-[#C4A35A]" />
            </div>
            <p className="text-2xl font-black text-[#1A3C2F]">{totalProducts}</p>
            <p className="text-[0.7rem] text-[#1A3C2F]/50 mt-1">Digital Blueprints</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#1A3C2F]/8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40">Active Devices</span>
              <Cpu className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-[#1A3C2F]">{activeDevices}</p>
            <p className="text-[0.7rem] text-[#1A3C2F]/50 mt-1">Registered Boards</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#1A3C2F]/8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40">Downloads</span>
              <Download className="w-4 h-4 text-[#C4A35A]" />
            </div>
            <p className="text-2xl font-black text-[#1A3C2F]">{totalDownloads}</p>
            <p className="text-[0.7rem] text-[#1A3C2F]/50 mt-1">Files Fulfilled</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#1A3C2F]/8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40">Open Tickets</span>
              <MessageSquare className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-[#1A3C2F]">{openTickets}</p>
            <p className="text-[0.7rem] text-[#1A3C2F]/50 mt-1">Inquiries Pending</p>
          </div>
        </div>

        {/* ── Dashboard Navigation Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {navigationTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#1A3C2F] text-white shadow-md"
                    : "bg-white border border-[#1A3C2F]/10 text-[#1A3C2F]/70 hover:bg-[#1A3C2F]/5"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[0.6rem] font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-[#1A3C2F]/8 text-[#1A3C2F]"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENTS ── */}

        {/* 1. PURCHASED PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#1A3C2F] uppercase tracking-wide flex items-center gap-2">
                <Package className="w-5 h-5 text-[#C4A35A]" /> My Purchased Blueprints ({totalProducts})
              </h2>
            </div>

            {licenses.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#1A3C2F]/10">
                <Package className="w-12 h-12 text-[#1A3C2F]/20 mx-auto mb-3" />
                <h3 className="font-bold text-[#1A3C2F] mb-1">No Products Purchased Yet</h3>
                <p className="text-xs text-[#1A3C2F]/50 mb-6 max-w-sm mx-auto">
                  Browse our catalog for production-ready ESP32, Arduino, STM32, and Raspberry Pi blueprints.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-2.5 bg-[#1A3C2F] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {licenses.map((license) => (
                  <LicenseCard key={license.id} license={license} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. DOWNLOADS TAB */}
        {activeTab === "downloads" && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-[#1A3C2F] uppercase tracking-wide flex items-center gap-2">
              <Download className="w-5 h-5 text-[#C4A35A]" /> Download Center
            </h2>
            <div className="bg-white rounded-3xl p-6 border border-[#1A3C2F]/10 space-y-4">
              <p className="text-xs text-[#1A3C2F]/60">
                Access all your source code ZIPs, KiCad PCB files, CAD 3D models, and PDF documentation manuals.
              </p>

              {licenses.length === 0 ? (
                <p className="text-xs text-[#1A3C2F]/40 italic">No assets available for download.</p>
              ) : (
                <div className="space-y-4">
                  {licenses.map((l) => (
                    <div key={l.id} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#1A3C2F]/8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[0.6rem] font-bold bg-[#1A3C2F]/10 text-[#1A3C2F] px-2 py-0.5 rounded-full uppercase">
                            {l.product.category}
                          </span>
                          <span className="text-xs text-[#1A3C2F]/50 font-mono">Key: {l.licenseKey}</span>
                        </div>
                        <h4 className="font-bold text-[#1A3C2F] text-sm">{l.product.title}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/shop/${l.product.slug}`}
                          className="px-3 py-1.5 bg-[#1A3C2F] text-white text-xs font-bold rounded-lg hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors flex items-center gap-1"
                        >
                          View Files <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. FLASH FIRMWARE TAB */}
        {activeTab === "firmware" && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-[#1A3C2F] uppercase tracking-wide flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> WebSerial Firmware Flashing Station
            </h2>
            <div className="bg-white rounded-3xl p-6 border border-[#1A3C2F]/10 space-y-4">
              <p className="text-xs text-[#1A3C2F]/60">
                Connect your ESP32 or Arduino microcontrollers directly to your computer via USB to register hardware and flash verified firmware directly in Chrome or Edge.
              </p>

              <div className="space-y-4">
                {licenses.map((l) => (
                  <LicenseCard key={l.id} license={l} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-[#1A3C2F] uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C4A35A]" /> Reports & Protection Center
            </h2>
            <div className="bg-white rounded-3xl p-6 border border-[#1A3C2F]/10 space-y-4">
              <p className="text-xs text-[#1A3C2F]/60">
                Download watermarked protection PDFs or generate a customized, watermark-free Professional PDF with your Author Name, Team Name, and College Title.
              </p>
              <div className="space-y-4">
                {licenses.map((l) => (
                  <LicenseCard key={l.id} license={l} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. LICENSE MANAGEMENT TAB */}
        {activeTab === "licenses" && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-[#1A3C2F] uppercase tracking-wide flex items-center gap-2">
              <Key className="w-5 h-5 text-[#C4A35A]" /> License Keys & Entitlements
            </h2>
            <div className="space-y-4">
              {licenses.map((l) => (
                <LicenseCard key={l.id} license={l} />
              ))}
            </div>
          </div>
        )}

        {/* 6. DEVICE MANAGEMENT TAB */}
        {activeTab === "devices" && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-[#1A3C2F] uppercase tracking-wide flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500" /> Registered Hardware Devices ({allDevices.length})
            </h2>

            {allDevices.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#1A3C2F]/10">
                <Cpu className="w-10 h-10 text-[#1A3C2F]/20 mx-auto mb-2" />
                <p className="font-bold text-[#1A3C2F]">No Microcontroller Devices Activated Yet</p>
                <p className="text-xs text-[#1A3C2F]/50 mt-1">
                  Connect your ESP32 or Arduino board using the board connector in your purchased licenses list.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {allDevices.map((dev: any) => (
                  <div key={dev.id} className="bg-white p-5 rounded-2xl border border-[#1A3C2F]/10 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.65rem] font-bold uppercase bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                        {dev.boardType}
                      </span>
                      <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    </div>
                    <h4 className="font-bold text-[#1A3C2F] text-sm">{dev.nickname || dev.boardType}</h4>
                    <p className="text-xs text-[#1A3C2F]/60">Product: {dev.productTitle}</p>
                    <div className="pt-2 border-t border-[#1A3C2F]/8 flex items-center justify-between text-[0.65rem] text-[#1A3C2F]/50 font-mono">
                      <span>Chip ID: {dev.chipId.slice(0, 16)}...</span>
                      <span>Last seen: {new Date(dev.lastSeenAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. SUPPORT TICKETS TAB */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#1A3C2F] uppercase tracking-wide flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C4A35A]" /> Support & Consultation Tickets ({tickets.length})
              </h2>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-4 py-2 bg-[#1A3C2F] text-white rounded-full text-xs font-bold hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create Ticket
              </button>
            </div>

            {tickets.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#1A3C2F]/10">
                <MessageSquare className="w-10 h-10 text-[#1A3C2F]/20 mx-auto mb-2" />
                <p className="font-bold text-[#1A3C2F]">No Support Tickets Created</p>
                <p className="text-xs text-[#1A3C2F]/50 mt-1 mb-4">
                  Need help with firmware setup or customization? Submit a ticket to our engineering team.
                </p>
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  className="px-5 py-2.5 bg-[#1A3C2F] text-white rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Create Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white p-5 rounded-2xl border border-[#1A3C2F]/10 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[0.6rem] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          ticket.status === "RESOLVED"
                            ? "bg-green-100 text-green-700"
                            : ticket.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <span className="text-xs text-[#1A3C2F]/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>

                    <h4 className="font-bold text-[#1A3C2F] text-sm">{ticket.subject || "Support Request"}</h4>
                    <p className="text-xs text-[#1A3C2F]/70 leading-relaxed bg-[#FAF8F5] p-3 rounded-xl">
                      {ticket.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 8. ORDER HISTORY & INVOICES TAB */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-[#1A3C2F] uppercase tracking-wide flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C4A35A]" /> Order History & Invoices ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#1A3C2F]/10">
                <ShoppingBag className="w-10 h-10 text-[#1A3C2F]/20 mx-auto mb-2" />
                <p className="font-bold text-[#1A3C2F]">No Completed Orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white p-5 rounded-2xl border border-[#1A3C2F]/10 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1A3C2F]/8">
                      <div>
                        <span className="text-[0.65rem] font-bold text-[#1A3C2F]/50 uppercase">Order Ref</span>
                        <p className="font-mono font-bold text-xs text-[#1A3C2F]">{order.id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-[#1A3C2F]">
                          ₹{order.total.toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() => setSelectedInvoiceOrder(order as any)}
                          className="px-3 py-1.5 bg-[#1A3C2F]/8 text-[#1A3C2F] hover:bg-[#1A3C2F] hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" /> Tax Invoice
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between text-xs text-[#1A3C2F]">
                          <span className="font-semibold">{item.product.title}</span>
                          <span className="text-[#1A3C2F]/50 font-mono">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 9. UPDATE HISTORY TAB */}
        {activeTab === "updates" && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-[#1A3C2F] uppercase tracking-wide flex items-center gap-2">
              <History className="w-5 h-5 text-[#C4A35A]" /> Product Updates & Changelogs ({updateLogs.length})
            </h2>

            {updateLogs.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#1A3C2F]/10">
                <History className="w-10 h-10 text-[#1A3C2F]/20 mx-auto mb-2" />
                <p className="font-bold text-[#1A3C2F]">No Product Updates Logged</p>
              </div>
            ) : (
              <div className="space-y-3">
                {updateLogs.map((log: any, idx: number) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-[#1A3C2F]/10 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black font-mono bg-[#1A3C2F] text-[#C4A35A] px-2.5 py-0.5 rounded-full">
                          {log.version}
                        </span>
                        <span className="font-bold text-xs text-[#1A3C2F]">{log.productTitle}</span>
                      </div>
                      <span className="text-[0.65rem] text-[#1A3C2F]/40">{log.date}</span>
                    </div>
                    <p className="text-xs text-[#1A3C2F]/70 leading-relaxed bg-[#FAF8F5] p-3 rounded-xl">
                      {log.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Tax Invoice Modal */}
      <AnimatePresence>
        {selectedInvoiceOrder && (
          <InvoiceModal
            order={selectedInvoiceOrder}
            customerName={user.name || "Customer"}
            customerEmail={user.email || ""}
            onClose={() => setSelectedInvoiceOrder(null)}
          />
        )}
      </AnimatePresence>

      {/* Support Ticket Creation Modal */}
      <AnimatePresence>
        {showNewTicketModal && (
          <SupportTicketModal
            products={purchasedProducts.map((p) => ({ id: p.product.id, title: p.product.title }))}
            onClose={() => setShowNewTicketModal(false)}
            onSuccess={() => {
              window.location.reload();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
