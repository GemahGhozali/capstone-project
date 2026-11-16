"use client";

import { cn } from "cn";
import { DataPagination } from "./data-pagination";
import { IconFolderOpen } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { createRowSelectionColumn } from "./data-row-selection-column";
import { features, DataTableFeatures } from "./features";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RowData, useTable, ColumnDef, TableState, ReactTable, SortingState, RowSelectionState, ColumnFiltersState } from "@tanstack/react-table";

interface DataTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<DataTableFeatures, TData>[];
  initialState?: Partial<TableState<DataTableFeatures>>;
  enableRowSelection?: boolean;
  getRowId?: (originalRow: TData, index: number) => string;
  renderToolbar?: (table: ReactTable<DataTableFeatures, TData>) => React.ReactNode;
  renderEmptyState?: (table: ReactTable<DataTableFeatures, TData>) => React.ReactNode;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  initialState,
  enableRowSelection = false,
  getRowId,
  renderToolbar,
  renderEmptyState,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const rowSelectionColumn = useMemo(() => (enableRowSelection ? [createRowSelectionColumn<TData>()] : []), [enableRowSelection]);

  const allColumns = useMemo(() => [...rowSelectionColumn, ...columns], [rowSelectionColumn, columns]);

  const table = useTable({
    data,
    features,
    columns: allColumns,
    initialState,
    enableRowSelection,
    state: {
      columnFilters,
      sorting,
      rowSelection,
    },
    getRowId,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      setRowSelection({});
    },
  });

  const rows = table.getRowModel().rows ?? [];

  const renderData = () => {
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={allColumns.length} className="h-24 text-center">
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
                  <TableHead key={header.id} className={cn("px-6! py-4!", header.column.id === "select" && "w-10")}>
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
