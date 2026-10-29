import { getAuthenticatedUserData } from "@/features/auth/queries";
import { MahasiswaCapstoneProjectProgress } from "@/features/monitoring/components/mahasiswa-capstone-project-progress";
import { getMahasiswaCapstoneProjectProgress } from "@/features/monitoring/queries";

export default async function MahasiswaPage() {
  const user = await getAuthenticatedUserData();
  const capstoneProjectProgress = await getMahasiswaCapstoneProjectProgress(user.id);

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Selamat Datang, {user.namaLengkap}!👋</h1>
        <p className="text-muted-foreground text-sm">Berikut adalah ringkasan aktivitas capstone project anda.</p>
      </div>
      <MahasiswaCapstoneProjectProgress progress={capstoneProjectProgress} viewer="Mahasiswa" />
    </div>
  );
}
