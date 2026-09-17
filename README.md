# AI for Missouri

Hackathons, workshops, and seminars in rooms across Missouri — from Clinton out.

This **is** [aiformissouri.com](https://aiformissouri.com). The live domain is still the old static HTML site on Cloudflare Pages. This repo is the replacement.

No prices. No packages. David James, based in Clinton, hosts and helps other towns host.

- **Workshops** — small, hands-on, your own phone or laptop
- **Seminars** — straight talk for chambers, libraries, and civic rooms
- **Hackathons** — a day or a weekend of building, not a pitch contest
- **Paid and Ready** — monthly in Clinton: live setup of your own paid AI subscription (we do not sell one)

Contact: [david@aiformissouri.com](mailto:david@aiformissouri.com) · [(660) 869-2868](tel:+16608692868)

## If you are Grok Build on David’s PC

Publish **this repo** to **aiformissouri.com**. Do not rebuild the old one-page commercial site.

- Domain DNS is already on Cloudflare (`emely` / `sergi.ns.cloudflare.com`). Keep it. Keep email routing. Keep `stats.aiformissouri.com` (Umami).
- Current origin is a **static** Cloudflare Pages project (`index.html` / `styles.css`). This app is **not** static — TanStack Start, server functions, Postgres, staff login.
- Preferred: deploy this app (Vercel or Cloudflare Workers with a Node-compatible preset + Neon `DATABASE_URL`), then point the apex and `www` at that origin. Do not `wrangler pages deploy` a folder of HTML over the old project unless you have actually built this app for Pages.
- Owner stays `david@aiformissouri.com`. Do not add other staff.
- Success = https://aiformissouri.com shows “We use AI live, in front of people, to build things,” the calendar, and Paid and Ready — not “No Hype, No Headache.”
