import { createFileRoute, Link } from "@tanstack/react-router";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import {
  type EventKind,
  eventsByKind,
  pastEvents,
  upcomingEvents,
} from "@/lib/events";
import { cn } from "@/lib/utils";

type EventsSearch = { kind?: EventKind };

export const Route = createFileRoute("/events/")({
  validateSearch: (search: Record<string, unknown>): EventsSearch => {
    if (
      search.kind === "hackathon" ||
      search.kind === "workshop" ||
      search.kind === "seminar"
    ) {
      return { kind: search.kind };
    }
    return {};
  },
  component: EventsPage,
  head: () => ({
    meta: [
      { title: "Calendar — AI for Missouri" },
      {
        name: "description",
        content:
          "Upcoming AI hackathons, workshops, and seminars across Missouri.",
      },
    ],
  }),
});

const FILTERS: { id: EventKind | "all"; label: string }[] = [
  { id: "all", label: "All gatherings" },
  { id: "workshop", label: "Workshops" },
  { id: "seminar", label: "Seminars" },
  { id: "hackathon", label: "Hackathons" },
];

function EventsPage() {
  const { kind: kindParam } = Route.useSearch();
  const kind = kindParam ?? "all";
  const list = eventsByKind(kind);
  const past = kind === "all" ? pastEvents() : pastEvents().filter((e) => e.kind === kind);
  const upcomingCount = upcomingEvents().length;

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {upcomingCount} upcoming
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
          The calendar.
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Libraries, chambers, gyms, and civic rooms from Clinton to the
          cities. Pick a gathering, bring a question.
        </p>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter by format"
        >
          {FILTERS.map((filter) => {
            const active = kind === filter.id;
            return (
              <Link
                key={filter.id}
                to="/events"
                search={filter.id === "all" ? {} : { kind: filter.id }}
                role="tab"
                aria-selected={active}
                className={cn(
                  "inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition-colors duration-150",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground ring-1 ring-border hover:bg-secondary",
                )}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        {list.length === 0 ? (
          <p className="mt-12 text-muted-foreground">
            Nothing in that format just now. Try the full calendar, or{" "}
            <Link to="/host" className="text-primary underline-offset-2 hover:underline">
              host one
            </Link>
            .
          </p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        )}

        {past.length > 0 ? (
          <div className="mt-20">
            <h2 className="font-display text-2xl tracking-tight">Already happened</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {past.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-16 rounded-2xl bg-card p-6 shadow-card sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="font-display text-2xl">Do not see your town?</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              That is what the traveling calendar is for. A room and a date
              get us most of the way.
            </p>
          </div>
          <Button asChild className="mt-4 sm:mt-0">
            <Link to="/host">Bring one to your town</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
