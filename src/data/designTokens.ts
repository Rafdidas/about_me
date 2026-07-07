export const colors = [
  { name: "Primary", value: "#2563eb", role: "주요 액션, 링크, 선택 상태" },
  { name: "Text", value: "#0f172a", role: "제목과 본문 텍스트" },
  { name: "Muted", value: "#64748b", role: "보조 설명, 메타 정보" },
  { name: "Surface", value: "#f8fafc", role: "섹션 배경, 비활성 표면" },
  { name: "Border", value: "#e2e8f0", role: "구분선, 입력 경계" },
  { name: "Success", value: "#16a34a", role: "정상, 완료 상태" },
  { name: "Warning", value: "#f59e0b", role: "확인 필요, 대기 상태" },
  { name: "Danger", value: "#dc2626", role: "오류, 차단, 위험 액션" }
];

export const typography = [
  { name: "Display", size: "48px", weight: "700", usage: "메인 히어로" },
  { name: "Section", size: "32px", weight: "700", usage: "주요 섹션 제목" },
  { name: "Heading", size: "22px", weight: "700", usage: "카드 및 컴포넌트 제목" },
  { name: "Body", size: "16px", weight: "400", usage: "본문 설명" },
  { name: "Caption", size: "13px", weight: "500", usage: "테이블 보조 정보" }
];

export const spacing = ["4px", "8px", "12px", "16px", "24px", "32px", "48px", "64px", "96px"];

export const radii = [
  { name: "Small", value: "6px" },
  { name: "Medium", value: "10px" },
  { name: "Large", value: "16px" }
];

export const designSystemOverview = {
  description:
    "색상·타이포그래피·간격·상태 UI가 실제 화면에서 어떻게 사용되는지 포트폴리오용 예시로 재구성했습니다.",
  bridge:
    "정해진 디자인 기준을 화면에 적용하고, 반복되는 UI 요소를 구현 관점에서 정리한 경험을 보여주기 위한 페이지입니다."
};

export const designTokensSection = {
  title: "Design Tokens",
  description:
    "색상 토큰은 실제 업무에서 자주 사용하는 역할을 기준으로 예시화했습니다."
};

export const componentsSection = {
  title: "Components",
  description: "버튼, 입력 폼, 배지, 테이블, 페이지네이션처럼 업무 화면에서 반복되는 UI를 상태별로 정리했습니다."
};

export const adminTableBridge = {
  description:
    "컴포넌트를 조합해 데이터 중심 업무 화면에서 필요한 필터, 상태 배지, 테이블, 페이지네이션 흐름을 구성했습니다. 실무에서 다루던 목록·조회 화면 구조를 포트폴리오용 예시로 재구성한 화면입니다.",
  caseStudyHref: "/case-studies#b2b-admin-ui",
  caseStudyLabel: "B2B 업무 시스템 Case 보기"
};

export const componentDocs = [
  {
    title: "Button",
    description: "주요 액션과 보조 액션을 구분하고, loading·disabled 상태에서도 사용자가 현재 상태를 이해할 수 있도록 구성했습니다.",
    accessibility: "button 태그를 기본으로 사용하고, disabled와 aria-busy를 상태에 맞게 적용합니다.",
    code: '<Button variant="primary" isLoading>저장</Button>'
  },
  {
    title: "Input",
    description: "label, 도움말, 에러 메시지를 입력 필드와 연결해 입력 목적과 오류 상태를 명확히 전달합니다.",
    accessibility: "id/htmlFor와 aria-describedby로 레이블과 에러 메시지를 연결합니다.",
    code: '<Input id="store" label="매장명" error="매장명을 입력해주세요." />'
  },
  {
    title: "Select",
    description: "상태 필터처럼 선택 가능한 값이 정해져 있는 경우 사용합니다.",
    accessibility: "label을 연결하고, 기본 select 요소를 사용해 키보드 조작 흐름을 유지합니다.",
    code: '<Select label="상태" options={statusOptions} />'
  },
  {
    title: "Badge",
    description: "상태를 색상만으로 전달하지 않고 텍스트를 함께 표시합니다.",
    accessibility: "색상 차이를 인지하기 어려운 환경에서도 상태를 이해할 수 있도록 텍스트를 함께 제공합니다.",
    code: '<Badge tone="success">정상</Badge>'
  },
  {
    title: "Table",
    description: "데이터 목록의 컬럼 기준, 상태 배지, 모바일 카드형 전환을 함께 고려합니다.",
    accessibility: "caption과 scope를 제공하고, 정렬 버튼에는 aria-sort 상태를 연결합니다.",
    code: "<DataTable rows={rows} sort={sort} onSort={setSort} />"
  },
  {
    title: "Pagination",
    description: "현재 페이지와 전체 페이지를 명확히 보여주고, 이전·다음 이동 흐름을 제공합니다.",
    accessibility: "nav aria-label과 현재 페이지 aria-current를 제공합니다.",
    code: '<Pagination currentPage={1} totalPages={5} onChange={setPage} />'
  }
];
