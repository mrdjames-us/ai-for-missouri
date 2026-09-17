import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRsvpStore } from "@/lib/rsvp";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

const LINKS = [
  { to: "/events", label: "Calendar" },
  { to: "/host", label: "Host one" },
  { to: "/about", label: "About" },
] as const;

function Mark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      className={cn(
        "flex size-9 items-center justify-center rounded-md",
        inverse ? "bg-paper text-forest" : "bg-primary text-primary-foreground",
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <rect x="3" y="6" width="4" height="12" rx="1" />
        <rect x="10" y="3" width="4" height="15" rx="1" />
        <rect x="17" y="8" width="4" height="10" rx="1" />
      </svg>
    </span>
  );
}

function AuthSlot({ onHero }: { onHero: boolean }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-current/15" />;
  }
  return (
    <>
      <SignedIn>
        <Link
          to="/admin"
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium",
            onHero
              ? "text-paper/80 hover:text-paper"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Staff
        </Link>
        <span className={onHero ? "text-paper" : ""}>
          <UserButton />
        </span>
      </SignedIn>
      <SignedOut>
        {user ? null : (
          <Link
            to="/login"
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium",
              onHero
                ? "text-paper/70 hover:text-paper"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Staff
          </Link>
        )}
      </SignedOut>
    </>
  );
}

export function SiteHeader({ tone = "light" }: { tone?: "light" | "hero" }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const rsvpCount = useRsvpStore((s) => s.rsvps.length);
  const onHero = tone === "hero";

  return (
    <header
      className={cn(
        "relative z-30",
        onHero ? "text-paper" : "text-foreground",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Mark inverse={onHero} />
          <span className="min-w-0">
            <span className="block font-display text-lg leading-none tracking-tight">
              AI for Missouri
            </span>
            <span
              className={cn(
                "mt-0.5 hidden text-[11px] tracking-wide sm:block",
                onHero ? "text-paper/70" : "text-muted-foreground",
              )}
            >
              Hackathons · Workshops · Seminars · Live
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((link) => {
            const active =
              pathname === link.to || pathname.startsWith(`${link.to}/`);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  onHero
                    ? active
                      ? "bg-paper/15 text-paper"
                      : "text-paper/80 hover:bg-paper/10 hover:text-paper"
                    : active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {rsvpCount > 0 ? (
            <Link
              to="/rsvps"
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium",
                onHero
                  ? "text-paper/80 hover:text-paper"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Your RSVPs ({rsvpCount})
            </Link>
          ) : null}
          <AuthSlot onHero={onHero} />
          <Button
            asChild
            size="sm"
            variant={onHero ? "inverse" : "default"}
            className="ml-2"
          >
            <Link to="/events">See the calendar</Link>
          </Button>
        </nav>

        <button
          type="button"
          className={cn(
            "relative flex size-11 items-center justify-center rounded-md md:hidden",
            onHero ? "text-paper" : "text-foreground",
          )}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">Menu</span>
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-border bg-paper px-4 py-4 text-foreground md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            {rsvpCount > 0 ? (
              <Link
                to="/rsvps"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium hover:bg-secondary"
              >
                Your RSVPs ({rsvpCount})
              </Link>
            ) : null}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-base font-medium hover:bg-secondary"
            >
              Staff desk
            </Link>
            <Button asChild className="mt-2 w-full">
              <Link to="/events" onClick={() => setOpen(false)}>
                See the calendar
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
