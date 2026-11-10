"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Pixels per second. Slow enough to read a photograph as it passes. */
const SPEED = 14;
/** How long the row waits after a touch before it drifts again. */
const HOLD_MS = 4000;

/**
 * Phone gallery row. It is a native scroll row, so it can be swiped.
 * It drifts slowly on its own and stops while it is being touched.
 * Reduced motion keeps it still.
 *
 * The children are the same set of photographs repeated. `setSize` is the
 * length of one set, so the drift can wrap without a visible jump.
 */
export function GalleryDrift({
  children,
  setSize,
  label,
}: {
  children: ReactNode;
  setSize: number;
  label: string;
}) {
  const row = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last = performance.now();
    let position = el.scrollLeft;
    let resumeAt = 0;

    const hold = () => {
      resumeAt = performance.now() + HOLD_MS;
    };

    const step = (now: number) => {
      const elapsed = Math.min(now - last, 100);
      last = now;
      const first = el.children[0] as HTMLElement | undefined;
      const repeat = el.children[setSize] as HTMLElement | undefined;
      const loop = first && repeat ? repeat.offsetLeft - first.offsetLeft : 0;
      if (loop > 0 && el.offsetParent !== null && now >= resumeAt) {
        if (resumeAt) {
          position = el.scrollLeft;
          resumeAt = 0;
        }
        position += (elapsed / 1000) * SPEED;
        if (position >= loop) position -= loop;
        el.scrollLeft = position;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    el.addEventListener("touchstart", hold, { passive: true });
    el.addEventListener("touchmove", hold, { passive: true });
    el.addEventListener("pointerdown", hold);
    el.addEventListener("wheel", hold, { passive: true });
    el.addEventListener("keydown", hold);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("touchstart", hold);
      el.removeEventListener("touchmove", hold);
      el.removeEventListener("pointerdown", hold);
      el.removeEventListener("wheel", hold);
      el.removeEventListener("keydown", hold);
    };
  }, [setSize]);

  return (
    <div
      ref={row}
      role="group"
      aria-label={label}
      tabIndex={0}
      className="flex gap-4 overflow-x-auto overscroll-x-contain px-[var(--frame-inset)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </div>
  );
}
