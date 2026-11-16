"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { ReactTable } from "@tanstack/react-table";
import { IconNut, IconX } from "@tabler/icons-react";
import { StatusMahasiswa } from "@/generated/prisma/enums";
import { MahasiswaOverview } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { Card, CardContent } from "@/components/ui/card";
import { useBulkUpdateStatusMahasiswa } from "../hooks";
import { BulkDeleteMahasiswaAlertDialog } from "./bulk-delete-mahasiswa-alert-dialog";

interface MahasiswaTableSelectionBarProps {
  table: ReactTable<DataTableFeatures, MahasiswaOverview>;
}

export function MahasiswaTableSelectionBar({ table }: MahasiswaTableSelectionBarProps) {
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedMahasiswaIds = selectedRows.map((row) => row.original.id);

  const { mutateAsync: updateStatus, isPending } = useBulkUpdateStatusMahasiswa();

  const handleUpdateStatus = async (status: StatusMahasiswa) => {
    const payload = { ids: selectedMahasiswaIds, status };

    await updateStatus(payload, {
      onSuccess: () => table.resetRowSelection(),
      onError: () => table.resetRowSelection(),
    });
  };

  return (
    <Card>
      <CardContent className="lg:flex-row lg:items-center gap-4">
        <div className="border bg-background shadow-xs dark:border-input dark:bg-input/30 rounded-md flex items-center h-9 lg:mr-auto">
          <p className="px-2.5 max-lg:mr-auto">
            <b>{selectedRows.length}</b> Mahasiswa Dipilih
          </p>
          <Separator orientation="vertical" className="h-4.5 my-auto" />
          <Button size="icon-sm" variant="ghost" className="hover:bg-transparent!" disabled={isPending} onClick={() => table.resetRowSelection()}>
            <IconX />
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" disabled={isPending}>
                {isPending ? "Memproses" : "Ubah Status"}
                {isPending ? <Spinner data-icon="inline-end" /> : <IconNut data-icon="inline-end" />}
              </Button>
            }
          />
          <DropdownMenuContent className="lg:w-fit" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Status Mahasiswa</DropdownMenuLabel>
              {Object.keys(StatusMahasiswa).map((status) => (
                <DropdownMenuItem key={status} onClick={() => handleUpdateStatus(status as StatusMahasiswa)}>
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <BulkDeleteMahasiswaAlertDialog mahasiswaIds={selectedMahasiswaIds} onDeleteSuccess={() => table.resetRowSelection()} />
      </CardContent>
    </Card>
  );
}
