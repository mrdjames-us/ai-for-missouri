/**
 * schema.org Event JSON-LD for /events/$slug. Uses only facts the page
 * already shows: title, lede, date + time labels, venue and city, the page
 * image, the site (AI for Missouri) as organizer, and the canonical URL.
 */
import type { EventItem } from "@/lib/events";

export const SITE_URL = "https://aiformissouri.com";
const SITE_NAME = "AI for Missouri";
const TIME_ZONE = "America/Chicago";

type Clock = { hour: number; minute: number };

/** "10:00 a.m. – 12:30 p.m." / "Saturday 9:00 a.m. through Sunday 4:00 p.m." */
export function parseTimeLabel(label: string): { start: Clock; end: Clock } | null {
  const matches = [...String(label ?? "").matchAll(/(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\.?/gi)];
  if (matches.length === 0) return null;
  const toClock = (m: RegExpMatchArray): Clock => {
    let hour = Number(m[1]) % 12;
    if (m[3].toLowerCase() === "p") hour += 12;
    return { hour, minute: Number(m[2]) };
  };
  const first = matches[0]!;
  const last = matches[matches.length - 1]!;
  return { start: toClock(first), end: toClock(last) };
}

/** UTC offset ("-05:00") in America/Chicago at that local wall-clock time. */
export function chicagoOffset(date: string, clock: Clock): string | null {
  try {
    const [y, mo, d] = date.split("-").map(Number);
    if (!y || !mo || !d) return null;
    // Guess with CST, then ask Intl what offset Chicago uses at that instant.
    const guess = new Date(Date.UTC(y, mo - 1, d, clock.hour + 6, clock.minute));
    const part = new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      timeZoneName: "longOffset",
    })
      .formatToParts(guess)
      .find((p) => p.type === "timeZoneName")?.value;
    const m = /GMT([+-]\d{2}):?(\d{2})?/.exec(part ?? "");
    return m ? `${m[1]}:${m[2] ?? "00"}` : null;
  } catch {
    return null;
  }
}

function isoDateTime(date: string, clock: Clock | undefined): string {
  if (!clock || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const offset = chicagoOffset(date, clock);
  if (!offset) return date;
  const hh = String(clock.hour).padStart(2, "0");
  const mm = String(clock.minute).padStart(2, "0");
  return `${date}T${hh}:${mm}:00${offset}`;
}

function absolute(path: string): string {
  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return path;
  }
}

export function eventJsonLd(event: EventItem): Record<string, unknown> {
  const times = parseTimeLabel(event.timeLabel);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.lede,
    startDate: isoDateTime(event.start, times?.start),
    url: `${SITE_URL}/events/${encodeURIComponent(event.slug)}`,
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressRegion: "MO",
        addressCountry: "US",
      },
    },
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
  if (event.end) data.endDate = isoDateTime(event.end, times?.end);
  if (event.image) data.image = [absolute(event.image)];
  return data;
}

/** JSON for a <script type="application/ld+json">, safe against `</script>`. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
