import test from "node:test";
import assert from "node:assert/strict";
import { htmlToMarkdown, negotiateDocument, stripMarkdownSuffix } from "./agent-text.mjs";

test("negotiateDocument", () => {
  assert.equal(negotiateDocument(null), "html");
  assert.equal(negotiateDocument(""), "html");
  assert.equal(negotiateDocument("*/*"), "html");
  assert.equal(negotiateDocument("text/html,application/xhtml+xml,*/*;q=0.8"), "html");
  assert.equal(negotiateDocument("text/markdown"), "markdown");
  assert.equal(negotiateDocument("text/markdown, text/html;q=0.9"), "markdown");
  assert.equal(negotiateDocument("text/plain"), "plain");
  assert.equal(negotiateDocument("text/plain;q=0.5, text/markdown"), "markdown");
  assert.equal(negotiateDocument("application/json"), "html-forced");
  assert.equal(negotiateDocument("text/html;q=0.1, text/plain"), "plain");
});

test("stripMarkdownSuffix", () => {
  assert.equal(stripMarkdownSuffix("/events"), null);
  assert.equal(stripMarkdownSuffix("/events.md"), "/events");
  assert.equal(stripMarkdownSuffix("/events/clinton-first-gathering.md"), "/events/clinton-first-gathering");
  assert.equal(stripMarkdownSuffix("/index.md"), "/");
  assert.equal(stripMarkdownSuffix("/.md"), "/");
});

test("htmlToMarkdown keeps content, drops chrome and scripts", () => {
  const html = `<!doctype html><html><head><title>Lake Country Seminar — AI for Missouri</title>
  <meta name="description" content="AI &amp; you"></head><body><nav><a href="/">Home</a></nav>
  <main id="main"><h1>Lake <em>Country</em></h1><p>Hello &mdash; <a href="/events">calendar</a>.</p>
  <ul><li>One</li><li><strong>Two</strong></li></ul><script>alert(1)</script>
  <script type="application/ld+json">{"@type":"Event"}</script><svg><path d="M0"/></svg></main>
  <footer>foot</footer></body></html>`;
  const md = htmlToMarkdown(html, { url: "https://aiformissouri.com/events/x" });
  assert.match(md, /^> AI & you/);
  assert.doesNotMatch(md, /Seminar/); // page h1 wins over <title>
  assert.match(md, /\n# Lake Country\n/);
  assert.match(md, /Hello — \[calendar\]\(https:\/\/aiformissouri\.com\/events\)\./);
  assert.match(md, /- One\n- \*\*Two\*\*/);
  assert.doesNotMatch(md, /alert|@type|Home|foot|<\w/);
});
