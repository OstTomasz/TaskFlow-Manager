import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Returns a relative time string (e.g. "2 days ago").
 * Falls back to "Invalid date" if input is not parseable.
 */
export const fromNow = (date: string): string => dayjs(date).fromNow();

/**
 * Returns formatted date string (e.g. "May 8, 2026").
 */
export const formatDate = (date: string): string =>
  dayjs(date).format("DD/MM/YY");
