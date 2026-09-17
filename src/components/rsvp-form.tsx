import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EventItem } from "@/lib/events";
import { useRsvpStore } from "@/lib/rsvp";

export function RsvpForm({ event }: { event: EventItem }) {
  const addRsvp = useRsvpStore((s) => s.addRsvp);
  const already = useRsvpStore((s) =>
    s.rsvps.some((r) => r.eventSlug === event.slug),
  );
  const [justSent, setJustSent] = useState(false);
  const sent = already || justSent;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [town, setTown] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    addRsvp({
      eventSlug: event.slug,
      name: name.trim(),
      email: email.trim(),
      town: town.trim(),
      role: role.trim(),
      notes: notes.trim(),
    });
    setJustSent(true);
  }

  if (event.status === "past") {
    return (
      <div className="rounded-xl bg-secondary p-5">
        <p className="font-display text-lg text-foreground">This one already happened.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Watch the calendar for the next gathering in {event.city}, or{" "}
          <Link to="/host" className="text-primary underline-offset-2 hover:underline">
            bring one to your town
          </Link>
          .
        </p>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-primary p-6 text-primary-foreground">
        <p className="flex items-center gap-2 font-display text-xl">
          <Check className="size-5" aria-hidden />
          You are on the list.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
          We will write {email || "you"} with parking, what to bring, and any
          room changes. If plans shift, email{" "}
          <a
            href="mailto:david@aiformissouri.com"
            className="underline underline-offset-2"
          >
            david@aiformissouri.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="rsvp-name">Name</Label>
          <Input
            id="rsvp-name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rsvp-email">Email</Label>
          <Input
            id="rsvp-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="rsvp-town">Town</Label>
          <Input
            id="rsvp-town"
            autoComplete="address-level2"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            placeholder="Clinton, Sedalia…"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rsvp-role">I am a…</Label>
          <Input
            id="rsvp-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="shop owner, teacher, curious neighbor"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="rsvp-notes">Anything we should know?</Label>
        <Textarea
          id="rsvp-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="A question, an accessibility need, a teammate…"
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        RSVP for {event.city}
      </Button>
    </form>
  );
}
