"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function Papelera() {
  const [songsData, setSongsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'songs'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const songs = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((song: any) => song.deleted === true);
      
      setSongsData(songs);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching songs", err);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleRestore = async (id: string, title: string) => {
    try {
      await updateDoc(doc(db, 'songs', id), { deleted: false });
    } catch (err: any) {
      alert('Error al restaurar: ' + err.message);
    }
  };

  const handleHardDelete = async (song: any) => {
    if (song.source !== 'api' && song.source !== 'api-verified') {
      const pin = window.prompt('Esta canción fue ingresada manualmente. Ingresa el PIN para borrarla definitivamente:');
      if (pin !== '5028') {
        alert('PIN incorrecto. No se puede borrar la canción.');
        return;
      }
    }

    const confirm = window.confirm(`¿Estás seguro de eliminar "${song.title}" definitivamente? Esta acción NO se puede deshacer.`);
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'songs', song.id));
    } catch (err: any) {
      alert('Error al eliminar definitivamente: ' + err.message);
    }
  };

  return (
    <main className="pt-24 pb-32 px-container-padding max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative text-center py-8">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-error/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="inline-flex items-center justify-center bg-error-container/20 text-error p-4 rounded-full mb-6 shadow-lg shadow-error/10">
          <span className="material-symbols-outlined text-4xl">delete</span>
        </div>
        <h1 className="font-display-lg text-display-lg-mobile text-glow tracking-tighter text-white">
          Papelera
        </h1>
        <p className="font-body-md text-on-surface-variant opacity-80 mt-4 max-w-lg mx-auto">
          Aquí se encuentran las canciones que han sido eliminadas. Puedes restaurarlas o borrarlas definitivamente.
        </p>
      </section>

      {/* Song Grid */}
      <section className="space-y-6">
        {loading ? (
          <div className="text-center text-primary mt-8">Cargando papelera...</div>
        ) : songsData.length === 0 ? (
          <div className="text-center text-on-surface-variant mt-8 bg-surface-container/30 p-12 rounded-3xl border border-white/5">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-4 block">check_circle</span>
            <p>La papelera está vacía.</p>
          </div>
        ) : (
          songsData.map((song) => {
            const isManual = song.source !== 'api' && song.source !== 'api-verified';
            const borderStyle = isManual ? { border: '1px solid rgba(221, 183, 255, 0.5)', borderLeft: '4px solid #ddb7ff' } : { border: '1px solid rgba(255, 180, 171, 0.1)' };
            const borderClass = isManual 
              ? "shadow-[0_0_20px_rgba(221,183,255,0.15)]" 
              : "hover:border-error/30";

            return (
            <div style={borderStyle} key={song.id} className={`glass-panel rounded-2xl overflow-hidden mb-6 flex flex-col md:flex-row items-center justify-between p-6 transition-colors ${borderClass}`}>
              <div className="flex-grow mb-4 md:mb-0 w-full md:w-auto">
                <h4 className="font-headline-md text-body-lg text-white mb-1">{song.title}</h4>
                <p className="font-body-md text-on-surface-variant opacity-70">
                  {song.style || 'Sin estilo definido'}
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleRestore(song.id, song.title)}
                  className="flex-1 md:flex-none glass-panel px-6 py-3 rounded-xl font-label-sm text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">restore</span>
                  Restaurar
                </button>
                <button 
                  onClick={() => handleHardDelete(song)}
                  className="flex-1 md:flex-none bg-error-container/20 hover:bg-error-container/40 text-error border border-error/30 px-6 py-3 rounded-xl font-label-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                  Eliminar
                </button>
              </div>
            </div>
          )})
        )}
      </section>
    </main>
  );
}
