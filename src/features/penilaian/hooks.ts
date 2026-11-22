"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ActionResponse } from "@/types";
import { ImportPenilaianResult, NilaiMahasiswa } from "./types";
import { deletePenilaianMahasiswa, importPenilaian, setPenilaianMahasiswa } from "./actions";
import { ImportPenilaianInput, ImportPenilaianSchema, PenilaianInput, PenilaianSchema } from "./schemas";

interface UsePenilaianForm {
  mahasiswa?: NilaiMahasiswa;
}

export function usePenilaianForm({ mahasiswa }: UsePenilaianForm) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(PenilaianSchema),
    mode: "onTouched",
    defaultValues: {
      mahasiswaId: mahasiswa?.id ?? "",
      nilai: mahasiswa?.nilai ?? 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PenilaianInput) => runAction(() => setPenilaianMahasiswa(data)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof PenilaianInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useDeletePenilaian() {
  const router = useRouter();

  return useMutation({
    mutationFn: (mahasiswaId: string) => runAction(() => deletePenilaianMahasiswa(mahasiswaId)),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useImportPenilaianForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(ImportPenilaianSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ImportPenilaianInput) => runAction(() => importPenilaian(data)),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse<ImportPenilaianResult>) => {
      toast.add({ type: "error", description: "Gagal mengimport data penilaian!" });
    },
  });

  return { form, mutation };
}
