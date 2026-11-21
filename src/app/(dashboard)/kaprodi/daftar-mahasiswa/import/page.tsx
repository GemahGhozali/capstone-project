import { DataExportButton } from "@/components/data/data-export-button";
import { ImportMahasiswaForm } from "@/features/mahasiswa/components/import-mahasiswa-form";

export const maxDuration = 60;

export default function ImportMahasiswaPage() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between lg:items-end gap-3 max-lg:flex-col">
        <div className="space-y-0.5">
          <h1 className="font-semibold text-lg">Import Data Mahasiswa</h1>
          <p className="text-muted-foreground text-sm">Tambahkan data mahasiswa secara massal melalui file Excel</p>
        </div>
        <DataExportButton href="/api/export/template-import-mahasiswa" label="Download Template" className="" />
      </header>
      <ImportMahasiswaForm />
    </div>
  );
}
