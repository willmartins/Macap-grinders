"use client";

import { useId, useRef } from "react";

import { ContactForm } from "@/components/contact/contact-form";
import type { EnquiryGrinder } from "@/lib/enquiry";

export function Enquire({
  grinder,
  variant = "photo",
}: {
  grinder: EnquiryGrinder;
  variant?: "photo" | "plain";
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const buttonClass = variant === "photo" ? "btn btn-on-photo" : "btn";

  return (
    <>
      <a
        href={`/contact?grinder=${encodeURIComponent(grinder.slug)}`}
        className={buttonClass}
        onClick={(event) => {
          if (!dialog.current) return;
          event.preventDefault();
          dialog.current.showModal();
          title.current?.focus();
        }}
      >
        Enquire
      </a>
      <dialog ref={dialog} className="enquire-dialog" aria-labelledby={titleId}>
        <div className="enquire-sheet">
          <button type="button" className="enquire-dismiss" onClick={() => dialog.current?.close()}>
            Close
          </button>
          <h2 id={titleId} ref={title} tabIndex={-1} className="text-3xl font-medium tracking-tight">
            Enquire about {grinder.name}
          </h2>
          <ContactForm grinder={grinder} />
        </div>
      </dialog>
    </>
  );
}
