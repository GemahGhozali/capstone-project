import * as z from "zod";

const ProfilePhotoSchema = z
  .file()
  .max(1024 * 1024, "Maksimal ukuran foto profil adalah 1 MB!")
  .mime(["image/jpeg", "image/jpg", "image/png", "image/webp"], "Foto profil hanya menerima format JPG, JPEG, PNG atau WEBP!");

export const LoginSchema = z.object({
  identifier: z.string().min(1, "NIM/NIP wajib diisi!"),
  password: z.string().min(1, "Password wajib diisi!"),
});

export const ResetAccountSchema = z
  .object({
    alamatEmail: z.email("Format email tidak valid!"),
    password: z.string().min(8, "Password wajib diisi dan minimal 8 karakter!"),
    passwordConfirmation: z.string().min(1, "Konfirmasi password wajib diisi!"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: "Password yang diinput tidak sama!",
    path: ["passwordConfirmation"],
  });

export const ForgotPasswordSchema = z.union([
  z.object({
    credential: z.email("Format email tidak valid!"),
  }),
  z.object({
    credential: z.string().min(1, "NIM/NIP wajib diisi"),
  }),
]);

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password wajib diisi dan minimal 8 karakter!"),
    passwordConfirmation: z.string().min(1, "Konfirmasi password wajib diisi!"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: "Password yang diinput tidak sama!",
    path: ["passwordConfirmation"],
  });

export const ForgotPasswordWithEmailSchema = z.object({ credential: z.email("Format email tidak valid!") });

export const ForgotPasswordWithIdentifierSchema = z.object({ credential: z.string().min(1, "NIM/NIP wajib diisi") });

export const UpdateUserAccountSchema = z.object({
  fotoProfil: z.union([ProfilePhotoSchema, z.string(), z.null()]),
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi!"),
  alamatEmail: z.email("Format email tidak valid!"),
  password: z.string().min(8, "Password minimal 8 karakter!").or(z.literal("")),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type ResetAccountInput = z.infer<typeof ResetAccountSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type ForgotPasswordWithEmailInput = z.infer<typeof ForgotPasswordWithEmailSchema>;
export type ForgotPasswordWithIdentifierInput = z.infer<typeof ForgotPasswordWithIdentifierSchema>;
export type ForgotPasswordInput = ForgotPasswordWithEmailInput | ForgotPasswordWithIdentifierInput;
export type UpdateUserAccountInput = z.infer<typeof UpdateUserAccountSchema>;
