import test from "node:test";
import assert from "node:assert/strict";
import { EVENTS } from "./events.ts";
import { eventJsonLd, jsonLdScript, parseTimeLabel } from "./event-jsonld.ts";

test("parseTimeLabel", () => {
  assert.deepEqual(parseTimeLabel("10:00 a.m. – 12:30 p.m."), {
    start: { hour: 10, minute: 0 },
    end: { hour: 12, minute: 30 },
  });
  assert.deepEqual(parseTimeLabel("Saturday 9:00 a.m. through Sunday 4:00 p.m."), {
    start: { hour: 9, minute: 0 },
    end: { hour: 16, minute: 0 },
  });
  assert.equal(parseTimeLabel("TBD"), null);
});

test("every event produces valid Event JSON-LD with required fields", () => {
  assert.ok(EVENTS.length >= 20);
  for (const event of EVENTS) {
    const parsed = JSON.parse(jsonLdScript(eventJsonLd(event)));
    assert.equal(parsed["@type"], "Event");
    assert.equal(parsed.name, event.title);
    assert.equal(parsed.description, event.lede);
    assert.match(parsed.startDate, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00-0[56]:00$/, event.slug);
    assert.match(parsed.endDate, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00-0[56]:00$/, event.slug);
    assert.ok(parsed.endDate >= parsed.startDate || parsed.endDate.slice(0, 10) >= parsed.startDate.slice(0, 10));
    assert.equal(parsed.location.name, event.venue);
    assert.equal(parsed.location.address.addressLocality, event.city);
    assert.equal(parsed.organizer.name, "AI for Missouri");
    assert.equal(parsed.url, `https://aiformissouri.com/events/${event.slug}`);
  }
});

test("DST: summer is -05:00, winter is -06:00", () => {
  const byStart = (d: string) => EVENTS.find((e) => e.start === d)!;
  assert.match(String(eventJsonLd(byStart("2026-08-22")).startDate), /-05:00$/);
  assert.match(String(eventJsonLd(byStart("2027-01-16")).startDate), /-06:00$/);
});
