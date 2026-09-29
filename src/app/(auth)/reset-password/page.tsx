import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { verifyPasswordResetToken } from "@/features/auth/queries";
import { InvalidResetPasswordToken } from "@/features/auth/components/invalid-reset-password-token";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const { token } = await searchParams;

  if (!token) redirect("/");

  const isTokenValid = await verifyPasswordResetToken(token);

  return (
    <div className="min-h-svh flex justify-center items-center bg-background p-6">
      <div className="w-full max-w-md">{isTokenValid ? <ResetPasswordForm token={token} /> : <InvalidResetPasswordToken />}</div>
    </div>
  );
}
