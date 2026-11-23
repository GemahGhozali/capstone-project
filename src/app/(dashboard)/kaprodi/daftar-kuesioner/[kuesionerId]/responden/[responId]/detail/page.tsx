import { format } from "date-fns";
import { notFound } from "next/navigation";
import { id as localeId } from "date-fns/locale";
import { getResponKuesionerDetail } from "@/features/kuesioner/queries";
import { KuesionerResponseOverview } from "@/features/kuesioner/components/kuesioner-response-overview";

type RespondenDetailPageProps = {
  params: Promise<{
    kuesionerId: string;
    responId: string;
  }>;
};

export default async function ResponDetailPage({ params }: RespondenDetailPageProps) {
  const { kuesionerId, responId } = await params;

  const kuesioner = await getResponKuesionerDetail(kuesionerId, responId);

  if (!kuesioner) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Detail Jawaban Responden</h1>
        <p className="text-muted-foreground text-sm">
          Disubmit pada hari {format(kuesioner.tanggalSubmit!, "eeee, dd MMMM yyyy", { locale: localeId })}
        </p>
      </div>
      <KuesionerResponseOverview kuesioner={kuesioner} />
    </div>
  );
}
