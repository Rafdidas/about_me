export const colors = [
  { name: "Primary", value: "#2563eb", role: "주요 액션, 링크, 선택 상태" },
  { name: "Text", value: "#0f172a", role: "제목과 핵심 본문" },
  { name: "Muted", value: "#64748b", role: "보조 설명, 메타 정보" },
  { name: "Surface", value: "#f8fafc", role: "섹션 배경, 비활성 표면" },
  { name: "Border", value: "#e2e8f0", role: "구분선, 입력 경계" },
  { name: "Success", value: "#16a34a", role: "정상, 완료 상태" },
  { name: "Warning", value: "#f59e0b", role: "확인 필요, 대기 상태" },
  { name: "Danger", value: "#dc2626", role: "오류, 차단, 위험 액션" }
];

export const typography = [
  { name: "Display", size: "48px", weight: "700", usage: "Home hero" },
  { name: "Section", size: "32px", weight: "700", usage: "페이지 주요 섹션" },
  { name: "Heading", size: "22px", weight: "700", usage: "카드와 컴포넌트 제목" },
  { name: "Body", size: "16px", weight: "400", usage: "본문 설명" },
  { name: "Caption", size: "13px", weight: "500", usage: "테이블 보조 정보" }
];

export const spacing = ["4px", "8px", "12px", "16px", "24px", "32px", "48px", "64px", "96px"];

export const radii = [
  { name: "Small", value: "6px" },
  { name: "Medium", value: "10px" },
  { name: "Large", value: "16px" }
];

export const componentDocs = [
  {
    title: "Button",
    description: "주요 액션과 보조 액션을 구분하고, loading 상태에서 너비가 흔들리지 않게 유지합니다.",
    accessibility: "button 태그를 사용하고, disabled와 aria-busy를 상태에 맞게 제공합니다.",
    code: '<Button variant="primary" isLoading>저장 중</Button>'
  },
  {
    title: "Input",
    description: "label, help text, error message를 연결해 입력 목적과 오류를 명확히 전달합니다.",
    accessibility: "id/htmlFor와 aria-describedby로 레이블과 에러 메시지를 연결합니다.",
    code: '<Input id="store" label="매장명" error="매장명을 입력해주세요." />'
  },
  {
    title: "Select",
    description: "상태 필터처럼 선택지가 제한된 값을 다룰 때 사용합니다.",
    accessibility: "label과 select를 연결하고 키보드 기본 동작을 유지합니다.",
    code: '<Select label="상태" options={statusOptions} />'
  },
  {
    title: "Badge",
    description: "상태를 색상만으로 전달하지 않고 텍스트를 함께 표시합니다.",
    accessibility: "상태명 자체가 보조 기술에 읽히도록 숨김 텍스트에 의존하지 않습니다.",
    code: '<Badge tone="success">정상</Badge>'
  },
  {
    title: "Table",
    description: "정렬 가능한 헤더, 상태 배지, 모바일 카드형 전환을 포함합니다.",
    accessibility: "caption과 scope를 제공하고 정렬 버튼은 aria-sort 맥락을 유지합니다.",
    code: "<DataTable rows={rows} sort={sort} onSort={setSort} />"
  },
  {
    title: "Pagination",
    description: "현재 페이지와 전체 페이지를 명확히 보여주고 이전/다음 이동을 제공합니다.",
    accessibility: "nav aria-label과 현재 페이지 aria-current를 제공합니다.",
    code: '<Pagination currentPage={1} totalPages={5} onChange={setPage} />'
  }
];
