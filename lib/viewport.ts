// Matches Tailwind's `sm` breakpoint. Used by sections whose site-wide
// slide-navigation sub-step (Timeline's past/future, Details/Dresscode)
// is desktop-only — on mobile they lay out as one continuous scroll
// instead, since a swipe that only crossfades content in place (no visible
// scroll) reads as "did nothing happen?" on a touch screen.
export function isDesktopViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 640px)").matches;
}
