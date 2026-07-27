"use client";
import React from "react";
import { motion } from "motion/react";
import { X, Printer, Download, CheckCircle, ShieldCheck, FileText, Sparkles, Building } from "lucide-react";

export interface OrderItemWithProduct {
  id: string;
  price: number;
  licenseType: string;
  product: {
    title: string;
    category: string;
    slug: string;
  };
}

export interface OrderInvoiceData {
  id: string;
  total: number;
  currency: string;
  status: string;
  razorpayId?: string | null;
  createdAt: string;
  items: OrderItemWithProduct[];
}

interface InvoiceModalProps {
  order: OrderInvoiceData;
  customerName: string;
  customerEmail: string;
  onClose: () => void;
}

export function InvoiceModal({ order, customerName, customerEmail, onClose }: InvoiceModalProps) {
  const invoiceNumber = `INV-${new Date(order.createdAt).getFullYear()}-${order.id.slice(-6).toUpperCase()}`;
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#1A3C2F]/10 print:shadow-none print:border-none print:w-full print:max-w-none"
      >
        {/* Modal Actions Header (Hidden in Print) */}
        <div className="bg-[#1A3C2F] p-5 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#C4A35A]" />
            <h2 className="font-black text-base text-white">Tax Invoice — {invoiceNumber}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C4A35A] text-[#1A3C2F] rounded-lg text-xs font-bold hover:bg-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div className="p-8 space-y-8 bg-white print:p-0">

          {/* Header & Logo */}
          <div className="flex items-start justify-between border-b border-[#1A3C2F]/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#1A3C2F] flex items-center justify-center text-[#C4A35A] font-black text-xs">
                  C4
                </div>
                <span className="text-xl font-black text-[#1A3C2F] tracking-tight">Creato4 Lab</span>
              </div>
              <p className="text-xs text-[#1A3C2F]/60">Advanced Engineering Blueprints & Embedded Systems</p>
              <p className="text-xs text-[#1A3C2F]/50 mt-1">Website: www.creato4lab.com | Support: creato4lab@gmail.com</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#1A3C2F]/5 text-[#1A3C2F] font-mono font-bold text-xs px-3 py-1 rounded-full mb-1">
                TAX INVOICE
              </span>
              <p className="text-sm font-bold text-[#1A3C2F]">{invoiceNumber}</p>
              <p className="text-xs text-[#1A3C2F]/50">{formattedDate}</p>
            </div>
          </div>

          {/* Bill To & Payment Info */}
          <div className="grid grid-cols-2 gap-6 bg-[#FAF8F5] p-5 rounded-2xl border border-[#1A3C2F]/8">
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40 mb-1">Billed To</p>
              <p className="text-sm font-bold text-[#1A3C2F]">{customerName}</p>
              <p className="text-xs text-[#1A3C2F]/60">{customerEmail}</p>
            </div>
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/40 mb-1">Payment Details</p>
              <div className="space-y-0.5 text-xs text-[#1A3C2F]/70">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Paid ({order.status})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Gateway ID:</span>
                  <span className="font-mono text-[0.65rem]">{order.razorpayId || "Online Payment"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Reference:</span>
                  <span className="font-mono text-[0.65rem]">{order.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1A3C2F]/15 text-[0.65rem] font-black uppercase tracking-widest text-[#1A3C2F]/50">
                  <th className="py-2.5 pl-2">Item / Product</th>
                  <th className="py-2.5 px-2">License Type</th>
                  <th className="py-2.5 pr-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A3C2F]/8 text-xs text-[#1A3C2F]">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3.5 pl-2 font-bold">
                      {item.product.title}
                      <span className="block text-[0.65rem] font-normal text-[#1A3C2F]/50">
                        Category: {item.product.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="bg-[#1A3C2F]/5 text-[#1A3C2F] text-[0.6rem] font-bold uppercase px-2.5 py-1 rounded-full">
                        {item.licenseType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-right font-bold">
                      ₹{item.price.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end pt-4 border-t border-[#1A3C2F]/10">
            <div className="w-64 space-y-2 text-xs text-[#1A3C2F]">
              <div className="flex justify-between text-[#1A3C2F]/60">
                <span>Subtotal:</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#1A3C2F]/60">
                <span>Taxes & Digital Fulfillment:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#1A3C2F]/15 text-sm font-black text-[#1A3C2F]">
                <span>Total Amount Paid:</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Footer EULA & Stamp */}
          <div className="pt-6 border-t border-[#1A3C2F]/8 text-[0.65rem] text-[#1A3C2F]/50 flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1A3C2F]">Creato4 Lab Digital Licensing</p>
              <p>This is a computer-generated tax invoice. No signature required.</p>
            </div>
            <div className="flex items-center gap-1.5 text-green-700 font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <ShieldCheck className="w-4 h-4" /> Verified Digital Order
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
