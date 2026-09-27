import * as z from "zod";

export const LoginSchema = z.object({
  identifier: z.string().min(1, "NIM/NIP wajib diisi"),
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

export const ForgetPasswordSchema = z.discriminatedUnion("method", [
  z.object({ method: z.literal("email"), alamatEmail: z.email("Format email tidak valid!") }),
  z.object({ method: z.literal("identifier"), identifier: z.string().min(1, "NIM/NIP wajib diisi") }),
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

export type LoginInput = z.infer<typeof LoginSchema>;
export type ResetAccountInput = z.infer<typeof ResetAccountSchema>;
export type ForgetPasswordInput = z.infer<typeof ForgetPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
