import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function ImportPenilaianGuide() {
  return (
    <Accordion className="gap-6" defaultValue={["guide"]}>
      <AccordionItem className="border rounded-xl divide-y" value="guide">
        <AccordionTrigger className="p-6 gap-3 hover:no-underline text-base">Panduan Penggunaan</AccordionTrigger>
        <AccordionContent className="p-6">
          <ol className="list-decimal ml-4 text-muted-foreground space-y-3">
            <li>Silahkan download file template excel yang telah disediakan.</li>
            <li>
              Template sudah berisi semua daftar mahasiswa yang berstatus <span className="font-medium text-foreground">Aktif & Tuntas</span>
            </li>
            <li>
              Jangan mengubah data mahasiswa dan cukup isi kolom <span className="font-medium text-foreground">Nilai</span> dengan angka{" "}
              <span className="font-medium text-foreground">0 - 100</span>
            </li>
            <li>
              <span className="font-medium text-foreground">Baris yang kolom Nilainya kosong akan dilewati.</span> Hanya mahasiswa yang sudah diisi
              nilainya yang akan diimport.
            </li>
            <li>
              Upload kembali <span className="font-medium text-foreground">file template excel</span> yang telah diisi dengan data nilai mahasiswa.
            </li>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
