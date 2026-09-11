# Portfolio Credibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio distinguish verified work experience from public portfolio examples and present Monibuk as an AI-assisted, live personal project.

**Architecture:** Keep every page as a server component that renders content from `src/data/`. Keep the Admin Table interaction in its existing client component and preserve its pure transformation helpers in `src/lib/adminTable.ts`. Extend project data with presentation-only status fields and update page rendering to consume them.

**Tech Stack:** Next.js App Router, React, TypeScript, SCSS with BEM, Vitest, ESLint.

**Spec:** `docs/superpowers/specs/2026-09-11-portfolio-credibility-design.md`

## Global Constraints

- Keep actual company and client names as verified work-history evidence.
- Do not expose internal screens, source code, data, unverified numerical results, or unverified security claims.
- Do not add pages, dependencies, APIs, databases, or new shared components.
- Keep content in `src/data/`; preserve current routes and case-study anchors.
- Preserve Admin Table search, filter, sort, pagination, and simulated loading, empty, and error states.
- Use text alongside badge color to convey every status.

---

### Task 1: Define evidence-based portfolio content

**Files:**
- Modify: `src/data/home.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/data/caseStudies.ts`
- Modify: `src/data/designTokens.ts`
- Modify: `src/data/career.ts`
- Modify: `src/data/adminMock.ts`
- Modify: `src/data/portfolioContent.test.ts`

**Interfaces:**
- Produces: each project has `displayName: string`, `status?: string`, and `developmentMethod?: string` for page rendering.
- Produces: `projectsIntro`, `caseStudiesIntro`, `designSystemOverview`, `adminTableBridge`, and `adminTableCopy` describe public example boundaries without presenting it as an internal screen.

- [ ] **Step 1: Write failing content requirements**

Replace the measurable-result test with checks for Monibuk, public-example copy, preserved anchors, and removal of unsupported claims:

```ts
it("describes Monibuk as an operating AI-assisted project", () => {
  const monibuk = projects.find((project) => project.slug === "money-book");

  expect(monibuk?.displayName).toBe("모니북");
  expect(monibuk?.status).toBe("운영 중");
  expect(monibuk?.developmentMethod).toBe("AI 활용 개발");
  expect(monibuk?.demoUrl).toBe("https://monibuk.com");
});

it("keeps public examples distinct from internal work", () => {
  expect(designSystemOverview.description).toContain("포트폴리오용 예시");
  expect(adminTableBridge.description).toContain("가상 데이터");
  expect(adminTableCopy.description).toContain("가상 데이터");
});

it("does not present unverified scale or security claims", () => {
  const publishedContent = JSON.stringify({ projects, caseStudies });

  expect(publishedContent).not.toMatch(/5종 이상|7개.*기준화|RLS 기반 데이터 보호/);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/data/portfolioContent.test.ts`

Expected: FAIL because the new project fields and public-example wording are absent.

- [ ] **Step 3: Update the content objects**

Add these presentation fields to the `money-book` object:

```ts
displayName: "모니북",
status: "운영 중",
developmentMethod: "AI 활용 개발",
summary: "AI를 활용해 개발하고 실제 운영하는 개인 가계부 서비스입니다.",
techPoints: ["개인 가계부 사용 흐름 설계", "도메인 배포 운영", "AI 활용 개발"],
```

Use `displayName` for the other project names as well. Replace unsupported case-study result sentences with a factual description of the components and screens implemented. Make the Design System and Admin Table copy state that they are separate, virtual-data portfolio examples.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- src/data/portfolioContent.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data
git commit -m "content: 포트폴리오 사례와 모니북 설명을 사실 기반으로 정리"
```

### Task 2: Render the revised portfolio narrative

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/projects/page.tsx`
- Modify: `src/app/case-studies/page.tsx`
- Modify: `src/app/design-system/page.tsx`

**Interfaces:**
- Consumes: `Project.displayName`, `Project.status`, and `Project.developmentMethod` created in Task 1.
- Produces: `/projects#money-book` targets Monibuk’s heading; Home’s project and CTA links direct visitors to the correct evidence.

- [ ] **Step 1: Write a rendering expectation in the content test**

Add source-level expectations that prevent removal of the required anchor and public scope notice:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

it("renders the Monibuk anchor and case-study disclosure", () => {
  const projectsPage = readFileSync(resolve("src/app/projects/page.tsx"), "utf8");
  const caseStudiesPage = readFileSync(resolve("src/app/case-studies/page.tsx"), "utf8");

  expect(projectsPage).toContain('id={project.slug === "money-book" ? "money-book" : undefined}');
  expect(caseStudiesPage).toContain("caseStudiesDisclosure");
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/data/portfolioContent.test.ts`

Expected: FAIL because neither required rendering hook exists.

- [ ] **Step 3: Render data-driven badges, links, and disclosures**

Update project markup to use the display name and optional badges:

```tsx
<article className="c-card p-project-card" id={project.slug === "money-book" ? "money-book" : undefined}>
  <div className="p-project-card__badges">
    {project.status ? <Badge tone="success">{project.status}</Badge> : null}
    {project.developmentMethod ? <Badge>{project.developmentMethod}</Badge> : null}
    {project.stack.map((stack) => <Badge key={stack}>{stack}</Badge>)}
  </div>
  <h2>{project.displayName}</h2>
</article>
```

Use `project.slug === "money-book" ? "/projects#money-book" : "/projects"` for the Home detail link. Export `caseStudiesDisclosure` from the data module and render it once below the Case Studies header. Keep the existing `study.id` anchors. Add a Design System disclosure from data rather than inline text.

- [ ] **Step 4: Run lint and focused tests**

Run: `npm run lint && npm test -- src/data/portfolioContent.test.ts`

Expected: PASS with no ESLint errors.

- [ ] **Step 5: Commit**

```bash
git add src/app src/data/portfolioContent.test.ts
git commit -m "content: 포트폴리오 예시와 실무 사례의 범위를 화면에 구분"
```

### Task 3: Rewrite the portfolio README and verify the build

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: routes, public project URLs, scripts, and content boundaries implemented in Tasks 1–2.
- Produces: a reviewer-facing repository introduction that identifies each page’s evidence and how to verify it.

- [ ] **Step 1: Add README assertions to the content test**

```ts
it("documents the portfolio scope and verification commands", () => {
  const readme = readFileSync(resolve("README.md"), "utf8");

  expect(readme).toContain("포트폴리오용 예시");
  expect(readme).toContain("실제 업무 화면과 내부 자료는 공개하지 않습니다");
  expect(readme).toContain("npm run build");
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/data/portfolioContent.test.ts`

Expected: FAIL because the README lacks the required scope statement.

- [ ] **Step 3: Replace README content with reviewer-facing documentation**

Document the portfolio purpose, a page-by-page table, public scope, Monibuk’s AI-assisted development and live-service status, implementation choices, and the existing scripts. State that the Design System and Admin Table use separate virtual data and are not internal screens or source code.

- [ ] **Step 4: Run complete verification**

Run: `npm run lint && npm test && npm run build`

Expected: all commands exit with code 0.

- [ ] **Step 5: Commit**

```bash
git add README.md src/data/portfolioContent.test.ts
git commit -m "docs: 포트폴리오 공개 범위와 검증 방법을 명확히 안내"
```
