"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { getResumeById } from "./queries";
import { ActionResponse } from "@/types";
import { submitResume, updateResume, reviewResume } from "./actions";
import { ResumeSchema, ResumeInput, ReviewResumeSchema, ReviewResumeInput } from "./schemas";

interface UseResumeForm {
  resume?: Awaited<ReturnType<typeof getResumeById>>;
}

export function useResumeForm({ resume }: UseResumeForm) {
  const form = useForm({
    resolver: zodResolver(ResumeSchema),
    mode: "onTouched",
    defaultValues: {
      subjudul: resume?.subjudul ?? "",
      dosenId: resume?.dosen.id ?? "",
      file: resume?.file ?? undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ResumeInput) => {
      const actionFn = resume ? updateResume(resume.id, data) : submitResume(data);
      return runAction(() => actionFn);
    },

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof ResumeInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useReviewResumeForm(resumeId: string) {
  const form = useForm({
    resolver: zodResolver(ReviewResumeSchema),
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationFn: (data: ReviewResumeInput) => runAction(() => reviewResume(resumeId, data)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof ReviewResumeInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}
