"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ActionResponse } from "@/types";
import { createJadwalBimbingan, bookingJadwalBimbingan, cancelBooking } from "./actions";
import { CreateJadwalBimbinganInput, BookingJadwalInput, CancelBookingInput } from "./schemas";
import { CreateJadwalBimbinganSchema, BookingJadwalSchema, CancelBookingSchema } from "./schemas";

export function useCreateJadwalForm() {
  const router = useRouter();

  const form = useForm<CreateJadwalBimbinganInput>({
    resolver: zodResolver(CreateJadwalBimbinganSchema),
    mode: "onTouched",
    defaultValues: {
      tanggal: "",
      jamMulai: "",
      jamTutup: "",
      kuota: 1,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateJadwalBimbinganInput) => runAction(() => createJadwalBimbingan(data)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      form.reset();
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof CreateJadwalBimbinganInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useBookingJadwalBimbinganForm(jadwalId?: string) {
  const router = useRouter();

  const form = useForm<BookingJadwalInput>({
    resolver: zodResolver(BookingJadwalSchema),
    mode: "onTouched",
    defaultValues: {
      jadwalId: jadwalId ?? "",
      catatanMahasiswa: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: BookingJadwalInput) => runAction(() => bookingJadwalBimbingan(data)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      form.reset({ jadwalId: jadwalId ?? "", catatanMahasiswa: "" });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof BookingJadwalInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useCancelBookingForm(bookingId: string) {
  const router = useRouter();

  const form = useForm<CancelBookingInput>({
    resolver: zodResolver(CancelBookingSchema),
    mode: "onTouched",
    defaultValues: {
      alasanPembatalan: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CancelBookingInput) => runAction(() => cancelBooking(bookingId, data)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      form.reset();
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof CancelBookingInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}
