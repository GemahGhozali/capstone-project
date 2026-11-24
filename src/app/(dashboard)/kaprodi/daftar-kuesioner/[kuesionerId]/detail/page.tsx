import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { IconArrowUpRight } from "@tabler/icons-react";
import { getKuesionerStatistic } from "@/features/kuesioner/queries";
import { KuesionerResponseStatistic } from "@/features/kuesioner/components/kuesioner-response-statistic";

type DetailKuesionerPageProps = {
  params: Promise<{ kuesionerId: string }>;
};

export default async function DetailKuesionerPage({ params }: DetailKuesionerPageProps) {
  const { kuesionerId } = await params;

  const analisis = await getKuesionerStatistic(kuesionerId);

  if (!analisis) notFound();

  return (
    <div className="space-y-6">
      <header className="flex gap-4 justify-between lg:items-end max-lg:flex-col">
        <div className="space-y-0.5">
          <h1 className="font-semibold text-lg">
            {analisis.judul} - Periode {analisis.periode}
          </h1>
          <p className="text-muted-foreground text-sm">Distribusi jumlah jawaban responden di setiap pertanyaan</p>
        </div>
        <Link href={`/kaprodi/daftar-kuesioner/${kuesionerId}/responden`}>
          <Button variant="outline" className="max-lg:w-full">
            Daftar Responden
            <IconArrowUpRight data-icon="inline-end" />
          </Button>
        </Link>
      </header>
      <KuesionerResponseStatistic data={analisis} />
    </div>
  );
}
