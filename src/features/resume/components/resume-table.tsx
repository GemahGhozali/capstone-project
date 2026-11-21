"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data/data-table";
import { usePathname } from "next/navigation";
import { ResumeTableToolbar } from "./resume-table-toolbar";
import { resumeTableColumns } from "./resume-table-columns";
import { ResumeTableEmptyState } from "./resume-table-empty-state";
import { ResumeListItem, ResumeViewer } from "../types";

interface ResumeTableProps {
  data: ResumeListItem[];
  viewer: ResumeViewer;
}

export function ResumeTable({ data, viewer }: ResumeTableProps) {
  const pathname = usePathname();
  const columns = useMemo(() => resumeTableColumns({ basePath: pathname, viewer, data }), [pathname, viewer, data]);

  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(resume) => resume.id}
      enableRowSelection={viewer === "Kaprodi"}
      initialState={{ columnVisibility: { search: false } }}
      renderToolbar={(table) => <ResumeTableToolbar table={table} showExport={viewer === "Kaprodi"} />}
      renderEmptyState={(table) => <ResumeTableEmptyState table={table} />}
    />
  );
}
