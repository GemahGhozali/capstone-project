import "server-only";

import writeExcelFile, { type Cell, type SheetData } from "write-excel-file/node";

const XLSX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const cellBorder = {
  borderColor: "#d4d4d8",
  borderStyle: "thin" as const,
};

type ExcelCellValue = string | number | boolean | Date | null | undefined;

export interface ExcelColumn<TRow> {
  header: string;
  width?: number;
  wrap?: boolean;
  align?: "left" | "center" | "right";
  value: (row: TRow) => ExcelCellValue;
}

interface BuildExcelResponseOptions<TRow> {
  fileName: string;
  sheetName: string;
  columns: ExcelColumn<TRow>[];
  rows: TRow[];
}

function createCell<TRow>(column: ExcelColumn<TRow>, row: TRow): Cell {
  const value = column.value(row);

  if (value === null || value === undefined) {
    return {
      ...cellBorder,
      alignVertical: "top",
      ...(column.wrap && { wrap: true }),
    };
  }

  if (value instanceof Date) {
    return {
      value,
      type: Date,
      format: "dd/mm/yyyy",
      ...cellBorder,
      alignVertical: "top",
      ...(column.align && { align: column.align }),
    };
  }

  return {
    value,
    ...cellBorder,
    alignVertical: "top",
    ...(column.wrap && { wrap: true }),
    ...(column.align && { align: column.align }),
  };
}

export async function buildExcelResponse<TRow>({ fileName, sheetName, columns, rows }: BuildExcelResponseOptions<TRow>) {
  const headerRow = columns.map((column) => ({
    value: column.header,
    fontWeight: "bold" as const,
    backgroundColor: "#18181b",
    textColor: "#fafafa",
    align: "center" as const,
    alignVertical: "center" as const,
    ...cellBorder,
  }));

  const sheetData: SheetData = [headerRow, ...rows.map((row) => columns.map((column) => createCell(column, row)))];

  const buffer = await writeExcelFile(sheetData, {
    sheet: sheetName,
    columns: columns.map((column) => ({ width: column.width ?? 20 })),
    stickyRowsCount: 1,
    dateFormat: "dd/mm/yyyy",
  }).toBuffer();

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": XLSX_MIME_TYPE,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
