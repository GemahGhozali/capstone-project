"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { DataTable } from "@/components/data/data-table";
import { ResumeListItem } from "../types";
import { ResumeTableToolbar } from "./resume-table-toolbar";
import { resumeTableColumns } from "./resume-table-columns";
import { ResumeTableEmptyState } from "./resume-table-empty-state";

interface ResumeTableProps {
  data: ResumeListItem[];
}

export function ResumeTable({ data }: ResumeTableProps) {
  const pathname = usePathname();
  const columns = useMemo(() => resumeTableColumns({ basePath: pathname }), [pathname]);

  return (
    <DataTable
      data={data}
      columns={columns}
      initialState={{ columnVisibility: { search: false } }}
      renderToolbar={(table) => <ResumeTableToolbar table={table} />}
      renderEmptyState={(table) => <ResumeTableEmptyState table={table} />}
    />
  );
}
