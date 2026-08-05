import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "¡Adora! - Repositorio de Adoración",
  description: "Repositorio Premium de Letras de Adoración",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className={`${inter.variable} ${montserrat.variable} font-body-md overflow-x-hidden antialiased bg-background`}>
        {/* Top App Bar */}
        <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(173,198,255,0.1)] flex justify-center items-center px-container-padding h-16">
          <Link href="/">
            <h1 className="font-display-lg text-display-lg-mobile bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">¡Adora!</h1>
          </Link>
        </header>

        {children}

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container/40 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex justify-around items-center h-20 px-gutter pb-safe">
          <Link href="/" className="flex flex-col items-center justify-center text-primary filter drop-shadow-[0_0_8px_rgba(173,198,255,0.5)] active:scale-90 transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>library_music</span>
            <span className="font-label-sm text-label-sm">Library</span>
          </Link>
          <Link href="/setlists" className="flex flex-col items-center justify-center text-on-tertiary-fixed-variant opacity-60 hover:text-primary-fixed-dim transition-colors active:scale-90 transition-transform">
            <span className="material-symbols-outlined">event_note</span>
            <span className="font-label-sm text-label-sm">Setlists</span>
          </Link>
          <Link href="/nueva-cancion" className="flex flex-col items-center justify-center text-on-tertiary-fixed-variant opacity-60 hover:text-primary-fixed-dim transition-colors active:scale-90 transition-transform">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="font-label-sm text-label-sm">New Song</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
