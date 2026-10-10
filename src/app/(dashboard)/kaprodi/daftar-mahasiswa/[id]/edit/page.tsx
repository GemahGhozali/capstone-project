import { getAllKelas } from "@/features/kelas/queries";
import { MahasiswaForm } from "@/features/mahasiswa/components/mahasiswa-form";
import { getMahasiswaById } from "@/features/mahasiswa/queries";

type EditMahasiswaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMahasiswaPage({ params }: EditMahasiswaPageProps) {
  const { id } = await params;

  const [kelasOptions, mahasiswaDetails] = await Promise.all([getAllKelas(), getMahasiswaById(id)]);

  return <MahasiswaForm kelas={kelasOptions} mahasiswa={mahasiswaDetails} />;
}
