import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getStaffSession, type StaffSession } from "@/lib/staff";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Desk", exact: true },
  { to: "/admin/events", label: "Calendar", exact: false },
  { to: "/admin/pages", label: "Pages", exact: false },
  { to: "/admin/staff", label: "Staff", exact: false },
] as const;

function AdminLayout() {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [staff, setStaff] = useState<StaffSession | null>(null);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    getStaffSession()
      .then((session) => {
        if (!cancelled) {
          setStaff(session);
          setStaffError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setStaff(null);
          setStaffError(err instanceof Error ? err.message : "Not on staff.");
        }
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, isPending]);

  if (isPending || checking) {
    return (
      <div className="flex min-h-dvh flex-col bg-paper">
        <div className="border-b border-border">
          <SiteHeader />
        </div>
        <main className="mx-auto flex w-full max-w-5xl flex-1 items-start px-4 py-16">
          <div className="h-40 w-full animate-pulse rounded-2xl bg-card" />
        </main>
      </div>
    );
  }

  if (!user) return <RedirectToSignIn />;

  if (!staff) {
    return (
      <div className="flex min-h-dvh flex-col bg-paper">
        <div className="border-b border-border">
          <SiteHeader />
        </div>
        <main id="main" className="mx-auto w-full max-w-lg flex-1 px-4 py-20">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Staff desk
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-tight">
            You are signed in. You are not on staff yet.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {staffError ??
              "Ask David to add this email on the staff list. Same email you signed in with."}
          </p>
          <p className="mt-3 text-sm text-foreground">
            Signed in as {user.primaryEmail ?? user.displayName}.
          </p>
          <div className="mt-8">
            <UserButton />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <div className="border-b border-border">
        <SiteHeader />
      </div>
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <nav className="flex flex-wrap gap-1" aria-label="Staff">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.to
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="text-xs text-muted-foreground">
            {staff.name ?? staff.email} · {staff.role}
          </p>
        </div>
      </div>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
