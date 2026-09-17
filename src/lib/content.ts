import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { staffMiddleware } from "@/lib/staff";
import {
  EVENTS,
  FAQS,
  type EventItem,
  type EventKind,
} from "@/lib/events";

export const EVENT_IMAGES = [
  { src: "/images/format-hackathon.jpg", label: "Hackathon room" },
  { src: "/images/format-workshop.jpg", label: "Workshop table" },
  { src: "/images/format-seminar.jpg", label: "Seminar room" },
  { src: "/images/event-rural.jpg", label: "Rural gathering" },
  { src: "/images/event-warehouse.jpg", label: "Warehouse build" },
  { src: "/images/hero-square.jpg", label: "Town square" },
] as const;

export const PAGE_DEFAULTS = {
  home: {
    kicker: "Live in the room · Serving all of Missouri · Based in Clinton",
    heading: "We use AI live, in front of people, to build things.",
    lede: "Not a webinar. Not a slide deck in the dark. A library, a chamber breakfast, a Saturday hack — you watch it get made, then you make one too. Hosted by David James.",
    body: [] as string[],
  },
  about: {
    kicker: "Clinton, Missouri",
    heading: "I am David James, and this is a gathering place.",
    lede: "",
    body: [
      "I live near Clinton. After years working in IT, I kept noticing the same thing: the technology that is supposed to help folks often just leaves them feeling left behind. AI is the biggest one yet — and the hype around it can be downright intimidating.",
      "So I started AI for Missouri with a simple goal: make this stuff approachable and safe for regular people. Not scary, not salesy, just genuinely useful. I will not talk over your head, and I will not sell you something you do not need.",
      "The way that happens is live. I sit down with the tools in front of whoever showed up, take a real question from the room, and build something — a letter, a listing, a helper for a shop — while people watch every click. Then they do it themselves. A workshop in a library. A seminar for a chamber breakfast. A weekend hackathon in a gym that still smells like a basketball game.",
      "When I am not teaching, you will find me enjoying everything our corner of Missouri has to offer — the lakes, the small towns, and good neighbors. I would love to help yours.",
    ],
  },
  host: {
    kicker: "For libraries, chambers, churches, schools",
    heading: "If you have the room, we have the gathering.",
    lede: "We use AI live, in front of your people, to build something they can actually take home. A Saturday workshop, a chamber breakfast, or a weekend hackathon.",
    body: [] as string[],
  },
  faq: {
    kicker: "",
    heading: "Questions people actually ask.",
    lede: "",
    body: FAQS,
  },
} as const;

export type PageSlug = keyof typeof PAGE_DEFAULTS;

export type PageBodyItem = string | { q: string; a: string };

export type PageContent = {
  slug: string;
  kicker: string;
  heading: string;
  lede: string;
  body: PageBodyItem[];
};

type EventRow = {
  slug: string;
  kind: EventKind;
  title: string;
  lede: string;
  city: string;
  venue: string;
  region: string;
  start_date: string;
  end_date: string;
  when_label: string;
  time_label: string;
  duration_label: string;
  capacity: number;
  reserved: number;
  status: "upcoming" | "past";
  image: string;
  featured: boolean;
  who: unknown;
  bring: unknown;
  agenda: unknown;
  tracks: unknown;
  body: unknown;
};

function asArray<T>(value: unknown, map: (item: unknown) => T): T[] {
  if (Array.isArray(value)) return value.map(map);
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(map);
    } catch {
      return [];
    }
  }
  return [];
}

