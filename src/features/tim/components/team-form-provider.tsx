"use client";

import { useTeamForm } from "../hooks";
import { TeamMemberInput } from "../schemas";
import { createContext, ReactNode, useContext } from "react";

type TeamFormContextValue = ReturnType<typeof useTeamForm>;

const TeamFormContext = createContext<TeamFormContextValue | null>(null);

export function useTeamFormContext() {
  const teamFormContext = useContext(TeamFormContext);

  if (!teamFormContext) {
    throw new Error("useTeamFormContext must be used within a TeamFormProvider.");
  }

  return teamFormContext;
}

interface TeamFormProviderProps {
  teamData: {
    id?: string;
    nama?: string;
    anggota: TeamMemberInput[];
  };
  children: ReactNode;
}

export function TeamFormProvider({ teamData, children }: TeamFormProviderProps) {
  const teamForm = useTeamForm({ teamData });

  return <TeamFormContext.Provider value={teamForm}>{children}</TeamFormContext.Provider>;
}
