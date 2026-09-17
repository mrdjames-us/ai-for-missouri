import { useState, type FormEvent } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { addStaff, getStaffSession, listStaff, removeStaff } from "@/lib/staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/staff")({
  loader: async () => {
    const [people, me] = await Promise.all([listStaff(), getStaffSession()]);
    return { people, me };
  },
  component: AdminStaff,
});

function AdminStaff() {
  const { people, me } = Route.useLoaderData();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"editor" | "owner">("editor");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [invite, setInvite] = useState<{ email: string; name?: string } | null>(
    null,
  );
  const isOwner = me.role === "owner";

  async function onAdd(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const nextEmail = email.trim().toLowerCase();
      await addStaff({ data: { email: nextEmail, name: name.trim() || undefined, role } });
      setInvite({ email: nextEmail, name: name.trim() || undefined });
      setEmail("");
      setName("");
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add staff.");
    } finally {
      setBusy(false);
    }
  }

  async function onRemove(target: string) {
    if (!window.confirm(`Remove ${target} from staff?`)) return;
    try {
      await removeStaff({ data: { email: target } });
      if (invite?.email === target) setInvite(null);
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove staff.");
    }
  }

  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Staff
      </p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Who can change this site.</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        {isOwner
          ? "Add their email. They create an account with that same address, then they can edit gatherings and pages. Owners can add more staff."
          : "You can edit the calendar and pages. Only an owner can add or remove people."}
      </p>

      <ul className="mt-8 divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
        {people.map((person) => (
          <li key={person.email} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="font-medium">{person.name ?? person.email}</p>
              <p className="text-sm text-muted-foreground">{person.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={person.role === "owner" ? "forest" : "default"}>
                {person.role}
              </Badge>
              {isOwner && person.email !== me.email ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void onRemove(person.email)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {invite ? (
        <div className="mt-8 rounded-2xl bg-card p-6 shadow-card">
          <p className="font-display text-xl">Send them this</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {invite.name ? `${invite.name} is` : "They are"} on the staff list
            as {invite.email}. Copy the note below.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-paper p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {`You're on staff for AI for Missouri.

1. Open the site and go to Staff desk
2. Create an account with ${invite.email} (that exact address)
3. Sign in — you can then edit gatherings and pages

If you also work in Cursor or Grok with GitHub, send David your GitHub username so he can add you as a collaborator.`}
          </pre>
        </div>
      ) : null}

      {isOwner ? (
        <form className="mt-10 space-y-4 rounded-2xl bg-card p-6 shadow-card" onSubmit={onAdd}>
          <p className="font-display text-xl">Add someone</p>
          <div className="space-y-1.5">
            <Label htmlFor="staff-name">Name</Label>
            <Input id="staff-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="staff-email">Email</Label>
            <Input
              id="staff-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="staff-role">Role</Label>
            <select
              id="staff-role"
              className="flex h-11 w-full rounded-md bg-paper px-3.5 text-base shadow-[inset_0_0_0_1px_var(--color-border)]"
              value={role}
              onChange={(e) => setRole(e.target.value as "editor" | "owner")}
            >
              <option value="editor">Editor — calendar and pages</option>
              <option value="owner">Owner — can add staff</option>
            </select>
          </div>
          {error ? (
            <p className="text-sm text-brick" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={busy}>
            {busy ? "Adding…" : "Add to staff"}
          </Button>
        </form>
      ) : error ? (
        <p className="mt-6 text-sm text-brick" role="alert">
          {error}
        </p>
      ) : null}

      <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
        MCP access is through GitHub, not a separate login. Add their GitHub
        username as a collaborator on{" "}
        <a
          className="font-medium text-foreground underline-offset-2 hover:underline"
          href="https://github.com/mrdjames-us/ai-for-missouri"
          target="_blank"
          rel="noreferrer"
        >
          mrdjames-us/ai-for-missouri
        </a>
        . Send David the username if you want that door opened.
      </p>
    </div>
  );
}
