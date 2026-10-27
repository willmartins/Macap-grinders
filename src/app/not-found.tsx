import { TextLink } from "@/components/site/text-link";

export default function NotFound() {
  return (
    <article className="mx-auto max-w-6xl px-5 py-24">
      <h1 className="text-4xl font-medium">This page is not on the site.</h1>
      <p className="mt-6">
        <TextLink href="/" className="underline underline-offset-4">
          Back to Macap
        </TextLink>
      </p>
    </article>
  );
}
