"use client";
import { useState } from 'react';

import pptxgen from 'pptxgenjs';

interface ExportPptxButtonProps {
  title: string;
  songs: { title: string, lyrics: string[] }[];
}

export default function ExportPptxButton({ title, songs }: ExportPptxButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      let pptx = new pptxgen();
      
      pptx.layout = 'LAYOUT_16x9';

      const allowedBrackets = [
        '[intro]', '[verse]', '[verse 1]', '[verse 2]', '[verse 3]', 
        '[chorus]', '[chorus 1]', '[chorus 2]', '[chorus 3]', '[chorus final]',
        '[bridge]', '[outro]', '[end]'
      ];

      songs.forEach((song) => {
        // Create Title Slide
        let slide = pptx.addSlide();
        slide.background = { color: '000000' };
        slide.addText(song.title, { 
          x: 0, y: "40%", w: "100%", h: 1, 
          fontSize: 60, color: 'FFFFFF', align: 'center', bold: true 
        });

        // Group lyrics into slides
        let currentSlideLines: string[] = [];
        let sectionName = '';

        const finalizeSlide = () => {
          if (currentSlideLines.length > 0) {
            // Split into chunks of 4 lines max so they always fit on the screen
            const chunkSize = 4;
            for (let i = 0; i < currentSlideLines.length; i += chunkSize) {
              const chunk = currentSlideLines.slice(i, i + chunkSize);
              let s = pptx.addSlide();
              s.background = { color: '000000' };
              
              if (sectionName) {
                 s.addText(sectionName.replace(/[\[\]]/g, '').toUpperCase(), {
                   x: 0.5, y: 0.5, w: 5, h: 0.5, fontSize: 16, color: '888888', fontFace: 'Arial'
                 });
              }
              
              s.addText(chunk.join('\n'), {
                x: 0.5, y: 1.5, w: "90%", h: "60%",
                fontSize: 44, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Arial', bold: true
              });
            }
            currentSlideLines = [];
          }
        };

        song.lyrics.forEach(line => {
          if (line.trim() === '') {
             finalizeSlide();
             return;
          }

          const parts = line.split(/(\[.*?\])/g);
          let lineText = '';

          parts.forEach(part => {
            if (part.startsWith('[') && part.endsWith(']')) {
              const lower = part.toLowerCase();
              const isStandard = allowedBrackets.includes(lower);
              if (isStandard) {
                 finalizeSlide();
                 sectionName = part;
              }
            } else {
              lineText += part;
            }
          });

          const trimmedLine = lineText.trim();
          if (trimmedLine) {
             currentSlideLines.push(trimmedLine);
          }
        });
        
        finalizeSlide();
      });

      await pptx.writeFile({ fileName: `${title}.pptx` });

    } catch (error) {
      console.error('Error generating PPTX:', error);
      alert('Hubo un error al generar el PowerPoint.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={isGenerating} className="no-print primary-gradient text-on-primary-fixed border border-primary/30 hover:shadow-[0_0_20px_rgba(173,198,255,0.3)] p-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 font-label-sm uppercase tracking-widest disabled:opacity-50">
      <span className="material-symbols-outlined">slideshow</span>
      <span className="hidden sm:inline">{isGenerating ? 'GENERANDO...' : 'PPTX'}</span>
    </button>
  );
}
