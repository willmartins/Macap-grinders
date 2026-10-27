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
        <article className="frame section">
          <h1 className="display-sm max-w-3xl">This page is not on the site.</h1>
          <p className="mt-6">
            <TextLink href="/">Back to Macap</TextLink>
          </p>
        </article>
      </main>
      <Footer shell={shell} />
    </ThemeFrame>
  );
}
