"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldGroup } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { PertanyaanEsai } from "./pertanyaan-esai-input";
import { PertanyaanLikert } from "./pertanyaan-likert-input";
import { useFillKuesionerForm } from "../hooks";
import { IconArrowLeft, IconArrowRight, IconSend } from "@tabler/icons-react";
import { BagianKuesionerWizard, JawabanKuesionerWizard } from "../types";

interface FillKuesionerFormProps {
  kuesionerId: string;
  bagian: BagianKuesionerWizard;
  jawaban: JawabanKuesionerWizard[];
  prevBagianId?: string;
  nextBagianId?: string;
  onMoveBagian: (bagianId: string) => void;
}

export function FillKuesionerForm(props: FillKuesionerFormProps) {
  const { form, isPending, saveBagianKuesionerThen } = useFillKuesionerForm({ ...props });

  const { bagian, prevBagianId, nextBagianId } = props;

  const isLastBagian = nextBagianId === undefined;
  const isFirstBagian = prevBagianId === undefined;

  const handleGoToNextBagian = () => saveBagianKuesionerThen("next");
  const handleBackToPreviousBagian = () => saveBagianKuesionerThen("back");
  const handleSubmitKuesioner = () => saveBagianKuesionerThen("submit");
  const handleLeaveKuesioner = () => saveBagianKuesionerThen("leave");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleGoToNextBagian();
      }}
    >
      <FieldGroup className="gap-0 divide-y max-lg:[&>:nth-child(2)]:rounded-t-xl max-sm:[&>:last-child]:rounded-b-xl">
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
        {bagian.pertanyaan.map((pertanyaan, urutan) => (
          <Controller
            key={pertanyaan.id}
            control={form.control}
            name={pertanyaan.id}
            render={({ field, fieldState }) => {
              const formField: typeof field = {
                ...field,
                onChange: (value: string) => {
                  field.onChange(value);
                  form.trigger(pertanyaan.id);
                },
                onBlur: () => {
                  field.onBlur();
                  form.trigger(pertanyaan.id);
                },
              };

              return pertanyaan.tipe === "Likert" ? (
                <PertanyaanLikert urutan={urutan + 1} pertanyaan={pertanyaan} field={formField} fieldState={fieldState} disabled={isPending} />
              ) : (
                <PertanyaanEsai urutan={urutan + 1} pertanyaan={pertanyaan} field={formField} fieldState={fieldState} disabled={isPending} />
              );
            }}
          />
        ))}
      </FieldGroup>
      <Card className="p-6 flex flex-row gap-3 rounded-none md:justify-end max-md:*:flex-1 max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0">
        {!isFirstBagian && (
          <Button type="button" variant="outline" onClick={handleBackToPreviousBagian} disabled={isPending}>
            <IconArrowLeft data-icon="inline-start" />
            Sebelumnya
          </Button>
        )}
        {isLastBagian ? (
          <Button type="button" onClick={handleSubmitKuesioner} disabled={isPending}>
            {isPending ? "Memproses" : "Kirim Jawaban"}
            {isPending ? <Spinner data-icon="inline-end" /> : <IconSend data-icon="inline-end" />}
          </Button>
        ) : (
          <Button type="submit" disabled={isPending}>
            {isPending ? "Memproses" : "Selanjutnya"}
            {isPending ? <Spinner data-icon="inline-end" /> : <IconArrowRight data-icon="inline-end" />}
          </Button>
        )}
      </Card>
    </form>
  );
}
