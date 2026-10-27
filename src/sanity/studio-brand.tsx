import { MacapIcon, MacapLogo } from "@/components/brand/marks";

/** Studio home control, workspace menu and login. The slot is square, so this is the mark. */
export function StudioIcon() {
  return <MacapIcon role="img" aria-label="Macap" aria-hidden={false} />;
}

/** Wordmark for the workspace logo slot. */
export function StudioLogo({ title = "Macap" }: { title?: string }) {
  return (
    <MacapLogo
      role="img"
      aria-label={title}
      aria-hidden={false}
      style={{ display: "block", height: "1.25rem", width: "auto" }}
    />
  );
}
