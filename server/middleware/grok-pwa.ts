/**
 * Deployed-app (Nitro) half of the platform PWA chrome. Auto-registered as
 * global h3 middleware because vite.config.ts sets `serverDir: "./server"` —
 * without that option Nitro v3 never scans this directory.
 *
 * - `?install=1&platform=ios` on a document path → the Home Screen tutorial,
 *   bundled into the server build via `?raw` (the public/ directory is CDN
 *   static output on Vercel and not readable from the function).
 * - `/__grok/manifest.webmanifest` → per-app-named manifest (kept out of
 *   public/ so this dynamic response is the only one).
 * - Other HTML documents → stream-inject PWA + OG head tags at `</head>`.
 *   OG identity is baked via `virtual:grok-og-identity` at `vite build`
 *   (this function cannot read `src/lib/og/site.json` or `public/og.jpg`).
 *   This must be a middleware transforming `next()`: h3 discards the `response`
 *   runtime hook's return value, and `render:html` does not exist in Nitro v3.
 * - Agents asking for Markdown/plain text (`Accept: text/markdown`,
 *   `Accept: text/plain`, `/page.md`) get a Markdown rendering of the page.
 *   Without this, TanStack Start's SSR answers any Accept without
 *   `text/html` or `*\/*` with HTTP 500. Other non-HTML Accepts get the HTML.
 */
import installPageTemplate from "../../scripts/install-page.html?raw";
import { grokOgIdentity } from "virtual:grok-og-identity";
import {
  acceptsHtml,
  createHeadInjector,
  isDocumentPath,
  isInstallQuery,
  renderInstallPageHtml,
  renderWebManifest,
} from "../../scripts/grok-pwa-shared.mjs";
import {
  htmlToMarkdown,
  negotiateDocument,
  stripMarkdownSuffix,
} from "../../scripts/agent-text.mjs";

interface GrokPwaEvent {
  url: URL;
  req: Request & Record<string, unknown>;
}

const HTML_ACCEPT = "text/html,*/*;q=0.8";
/** srvx/Nitro attach these to the incoming Request; a rebuilt Request must keep them. */
const REQUEST_EXTRAS = ["runtime", "waitUntil", "context", "ip"] as const;

/**
 * Swap `event.req` for a copy that asks SSR for HTML (and optionally drops a
 * `.md` suffix from the path). Incoming Request headers are immutable on
 * Workers, so the request has to be rebuilt.
 */
function requestHtml(event: GrokPwaEvent, pathname: string | null): void {
  const original = event.req;
  const headers = new Headers(original.headers);
  headers.set("accept", HTML_ACCEPT);
  let target: string | Request = original;
  if (pathname !== null) {
    const url = new URL(original.url);
    url.pathname = pathname;
    target = url.toString();
  }
  const replacement = new Request(target, {
    method: original.method,
    headers,
    signal: original.signal,
  }) as Request & Record<string, unknown>;
  for (const key of REQUEST_EXTRAS) {
    const value = original[key];
    if (value !== undefined) {
      Object.defineProperty(replacement, key, {
        value,
        configurable: true,
        enumerable: true,
        writable: true,
      });
    }
  }
  (event as { req: Request }).req = replacement;
}

function withVaryAccept(headers: Headers): Headers {
  const vary = headers.get("vary");
  if (!vary) headers.set("vary", "Accept");
  else if (!/\baccept\b/i.test(vary)) headers.set("vary", `${vary}, Accept`);
  return headers;
}

async function textResponse(
  response: Response,
  kind: "markdown" | "plain",
  url: string,
  isHead: boolean,
): Promise<Response> {
  const html = response.body ? await response.text() : "";
  const markdown = htmlToMarkdown(html, { url });
  const headers = withVaryAccept(new Headers(response.headers));
  headers.set(
    "content-type",
    kind === "markdown" ? "text/markdown; charset=utf-8" : "text/plain; charset=utf-8",
  );
  headers.delete("content-length");
  headers.delete("content-encoding");
  headers.delete("etag");
  headers.set("x-content-source", "html-to-markdown");
  return new Response(isHead ? null : markdown, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Markdown / plain-text / other non-HTML Accept on a document URL. Always
 * renders the HTML page first (so SSR never sees a non-HTML Accept) and
 * falls back to that HTML if the conversion itself fails.
 */
async function serveAgentDocument(
  event: GrokPwaEvent,
  next: () => unknown | Promise<unknown>,
  kind: "markdown" | "plain" | "html-forced",
  pathname: string | null,
  isHead: boolean,
): Promise<unknown> {
  const publicUrl = new URL(event.url.toString());
  if (pathname !== null) publicUrl.pathname = pathname;
  requestHtml(event, pathname);
  const result = await next();
  if (!(result instanceof Response)) return result;
  const contentType = String(result.headers.get("content-type") ?? "");
  if (kind === "html-forced" || !contentType.includes("text/html")) {
    const headers = withVaryAccept(new Headers(result.headers));
    return new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers,
    });
  }
  try {
    return await textResponse(result.clone(), kind, publicUrl.toString(), isHead);
  } catch (error) {
    console.error("[grok-pwa] markdown rendering failed; serving HTML", error);
    return result;
  }
}

function requestHost(event: GrokPwaEvent): string {
  return (
    event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host") ?? event.url.host
  );
}

function injectHeadStreaming(response: Response, host: string): Response {
  const injector = createHeadInjector({
    host,
    site: grokOgIdentity.site,
  });
  const transformed = response.body!.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        for (const out of injector.push(chunk)) controller.enqueue(out);
      },
      flush(controller) {
        for (const out of injector.flush()) controller.enqueue(out);
      },
    }),
  );
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(transformed, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default async function grokPwaMiddleware(
  event: GrokPwaEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const method = (event.req.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") return next();

  const path = event.url.pathname;
  if (!path.startsWith("/_serverFn")) {
    const mdPath = stripMarkdownSuffix(path);
    if (mdPath !== null && isDocumentPath(mdPath)) {
      return serveAgentDocument(event, next, "markdown", mdPath, method === "HEAD");
    }
    if (isDocumentPath(path)) {
      const kind = negotiateDocument(event.req.headers.get("accept"));
      if (kind !== "html") {
        return serveAgentDocument(event, next, kind, null, method === "HEAD");
      }
    }
  }
  if (method !== "GET") return next();

  const urlWithQuery = path + event.url.search;

  if (path === "/__grok/manifest.webmanifest" || path === "/__grok/manifest.json") {
    return new Response(renderWebManifest(requestHost(event)), {
      headers: {
        "content-type": "application/manifest+json; charset=utf-8",
        "cache-control": "no-cache",
      },
    });
  }

  if (
    isInstallQuery(urlWithQuery) &&
    isDocumentPath(path) &&
    acceptsHtml(event.req.headers.get("accept"))
  ) {
    const html = renderInstallPageHtml(installPageTemplate, {
      host: requestHost(event),
      url: urlWithQuery,
    });
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-cache",
      },
    });
  }

  if (!isDocumentPath(path)) return next();

  const result = await next();
  if (
    result instanceof Response &&
    result.body &&
    String(result.headers.get("content-type") ?? "").includes("text/html") &&
    !result.headers.get("content-encoding")
  ) {
    return injectHeadStreaming(result, requestHost(event));
  }
  return result;
}
