"use client";
import { useState } from 'react';

interface SharePdfButtonProps {
  song: { title: string; style?: string; lyrics: string[] };
}

export default function SharePdfButton({ song }: SharePdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      const allowedBrackets = [
        '[intro]', '[verse]', '[verse 1]', '[verse 2]', '[verse 3]', 
        '[chorus]', '[chorus 1]', '[chorus 2]', '[chorus 3]', '[chorus final]',
        '[bridge]', '[outro]', '[end]'
      ];
      
      const container = document.createElement('div');
      container.style.padding = '30px';
      container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      container.style.backgroundColor = 'white';
      container.style.color = 'black';
      container.style.position = 'relative';
      container.style.minHeight = '1000px'; // ensure enough space for absolute watermark
      
      let lyricsHtml = '';
      song.lyrics.forEach(line => {
        if (line.trim() === '') {
          lyricsHtml += '<br/>';
          return;
        }
        
        let processedLine = line;
        const parts = line.split(/(\[.*?\])/g);
        let lineContent = '';
        
        parts.forEach(part => {
          if (part.startsWith('[') && part.endsWith(']')) {
            const lower = part.toLowerCase();
            if (allowedBrackets.includes(lower)) {
              lineContent += `<span style="display:inline-block; margin-top: 14px; margin-bottom: 4px; font-size: 11px; font-weight: 800; background-color: #f1f5f9; color: #0f172a; padding: 4px 10px; border-radius: 4px; border: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.1em;">${part}</span><br/>`;
            }
          } else {
            lineContent += `<span>${part}</span>`;
          }
        });
        
        if (lineContent) {
          lyricsHtml += `<div style="margin-bottom: 2px; font-size: 14px; font-weight: 500; color: #1e293b; line-height: 1.35;">${lineContent}</div>`;
        }
      });

      container.innerHTML = `
        <div style="background: linear-gradient(135deg, #0f172a 0%, #312e81 100%); padding: 16px 24px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em;">${song.title.toUpperCase()}</h1>
        </div>
        <div style="max-width: 800px; margin: 0 auto; padding-bottom: 100px;">
          ${lyricsHtml}
        </div>
        <div style="position: absolute; bottom: 30px; right: 40px;">
          <svg width="150" height="60" viewBox="0 0 150 60">
            <text x="75" y="40" font-family="sans-serif" font-size="22" font-weight="900" letter-spacing="0.15em" fill="#334155" text-anchor="middle">A D O R A</text>
            <path d="M 60,15 Q 75,5 90,15" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      `;

      const opt = {
        margin:       [10, 10, 10, 10],
        filename:     `${song.title}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdfBlob = await html2pdf().set(opt).from(container).output('blob');
      const file = new File([pdfBlob], `${song.title}.pdf`, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: song.title,
          text: `Acordes y Letra: ${song.title}`,
        });
      } else {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${song.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
      alert('Error generando PDF para compartir');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button onClick={handleShare} disabled={isGenerating} className="no-print bg-surface-container hover:bg-surface-container-highest text-white border border-white/10 h-12 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 font-label-sm uppercase tracking-widest shrink-0">
      <span className="material-symbols-outlined">share</span>
      <span className="hidden sm:inline">{isGenerating ? 'PREPARANDO...' : 'COMPARTIR'}</span>
    </button>
  );
}
