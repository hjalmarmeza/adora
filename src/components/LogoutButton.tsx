"use client";

import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const confirm = window.confirm("¿Seguro que quieres cerrar sesión?");
    if (confirm) {
      await logout();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant hover:text-error transition-colors flex items-center justify-center group"
      title="Cerrar sesión"
    >
      <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">logout</span>
    </button>
  );
}
