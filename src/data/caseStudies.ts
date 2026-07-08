export const caseStudiesEyebrow = "Problem · Role · Action · Result";
export const caseStudiesSectionEyebrow = "Selected Work";

export const caseStudiesIntro =
  "경력기술서의 업무를 문제, 역할, 실행, 결과 흐름으로 정리했습니다. 공개할 수 없는 화면과 수치는 포트폴리오용 예시와 범위 중심 설명으로 대체했습니다.";

export const caseStudies = [
  {
    id: "weseed-design-system",
    title: "WeSeed Design System 고도화",
    category: "Design System",
    period: "2025 - Present",
    sections: [
      {
        label: "Context",
        body: "WeSeed CRM과 B2B 업무 화면이 확장되면서 색상, 타이포그래피, 모바일 스타일, 공통 컴포넌트의 일관성 관리가 필요했습니다."
      },
      {
        label: "Problem",
        body: "화면별 스타일 적용 방식이 달라 유지보수 시 수정 범위가 커질 수 있었고, 동일한 UI 요소가 화면마다 다르게 표현될 위험이 있었습니다."
      },
      {
        label: "Role",
        body: "버튼, 테이블, 모달, 오토컴플리트 등 공통 컴포넌트를 직접 구현하고, 디자이너가 정의한 상태별 디자인을 loading·disabled·error 등 props 구조로 설계해 여러 화면에서 재사용할 수 있게 만들었습니다."
      },
      {
        label: "Action",
        body: "디자인 시스템에 정의된 상태별 디자인을 컴포넌트 props로 번역해 구현하고, 색상·타이포그래피·모바일 스타일 기준을 맞췄습니다. 같은 컴포넌트를 WeSeed CRM과 건설 SI 프로젝트의 여러 업무 화면에서 재사용할 수 있도록 적용 범위와 상태 표현을 통일했습니다."
      },
      {
        label: "Result",
        body: "버튼, 테이블, 모달, 오토컴플리트 등 5종 이상의 공통 컴포넌트를 여러 화면·프로젝트에서 재사용할 수 있게 구현해 화면별 UI 편차를 줄이고, 운영 유지보수 시 같은 컴포넌트 기준으로 화면을 수정할 수 있는 기반을 마련했습니다."
      },
      {
        label: "What I Learned",
        body: "디자인 시스템은 시각 요소 통일이 아니라, 팀이 같은 기준으로 화면을 만들 수 있게 돕는 구조입니다."
      }
    ]
  },
  {
    id: "b2b-admin-ui",
    title: "B2B 업무 시스템 공통 UI 구조",
    category: "Admin UI",
    period: "2025 - Present",
    sections: [
      {
        label: "Context",
        body: "LH 레미콘스마트관리시스템, 현대 CSM, SZ 레미콘 스마트 관리 플랫폼 등 건설 SI 프로젝트에서 로그인, GNB, LNB, 목록, 조회, 대시보드, 테이블, 페이지네이션 등 반복 화면 구조가 필요했습니다."
      },
      {
        label: "Problem",
        body: "데이터 중심 업무 화면은 단순한 화면 배치보다 스크롤 영역, 사이드 영역, 페이지네이션, 상태 표시 기준을 함께 맞춰야 안정적으로 사용할 수 있었습니다."
      },
      {
        label: "Role",
        body: "React·Next.js 기반 프로젝트에서 주요 시스템 UI 구조와 PC·모바일 화면 퍼블리싱을 담당했습니다."
      },
      {
        label: "Action",
        body: "타설관리, 관제정보, 대시보드, 현장관리, 비용관리, 업체선정 등 데이터 중심 업무 화면을 구현했습니다. 로그인, GNB, LNB, 목록, 조회, 테이블, 페이지네이션 등 반복되는 화면 구조는 후속 화면에서도 재사용할 수 있도록 정리했습니다."
      },
      {
        label: "Result",
        body: "로그인, GNB, LNB, 대시보드, 조회 화면, 테이블, 페이지네이션 등 7개 반복 업무 화면 구조를 기준화해 후속 화면에서 활용할 수 있는 공통 UI 기반을 마련했습니다."
      },
      {
        label: "What I Learned",
        body: "업무 시스템 UI는 화면 하나를 잘 만드는 것보다, 같은 구조를 여러 화면에서 안정적으로 반복할 수 있게 만드는 것이 중요합니다."
      }
    ]
  }
];
