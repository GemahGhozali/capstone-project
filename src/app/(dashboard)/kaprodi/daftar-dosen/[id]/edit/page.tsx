import { DosenForm } from "@/features/dosen/components/dosen-form";
import { getAllProdi } from "@/features/prodi/queries";
import { getAllDosenRoles, getDosenById } from "@/features/dosen/queries";

type EditDosenPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDosenPage({ params }: EditDosenPageProps) {
  const { id } = await params;
  const [prodiOptions, roleOptions, dosenDetails] = await Promise.all([getAllProdi(), getAllDosenRoles(), getDosenById(id)]);

  return <DosenForm role={roleOptions} prodi={prodiOptions} dosen={dosenDetails} />;
}
