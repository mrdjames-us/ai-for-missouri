import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/events")({
  component: () => <Outlet />,
});
