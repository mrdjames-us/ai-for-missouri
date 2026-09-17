import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HostForm } from "@/components/host-form";
import { FORMATS } from "@/lib/events";
import { getPublicPage } from "@/lib/content";

export const Route = createFileRoute("/host")({
  loader: () => getPublicPage({ data: { slug: "host" } }),
  component: HostPage,
  head: () => ({
    meta: [
      { title: "Host a gathering — AI for Missouri" },
      {
        name: "description",
        content:
          "Bring a live AI gathering to your Missouri library, chamber, church, or school. We build in front of your people.",
      },
    ],
  }),
});

function HostPage() {
  const page = Route.useLoaderData();
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="border-b border-border bg-paper">
        <SiteHeader />
      </div>
      <main id="main" className="flex-1">
        <div className="relative isolate overflow-hidden bg-forest-deep text-paper">
          <img
            src="/images/format-seminar.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="hero-shade absolute inset-0" />
          <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-paper/60">
              {page.kicker}
            </p>
            <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
              {page.heading}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/80">
              {page.lede}
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-2xl">What we need from you</h2>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">A room.</span>{" "}
                Chairs, a table or two, power strips. A projector is how the
                live build reaches the back row. Workshops still need the table.
              </li>
              <li>
                <span className="font-medium text-foreground">A date.</span>{" "}
                Saturdays travel easiest. Weeknight seminars work for chambers.
              </li>
              <li>
                <span className="font-medium text-foreground">The people.</span>{" "}
                You already have the list — members, patrons, congregation,
                staff. We will help you word the invitation.
              </li>
              <li>
                <span className="font-medium text-foreground">Coffee helps.</span>{" "}
                It always does.
              </li>
            </ul>
            <div className="mt-10 space-y-4">
              {(Object.keys(FORMATS) as Array<keyof typeof FORMATS>).map((key) => {
                const format = FORMATS[key];
                return (
                  <div key={key} className="rounded-xl bg-card p-4 shadow-card">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {format.kicker}
                    </p>
                    <p className="mt-1 font-display text-lg">{format.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {format.detail}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Prefer to talk first?{" "}
              <a
                href="mailto:david@aiformissouri.com"
                className="text-primary underline-offset-2 hover:underline"
              >
                david@aiformissouri.com
              </a>{" "}
              or{" "}
              <a
                href="tel:+16608692868"
                className="text-primary underline-offset-2 hover:underline"
              >
                (660) 869-2868
              </a>
              .
            </p>
          </div>
          <div className="rounded-2xl bg-card p-6 shadow-card sm:p-8">
            <h2 className="font-display text-2xl">Tell us about the room</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              David reads these himself. A few sentences is plenty.
            </p>
            <div className="mt-6">
              <HostForm />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
