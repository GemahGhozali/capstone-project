"use client";

import {
  submitProposal,
  updateProposal,
  reviewProposal,
  archieveProposal,
  unarchieveProposal,
  bulkArchieveProposal,
  bulkUnarchieveProposal,
} from "./actions";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/action-runner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ActionResponse } from "@/types";
import { StatusProposal } from "@/generated/prisma/enums";
import { useParams, useRouter } from "next/navigation";
import { ProposalManagementData } from "./types";
import { SubmitProposalSchema, UpdateProposalSchema, ProposalInput, ReviewProposalSchema, ReviewProposalInput } from "./schemas";

interface UseProposalForm {
  proposal: ProposalManagementData;
}

export function useProposalForm({ proposal }: UseProposalForm) {
  const router = useRouter();

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
      router.refresh();
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

export function useReviewProposalForm(currentProposalStatus: StatusProposal) {
  const router = useRouter();

  const { id } = useParams<{ id: string }>();

  const proposalStatusDefaultValue = currentProposalStatus === "Menunggu" || currentProposalStatus === "Arsip" ? undefined : currentProposalStatus;

  const form = useForm<ReviewProposalInput>({
    resolver: zodResolver(ReviewProposalSchema),
    defaultValues: {
      status: proposalStatusDefaultValue,
      catatan: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ReviewProposalInput) => runAction(() => reviewProposal(id, data)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      form.reset({ status: proposalStatusDefaultValue, catatan: "" });
      router.refresh();
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

export function useToggleArchieveProposal() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusProposal }) => {
      const actionFn = status === "Arsip" ? unarchieveProposal(id) : archieveProposal(id);
      return runAction(() => actionFn);
    },

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useBulkArchieveProposal() {
  const router = useRouter();

  return useMutation({
    mutationFn: (ids: string[]) => runAction(() => bulkArchieveProposal(ids)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useBulkUnarchieveProposal() {
  const router = useRouter();

  return useMutation({
    mutationFn: (ids: string[]) => runAction(() => bulkUnarchieveProposal(ids)),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}
