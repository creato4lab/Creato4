"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle, AlertTriangle, Loader2, File as FileIcon, X } from "lucide-react";

interface FileUploadProps {
  name: string; // The form name for the hidden input (e.g., "sourceCodePath")
  label: string;
  prefix: string; // R2 folder prefix (e.g., "source-code")
  accept?: string; // e.g., ".zip,.rar", ".pdf", ".bin,.uf2"
  required?: boolean;
}

export function FileUpload({ name, label, prefix, accept, required }: FileUploadProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadedKey, setUploadedKey] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("uploading");
    setProgress(0);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", prefix);

      await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload-file", true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const pct = Math.round((event.loaded / event.total) * 100);
            setProgress(pct);
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
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(formData);
      }).then((key) => {
        setUploadedKey(key);
        setStatus("success");
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatus("error");
      setErrorMsg(err.message || "An unknown error occurred during upload.");
    }
  };

  const handleClear = () => {
    setStatus("idle");
    setUploadedKey("");
    setFileName("");
    setProgress(0);
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
        <div className="bg-white border border-[#1A3C2F]/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-[#C4A35A] animate-spin" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1A3C2F] truncate">{fileName}</p>
              <p className="text-xs text-[#1A3C2F]/60">Uploading... {progress}%</p>
            </div>
          </div>
          <div className="w-full bg-[#FAF8F5] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1A3C2F] to-[#C4A35A] transition-all duration-300"
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
              <p className="text-xs text-green-700 font-mono truncate">{uploadedKey}</p>
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
