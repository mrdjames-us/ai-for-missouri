import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRsvpStore } from "@/lib/rsvp";

export function HostForm() {
  const addHost = useRsvpStore((s) => s.addHost);
  const [sent, setSent] = useState(false);
  const [org, setOrg] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [town, setTown] = useState("");
  const [format, setFormat] = useState<"hackathon" | "workshop" | "seminar" | "unsure">(
    "unsure",
  );
  const [venue, setVenue] = useState("");
  const [timing, setTiming] = useState("");
  const [notes, setNotes] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!contactName.trim() || !email.trim() || !town.trim()) return;
    addHost({
      org: org.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      town: town.trim(),
      format,
      venue: venue.trim(),
      timing: timing.trim(),
      notes: notes.trim(),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-primary p-6 text-primary-foreground">
        <p className="flex items-center gap-2 font-display text-xl">
          <Check className="size-5" aria-hidden />
          Got it — we will write you back.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
          David reads these himself. If you need him sooner, call{" "}
          <a href="tel:+16608692868" className="underline underline-offset-2">
            (660) 869-2868
          </a>{" "}
          or email{" "}
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
          <Label htmlFor="host-name">Your name</Label>
          <Input
            id="host-name"
            required
            autoComplete="name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="host-email">Email</Label>
          <Input
            id="host-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="host-org">Library, chamber, church, school…</Label>
          <Input
            id="host-org"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="Clinton Public Library"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="host-town">Town</Label>
          <Input
            id="host-town"
            required
            value={town}
            onChange={(e) => setTown(e.target.value)}
          />
        </div>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground/80">
          What are you picturing?
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              ["workshop", "Workshop"],
              ["seminar", "Seminar"],
              ["hackathon", "Hackathon"],
              ["unsure", "Not sure"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex h-11 cursor-pointer items-center justify-center rounded-md bg-paper text-sm shadow-[inset_0_0_0_1px_var(--color-border)] has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:shadow-none"
            >
              <input
                type="radio"
                name="format"
                value={value}
                checked={format === value}
                onChange={() => setFormat(value)}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="host-venue">Room or venue, if you have one</Label>
          <Input
            id="host-venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="host-timing">When were you thinking?</Label>
          <Input
            id="host-timing"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            placeholder="A Saturday in November…"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="host-notes">Who would come, and what do they need?</Label>
        <Textarea
          id="host-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <Button type="submit">Send the note</Button>
    </form>
  );
}
