"use client";

import { toast } from "@/components/ui/toast";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { runAction } from "@/utils/action-runner";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { BimbinganMahasiswa } from "./types";
import { ActionResponse } from "@/types";
import { BimbinganInput, CreateBimbinganSchema, UpdateBimbinganSchema } from "./schemas";
import { createBimbingan, deleteBimbingan, reviewBimbingan, updateBimbingan } from "./actions";

interface UseBimbinganForm {
  bimbingan?: BimbinganMahasiswa;
}

export function useBimbinganForm({ bimbingan }: UseBimbinganForm) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(bimbingan ? UpdateBimbinganSchema : CreateBimbinganSchema),
    mode: "onTouched",
    defaultValues: {
      tanggal: bimbingan ? new Date(bimbingan.tanggal) : new Date(),
      catatan: bimbingan?.catatan ?? "",
      file: bimbingan?.fileName ?? undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: BimbinganInput) => {
      const payload = { ...data, tanggal: new Date(format(data.tanggal, "yyyy-MM-dd")) };
      const actionFn = bimbingan ? updateBimbingan(bimbingan.id, payload) : createBimbingan(payload);
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
          form.setError(field as keyof BimbinganInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useDeleteBimbingan() {
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => runAction(() => deleteBimbingan(id)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useReviewBimbingan() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "Disetujui" | "Ditolak" }) => runAction(() => reviewBimbingan(id, { status })),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}
