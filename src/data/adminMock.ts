export type AdminStatus = "active" | "pending" | "blocked";
export type PaymentType = "card" | "qr" | "mixed";

export type AdminDeviceRow = {
  id: string;
  storeName: string;
  terminalId: string;
  status: AdminStatus;
  paymentType: PaymentType;
  lastSyncedAt: string;
  owner: string;
};

export const adminStatusLabels: Record<AdminStatus, string> = {
  active: "정상",
  pending: "확인 필요",
  blocked: "차단"
};

export const paymentTypeLabels: Record<PaymentType, string> = {
  card: "카드",
  qr: "QR",
  mixed: "카드+QR"
};

export const adminTableCopy = {
  title: "가상 매장 결제 현황 예시",
  description:
    "가상 데이터를 사용한 포트폴리오용 예시입니다. 검색, 상태 필터, 정렬, 페이지네이션과 loading·empty·error 상태를 확인할 수 있습니다.",
  searchLabel: "매장 또는 단말기 검색",
  statusLabel: "운영 상태",
  modeLabel: "화면 상태",
  emptyTitle: "조건에 맞는 결과가 없어요",
  emptyDescription: "검색어를 줄이거나 상태 필터를 전체로 변경해보세요.",
  emptyActionLabel: "필터 초기화",
  errorTitle: "목록을 불러오지 못했어요",
  errorDescription: "네트워크 상태를 확인한 뒤 다시 시도해주세요.",
  errorActionLabel: "다시 시도"
};

export const adminRows: AdminDeviceRow[] = [
  {
    id: "D-1001",
    storeName: "성수 플래그십",
    terminalId: "TM-1001",
    status: "active",
    paymentType: "mixed",
    lastSyncedAt: "2026-07-06 09:20",
    owner: "운영팀"
  },
  {
    id: "D-1002",
    storeName: "판교 테스트랩",
    terminalId: "TM-1002",
    status: "pending",
    paymentType: "qr",
    lastSyncedAt: "2026-07-05 18:10",
    owner: "QA팀"
  },
  {
    id: "D-1003",
    storeName: "부산 물류센터",
    terminalId: "TM-1003",
    status: "blocked",
    paymentType: "card",
    lastSyncedAt: "2026-07-04 12:30",
    owner: "지원팀"
  },
  {
    id: "D-1004",
    storeName: "강남 직영점",
    terminalId: "TM-1004",
    status: "active",
    paymentType: "card",
    lastSyncedAt: "2026-07-06 10:15",
    owner: "운영팀"
  },
  {
    id: "D-1005",
    storeName: "대전 파트너샵",
    terminalId: "TM-1005",
    status: "pending",
    paymentType: "mixed",
    lastSyncedAt: "2026-07-03 16:45",
    owner: "지원팀"
  },
  {
    id: "D-1006",
    storeName: "광주 쇼룸",
    terminalId: "TM-1006",
    status: "active",
    paymentType: "qr",
    lastSyncedAt: "2026-07-06 11:05",
    owner: "운영팀"
  }
];
