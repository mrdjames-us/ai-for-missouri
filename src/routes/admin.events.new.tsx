import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { EventEditor } from "@/components/event-editor";
import { saveEvent } from "@/lib/content";
import type { EventItem } from "@/lib/events";

export const Route = createFileRoute("/admin/events/new")({
  component: NewEventPage,
});

function NewEventPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(event: EventItem) {
    setSaving(true);
    setError(null);
    try {
      await saveEvent({ data: { ...event, featured: Boolean(event.featured) } });
      await navigate({ to: "/admin/events" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
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
      <h1 className="mt-4 font-display text-4xl tracking-tight">New gathering</h1>
      {error ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-8">
        <EventEditor onSave={(event) => void onSave(event)} saving={saving} />
      </div>
    </div>
  );
}
