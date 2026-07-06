import Link from "next/link";
import { AdminTableExample } from "@/components/admin-example/AdminTableExample";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Input } from "@/components/common/Input";
import { Pagination } from "@/components/common/Pagination";
import { Select } from "@/components/common/Select";
import { Skeleton } from "@/components/common/Skeleton";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import {
  adminTableBridge,
  colors,
  componentDocs,
  designSystemOverview,
  radii,
  spacing,
  typography
} from "@/data/designTokens";

export default function DesignSystemPage() {
  return (
    <div className="p-design-system">
      <Container>
        <header className="p-page-header">
          <h1>Design System</h1>
          <p>{designSystemOverview.description}</p>
          <p>{designSystemOverview.bridge}</p>
        </header>
      </Container>

      <Section title="Design Tokens" description="특정 브랜드를 그대로 복제하지 않고, B2B 업무 화면에 맞는 명확한 중립 톤과 상태 색상으로 재정리했습니다.">
        <div className="ds-token-grid">
          {colors.map((color) => (
            <div className="ds-token" key={color.name}>
              <span className="ds-token__swatch" style={{ backgroundColor: color.value }} />
              <strong>{color.name}</strong>
              <code>{color.value}</code>
              <p>{color.role}</p>
            </div>
          ))}
        </div>
        <div className="ds-token-list">
          {typography.map((item) => (
            <div className="ds-token-row" key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.size}</span>
              <span>{item.weight}</span>
              <span>{item.usage}</span>
            </div>
          ))}
        </div>
        <div className="ds-inline-tokens">
          <p>Spacing: {spacing.join(" / ")}</p>
          <p>Radius: {radii.map((radius) => `${radius.name} ${radius.value}`).join(" / ")}</p>
        </div>
      </Section>

      <Section title="Components" description="축소 확정된 6종 컴포넌트와 상태 컴포넌트 3종만 구현합니다.">
        <div className="ds-component-stack">
          <article className="ds-component">
            <h3>Button</h3>
            <div className="ds-preview-row">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button disabled>Disabled</Button>
              <Button isLoading>Loading</Button>
            </div>
          </article>
          <article className="ds-component">
            <h3>Input / Select / Badge</h3>
            <div className="ds-form-preview">
              <Input id="store-name" label="매장명" placeholder="매장명을 입력해주세요" />
              <Input id="store-error" label="단말기 ID" defaultValue="TM-" error="단말기 ID를 확인해주세요." />
              <Select
                id="status"
                label="상태"
                options={[
                  { value: "all", label: "전체" },
                  { value: "active", label: "정상" },
                  { value: "pending", label: "확인 필요" }
                ]}
              />
              <div className="ds-preview-row">
                <Badge tone="success">정상</Badge>
                <Badge tone="warning">확인 필요</Badge>
                <Badge tone="danger">차단</Badge>
                <Badge>대기</Badge>
              </div>
            </div>
          </article>
          <article className="ds-component">
            <h3>Loading / Empty / Error / Pagination</h3>
            <div className="ds-state-grid">
              <Skeleton lines={3} />
              <EmptyState title="조건에 맞는 결과가 없어요" description="검색어를 줄이거나 필터를 전체로 변경해보세요." />
              <ErrorState title="목록을 불러오지 못했어요" description="잠시 후 다시 시도해주세요." />
              <Pagination currentPage={2} totalPages={5} />
            </div>
          </article>
          <div className="ds-doc-grid">
            {componentDocs.map((doc) => (
              <article className="c-card" key={doc.title}>
                <h3>{doc.title}</h3>
                <p>{doc.description}</p>
                <p className="u-muted">{doc.accessibility}</p>
                <pre>
                  <code>{doc.code}</code>
                </pre>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="admin-table"
        title="Admin Table Example"
        description={adminTableBridge.description}
      >
        <Link className="c-text-link p-design-system__case-link" href={adminTableBridge.caseStudyHref}>
          {adminTableBridge.caseStudyLabel}
        </Link>
        <AdminTableExample />
      </Section>
    </div>
  );
}
