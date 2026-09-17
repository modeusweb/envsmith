"use client";

import { useEffect } from "react";

// Module-level bookkeeping so nested/stacked modals share a single lock.
let lockCount = 0;
let previousHtmlOverflow = "";
let previousBodyPaddingRight = "";

function lockBodyScroll() {
  const html = document.documentElement;
  const body = document.body;

  const scrollbarWidth = window.innerWidth - html.clientWidth;
  previousHtmlOverflow = html.style.overflow;
  previousBodyPaddingRight = body.style.paddingRight;

  // Hide the overflow on <html> only. The viewport takes its scrolling behaviour from the root
  // element, so this is enough to freeze the page — while setting `overflow: hidden` on <body> as
  // well is what makes Chromium drop a `sticky` header (it jumps to the top of the document).
  html.style.overflow = "hidden";
  // Keep the layout from shifting when the page scrollbar disappears.
  if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
}

function unlockBodyScroll() {
  const html = document.documentElement;
  const body = document.body;

  html.style.overflow = previousHtmlOverflow;
  body.style.paddingRight = previousBodyPaddingRight;
}

/**
 * Freezes page scrolling while a modal or overlay is open.
 * Pass `false` to keep the hook mounted but inactive.
 */
export function useBodyScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) lockBodyScroll();
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) unlockBodyScroll();
    };
  }, [active]);
}
