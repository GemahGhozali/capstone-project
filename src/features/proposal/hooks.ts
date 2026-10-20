"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ActionResponse } from "@/types";
import { ProposalManagementData } from "./types";
import { submitProposal, updateProposal, reviewProposal } from "./actions";
import { SubmitProposalSchema, UpdateProposalSchema, ProposalInput, ReviewProposalSchema, ReviewProposalInput } from "./schemas";

interface UseProposalForm {
  proposal: ProposalManagementData;
}

export function useProposalForm({ proposal }: UseProposalForm) {
  const form = useForm({
    resolver: zodResolver(proposal ? UpdateProposalSchema : SubmitProposalSchema),
    mode: "onTouched",
    defaultValues: {
      file: proposal?.fileName ?? undefined,
      judul: proposal?.judul ?? "",
      mitra: proposal?.mitra ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProposalInput) => {
      const actionFn = proposal ? updateProposal(proposal.id, data) : submitProposal(data);
      return runAction(() => actionFn);
    },

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof ProposalInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useReviewProposalForm(proposalId: string) {
  const form = useForm({
    resolver: zodResolver(ReviewProposalSchema),
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationFn: (data: ReviewProposalInput) => runAction(() => reviewProposal(proposalId, data)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof ReviewProposalInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}
