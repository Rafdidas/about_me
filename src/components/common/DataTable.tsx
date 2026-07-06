"use client";

import { adminStatusLabels, paymentTypeLabels, type AdminDeviceRow } from "@/data/adminMock";
import type { AdminSort, AdminSortKey } from "@/lib/adminTable";
import { Badge } from "./Badge";

type DataTableProps = {
  rows: AdminDeviceRow[];
  sort: AdminSort;
  onSort: (key: AdminSortKey) => void;
};

const columns: { key: AdminSortKey; label: string }[] = [
  { key: "storeName", label: "매장명" },
  { key: "terminalId", label: "단말기 ID" },
  { key: "status", label: "상태" },
  { key: "lastSyncedAt", label: "마지막 동기화" }
];

const toneByStatus = {
  active: "success",
  pending: "warning",
  blocked: "danger"
} as const;

export function DataTable({ rows, sort, onSort }: DataTableProps) {
  return (
    <div className="c-table-wrap">
      <table className="c-table">
        <caption>매장 결제 환경 목록</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" aria-sort={sort.key === column.key ? sort.direction === "asc" ? "ascending" : "descending" : "none"}>
                <button type="button" onClick={() => onSort(column.key)}>
                  {column.label}
                  <span aria-hidden="true">{sort.key === column.key ? (sort.direction === "asc" ? " ↑" : " ↓") : ""}</span>
                </button>
              </th>
            ))}
            <th scope="col">결제 방식</th>
            <th scope="col">담당</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td data-label="매장명">{row.storeName}</td>
              <td data-label="단말기 ID">{row.terminalId}</td>
              <td data-label="상태">
                <Badge tone={toneByStatus[row.status]}>{adminStatusLabels[row.status]}</Badge>
              </td>
              <td data-label="마지막 동기화">{row.lastSyncedAt}</td>
              <td data-label="결제 방식">{paymentTypeLabels[row.paymentType]}</td>
              <td data-label="담당">{row.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
