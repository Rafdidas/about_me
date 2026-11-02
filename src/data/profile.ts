import type { Profile } from "./types";

export const profile: Profile = {
  name: "박현규",
  role: "Full-stack Developer",
  headline: "화면부터 서버까지, 업무 흐름을 구현하는 개발자입니다.",
  intro:
    "이커머스·B2B 서비스에서 6년 이상 PC·모바일 화면을 구축·운영했습니다. 웹 퍼블리셔로 시작해 현재는 React·Next.js·Angular 기반 업무 화면과 Java·Spring·MySQL 기반 백엔드 기능을 개발하고 연동합니다. 개인 프로젝트에서는 AI와 협업해 가계부를 배포·운영하고, 학습 앱에 서버 데이터 관리·입력 검증·인증 흐름을 구현했습니다.",
  email: "yhu930421@naver.com",
  github: "https://github.com/rafdidas",
  competencies: [
    {
      label: "업무 기능 개발",
      text: "React·Next.js·Angular 기반 업무 화면과 공통 컴포넌트 구현, Java·Spring·MySQL 기반 백엔드 기능 개발 및 화면과 서버 간 데이터 연동"
    },
    {
      label: "공통 UI·모바일 개선",
      text: "색상·타이포그래피 기준과 공통 컴포넌트 정비, 모바일 탭 전환용 useSwipeTab 훅 개발과 제스처 충돌·오클릭 방지, 데이터 그리드의 스크롤·레이아웃 개선"
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
