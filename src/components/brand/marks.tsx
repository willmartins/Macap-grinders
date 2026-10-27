import type { SVGProps } from "react";

import { iconShapes, iconViewBox, logoShapes, logoViewBox } from "@/components/brand/geometry";

type MarkProps = SVGProps<SVGSVGElement>;

export function MacapIcon({
  className,
  style,
  role,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = true,
}: MarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconViewBox}
      fill="currentColor"
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: iconShapes }}
    />
  );
}

export function MacapLogo({
  className,
  style,
  role,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = true,
}: MarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={logoViewBox}
      width="670.53"
      height="114.32"
      fill="currentColor"
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: logoShapes }}
    />
  );
}
