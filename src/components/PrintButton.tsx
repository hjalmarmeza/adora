"use client";
import { useState } from 'react';

export default function PrintButton({ title }: { title?: string }) {
  const handleDownload = () => {
    window.print();
  };

  return (
    <button onClick={handleDownload} className="no-print bg-surface-container hover:bg-surface-container-highest text-white border border-white/10 h-12 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 font-label-sm uppercase tracking-widest shrink-0">
      <span className="material-symbols-outlined">download</span>
      <span className="hidden sm:inline">PDF</span>
    </button>
  );
}
