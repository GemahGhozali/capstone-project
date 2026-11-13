import { format } from "date-fns";
import { StatusBookingBimbingan } from "@/generated/prisma/enums";

export const bookingStatusStyles: Record<StatusBookingBimbingan, string> = {
  Dipesan: "bg-blue-500/15 text-blue-500",
  Selesai: "bg-green-500/15 text-green-500",
  Dibatalkan: "bg-red-500/15 text-red-500",
};

export function parseDateToUTC(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

export function parseTimeToUTC(time: string): Date {
  return new Date(`1970-01-01T${time.slice(0, 5)}:00.000Z`);
}

export function formatDateToISODateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatTimeToHHmm(date: Date): string {
  return date.toISOString().slice(11, 16);
}

export function getStartOfTodayUTC(): Date {
  return parseDateToUTC(format(new Date(), "yyyy-MM-dd"));
}

export function isNotPastDate(date: string): boolean {
  const now = new Date();
  const endOfDate = new Date(`${date}T23:59:59.999`);
  return endOfDate.getTime() >= now.getTime();
}

export function isNotPastTime(date: string, time: string): boolean {
  const now = new Date();
  if (date !== format(now, "yyyy-MM-dd")) return true;
  return time >= format(now, "HH:mm");
}
