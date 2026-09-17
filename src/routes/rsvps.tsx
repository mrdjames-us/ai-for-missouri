import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { getEvent, kindLabel } from "@/lib/events";
import { useRsvpStore } from "@/lib/rsvp";

export const Route = createFileRoute("/rsvps")({
  component: RsvpsPage,
  head: () => ({
    meta: [{ title: "Your RSVPs — AI for Missouri" }],
  }),
});

function RsvpsPage() {
  const rsvps = useRsvpStore((s) => s.rsvps);
  const hosts = useRsvpStore((s) => s.hosts);

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="border-b border-border bg-paper">
        <SiteHeader />
      </div>
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6">
        <h1 className="font-display text-4xl tracking-tight">Your RSVPs</h1>
        <p className="mt-3 text-muted-foreground">
          Saved on this device. David also has the note — if you need to change
          plans, email{" "}
          <a
            href="mailto:david@aiformissouri.com"
            className="text-primary underline-offset-2 hover:underline"
          >
            david@aiformissouri.com
          </a>
          .
        </p>

        {rsvps.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-card p-6 shadow-card">
            <p className="font-display text-xl">No seats saved yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick a gathering and RSVP. It takes a minute.
            </p>
            <Button asChild className="mt-5">
              <Link to="/events">See the calendar</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {rsvps
              .slice()
              .reverse()
              .map((rsvp) => {
                const event = getEvent(rsvp.eventSlug);
                return (
                  <li key={rsvp.id} className="rounded-2xl bg-card p-5 shadow-card">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {event ? kindLabel(event.kind) : "Gathering"}
                    </p>
                    <p className="mt-1 font-display text-xl">
                      {event?.title ?? rsvp.eventSlug}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {event?.whenLabel} · {event?.city}
                    </p>
                    <p className="mt-3 text-sm">
                      {rsvp.name}
                      {rsvp.town ? ` · ${rsvp.town}` : ""}
                    </p>
                    {event ? (
                      <Link
                        to="/events/$slug"
                        params={{ slug: event.slug }}
                        className="mt-3 inline-block text-sm font-medium text-primary"
                      >
                        View gathering
                      </Link>
                    ) : null}
                  </li>
                );
              })}
          </ul>
        )}

        {hosts.length > 0 ? (
          <div className="mt-14">
            <h2 className="font-display text-2xl">Host notes you sent</h2>
            <ul className="mt-4 space-y-3">
              {hosts
                .slice()
                .reverse()
                .map((host) => (
                  <li key={host.id} className="rounded-xl bg-secondary p-4 text-sm">
                    <p className="font-medium">
                      {host.town}
                      {host.org ? ` · ${host.org}` : ""}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {host.format === "unsure" ? "Format to figure out" : host.format}
                      {host.timing ? ` · ${host.timing}` : ""}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
