"use client";

import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { useSearchMahasiswa } from "../hooks";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { SearchMahasiswaResult } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { IconAlertCircle, IconFolderOpen, IconPlus, IconSearch } from "@tabler/icons-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface TeamMemberInviterProps {
  isTeamFull: boolean;
  disabled: boolean;
  mahasiswaAlreadyInTeam: (id: string) => boolean;
  onInvite: (mahasiswa: SearchMahasiswaResult) => void;
}

export function TeamMemberInviter({ isTeamFull, disabled, mahasiswaAlreadyInTeam, onInvite }: TeamMemberInviterProps) {
  const { searchQuery, setSearchQuery, error, results } = useSearchMahasiswa();

  const handleInvite = (mahasiswa: SearchMahasiswaResult) => {
    onInvite(mahasiswa);
    setSearchQuery("");
  };

  const renderResults = () => {
    if (error) {
      return (
        <Empty className="border border-dashed rounded-md">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
              <IconAlertCircle />
            </EmptyMedia>
            <EmptyTitle>Gagal Mencari Data Mahasiswa</EmptyTitle>
            <EmptyDescription>{error.message}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    if (!results) return null;

    const filteredData = results.filter((mahasiswa) => !mahasiswaAlreadyInTeam(mahasiswa.id));

    if (filteredData.length === 0) {
      return (
        <Empty className="border border-dashed rounded-md">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconFolderOpen />
            </EmptyMedia>
            <EmptyTitle>Mahasiswa Tidak Ditemukan</EmptyTitle>
            <EmptyDescription>
              Tidak ada mahasiswa dengan nama <span className="font-medium">"{searchQuery}"</span>
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    return (
      <div className="border rounded-md dark:bg-input/30">
        {filteredData.map((mahasiswa) => (
          <div key={mahasiswa.id} className="flex items-center gap-3 p-4 not-last:border-b">
            <Avatar size="lg">
              <AvatarImage src={mahasiswa.fotoProfil ?? ""} alt={mahasiswa.namaLengkap} />
              <AvatarFallback>{generateNameInitials(mahasiswa.namaLengkap)}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="line-clamp-1 text-sm font-medium">{mahasiswa.namaLengkap}</p>
              <p className="line-clamp-1 text-xs text-muted-foreground">{mahasiswa.identifier}</p>
            </div>
            <Button
              size="sm"
              className="ml-auto max-md:hidden"
              type="button"
              disabled={isTeamFull || disabled}
              onClick={() => handleInvite(mahasiswa)}
            >
              Undang <IconPlus data-icon="inline-end" />
            </Button>
            <Button
              size="icon-sm"
              className="ml-auto md:hidden"
              type="button"
              disabled={isTeamFull || disabled}
              onClick={() => handleInvite(mahasiswa)}
            >
              <IconPlus data-icon="inline-end" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Fragment>
      <InputGroup>
        <InputGroupInput
          id="anggotaTim"
          value={searchQuery}
          disabled={disabled}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ketik NIM atau nama anggota disini..."
          autoComplete="off"
        />
        <InputGroupAddon align="inline-end">{<IconSearch />}</InputGroupAddon>
      </InputGroup>
      {renderResults()}
    </Fragment>
  );
}
