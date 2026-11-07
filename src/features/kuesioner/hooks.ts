"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ActionResponse } from "@/types";
import { BagianKuesioner, PertanyaanKuesioner, KuesionerOverview } from "./types";
import { BagianInput, BagianSchema, KuesionerInput, KuesionerSchema, PertanyaanInput, PertanyaanSchema } from "./schemas";

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
      !isEditMode && response.data ? router.push(`/kaprodi/daftar-kuesioner/${response.data.id}/edit`) : router.refresh();
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
