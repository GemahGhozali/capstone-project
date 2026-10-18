import { ResetAccountForm } from "@/features/auth/components/reset-account-form";

export default function ResetAkunPage() {
  return (
    <div className="min-h-svh flex justify-center items-center bg-background p-6">
      <div className="w-full max-w-md">
        <ResetAccountForm />
      </div>
    </div>
  );
}
