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

export async function userIsValidAndHasRole(...allowedRoles: Role[]) {
  const session = await requireSession();

  const isRoleInvalid = !session.roles.some((role) => allowedRoles.includes(role));

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
