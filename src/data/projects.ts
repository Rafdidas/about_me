import moneyBookScreenshot from "@/assets/monibuk.jpg";
import pokeDexScreenshot from "@/assets/pokedex.jpg";
import tmdbScreenshot from "@/assets/tmdb.jpg";

export const projectsEyebrow = "Personal projects · UI flow · Operation";
export const projectsSectionEyebrow = "Curated GitHub Projects";

export const projectsIntro =
  "개인 프로젝트의 사용 흐름과 개발 경험을 정리했습니다. 모니북은 AI를 활용해 개발하고 실제 서비스로 운영하고 있습니다.";

export const projects = [
  {
    slug: "money-book",
    name: "money_book",
    displayName: "모니북",
    status: "운영 중",
    developmentMethod: "AI 활용 개발",
    summary: "AI를 활용해 개발하고 실제 운영하는 개인 가계부 서비스입니다.",
    stack: ["TypeScript", "SCSS", "Supabase"],
    uiPoints: ["수입·지출 입력 흐름", "월별 요약과 빈 상태 처리", "개인 가계부 사용 흐름 설계"],
    techPoints: ["도메인 배포 운영", "AI 활용 개발", "프로젝트 README 정리"],
    githubUrl: "https://github.com/rafdidas/money_book",
    demoUrl: "https://monibuk.com",
    screenshot: {
      src: moneyBookScreenshot,
      alt: "모니북 가계부 서비스 데스크톱 화면"
    }
  },
  {
    slug: "poke-dex-next",
    name: "poke_dex_next",
    displayName: "Pokédex",
    summary: "검색, 필터, 상세 화면 전환을 중심으로 포켓몬 탐색 경험을 구성한 Next.js 프로젝트입니다.",
    stack: ["Next.js", "React Query", "Zustand"],
    uiPoints: ["검색·필터 중심 탐색", "상세 화면 전환", "모바일 대응"],
    techPoints: ["Next.js 15 App Router", "React Query 캐싱", "Zustand 상태 관리"],
    githubUrl: "https://github.com/rafdidas/poke_dex_next",
    demoUrl: "https://poke-dex-next.vercel.app",
    screenshot: {
      src: pokeDexScreenshot,
      alt: "poke_dex_next 프로젝트 데스크톱 화면"
    }
  },
  {
    slug: "tmdb-ai-reco",
    name: "tmdb-ai-reco",
    displayName: "TMDB AI Reco",
    summary: "AI 추천 결과를 구조화하고 TMDB 데이터로 검증해 사용자에게 신뢰 가능한 추천 결과를 보여주는 프로젝트입니다.",
    stack: ["AI", "TMDB", "Schema"],
    uiPoints: ["추천 결과 카드", "로딩·에러 상태", "검증된 결과만 노출"],
    techPoints: ["JSON Schema 응답 통제", "외부 API 재검증", "AI 초안 검증 워크플로우"],
    githubUrl: "https://github.com/rafdidas/tmdb-ai-reco",
    demoUrl: "https://tmdb-ai-reco.vercel.app",
    screenshot: {
      src: tmdbScreenshot,
      alt: "tmdb-ai-reco 프로젝트 데스크톱 화면"
    }
  }
];
