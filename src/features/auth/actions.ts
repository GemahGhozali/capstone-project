"use server";

import {
  findPasswordResetToken,
  verifyEmailAvailability,
  findUserCredentialByIdentifier,
  verifyUserFromEmailOrIdentifier,
  isUserHasActiveResetPasswordToken,
} from "./queries";

import crypto from "crypto";
import { getEnv } from "@/utils/env";
import { prisma } from "@/libs/prisma";
import { maskEmail } from "@/utils/mask-email";
import { sendEmail } from "@/libs/nodemailer";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { comparePassword, hashPassword } from "@/libs/bcrypt";
import { deleteSession, createSession, getSession } from "@/libs/session";
import { LoginInput, ResetAccountInput, ForgotPasswordInput, ResetPasswordInput } from "./schemas";
import { LoginSchema, ResetAccountSchema, ForgotPasswordSchema, ResetPasswordSchema } from "./schemas";

export async function login(data: LoginInput): Promise<ActionResponse> {
  const parsed = LoginSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { identifier, password } = parsed.data;

  try {
    const user = await findUserCredentialByIdentifier(identifier);

    if (!user) {
      return { success: false, message: "NIM/NIP atau password anda salah! Silahkan coba lagi." };
    }

    if (!user.isActive) {
      return { success: false, message: "Anda tidak bisa mengakses akun karena akun anda telah dinonaktifkan." };
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "NIM/NIP atau password anda salah! Silahkan coba lagi." };
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
    return { success: false, message: "Anda belum terautentikasi! Silahkan login terlebih dahulu." };
  }

  const parsed = ResetAccountSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { alamatEmail, password } = parsed.data;

  try {
    const emailInUsed = await verifyEmailAvailability(alamatEmail);

    if (emailInUsed) {
      return {
        success: false,
        message: "Alamat email sudah digunakan! Silahkan coba menggunakan alamat email lain.",
        errors: { alamatEmail: "Email sudah digunakan! Silahkan gunakan email lain." },
      };
    }

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

export async function forgotPassword(data: ForgotPasswordInput, option: "identifier" | "email"): Promise<ActionResponse> {
  const parsed = ForgotPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { credential: emailOrIdentifier } = parsed.data;

  try {
    const user = await verifyUserFromEmailOrIdentifier(emailOrIdentifier);

    if (!user) {
      return { success: false, message: `Akun tidak ditemukan! ${option === "identifier" ? "NIM/NIP" : "Email"} anda tidak valid.` };
    }

    if (!user.isAccountReset) {
      return {
        success: false,
        message:
          "Akun anda belum diaktivasi/direset! Silakan login terlebih dahulu menggunakan NIM/NIP dan password default yang diberikan, kemudian reset akun anda.",
      };
    }

    const censoredEmail = maskEmail(user.alamatEmail);

    const userStillHasActiveToken = await isUserHasActiveResetPasswordToken(user.id);

    if (userStillHasActiveToken) {
      return { success: true, message: `Link reset password sebelumnya telah dikirim ke alamat email ${censoredEmail}` };
    }

    const token = await upsertPasswordResetToken(user.id);
    const resetLink = `${getEnv("APP_URL")}/reset-password?token=${token}`;

    await sendEmail({
      to: user.alamatEmail,
      subject: "Reset Password - Capstone Project",
      html: `<p>Klik link di bawah untuk mereset password:</p><a href="${resetLink}">Reset Password</a>`,
    });

    return { success: true, message: `Link reset password berhasil dikirim ke alamat email ${censoredEmail}` };
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
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
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

export async function upsertPasswordResetToken(userId: string) {
  const token = crypto.randomUUID();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.passwordResetToken.upsert({
    where: { userId },
    update: { tokenHash, expiresAt, usedAt: null },
    create: { userId, tokenHash, expiresAt },
  });

  return token;
}
