import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EventItem } from "@/lib/events";
import { kindLabel } from "@/lib/events";
import { cn } from "@/lib/utils";

export function EventCard({
  event,
  featured = false,
}: {
  event: EventItem;
  featured?: boolean;
}) {
  return (
    <Link
      to="/events/$slug"
      params={{ slug: event.slug }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-[box-shadow,transform] duration-200 ease-out hover:shadow-card-hover",
        featured ? "md:flex-row" : "",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          featured ? "md:w-[46%] md:min-h-full" : "aspect-[3/2]",
        )}
      >
        <img
          src={event.image}
          alt=""
          className="media h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <Badge
          variant={event.kind}
          className="absolute left-3 top-3 bg-paper text-foreground"
        >
          {kindLabel(event.kind)}
        </Badge>
      </div>
      <div className={cn("flex flex-1 flex-col p-5", featured && "md:p-7")}>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {event.whenLabel}
        </p>
        <h3
          className={cn(
            "mt-2 font-display tracking-tight text-foreground",
            featured ? "text-2xl md:text-3xl" : "text-xl",
          )}
        >
          {event.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {event.lede}
        </p>
        <p className="mt-4 flex items-center gap-1.5 text-sm text-foreground/80">
          <MapPin className="size-3.5 text-moss" aria-hidden />
          {event.venue}, {event.city}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-primary">
          {event.status === "past" ? "See how it went" : "Details & RSVP"}
          <ArrowUpRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
