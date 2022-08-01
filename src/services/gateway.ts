import type { Paginated } from "./pagination";

export function parsePagination<T>(
  json: unknown,
  map: (jObj: unknown) => T
): Paginated<T> {
  const { results, limit, total, page, pages } = json as {
    [key: string]: unknown;
  };
  if (
    !Array.isArray(results) ||
    typeof limit !== "number" ||
    typeof total !== "number" ||
    typeof page !== "number" ||
    typeof pages !== "number"
  )
    throw new Error("unexpected json: " + JSON.stringify(json));
  return {
    page: results.map(map),
    pageNumber: page,
    pageSize: limit,
    totalPages: pages,
    totalRecords: total,
  };
}

export async function parsePaginationAsync<T>(
  json: unknown,
  map: (jObj: unknown) => Promise<T>
) {
  const parsed = parsePagination(json, map);
  const page = await Promise.all(parsed.page);
  return {
    ...parsed,
    page,
  };
}
