import { uiCopy } from "@/data/site";
import type { Period } from "@/data/types";

export function formatPeriod(period: Period | string): string {
  if (typeof period === "string") return period;
  return `${period.start} – ${period.end ?? uiCopy.currentPosition}`;
}
