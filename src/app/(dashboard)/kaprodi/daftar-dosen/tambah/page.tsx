import { DosenForm } from "@/features/dosen/components/dosen-form";
import { getAllProdi } from "@/features/prodi/queries";
import { getAllDosenRoles } from "@/features/dosen/queries";

export default async function TambahDosenPage() {
  const [prodiOptions, roleOptions] = await Promise.all([getAllProdi(), getAllDosenRoles()]);

  return <DosenForm role={roleOptions} prodi={prodiOptions} />;
}
