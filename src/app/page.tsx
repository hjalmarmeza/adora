"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [songsData, setSongsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'songs'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const songs = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((song: any) => !song.deleted);
      setSongsData(songs);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching songs", err);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const sortedSongs = [...songsData].sort((a, b) => {
    if (sortBy === 'newest') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }
    if (sortBy === 'oldest') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    }
    if (sortBy === 'az') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'za') return (b.title || '').localeCompare(a.title || '');
    return 0;
  });

  const filteredSongs = sortedSongs.filter(song => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = song.title && song.title.toLowerCase().includes(term);
    const matchesTag = selectedTag ? (song.tags && song.tags.includes(selectedTag)) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(songsData.flatMap(s => s.tags || []))).sort();

  return (
    <main className="pt-24 pb-32 px-container-padding max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative text-center py-8">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
        <p className="font-body-md text-on-surface-variant opacity-80 mb-8 mt-4">
          Repositorio de Adoración {!loading && songsData.length > 0 && `• ${songsData.length} canciones`}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/setlists">
            <button className="glass-panel px-8 py-3 rounded-full font-label-sm text-primary hover:opacity-80 transition-opacity active:scale-95">
              Ver Setlists
            </button>
          </Link>
          <Link href="/nueva-cancion">
            <button className="primary-gradient px-8 py-3 rounded-full font-label-sm text-on-primary-fixed shadow-lg active:scale-95 transition-transform">
              Nueva Canción
            </button>
          </Link>
        </div>
      </section>

      {/* Search Bar */}
      <section>
        <div className="glass-panel flex items-center px-6 py-4 rounded-2xl group focus-within:ring-2 focus-within:ring-primary/40 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant mr-4">search</span>
          <input 
            className="bg-transparent border-none p-0 focus:ring-0 w-full text-body-md placeholder:text-on-surface-variant/50 outline-none" 
            placeholder="Buscar por título..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none text-on-surface-variant text-sm outline-none cursor-pointer hidden md:block"
          >
            <option value="newest" className="bg-surface text-on-surface">Más recientes</option>
            <option value="oldest" className="bg-surface text-on-surface">Más antiguas</option>
            <option value="az" className="bg-surface text-on-surface">A - Z</option>
            <option value="za" className="bg-surface text-on-surface">Z - A</option>
          </select>
        </div>
      </section>

      {/* Filters */}
      {allTags.length > 0 && (
        <section>
          <div className="flex overflow-x-auto gap-3 hide-scrollbar -mx-container-padding px-container-padding">
            <button 
              onClick={() => setSelectedTag(null)}
              className={`flex-shrink-0 px-6 py-2 rounded-full font-label-sm transition-colors ${selectedTag === null ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(173,198,255,0.3)]' : 'glass-panel text-on-surface-variant hover:text-primary'}`}
            >
              Todos
            </button>
            {allTags.map(tag => (
              <button 
                key={tag as string}
                onClick={() => setSelectedTag(tag as string)}
                className={`flex-shrink-0 px-6 py-2 rounded-full font-label-sm transition-colors ${selectedTag === tag ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(173,198,255,0.3)]' : 'glass-panel text-on-surface-variant hover:text-primary'}`}
              >
                {tag as string}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Song Grid */}
      <section className="space-y-6">
        <h3 className="font-headline-md text-headline-md mb-4 flex items-center gap-2">
          Canciones
          <span className="h-[1px] flex-grow bg-white/10"></span>
        </h3>

        {loading ? (
          <div className="text-center text-primary mt-8">Cargando repertorio...</div>
        ) : filteredSongs.length === 0 ? (
          <div className="text-center text-on-surface-variant mt-8">No se encontraron canciones que coincidan con tu búsqueda.</div>
        ) : (
          filteredSongs.map((song) => {
            const isManual = song.source === 'manual';
            const borderClass = isManual 
              ? "!border-secondary/40 hover:!border-secondary/70 shadow-[0_0_15px_rgba(164,191,235,0.15)]" 
              : "!border-white/10 hover:!border-white/30";
              
            return (
            <Link href={`/song/${song.id}`} key={song.id}>
              <div className={`glass-panel rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform mb-6 border ${borderClass}`}>
                <div className="flex flex-col md:flex-row">
                  <div className="h-20 md:h-40 md:w-40 bg-surface-container-highest relative overflow-hidden flex-shrink-0">
                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-500 primary-gradient opacity-60"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent"></div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-headline-md text-body-lg text-primary">{song.title}</h4>
                        {song.source === 'api-verified' ? (
                          <span className="bg-primary/20 text-primary-fixed-dim text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest border border-primary/30">
                            Verificada
                          </span>
                        ) : song.source === 'api' ? (
                          <span className="bg-white/5 text-on-surface-variant/40 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest border border-white/10">
                            No Verificada
                          </span>
                        ) : (
                          <span className="bg-white/5 text-on-surface-variant/40 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest border border-white/10">
                            Manual
                          </span>
                        )}
                      </div>
                      <p className="font-body-md text-on-surface-variant opacity-70 line-clamp-2">
                        {song.style || 'Sin estilo definido'}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-on-surface-variant/60">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">music_note</span>
                        <span className="text-label-sm">{song.key || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">timer</span>
                        <span className="text-label-sm">{song.bpm || 'N/A'} BPM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            );
          })
        )}
      </section>
    </main>
  );
}
