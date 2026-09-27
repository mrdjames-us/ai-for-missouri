/**
 * /robots.txt and /sitemap.xml (both 404'd before; ref sites-pipeline-0926).
 *
 * Served from server middleware so the sitemap lists the real event pages from
 * the database. If the DB is unreachable, it falls back to the built-in EVENTS
 * list rather than failing. Admin, login and RSVP pages are left out on purpose.
 */
import { EVENTS } from "../../src/lib/events";

const ORIGIN = "https://aiformissouri.com";

const STATIC_PATHS = ["/", "/events", "/about", "/host"];

const ROBOTS = `# aiformissouri.com: search engines and AI agents welcome.
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${ORIGIN}/sitemap.xml
`;

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function eventSlugs(): Promise<string[]> {
  try {
    const { getSql } = await import("../../src/lib/db");
    const sql = await getSql();
    const rows = await sql<{ slug: string }>`select slug from events order by start_date, slug`;
    if (rows.length > 0) return rows.map((r) => r.slug);
  } catch {
    // fall through to the built-in list
  }
  return EVENTS.map((e) => e.slug);
}

async function renderSitemap(): Promise<string> {
  const slugs = await eventSlugs();
  const paths = [...STATIC_PATHS, ...slugs.map((s) => `/events/${encodeURIComponent(s)}`)];
  const urls = paths
    .map((p) => `  <url><loc>${xmlEscape(`${ORIGIN}${p}`)}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export default async function seoFilesMiddleware(
  event: { url: URL; req: { method: string } },
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const method = (event.req.method || "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") return next();

  if (event.url.pathname === "/robots.txt") {
    return new Response(method === "HEAD" ? null : ROBOTS, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  }

  if (event.url.pathname === "/sitemap.xml") {
    const body = await renderSitemap();
    return new Response(method === "HEAD" ? null : body, {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  }

  return next();
}
