import { weddingConfig } from "./wedding-config";

// RFC 5545 requires CRLF line breaks and backslash-escaped commas/semicolons
// in text fields — the venue address has both.
function escapeICSText(text: string) {
  return text.replace(/([,;])/g, "\\$1");
}

function toICSDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildWeddingICS() {
  const { groom, bride, venue } = weddingConfig;
  const start = new Date(weddingConfig.weddingDateISO);
  // No explicit end time in the source data — block out a reasonable
  // 4-hour window (ceremony through reception) rather than leaving it
  // open-ended, which some calendar apps render awkwardly.
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const title = `${groom.shortName.toUpperCase()} & ${bride.shortName.toUpperCase()}'S WEDDING DAY`;
  const location = `${venue.name}, ${venue.address}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Duy & Khanh Wedding//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:duy-khanh-wedding-${start.getTime()}@wedding-invitation`,
    // DTSTAMP just needs to be a valid timestamp per RFC 5545, not
    // literally "now" — reusing `start` keeps this deterministic.
    `DTSTAMP:${toICSDate(start)}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICSText(title)}`,
    `LOCATION:${escapeICSText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
