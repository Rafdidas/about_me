export const projects = [
  {
    slug: "money-book",
    name: "money_book",
    summary: "개인 가계부를 실사용 흐름으로 정리한 TypeScript + SCSS 기반 프로젝트입니다.",
    stack: ["TypeScript", "SCSS", "Supabase"],
    uiPoints: ["수입·지출 입력 흐름", "월별 요약과 빈 상태 처리", "실서비스 배포 경험"],
    techPoints: ["Supabase RLS 기반 데이터 보호", "문제-해결형 README", "도메인 배포 운영"],
    githubUrl: "https://github.com/rafdidas/money_book",
    demoUrl: "https://monibuk.com"
  },
  {
    slug: "poke-dex-next",
    name: "poke_dex_next",
    summary: "Next.js App Router 기반 포켓몬 탐색 UI로 상태 관리와 리스트 경험을 정리했습니다.",
    stack: ["Next.js", "React Query", "Zustand"],
    uiPoints: ["검색·필터 중심 탐색", "상세 화면 전환", "모바일 대응"],
    techPoints: ["Next.js 15 App Router", "React Query 캐싱", "Zustand 상태 관리"],
    githubUrl: "https://github.com/rafdidas/poke_dex_next",
    demoUrl: ""
  },
  {
    slug: "tmdb-ai-reco",
    name: "tmdb-ai-reco",
    summary: "AI 추천 응답을 JSON Schema로 제한하고 TMDB 데이터로 재검증하는 추천 UI입니다.",
    stack: ["AI", "TMDB", "Schema"],
    uiPoints: ["추천 결과 카드", "로딩·에러 상태", "검증된 결과만 노출"],
    techPoints: ["JSON Schema 응답 통제", "외부 API 재검증", "AI 초안 검증 워크플로우"],
    githubUrl: "https://github.com/rafdidas/tmdb-ai-reco",
    demoUrl: ""
  }
];
