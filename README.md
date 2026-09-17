# AI for Missouri

Hackathons, workshops, and seminars in rooms across Missouri — from Clinton out.

This **is** [aiformissouri.com](https://aiformissouri.com).

No prices. No packages. David James, based in Clinton, hosts and helps other towns host.

- **Workshops** — small, hands-on, your own phone or laptop
- **Seminars** — straight talk for chambers, libraries, and civic rooms
- **Hackathons** — a day or a weekend of building, not a pitch contest
- **Paid and Ready** — monthly in Clinton: live setup of your own paid AI subscription (we do not sell one)

Contact: [david@aiformissouri.com](mailto:david@aiformissouri.com) · [(660) 869-2868](tel:+16608692868)

## Deploy (Cloudflare Workers)

Live origin is Worker **`ai-for-missouri`**, custom domains on `aiformissouri.com` and `www` (www 301s to apex). DNS, email routing, and `stats.aiformissouri.com` stay on Cloudflare — do not replace those.

Do **not** deploy `C:\Users\mrdja\aiformissouri-publish` (the old static one-pager) over this Worker.

```powershell
$env:NITRO_PRESET = "cloudflare-module"
$env:VITE_AUTH_ENABLED = "true"
$env:BETTER_AUTH_URL = "https://aiformissouri.com"
$env:GROK_PROJECT_ID = (Get-Content .project_id -Raw).Trim()
$env:DATABASE_URL = (Get-Content "$env:USERPROFILE\.grok\secrets\aiformissouri.database-url" -Raw).Trim()
npm run deploy
```

Secrets already on the Worker: `DATABASE_URL`, `BETTER_AUTH_SECRET`. Owner is `david@aiformissouri.com` (staff table seed). Do not add other staff.

## If you are Grok Build on David’s PC

The site is live. If you need to republish: build this TanStack app for Cloudflare (`NITRO_PRESET=cloudflare-module`) and `wrangler deploy` Worker `ai-for-missouri`. Do not rebuild the old “No Hype, No Headache” HTML site.
