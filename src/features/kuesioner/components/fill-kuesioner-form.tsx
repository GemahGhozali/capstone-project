"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldGroup } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { PertanyaanEsai } from "./pertanyaan-esai-input";
import { PertanyaanLikert } from "./pertanyaan-likert-input";
import { useFillKuesionerForm } from "../hooks";
import { BagianKuesionerWizard, JawabanKuesionerWizard } from "../types";
import { IconArrowLeft, IconArrowRight, IconLogout, IconSend } from "@tabler/icons-react";

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
      <FieldGroup className="gap-0 divide-y">
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

      <div className="p-6 flex items-center justify-between gap-2 border-t">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleLeaveKuesioner} disabled={isPending}>
            <IconLogout />
            <span className="hidden sm:inline">Keluar dari Kuesioner</span>
            <span className="sm:hidden">Keluar</span>
          </Button>
        </div>

        <div className="flex gap-2">
          {!isFirstBagian && (
            <Button type="button" variant="outline" onClick={handleBackToPreviousBagian} disabled={isPending}>
              <IconArrowLeft data-icon="inline-start" />
              Kembali
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
        </div>
      </div>
    </form>
  );
}
