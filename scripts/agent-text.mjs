/**
 * Content negotiation for agents and CLI tools that ask for Markdown or plain
 * text (`Accept: text/markdown`, `Accept: text/plain`, or a `.md` URL).
 *
 * TanStack Start's SSR handler answers any Accept header that lacks
 * `text/html` and `*\/*` with HTTP 500 ("Only HTML requests are supported
 * here"). server/middleware/grok-pwa.ts uses these helpers to render the
 * page as HTML internally and hand back a Markdown rendering instead.
 *
 * Plain ESM with no dependencies so the Nitro bundle and `node --test` can
 * both use it.
 */

/**
 * What the client wants for a document URL.
 * - "html": leave the request alone (browsers, curl default, empty Accept).
 * - "markdown": text/markdown (or a `.md` URL).
 * - "plain": text/plain.
 * - "html-forced": some other type (application/json, image/*…): serve the
 *   HTML page with 200 rather than letting SSR answer 500.
 * @param {string | null | undefined} accept
 * @returns {"html" | "markdown" | "plain" | "html-forced"}
 */
export function negotiateDocument(accept) {
  const value = String(accept ?? "").trim().toLowerCase();
  if (value === "") return "html";
  const types = value
    .split(",")
    .map((part) => {
      const [type = "", ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      const weight = q ? Number.parseFloat(q.slice(2)) : 1;
      return { type: type.trim(), q: Number.isFinite(weight) ? weight : 1 };
    })
    .filter((entry) => entry.type && entry.q > 0)
    .sort((a, b) => b.q - a.q);
  const best = types[0]?.type ?? "";
  if (best === "text/markdown" || best === "text/x-markdown") return "markdown";
  if (best === "text/plain") return "plain";
  if (types.some((t) => t.type === "text/html" || t.type === "*/*")) return "html";
  if (types.some((t) => t.type === "text/markdown" || t.type === "text/x-markdown")) {
    return "markdown";
  }
  if (types.some((t) => t.type === "text/plain" || t.type === "text/*")) return "plain";
  return "html-forced";
}

/**
 * `/events/foo.md` → `/events/foo`, `/index.md` and `/.md` → `/`.
 * Returns null when the path is not a `.md` URL.
 * @param {string} pathname
 * @returns {string | null}
 */
export function stripMarkdownSuffix(pathname) {
  const path = String(pathname ?? "");
  if (!/\.md$/i.test(path)) return null;
  let base = path.slice(0, -3);
  if (base === "" || base === "/" || /\/index$/i.test(base)) {
    base = base.replace(/index$/i, "");
  }
  if (base === "") base = "/";
  return base;
}

/** @type {Record<string, string>} */
const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  middot: "·",
  copy: "©",
  reg: "®",
  trade: "™",
  times: "×",
  bull: "•",
};

/** @param {string} text */
export function decodeEntities(text) {
  return String(text).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const n =
        code[1] === "x" || code[1] === "X"
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** @param {string} html @param {string} tag */
function innerOf(html, tag) {
  const open = new RegExp(`<${tag}\\b[^>]*>`, "i").exec(html);
  if (!open) return null;
  const start = open.index + open[0].length;
  const close = html.toLowerCase().lastIndexOf(`</${tag}>`);
  return close > start ? html.slice(start, close) : html.slice(start);
}

/** @param {string} attrs @param {string} name */
function attr(attrs, name) {
  const m = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i").exec(attrs);
  return m ? decodeEntities(m[2] ?? m[3] ?? m[4] ?? "") : "";
}

/** @param {string} href @param {string} base */
function absolute(href, base) {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

/**
 * Small, dependency-free HTML → Markdown for server-rendered pages. It keeps
 * headings, paragraphs, lists, links, emphasis, and code; it drops scripts,
 * styles, SVG, forms, and (when a <main> exists) the site chrome around it.
 * @param {string} html
 * @param {{ url?: string }} [options]
 * @returns {string}
 */
export function htmlToMarkdown(html, options = {}) {
  const source = String(html ?? "");
  const base = options.url ?? "https://aiformissouri.com/";
  const head = innerOf(source, "head") ?? "";
  const title = decodeEntities((/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(head)?.[1] ?? "").trim());
  const descTag = /<meta\b[^>]*name\s*=\s*["']description["'][^>]*>/i.exec(head)?.[0] ?? "";
  const description = descTag ? attr(descTag, "content").trim() : "";

  let body = innerOf(source, "main") ?? innerOf(source, "body") ?? source;
  body = body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<(script|style|noscript|template|svg|iframe|canvas|form|select|textarea|button)\b[\s\S]*?<\/\1>/gi,
      "",
    )
    .replace(/<(input|meta|link|source)\b[^>]*>/gi, "");

  let md = body
    // Adjacent inline elements (badges, agenda time + item) need a gap.
    .replace(/<\/(span|time|small|label|abbr)>(?=\s*<)/gi, "</$1> ")
    .replace(/<br\s*\/?>/gi, "  \n")
    .replace(/<hr\b[^>]*>/gi, "\n\n---\n\n")
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, level, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      return text ? `\n\n${"#".repeat(Number(level))} ${text}\n\n` : "";
    })
    .replace(/<img\b([^>]*)>/gi, (_m, attrs) => {
      const alt = attr(attrs, "alt").trim();
      const src = attr(attrs, "src");
      return alt && src ? `![${alt}](${absolute(src, base)})` : "";
    })
    .replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_m, attrs, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      const href = attr(attrs, "href");
      if (!text) return "";
      if (!href || href.startsWith("#") || /^javascript:/i.test(href)) return text;
      return `[${text}](${absolute(href, base)})`;
    })
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _t, inner) =>
      inner.trim() ? `**${inner.trim()}**` : "",
    )
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _t, inner) =>
      inner.trim() ? `_${inner.trim()}_` : "",
    )
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_m, inner) => `\`${inner}\``)
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<\/li>/gi, "")
    .replace(/<blockquote\b[^>]*>/gi, "\n\n> ")
    .replace(
      /<\/?(p|div|section|article|header|footer|nav|aside|ul|ol|dl|dt|dd|table|tr|figure|figcaption|address|blockquote|main|pre)\b[^>]*>/gi,
      "\n\n",
    )
    .replace(/<\/?(td|th)\b[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "");

  md = decodeEntities(md)
    .split("\n")
    .map((line) => line.replace(/[ \t\u00a0]+/g, " ").replace(/^ (?=\S)/, "").trimEnd())
    .join("\n")
    .replace(/\n- \n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const header = [];
  if (title && !md.startsWith("# ")) header.push(`# ${title}`);
  if (description) header.push(`> ${description}`);
  header.push(`Source: ${base}`);
  return `${header.join("\n\n")}\n\n${md}\n`;
}
