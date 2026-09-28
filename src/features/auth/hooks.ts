"use client";

import {
  LoginInput,
  ResetAccountInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ForgotPasswordWithEmailInput,
  ForgotPasswordWithIdentifierInput,
} from "./schemas";

import { toast } from "@/components/ui/toast";
import { logout } from "./actions";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { runAction } from "@/utils/action-runner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResponse } from "@/types";
import { login, resetAccount, forgotPassword, resetPassword } from "./actions";
import { LoginSchema, ResetAccountSchema, ResetPasswordSchema, ForgotPasswordWithEmailSchema, ForgotPasswordWithIdentifierSchema } from "./schemas";

export function useLogin() {
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginInput) => runAction(() => login(data)),
    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.replace("/");
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof LoginInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => runAction(() => logout()),
    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.replace("/");
    },
  });
}

export function useResetAccount() {
  const router = useRouter();

  const form = useForm<ResetAccountInput>({
    resolver: zodResolver(ResetAccountSchema),
    mode: "onTouched",
    defaultValues: {
      alamatEmail: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ResetAccountInput) => runAction(() => resetAccount(data)),
    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.replace("/");
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof ResetAccountInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useForgotPassword() {
  const [selectedResetOption, setSelectedResetOption] = useState<"email" | "identifier">("email");

  const formWithEmail = useForm<ForgotPasswordWithEmailInput>({
    resolver: zodResolver(ForgotPasswordWithEmailSchema),
    mode: "onTouched",
    defaultValues: { credential: "" },
  });

  const formWithIdentifier = useForm<ForgotPasswordWithIdentifierInput>({
    resolver: zodResolver(ForgotPasswordWithIdentifierSchema),
    mode: "onTouched",
    defaultValues: { credential: "" },
  });

  const form = selectedResetOption === "email" ? formWithEmail : formWithIdentifier;

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordInput) => runAction(() => forgotPassword(data, selectedResetOption)),
    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });

  const handleSelectResetOption = (option: "email" | "identifier") => {
    form.reset();
    form.clearErrors();
    setSelectedResetOption(option);
  };

  return { form, mutation, selectedResetOption, handleSelectResetOption };
}

export function useResetPassword() {
  const router = useRouter();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: { data: ResetPasswordInput; token: string }) => {
      return runAction(() => resetPassword(payload.data, payload.token));
    },

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.replace("/");
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });

  return { form, mutation };
}
