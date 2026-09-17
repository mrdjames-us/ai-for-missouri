import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/events")({
  component: EventsLayout,
});

function EventsLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="border-b border-border bg-paper">
        <SiteHeader />
      </div>
      <Outlet />
      <SiteFooter />
    </div>
  );
}
