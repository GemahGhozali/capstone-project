"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { ReactTable } from "@tanstack/react-table";
import { ResumeListItem } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { Card, CardContent } from "@/components/ui/card";
import { IconArchive, IconRefresh, IconX } from "@tabler/icons-react";
import { useBulkArchiveResume, useBulkUnarchiveResume } from "../hooks";

interface ResumeTableSelectionBarProps {
  table: ReactTable<DataTableFeatures, ResumeListItem>;
}

export function ResumeTableSelectionBar({ table }: ResumeTableSelectionBarProps) {
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedResumelIds = selectedRows.map((row) => row.original.id);

  const { mutateAsync: archiveResume, isPending: isArchivePending } = useBulkArchiveResume();
  const { mutateAsync: unarchiveResume, isPending: isUnarchivePending } = useBulkUnarchiveResume();

  const isPending = isArchivePending || isUnarchivePending;

  const handleArchive = async () => {
    await archiveResume(selectedResumelIds, {
      onSuccess: () => table.resetRowSelection(),
      onError: () => table.resetRowSelection(),
    });
  };

  const handleUnarchive = async () => {
    await unarchiveResume(selectedResumelIds, {
      onSuccess: () => table.resetRowSelection(),
      onError: () => table.resetRowSelection(),
    });
  };

  return (
    <Card>
      <CardContent className="lg:flex-row lg:items-center gap-4">
        <div className="border bg-background shadow-xs dark:border-input dark:bg-input/30 rounded-md flex items-center h-9 lg:mr-auto">
          <p className="px-2.5 max-lg:mr-auto">
            <b>{selectedRows.length}</b> Resume Dipilih
          </p>
          <Separator orientation="vertical" className="h-4.5 my-auto" />
          <Button size="icon-sm" variant="ghost" className="hover:bg-transparent!" disabled={isPending} onClick={() => table.resetRowSelection()}>
            <IconX />
          </Button>
        </div>
        <Button variant="outline" disabled={isPending} onClick={handleArchive}>
          {isArchivePending ? "Memproses" : "Arsipkan"}
          {isArchivePending ? <Spinner data-icon="inline-end" /> : <IconArchive data-icon="inline-end" />}
        </Button>
        <Button variant="default" disabled={isPending} onClick={handleUnarchive}>
          {isUnarchivePending ? "Memproses" : "Kembalikan"}
          {isUnarchivePending ? <Spinner data-icon="inline-end" /> : <IconRefresh data-icon="inline-end" />}
        </Button>
      </CardContent>
    </Card>
  );
}
