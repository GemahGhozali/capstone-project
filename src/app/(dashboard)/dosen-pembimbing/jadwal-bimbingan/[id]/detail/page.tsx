import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { id as localeId } from "date-fns/locale";
import { jadwalStatusStyles } from "@/features/bimbingan/utils";
import { BookingBimbinganDosenTable } from "@/features/bimbingan/components/booking-bimbingan-dosen-table";
import { getBookingBimbinganDosen, getJadwalBimbinganById } from "@/features/bimbingan/queries";

type DetailJadwalBimbinganPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetailJadwalBimbinganPage({ params }: DetailJadwalBimbinganPageProps) {
  const { id } = await params;

  const jadwal = await getJadwalBimbinganById(id);

  if (!jadwal) notFound();

  const bookingList = await getBookingBimbinganDosen({ jadwalId: id });

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <Badge className={cn(jadwalStatusStyles[jadwal.status], "mb-2")}>Status Jadwal - {jadwal.status}</Badge>
        <h1 className="font-semibold text-lg">Detail Jadwal Bimbingan</h1>
        <p className="text-muted-foreground text-sm">
          {format(jadwal.tanggal, "eeee, d MMMM yyyy", { locale: localeId })}, {jadwal.jamMulai} - {jadwal.jamTutup}
        </p>
      </div>
      <BookingBimbinganDosenTable data={bookingList} />
    </div>
  );
}
