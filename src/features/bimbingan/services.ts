import "server-only";

import { formatDateToISODateString, formatTimeToHHmm, isNotPastDate, isNotPastTime } from "./utils";

export function checkIsJadwalBimbinganHasPassed(data: { date: Date; startTime: Date }) {
  const jadwalDate = formatDateToISODateString(data.date);
  const jadwalStartTime = formatTimeToHHmm(data.startTime);
  return !isNotPastDate(jadwalDate) || !isNotPastTime(jadwalDate, jadwalStartTime);
}
