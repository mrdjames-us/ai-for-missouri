import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { EventEditor } from "@/components/event-editor";
import { deleteEvent, getPublicEvent, saveEvent } from "@/lib/content";
import type { EventItem } from "@/lib/events";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/events/$slug")({
  loader: async ({ params }) => getPublicEvent({ data: { slug: params.slug } }),
  component: EditEventPage,
});

function EditEventPage() {
  const loaded = Route.useLoaderData();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loaded) {
    return (
      <div>
        <h1 className="font-display text-3xl">That gathering is not on the list.</h1>
        <Link to="/admin/events" className="mt-4 inline-block text-sm font-medium">
          Back to calendar
        </Link>
      </div>
    );
  }

  const event = loaded;

  async function onSave(next: EventItem) {
    setSaving(true);
    setError(null);
    try {
      await saveEvent({ data: { ...next, featured: Boolean(next.featured) } });
      await navigate({ to: "/admin/events" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!window.confirm(`Take “${event.title}” off the calendar?`)) return;
    try {
      await deleteEvent({ data: { slug: event.slug } });
      await navigate({ to: "/admin/events" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete.");
    }
  }

  return (
    <div>
      <Link
        to="/admin/events"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        ← Calendar
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-display text-4xl tracking-tight">{event.title}</h1>
        <Button type="button" variant="outline" onClick={() => void onDelete()}>
          Remove
        </Button>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-8">
        <EventEditor event={event} onSave={(next) => void onSave(next)} saving={saving} />
      </div>
    </div>
  );
}
