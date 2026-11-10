import Link from "next/link";

import { MacapLogo } from "@/components/brand/marks";
import { TextLink } from "@/components/site/text-link";
import type { Shell } from "@/lib/content/types";
import { telHref } from "@/lib/security";
import { publicOffice } from "@/lib/site";

export function Footer({ shell }: { shell: Shell }) {
  const { settings, collections, legal } = shell;
  return (
    <footer className="site-footer mt-auto border-t border-line">
      <div className="frame py-16 md:py-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="brand-lockup inline-block" aria-label="Macap">
            <MacapLogo className="brand-logo" />
          </Link>
          <p className="mt-4 text-sm text-muted">
            Coffee grinders engineered and built in Venice since 1930.
          </p>
          <address className="mt-6 not-italic text-sm text-muted leading-relaxed">
            <p className="font-medium text-fg">{settings.siteName} S.r.l.</p>
            <p className="mt-1">{settings.address}</p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
              <dt className="text-muted py-1">Tel</dt>
              <dd>
                <TextLink href={telHref(settings.phone)} className="hover:shadow-[inset_0_-1px_0_var(--accent)]">
                  {settings.phone}
                </TextLink>
              </dd>
              <dt className="text-muted py-1">Fax</dt>
              <dd className="text-fg py-1">{publicOffice.fax}</dd>
              <dt className="text-muted py-1">Email</dt>
              <dd>
                <TextLink href={`mailto:${settings.email}`} className="hover:shadow-[inset_0_-1px_0_var(--accent)]">
                  {settings.email}
                </TextLink>
              </dd>
            </dl>
          </address>
        </div>

        <nav aria-label="Footer navigation">
          <p className="index-title font-medium text-fg">On this site</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
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
          <p className="index-title font-medium text-fg">Collections</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
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
            <p className="index-title font-medium text-fg">Legal</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {legal.map((page) => (
                <li key={page.slug}>
                  <TextLink href={`/legal/${page.slug}`} className="hover:shadow-[inset_0_-1px_0_var(--accent)]">
                    {page.title}
                  </TextLink>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="cursor-pointer text-left hover:shadow-[inset_0_-1px_0_var(--accent)]"
                  data-cookie-settings
                >
                  Cookie settings
                </button>
              </li>
            </ul>
          </nav>
          {settings.socials.length ? (
            <div className="mt-8">
              <p className="index-title font-medium text-fg">Follow</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                {settings.socials.map((link) => (
                  <li key={link._key}>
                    <TextLink href={link.href} className="hover:shadow-[inset_0_-1px_0_var(--accent)]">
                      {link.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="frame flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6 text-xs text-muted">
          <p>{publicOffice.legal}</p>
          <p className="shrink-0">© 2026 Macap S.r.l.</p>
        </div>
      </div>
    </footer>
  );
}
