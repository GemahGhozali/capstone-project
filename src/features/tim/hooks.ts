"use client";

import { toast } from "@/components/ui/toast";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { runAction } from "@/utils/action-runner";
import { createTeam } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/hooks/use-debounce";
import { ActionResponse } from "@/types";
import { KategoriCapstone } from "@/generated/prisma/enums";
import { SearchMahasiswaResult } from "./types";
import { AuthenticatedUserData } from "../auth/types";
import { useFieldArray, useForm } from "react-hook-form";
import { keepPreviousData, useMutation } from "@tanstack/react-query";
import { TeamInput, TeamMemberInput, TeamSchema } from "./schemas";

export function useSearchMahasiswa() {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, 150).trim();

  const isDebouncing = debouncedQuery.length >= 1;

  const mahasiswaQuery = useQuery({
    gcTime: 0,
    staleTime: 0,
    retry: false,
    enabled: isDebouncing,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    queryKey: ["mahasiswa", "search", debouncedQuery],
    queryFn: async ({ signal }): Promise<SearchMahasiswaResult[]> => {
      const query = encodeURIComponent(debouncedQuery);
      const response = await fetch(`/api/mahasiswa/search?q=${query}`, { signal });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "Gagal mengambil data mahasiswa!");
      }

      return response.json();
    },
  });

  return { ...mahasiswaQuery, setSearchQuery, searchQuery };
}

interface UseTeamFormProps {
  ketua: AuthenticatedUserData;
  anggota?: TeamMemberInput[];
}

export function useTeamForm({ ketua, anggota }: UseTeamFormProps) {
  const router = useRouter();

  const form = useForm<TeamInput>({
    resolver: zodResolver(TeamSchema),
    mode: "onTouched",
    defaultValues: {
      namaTim: "",
      anggota: [
        {
          id: ketua.id,
          fotoProfil: ketua.fotoProfil,
          nim: ketua.identifier,
          kategoriCapstone: "EPD",
          namaLengkap: ketua.namaLengkap,
          peran: "Ketua",
          statusPersetujuan: "Disetujui",
        },
        ...(anggota || []),
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "anggota",
    keyName: "fieldId",
  });

  const members = form.watch("anggota");
  const isTeamFull = fields.length >= 5;
  const mahasiswaAlreadyInTeam = (id: string) => members.some((member) => member.id === id);

  const addMember = (mahasiswa: SearchMahasiswaResult) => {
    if (isTeamFull || mahasiswaAlreadyInTeam(mahasiswa.id)) return;

    append({
      id: mahasiswa.id,
      nim: mahasiswa.identifier,
      namaLengkap: mahasiswa.namaLengkap,
      fotoProfil: mahasiswa.fotoProfil,
      kategoriCapstone: KategoriCapstone.EPD,
      peran: "Anggota",
      statusPersetujuan: "Menunggu",
    });
  };

  const removeMember = (index: number) => {
    if (index === 0) return;
    remove(index);
  };

  const mutation = useMutation({
    mutationFn: (data: TeamInput) => {
      const actionFn = createTeam(data);
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
          form.setError(field as keyof TeamInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation, isTeamFull, teamMembers: fields, addMember, removeMember, mahasiswaAlreadyInTeam };
}
