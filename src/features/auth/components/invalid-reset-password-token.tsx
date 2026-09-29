import Link from "next/link";
import { IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function InvalidResetPasswordToken() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="flex size-10 items-center justify-center bg-red-500 rounded-full mb-4">
          <IconX className="text-white" stroke={3.5} />
        </div>
        <h1 className="text-xl font-bold mb-3">Link Reset Password Tidak Valid!</h1>
        <p className="text-muted-foreground text-sm text-center">Link mungkin sudah digunakan atau telah kedaluwarsa!</p>
      </div>
      <div className="flex flex-col gap-4">
        <Link href="/lupa-password">
          <Button className="w-full">Kirim Link Reset Password Baru</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="w-full">
            Kembali Ke Halaman Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
