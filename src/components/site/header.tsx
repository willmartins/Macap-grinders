"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { LinkItem } from "@/lib/content/types";

export function Header({ links }: { links: LinkItem[] }) {
  const pathname = usePathname();
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="shrink-0" aria-label="Macap, home">
          <span className="logo-on-light inline-flex">
            <Image src="/brand/macap-logo-black.svg" alt="" width={168} height={27} priority />
          </span>
          <span className="logo-on-dark hidden">
            <Image src="/brand/macap-logo-white.svg" alt="" width={168} height={27} priority />
          </span>
        </Link>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none border border-fg px-3 py-2 text-sm">Menu</summary>
          <nav
            aria-label="Primary"
            className="absolute right-0 z-20 mt-2 min-w-52 border border-line bg-bg p-3"
          >
            <ul className="grid gap-2">
              {links.map((link) => (
                <li key={link._key}>
                  <a
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className="block px-2 py-2 aria-[current=page]:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </details>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm">
            {links.map((link) => (
              <li key={link._key}>
                <a
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="underline-offset-4 hover:underline aria-[current=page]:underline"
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
