import { notFound } from "next/navigation";
import { RespondentTable } from "@/features/kuesioner/components/respondent-table";
import { DataExportButton } from "@/components/data/data-export-button";
import { getAllKuesionerRespondent } from "@/features/kuesioner/queries";

type DaftarRespondenKuesionerPageProps = {
  params: Promise<{ kuesionerId: string }>;
};

export default async function DaftarRespondenKuesionerPage({ params }: DaftarRespondenKuesionerPageProps) {
  const { kuesionerId } = await params;

  const kuesioner = await getAllKuesionerRespondent(kuesionerId);

  if (!kuesioner) notFound();

  return (
    <div className="space-y-6">
      <header className="flex justify-between lg:items-end max-lg:flex-col gap-3">
        <div className="space-y-0.5">
          <h1 className="font-semibold text-lg">Daftar Responden Kuesioner</h1>
          <p className="text-muted-foreground text-sm">
            {kuesioner.judul} - Periode {kuesioner.periode}
          </p>
        </div>
        <DataExportButton href="" label="Export Responden" />
      </header>
      <RespondentTable data={kuesioner.respondent} kuesionerId={kuesionerId} />
    </div>
  );
}
