"use server";

import { prisma } from "@/libs/prisma";
import { deleteSession } from "@/libs/session";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { createSession, getSession } from "@/libs/session";
import { comparePassword, hashPassword } from "@/libs/bcrypt";
import { findUserCredentialByIdentifier } from "./queries";
import { LoginSchema, LoginInput, ResetAccountInput, ResetAccountSchema } from "./schemas";

export async function login(data: LoginInput): Promise<ActionResponse> {
  const parsed = LoginSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { identifier, password } = parsed.data;

  try {
    const user = await findUserCredentialByIdentifier(identifier);

    if (!user) {
      return { success: false, message: "NIM/NIP atau password anda salah!" };
    }

    if (!user.isActive) {
      return { success: false, message: "Akun ada telah dinonaktifkan!" };
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "NIM/NIP atau password anda salah!" };
    }

    const role = user.userRoles[0].role.nama;

    await createSession({ userId: user.id, role, isAccountReset: user.isAccountReset });

    return { success: true, message: "Login berhasil!" };
  } catch (error) {
    console.log("❌ Login Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function logout(): Promise<ActionResponse> {
  await deleteSession();
  return { success: true, message: "Logout berhasil!" };
}

export async function resetAccount(data: ResetAccountInput) {
  const session = await getSession();

  if (!session) {
    return { success: false, message: "Anda belum terautentikasi! Silahkan login." };
  }

  const parsed = ResetAccountSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { alamatEmail, password } = parsed.data;

  try {
    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      data: { alamatEmail, password: hashedPassword, isAccountReset: true },
      where: { id: session.userId },
    });

    await deleteSession();
    await createSession({ userId: session.userId, role: session.role, isAccountReset: true });

    return { success: true, message: "Reset akun berhasil!" };
  } catch (error) {
    console.log("❌ Reset Akun Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
