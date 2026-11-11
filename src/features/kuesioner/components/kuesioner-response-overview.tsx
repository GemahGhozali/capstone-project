import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { LIKERT_OPTIONS } from "../utils";
import { KuesionerWizard } from "../types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface KuesionerResponseOverviewProps {
  kuesioner: KuesionerWizard;
}

export function KuesionerResponseOverview({ kuesioner }: KuesionerResponseOverviewProps) {
  const jawabanMap = new Map(kuesioner.jawaban.map((item) => [item.pertanyaanId, item]));

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">{kuesioner.judul}</h1>
        <p className="text-muted-foreground text-sm">{kuesioner.deskripsi ?? "Tidak ada deskripsi tercantum."}</p>
      </div>
      {kuesioner.bagian.map((bagian, bagianIndex) => (
        <Card key={bagian.id} className="p-0 gap-0 divide-y">
          <CardHeader className="p-6 flex justify-between items-start gap-3 max-sm:flex-col">
            <div className="space-y-1 max-sm:order-2">
              <CardTitle>{bagian.judul}</CardTitle>
              <CardDescription>
                Bagian {bagianIndex + 1} dari {kuesioner.bagian.length}
              </CardDescription>
            </div>
            <Badge
              className={cn(bagian.statusBagian === "Selesai" ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500", "max-sm:order-1")}
            >
              {bagian.statusBagian}
            </Badge>
          </CardHeader>
          <CardContent className="p-0 gap-0 divide-y">
            <div className="p-6 hidden lg:block">
              <div className="grid gap-4 grid-cols-[30px_4fr_7fr] items-center font-medium">
                <div className="text-center">No.</div>
                <div className="">Daftar Pertanyaan</div>
                <div className="grid grid-cols-5 text-center">
                  <span>Kurang</span>
                  <span>Cukup</span>
                  <span>Cukup Baik</span>
                  <span>Baik</span>
                  <span>Baik Sekali</span>
                </div>
              </div>
            </div>
            {bagian.pertanyaan.map((pertanyaan, pertanyaanIndex) => {
              const jawaban = jawabanMap.get(pertanyaan.id);

              return (
                <div key={pertanyaan.id} className="p-6 grid gap-6 sm:gap-4 grid-cols-1 lg:grid-cols-[30px_4fr_7fr] items-center">
                  <p className="max-lg:hidden text-center text-foreground">{pertanyaanIndex + 1}.</p>
                  <div className="flex flex-col gap-1.5">
                    <p className="max-lg:order-2 text-foreground">
                      {pertanyaan.teks}
                      {pertanyaan.wajib && <span className="text-red-600 ml-1">*</span>}
                    </p>
                  </div>
                  {pertanyaan.tipe === "Likert" ? (
                    <RadioGroup
                      disabled
                      className="grid grid-cols-1 sm:grid-cols-5 text-center max-sm:gap-4"
                      value={jawaban?.nilai != null ? String(jawaban.nilai) : ""}
                    >
                      {LIKERT_OPTIONS.map((option) => (
                        <div key={option.value} className="flex sm:flex-col gap-1.5 items-center">
                          <RadioGroupItem value={String(option.value)} className="size-4 border-ring" />
                          <div className="text-xs text-muted-foreground lg:hidden">{option.label}</div>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <Textarea rows={4} maxLength={1000} readOnly value={jawaban?.jawabanTeks ?? ""} className="pointer-events-none" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
