"use client";

import { TextLink } from "@/components/site/text-link";
import type { Shell } from "@/lib/content/types";
import { telHref } from "@/lib/security";
import { publicOffice } from "@/lib/site";

export function Footer({ shell }: { shell: Shell }) {
  const { settings, collections, legal } = shell;
  return (
    <footer className="mt-auto border-t border-line">
      <div className="frame section grid gap-[var(--gap-block)] md:grid-cols-4">
        <address className="not-italic text-sm leading-6">
          <p className="label">
            <span className="trim" />
            Est. 1930
          </p>
          <p className="mt-4 font-medium">{settings.siteName}</p>
          <p className="mt-3 whitespace-pre-line">{settings.address}</p>
          <p className="mt-3">
            <TextLink href={telHref(settings.phone)} className="hover:shadow-[inset_0_-1px_0_var(--accent)]">
              {settings.phone}
            </TextLink>
          </p>
          <p>Fax {publicOffice.fax}</p>
          <p>
            <TextLink href={`mailto:${settings.email}`} className="hover:shadow-[inset_0_-1px_0_var(--accent)]">
              {settings.email}
            </TextLink>
          </p>
        </address>
        <nav aria-label="Footer">
          <p className="label">On this site</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {settings.footerNavigation.map((link) => (
              <li key={link._key}>
                <TextLink href={link.href} className="hover:shadow-[inset_0_-1px_0_var(--accent)]">
                  {link.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Collections">
          <p className="label">Collections</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {collections.map((collection) => (
              <li key={collection.slug}>
                <TextLink
                  href={`/collections/${collection.slug}`}
                  className="hover:shadow-[inset_0_-1px_0_var(--accent)]"
                >
                  {collection.name}
                </TextLink>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <nav aria-label="Legal">
            <p className="label">Legal</p>
            <ul className="mt-3 grid gap-2 text-sm">
              {legal.map((page) => (
                <li key={page.slug}>
                  <TextLink href={`/legal/${page.slug}`} className="hover:shadow-[inset_0_-1px_0_var(--accent)]">
                    {page.title}
                  </TextLink>
                </li>
              ))}
              <li>
                <button type="button" className="hover:shadow-[inset_0_-1px_0_var(--accent)]" data-cookie-settings>
                  Cookie settings
                </button>
              </li>
            </ul>
          </nav>
          {settings.socials.length ? (
            <ul className="mt-6 grid gap-2 text-sm">
              {settings.socials.map((link) => (
                <li key={link._key}>
                  <TextLink href={link.href} className="hover:shadow-[inset_0_-1px_0_var(--accent)]">
                    {link.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <p className="frame border-t border-line py-8 text-sm text-muted">{publicOffice.legal}</p>
    </footer>
  );
}
