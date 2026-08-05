"use client";
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ songId }: { songId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar permanentemente esta canción? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'songs', songId));
      router.push('/');
    } catch (err: any) {
      console.error(err);
      alert('Error al eliminar: ' + err.message);
      setIsDeleting(false);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isDeleting} className="no-print bg-error-container/20 hover:bg-error-container/40 text-error border border-error/30 h-12 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 font-label-sm uppercase tracking-widest disabled:opacity-50 shrink-0">
      <span className="material-symbols-outlined">delete</span>
      <span className="hidden md:inline">{isDeleting ? 'BORRANDO...' : 'ELIMINAR'}</span>
    </button>
  );
}
