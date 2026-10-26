"use client";

import type { Shell } from "@/lib/content/types";
import { telHref } from "@/lib/security";
import { publicOffice } from "@/lib/site";

export function Footer({ shell }: { shell: Shell }) {
  const { settings, collections, legal } = shell;
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <address className="not-italic text-sm leading-6">
          <p className="font-medium">{settings.siteName}</p>
          <p className="mt-3 whitespace-pre-line">{settings.address}</p>
          <p className="mt-3">
            <a href={telHref(settings.phone)} className="underline underline-offset-4">
              {settings.phone}
            </a>
          </p>
          <p>Fax {publicOffice.fax}</p>
          <p>
            <a href={`mailto:${settings.email}`} className="underline underline-offset-4">
              {settings.email}
            </a>
          </p>
        </address>
        <nav aria-label="Footer">
          <p className="text-sm font-medium">On this site</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {settings.footerNavigation.map((link) => (
              <li key={link._key}>
                <a href={link.href} className="underline underline-offset-4">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Collections">
          <p className="text-sm font-medium">Collections</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {collections.map((collection) => (
              <li key={collection.slug}>
                <a href={`/collections/${collection.slug}`} className="underline underline-offset-4">
                  {collection.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <nav aria-label="Legal">
            <p className="text-sm font-medium">Legal</p>
            <ul className="mt-3 grid gap-2 text-sm">
              {legal.map((page) => (
                <li key={page.slug}>
                  <a href={`/legal/${page.slug}`} className="underline underline-offset-4">
                    {page.title}
                  </a>
                </li>
              ))}
              <li>
                <button type="button" className="underline underline-offset-4" data-cookie-settings>
                  Cookie settings
                </button>
              </li>
            </ul>
          </nav>
          {settings.socials.length ? (
            <ul className="mt-6 grid gap-2 text-sm">
              {settings.socials.map((link) => (
                <li key={link._key}>
                  <a href={link.href} className="underline underline-offset-4" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-10 text-sm text-muted md:px-8">{publicOffice.legal}</p>
    </footer>
  );
}
