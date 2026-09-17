import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteFooter } from "@/components/site-footer";
import appCss from "../styles.css?url";

const APP_NAME = "AI for Missouri";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "AI hackathons, workshops, and seminars across Missouri. Plain English, real towns, hosted by David James from Clinton.",
      },
      { name: "theme-color", content: "#1e4636" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
      },
    ],
  }),
  notFoundComponent: NotFound,
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <PreviewHostBridge />
        <AuthProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2"
          >
            Skip to content
          </a>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <div className="mx-auto flex max-w-lg flex-1 flex-col justify-center px-6 py-20 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Off the map
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">
          That page is not on the calendar.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Try the gatherings list, or head home.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Home
          </Link>
          <Link
            to="/events"
            className="inline-flex h-11 items-center rounded-md bg-secondary px-5 text-sm font-medium"
          >
            Calendar
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
