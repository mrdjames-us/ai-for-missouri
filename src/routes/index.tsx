import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Handshake,
  Landmark,
  Laptop,
  MapPin,
  Mic2,
  MonitorPlay,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EventCard } from "@/components/event-card";
import { FaqList } from "@/components/faq-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FORMATS, TOWNS, featuredFrom, nextPaidAndReady, upcomingFrom } from "@/lib/events";
import { getPublicPage, listPublicEvents } from "@/lib/content";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [events, home, faq] = await Promise.all([
      listPublicEvents(),
      getPublicPage({ data: { slug: "home" } }),
      getPublicPage({ data: { slug: "faq" } }),
    ]);
    return { events, home, faq };
  },
  component: Home,
  head: () => ({
    meta: [
      {
        title: "AI for Missouri — Hackathons, Workshops & Seminars",
      },
      {
        name: "description",
        content:
          "I use AI live, in front of people, to build things. Hackathons, workshops, and seminars across Missouri. Hosted by David James.",
      },
    ],
  }),
});

const FORMAT_ICONS = {
  hackathon: Laptop,
  workshop: Users,
  seminar: Mic2,
} as const;

function Home() {
  const { events, home, faq } = Route.useLoaderData();
  const featured = featuredFrom(events).slice(0, 3);
  const next = upcomingFrom(events)[0];
  const paidReady = nextPaidAndReady(events);

  return (
    <div className="flex min-h-dvh flex-col">
      <section className="relative isolate min-h-[92dvh] overflow-hidden bg-forest-deep text-paper">
        <img
          src="/images/hero-square.jpg"
          alt="Henry County Courthouse on the square in Clinton, Missouri"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-shade absolute inset-0" />
        <div className="relative flex min-h-[92dvh] flex-col">
          <SiteHeader tone="hero" />
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-4 pb-14 pt-20 sm:px-6 sm:pb-20">
            <p className="rise-in rise-in-1 text-xs font-medium uppercase tracking-[0.18em] text-paper/70">
              {home.kicker}
            </p>
            <h1 className="rise-in rise-in-2 mt-4 max-w-3xl font-display text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              {home.heading}
            </h1>
            <p className="rise-in rise-in-3 mt-5 max-w-xl text-base leading-relaxed text-paper/85 sm:text-lg">
              {home.lede}
            </p>
            <div className="rise-in rise-in-4 mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="inverse" size="lg">
                <Link to="/events">
                  See the calendar
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-paper ring-1 ring-paper/25 hover:bg-paper/10"
              >
                <Link to="/host">Bring one to your town</Link>
              </Button>
            </div>
            {next ? (
              <Link
                to="/events/$slug"
                params={{ slug: next.slug }}
                className="rise-in rise-in-4 mt-10 inline-flex max-w-xl items-start gap-3 rounded-xl bg-forest-deep/55 p-4 ring-1 ring-paper/15 backdrop-blur-sm transition-colors duration-150 hover:bg-forest-deep/70"
              >
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-paper/70" />
                <span>
                  <span className="block text-xs uppercase tracking-[0.14em] text-paper/55">
                    Next up
                  </span>
                  <span className="mt-1 block font-display text-lg leading-snug">
                    {next.title}
                  </span>
                  <span className="mt-1 block text-sm text-paper/75">
                    {next.whenLabel} · {next.city}
                  </span>
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <main id="main">
        <section className="border-b border-border bg-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                The idea
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
                Missouri does not need another webinar from somewhere else.
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              I’m David. I live near Clinton. I host these gatherings so you
              can use the tools yourself — not sit through another talk. I
              fire them up in the room, build the real thing, then you take a
              turn. That’s the job.
            </p>
          </div>
        </section>

        <section className="bg-forest text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground/55">
              The method
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight sm:text-4xl">
              I use AI live, in front of people, to build things.
            </h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  n: "01",
                  icon: Users,
                  t: "Someone names a real problem.",
                  d: "A letter. A listing. A missed-call headache. A form you keep putting off. I start from what you walked in with — not a canned demo.",
                },
                {
                  n: "02",
                  icon: MonitorPlay,
                  t: "I build it live. You watch every click.",
                  d: "On the projector, in the room, with the tools on the table. No slide deck in the dark. If it fails, you see that too. That is the honest part.",
                },
                {
                  n: "03",
                  icon: Laptop,
                  t: "Then you make one on your own device.",
                  d: "Workshops and hackathons are hands-on. Seminars sit, watch the live build, and ask. You leave with something that actually runs.",
                },
              ].map((step) => (
                <li key={step.n} className="rounded-2xl bg-forest-deep/40 p-6 ring-1 ring-paper/10">
                  <p className="flex items-center gap-2 font-display text-sm text-paper/55">
                    <step.icon className="size-4" aria-hidden />
                    {step.n}
                  </p>
                  <h3 className="mt-3 font-display text-xl leading-snug">{step.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper/75">
                    {step.d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {paidReady ? (
          <section className="border-b border-border bg-paper">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:py-20">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Monthly in Clinton
                </p>
                <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
                  Paid and Ready
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                  First Wednesday of the month, 6:00 to 7:30 p.m. I use AI
                  live and set up your own paid subscription for personal use —
                  ChatGPT, Claude, or similar. You pay the tool company if you
                  choose. I do not sell one. Come even if you are not ready to
                  subscribe tonight.
                </p>
                <Button asChild className="mt-8">
                  <Link
                    to="/events/$slug"
                    params={{ slug: paidReady.slug }}
                  >
                    Next session: {paidReady.whenLabel}
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
              <div className="rounded-2xl bg-card p-6 shadow-card">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  In the room
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <li>
                    <span className="font-medium text-foreground">Live setup.</span>{" "}
                    Account, privacy, billing, how to cancel.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Your login.</span>{" "}
                    Not the kid’s. Not a shared shop password.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">No package from me.</span>{" "}
                    If you pay, you pay OpenAI, Anthropic, or whoever you pick.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Clinton Public Library.</span>{" "}
                    Eighteen chairs. Coffee on the side table.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Three formats
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
                How I show up.
              </h2>
            </div>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {(
              ["workshop", "seminar", "hackathon"] as const
            ).map((kind) => {
              const format = FORMATS[kind];
              const Icon = FORMAT_ICONS[kind];
              return (
                <Link
                  key={kind}
                  to="/events"
                  search={{ kind }}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-[box-shadow] duration-200 hover:shadow-card-hover"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={format.image}
                      alt=""
                      className="media h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      <Icon className="size-3.5" aria-hidden />
                      {format.kicker}
                    </p>
                    <h3 className="mt-2 font-display text-2xl">{format.plural}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {format.summary}
                    </p>
                    <p className="mt-4 text-xs text-moss">{format.duration}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-forest text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground/55">
                  On the calendar
                </p>
                <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
                  Coming up around the state.
                </h2>
              </div>
              <Button asChild variant="inverse">
                <Link to="/events">
                  Full calendar
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {featured.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            A typical day
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight sm:text-4xl">
            What it actually feels like in the room.
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "I start from the question you walked in with.",
                d: "Not a canned curriculum. A letter, a listing, a grant, a classroom unit, a missed-call headache — the thing that is actually on your desk.",
              },
              {
                n: "02",
                t: "You watch me build it. Then you do it.",
                d: "I use the tools live, in front of the room. Workshops and hackathons then put it on your own phone or laptop. Seminars stay sit-and-ask after the live build.",
              },
              {
                n: "03",
                t: "You leave with something you can use on Monday.",
                d: "A draft. A working helper. A one-page how-to. A clearer sense of what not to hand to a machine.",
              },
            ].map((step) => (
              <li key={step.n} className="rounded-2xl bg-card p-6 shadow-card">
                <p className="font-display text-sm text-moss">{step.n}</p>
                <h3 className="mt-3 font-display text-xl leading-snug">{step.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.d}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-border bg-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Who shows up
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
                Neighbors, not a tech scene.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Realtors, insurance offices, librarians, farm families, city
                clerks, high-school teachers, retirees who want to write a
                decent letter. If you have been told this is not for you, it is.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Landmark, t: "Libraries & chambers", d: "The rooms that already hold this town together." },
                { icon: Handshake, t: "Shops & trades", d: "The quote, the follow-up, the Saturday rush." },
                { icon: MapPin, t: "Farms & ranches", d: "Paperwork, weather, markets — in plain English." },
                { icon: Users, t: "Beginners & seniors", d: "No silly questions. Ever." },
              ].map((item) => (
                <li key={item.t} className="rounded-xl bg-background p-4">
                  <item.icon className="size-4 text-moss" aria-hidden />
                  <p className="mt-3 font-medium">{item.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="overflow-hidden rounded-2xl bg-forest-deep text-paper md:grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-10">
              <Badge variant="paper">Traveling the state</Badge>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
                Bring a gathering to your town.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/75 sm:text-base">
                A library meeting room, a chamber breakfast, a church basement, a
                community-college gym. If you can get the people, I will bring
                the gathering.
              </p>
              <Button asChild variant="inverse" className="mt-8">
                <Link to="/host">
                  Tell me about the room
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            <div className="border-t border-paper/10 p-8 sm:p-10 md:border-l md:border-t-0">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-paper/50">
                Towns on the list
              </p>
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {TOWNS.map((town) => (
                  <li key={town.name}>
                    <span className="font-medium">{town.name}</span>
                    <span className="block text-xs text-paper/50">{town.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:py-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                The host
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
                A little about me.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                After 35 years in IT, I recently moved to Clinton. I have seen
                what AI can do, and I am ready to give that back. All ships
                rising together — start here in town, then carry it across
                Missouri, and as far as it will go.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                I will not talk over your head. I will not sell you something
                you do not need. I use the tools live, in the room. Then you
                take a turn.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/about">More about David</Link>
              </Button>
            </div>
            <figure className="overflow-hidden rounded-2xl">
              <img
                src="/images/hero-square.jpg"
                alt="Henry County Courthouse on the square in Clinton, Missouri"
                className="media aspect-[16/10] w-full object-cover"
              />
              <figcaption className="bg-card px-5 py-3 text-sm text-muted-foreground">
                Home base: the courthouse square in Clinton, Henry County.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Questions
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
            Before you come.
          </h2>
          <div className="mt-8">
            <FaqList
              items={faq.body
                .map((item) => {
                  const rec = item as { q?: string; a?: string };
                  return { q: rec.q ?? "", a: rec.a ?? "" };
                })
                .filter((item) => item.q)}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
