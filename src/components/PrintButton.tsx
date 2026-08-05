"use client";
import { useState } from 'react';

export default function PrintButton({ title }: { title?: string }) {
  const handleDownload = () => {
    window.print();
  };

  return (
    <button onClick={handleDownload} className="no-print bg-surface-container hover:bg-surface-container-highest text-white border border-white/10 p-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 font-label-sm uppercase tracking-widest">
      <span className="material-symbols-outlined">print</span>
      <span className="hidden sm:inline">IMPRIMIR / PDF</span>
    </button>
  );
}
