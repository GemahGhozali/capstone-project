"use client";

import { Button } from "@/components/ui/button";
import { DataTableFeatures } from "./features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataPaginationProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function DataPagination<TData extends RowData>({ table }: DataPaginationProps<TData>) {
  return (
    <div className="w-full flex gap-6 sm:items-center max-sm:flex-col">
      <div className="flex items-center gap-3 sm:mr-auto max-sm:justify-center max-sm:order-3">
        <Select value={`${table.state.pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
          <SelectTrigger className="w-16">
            <SelectValue placeholder={table.state.pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectGroup>
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">Data per halaman</p>
      </div>
      <p className="text-sm text-muted-foreground max-sm:text-center max-sm:order-3">
        Halaman {table.state.pagination.pageIndex + 1} dari {table.getPageCount()}
      </p>
      <div className="flex gap-2 max-sm:*:grow">
        <Button size="icon" variant="outline" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
          <IconChevronsLeft />
        </Button>
        <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          <IconChevronLeft />
        </Button>
        <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          <IconChevronRight />
        </Button>
        <Button size="icon" variant="outline" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
          <IconChevronsRight />
        </Button>
      </div>
    </div>
  );
}
