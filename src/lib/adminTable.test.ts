import { describe, expect, it } from "vitest";
import { filterAdminRows, paginateRows, sortAdminRows } from "./adminTable";
import type { AdminDeviceRow } from "@/data/adminMock";

const rows: AdminDeviceRow[] = [
  {
    id: "A-001",
    storeName: "성수 플래그십",
    terminalId: "TM-1001",
    status: "active",
    paymentType: "card",
    lastSyncedAt: "2026-07-06 09:20",
    owner: "운영팀"
  },
  {
    id: "A-002",
    storeName: "판교 테스트랩",
    terminalId: "TM-1002",
    status: "pending",
    paymentType: "qr",
    lastSyncedAt: "2026-07-05 18:10",
    owner: "QA팀"
  },
  {
    id: "A-003",
    storeName: "부산 물류센터",
    terminalId: "TM-1003",
    status: "blocked",
    paymentType: "card",
    lastSyncedAt: "2026-07-04 12:30",
    owner: "지원팀"
  }
];

describe("admin table helpers", () => {
  it("filters rows by search keyword and status", () => {
    expect(filterAdminRows(rows, { query: "판교", status: "pending" })).toEqual([rows[1]]);
  });

  it("sorts rows by store name in descending order", () => {
    expect(sortAdminRows(rows, { key: "storeName", direction: "desc" }).map((row) => row.storeName)).toEqual([
      "판교 테스트랩",
      "성수 플래그십",
      "부산 물류센터"
    ]);
  });

  it("paginates rows with total page metadata", () => {
    expect(paginateRows(rows, { page: 2, pageSize: 2 })).toEqual({
      rows: [rows[2]],
      totalPages: 2,
      currentPage: 2
    });
  });
});
