"use client";

import { useEffect, type ReactNode } from "react";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { usePresence } from "@/hooks/use-presence";

/**
 * `sheet` slides in from the right edge, `dialog` is a compact centered box,
 * `panel` is a large centered box that fills the viewport height.
 */
export type ModalVariant = "sheet" | "dialog" | "panel";

/**
 * Exit durations mirror the `popup-*-out` animations in `src/app/globals.css`.
 * The node stays mounted for this long so the animation can finish.
 *
 * Class names are written out in full because Tailwind scans this file as plain text.
 */
const VARIANTS: Record<
  ModalVariant,
  { container: string; panel: string; enter: string; exit: string; exitMs: number }
> = {
  sheet: {
    container: "fixed inset-0 z-50 flex justify-end",
    panel: "relative flex h-full w-full flex-col",
    enter: "animate-popup-sheet-in",
    exit: "animate-popup-sheet-out",
    exitMs: 200,
  },
  dialog: {
    container: "fixed inset-0 z-50 flex items-center justify-center p-4",
    panel: "relative w-full",
    enter: "animate-popup-dialog-in",
    exit: "animate-popup-dialog-out",
    exitMs: 150,
  },
  panel: {
    container: "fixed inset-0 z-50 flex justify-center p-4 sm:p-6",
    panel: "relative flex h-full w-full flex-col overflow-hidden",
    enter: "animate-popup-panel-in",
    exit: "animate-popup-panel-out",
    exitMs: 170,
  },
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name announced by screen readers. */
  label: string;
  variant?: ModalVariant;
  /** Layout classes for the panel itself (width, surface colors, padding). */
  className?: string;
  children: ReactNode;
}

/**
 * Shared shell for every popup: backdrop, scroll lock, Escape handling and the
 * enter/exit animations. The popup keeps rendering its content while it animates
 * out, so pass `open={false}` instead of unmounting it to close it.
 */
export function Modal({ open, onClose, label, variant = "dialog", className = "", children }: ModalProps) {
  const { container, panel, enter, exit, exitMs } = VARIANTS[variant];
  const { mounted, state } = usePresence(open, exitMs);

  // The page stays frozen until the exit animation is over.
  useBodyScrollLock(mounted);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  const isOpen = state === "open";

  return (
    <div className={container} role="dialog" aria-modal="true" aria-label={label}>
      <div
        className={`absolute inset-0 bg-black/40 ${isOpen ? "animate-popup-fade-in" : "animate-popup-fade-out"}`}
        onClick={onClose}
        aria-hidden
      />
      <div className={`${panel} ${isOpen ? enter : exit} ${className}`}>{children}</div>
    </div>
  );
}
