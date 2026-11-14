import { JadwalBimbinganTabs } from "@/features/bimbingan/components/jadwal-bimbingan-tabs";
import { getJadwalBimbinganDosen } from "@/features/bimbingan/queries";

export default async function JadwalBimbinganPage() {
  const jadwalList = await getJadwalBimbinganDosen();

  return <JadwalBimbinganTabs jadwalList={jadwalList} />;
}
