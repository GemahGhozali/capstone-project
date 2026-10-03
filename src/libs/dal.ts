import "server-only";

import { Role } from "@/types";
import { cache } from "react";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";
import { getSession, SessionPayload } from "@/libs/session";

export const requireSession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session) redirect("/");
  return session;
});

export async function userIsValidAndHasRole(...role: Role[]) {
  const session = await requireSession();

  const isRoleInvalid = !role.includes(session.role);

  if (isRoleInvalid) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.userId, isActive: true },
    select: {
      id: true,
      identifier: true,
      namaLengkap: true,
      alamatEmail: true,
      fotoProfil: true,
    },
  });

  if (!user) redirect("/");

  return user;
}
