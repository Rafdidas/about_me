import type { AdminDeviceRow, AdminStatus } from "@/data/adminMock";

export type AdminSortKey = keyof Pick<AdminDeviceRow, "storeName" | "terminalId" | "status" | "lastSyncedAt">;
export type SortDirection = "asc" | "desc";

export type AdminFilters = {
  query: string;
  status: AdminStatus | "all";
};

export type AdminSort = {
  key: AdminSortKey;
  direction: SortDirection;
};

export type PaginationInput = {
  page: number;
  pageSize: number;
};

export function filterAdminRows(rows: AdminDeviceRow[], filters: AdminFilters) {
  const query = filters.query.trim().toLocaleLowerCase("ko-KR");

  return rows.filter((row) => {
    const matchesStatus = filters.status === "all" || row.status === filters.status;
    const matchesQuery =
      query.length === 0 ||
      row.storeName.toLocaleLowerCase("ko-KR").includes(query) ||
      row.terminalId.toLocaleLowerCase("ko-KR").includes(query) ||
      row.owner.toLocaleLowerCase("ko-KR").includes(query);

    return matchesStatus && matchesQuery;
  });
}

export function sortAdminRows(rows: AdminDeviceRow[], sort: AdminSort) {
  return [...rows].sort((a, b) => {
    const left = a[sort.key];
    const right = b[sort.key];
    const result = left.localeCompare(right, "ko-KR", { numeric: true });

    return sort.direction === "asc" ? result : -result;
  });
}

export function paginateRows<T>(rows: T[], pagination: PaginationInput) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pagination.pageSize));
  const currentPage = Math.min(Math.max(1, pagination.page), totalPages);
  const start = (currentPage - 1) * pagination.pageSize;

  return {
    rows: rows.slice(start, start + pagination.pageSize),
    totalPages,
    currentPage
  };
}
