import { TextLink } from "@/components/site/text-link";

export default function NotFound() {
  return (
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
  );
}
