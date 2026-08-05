"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function NuevaCancion() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [artist, setArtist] = useState('');
  const [source, setSource] = useState('manual');
  const [tags, setTags] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [status, setStatus] = useState('');

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchStatus('Buscando letra en Letras.com...');
    try {
      const res = await fetch(`/api/letras?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'No encontrada');
      }
      
      if (data.lyrics) {
        setLyrics(data.lyrics);
        setSource('api');
        setSearchStatus('¡Letra encontrada e importada con éxito de Letras.com!');
      } else {
        setSearchStatus('No se encontró la letra para esta canción.');
      }
    } catch (e: any) {
      setSearchStatus(e.message || 'No se encontró la letra. Verifica el artista y título.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Guardando...');
    try {
      await addDoc(collection(db, 'songs'), {
        title,
        style,
        lyrics: lyrics.split('\n'),
        youtubeLink,
        source,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        order: Date.now(),
        createdAt: new Date().toISOString()
      });
      router.push('/');
    } catch (err: any) {
      setStatus('Error: ' + err.message);
    }
  };

  return (
    <main className="pt-24 pb-32 px-container-padding max-w-2xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center">
        <h2 className="font-display-lg text-display-lg-mobile mb-2 text-glow tracking-tighter text-primary">Nueva Canción</h2>
        <p className="font-body-md text-on-surface-variant opacity-80">Agrega una nueva canción a la colección</p>
      </header>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-6">
        
        {/* Título */}
        <div className="space-y-2">
          <label className="font-label-sm text-primary uppercase tracking-widest">Título de la Canción</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
            className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-3 text-body-md text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/30"
            placeholder="Ej. Cuán Grande es Él"
          />
        </div>
        
        {/* API Search Box */}
        <div className="bg-surface-container/30 border border-primary/20 p-6 rounded-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none"></div>
          <h3 className="font-label-sm text-secondary uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">cloud_download</span>
            ¿Traer letra de internet?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Artista (Ej. Hillsong)" 
              value={artist} 
              onChange={e => setArtist(e.target.value)} 
              className="flex-1 bg-surface-container/50 border border-white/10 rounded-lg p-3 text-body-md text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/30" 
            />
            <button 
              type="button" 
              onClick={handleSearch} 
              disabled={isSearching || !artist || !title} 
              className="glass-panel px-6 py-3 rounded-lg font-label-sm text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSearching ? 'BUSCANDO...' : 'BUSCAR LETRA'}
            </button>
          </div>
          {searchStatus && (
            <p className={`font-label-sm ${searchStatus.includes('éxito') ? 'text-[#25D366]' : 'text-error'}`}>
              {searchStatus}
            </p>
          )}
        </div>

        {/* Estilo y Tempo */}
        <div className="space-y-2">
          <label className="font-label-sm text-primary uppercase tracking-widest">Estilo / Tempo (Opcional)</label>
          <input 
            type="text" 
            value={style} 
            onChange={e => setStyle(e.target.value)} 
            placeholder="Ej. Adoración, Júbilo 124 BPM" 
            className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-3 text-body-md text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/30"
          />
        </div>

        {/* Etiquetas */}
        <div className="space-y-2">
          <label className="font-label-sm text-primary uppercase tracking-widest">Etiquetas (opcional, separadas por coma)</label>
          <input 
            type="text" 
            value={tags} 
            onChange={e => setTags(e.target.value)} 
            placeholder="Ej. Adoración, Rápida, Santa Cena" 
            className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-3 text-body-md text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/30"
          />
        </div>

        {/* YouTube */}
        <div className="space-y-2">
          <label className="font-label-sm text-primary uppercase tracking-widest">Enlace de YouTube (Opcional)</label>
          <div className="flex relative items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/50">play_circle</span>
            <input 
              type="url" 
              value={youtubeLink} 
              onChange={e => setYoutubeLink(e.target.value)} 
              placeholder="https://www.youtube.com/watch?v=..." 
              className="w-full bg-surface-container/50 border border-white/10 rounded-lg py-3 pr-3 pl-10 text-body-md text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/30"
            />
          </div>
        </div>

        {/* Letra */}
        <div className="space-y-2">
          <label className="font-label-sm text-primary uppercase tracking-widest">Letra</label>
          <textarea 
            value={lyrics} 
            onChange={e => setLyrics(e.target.value)} 
            rows={12} 
            required 
            placeholder="Pega aquí la letra..." 
            className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-4 text-body-md text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/30 font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full primary-gradient py-4 rounded-xl font-label-sm text-on-primary-fixed shadow-lg active:scale-95 transition-transform flex justify-center items-center gap-2 mt-4"
        >
          <span className="material-symbols-outlined">save</span>
          GUARDAR CANCIÓN
        </button>

      </form>
      
      {status && (
        <div className="glass-panel p-4 rounded-lg text-center text-primary font-label-sm">
          {status}
        </div>
      )}
    </main>
  );
}
