import type { NavItem } from "@/data/types";

export function navHref(id: string, spy: boolean): string {
  return spy ? `#${id}` : `/#${id}`;
}

export function getNavItem(items: NavItem[], id: string): NavItem {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Unknown nav item: ${id}`);
  return item;
}
