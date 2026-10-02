import { PageShell } from "@/components/PageShell/PageShell";
import { sectionNav, uiCopy } from "@/data/site";

export default function HomePage() {
  return (
    <PageShell navItems={sectionNav} navLabel={uiCopy.sectionNavLabel}>
      {sectionNav.map((item) => (
        <section key={item.id} id={item.id} style={{ minHeight: "80vh" }}>
          <h2>{item.label}</h2>
        </section>
      ))}
    </PageShell>
  );
}