function rowToEvent(row: EventRow): EventItem {
  return {
    slug: row.slug,
    kind: row.kind,
    title: row.title,
    lede: row.lede,
    city: row.city,
    venue: row.venue,
    region: row.region,
    start: String(row.start_date).slice(0, 10),
    end: String(row.end_date).slice(0, 10),
    whenLabel: row.when_label,
    timeLabel: row.time_label,
    durationLabel: row.duration_label,
    capacity: Number(row.capacity),
    reserved: Number(row.reserved),
    status: row.status,
    image: row.image,
    featured: Boolean(row.featured),
    who: asArray(row.who, (item) => String(item)),
    bring: asArray(row.bring, (item) => String(item)),
    agenda: asArray(row.agenda, (item) => {
      const rec = item as { time?: unknown; item?: unknown };
      return { time: String(rec.time ?? ""), item: String(rec.item ?? "") };
    }),
    tracks: asArray(row.tracks, (item) => {
      const rec = item as { name?: unknown; detail?: unknown };
      return { name: String(rec.name ?? ""), detail: String(rec.detail ?? "") };
    }),
    body: asArray(row.body, (item) => String(item)),
  };
}

async function ensureSeeded() {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const count = await sql<{ n: number }>`select count(*)::int as n from events`;
  if ((count[0]?.n ?? 0) === 0) {
    for (const event of EVENTS) {
      await insertEventRow(event, null);
    }
  }
  const pages = await sql<{ n: number }>`select count(*)::int as n from pages`;
  if ((pages[0]?.n ?? 0) === 0) {
    for (const [slug, page] of Object.entries(PAGE_DEFAULTS)) {
      await sql.query(
        `insert into pages (slug, heading, kicker, lede, body)
         values ($1, $2, $3, $4, $5::jsonb)
         on conflict (slug) do nothing`,
        [slug, page.heading, page.kicker, page.lede, JSON.stringify(page.body)],
      );
    }
  } else {
    for (const [slug, page] of Object.entries(PAGE_DEFAULTS)) {
      await sql.query(
        `update pages
         set heading = $2, kicker = $3, lede = $4, body = $5::jsonb, updated_at = now()
         where slug = $1 and updated_by is null`,
        [slug, page.heading, page.kicker, page.lede, JSON.stringify(page.body)],
      );
    }
  }
}

async function insertEventRow(event: EventItem, updatedBy: string | null) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  await sql.query(
    `insert into events (
       slug, kind, title, lede, city, venue, region,
       start_date, end_date, when_label, time_label, duration_label,
       capacity, reserved, status, image, featured,
       who, bring, agenda, tracks, body, updated_by
     ) values (
       $1,$2,$3,$4,$5,$6,$7,
       $8,$9,$10,$11,$12,
       $13,$14,$15,$16,$17,
       $18::jsonb,$19::jsonb,$20::jsonb,$21::jsonb,$22::jsonb,$23
     )
     on conflict (slug) do update set
       kind = excluded.kind,
       title = excluded.title,
       lede = excluded.lede,
       city = excluded.city,
       venue = excluded.venue,
       region = excluded.region,
       start_date = excluded.start_date,
       end_date = excluded.end_date,
       when_label = excluded.when_label,
       time_label = excluded.time_label,
       duration_label = excluded.duration_label,
       capacity = excluded.capacity,
       reserved = excluded.reserved,
       status = excluded.status,
       image = excluded.image,
       featured = excluded.featured,
       who = excluded.who,
       bring = excluded.bring,
       agenda = excluded.agenda,
       tracks = excluded.tracks,
       body = excluded.body,
       updated_at = now(),
       updated_by = excluded.updated_by`,
    [
      event.slug,
      event.kind,
      event.title,
      event.lede,
      event.city,
      event.venue,
      event.region,
      event.start,
      event.end,
      event.whenLabel,
      event.timeLabel,
      event.durationLabel,
      event.capacity,
      event.reserved,
      event.status,
      event.image,
      event.featured ?? false,
      JSON.stringify(event.who),
      JSON.stringify(event.bring),
      JSON.stringify(event.agenda),
      event.tracks ? JSON.stringify(event.tracks) : null,
      JSON.stringify(event.body),
      updatedBy,
    ],
  );
}

