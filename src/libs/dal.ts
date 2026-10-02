import "server-only";

import { Role } from "@/types";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession, SessionPayload } from "@/libs/session";

export const requireSession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session) redirect("/");
  return session;
});

export const requireRole = cache(async (...role: Role[]): Promise<SessionPayload> => {
  const session = await requireSession();
  const isRoleInvalid = !role.includes(session.role);
  if (isRoleInvalid) redirect("/");
  return session;
});
