import {
  cloneElement,
  isValidElement,
  type AnchorHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

type TextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
  href: string;
  className?: string;
  /** Use the north-east arrow. Defaults to http(s) addresses. */
  external?: boolean;
};

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href.trim());
}

function arrowNode(external: boolean) {
  return (
    <span className={external ? "link-arrow is-external" : "link-arrow"} aria-hidden="true">
      {external ? "↗" : "→"}
    </span>
  );
}

function tail(word: ReactNode, arrow: ReactNode, note: ReactNode, trailing = "") {
  return (
    <span className="link-tail">
      {word}
      {note}
      {arrow}
      {trailing}
    </span>
  );
}

function glueLast(node: ReactNode, arrow: ReactNode, note: ReactNode): ReactNode {
  if (node == null || typeof node === "boolean") return tail(null, arrow, note);
  if (typeof node === "string" || typeof node === "number") {
    const text = String(node);
    const end = text.trimEnd();
    const trailing = text.slice(end.length);
    const match = end.match(/^([\s\S]*?)(\S+)$/);
    if (!match) return tail(text, arrow, note);
    return (
      <>
        {match[1]}
        {tail(match[2], arrow, note, trailing)}
      </>
    );
  }
  if (Array.isArray(node)) {
    let last = -1;
    for (let index = node.length - 1; index >= 0; index -= 1) {
      const item = node[index];
      if (item == null || typeof item === "boolean") continue;
      if (typeof item === "string" && item.trim() === "") continue;
      last = index;
      break;
    }
    if (last === -1) return tail(node, arrow, note);
    return (
      <>
        {node.slice(0, last)}
        {glueLast(node[last], arrow, note)}
        {node.slice(last + 1)}
      </>
    );
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    const children = element.props.children;
    if (children == null || children === "") return tail(element, arrow, note);
    return cloneElement(element, undefined, glueLast(children, arrow, note));
  }
  return tail(node, arrow, note);
}

export function ArrowText({ children, external = false }: { children: ReactNode; external?: boolean }) {
  const note = external ? <span className="sr-only"> (opens in a new tab)</span> : null;
  return <>{glueLast(children, arrowNode(external), note)}</>;
}

/** Standalone text link. Buttons keep `.btn` and must not use this, or they gain a second arrow. */
export function TextLink({ href, children, className, external, ...rest }: TextLinkProps) {
  if (className?.split(/\s+/).includes("btn")) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  const leavesSite = external ?? isExternalHref(href);
  const classes = className ? `text-link ${className}` : "text-link";
  return (
    <a
      href={href}
      className={classes}
      {...(leavesSite ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
    >
      <ArrowText external={leavesSite}>{children}</ArrowText>
    </a>
  );
}
