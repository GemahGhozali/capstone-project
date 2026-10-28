"use client";

import { Separator } from "@/components/ui/separator";
import { CapstoneProjectProgress } from "../types";
import { IconCheck, IconClockHour3, IconX } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperNav, StepperSeparator, StepperTitle, StepperTrigger, StepState } from "@/components/ui/stepper";

function generateCapstoneProjectSteps({ statusTim, statusProposal, statusResume }: CapstoneProjectProgress) {
  const teamPending = statusTim === "Menunggu Persetujuan";
  const teamCompleted = statusTim === "Lengkap";

  const proposalExist = statusProposal !== "Tidak Ada";
  const proposalPending = statusProposal === "Menunggu";
  const proposalApproved = statusProposal === "Disetujui";
  const proposalRejected = statusProposal === "Ditolak";
  const proposalRevision = statusProposal === "Revisi";

  const resumeExist = statusResume !== "Tidak Ada";
  const resumePending = statusResume === "Menunggu";
  const resumeApproved = statusResume === "Disetujui";
  const resumeRejected = statusResume === "Ditolak";

  return [
    {
      title: "Membuat Tim",
      description: teamPending ? "Menunggu Persetujuan" : teamCompleted ? "Sudah Dibuat" : "Belum Dibuat",
      state: (teamCompleted ? "completed" : teamPending ? "active" : "inactive") as StepState,
    },
    {
      title: "Upload Proposal",
      description: proposalExist ? "Sudah Diupload" : teamCompleted ? "Menunggu Upload" : "Menunggu Tim",
      state: (proposalExist ? "completed" : teamCompleted ? "active" : "inactive") as StepState,
    },
    {
      title: "Review Proposal",
      description: proposalPending ? "Menunggu Review" : proposalApproved ? "Disetujui" : proposalRejected ? "Ditolak" : proposalRevision ? "Perlu Revisi" : "Menunggu Proposal",
      state: (proposalApproved ? "completed" : proposalPending ? "active" : proposalRejected || proposalRevision ? "error" : "inactive") as StepState,
    },
    {
      title: "Upload Resume",
      description: resumeExist ? "Sudah Diupload" : proposalApproved ? "Menunggu Upload" : "Menunggu Proposal",
      state: (resumeExist ? "completed" : proposalApproved ? "active" : "inactive") as StepState,
    },
    {
      title: "Review Resume",
      description: resumePending ? "Menunggu Review" : resumeApproved ? "Disetujui" : resumeRejected ? "Ditolak" : "Menunggu Resume",
      state: (resumeApproved ? "completed" : resumePending ? "active" : resumeRejected ? "error" : "inactive") as StepState,
    },
  ];
}

function getCurrentStep(steps: { state: StepState }[]) {
  const activeIndex = steps.findIndex((step) => step.state === "active" || step.state === "error");
  if (activeIndex !== -1) return activeIndex + 1;

  const allStepsCompleted = steps.every((step) => step.state === "completed");
  if (allStepsCompleted) return steps.length + 1;

  return 0;
}

interface MahasiswaCapstoneProjectProgressProps {
  progress: CapstoneProjectProgress;
  viewer: "Mahasiswa" | "Dosen";
}

export function MahasiswaCapstoneProjectProgress({ progress, viewer }: MahasiswaCapstoneProjectProgressProps) {
  const capstoneProjectSteps = generateCapstoneProjectSteps(progress);
  const currentStep = getCurrentStep(capstoneProjectSteps);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Capstone Project</CardTitle>
        <CardDescription>Pantau aktivitas dan perkembangan capstone project {viewer === "Mahasiswa" ? "anda" : "mahasiswa"}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <Stepper
          value={currentStep}
          indicators={{
            completed: <IconCheck className="size-4" />,
            active: <IconClockHour3 className="size-4" />,
            error: <IconX className="size-4" />,
          }}
          className="w-full space-y-8"
        >
          <StepperNav>
            {capstoneProjectSteps.map((step, index) => (
              <StepperItem key={index} step={index + 1} completed={step.state === "completed"} error={step.state === "error"} disabled className="relative flex-1 items-start">
                <StepperTrigger className="flex flex-col gap-1 disabled:pointer-events-none disabled:opacity-100">
                  <StepperIndicator className="mb-4">{index + 1}</StepperIndicator>
                  <StepperTitle>{step.title}</StepperTitle>
                  <StepperDescription className="text-xs">{step.description}</StepperDescription>
                </StepperTrigger>
                {capstoneProjectSteps.length > index + 1 && (
                  <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute inset-x-0 top-2.5 left-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
                )}
              </StepperItem>
            ))}
          </StepperNav>
        </Stepper>
      </CardContent>
    </Card>
  );
}
