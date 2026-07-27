"use client";

import React, { useState } from "react";
import { ShieldAlert, Search, FileCode, CheckCircle2, User, Key, Clock, Globe, UploadCloud, AlertCircle } from "lucide-react";
import { inspectLeakedCode } from "@/actions/admin";

export default function ForensicInspectorPage() {
  const [codeSnippet, setCodeSnippet] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInspect = async () => {
    if (!codeSnippet.trim()) {
      setError("Please paste code or drag-and-drop a file to inspect.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const res = await inspectLeakedCode(codeSnippet);

    if (!res.success) {
      setError(res.error || "No watermark signature found.");
    } else {
      setResult(res);
    }

    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCodeSnippet(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#C4A35A]/10 text-[#C4A35A] text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#C4A35A]/20">
              Phase 5 Security
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1A3C2F] tracking-tight">Forensic Code Inspector</h1>
          <p className="text-[#5C6B60] text-sm mt-1">
            Paste leaked `.ino` source code or upload files to extract hidden zero-width steganographic signatures and trace buyer identity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Code Input */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#1A3C2F]/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1A3C2F] flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#C4A35A]" /> Input Code or File
            </h2>

            <label className="cursor-pointer text-xs font-bold text-[#1A3C2F] hover:text-[#C4A35A] flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#1A3C2F]/10">
              <UploadCloud className="w-3.5 h-3.5" /> Upload File
              <input type="file" onChange={handleFileUpload} accept=".ino,.c,.cpp,.h,.hpp,.py,.js,.ts,.txt,.md" className="hidden" />
            </label>
          </div>

          <textarea
            rows={14}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="Paste leaked .ino Arduino code, C++ header, or plain text snippet here..."
            className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-2xl p-4 font-mono text-xs text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] resize-none"
          />

          <div className="flex justify-end gap-3">
            {codeSnippet && (
              <button
                type="button"
                onClick={() => { setCodeSnippet(""); setResult(null); setError(null); }}
                className="px-4 py-2 text-xs font-bold text-[#5C6B60] hover:text-[#1A3C2F]"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleInspect}
              disabled={loading}
              className="flex items-center gap-2 bg-[#1A3C2F] text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-[#234B3C] transition-colors disabled:opacity-50"
            >
              {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Scanning Code..." : "Scan & Extract Watermark"}
            </button>
          </div>
        </div>

        {/* Right Column: Scan Results */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-900 mb-1">Watermark Scan Failed</h4>
                <p className="text-xs text-red-700">{error}</p>
              </div>
            </div>
          )}

          {!result && !error && (
            <div className="bg-white/60 backdrop-blur-xl border border-dashed border-[#1A3C2F]/20 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
              <ShieldAlert className="w-12 h-12 text-[#1A3C2F]/20 mb-4" />
              <h3 className="text-base font-bold text-[#1A3C2F]">Awaiting Forensic Input</h3>
              <p className="text-xs text-[#5C6B60] max-w-sm mt-1">
                Paste any source snippet or upload an `.ino` file on the left to extract zero-width steganographic signatures.
              </p>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-200 space-y-6">
              {/* Status Header */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Steganographic Match Found!</h4>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    Detection Method: <span className="font-bold">{result.detectionMethod}</span>
                  </p>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#1A3C2F]/60 uppercase tracking-wider">Buyer Identification</h4>
                <div className="bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5C6B60] flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Customer Name</span>
                    <span className="font-bold text-[#1A3C2F]">{result.user?.name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1A3C2F]/5">
                    <span className="text-[#5C6B60]">Email Address</span>
                    <span className="font-bold font-mono text-[#1A3C2F]">{result.user?.email || result.userId || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1A3C2F]/5">
                    <span className="text-[#5C6B60]">User ID</span>
                    <span className="font-mono text-[0.65rem] text-[#1A3C2F]/70">{result.userId || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* License & Product Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#1A3C2F]/60 uppercase tracking-wider">Product & License</h4>
                <div className="bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5C6B60] flex items-center gap-1.5"><Key className="w-3.5 h-3.5" /> Product Title</span>
                    <span className="font-bold text-[#1A3C2F]">{result.license?.product?.title || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1A3C2F]/5">
                    <span className="text-[#5C6B60]">License Key</span>
                    <span className="font-mono text-xs font-bold text-[#1A3C2F]">{result.license?.licenseKey || result.licenseId || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1A3C2F]/5">
                    <span className="text-[#5C6B60]">License Type</span>
                    <span className="font-bold text-xs text-[#C4A35A]">{result.license?.type || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Audit Log Trail */}
              {result.logRecord && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#1A3C2F]/60 uppercase tracking-wider">Audit Log Evidence</h4>
                  <div className="bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5C6B60] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Download Date</span>
                      <span className="font-medium text-[#1A3C2F]">
                        {new Date(result.logRecord.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1A3C2F]/5">
                      <span className="text-[#5C6B60] flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> IP Address</span>
                      <span className="font-mono text-xs text-[#1A3C2F]">{result.logRecord.ipAddress}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1A3C2F]/5">
                      <span className="text-[#5C6B60]">Download Ref</span>
                      <span className="font-mono text-[0.65rem] text-[#1A3C2F]/70">{result.downloadId}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
