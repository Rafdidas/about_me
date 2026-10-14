import { useEffect, useState } from "react";
import { pickActiveId } from "@/lib/sectionNav";

export function useActiveSection(ids: string[], enabled: boolean): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    if (!enabled) return;
    const list = key === "" ? [] : key.split("|");
    const targets = list
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const visible = new Set<string>();
    let frame = 0;

    function update() {
      frame = 0;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActiveId((current) => pickActiveId({ ids: list, visibleIds: [...visible], atBottom, current }));
    }

    function schedule() {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        schedule();
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [key, enabled]);

  return enabled ? activeId : undefined;
}
