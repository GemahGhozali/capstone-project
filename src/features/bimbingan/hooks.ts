"use client";

import {
  bookingBimbingan,
  openJadwalBimbingan,
  closeJadwalBimbingan,
  createJadwalBimbingan,
  deleteJadwalBimbingan,
  cancelBookingBimbingan,
  completeBookingBimbingan,
} from "./actions";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ActionResponse } from "@/types";
import { CreateJadwalBimbinganInput, BookingJadwalInput, CancelBookingInput, CompleteBookingInput } from "./schemas";
import { CreateJadwalBimbinganSchema, BookingJadwalSchema, CancelBookingSchema, CompleteBookingSchema } from "./schemas";

export function useCreateJadwalForm() {
  const router = useRouter();

  const form = useForm<CreateJadwalBimbinganInput>({
    resolver: zodResolver(CreateJadwalBimbinganSchema),
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

export function useCloseJadwalBimbinganForm() {
  const router = useRouter();

  const form = useForm<CancelBookingInput>({
    resolver: zodResolver(CancelBookingSchema),
    defaultValues: {
      alasanPembatalan: "",
    },
  });

  const mutation = useMutation({
    mutationFn: ({ jadwalId, data }: { jadwalId: string; data: CancelBookingInput }) => runAction(() => closeJadwalBimbingan(jadwalId, data)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
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

export function useOpenJadwalBimbingan() {
  const router = useRouter();

  return useMutation({
    mutationFn: (jadwalId: string) => runAction(() => openJadwalBimbingan(jadwalId)),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useDeleteJadwalBimbingan() {
  const router = useRouter();

  return useMutation({
    mutationFn: (jadwalId: string) => runAction(() => deleteJadwalBimbingan(jadwalId)),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useBookingBimbinganForm() {
  const router = useRouter();

  const form = useForm<BookingJadwalInput>({
    resolver: zodResolver(BookingJadwalSchema),
    defaultValues: {
      catatanMahasiswa: "",
    },
  });

  const mutation = useMutation({
    mutationFn: ({ jadwalId, data }: { jadwalId: string; data: BookingJadwalInput }) => runAction(() => bookingBimbingan(jadwalId, data)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      form.reset({ catatanMahasiswa: "" });
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

export function useCancelBookingBimbinganForm() {
  const router = useRouter();

  const form = useForm<CancelBookingInput>({
    resolver: zodResolver(CancelBookingSchema),
    defaultValues: {
      alasanPembatalan: "",
    },
  });

  const mutation = useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: CancelBookingInput }) => runAction(() => cancelBookingBimbingan(bookingId, data)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
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

export function useCompleteBookingBimbinganForm() {
  const router = useRouter();

  const form = useForm<CompleteBookingInput>({
    resolver: zodResolver(CompleteBookingSchema),
    defaultValues: {
      catatanDosen: "",
    },
  });

  const mutation = useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: CompleteBookingInput }) => {
      return runAction(() => completeBookingBimbingan(bookingId, data));
    },

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof CompleteBookingInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}
