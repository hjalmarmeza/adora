"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ExportPptxButton from '@/components/ExportPptxButton';
import styles from '@/app/page.module.css';

export default function SetlistDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [setlist, setSetlist] = useState<any>(null);
  const [allSongs, setAllSongs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [setlistSnap, songsSnap] = await Promise.all([
          getDoc(doc(db, 'setlists', id)),
          getDocs(collection(db, 'songs'))
        ]);
        
        if (setlistSnap.exists()) {
          setSetlist(setlistSnap.data());
        }
        
        const songs = songsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        songs.sort((a, b) => a.title.localeCompare(b.title));
        setAllSongs(songs);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const saveSetlist = async (updates: any) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'setlists', id), updates);
      setSetlist({ ...setlist, ...updates });
    } catch (err) {
      console.error(err);
      alert('Error guardando cambios');
    } finally {
      setSaving(false);
    }
  };

  const addSong = (song: any) => {
    const newSongs = [...(setlist.songs || []), { id: song.id, title: song.title, style: song.style }];
    saveSetlist({ songs: newSongs });
    setSearch('');
  };

  const removeSong = (index: number) => {
    const newSongs = [...setlist.songs];
    newSongs.splice(index, 1);
    saveSetlist({ songs: newSongs });
  };

  const handleTitleChange = (e: any) => {
    setSetlist({ ...setlist, title: e.target.value });
  };
  const handleTitleBlur = () => {
    saveSetlist({ title: setlist.title });
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      const allowedBrackets = [
        '[intro]', '[verse]', '[verse 1]', '[verse 2]', '[verse 3]', 
        '[chorus]', '[chorus 1]', '[chorus 2]', '[chorus 3]', '[chorus final]',
        '[bridge]', '[outro]', '[end]'
      ];
      
      // Build a massive hidden HTML element with all full lyrics
      const container = document.createElement('div');
      container.style.padding = '20px';
      
      setlist.songs.forEach((s: any, index: number) => {
        const fullSong = allSongs.find(as => as.id === s.id);
        if (fullSong) {
          const article = document.createElement('article');
          article.style.pageBreakAfter = 'always';
          article.innerHTML = `
            <div style="margin-bottom: 20px;">
              <h1 style="font-size: 24px; font-weight: bold; margin: 0;">${fullSong.title}</h1>
              <p style="color: #666; font-size: 12px; margin: 5px 0;">${fullSong.style}</p>
            </div>
            <div style="font-size: 16px; line-height: 1.6;">
              ${fullSong.lyrics.map((l: string) => {
                if (l.trim() === '') return '<br/>';
                const lower = l.trim().toLowerCase();
                if (lower.startsWith('[') && lower.endsWith(']')) {
                  if (!allowedBrackets.includes(lower)) return ''; // Filter out
                }
                return `<p style="margin:0">${l}</p>`;
              }).join('')}
            </div>
          `;
          container.appendChild(article);
        }
      });

      const opt = {
        margin:       [15, 15, 15, 15],
        filename:     `${setlist.title}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(container).save();
    } catch (err) {
      console.error(err);
      alert('Error generando PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareWhatsApp = () => {
    let text = `🎵 *Setlist: ${setlist.title}*\n`;
    if (setlist.date) {
      text += `📅 Fecha: ${setlist.date} ${setlist.time ? `a las ${setlist.time}` : ''}\n`;
    }
    if (setlist.musicians) {
      text += `👥 Equipo: ${setlist.musicians}\n`;
    }
    text += `\n*Canciones:*\n`;
    setlist.songs?.forEach((s: any, idx: number) => {
      const songData = allSongs.find(as => as.id === s.id);
      if (songData) {
        text += `${idx + 1}. ${songData.title}\n`;
        if (songData.youtubeLink) text += `   ▶️ ${songData.youtubeLink}\n`;
      }
    });
    
    text += `\n🔗 Ver completo en Adora: ${window.location.href}`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>Cargando...</div>;
  if (!setlist) return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>Setlist no encontrado</div>;

  const searchResults = search.trim() === '' ? [] : allSongs.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) &&
    !setlist.songs?.find((added: any) => added.id === s.id)
  ).slice(0, 5);

  return (
    <main className="container animate-fade-in">
      <Link href="/setlists" className="btn-premium btn-secondary" style={{ marginBottom: '2rem' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        VOLVER A SETLISTS
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <header>
          <input 
            type="text" 
            value={setlist.title} 
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px dashed var(--accent-gold)',
              color: 'var(--text-primary)',
              fontSize: '2.5rem',
              fontFamily: 'var(--font-playfair)',
              width: '100%',
              outline: 'none',
              marginBottom: '0.5rem'
            }}
          />
          {setlist.date && (
            <p style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
              📅 {setlist.date} {setlist.time && `⏰ ${setlist.time}`}
            </p>
          )}
          {setlist.musicians && (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '1rem' }}>
              🎵 Equipo: {setlist.musicians}
            </p>
          )}
          {saving && <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem' }}>Guardando...</span>}
        </header>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-inter)', fontSize: '1.2rem' }}>Añadir Canción</h2>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Buscar canción..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#111', border: '1px solid var(--border-color)', borderRadius: '4px', zIndex: 10, marginTop: '4px' }}>
                {searchResults.map(song => (
                  <div 
                    key={song.id} 
                    onClick={() => addSong(song)}
                    style={{ padding: '1rem', borderBottom: '1px solid #222', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>{song.title}</span>
                    <span style={{ color: 'var(--accent-gold)' }}>+ Añadir</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: '1.2rem' }}>Canciones del Setlist ({setlist.songs?.length || 0})</h2>
            {setlist.songs?.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={generatePDF} 
                  disabled={isGenerating}
                  className="btn-premium btn-primary"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  {isGenerating ? 'GENERANDO...' : 'DESCARGAR PDF'}
                </button>
                <ExportPptxButton 
                  title={setlist.title} 
                  songs={setlist.songs.map((s: any) => allSongs.find(as => as.id === s.id)).filter(Boolean)}
                />
                <button 
                  onClick={shareWhatsApp}
                  className="btn-premium btn-secondary"
                  style={{ borderColor: '#25D366', color: '#25D366' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  COMPARTIR
                </button>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(!setlist.songs || setlist.songs.length === 0) && (
              <p style={{ color: '#888' }}>No hay canciones en este setlist.</p>
            )}
            {setlist.songs?.map((song: any, index: number) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '4px', border: '1px solid #222' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#555', fontWeight: 'bold' }}>{index + 1}.</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{song.title}</h3>
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>{song.style}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link href={`/song/${song.id}`} target="_blank" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.9rem' }}>Ver Letra ↗</Link>
                  <button onClick={() => removeSong(index)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.9rem' }}>Quitar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
