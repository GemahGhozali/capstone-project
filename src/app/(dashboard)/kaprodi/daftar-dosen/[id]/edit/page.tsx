import { notFound } from "next/navigation";
import { DosenForm } from "@/features/dosen/components/dosen-form";
import { getAllProdi } from "@/features/prodi/queries";
import { getAllDosenRoles, getDosenById } from "@/features/dosen/queries";

type EditDosenPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDosenPage({ params }: EditDosenPageProps) {
  const { id } = await params;

  const [prodi, role, dosen] = await Promise.all([getAllProdi(), getAllDosenRoles(), getDosenById(id)]);

  if (!dosen) notFound();

  return <DosenForm role={role} prodi={prodi} dosen={dosen} />;
}
