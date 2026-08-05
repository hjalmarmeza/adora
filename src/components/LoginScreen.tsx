"use client";
import { useState } from "react";
import { verifyPin } from "@/app/actions/auth";

export default function LoginScreen() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    
    setIsLoading(true);
    const isValid = await verifyPin(pin);
    
    if (isValid) {
      // Refresh the page so layout.tsx reads the new cookie
      window.location.reload();
    } else {
      setError(true);
      setPin("");
      setIsLoading(false);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleNumClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      <div className="z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display-lg text-4xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">¡Adora!</h1>
          <p className="text-on-surface-variant text-sm tracking-widest uppercase">Repositorio Premium</p>
        </div>

        <form onSubmit={handleLogin} className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="flex justify-center gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${i < pin.length ? 'bg-primary shadow-[0_0_15px_rgba(173,198,255,0.8)]' : 'bg-surface-container-highest border border-white/10'}`}></div>
            ))}
          </div>

          {error && (
            <p className="text-error text-center text-sm mb-4 font-bold animate-pulse">PIN INCORRECTO</p>
          )}

          <div className="grid grid-cols-3 gap-4 mb-6">
            {['1','2','3','4','5','6','7','8','9'].map(num => (
              <button type="button" key={num} onClick={() => handleNumClick(num)} className="h-16 rounded-2xl bg-surface-container/50 hover:bg-surface-container text-2xl font-light text-white border border-white/5 transition-all active:scale-95">
                {num}
              </button>
            ))}
            <div className="h-16"></div>
            <button type="button" onClick={() => handleNumClick('0')} className="h-16 rounded-2xl bg-surface-container/50 hover:bg-surface-container text-2xl font-light text-white border border-white/5 transition-all active:scale-95">
              0
            </button>
            <button type="button" onClick={handleDelete} className="h-16 rounded-2xl bg-surface-container/50 hover:bg-surface-container text-white border border-white/5 transition-all active:scale-95 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">backspace</span>
            </button>
          </div>

          <button type="submit" disabled={pin.length !== 4 || isLoading} className="w-full h-14 primary-gradient text-on-primary-fixed font-bold tracking-widest uppercase rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_20px_rgba(173,198,255,0.3)]">
            {isLoading ? "VERIFICANDO..." : "INGRESAR"}
          </button>
        </form>
      </div>
    </div>
  );
}
