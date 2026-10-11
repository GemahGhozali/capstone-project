"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ActionResponse } from "@/types";
import { getMahasiswaById } from "./queries";
import { createMahasiswa, updateMahasiswa, deleteMahasiswa } from "./actions";
import { MahasiswaInput, UpdateMahasiswaSchema, CreateMahasiswaSchema } from "./schemas";

interface UseMahasiswaForm {
  mahasiswa?: Awaited<ReturnType<typeof getMahasiswaById>>;
}

export function useMahasiswaForm({ mahasiswa }: UseMahasiswaForm) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(mahasiswa ? UpdateMahasiswaSchema : CreateMahasiswaSchema),
    mode: "onTouched",
    defaultValues: {
      fotoProfil: mahasiswa?.fotoProfil ?? null,
      namaLengkap: mahasiswa?.namaLengkap ?? "",
      nim: mahasiswa?.nim ?? "",
      kelasId: mahasiswa?.kelas?.id ?? "",
      tanggalMasuk: mahasiswa?.tanggalMasuk ?? undefined,
      status: mahasiswa?.status ?? "Aktif",
      alamatEmail: mahasiswa?.alamatEmail ?? "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: MahasiswaInput) => {
      const actionFn = mahasiswa ? updateMahasiswa(mahasiswa.id, data) : createMahasiswa(data);
      return runAction(() => actionFn);
    },

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.replace("/kaprodi/daftar-mahasiswa");
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof MahasiswaInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useDeleteMahasiswa() {
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => runAction(() => deleteMahasiswa(id)),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}