const eventInput = z.object({
  slug: z.string().min(2).max(80),
  kind: z.enum(["hackathon", "workshop", "seminar"]),
  title: z.string().min(3).max(120),
  lede: z.string().min(8).max(400),
  city: z.string().min(2).max(80),
  venue: z.string().min(2).max(160),
  region: z.string().min(2).max(80),
  start: z.string().min(8).max(10),
  end: z.string().min(8).max(10),
  whenLabel: z.string().min(3).max(80),
  timeLabel: z.string().min(3).max(80),
  durationLabel: z.string().min(2).max(40),
  capacity: z.number().int().min(4).max(400),
  reserved: z.number().int().min(0).max(400),
  status: z.enum(["upcoming", "past"]),
  image: z.string().min(4).max(200),
  featured: z.boolean(),
  who: z.array(z.string()),
  bring: z.array(z.string()),
  agenda: z.array(z.object({ time: z.string(), item: z.string() })),
  tracks: z.array(z.object({ name: z.string(), detail: z.string() })).optional(),
  body: z.array(z.string()),
});

export const listPublicEvents = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      await ensureSeeded();
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql<EventRow>`
        select * from events order by start_date, slug
      `;
      return rows.map(rowToEvent);
    } catch {
      return EVENTS;
    }
  },
);

export const getPublicEvent = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    try {
      await ensureSeeded();
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql<EventRow>`
        select * from events where slug = ${data.slug} limit 1
      `;
      return rows[0] ? rowToEvent(rows[0]) : null;
    } catch {
      return EVENTS.find((event) => event.slug === data.slug) ?? null;
    }
  });

export const getPublicPage = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }): Promise<PageContent> => {
    const fallback = PAGE_DEFAULTS[data.slug as PageSlug];
    const base: PageContent = fallback
      ? {
          slug: data.slug,
          kicker: fallback.kicker,
          heading: fallback.heading,
          lede: fallback.lede,
          body: [...(fallback.body as unknown as PageBodyItem[])],
        }
      : { slug: data.slug, kicker: "", heading: "", lede: "", body: [] };
    try {
      await ensureSeeded();
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql<{
        slug: string;
        heading: string | null;
        kicker: string | null;
        lede: string | null;
        body: unknown;
      }>`select slug, heading, kicker, lede, body from pages where slug = ${data.slug} limit 1`;
      const row = rows[0];
      if (!row) return base;
      return {
        slug: row.slug,
        heading: row.heading ?? base.heading,
        kicker: row.kicker ?? base.kicker,
        lede: row.lede ?? base.lede,
        body: asArray(row.body, (item): PageBodyItem => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object" && "q" in item) {
            const rec = item as { q: unknown; a: unknown };
            return { q: String(rec.q ?? ""), a: String(rec.a ?? "") };
          }
          return String(item);
        }),
      };
    } catch {
      return base;
    }
  });

export const saveEvent = createServerFn({ method: "POST" })
  .middleware([staffMiddleware])
  .validator(eventInput)
  .handler(async ({ data, context }) => {
    const event: EventItem = {
      ...data,
      tracks: data.tracks && data.tracks.length > 0 ? data.tracks : undefined,
    };
    await insertEventRow(event, context.staff.email);
    return { ok: true as const, slug: event.slug };
  });

export const deleteEvent = createServerFn({ method: "POST" })
  .middleware([staffMiddleware])
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`delete from events where slug = ${data.slug}`;
    return { ok: true as const };
  });

export const savePage = createServerFn({ method: "POST" })
  .middleware([staffMiddleware])
  .validator(
    z.object({
      slug: z.string().min(2).max(40),
      heading: z.string().max(200),
      kicker: z.string().max(120),
      lede: z.string().max(600),
      body: z.array(z.union([z.string(), z.object({ q: z.string(), a: z.string() })])),
    }),
  )
  .handler(async ({ data, context }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into pages (slug, heading, kicker, lede, body, updated_by, updated_at)
       values ($1,$2,$3,$4,$5::jsonb,$6, now())
       on conflict (slug) do update set
         heading = excluded.heading,
         kicker = excluded.kicker,
         lede = excluded.lede,
         body = excluded.body,
         updated_by = excluded.updated_by,
         updated_at = now()`,
      [
        data.slug,
        data.heading,
        data.kicker,
        data.lede,
        JSON.stringify(data.body),
        context.staff.email,
      ],
    );
    return { ok: true as const };
  });
