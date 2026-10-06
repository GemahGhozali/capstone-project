"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { getDosenById } from "./queries";
import { ActionResponse } from "@/types";
import { createDosen, deleteDosen, updateDosen } from "./actions";
import { CreateDosenSchema, UpdateDosenSchema, DosenInput } from "./schemas";

interface UseDosenForm {
  dosen?: Awaited<ReturnType<typeof getDosenById>>;
}

export function useDosenForm({ dosen }: UseDosenForm) {
  const form = useForm({
    resolver: zodResolver(dosen ? UpdateDosenSchema : CreateDosenSchema),
    mode: "onTouched",
    defaultValues: {
      // Informasi Umum
      fotoProfil: dosen?.fotoProfil ?? null,
      nip: dosen?.nip ?? "",
      namaLengkap: dosen?.namaLengkap ?? "",
      bidangKeahlian: dosen?.bidangKeahlian ?? "",
      prodiId: dosen?.prodi?.id ?? "",
      status: dosen?.status ?? "Aktif",

      // Informasi Akun
      alamatEmail: dosen?.alamatEmail ?? "",
      password: "",
      roleId: dosen?.roles.map((role) => role.id) ?? [],

      // Informasi Bimbingan
      statusBimbingan: dosen?.statusBimbingan ?? "Buka",
      kuotaBimbingan: dosen?.kuotaBimbingan ?? 10,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: DosenInput) => {
      const actionFn = dosen ? updateDosen(dosen.id, data) : createDosen(data);
      return runAction(() => actionFn);
    },

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof DosenInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useDeleteDosen() {
  return useMutation({
    mutationFn: (id: string) => runAction(() => deleteDosen(id)),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}
