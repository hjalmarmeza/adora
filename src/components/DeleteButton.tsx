"use client";
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ songId, isManual = false }: { songId: string, isManual?: boolean }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isManual) {
      const pin = window.prompt('Esta canción fue ingresada manualmente. Ingresa el PIN para borrarla:');
      if (pin !== '5028') {
        alert('PIN incorrecto. No se puede borrar la canción.');
        return;
      }
    }

    const confirmDelete = window.confirm('¿Deseas enviar esta canción a la papelera? (Podrás restaurarla después)');
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      await updateDoc(doc(db, 'songs', songId), { deleted: true });
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
