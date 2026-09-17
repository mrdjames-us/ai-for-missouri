import { createFileRoute, Link } from "@tanstack/react-router";
import { listPublicEvents } from "@/lib/content";
import { kindLabel } from "@/lib/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/events/")({
  loader: () => listPublicEvents(),
  component: AdminEventsList,
});

function AdminEventsList() {
  const events = Route.useLoaderData();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Calendar
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">Gatherings</h1>
        </div>
        <Button asChild>
          <Link to="/admin/events/new">New gathering</Link>
        </Button>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl bg-card shadow-card">
        <ul className="divide-y divide-border">
          {events.map((event) => (
            <li key={event.slug}>
              <Link
                to="/admin/events/$slug"
                params={{ slug: event.slug }}
                className="flex flex-col gap-2 px-5 py-4 hover:bg-secondary/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-display text-lg tracking-tight">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.whenLabel} · {event.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{kindLabel(event.kind)}</Badge>
                  {event.featured ? <Badge variant="forest">Featured</Badge> : null}
                  <span className="text-xs text-muted-foreground">{event.status}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
