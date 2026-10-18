import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function LupaPasswordPage() {
  return (
    <div className="min-h-svh flex justify-center items-center bg-background p-6">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
