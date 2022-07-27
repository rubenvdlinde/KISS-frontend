import type { Paginated } from "./pagination";

export function parsePagination<T>(
  json: any,
  map: (jObj: any) => T
): Paginated<T> {
  const { results, limit, total, page, pages } = json;
  if (!Array.isArray(results))
    throw new Error("expected an array: " + JSON.stringify(results));
  return {
    page: results.map(map),
    pageNumber: page,
    pageSize: limit,
    totalPages: pages,
    totalRecords: total,
  };
}
