import type { Paginated } from "./pagination";

export function parsePagination<T>(
  map: (jObj: unknown) => T
): (json: unknown) => Promise<Paginated<Awaited<T>>> {
  return async (json) => {
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

    const promises = results.map((x) => Promise.resolve(map(x)));

    return {
      page: await Promise.all(promises),
      pageNumber: page,
      pageSize: limit,
      totalPages: pages,
      totalRecords: total,
    };
  };
}
