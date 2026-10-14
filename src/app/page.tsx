import { CareerBand } from "@/components/CareerBand/CareerBand";
import { CompetenciesBand } from "@/components/CompetenciesBand/CompetenciesBand";
import { EducationBand } from "@/components/EducationBand/EducationBand";
import { Hero } from "@/components/Hero/Hero";
import { ProjectsBands } from "@/components/ProjectsBands/ProjectsBands";
import { SiteShell } from "@/components/SiteShell/SiteShell";
import { SkillsBand } from "@/components/SkillsBand/SkillsBand";
import { sectionNav } from "@/data/site";
import { getNavItem } from "@/lib/nav";

const about = getNavItem(sectionNav, "about");
const career = getNavItem(sectionNav, "career");
const projects = getNavItem(sectionNav, "projects");
const skills = getNavItem(sectionNav, "skills");
const education = getNavItem(sectionNav, "education");

export default function HomePage() {
  return (
    <SiteShell spy>
      <Hero id={about.id} />
      <CompetenciesBand />
      <CareerBand id={career.id} title={career.label} />
      <ProjectsBands id={projects.id} title={projects.label} />
      <SkillsBand id={skills.id} title={skills.label} />
      <EducationBand id={education.id} title={education.label} />
    </SiteShell>
  );
}
