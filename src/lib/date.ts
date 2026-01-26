import { parse, format, subWeeks, startOfWeek, endOfWeek } from "date-fns";

/**
 * Normalizes a date string into a date-only format (`YYYY-MM-DD`).
 *
 * This function intentionally strips any time and timezone information.
 * Useful for form inputs, API payloads, and database fields that store
 * date-only values.
 *
 * @param dateStr - A date string in `YYYY-MM-DD` format.
 * @returns A normalized date-only string in `YYYY-MM-DD` format.
 */
export function formatDateOnly(dateStr: string): string {
  const date = parse(dateStr, "yyyy-MM-dd", new Date());
  return format(date, "yyyy-MM-dd");
}

/**
 * Returns the start and end dates of a given week relative to today in `YYYY-MM-DD` format.
 *
 * The week is assumed to start on Monday and end on Sunday (`weekStartsOn: 1`).
 * Time and timezone information are intentionally stripped, making this function
 * suitable for date-only use cases such as analytics ranges, filters, API queries,
 * and database lookups.
 *
 * @param subWeeksCount - How many weeks to go back:
 *   - 0 = this week
 *   - 1 = last week
 *   - 2 = 2 weeks ago, etc.
 * @returns An object containing:
 * - `startDate`: The start date of the selected week (`YYYY-MM-DD`)
 * - `endDate`: The end date of the selected week (`YYYY-MM-DD`)
 */
export const getWeekRange = (
  subWeeksCount = 0,
): { startDate: string; endDate: string } => {
  const base = subWeeks(new Date(), subWeeksCount);

  return {
    startDate: format(startOfWeek(base, { weekStartsOn: 1 }), "yyyy-MM-dd"),
    endDate: format(endOfWeek(base, { weekStartsOn: 1 }), "yyyy-MM-dd"),
  };
};
