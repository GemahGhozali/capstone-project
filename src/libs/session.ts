import "server-only";

import { cache } from "react";
import { getEnv } from "@/utils/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { isAfter, subDays } from "date-fns";

export type SessionPayload = {
  userId: string;
  role: string;
  isAccountReset: boolean;
  iat: number;
  exp: number;
};

const environment = getEnv("NODE_ENV", "development");
const secretKey = getEnv("SESSION_SECRET");
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Omit<SessionPayload, "iat" | "exp">): Promise<string> {
  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(encodedKey);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  return decrypt(token);
}

export async function createSession(payload: Omit<SessionPayload, "iat" | "exp">): Promise<void> {
  const token = await encrypt(payload);

  const cookieStore = await cookies();

  cookieStore.set({
    name: "session",
    value: token,
    httpOnly: true,
    secure: environment === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function refreshSession(): Promise<void> {
  const cookieStore = await cookies();

  const token = cookieStore.get("session")?.value;
  if (!token) return;

  const payload = await decrypt(token);
  if (!payload) return;

  if (!shouldRefreshSession(payload.exp)) return;

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: environment === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
});

function shouldRefreshSession(exp: number) {
  const expiresAt = new Date(exp * 1000);

  // Batas minimal harus refresh session : 3 hari sebelum expired
  const refreshThreshold = subDays(expiresAt, 3);
  const now = new Date();

  // Return TRUE jika waktu sekarang sudah MELEWATI batas minimal threshold
  return isAfter(now, refreshThreshold);
}
