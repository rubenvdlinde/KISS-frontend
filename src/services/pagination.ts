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
