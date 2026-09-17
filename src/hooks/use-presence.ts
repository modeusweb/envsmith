"use client";

import { useEffect, useState } from "react";

/** `open` plays the enter animation, `closed` the exit animation. */
export type PresenceState = "open" | "closed";

/**
 * Keeps a node mounted until its exit animation has finished playing.
 *
 * CSS animations cannot run on a node that is already unmounted, so closing a popup
 * is a two-step process: `state` switches to `closed` (which applies the `popup-*-out`
 * animation from globals.css) and only after `exitDuration` milliseconds does the
 * caller stop rendering it.
 *
 * `exitDuration` must match the exit animation length in `src/app/globals.css`.
 */
export function usePresence(open: boolean, exitDuration: number) {
  const [mounted, setMounted] = useState(open);

  // Adjusting state during render is the documented React way to react to a prop change:
  // it mounts the node in the same commit as the `open` flip, so the enter animation starts
  // on the very first painted frame instead of one frame later.
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open || !mounted) return;
    // Keep the node in the DOM until the exit animation has finished playing.
    const timer = window.setTimeout(() => setMounted(false), exitDuration);
    return () => window.clearTimeout(timer);
  }, [open, mounted, exitDuration]);

  return { mounted, state: open ? ("open" as const) : ("closed" as const) };
}
