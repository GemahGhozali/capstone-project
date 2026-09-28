"use server";

import { prisma } from "@/libs/prisma";
import { getSession } from "@/libs/session";

export async function findUserCredentialByIdentifier(identifier: string) {
  return prisma.user.findUnique({
    where: { identifier },
    select: {
      id: true,
      identifier: true,
      password: true,
      isActive: true,
      isAccountReset: true,
      userRoles: {
        select: {
          role: {
            select: { nama: true },
          },
        },
      },
    },
  });
}

export async function getAuthenticatedUser() {
  const session = await getSession();

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, identifier: true, namaLengkap: true, alamatEmail: true, fotoProfil: true },
  });

  if (!user) return null;

  return { ...user, role: session.role };
}

export async function findUserEmailAndId(value: string) {
  return prisma.user.findFirst({
    where: {
      OR: [{ alamatEmail: value }, { identifier: value }],
    },
    select: { id: true, alamatEmail: true },
  });
}

export async function findPasswordResetToken(tokenHash: string) {
  return prisma.passwordResetToken.findFirst({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          isAccountReset: true,
          userRoles: {
            select: {
              role: { select: { nama: true } },
            },
          },
        },
      },
    },
  });
}
