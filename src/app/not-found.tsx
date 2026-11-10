import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { TextLink } from "@/components/site/text-link";
import { ThemeFrame } from "@/components/site/theme-frame";
import { loadShell } from "@/sanity/lib/load";

export default async function NotFound() {
  const shell = await loadShell("published");
  return (
    <ThemeFrame>
      <Header links={shell.settings.navigation} />
      <main id="content" className="flex-1">
        <article className="section">
          <div className="frame">
            <h1 className="type-h1 max-w-3xl text-black">This page is not on the site.</h1>
            <p className="mt-8">
              <TextLink href="/" className="type-body font-semibold text-black link-underline">
                Back to Macap
              </TextLink>
            </p>
          </div>
        </article>
      </main>
      <Footer shell={shell} />
    </ThemeFrame>
  );
}
