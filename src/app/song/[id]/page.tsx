import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import PrintButton from '@/components/PrintButton';
import ExportPptxButton from '@/components/ExportPptxButton';
import DeleteButton from '@/components/DeleteButton';
import SongControls from '@/components/SongControls';

interface SongProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return [];
}

const allowedBrackets = [
  '[intro]', '[verse]', '[verse 1]', '[verse 2]', '[verse 3]', 
  '[chorus]', '[chorus 1]', '[chorus 2]', '[chorus 3]', '[chorus final]',
  '[bridge]', '[outro]', '[end]'
];

function getLyricClass(line: string) {
  if (line.trim() === '') return 'h-6';
  const lower = line.trim().toLowerCase();
  if (lower.startsWith('[') && lower.endsWith(']')) {
    if (!allowedBrackets.includes(lower)) {
      return `hide-in-presentation text-on-surface-variant font-bold text-sm tracking-widest uppercase mt-4 mb-1`;
    }
    return 'text-primary font-bold text-sm tracking-widest uppercase mt-6 mb-2';
  }
  return 'text-white text-lg leading-relaxed';
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

export default async function SongPage({ params }: SongProps) {
  const { id } = await params;
  
  const snap = await getDoc(doc(db, 'songs', id));

  if (!snap.exists()) {
    return (
      <main className="pt-32 pb-32 px-container-padding max-w-4xl mx-auto text-center animate-fade-in">
        <h1 className="font-display-lg text-primary mb-6">Canción no encontrada</h1>
        <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-white transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
          Volver al inicio
        </Link>
      </main>
    );
  }

  const song = snap.data() as any;
  const embedUrl = getYouTubeEmbedUrl(song.youtubeLink);

  return (
    <main className="pt-24 pb-32 px-container-padding max-w-4xl mx-auto animate-fade-in space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors no-print font-label-sm uppercase tracking-widest">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver al inicio
      </Link>
      
      <article id="pdf-content" className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none no-print"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none no-print"></div>

        <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="space-y-2 flex-1">
            <h1 className="font-display-lg text-display-lg-mobile text-glow tracking-tighter text-white leading-tight">
              {song.title}
            </h1>
            <div className="flex gap-3 items-center no-print flex-wrap">
              <span className="bg-primary/20 text-primary-fixed-dim text-[11px] px-3 py-1 rounded-full uppercase font-bold tracking-widest border border-primary/30 inline-block">
                {song.style || 'Sin Estilo'}
              </span>
              {song.bpm && (
                <span className="bg-secondary/20 text-secondary text-[11px] px-3 py-1 rounded-full uppercase font-bold tracking-widest border border-secondary/30 inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  {song.bpm} BPM
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap no-print w-full md:w-auto">
            <SongControls />
            <PrintButton title={song.title} />
            <ExportPptxButton title={song.title} songs={[song]} />
            <Link href={`/editar/${id}`} className="bg-surface-container hover:bg-surface-container-highest text-white border border-white/10 p-3 rounded-xl transition-all shadow-lg flex items-center justify-center" title="Editar">
              <span className="material-symbols-outlined">edit</span>
            </Link>
            <DeleteButton songId={id} />
          </div>
        </header>

        {embedUrl && (
          <div className="no-print relative z-10 rounded-2xl overflow-hidden border border-white/10 mb-10 shadow-2xl aspect-video bg-black">
            <iframe 
              width="100%" 
              height="100%" 
              src={embedUrl} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        )}
        
        <div className="relative z-10 font-body-lg" id="lyrics-container">
          {song.lyrics.map((line: string, i: number) => (
            <p key={i} className={getLyricClass(line)}>
              {line}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
