import { DataExportButton } from "@/components/data/data-export-button";
import { ImportPenilaianForm } from "@/features/penilaian/components/import-penilaian-form";

export default function ImportPenilaianMahasiswaPage() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between lg:items-end gap-3 max-lg:flex-col">
        <div className="space-y-0.5">
          <h1 className="font-semibold text-lg">Import Penilaian Mahasiswa</h1>
          <p className="text-muted-foreground text-sm">Import nilai Capstone Project mahasiswa melalui file Excel.</p>
        </div>
        <DataExportButton href="/api/export/import-penilaian-template" label="Download Template" />
      </header>
      <ImportPenilaianForm />
    </div>
  );
}
