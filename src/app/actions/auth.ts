"use server";

import { cookies } from "next/headers";

export async function verifyPin(pin: string): Promise<boolean> {
  const rawPin = process.env.APP_PIN || "";
  const validPin = rawPin.replace(/['"]/g, "").trim();
  
  console.log("Verifying PIN - Expected:", validPin, " | Provided:", pin);

  if (pin === validPin && validPin.length > 0) {
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
