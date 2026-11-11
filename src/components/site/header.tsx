"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

import { MacapLogo } from "@/components/brand/marks";
import type { LinkItem } from "@/lib/content/types";
import { audiencePages } from "@/lib/paths";

type NavItem = { href: string; label: string; current: (pathname: string) => boolean };

const within = (path: string) => (pathname: string) => pathname === path || pathname.startsWith(`${path}/`);

/** The primary navigation: the two audience pages first, then Knowledge and About. Contact is the button. */
const primary: NavItem[] = [
  { href: audiencePages.home.path, label: audiencePages.home.label, current: within(audiencePages.home.path) },
  { href: audiencePages.business.path, label: audiencePages.business.label, current: within(audiencePages.business.path) },
];

const secondary: NavItem[] = [
  { href: "/knowledge", label: "Knowledge", current: within("/knowledge") },
  { href: "/about", label: "About", current: within("/about") },
];

export function Header({ links: _links }: { links?: LinkItem[] }) {
  void _links;
  const pathname = usePathname() || "/";
  const [solid, setSolid] = useState(false);

  useLayoutEffect(() => {
    const apply = () => {
      const header = document.querySelector<HTMLElement>(".site-header");
      const banner = document.querySelector<HTMLElement>(".sample-banner");
      const bannerH = banner ? Math.ceil(banner.getBoundingClientRect().height) : 0;
      const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
      const chrome = `${bannerH + headerH}px`;
      for (const node of [document.documentElement, document.body]) {
        node.style.setProperty("--banner-h", `${bannerH}px`);
        node.style.setProperty("--chrome-h", chrome);
        if (headerH > 0) node.style.setProperty("--header-h", `${headerH}px`);
      }
    };
    apply();
    const resize = new ResizeObserver(apply);
    const header = document.querySelector(".site-header");
    const banner = document.querySelector(".sample-banner");
    if (header) resize.observe(header);
    if (banner) resize.observe(banner);
    const mutations = new MutationObserver(apply);
    mutations.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", apply);
    return () => {
      resize.disconnect();
      mutations.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header className="site-header" data-solid={solid ? "true" : "false"}>
      <div className="frame flex min-h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="brand-lockup shrink-0" aria-label="Macap">
          <MacapLogo className="brand-logo" />
        </Link>
        <details className="site-menu lg:hidden">
          <summary className="nav-link cursor-pointer border border-current px-3 py-2 text-sm font-semibold">
            Menu
          </summary>
          <nav aria-label="Primary" className="menu-panel p-5">
            <ul className="grid gap-1">
              {primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={item.current(pathname) ? "page" : undefined}
                    className="nav-link block py-2.5 aria-[current=page]:shadow-[inset_0_-2px_0_var(--yellow)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="my-2 border-t border-silver" aria-hidden="true" />
              {secondary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={item.current(pathname) ? "page" : undefined}
                    className="nav-link block py-2.5 aria-[current=page]:shadow-[inset_0_-2px_0_var(--yellow)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-4 pt-2">
                <Link href="/contact" className="btn w-full justify-center">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </details>

        {/* Desktop: the two audience pages, a divider, then Knowledge and About, then Contact. */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6 xl:gap-8">
          <div className="flex items-center gap-6 xl:gap-8">
            {primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.current(pathname) ? "page" : undefined}
                className="nav-link whitespace-nowrap aria-[current=page]:shadow-[inset_0_-2px_0_var(--yellow)] hover:shadow-[inset_0_-2px_0_var(--yellow)]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <span className="text-grey/40 font-light select-none text-base" aria-hidden="true">
            |
          </span>

          <div className="flex items-center gap-6 xl:gap-8">
            {secondary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.current(pathname) ? "page" : undefined}
                className="nav-link whitespace-nowrap aria-[current=page]:shadow-[inset_0_-2px_0_var(--yellow)] hover:shadow-[inset_0_-2px_0_var(--yellow)]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="ml-1">
            <Link href="/contact" className="btn text-sm py-2 px-5 min-h-[2.5rem]">
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
