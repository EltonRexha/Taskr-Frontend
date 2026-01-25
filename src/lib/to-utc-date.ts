import { parse } from "date-fns";

export function toUtcDate(dateStr: string) {
  const date = parse(dateStr, "yyyy-MM-dd", new Date());
  return date.toISOString();
}