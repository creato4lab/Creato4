"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle, AlertTriangle, Loader2, File as FileIcon, X, Zap } from "lucide-react";

interface FileUploadProps {
  name?: string; // The form name for the hidden input (e.g., "sourceCodePath")
  label: string;
  prefix: string; // R2 folder prefix (e.g., "source-code")
  accept?: string; // e.g., ".zip,.rar", ".pdf", ".bin,.uf2"
  required?: boolean;
  value?: string;
  onChange?: (key: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function FileUpload({ name, label, prefix, accept, required, value = "", onChange }: FileUploadProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">(value ? "success" : "idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [loadedText, setLoadedText] = useState("");
  const [speedText, setSpeedText] = useState("");
  const [etaText, setEtaText] = useState("");
  const [uploadedKey, setUploadedKey] = useState(value);
  const [fileName, setFileName] = useState(value ? value.split("/").pop() || value : "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("uploading");
    setProgress(0);
    setLoadedText(`0 B / ${formatBytes(file.size)}`);
    setSpeedText("");
    setEtaText("");
    setErrorMsg("");

    const startTime = Date.now();

    try {
      const keyResult = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload-file", true);
        xhr.setRequestHeader("x-filename", encodeURIComponent(file.name));
        xhr.setRequestHeader("x-prefix", prefix);
        if (file.type) {
          xhr.setRequestHeader("Content-Type", file.type);
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const pct = Math.round((event.loaded / event.total) * 100);
            setProgress(pct >= 100 ? 99 : pct);
            setLoadedText(`${formatBytes(event.loaded)} / ${formatBytes(event.total)}`);

            const elapsedSeconds = (Date.now() - startTime) / 1000;
            if (elapsedSeconds > 0.3) {
              const bps = event.loaded / elapsedSeconds;
              setSpeedText(`${formatBytes(bps)}/s`);
              const remainingBytes = event.total - event.loaded;
              const etaSec = Math.ceil(remainingBytes / bps);
              setEtaText(etaSec > 0 && etaSec < 3600 ? `${etaSec}s left` : "");
            }
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const resData = JSON.parse(xhr.responseText);
              if (resData.key) {
                resolve(resData.key);
              } else {
                reject(new Error(resData.error || "Upload failed"));
              }
            } catch {
              reject(new Error("Invalid server response"));
            }
          } else {
            try {
              const errData = JSON.parse(xhr.responseText);
              reject(new Error(errData.error || `Upload failed with status ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error("Network connection error during upload."));
        xhr.send(file);
      });

      setUploadedKey(keyResult);
      onChange?.(keyResult);
      setProgress(100);
      setStatus("success");
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatus("error");
      setErrorMsg(err.message || "An unknown error occurred during upload.");
    }
  };

  const handleClear = async () => {
    if (uploadedKey) {
      try {
        await fetch("/api/admin/delete-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: uploadedKey }),
        });
      } catch (err) {
        console.error("Failed to delete file from R2:", err);
      }
    }
    setStatus("idle");
    setUploadedKey("");
    onChange?.("");
    setFileName("");
    setProgress(0);
    setLoadedText("");
    setSpeedText("");
    setEtaText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl p-4">
      <label className="block text-xs font-bold text-[#1A3C2F] mb-3 uppercase tracking-wide">
        {label} {required && "*"}
      </label>

      {/* Hidden input to pass the key to the form submission */}
      <input type="hidden" name={name} value={uploadedKey} />

      {status === "idle" && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#1A3C2F]/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-[#C4A35A]/50 transition-colors"
        >
          <UploadCloud className="w-8 h-8 text-[#1A3C2F]/40 mb-2" />
          <p className="text-sm font-bold text-[#1A3C2F]">Click to select a file</p>
          {accept && <p className="text-xs text-[#1A3C2F]/50 mt-1">Accepted: {accept}</p>}
        </div>
      )}

      {status === "uploading" && (
        <div className="bg-white border border-[#1A3C2F]/10 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Loader2 className="w-5 h-5 text-[#C4A35A] animate-spin shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#1A3C2F] truncate">{fileName}</p>
                <p className="text-xs text-[#1A3C2F]/60 font-medium">
                  {progress >= 99 ? "Finalizing server storage..." : `Uploading: ${loadedText}`}
                </p>
              </div>
            </div>
            {progress < 99 && (
              <div className="text-right shrink-0">
                <p className="text-xs font-mono font-black text-[#1A3C2F]">{progress}%</p>
                {speedText && (
                  <p className="text-[10px] text-[#C4A35A] font-bold tracking-tight">
                    {speedText} {etaText ? `• ${etaText}` : ""}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="w-full bg-[#FAF8F5] rounded-full h-2.5 overflow-hidden border border-[#1A3C2F]/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#1A3C2F] via-[#2A5C48] to-[#C4A35A] rounded-full transition-all duration-150 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-green-900 truncate">{fileName}</p>
              <p className="text-xs text-green-700 font-mono truncate flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                <span className="truncate">Key: {uploadedKey}</span>
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleClear}
            className="p-1.5 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-red-900 truncate">{fileName}</p>
              <p className="text-xs text-red-700 mt-0.5">{errorMsg}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleClear}
            className="text-xs font-bold text-red-700 hover:underline px-2 py-1"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
      />
    </div>
  );
}
