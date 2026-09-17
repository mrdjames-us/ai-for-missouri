import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Users } from "lucide-react";
import { RsvpForm } from "@/components/rsvp-form";
import { Badge } from "@/components/ui/badge";
import { getEvent, kindLabel } from "@/lib/events";
import { useRsvpStore } from "@/lib/rsvp";

export const Route = createFileRoute("/events/$slug")({
  component: EventDetailPage,
  head: ({ params }) => {
    const event = getEvent(params.slug);
    return {
      meta: [
        {
          title: event
            ? `${event.title} — AI for Missouri`
            : "Gathering — AI for Missouri",
        },
      ],
    };
  },
});

function EventDetailPage() {
  const { slug } = Route.useParams();
  const event = getEvent(slug);
  const extra = useRsvpStore((s) => s.countFor(slug));

  if (!event) {
    return (
      <main id="main" className="mx-auto max-w-lg flex-1 px-6 py-20 text-center">
        <h1 className="font-display text-3xl">That gathering is not on the list.</h1>
        <Link
          to="/events"
          className="mt-6 inline-flex text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          Back to the calendar
        </Link>
      </main>
    );
  }

  const spokenFor = Math.min(event.capacity, event.reserved + extra);
  const remaining = Math.max(0, event.capacity - spokenFor);
  const fill = Math.round((spokenFor / event.capacity) * 100);

  return (
    <main id="main" className="flex-1">
      <div className="relative isolate h-[42vh] min-h-64 overflow-hidden bg-forest-deep sm:h-[48vh]">
        <img src={event.image} alt="" className="h-full w-full object-cover" />
        <div className="hero-shade absolute inset-0" />
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
        <article>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Calendar
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Badge variant={event.kind}>{kindLabel(event.kind)}</Badge>
            <Badge>{event.region}</Badge>
            {event.status === "past" ? <Badge>Already happened</Badge> : null}
          </div>
          <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
            {event.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {event.lede}
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-moss" aria-hidden />
              {event.whenLabel} · {event.timeLabel}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-moss" aria-hidden />
              {event.venue}, {event.city}
            </li>
            <li className="flex items-center gap-2">
              <Users className="size-4 text-moss" aria-hidden />
              {event.durationLabel} · room for {event.capacity}
            </li>
          </ul>

          <div className="mt-10 space-y-4 text-base leading-relaxed text-foreground/90">
            {event.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {event.tracks ? (
            <div className="mt-10">
              <h2 className="font-display text-2xl">Tracks</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {event.tracks.map((track) => (
                  <li key={track.name} className="rounded-xl bg-card p-4 shadow-card">
                    <p className="font-medium">{track.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{track.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-10">
            <h2 className="font-display text-2xl">The day</h2>
            <ol className="mt-4 divide-y divide-border rounded-2xl bg-card shadow-card">
              {event.agenda.map((row) => (
                <li
                  key={row.time}
                  className="grid grid-cols-[7rem_1fr] gap-4 px-5 py-3.5 text-sm"
                >
                  <span className="tabular-nums text-moss">{row.time}</span>
                  <span>{row.item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="font-display text-xl">Who it is for</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {event.who.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl">Bring</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {event.bring.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl bg-card p-6 shadow-card">
            <h2 className="font-display text-2xl">
              {event.status === "past" ? "This gathering" : "Save a seat"}
            </h2>
            {event.status === "upcoming" ? (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Seats spoken for</span>
                  <span className="tabular-nums">
                    {spokenFor} / {event.capacity}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-300"
                    style={{ width: `${fill}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {remaining === 0
                    ? "The room is full — write David to get on a waitlist."
                    : `${remaining} ${remaining === 1 ? "seat" : "seats"} still open.`}
                </p>
              </div>
            ) : null}
            <div className="mt-6">
              <RsvpForm event={event} />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
