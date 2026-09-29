import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-svh flex justify-center items-center bg-background">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
