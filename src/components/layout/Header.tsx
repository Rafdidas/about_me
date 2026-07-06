"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, siteMeta } from "@/data/site";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="l-header">
      <div className="l-container l-header__inner">
        <Link className="l-header__brand" href="/" aria-label={`${siteMeta.name} home`}>
          HK
        </Link>
        <nav className="l-header__nav" aria-label="주요 메뉴">
          {navigation.map((item) => (
            <Link className="l-header__link" data-active={pathname === item.href} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
