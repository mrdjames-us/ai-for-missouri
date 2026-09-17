import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getPublicPage, savePage, type PageBodyItem, type PageSlug } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const TABS: { id: PageSlug; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "host", label: "Host" },
  { id: "faq", label: "Questions" },
];

export const Route = createFileRoute("/admin/pages")({
  loader: async () => {
    const [home, about, host, faq] = await Promise.all([
      getPublicPage({ data: { slug: "home" } }),
      getPublicPage({ data: { slug: "about" } }),
      getPublicPage({ data: { slug: "host" } }),
      getPublicPage({ data: { slug: "faq" } }),
    ]);
    return { home, about, host, faq };
  },
  component: AdminPages,
});

function AdminPages() {
  const pages = Route.useLoaderData();
  const [tab, setTab] = useState<PageSlug>("home");
  const page = pages[tab];
  const [kicker, setKicker] = useState(page.kicker);
  const [heading, setHeading] = useState(page.heading);
  const [lede, setLede] = useState(page.lede);
  const [bodyText, setBodyText] = useState(bodyToText(tab, page.body));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function switchTab(next: PageSlug) {
    setTab(next);
    const current = pages[next];
    setKicker(current.kicker);
    setHeading(current.heading);
    setLede(current.lede);
    setBodyText(bodyToText(next, current.body));
    setSaved(false);
    setError(null);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const body = textToBody(tab, bodyText);
      await savePage({
        data: { slug: tab, kicker, heading, lede, body },
      });
      pages[tab] = { slug: tab, kicker, heading, lede, body };
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Pages
      </p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Words on the site.</h1>
      <div className="mt-6 flex flex-wrap gap-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => switchTab(item.id)}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium",
              tab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <form className="mt-8 max-w-3xl space-y-5" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="kicker">Kicker</Label>
          <Input id="kicker" value={kicker} onChange={(e) => setKicker(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="heading">Heading</Label>
          <Input id="heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
        </div>
        {tab !== "faq" ? (
          <div className="space-y-1.5">
            <Label htmlFor="lede">Lede</Label>
            <Textarea id="lede" rows={3} value={lede} onChange={(e) => setLede(e.target.value)} />
          </div>
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="body">
            {tab === "faq"
              ? "Questions (`Q | A`, one per line)"
              : "Body (blank line between paragraphs)"}
          </Label>
          <Textarea id="body" rows={14} value={bodyText} onChange={(e) => setBodyText(e.target.value)} />
        </div>
        {error ? (
          <p className="text-sm text-brick" role="alert">
            {error}
          </p>
        ) : null}
        {saved ? <p className="text-sm text-forest">Saved.</p> : null}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save page"}
        </Button>
      </form>
    </div>
  );
}

function bodyToText(slug: PageSlug, body: unknown[]) {
  if (slug === "faq") {
    return body
      .map((item) => {
        const rec = item as { q?: string; a?: string };
        return `${rec.q ?? ""} | ${rec.a ?? ""}`;
      })
      .join("\n");
  }
  return body.map((item) => String(item)).join("\n\n");
}

function textToBody(slug: PageSlug, text: string): PageBodyItem[] {
  if (slug === "faq") {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [q, ...rest] = line.split("|");
        return { q: (q ?? "").trim(), a: rest.join("|").trim() };
      });
  }
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}
