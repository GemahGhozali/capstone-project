"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { runAction } from "@/utils/action-runner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ActionResponse } from "@/types";
import { generateFillKuesionerFormSchema, generateFillKuesionerFormValues, generateJawabanPayload } from "./utils";
import { BagianKuesioner, PertanyaanKuesioner, KuesionerOverview, BagianKuesionerWizard, JawabanKuesionerWizard } from "./types";
import { BagianInput, BagianSchema, KuesionerInput, KuesionerSchema, PertanyaanInput, PertanyaanSchema, BagianJawabanInput } from "./schemas";

import { saveBagianJawaban, submitKuesioner } from "./actions";
import { addBagian, updateBagian, deleteBagian } from "./actions";
import { addPertanyaan, updatePertanyaan, deletePertanyaan } from "./actions";
import { createKuesioner, updateKuesioner, deleteKuesioner, closeKuesioner, duplicateKuesioner, publishKuesioner } from "./actions";

interface UseKuesionerForm {
  kuesioner?: KuesionerOverview;
}

interface UseBagianForm {
  kuesionerId: string;
  bagian?: BagianKuesioner;
}

interface UsePertanyaanForm {
  bagianId: string;
  pertanyaan?: PertanyaanKuesioner;
}

interface UseFillKuesionerFormProps {
  kuesionerId: string;
  bagian: BagianKuesionerWizard;
  jawaban: JawabanKuesionerWizard[];
  prevBagianId?: string;
  nextBagianId?: string;
  onMoveBagian: (bagianId: string) => void;
}

export function useKuesionerForm({ kuesioner }: UseKuesionerForm = {}) {
  const router = useRouter();

  const isEditMode = Boolean(kuesioner);

  const form = useForm<KuesionerInput>({
    resolver: zodResolver(KuesionerSchema),
    defaultValues: {
      judul: kuesioner?.judul ?? "",
      periode: kuesioner?.periode ?? "",
      deskripsi: kuesioner?.deskripsi ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: KuesionerInput) => {
      const actionFn = kuesioner ? updateKuesioner(kuesioner.id, data) : createKuesioner(data);
      return runAction<{ id: string }>(() => actionFn);
    },

    onSuccess: (response: ActionResponse<{ id: string }>) => {
      toast.add({ type: "success", description: response.message });
      !isEditMode && response.data ? router.push(`/kaprodi/daftar-kuesioner/${response.data.id}/kelola`) : router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof KuesionerInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useBagianForm({ kuesionerId, bagian }: UseBagianForm) {
  const router = useRouter();

  const form = useForm<BagianInput>({
    resolver: zodResolver(BagianSchema),
    defaultValues: {
      judul: bagian?.judul ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: BagianInput) => {
      const actionFn = bagian ? updateBagian(bagian.id, data) : addBagian(kuesionerId, data);
      return runAction(() => actionFn);
    },

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof BagianInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function usePertanyaanForm({ bagianId, pertanyaan }: UsePertanyaanForm) {
  const router = useRouter();

  const form = useForm<PertanyaanInput>({
    resolver: zodResolver(PertanyaanSchema),
    defaultValues: {
      teks: pertanyaan?.teks ?? "",
      tipe: pertanyaan?.tipe ?? "Likert",
      wajib: pertanyaan?.wajib ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PertanyaanInput) => {
      const actionFn = pertanyaan ? updatePertanyaan(pertanyaan.id, data) : addPertanyaan(bagianId, data);
      return runAction(() => actionFn);
    },

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof PertanyaanInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useDeleteKuesioner() {
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => runAction(() => deleteKuesioner(id)),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useDeleteBagian() {
  const router = useRouter();

  return useMutation({
    mutationFn: (bagianId: string) => runAction(() => deleteBagian(bagianId)),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useDeletePertanyaan() {
  const router = useRouter();

  return useMutation({
    mutationFn: (pertanyaanId: string) => runAction(() => deletePertanyaan(pertanyaanId)),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useChangeKuesionerStatus() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, mode }: { id: string; mode: "publish" | "close" }) => {
      const actionFn = mode === "publish" ? publishKuesioner(id) : closeKuesioner(id);
      return runAction(() => actionFn);
    },

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useDuplicateKuesioner() {
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => runAction(() => duplicateKuesioner(id)),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

function useSaveBagianJawaban(kuesionerId: string) {
  return useMutation({
    mutationFn: (data: BagianJawabanInput) => {
      return runAction<{ isBagianComplete: boolean }>(() => saveBagianJawaban(kuesionerId, data));
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

function useSubmitKuesioner(kuesionerId: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: () => runAction<{ bagianId: string; pertanyaanId: string }>(() => submitKuesioner(kuesionerId)),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.push("/mahasiswa/kuesioner");
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useFillKuesionerForm({ kuesionerId, bagian, jawaban, prevBagianId, nextBagianId, onMoveBagian }: UseFillKuesionerFormProps) {
  const router = useRouter();

  const saveMutation = useSaveBagianJawaban(kuesionerId);
  const submitMutation = useSubmitKuesioner(kuesionerId);

  const isPending = saveMutation.isPending || submitMutation.isPending;

  const formSchema = useMemo(() => generateFillKuesionerFormSchema(bagian), [bagian]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: generateFillKuesionerFormValues(bagian, jawaban),
  });

  const saveBagianKuesionerThen = async (action: "next" | "back" | "leave" | "submit") => {
    if (isPending) return;

    const isFormValueValid = action === "submit" ? await form.trigger() : true;

    const jawabanPayload = { bagianId: bagian.id, jawaban: generateJawabanPayload(bagian, form.getValues()) };

    saveMutation.mutate(jawabanPayload, {
      onSuccess: (response) => {
        const currentBagianIsComplete = response.data && response.data.isBagianComplete;

        switch (action) {
          case "next":
            if (currentBagianIsComplete && nextBagianId) {
              onMoveBagian(nextBagianId);
              break;
            }
            form.trigger();
            break;

          case "back":
            if (prevBagianId) onMoveBagian(prevBagianId);
            break;

          case "leave":
            router.push("/mahasiswa/kuesioner");
            break;

          case "submit":
            if (!isFormValueValid) return;

            submitMutation.mutate(undefined, {
              onError: (response) => {
                const error = response as ActionResponse<{ bagianId: string; pertanyaanId: string }>;
                if (error.data?.bagianId) onMoveBagian(error.data.bagianId);
              },
            });
            break;
        }
      },
    });
  };

  return { form, isPending, saveBagianKuesionerThen };
}
