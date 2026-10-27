"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { LinkItem } from "@/lib/content/types";

function routeHasHero(pathname: string): boolean {
  if (pathname === "/" || pathname === "/home-grinders" || pathname === "/professional") return true;
  if (pathname === "/about" || pathname === "/knowledge") return true;
  if (pathname.startsWith("/grinders/") && pathname !== "/grinders") return true;
  if (pathname.startsWith("/collections/")) return true;
  if (pathname.startsWith("/knowledge/") && !pathname.startsWith("/knowledge/topic")) return true;
  return false;
}

export function Header({ links }: { links: LinkItem[] }) {
  const pathname = usePathname() || "/";
  const [solid, setSolid] = useState(false);
  const canOverlay = routeHasHero(pathname);
  const overlay = canOverlay && !solid;

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header className="site-header" data-overlay={overlay ? "true" : "false"}>
      <div className="frame flex h-full items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="Macap, home">
          <span className="logo-on-light inline-flex">
            <Image src="/brand/macap-logo-black.svg" alt="" width={156} height={25} priority />
          </span>
          <span className="logo-on-dark hidden">
            <Image src="/brand/macap-logo-white.svg" alt="" width={156} height={25} priority />
          </span>
        </Link>
        <details className="relative md:hidden">
          <summary className="label cursor-pointer border border-current px-3 py-2">Menu</summary>
          <nav aria-label="Primary" className="menu-panel absolute right-0 z-20 mt-2 min-w-56 border border-line bg-bg p-4 text-fg">
            <ul className="grid gap-1">
              {links.map((link) => (
                <li key={link._key}>
                  <a
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className="label block py-3 aria-[current=page]:shadow-[inset_0_-1px_0_var(--accent)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </details>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-10">
            {links.map((link) => (
              <li key={link._key}>
                <a
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="label aria-[current=page]:shadow-[inset_0_-1px_0_var(--accent)] hover:shadow-[inset_0_-1px_0_var(--accent)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
