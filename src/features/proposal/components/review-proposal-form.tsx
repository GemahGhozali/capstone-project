"use client";

import { cn } from "cn";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { StatusProposal } from "@/generated/prisma/enums";
import { useReviewProposalForm } from "../hooks";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { IconCheck, IconEdit, IconLockOpen, IconLock, IconPlus, IconX } from "@tabler/icons-react";
import { Callout, CalloutContent, CalloutDescription, CalloutIcon, CalloutTitle } from "@/components/ui/callout";

interface ReviewProposalFormProps {
  currentProposalStatus: StatusProposal;
}

const statusOptions = [
  {
    value: "Disetujui",
    icon: <IconCheck className="size-4" />,
    selectedClassName: "border-green-500 bg-green-500/10 text-green-500",
  },
  {
    value: "Revisi",
    icon: <IconEdit className="size-4" />,
    selectedClassName: "border-yellow-500 bg-yellow-500/10 text-yellow-500",
  },
  {
    value: "Ditolak",
    icon: <IconX className="size-4" />,
    selectedClassName: "border-red-500 bg-red-500/10 text-red-500",
  },
] as const;

export function ReviewProposalForm({ currentProposalStatus }: ReviewProposalFormProps) {
  const [open, setOpen] = useState(false);

  const proposalStatusLocked = currentProposalStatus !== "Menunggu";
  const proposalStatusDefaultValue = currentProposalStatus === "Menunggu" ? undefined : currentProposalStatus;

  const {
    mutation: { mutate, isPending },
    form: { control, handleSubmit, reset },
  } = useReviewProposalForm(currentProposalStatus);

  const onSubmit = handleSubmit((data) =>
    mutate(data, {
      onSuccess: () => setOpen(false),
      onError: () => setOpen(false),
    }),
  );

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    reset({ status: proposalStatusDefaultValue, catatan: "" });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="max-sm:w-full">
            Beri Review <IconPlus data-icon="inline-end" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-xl" showCloseButton={false}>
        <form onSubmit={onSubmit} className="space-y-6">
          <Callout className="gap-4 p-4 lg:items-start">
            <CalloutIcon className={cn(proposalStatusLocked ? "" : "bg-blue-500/15 text-blue-500")}>
              {proposalStatusLocked ? <IconLock /> : <IconLockOpen />}
            </CalloutIcon>
            <CalloutContent>
              <CalloutTitle>{proposalStatusLocked ? "Status Proposal Terkunci!" : "Status Proposal Terbuka!"}</CalloutTitle>
              <CalloutDescription>
                {proposalStatusLocked
                  ? "Proposal ini telah direview! Feedback anda akan mengikuti status yang telah ditetapkan."
                  : "Silahkan tentukan status proposal dan berikan review anda."}
              </CalloutDescription>
            </CalloutContent>
          </Callout>
          <FieldGroup className="gap-6">
            {/* Status Proposal */}
            {!proposalStatusLocked && (
              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Status Proposal <span className="text-red-600">*</span>
                    </FieldLabel>
                    <RadioGroup
                      name={field.name}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                      disabled={proposalStatusLocked || isPending}
                      className="grid-cols-1 sm:grid-cols-3"
                    >
                      {statusOptions.map((option) => (
                        <Label
                          key={option.value}
                          className={cn(
                            "flex items-center justify-center gap-1.5 h-11 cursor-pointer rounded-md border bg-transparent px-3 text-sm font-medium transition-colors",
                            field.value === option.value ? option.selectedClassName : "border-input text-muted-foreground hover:bg-muted/50",
                          )}
                        >
                          <RadioGroupItem value={option.value} className="sr-only size-0" />
                          {option.value}
                          {option.icon}
                        </Label>
                      ))}
                    </RadioGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}

            {/* Feedback */}
            <Controller
              name="catatan"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="catatan">
                    Feedback <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="catatan"
                    rows={4}
                    placeholder="Berikan feedback anda untuk proposal..."
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
              Batalkan
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Memproses" : "Submit Review"}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
