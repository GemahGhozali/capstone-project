"use server";

import { hash } from "bcryptjs";
import { getEnv } from "@/utils/env";
import { prisma } from "@/libs/prisma";
import { sendEmail } from "@/libs/nodemailer";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { comparePassword, hashPassword } from "@/libs/bcrypt";
import { deleteSession, createSession, getSession } from "@/libs/session";
import { LoginInput, ResetAccountInput, ForgotPasswordInput, ResetPasswordInput } from "./schemas";
import { LoginSchema, ResetAccountSchema, ForgotPasswordSchema, ResetPasswordSchema } from "./schemas";
import { findUserCredentialByIdentifier, findPasswordResetToken, findUserEmailAndId } from "./queries";

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

export async function forgotPassword(data: ForgotPasswordInput, option: "identifier" | "email"): Promise<ActionResponse<{ alamatEmail: string }>> {
  const parsed = ForgotPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { credential } = parsed.data;

  try {
    const user = await findUserEmailAndId(credential);

    if (!user) {
      return { success: true, message: `Akun tidak ditemukan! ${option === "identifier" ? "NIM/NIP" : "Email"} yang anda input tidak valid!` };
    }

    await clearAllUserResetPasswordToken(user.id);

    const token = crypto.randomUUID();
    const tokenHash = await hash(token, 10);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const resetLink = `${getEnv("APP_URL")}/reset-password?token=${token}`;

    await sendEmail({
      to: user.alamatEmail,
      subject: "Reset Password - Capstone Project",
      html: `<p>Klik link di bawah untuk mereset password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    return { success: true, message: "Berhasil mengirim link reset password!", data: { alamatEmail: user.alamatEmail } };
  } catch (error) {
    console.log("❌ Forgot Password Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function resetPassword(data: ResetPasswordInput, token: string): Promise<ActionResponse> {
  const parsed = ResetPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { password } = parsed.data;

  try {
    const tokenHash = await hash(token, 10);
    const resetToken = await findPasswordResetToken(tokenHash);

    if (!resetToken) {
      return { success: false, message: "Link reset password tidak valid!" };
    }

    if (resetToken.usedAt) {
      return { success: false, message: "Link reset password sudah digunakan!" };
    }

    if (resetToken.expiresAt < new Date()) {
      return { success: false, message: "Link reset password sudah kadaluarsa!" };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.$transaction(async (transaction) => {
      await transaction.user.update({
        data: { password: hashedPassword },
        where: { id: resetToken.userId },
      });
      await transaction.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      });
    });

    const role = resetToken.user.userRoles[0].role.nama;
    await createSession({ userId: resetToken.user.id, role, isAccountReset: resetToken.user.isAccountReset });

    return { success: true, message: "Password berhasil diperbarui!" };
  } catch (error) {
    console.log("❌ Reset Password Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

async function clearAllUserResetPasswordToken(userId: string) {
  return prisma.passwordResetToken.deleteMany({ where: { userId } });
}
