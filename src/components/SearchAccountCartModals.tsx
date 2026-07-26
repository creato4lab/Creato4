import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, User, ShoppingBag, ArrowRight, Check, Trash2, Shield } from 'lucide-react';
import { WORK_PROJECTS, STUDENT_PROJECTS, SERVICES } from '../data';

interface SearchAccountCartModalsProps {
  searchOpen: boolean;
  accountOpen: boolean;
  cartOpen: boolean;
  onCloseSearch: () => void;
  onCloseAccount: () => void;
  onCloseCart: () => void;
  onOpenDiscuss: () => void;
  onOpenAdmin?: () => void;
  cartItems: string[];
  onRemoveFromCart: (id: string) => void;
}

export const SearchAccountCartModals: React.FC<SearchAccountCartModalsProps> = ({
  searchOpen,
  accountOpen,
  cartOpen,
  onCloseSearch,
  onCloseAccount,
  onCloseCart,
  onOpenDiscuss,
  onOpenAdmin,
  cartItems,
  onRemoveFromCart,
}) => {
  const [query, setQuery] = useState('');

  // Search Results Filtering
  const filteredWork = WORK_PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredStudent = STUDENT_PROJECTS.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredServices = SERVICES.filter(
    (srv) =>
      srv.title.toLowerCase().includes(query.toLowerCase()) ||
      srv.description.toLowerCase().includes(query.toLowerCase())
  );

  const savedStudentProjects = STUDENT_PROJECTS.filter((s) => cartItems.includes(s.id));

  return (
    <>
      {/* 1. SEARCH MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 border-b border-[#E8E2D9] pb-4 mb-6">
                <Search className="w-5 h-5 text-[#5C6B60]" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects, services, hardware blueprints..."
                  className="w-full bg-transparent text-sm text-[#1A3C2F] focus:outline-none font-medium placeholder-[#5C6B60]/60"
                />
                <button onClick={onCloseSearch} className="text-[#5C6B60] hover:text-[#1A3C2F] p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results list */}
              <div className="max-h-96 overflow-y-auto space-y-4 pr-1">
                {query.trim() === '' ? (
                  <div className="text-center py-8 text-xs text-[#5C6B60]">
                    Try searching for <span className="font-bold text-[#1A3C2F]">&quot;Drone&quot;</span>,{' '}
                    <span className="font-bold text-[#1A3C2F]">&quot;PCB&quot;</span>,{' '}
                    <span className="font-bold text-[#1A3C2F]">&quot;Health Kiosk&quot;</span>, or{' '}
                    <span className="font-bold text-[#1A3C2F]">&quot;ESP32&quot;</span>.
                  </div>
                ) : (
                  <>
                    {/* Work Results */}
                    {filteredWork.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#C4A35A] block mb-2">
                          Engineering Projects ({filteredWork.length})
                        </span>
                        {filteredWork.map((w) => (
                          <div
                            key={w.id}
                            onClick={onCloseSearch}
                            className="p-3 rounded-xl hover:bg-[#F5F0EA] cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-[#1A3C2F]">{w.title}</h4>
                              <p className="text-[11px] text-[#5C6B60] line-clamp-1">{w.category}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#1A3C2F]" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Student Results */}
                    {filteredStudent.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#C4A35A] block mb-2">
                          Student Blueprints ({filteredStudent.length})
                        </span>
                        {filteredStudent.map((s) => (
                          <div
                            key={s.id}
                            onClick={onCloseSearch}
                            className="p-3 rounded-xl hover:bg-[#F5F0EA] cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-[#1A3C2F]">{s.title}</h4>
                              <p className="text-[11px] text-[#5C6B60] line-clamp-1">{s.price}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#1A3C2F]" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Service Results */}
                    {filteredServices.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#C4A35A] block mb-2">
                          Lab Services ({filteredServices.length})
                        </span>
                        {filteredServices.map((srv) => (
                          <div
                            key={srv.id}
                            onClick={onCloseSearch}
                            className="p-3 rounded-xl hover:bg-[#F5F0EA] cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-[#1A3C2F]">{srv.title}</h4>
                              <p className="text-[11px] text-[#5C6B60] line-clamp-1">{srv.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#1A3C2F]" />
                          </div>
                        ))}
                      </div>
                    )}

                    {filteredWork.length === 0 &&
                      filteredStudent.length === 0 &&
                      filteredServices.length === 0 && (
                        <div className="text-center py-8 text-xs text-[#5C6B60]">
                          No engineering records found matching &quot;{query}&quot;.
                        </div>
                      )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. ACCOUNT DRAWER */}
      <AnimatePresence>
        {accountOpen && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FAF8F5] border-l border-[#E8E2D9] max-w-sm w-full h-full p-8 flex flex-col justify-between shadow-2xl relative"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#E8E2D9] mb-8">
                  <span className="text-lg font-extrabold text-[#1A3C2F]">Client Account Portal</span>
                  <button onClick={onCloseAccount} className="p-1 text-[#5C6B60] hover:text-[#1A3C2F]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9] text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xl font-bold flex items-center justify-center mx-auto mb-3">
                    CL
                  </div>
                  <h3 className="text-base font-bold text-[#1A3C2F]">Creato4 Client Lab</h3>
                  <p className="text-xs text-[#5C6B60]">Guest Partner Session</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onCloseAccount();
                      onOpenDiscuss();
                    }}
                    className="w-full p-3.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-xs font-bold text-[#1A3C2F] hover:bg-[#F5F0EA] flex items-center justify-between"
                  >
                    <span>My Active Consultation Calls</span>
                    <ArrowRight className="w-4 h-4 text-[#C4A35A]" />
                  </button>

                  <button
                    onClick={() => {
                      onCloseAccount();
                      onOpenDiscuss();
                    }}
                    className="w-full p-3.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-xs font-bold text-[#1A3C2F] hover:bg-[#F5F0EA] flex items-center justify-between"
                  >
                    <span>Lab Gerber & CAD Downloads</span>
                    <ArrowRight className="w-4 h-4 text-[#C4A35A]" />
                  </button>

                  {onOpenAdmin && (
                    <button
                      onClick={() => {
                        onCloseAccount();
                        onOpenAdmin();
                      }}
                      className="w-full p-3.5 rounded-xl border border-[#1A3C2F]/20 bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold hover:bg-[#234B3C] flex items-center justify-between shadow-sm cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#C4A35A]" /> Admin User Directory
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#C4A35A]" />
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8E2D9]">
                <button
                  onClick={() => {
                    onCloseAccount();
                    onOpenDiscuss();
                  }}
                  className="w-full py-3 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-center"
                >
                  Schedule New Tech Call
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CART / SAVED BLUEPRINTS DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FAF8F5] border-l border-[#E8E2D9] max-w-sm w-full h-full p-8 flex flex-col justify-between shadow-2xl relative"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#E8E2D9] mb-6">
                  <div>
                    <span className="text-lg font-extrabold text-[#1A3C2F]">Saved Projects</span>
                    <span className="text-xs text-[#5C6B60] block">Blueprint Showcase List</span>
                  </div>
                  <button onClick={onCloseCart} className="p-1 text-[#5C6B60] hover:text-[#1A3C2F]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {savedStudentProjects.length === 0 ? (
                    <div className="text-center py-12 text-xs text-[#5C6B60]">
                      <ShoppingBag className="w-10 h-10 text-[#E8E2D9] mx-auto mb-3" />
                      No saved student project blueprints yet. Explore the &quot;Ready-To-Build Projects&quot; section to save kits!
                    </div>
                  ) : (
                    savedStudentProjects.map((s) => (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9] flex items-center justify-between gap-3"
                      >
                        <img src={s.image} alt={s.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#1A3C2F] truncate">{s.title}</h4>
                          <span className="text-[11px] font-mono text-[#5C6B60]">{s.price}</span>
                        </div>
                        <button
                          onClick={() => onRemoveFromCart(s.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8E2D9]">
                <button
                  onClick={() => {
                    onCloseCart();
                    onOpenDiscuss();
                  }}
                  className="w-full py-3.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Inquire Saved Blueprints</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
