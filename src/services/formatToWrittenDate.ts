import { DateTime } from "luxon";

export const formatToWrittenDate = (date: string): string => {
  return DateTime.fromSQL(date).toFormat("dd MMM yyyy").toLocaleLowerCase("nl");
};
