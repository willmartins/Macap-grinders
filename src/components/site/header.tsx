"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

import type { LinkItem } from "@/lib/content/types";

export function Header({ links }: { links: LinkItem[] }) {
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
        <Link href="/" className="shrink-0" aria-label="Macap, home">
          <span className="logo-on-light inline-flex">
            <Image src="/brand/macap-logo-black.svg" alt="" width={156} height={25} priority />
          </span>
          <span className="logo-on-dark">
            <Image src="/brand/macap-logo-white.svg" alt="" width={156} height={25} priority />
          </span>
        </Link>
        <details className="site-menu md:hidden">
          <summary className="label cursor-pointer border border-current px-3 py-2">Menu</summary>
          <nav aria-label="Primary" className="menu-panel">
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
