"use client";

import { StatusTim } from "@/generated/prisma/enums";
import { ReactTable } from "@tanstack/react-table";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { DataTableFeatures } from "@/components/data/features";
import { DataFilterDropdown } from "@/components/data/data-filter-dropdown";
import { TeamTableSelectionBar } from "./team-table-selection-bar";
import { IconCircleCheck, IconNut } from "@tabler/icons-react";
import { TeamListItem, TeamCompletenessStatus } from "../types";

interface TeamTableToolbarProps {
  table: ReactTable<DataTableFeatures, TeamListItem>;
}

const TeamCompletenessStatusOptions: TeamCompletenessStatus[] = ["Lengkap", "Belum Lengkap"];

export function TeamTableToolbar({ table }: TeamTableToolbarProps) {
  const isSelectionActive = table.getSelectedRowModel().rows.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex gap-3 max-sm:flex-col">
        <DataSearchBar table={table} placeholder="Cari nama tim disini..." className="sm:max-w-80" />
        <DataFilterDropdown
          table={table}
          columnId="status"
          label="Status Tim"
          icon={<IconNut data-icon="inline-start" />}
          options={Object.keys(StatusTim)}
        />
        <DataFilterDropdown
          table={table}
          columnId="statusKelengkapan"
          label="Status Kelengkapan"
          icon={<IconCircleCheck data-icon="inline-start" />}
          options={TeamCompletenessStatusOptions}
        />
      </div>
      {isSelectionActive && <TeamTableSelectionBar table={table} />}
    </div>
  );
}
