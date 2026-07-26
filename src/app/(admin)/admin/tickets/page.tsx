import React from 'react';
import { getAdminTickets } from '@/actions/ticket';
import { MessageSquare, Phone, User, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { TicketStatusButtons } from './TicketStatusButtons';

export const metadata = { title: "Inquiries & Tickets - Creato4 Admin" };

export default async function AdminTicketsPage() {
  const tickets = await getAdminTickets();

  const openCount = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1A3C2F] tracking-tight">Consultation & Support Tickets</h1>
          <p className="text-sm text-[#1A3C2F]/60 mt-1">Review callback requests and support inquiries from customers.</p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#1A3C2F]/10 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A3C2F]/50">Open Leads</span>
            <p className="text-3xl font-black text-amber-600 mt-1">{openCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#1A3C2F]/10 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A3C2F]/50">In Progress</span>
            <p className="text-3xl font-black text-blue-600 mt-1">{inProgressCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#1A3C2F]/10 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A3C2F]/50">Resolved</span>
            <p className="text-3xl font-black text-emerald-600 mt-1">{resolvedCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white border border-[#1A3C2F]/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1A3C2F]/5">
          <h2 className="text-lg font-bold text-[#1A3C2F]">All Inquiries ({tickets.length})</h2>
        </div>

        {tickets.length === 0 ? (
          <div className="p-12 text-center text-[#1A3C2F]/50">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-sm">No consultation requests or tickets yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1A3C2F]/5">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-[#FAF8F5]/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-3">
                    <span className={`text-[0.65rem] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#1A3C2F]/40 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#1A3C2F]">
                    {ticket.subject || "Consultation Callback Request"}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#1A3C2F]/70">
                    <span className="flex items-center gap-1.5 bg-[#1A3C2F]/5 px-3 py-1 rounded-lg">
                      <User className="w-3.5 h-3.5 text-[#C4A35A]" />
                      {ticket.name || ticket.user?.name || "Anonymous User"}
                    </span>

                    {ticket.phone && (
                      <a href={`tel:${ticket.phone}`} className="flex items-center gap-1.5 bg-[#1A3C2F] text-white px-3 py-1 rounded-lg hover:bg-[#234B3C] transition-colors">
                        <Phone className="w-3.5 h-3.5 text-[#C4A35A]" />
                        {ticket.phone}
                      </a>
                    )}

                    {ticket.user?.email && (
                      <span className="text-[#1A3C2F]/50">({ticket.user.email})</span>
                    )}
                  </div>

                  {ticket.message && (
                    <p className="text-xs text-[#1A3C2F]/70 bg-[#F5F0EA]/60 p-3 rounded-xl border border-[#1A3C2F]/5 mt-2">
                      "{ticket.message}"
                    </p>
                  )}
                </div>

                {/* Status Changer Component */}
                <div className="shrink-0">
                  <TicketStatusButtons ticketId={ticket.id} currentStatus={ticket.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
