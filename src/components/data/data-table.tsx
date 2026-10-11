"use client";

import { useState } from "react";
import { DataPagination } from "./data-pagination";
import { IconFolderOpen } from "@tabler/icons-react";
import { features, DataTableFeatures } from "./features";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTable, ColumnDef, RowData, ReactTable, ColumnFiltersState, SortingState, TableState } from "@tanstack/react-table";

interface DataTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<DataTableFeatures, TData>[];
  initialState?: Partial<TableState<DataTableFeatures>>;
  renderToolbar?: (table: ReactTable<DataTableFeatures, TData>) => React.ReactNode;
  renderEmptyState?: (table: ReactTable<DataTableFeatures, TData>) => React.ReactNode;
}

export function DataTable<TData extends RowData>({ columns, data, initialState, renderToolbar, renderEmptyState }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useTable({
    features,
    data,
    columns,
    initialState,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters, sorting },
  });

  const rows = table.getRowModel().rows ?? [];

  const renderData = () => {
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            {renderEmptyState?.(table) ?? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconFolderOpen />
                  </EmptyMedia>
                  <EmptyTitle>Tidak Ada Data</EmptyTitle>
                  <EmptyDescription>Tidak ditemukan data apapun</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((row) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="px-6! py-4!">
            <table.FlexRender cell={cell} />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      {renderToolbar?.(table)}
      <div className="overflow-hidden border rounded-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-6! py-4!">
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderData()}</TableBody>
        </Table>
      </div>
      <DataPagination table={table} />
    </div>
  );
}
