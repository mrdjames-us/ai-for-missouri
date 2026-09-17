/**
 * Keep sessions on the apex. `__Host-` cookies cannot be shared with www.
 */
export default async function wwwRedirectMiddleware(
  event: { url: URL; req: { headers: Headers } },
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const host = (
    event.req.headers.get("x-forwarded-host") ??
    event.req.headers.get("host") ??
    event.url.host
  )
    .split(",")[0]
    ?.trim()
    .toLowerCase();
  if (host === "www.aiformissouri.com") {
    const url = new URL(event.url);
    url.hostname = "aiformissouri.com";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
