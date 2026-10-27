import { TextLink } from "@/components/site/text-link";

export default function NotFound() {
  return (
    <article className="frame section">
      <h1 className="display-sm max-w-3xl">This page is not on the site.</h1>
      <p className="mt-6">
        <TextLink href="/">Back to Macap</TextLink>
      </p>
    </article>
  );
}
