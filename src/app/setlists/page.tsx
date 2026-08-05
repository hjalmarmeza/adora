"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, addDoc, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function SetlistsPage() {
  const router = useRouter();
  const [setlists, setSetlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [musicians, setMusicians] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'setlists'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSetlists(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const docRef = await addDoc(collection(db, 'setlists'), {
        title,
        date,
        time,
        musicians,
        songs: [],
        createdAt: new Date().toISOString()
      });
      setTitle('');
      setDate('');
      setTime('');
      setMusicians('');
      setIsCreating(false);
      router.push(`/setlists/${docRef.id}`);
    } catch (err) {
      console.error(err);
      setIsCreating(false);
    }
  };

  return (
    <main className="pt-24 pb-32 px-container-padding max-w-4xl mx-auto space-y-12 animate-fade-in">
      <header className="relative text-center py-8">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>
        <h1 className="font-display-lg text-display-lg-mobile mb-2 text-glow tracking-tighter text-primary">Mis Setlists</h1>
        <p className="font-body-md text-on-surface-variant opacity-80">Organiza tus reuniones y servicios</p>
      </header>

      <section>
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-[40px] pointer-events-none"></div>
          <h2 className="font-headline-md text-secondary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">event_note</span>
            Crear Nuevo Evento
          </h2>
          <form onSubmit={handleCreate} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="font-label-sm text-primary uppercase tracking-widest">Título del Setlist / Evento</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Culto Domingo Mañana"
                className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-3 text-body-md text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-on-surface-variant/30"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <label className="font-label-sm text-primary uppercase tracking-widest">Fecha</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-3 text-body-md text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all [color-scheme:dark]" 
                />
              </div>
              <div className="space-y-2 flex-1">
                <label className="font-label-sm text-primary uppercase tracking-widest">Hora</label>
                <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-3 text-body-md text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all [color-scheme:dark]" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-primary uppercase tracking-widest">Músicos / Equipo (Opcional)</label>
              <input 
                type="text" 
                value={musicians} 
                onChange={(e) => setMusicians(e.target.value)}
                placeholder="Ej: Voz: Ana, Piano: Luis, Batería: Marcos"
                className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-3 text-body-md text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-on-surface-variant/30"
              />
            </div>
            <button 
              type="submit" 
              disabled={isCreating || !title}
              className="w-full primary-gradient py-4 rounded-xl font-label-sm text-on-primary-fixed shadow-lg active:scale-95 transition-transform flex justify-center items-center gap-2 mt-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">add_task</span>
              {isCreating ? 'CREANDO...' : 'CREAR EVENTO'}
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="font-headline-md text-headline-md mb-4 flex items-center gap-2">
          Eventos Recientes
          <span className="h-[1px] flex-grow bg-white/10"></span>
        </h3>
        
        {loading ? (
          <div className="text-center text-primary mt-8">Cargando setlists...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {setlists.map(setlist => (
              <Link href={`/setlists/${setlist.id}`} key={setlist.id}>
                <div className="glass-panel p-6 rounded-2xl group cursor-pointer active:scale-[0.98] transition-transform hover:border-primary/40 flex justify-between items-center h-full">
                  <div>
                    <h3 className="font-headline-md text-body-lg text-primary mb-2 group-hover:text-glow transition-all">{setlist.title}</h3>
                    <div className="flex flex-col gap-2">
                      <span className="bg-primary/20 text-primary-fixed-dim text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest border border-primary/30 inline-block w-max">
                        {setlist.songs?.length || 0} canciones
                      </span>
                      <p className="font-body-md text-on-surface-variant opacity-70 text-sm flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        {setlist.date ? `${setlist.date} ${setlist.time ? `• ${setlist.time}` : ''}` : 'Sin fecha configurada'}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary opacity-50 group-hover:opacity-100 transition-opacity">arrow_forward_ios</span>
                </div>
              </Link>
            ))}
            {setlists.length === 0 && (
              <div className="col-span-full text-center p-8 text-on-surface-variant opacity-70 glass-panel rounded-2xl">
                No hay setlists creados aún. Llena el formulario de arriba para empezar.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
