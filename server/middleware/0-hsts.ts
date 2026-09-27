/**
 * HSTS on every Worker response (SSR pages, redirects, API, middleware
 * short-circuits). Static files from the assets binding never reach the
 * Worker; they get the same header from public/_headers.
 *
 * No `preload`: that is a separate, hard-to-undo opt-in.
 * The file name starts with "0-" so it runs before the other middleware
 * (Nitro orders middleware by file name) and wraps their responses too.
 */
export const HSTS_VALUE = "max-age=31536000; includeSubDomains";

export default async function hstsMiddleware(
  event: { res?: { headers?: Headers } },
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  // Covers handlers that return plain values: h3 merges event.res.headers
  // into the final Response.
  event.res?.headers?.set("strict-transport-security", HSTS_VALUE);
  const result = await next();
  if (!(result instanceof Response)) return result;
  if (result.headers.get("strict-transport-security") === HSTS_VALUE) return result;
  // Response.redirect() and fetch() responses have immutable headers, so copy.
  const headers = new Headers(result.headers);
  headers.set("strict-transport-security", HSTS_VALUE);
  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers,
  });
}
