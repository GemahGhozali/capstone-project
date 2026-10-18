"use client";

import { toast } from "@/components/ui/toast";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { runAction } from "@/utils/action-runner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/hooks/use-debounce";
import { useMutation } from "@tanstack/react-query";
import { ActionResponse } from "@/types";
import { KategoriCapstone } from "@/generated/prisma/enums";
import { SearchMahasiswaResult } from "./types";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { TeamInput, TeamMemberInput, TeamSchema } from "./schemas";
import { acceptTeamInvitation, createTeam, rejectTeamInvitation, updateTeam } from "./actions";

export function useSearchMahasiswa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mahasiswaResults, setMahasiswaResults] = useState<Map<string, SearchMahasiswaResult>>(new Map());

  const debouncedQuery = useDebounce(searchQuery, 500).trim();
  const normalizedQuery = searchQuery.trim();

  const isDebouncing = debouncedQuery.length >= 1;

  const mahasiswaQuery = useQuery({
    gcTime: 0,
    staleTime: 0,
    retry: false,
    enabled: isDebouncing,
    refetchOnWindowFocus: false,
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

  useEffect(() => {
    const data = mahasiswaQuery.data;

    if (!data) return;

    setMahasiswaResults((previousResults) => {
      const nextResults = new Map(previousResults);
      data.forEach((mahasiswa) => nextResults.set(mahasiswa.id, mahasiswa));
      return nextResults;
    });
  }, [mahasiswaQuery.data]);

  const results = useMemo(() => {
    if (normalizedQuery.length < 1) return undefined;

    if (mahasiswaResults.size === 0) return undefined;

    const query = normalizedQuery.toLowerCase();

    const mahasiswaList = Array.from(mahasiswaResults.values());

    const filteredMahasiswaList = mahasiswaList.filter((mahasiswa) => {
      const mahasiswaNameMatchWithQuery = mahasiswa.namaLengkap.toLowerCase().includes(query);
      const mahasiswaNIMMatchWithQuery = mahasiswa.identifier.toLowerCase().includes(query);
      return mahasiswaNameMatchWithQuery || mahasiswaNIMMatchWithQuery;
    });

    const sortedMahasiswaListByNIM = filteredMahasiswaList.sort((a, b) => a.identifier.localeCompare(b.identifier));

    return sortedMahasiswaListByNIM.slice(0, 5);
  }, [mahasiswaResults, normalizedQuery]);

  return { setSearchQuery, searchQuery, results, error: mahasiswaQuery.error };
}

interface UseTeamFormProps {
  teamData: {
    id?: string;
    nama?: string;
    anggota: TeamMemberInput[];
  };
}

export function useTeamForm({ teamData }: UseTeamFormProps) {
  const router = useRouter();

  const form = useForm<TeamInput>({
    resolver: zodResolver(TeamSchema),
    mode: "onTouched",
    defaultValues: {
      namaTim: teamData.nama ?? "",
      anggota: teamData.anggota,
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
    if (members[index].peran === "Ketua") return;
    remove(index);
  };

  const mutation = useMutation({
    mutationFn: (data: TeamInput) => {
      const actionFn = teamData.id ? updateTeam(teamData.id, data) : createTeam(data);
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

export function useAcceptTeamInvitation() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => runAction(() => acceptTeamInvitation()),
    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useRejectTeamInvitation() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => runAction(() => rejectTeamInvitation()),
    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      router.refresh();
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}
