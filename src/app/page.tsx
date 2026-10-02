import { AboutSection } from "@/components/AboutSection/AboutSection";
import { CareerSection } from "@/components/CareerSection/CareerSection";
import { EducationSection } from "@/components/EducationSection/EducationSection";
import { PageShell } from "@/components/PageShell/PageShell";
import { ProjectsSection } from "@/components/ProjectsSection/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection/SkillsSection";
import { sectionNav, uiCopy } from "@/data/site";

const [about, careerNav, projectsNav, skillsNav, educationNav] = sectionNav;

export default function HomePage() {
  return (
    <PageShell navItems={sectionNav} navLabel={uiCopy.sectionNavLabel}>
      <AboutSection id={about.id} />
      <CareerSection id={careerNav.id} title={careerNav.label} />
      <ProjectsSection id={projectsNav.id} title={projectsNav.label} />
      <SkillsSection id={skillsNav.id} title={skillsNav.label} />
      <EducationSection id={educationNav.id} title={educationNav.label} />
    </PageShell>
  );
}
