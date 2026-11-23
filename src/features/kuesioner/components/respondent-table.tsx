"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/data/data-table";
import { KuesionerRespondent } from "../types";
import { respondentTableColumns } from "./respondent-table-columns";
import { RespondentTableEmptyState } from "./respondent-table-empty-state";

interface RespondentTableProps {
  data: KuesionerRespondent[];
  kuesionerId: string;
}

export function RespondentTable({ data, kuesionerId }: RespondentTableProps) {
  const columns = useMemo(() => respondentTableColumns({ kuesionerId }), [kuesionerId]);

  return (
    <DataTable
      data={data}
      columns={columns}
      initialState={{ columnVisibility: { search: false } }}
      renderEmptyState={() => <RespondentTableEmptyState />}
    />
  );
}
