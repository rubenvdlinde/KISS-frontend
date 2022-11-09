export function formatDateOnly(date: Date) {
  return date.toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTimeOnly(date: Date) {
  return date.toLocaleString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateAndTime(date: Date) {
  return date.toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
}
