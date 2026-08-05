"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import styles from '@/app/nueva-cancion/nueva.module.css';

export default function EditarCancion() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [source, setSource] = useState('manual');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('Cargando...');

  useEffect(() => {
    async function loadSong() {
      try {
        const snap = await getDoc(doc(db, 'songs', id));
        if (snap.exists()) {
          const song = snap.data();
          setTitle(song.title || '');
          setStyle(song.style || '');
          setLyrics((song.lyrics || []).join('\n'));
          setYoutubeLink(song.youtubeLink || '');
          if (song.source) setSource(song.source);
          if (song.tags) setTags(song.tags.join(', '));
          setStatus('');
        } else {
          setStatus('Canción no encontrada.');
        }
      } catch (err) {
        console.error(err);
        setStatus('Error al cargar la canción.');
      }
    }
    if (id) loadSong();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Guardando...');
    try {
      await updateDoc(doc(db, 'songs', id), {
        title,
        style,
        lyrics: lyrics.split('\n'),
        youtubeLink,
        source,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        updatedAt: new Date().toISOString()
      });
      router.push(`/song/${id}`);
    } catch (err: any) {
      console.error(err);
      setStatus('Error al guardar: ' + err.message);
    }
  };

  return (
    <div className={`container animate-fade-in ${styles.formContainer}`}>
      <h1 className={styles.title}>Editar Canción</h1>
      <form onSubmit={handleSubmit}>
        {(source === 'api' || source === 'api-verified') && (
          <div style={{ margin: '0 0 1.5rem 0', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #ffffff', padding: '1rem', borderRadius: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'white' }}>
              <input 
                type="checkbox" 
                checked={source === 'api-verified'}
                onChange={(e) => setSource(e.target.checked ? 'api-verified' : 'api')} 
                style={{ width: '1.2rem', height: '1.2rem' }} 
              />
              <span>Marcar letra como VERIFICADA (Desaparecerá la etiqueta, pero mantendrá su marco blanco)</span>
            </label>
          </div>
        )}

        <div className={styles.field}>
          <label>Título</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label>Estilo / Tempo (Opcional)</label>
          <input type="text" value={style} onChange={e => setStyle(e.target.value)} placeholder="Ej. Adoración, Júbilo 124 BPM" />
        </div>
        <div className={styles.field}>
          <label>Etiquetas (opcional, separadas por coma)</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Ej. Adoración, Rápida, Santa Cena" />
        </div>
        <div className={styles.field}>
          <label>Enlace de YouTube (Opcional)</label>
          <input type="url" value={youtubeLink} onChange={e => setYoutubeLink(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div className={styles.field}>
          <label>Letra</label>
          <textarea value={lyrics} onChange={e => setLyrics(e.target.value)} rows={15} required />
        </div>
        <button type="submit" className="btn-premium btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          ACTUALIZAR CANCIÓN
        </button>
      </form>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
