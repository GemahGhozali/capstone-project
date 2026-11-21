import "server-only";

import { isValid, parse } from "date-fns";
import writeExcelFile, { type Cell, type SheetData as WriteSheetData } from "write-excel-file/node";
import { readSheet, type Row as ExcelRow, type SheetData as ExcelSheetRows } from "read-excel-file/node";

export type { ExcelRow, ExcelSheetRows };

// Read Excel Utilities
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const EXCEL_SERIAL_DATE_EPOCH_UTC = Date.UTC(1899, 11, 30);
const SUPPORTED_EXCEL_DATE_FORMATS = ["dd/MM/yyyy", "d/M/yyyy", "yyyy-MM-dd"] as const;

export class ExcelReadError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ExcelReadError";
  }
}

export interface ExcelDataRow {
  cells: ExcelRow;
  rowNumber: number;
}

type ExcelColumnResolution<TKey extends string> = { exist: true; columnIndexes: Record<TKey, number> } | { exist: false; missingColumns: TKey[] };

export function resolveExcelColumnIndexes<TKey extends string>(
  headerRow: ExcelRow,
  requiredColumns: Record<TKey, readonly string[]>,
): ExcelColumnResolution<TKey> {
  const headerIndexes = new Map<string, number>();

  headerRow.forEach((cell, index) => {
    if (typeof cell === "string" && cell.trim()) {
      const headerValue = cell.trim().toLowerCase();
      headerIndexes.set(headerValue, index);
    }
  });

  const columnIndexes = {} as Record<TKey, number>;
  const missingColumns: TKey[] = [];

  for (const key of Object.keys(requiredColumns) as TKey[]) {
    const columnIndex = requiredColumns[key].map((alias) => headerIndexes.get(alias.trim().toLowerCase())).find((index) => index !== undefined);

    if (columnIndex === undefined) {
      missingColumns.push(key);
    } else {
      columnIndexes[key] = columnIndex;
    }
  }

  if (missingColumns.length > 0) {
    return { exist: false, missingColumns };
  }

  return { exist: true, columnIndexes };
}

export async function readExcelSheet(file: File, options?: { sheet?: string | number }): Promise<ExcelSheetRows> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    return await readSheet(buffer, options?.sheet);
  } catch (error) {
    throw new ExcelReadError("Gagal membaca file Excel! Pastikan file berformat .xlsx dan tidak rusak.", { cause: error });
  }
}

export function normalizeExcelCellValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

export function parseExcelDate(value: unknown): Date | null {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(EXCEL_SERIAL_DATE_EPOCH_UTC + Math.round(value) * MILLISECONDS_PER_DAY);

    if (Number.isNaN(date.getTime())) return null;

    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    for (const dateFormat of SUPPORTED_EXCEL_DATE_FORMATS) {
      const parsedDate = parse(trimmed, dateFormat, new Date());

      if (isValid(parsedDate)) {
        return new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
      }
    }
  }

  return null;
}

export function getFilledExcelRows(rows: ExcelRow[], options?: { startRowNumber?: number }): ExcelDataRow[] {
  const startRowNumber = options?.startRowNumber ?? 1;

  const formattedCells = rows.map((cells, index) => ({ cells, rowNumber: startRowNumber + index }));

  return formattedCells.filter(({ cells }) => cells.some((cell) => normalizeExcelCellValue(cell) !== ""));
}

// Excel Write Utilities
const XLSX_DATE_FORMAT = "dd/mm/yyyy";
const XLSX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const cellBorder = { borderColor: "#d4d4d8", borderStyle: "thin" as const };

type ExcelCellValue = string | number | boolean | Date | null | undefined;

export interface ExcelColumn<TRow> {
  header: string;
  width?: number;
  wrap?: boolean;
  align?: "left" | "center" | "right";
  value: (row: TRow) => ExcelCellValue;
}

export interface ExcelSheetData {
  data: WriteSheetData;
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
      alignVertical: "top",
      ...cellBorder,
      ...(column.wrap && { wrap: true }),
    };
  }

  if (value instanceof Date) {
    return {
      value,
      type: Date,
      format: XLSX_DATE_FORMAT,
      alignVertical: "top",
      ...cellBorder,
      ...(column.align && { align: column.align }),
    };
  }

  return {
    value,
    alignVertical: "top",
    ...cellBorder,
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
