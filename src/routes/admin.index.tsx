import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Staff desk
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">
        Change the gatherings from here.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Add a workshop, move a date, fix a venue, or rewrite the about page.
        Each person signs in with their own email. David puts them on the
        staff list first.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            to: "/admin/events",
            icon: CalendarDays,
            title: "Calendar",
            detail: "New gatherings, edits, past vs upcoming, featured on home.",
          },
          {
            to: "/admin/pages",
            icon: FileText,
            title: "Pages",
            detail: "Home, about, host, and the questions people ask.",
          },
          {
            to: "/admin/staff",
            icon: Users,
            title: "Staff",
            detail: "Add someone by email. They sign in with that same address.",
          },
        ].map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-2xl bg-card p-6 shadow-card transition-transform duration-150 hover:-translate-y-0.5"
          >
            <card.icon className="size-5 text-primary" />
            <p className="mt-4 font-display text-2xl tracking-tight">{card.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {card.detail}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Everyday door
          </p>
          <p className="mt-3 font-display text-xl">This desk</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            For people who should set events and update pages. Add their email
            on Staff. They create an account with that address, then they work
            here — no code, no GitHub.
          </p>
          <div className="mt-5">
            <Button asChild size="sm">
              <Link to="/admin/staff">Add someone</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Coding door
          </p>
          <p className="mt-3 font-display text-xl">GitHub + MCP</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            For people who already use Cursor, Claude, or Grok with GitHub.
            Add them as a collaborator on the public repo. Their MCP talks to
            GitHub — that is how they change the code. This desk is still how
            they change the live calendar.
          </p>
          <div className="mt-5">
            <Button asChild variant="outline" size="sm">
              <a
                href="https://github.com/mrdjames-us/ai-for-missouri"
                target="_blank"
                rel="noreferrer"
              >
                Open the GitHub repo
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
