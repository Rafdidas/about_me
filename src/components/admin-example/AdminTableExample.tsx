"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Input } from "@/components/common/Input";
import { Pagination } from "@/components/common/Pagination";
import { Select } from "@/components/common/Select";
import { Skeleton } from "@/components/common/Skeleton";
import { adminRows, adminTableCopy, type AdminStatus } from "@/data/adminMock";
import { filterAdminRows, paginateRows, sortAdminRows, type AdminSort, type AdminSortKey } from "@/lib/adminTable";

type ViewMode = "data" | "loading" | "empty" | "error";

const pageSize = 4;

export function AdminTableExample() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AdminStatus | "all">("all");
  const [mode, setMode] = useState<ViewMode>("data");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<AdminSort>({ key: "storeName", direction: "asc" });

  const filteredRows = useMemo(() => filterAdminRows(adminRows, { query, status }), [query, status]);
  const sortedRows = useMemo(() => sortAdminRows(filteredRows, sort), [filteredRows, sort]);
  const paginated = useMemo(() => paginateRows(sortedRows, { page, pageSize }), [sortedRows, page]);

  function handleSort(key: AdminSortKey) {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
    }));
  }

  function handleStatus(nextStatus: string) {
    setStatus(nextStatus as AdminStatus | "all");
    setPage(1);
  }

  return (
    <div className="p-admin-example">
      <div className="p-admin-example__header">
        <div>
          <h3>{adminTableCopy.title}</h3>
          <p>{adminTableCopy.description}</p>
        </div>
      </div>
      <div className="p-admin-example__toolbar">
        <Input id="admin-search" label={adminTableCopy.searchLabel} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 성수, TM-1001" />
        <Select
          id="admin-status"
          label={adminTableCopy.statusLabel}
          value={status}
          onChange={(event) => handleStatus(event.target.value)}
          options={[
            { value: "all", label: "전체" },
            { value: "active", label: "정상" },
            { value: "pending", label: "확인 필요" },
            { value: "blocked", label: "차단" }
          ]}
        />
        <Select
          id="admin-mode"
          label={adminTableCopy.modeLabel}
          value={mode}
          onChange={(event) => setMode(event.target.value as ViewMode)}
          options={[
            { value: "data", label: "데이터" },
            { value: "loading", label: "로딩" },
            { value: "empty", label: "빈 상태" },
            { value: "error", label: "에러" }
          ]}
        />
      </div>
      {mode === "loading" ? <Skeleton lines={5} /> : null}
      {mode === "empty" ? (
        <EmptyState
          title={adminTableCopy.emptyTitle}
          description={adminTableCopy.emptyDescription}
          actionLabel={adminTableCopy.emptyActionLabel}
          onAction={() => {
            setQuery("");
            handleStatus("all");
          }}
        />
      ) : null}
      {mode === "error" ? (
        <ErrorState
          title={adminTableCopy.errorTitle}
          description={adminTableCopy.errorDescription}
          actionLabel={adminTableCopy.errorActionLabel}
          onAction={() => setMode("data")}
        />
      ) : null}
      {mode === "data" ? (
        <>
          {paginated.rows.length > 0 ? (
            <DataTable rows={paginated.rows} sort={sort} onSort={handleSort} />
          ) : (
            <EmptyState title={adminTableCopy.emptyTitle} description={adminTableCopy.emptyDescription} />
          )}
          <Pagination currentPage={paginated.currentPage} totalPages={paginated.totalPages} onChange={setPage} />
        </>
      ) : null}
    </div>
  );
}
