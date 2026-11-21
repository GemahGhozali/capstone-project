import "server-only";

import writeExcelFile, { type Cell, type SheetData } from "write-excel-file/node";

const XLSX_DATE_FORMAT = "dd/mm/yyyy";
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

export interface ExcelSheetData {
  data: SheetData;
  columnWidths: number[];
}

interface BuildExcelResponseOptions<TRow> {
  fileName: string;
  sheetName: string;
  columns: ExcelColumn<TRow>[];
  rows: TRow[];
}

interface BuildExcelWorkbookResponseOptions {
  fileName: string;
  sheets: (ExcelSheetData & { sheetName: string })[];
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
      format: XLSX_DATE_FORMAT,
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

export function buildExcelSheetData<TRow>({ columns, rows }: { columns: ExcelColumn<TRow>[]; rows: TRow[] }): ExcelSheetData {
  const headerRow = columns.map((column) => ({
    value: column.header,
    fontWeight: "bold" as const,
    backgroundColor: "#18181b",
    textColor: "#fafafa",
    align: "center" as const,
    alignVertical: "center" as const,
    ...cellBorder,
  }));

  return {
    data: [headerRow, ...rows.map((row) => columns.map((column) => createCell(column, row)))],
    columnWidths: columns.map((column) => column.width ?? 20),
  };
}

function createExcelResponse(fileName: string, buffer: Uint8Array) {
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": XLSX_MIME_TYPE,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}

export async function buildExcelResponse<TRow>({ fileName, sheetName, columns, rows }: BuildExcelResponseOptions<TRow>) {
  const { data, columnWidths } = buildExcelSheetData({ columns, rows });

  const buffer = await writeExcelFile(data, {
    sheet: sheetName,
    columns: columnWidths.map((width) => ({ width })),
    stickyRowsCount: 1,
    dateFormat: XLSX_DATE_FORMAT,
  }).toBuffer();

  return createExcelResponse(fileName, buffer);
}

export async function buildExcelWorkbookResponse({ fileName, sheets }: BuildExcelWorkbookResponseOptions) {
  const workbookSheets = sheets.map(({ sheetName, data, columnWidths }) => ({
    data,
    sheet: sheetName,
    columns: columnWidths.map((width) => ({ width })),
    stickyRowsCount: 1,
    dateFormat: XLSX_DATE_FORMAT,
  }));

  const buffer = await writeExcelFile(workbookSheets).toBuffer();

  return createExcelResponse(fileName, buffer);
}
