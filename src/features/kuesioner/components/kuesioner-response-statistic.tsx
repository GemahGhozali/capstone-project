import { EssayAnswerList } from "./essay-answer-list";
import { LikertDistributionChart } from "./likert-distribution-chart";
import { KuesionerStatistic } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface KuesionerResponseStatisticProps {
  data: KuesionerStatistic;
}

export function KuesionerResponseStatistic({ data }: KuesionerResponseStatisticProps) {
  return data.bagian.map((bagian) => (
    <div key={bagian.id} className="space-y-6">
      <Card className="bg-primary border-red-600!">
        <CardHeader>
          <CardTitle className="text-white">{bagian.judul}</CardTitle>
          <CardDescription className="text-neutral-200">
            Bagian {bagian.urutan} dari {data.bagian.length}
          </CardDescription>
        </CardHeader>
      </Card>
      {bagian.pertanyaan.map((pertanyaan) => (
        <Card key={pertanyaan.id}>
          <CardHeader>
            <CardTitle className="max-sm:text-sm">
              {pertanyaan.teks} {pertanyaan.wajib && <span className="text-red-600">*</span>}
            </CardTitle>
            <CardDescription className="max-sm:text-xs">
              {pertanyaan.totalJawaban === 0 ? "Belum Ada Jawaban" : `${pertanyaan.totalJawaban} Total Jawaban`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pertanyaan.tipe === "Likert" ? (
              <LikertDistributionChart data={pertanyaan.distribusi} />
            ) : (
              <EssayAnswerList data={pertanyaan.jawabanEsai} />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  ));
}
