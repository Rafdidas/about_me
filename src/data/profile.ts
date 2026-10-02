import type { Profile } from "./types";

export const profile: Profile = {
  name: "박현규",
  role: "Frontend · UI Engineer",
  headline: "이커머스·B2B 서비스의 PC·모바일 UI를 6년 이상 구축·운영했습니다.",
  intro:
    "현재 React·Next.js·Angular 기반 업무 시스템에서 공통 레이아웃·컴포넌트 구현과 기존 화면의 스타일 개선을 담당합니다. 개인 프로젝트에서는 가계부를 배포·운영하고, React 앱에 서버 데이터 관리·입력 검증·인증 흐름을 구현했습니다.",
  email: "yhu930421@naver.com",
  github: "https://github.com/rafdidas",
  competencies: [
    {
      label: "업무 화면 구현",
      text: "React·Next.js·Angular 환경에서 내비게이션·공통 레이아웃·목록·조회·상세·대시보드 UI 구현"
    },
    {
      label: "운영 화면 개선",
      text: "CRM 색상 값을 CSS 변수로 통합하고 타이포그래피·모바일 스타일을 단계적으로 적용, 기존 선택자와의 충돌을 실제 화면에서 검수·수정"
    },
    {
      label: "구축부터 운영까지",
      text: "이커머스 신규 오픈·리뉴얼·장기 유지보수, 반응형·브라우저 호환성 검수와 UI 동작 오류 대응"
    },
    {
      label: "개인 서비스 개발",
      text: "AI 코딩 도구를 활용해 인증·데모·분석 기능을 갖춘 가계부 운영, 학습 앱의 서버 데이터·URL·로컬 상태 분리와 JSON 입력 검증 구현"
    }
  ]
};
