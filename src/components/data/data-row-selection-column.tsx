import { Checkbox } from "@/components/ui/checkbox";
import { DataTableFeatures } from "./features";
import { createColumnHelper, ColumnDef, RowData } from "@tanstack/react-table";

export function createRowSelectionColumn<TData extends RowData>(): ColumnDef<DataTableFeatures, TData> {
  const columnHelper = createColumnHelper<DataTableFeatures, TData>();

  return columnHelper.display({
    id: "select",
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Pilih semua baris di halaman ini"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={() => table.toggleAllPageRowsSelected()}
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={() => row.toggleSelected()} />,
  });
}
