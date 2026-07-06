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
  title: "매장 결제 환경 관리 예시",
  description:
    "실제 서비스명이 드러나지 않도록 재구성한 B2B 업무 화면입니다. 검색, 상태 필터, 정렬, 페이지네이션과 loading / empty / error 상태를 같은 컴포넌트 기준으로 확인합니다.",
  searchLabel: "매장 또는 단말기 검색",
  statusLabel: "운영 상태",
  modeLabel: "화면 상태"
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
