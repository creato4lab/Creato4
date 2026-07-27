"use client";

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { generateDownloadUrl } from '@/actions/download';

export function DownloadButton({ productId, title }: { productId: string, title: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // For now we assume they want the source code or main ZIP
    const result = await generateDownloadUrl(productId, 'sourceCode');
    
    if (result.error) {
      alert(result.error);
      setIsDownloading(false);
      return;
    }

    if (result.success && result.url) {
      if ((result as any).isMock) {
        alert((result as any).message + "\n\nMock URL: " + result.url);
      } else {
        // Trigger download via hidden anchor
        const a = document.createElement('a');
        a.href = result.url;
        a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
    
    setIsDownloading(false);
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={isDownloading}
      className={`flex items-center justify-center gap-2 bg-[#1A3C2F] text-[#FAF8F5] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#234B3C] transition-colors ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} 
      {isDownloading ? 'Preparing...' : 'Download'}
    </button>
  );
}
