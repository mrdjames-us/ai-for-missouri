import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — AI for Missouri" },
      {
        name: "description",
        content:
          "David James hosts AI hackathons, workshops, and seminars from Clinton, Missouri.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="border-b border-border bg-paper">
        <SiteHeader />
      </div>
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Clinton, Missouri
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            I am David James, and this is a gathering place.
          </h1>
          <div className="mt-8 overflow-hidden rounded-2xl">
            <img
              src="/images/hero-square.jpg"
              alt="Courthouse square in a west-central Missouri town"
              className="media aspect-[16/9] w-full object-cover"
            />
          </div>
          <div className="mt-10 space-y-5 text-base leading-relaxed text-foreground/90">
            <p>
              I live near Clinton. After years working in IT, I kept noticing
              the same thing: the technology that is supposed to help folks
              often just leaves them feeling left behind. AI is the biggest one
              yet — and the hype around it can be downright intimidating.
            </p>
            <p>
              So I started AI for Missouri with a simple goal: make this stuff
              approachable and safe for regular people. Not scary, not salesy,
              just genuinely useful. I will not talk over your head, and I will
              not sell you something you do not need.
            </p>
            <p>
              The way that happens now is gatherings. A workshop in a library.
              A seminar for a chamber breakfast. A weekend hackathon in a gym
              that still smells like a basketball game. The point is a room of
              Missouri neighbors using the tools on a problem they actually
              have.
            </p>
            <p>
              When I am not teaching, you will find me enjoying everything our
              corner of Missouri has to offer — the lakes, the small towns, and
              good neighbors. I would love to help yours.
            </p>
            <p className="font-display text-xl">— David</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { n: "Workshops", d: "Hands-on, small rooms, your own device." },
              { n: "Seminars", d: "Straight talk for a civic or chamber crowd." },
              { n: "Hackathons", d: "A day or a weekend of building together." },
            ].map((item) => (
              <div key={item.n} className="rounded-xl bg-card p-4 shadow-card">
                <p className="font-display text-lg">{item.n}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-secondary p-6">
            <h2 className="font-display text-2xl">Come to a gathering — or host one.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Write anytime:{" "}
              <a
                href="mailto:david@aiformissouri.com"
                className="text-primary underline-offset-2 hover:underline"
              >
                david@aiformissouri.com
              </a>
              {" · "}
              <a
                href="tel:+16608692868"
                className="text-primary underline-offset-2 hover:underline"
              >
                (660) 869-2868
              </a>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/events">See the calendar</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/host">Host in your town</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
