export interface Paginated<T> {
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  totalRecords?: number;
  page: T[];
}

export function defaultPagination<T>(page: T[]): Paginated<T> {
  return {
    page,
    pageNumber: 1,
    totalPages: 1,
    totalRecords: page.length,
    pageSize: page.length,
  };
}

export function enforceOneOrZero<T>(paginated: Paginated<T>): T | undefined {
  if (paginated.page.length === 0) return undefined;
  if (paginated.page.length === 1) return paginated.page[0];
  throw new Error(
    "expected a single result, instead found " + paginated.page.length
  );
}
