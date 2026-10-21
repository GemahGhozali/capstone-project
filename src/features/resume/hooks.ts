"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { runAction } from "@/utils/action-runner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ActionResponse } from "@/types";
import { ResumeManagementData } from "./types";
import { submitResume, updateResume, reviewResume } from "./actions";
import { UpdateResumeSchema, ResumeInput, ReviewResumeSchema, ReviewResumeInput, SubmitResumeSchema } from "./schemas";

interface UseResumeForm {
  resume: ResumeManagementData;
}

export function useResumeForm({ resume }: UseResumeForm) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(resume ? UpdateResumeSchema : SubmitResumeSchema),
    mode: "onTouched",
    defaultValues: {
      subjudul: resume?.subjudul ?? "",
      dosenId: resume?.dosen.id ?? "",
      file: resume?.fileName ?? undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ResumeInput) => {
      const actionFn = resume ? updateResume(resume.id, data) : submitResume(data);
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
          form.setError(field as keyof ResumeInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useReviewResumeForm(resumeId: string) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(ReviewResumeSchema),
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationFn: (data: ReviewResumeInput) => runAction(() => reviewResume(resumeId, data)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
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
