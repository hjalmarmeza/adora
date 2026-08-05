"use client";

import { useState, useEffect, useRef } from 'react';

export default function SongControls() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err.message);
      });
      // Start scrolling automatically when entering projector mode
      setIsScrolling(true);
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
        document.body.classList.add('projector-mode');
      } else {
        document.body.classList.remove('projector-mode');
        setIsScrolling(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleScroll = () => {
    setIsScrolling(prev => !prev);
  };

  useEffect(() => {
    if (isScrolling) {
      scrollInterval.current = setInterval(() => {
        window.scrollBy(0, 1);
      }, 50); // Speed: 1px per 50ms
    } else {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    }
    return () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
  }, [isScrolling]);

  return (
    <>
      <button onClick={toggleFullscreen} className="bg-surface-container hover:bg-surface-container-highest text-white border border-white/10 p-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 font-label-sm uppercase tracking-widest" title="Modo Proyector">
        {isFullscreen ? (
          <span className="material-symbols-outlined">fullscreen_exit</span>
        ) : (
          <span className="material-symbols-outlined">fullscreen</span>
        )}
        <span className="hidden sm:inline">{isFullscreen ? 'SALIR' : 'PROYECTOR'}</span>
      </button>

      <button onClick={toggleScroll} className="bg-surface-container hover:bg-surface-container-highest text-white border border-white/10 p-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 font-label-sm uppercase tracking-widest" title="Auto-Scroll">
        {isScrolling ? (
          <span className="material-symbols-outlined">pause</span>
        ) : (
          <span className="material-symbols-outlined">play_arrow</span>
        )}
        <span className="hidden sm:inline">{isScrolling ? 'PAUSAR' : 'SCROLL'}</span>
      </button>
    </>
  );
}
