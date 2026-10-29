"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ProdiOverview } from "./types";
import { ActionResponse } from "@/types";
import { ProdiInput, ProdiSchema } from "./schemas";
import { createProdi, updateProdi } from "./actions";

interface UseProdiForm {
  prodi?: ProdiOverview;
}

export function useProdiForm({ prodi }: UseProdiForm) {
  const router = useRouter();

  const form = useForm<ProdiInput>({
    resolver: zodResolver(ProdiSchema),
    defaultValues: {
      nama: prodi?.nama ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProdiInput) => {
      const actionFn = prodi ? updateProdi(prodi.id, data) : createProdi(data);
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
          form.setError(field as keyof ProdiInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}
