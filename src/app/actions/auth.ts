"use server";

import { cookies } from "next/headers";

export async function verifyPin(pin: string): Promise<boolean> {
  const validPin = process.env.APP_PIN;
  
  if (pin === validPin) {
    const cookieStore = await cookies();
    cookieStore.set("adora_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
    return true;
  }
  
  return false;
}
