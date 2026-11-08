import { notFound } from "next/navigation";
import { getKuesionerById } from "@/features/kuesioner/queries";
import { KuesionerBuilder } from "@/features/kuesioner/components/kuesioner-builder";

type KelolaKuesionerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function KelolaKuesionerPage({ params }: KelolaKuesionerPageProps) {
  const { id } = await params;

  const kuesioner = await getKuesionerById(id);

  if (!kuesioner) notFound();

  return <KuesionerBuilder kuesioner={kuesioner} />;
}
