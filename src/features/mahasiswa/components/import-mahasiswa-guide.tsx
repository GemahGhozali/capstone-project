import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function ImportMahasiswaGuide() {
  return (
    <Accordion className="gap-6" defaultValue={["guide"]}>
      <AccordionItem className="border rounded-xl divide-y" value="guide">
        <AccordionTrigger className="p-6 gap-3 hover:no-underline text-base">Panduan Penggunaan</AccordionTrigger>
        <AccordionContent className="p-6">
          <ol className="list-decimal ml-4 text-muted-foreground space-y-3">
            <li>Silahkan download file template excel yang telah disediakan.</li>
            <li>
              Isi data mahasiswa sesuai dengan kolom yang ada :{" "}
              <span className="text-foreground font-medium">NIM, Nama Lengkap, Kode Kelas & Tanggal Masuk</span>.
            </li>
            <li>
              Isi data mahasiswa yang ingin di import pada sheet <span className="font-medium text-foreground">Import Mahasiswa</span>.
            </li>
            <li>
              <span className="font-medium text-foreground">Kode Kelas</span> dapat dilihat pada sheet{" "}
              <span className="font-medium text-foreground">Daftar Kelas</span>.
            </li>
            <li>
              Tentukan <span className="font-medium text-foreground">default password</span> untuk semua akun mahasiswa yang di import.
            </li>
            <li>
              Upload kembali <span className="font-medium text-foreground">file template excel</span> yang telah diisi dengan data mahasiswa.
            </li>
            <li>Default email mahasiswa akan mengikuti NIM dan password akan mengikuti default password yang diberikan.</li>
            <li>
              Semua mahasiswa yang telah di import akan berstatus <span className="font-medium text-foreground">Aktif</span>.
            </li>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
