import type { ReactNode } from "react";

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  action,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-6 ${className}`.trim()}>
      <div className="max-w-2xl">
        {eyebrow ? <p className="type-eyebrow text-muted mb-2.5">{eyebrow}</p> : null}
        <h2 id={id} className="type-h2 text-fg">
          {title}
        </h2>
        {description ? <p className="type-lead mt-3 text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
