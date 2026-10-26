"use client";

import { DataTable } from "@/components/data/data-table";
import { ResumeListItem } from "../types";
import { resumeTableColumns } from "./resume-table-columns";
import { ResumeTableToolbar } from "./resume-table-toolbar";
import { ResumeTableEmptyState } from "./resume-table-empty-state";

interface ResumeTableProps {
  data: ResumeListItem[];
}

export function ResumeTable({ data }: ResumeTableProps) {
  return (
    <DataTable
      data={data}
      columns={resumeTableColumns}
      initialState={{ columnVisibility: { search: false } }}
      renderToolbar={(table) => <ResumeTableToolbar table={table} />}
      renderEmptyState={(table) => <ResumeTableEmptyState table={table} />}
    />
  );
}
