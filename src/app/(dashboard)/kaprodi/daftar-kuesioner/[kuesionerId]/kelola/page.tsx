import { notFound } from "next/navigation";
import { getKuesionerById } from "@/features/kuesioner/queries";
import { KuesionerBuilder } from "@/features/kuesioner/components/kuesioner-builder";

type KelolaKuesionerPageProps = {
  params: Promise<{ kuesionerId: string }>;
};

export default async function KelolaKuesionerPage({ params }: KelolaKuesionerPageProps) {
  const { kuesionerId } = await params;

  const kuesioner = await getKuesionerById(kuesionerId);

  if (!kuesioner) notFound();

  return <KuesionerBuilder kuesioner={kuesioner} />;
}
