/**
 * Small line icons for buttons. Drawn at 24 units with a 1.5 stroke, in the current colour.
 * A button sizes them through `.btn svg`.
 */

type IconProps = { className?: string };

function Icon({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14" />
    </Icon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" />
      <path d="m4 6 8 6.5L20 6" />
    </Icon>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 20.5s6-5.6 6-10.2a6 6 0 0 0-12 0c0 4.6 6 10.2 6 10.2z" />
      <circle cx="12" cy="10.2" r="2.2" />
    </Icon>
  );
}
