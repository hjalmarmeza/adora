"use client";
import { useState } from 'react';

export default function PrintButton({ title }: { title?: string }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('pdf-content');
      
      const opt = {
        margin:       [20, 20, 20, 20],
        filename:     `${title || 'cancion'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      if (!element) throw new Error("No se encontró el contenido para PDF");
      document.body.classList.add('pdf-export-mode');
      
      await html2pdf().set(opt as any).from(element).save();
      
      document.body.classList.remove('pdf-export-mode');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Hubo un error al generar el PDF.');
      document.body.classList.remove('pdf-export-mode');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={isGenerating} className="no-print bg-surface-container hover:bg-surface-container-highest text-white border border-white/10 p-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 font-label-sm uppercase tracking-widest disabled:opacity-50">
      <span className="material-symbols-outlined">picture_as_pdf</span>
      <span className="hidden sm:inline">{isGenerating ? 'GENERANDO...' : 'PDF'}</span>
    </button>
  );
}
