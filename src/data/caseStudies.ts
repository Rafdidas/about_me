export const caseStudiesEyebrow = "Problem · Role · Action · Result";
export const caseStudiesSectionEyebrow = "Selected Work";

export const caseStudiesIntro =
  "실무에서 맡은 범위와 구현한 내용을 정리했습니다.";

export const caseStudiesDisclosure =
  "업무 시스템의 실제 화면과 내부 자료는 공개하지 않습니다. 아래 사례는 담당 업무와 구현 과정 중심으로 정리했으며, 연결된 UI 예시는 별도로 제작한 포트폴리오용 예시입니다.";

export const caseStudies = [
  {
    id: "weseed-design-system",
    title: "WeSeed CRM 공통 UI 구현과 디자인 기준 적용",
    category: "Design System",
    period: "2025 - Present",
    sections: [
      {
        label: "업무 배경",
        body: "WeSeed CRM과 B2B 업무 화면이 확장되면서 색상, 타이포그래피, 모바일 스타일, 공통 컴포넌트의 일관성 관리가 필요했습니다."
      },
      {
        label: "담당 범위",
        body: "버튼, 테이블, 모달, 오토컴플리트 등 반복되는 UI를 구현하고, 디자이너가 정의한 상태별 디자인을 화면에 적용했습니다."
      },
      {
        label: "구현 내용",
        body: "색상·타이포그래피·모바일 스타일 기준을 맞추고, loading·disabled·error 상태를 props로 제어할 수 있도록 구현했습니다."
      }
    ]
  },
  {
    id: "b2b-admin-ui",
    title: "React·Next.js 기반 B2B 업무 화면 구현",
    category: "Admin UI",
    period: "2025 - Present",
    sections: [
      {
        label: "업무 배경",
        body: "LH 레미콘스마트관리시스템, 현대 CSM, SZ 레미콘 스마트 관리 플랫폼 등 건설 SI 프로젝트에서 로그인, GNB, LNB, 목록, 조회, 대시보드, 테이블, 페이지네이션 등 반복 화면 구조가 필요했습니다."
      },
      {
        label: "담당 범위",
        body: "React·Next.js 기반 프로젝트에서 주요 시스템 UI 구조와 PC·모바일 화면 퍼블리싱을 담당했습니다."
      },
      {
        label: "구현 내용",
        body: "타설관리, 관제정보, 대시보드, 현장관리, 비용관리, 업체선정 등 데이터 중심 업무 화면을 구현했습니다. 로그인, GNB, LNB, 목록, 조회, 테이블, 페이지네이션 등 반복되는 화면 구조도 함께 구현했습니다."
      }
    ]
  }
];
