import { DateTime } from "luxon";

export const formatDate = (date: string): string => {
  return DateTime.fromSQL(date).toFormat("dd MMM yyyy").toLocaleLowerCase("nl");
};
