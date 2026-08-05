import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD') // Separa las letras de los acentos/tildes
    .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos (la ñ se convierte en n)
    .replace(/[^a-z0-9\s-]/g, '') // Elimina todo lo que no sea letra, número, espacio o guión
    .trim()
    .replace(/\s+/g, '-'); // Reemplaza los espacios por guiones
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const title = searchParams.get('title');

  if (!artist || !title) {
    return NextResponse.json({ error: 'Artista y título son requeridos' }, { status: 400 });
  }

  const artistSlug = slugify(artist);
  const titleSlug = slugify(title);
  const url = `https://www.letras.com/${artistSlug}/${titleSlug}/`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: 'Canción no encontrada en Letras.com' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Error al conectar con Letras.com' }, { status: res.status });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const lyricDiv = $('.lyric-original');
    if (!lyricDiv.length) {
       return NextResponse.json({ error: 'No se pudo extraer la letra de la página.' }, { status: 404 });
    }

    // Convertimos los <br> en saltos de línea reales para el texto
    lyricDiv.find('br').replaceWith('\n');
    
    let lyricsText = '';
    lyricDiv.find('p').each((_, el) => {
      lyricsText += $(el).text().trim() + '\n\n';
    });

    lyricsText = lyricsText.trim();

    if (!lyricsText) {
      return NextResponse.json({ error: 'La letra fue encontrada pero está vacía.' }, { status: 404 });
    }

    return NextResponse.json({ lyrics: lyricsText, url });

  } catch (error: any) {
    console.error('Error scraping letras.com:', error);
    return NextResponse.json({ error: 'Error interno del servidor al procesar la letra.' }, { status: 500 });
  }
}
