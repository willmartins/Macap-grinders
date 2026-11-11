import Link from "next/link";

import { MacapLogo } from "@/components/brand/marks";
import { TextLink } from "@/components/site/text-link";
import type { Shell } from "@/lib/content/types";
import { telHref } from "@/lib/security";
import { publicOffice } from "@/lib/site";
import { audiencePages, collectionPath, rangePath } from "@/lib/paths";

export function Footer({ shell }: { shell: Shell }) {
  const { settings, collections, ranges, legal } = shell;
  const rangeSlugs = new Set(ranges.map((range) => range.slug));
  // A collection that shares a range's slug is shadowed by the range, so it is not listed twice.
  const ownCollections = collections.filter((collection) => !rangeSlugs.has(collection.slug));
  return (
    <footer className="site-footer mt-auto border-t border-silver">
      <div className="frame py-16 md:py-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="brand-lockup inline-block" aria-label="Macap">
            <MacapLogo className="brand-logo" />
          </Link>
          <p className="mt-4 text-sm text-grey">
            Coffee grinders engineered and built in Venice since 1930.
          </p>
          <address className="mt-6 not-italic text-sm text-grey leading-relaxed">
            <p className="font-medium text-black">{settings.siteName} S.r.l.</p>
            <p className="mt-1">{settings.address}</p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
              <dt className="text-grey py-1">Tel</dt>
              <dd>
                <TextLink href={telHref(settings.phone)} className="link-underline">
                  {settings.phone}
                </TextLink>
              </dd>
              <dt className="text-grey py-1">Fax</dt>
              <dd className="text-black py-1">{publicOffice.fax}</dd>
              <dt className="text-grey py-1">Email</dt>
              <dd>
                <TextLink href={`mailto:${settings.email}`} className="link-underline">
                  {settings.email}
                </TextLink>
              </dd>
            </dl>
          </address>
        </div>

        <nav aria-label="Footer navigation">
          <p className="index-title font-medium text-black">On this site</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {settings.footerNavigation.map((link) => (
              <li key={link._key}>
                <TextLink href={link.href} className="link-underline">
                  {link.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Grinders">
          <p className="index-title font-medium text-black">Grinders</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li>
              <TextLink href={audiencePages.home.path} className="link-underline">
                {audiencePages.home.label}
              </TextLink>
            </li>
            <li>
              <TextLink href={audiencePages.business.path} className="link-underline">
                {audiencePages.business.label}
              </TextLink>
            </li>
            {ranges.map((range) => (
              <li key={range.slug}>
                <TextLink href={rangePath(range.slug)} className="link-underline">
                  {range.name}
                </TextLink>
              </li>
            ))}
            {ownCollections.map((collection) => (
              <li key={collection.slug}>
                <TextLink href={collectionPath(collection.slug)} className="link-underline">
                  {collection.name}
                </TextLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <nav aria-label="Legal">
            <p className="index-title font-medium text-black">Legal</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {legal.map((page) => (
                <li key={page.slug}>
                  <TextLink href={`/legal/${page.slug}`} className="link-underline">
                    {page.title}
                  </TextLink>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="cursor-pointer text-left link-underline"
                  data-cookie-settings
                >
                  Cookie settings
                </button>
              </li>
            </ul>
          </nav>
          {settings.socials.length ? (
            <div className="mt-8">
              <p className="index-title font-medium text-black">Follow</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                {settings.socials.map((link) => (
                  <li key={link._key}>
                    <TextLink href={link.href} className="link-underline">
                      {link.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-silver">
        <div className="frame flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6 text-xs text-grey">
          <p>{publicOffice.legal}</p>
          <p className="shrink-0">© 2026 Macap S.r.l.</p>
        </div>
      </div>
    </footer>
  );
}
