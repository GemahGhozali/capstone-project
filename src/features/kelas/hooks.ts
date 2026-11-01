"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { KelasOverview } from "./types";
import { ActionResponse } from "@/types";
import { KelasInput, KelasSchema } from "./schemas";
import { createKelas, updateKelas } from "./actions";

interface UseKelasForm {
  kelas?: KelasOverview;
}

export function useKelasForm({ kelas }: UseKelasForm) {
  const router = useRouter();

  const form = useForm<KelasInput>({
    resolver: zodResolver(KelasSchema),
    defaultValues: {
      nama: kelas?.nama ?? "",
      kode: kelas?.kode ?? "",
      angkatan: kelas?.angkatan ?? new Date().getFullYear(),
    },
  });

  const mutation = useMutation({
    mutationFn: (data: KelasInput) => {
      const actionFn = kelas ? updateKelas(kelas.id, data) : createKelas(data);
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
          form.setError(field as keyof KelasInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}
