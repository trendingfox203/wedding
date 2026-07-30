import { buildWeddingICS } from "@/lib/calendar";

// Serves the wedding event as a real .ics file at a plain https:// URL
// instead of a data: URI or client-built Blob — those get silently
// dropped or rejected by several mobile browsers and, more importantly,
// by the in-app WebViews most guests will actually use (Zalo, Messenger,
// Facebook), which don't know how to route a `data:` scheme at all. A
// normal same-origin URL with the right Content-Type is something every
// browser/WebView already knows how to handle.
export async function GET() {
  return new Response(buildWeddingICS(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="duy-khanh-wedding.ics"',
    },
  });
}
