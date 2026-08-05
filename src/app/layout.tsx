import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import LoginScreen from "@/components/LoginScreen";
import LogoutButton from "@/components/LogoutButton";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "¡Adora! - Repositorio de Adoración",
  description: "Repositorio Premium de Letras de Adoración",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Adora Lyrics",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("adora_auth")?.value === "true";

  if (!isAuthenticated) {
    return (
      <html lang="es" className="dark">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
          <link rel="apple-touch-icon" href="/icons/adora_logo.jpg" />
        </head>
        <body className={`${inter.variable} ${montserrat.variable} font-body-md overflow-x-hidden antialiased bg-background`}>
          <LoginScreen />
        </body>
      </html>
    );
  }

  return (
    <html lang="es" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        <link rel="apple-touch-icon" href="/icons/adora_logo.jpg" />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} font-body-md overflow-x-hidden antialiased bg-background`}>
        {/* Top App Bar */}
        <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(173,198,255,0.1)] flex justify-center items-center px-container-padding h-16 no-print relative">
          <Link href="/">
            <h1 className="font-display-lg text-display-lg-mobile bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">¡Adora!</h1>
          </Link>
          <LogoutButton />
        </header>

        {children}

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 w-full glass-panel border-t border-white/5 pb-safe z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] no-print">
          <nav className="flex justify-around items-center h-20 px-4 md:px-8 max-w-4xl mx-auto">
            <Link href="/" className="flex flex-col items-center gap-1.5 p-2 text-on-surface-variant hover:text-primary transition-colors active:scale-95 group">
              <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">library_music</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Librería</span>
            </Link>
            <Link href="/setlists" className="flex flex-col items-center gap-1.5 p-2 text-on-surface-variant hover:text-primary transition-colors active:scale-95 group">
              <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">queue_music</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Setlists</span>
            </Link>
            <Link href="/nueva-cancion" className="flex flex-col items-center gap-1.5 p-2 text-on-surface-variant hover:text-primary transition-colors active:scale-95 group">
              <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">add_circle</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Nueva</span>
            </Link>
            <Link href="/papelera" className="flex flex-col items-center gap-1.5 p-2 text-on-surface-variant hover:text-primary transition-colors active:scale-95 group">
              <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">delete</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Papelera</span>
            </Link>
          </nav>
        </div>
      </body>
    </html>
  );
}
