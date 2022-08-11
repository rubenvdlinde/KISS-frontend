import type { Paginated } from "./pagination";

export async function parsePagination<T>(
  json: unknown,
  map: (jObj: unknown) => T
): Promise<Paginated<Awaited<T>>> {
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
    throw new Error(
      "unexpected in gateway json. expected pagination: " + JSON.stringify(json)
    );

  // just in case the mapper is async, we wrap the result in a Promise
  const promises = results.map((x) => Promise.resolve(map(x)));

  return {
    page: await Promise.all(promises),
    pageNumber: page,
    pageSize: limit,
    totalPages: pages,
    totalRecords: total,
  };
}

export function throwIfGatewayError(json: any) {
  const message = json?.message;
  if (typeof message === "string" && message.includes("error")) {
    throw new Error(
      message +
        ", " +
        JSON.stringify({
          path: json.path,
          data: json.data,
        })
    );
  }
  return json;
}
