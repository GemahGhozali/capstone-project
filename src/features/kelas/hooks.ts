"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { getAllKelas } from "./queries";
import { ActionResponse } from "@/types";
import { KelasInput, KelasSchema } from "./schemas";
import { createKelas, updateKelas } from "./actions";

interface UseKelasForm {
  kelas?: Awaited<ReturnType<typeof getAllKelas>>[number];
}

export function useKelasForm({ kelas }: UseKelasForm) {
  const form = useForm<KelasInput>({
    resolver: zodResolver(KelasSchema),
    mode: "onTouched",
    defaultValues: {
      nama: kelas?.nama ?? "",
      angkatan: kelas?.angkatan ?? 2024,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: KelasInput) => {
      const actionFn = kelas ? updateKelas(kelas.id, data) : createKelas(data);
      return runAction(() => actionFn);
    },

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
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
