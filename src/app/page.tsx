import { AboutCards } from "@/components/AboutCards/AboutCards";
import { CareerTimeline } from "@/components/CareerTimeline/CareerTimeline";
import { EducationSection } from "@/components/EducationSection/EducationSection";
import { Hero } from "@/components/Hero/Hero";
import { ProjectsSection } from "@/components/ProjectsSection/ProjectsSection";
import { SiteShell } from "@/components/SiteShell/SiteShell";
import { SkillsSection } from "@/components/SkillsSection/SkillsSection";
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
      <div id={about.id}>
        <Hero id={about.id} />
        <AboutCards />
      </div>
      <CareerTimeline id={career.id} />
      <ProjectsSection id={projects.id} />
      <SkillsSection id={skills.id} />
      <EducationSection id={education.id} />
    </SiteShell>
  );
}
