import { useState, type FormEvent } from "react";
import { EVENT_IMAGES } from "@/lib/content";
import { FORMATS, type EventItem, type EventKind } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function agendaText(event?: EventItem) {
  return (event?.agenda ?? []).map((row) => `${row.time} | ${row.item}`).join("\n");
}

function tracksText(event?: EventItem) {
  return (event?.tracks ?? []).map((row) => `${row.name} — ${row.detail}`).join("\n");
}

export function EventEditor({
  event,
  onSave,
  saving,
}: {
  event?: EventItem;
  onSave: (next: EventItem) => void;
  saving?: boolean;
}) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [kind, setKind] = useState<EventKind>(event?.kind ?? "workshop");
  const [lede, setLede] = useState(event?.lede ?? "");
  const [city, setCity] = useState(event?.city ?? "");
  const [venue, setVenue] = useState(event?.venue ?? "");
  const [region, setRegion] = useState(event?.region ?? "West Central");
  const [start, setStart] = useState(event?.start ?? "");
  const [end, setEnd] = useState(event?.end ?? "");
  const [whenLabel, setWhenLabel] = useState(event?.whenLabel ?? "");
  const [timeLabel, setTimeLabel] = useState(event?.timeLabel ?? "");
  const [durationLabel, setDurationLabel] = useState(event?.durationLabel ?? "");
  const [capacity, setCapacity] = useState(event?.capacity ?? 24);
  const [reserved, setReserved] = useState(event?.reserved ?? 0);
  const [status, setStatus] = useState<EventItem["status"]>(event?.status ?? "upcoming");
  const [image, setImage] = useState(event?.image ?? EVENT_IMAGES[1].src);
  const [featured, setFeatured] = useState(Boolean(event?.featured));
  const [who, setWho] = useState((event?.who ?? []).join("\n"));
  const [bring, setBring] = useState((event?.bring ?? []).join("\n"));
  const [body, setBody] = useState((event?.body ?? []).join("\n\n"));
  const [agenda, setAgenda] = useState(agendaText(event));
  const [tracks, setTracks] = useState(tracksText(event));

  function submit(formEvent: FormEvent) {
    formEvent.preventDefault();
    const nextSlug = slug || slugify(title);
    onSave({
      slug: nextSlug,
      kind,
      title: title.trim(),
      lede: lede.trim(),
      city: city.trim(),
      venue: venue.trim(),
      region: region.trim(),
      start,
      end: end || start,
      whenLabel: whenLabel.trim(),
      timeLabel: timeLabel.trim(),
      durationLabel: durationLabel.trim(),
      capacity: Number(capacity),
      reserved: Number(reserved),
      status,
      image,
      featured,
      who: lines(who),
      bring: lines(bring),
      agenda: lines(agenda).map((line) => {
        const [time, ...rest] = line.split("|");
        return {
          time: (time ?? "").trim(),
          item: rest.join("|").trim() || (time ?? "").trim(),
        };
      }),
      tracks: lines(tracks).map((line) => {
        const [name, ...rest] = line.split("—");
        return {
          name: (name ?? "").trim(),
          detail: rest.join("—").trim(),
        };
      }),
      body: body
        .split(/\n\s*\n/)
        .map((part) => part.trim())
        .filter(Boolean),
    });
  }

  const field = "space-y-1.5";
  const selectClass =
    "flex h-11 w-full rounded-md bg-paper px-3.5 text-base shadow-[inset_0_0_0_1px_var(--color-border)] focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-ring)]";

  return (
    <form className="grid gap-8 lg:grid-cols-2" onSubmit={submit}>
      <div className="space-y-5">
        <div className={field}>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!event) setSlug(slugify(e.target.value));
            }}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={field}>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              required
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              disabled={Boolean(event)}
            />
          </div>
          <div className={field}>
            <Label htmlFor="kind">Format</Label>
            <select
              id="kind"
              className={selectClass}
              value={kind}
              onChange={(e) => setKind(e.target.value as EventKind)}
            >
              {(Object.keys(FORMATS) as EventKind[]).map((id) => (
                <option key={id} value={id}>
                  {FORMATS[id].label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={field}>
          <Label htmlFor="lede">Lede</Label>
          <Textarea id="lede" required rows={3} value={lede} onChange={(e) => setLede(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={field}>
            <Label htmlFor="city">City</Label>
            <Input id="city" required value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className={field}>
            <Label htmlFor="region">Region</Label>
            <Input id="region" required value={region} onChange={(e) => setRegion(e.target.value)} />
          </div>
        </div>
        <div className={field}>
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" required value={venue} onChange={(e) => setVenue(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={field}>
            <Label htmlFor="start">Start date</Label>
            <Input id="start" type="date" required value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className={field}>
            <Label htmlFor="end">End date</Label>
            <Input id="end" type="date" required value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <div className={field}>
          <Label htmlFor="when">When label</Label>
          <Input
            id="when"
            required
            placeholder="Saturday, November 14, 2026"
            value={whenLabel}
            onChange={(e) => setWhenLabel(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={field}>
            <Label htmlFor="time">Hours</Label>
            <Input
              id="time"
              required
              placeholder="10:00 a.m. – 6:00 p.m."
              value={timeLabel}
              onChange={(e) => setTimeLabel(e.target.value)}
            />
          </div>
          <div className={field}>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              required
              placeholder="One day"
              value={durationLabel}
              onChange={(e) => setDurationLabel(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className={field}>
            <Label htmlFor="capacity">Seats</Label>
            <Input
              id="capacity"
              type="number"
              min={4}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
          </div>
          <div className={field}>
            <Label htmlFor="reserved">Already counted</Label>
            <Input
              id="reserved"
              type="number"
              min={0}
              value={reserved}
              onChange={(e) => setReserved(Number(e.target.value))}
            />
          </div>
          <div className={field}>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className={selectClass}
              value={status}
              onChange={(e) => setStatus(e.target.value as EventItem["status"])}
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
        <div className={field}>
          <Label htmlFor="image">Photo</Label>
          <select
            id="image"
            className={selectClass}
            value={image}
            onChange={(e) => setImage(e.target.value)}
          >
            {EVENT_IMAGES.map((item) => (
              <option key={item.src} value={item.src}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Feature on the home page
        </label>
        <div className={field}>
          <Label htmlFor="who">Who it is for (one per line)</Label>
          <Textarea id="who" rows={3} value={who} onChange={(e) => setWho(e.target.value)} />
        </div>
        <div className={field}>
          <Label htmlFor="bring">What to bring (one per line)</Label>
          <Textarea id="bring" rows={3} value={bring} onChange={(e) => setBring(e.target.value)} />
        </div>
        <div className={field}>
          <Label htmlFor="agenda">Agenda (`10:00 | Doors and coffee`)</Label>
          <Textarea id="agenda" rows={6} value={agenda} onChange={(e) => setAgenda(e.target.value)} />
        </div>
        <div className={field}>
          <Label htmlFor="tracks">Tracks, optional (`Farm & ranch — The form you keep putting off`)</Label>
          <Textarea id="tracks" rows={4} value={tracks} onChange={(e) => setTracks(e.target.value)} />
        </div>
        <div className={field}>
          <Label htmlFor="body">The story (blank line between paragraphs)</Label>
          <Textarea id="body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : event ? "Save gathering" : "Publish gathering"}
        </Button>
      </div>
    </form>
  );
}
