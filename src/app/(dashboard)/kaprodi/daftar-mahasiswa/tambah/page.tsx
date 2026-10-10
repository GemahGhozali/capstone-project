import { getAllKelas } from "@/features/kelas/queries";
import { MahasiswaForm } from "@/features/mahasiswa/components/mahasiswa-form";

export default async function TambahMahasiswaPage() {
  const kelas = await getAllKelas();

  return <MahasiswaForm kelas={kelas} />;
}
