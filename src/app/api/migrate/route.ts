import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import songsData from '@/data/songs.json';

export async function GET() {
  try {
    const songsCol = collection(db, 'songs');
    let count = 0;
    
    // Upload each song with its index as the ID to preserve the order for now
    for (let i = 0; i < songsData.length; i++) {
      const song = songsData[i];
      const songRef = doc(songsCol, i.toString());
      await setDoc(songRef, {
        title: song.title,
        style: song.style,
        lyrics: song.lyrics,
        order: i,
        createdAt: new Date().toISOString()
      });
      count++;
    }
    
    return NextResponse.json({ success: true, count, message: 'Migración completada con éxito.' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
