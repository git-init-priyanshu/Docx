// node evals/corpus/buildManifest.ts

import { writeFileSync } from "node:fs";
import { join } from "node:path";

import type { Article } from "./articles.ts";
import { fetchWikipedia } from "./wikipedia.ts";

const API_URL = "https://en.wikipedia.org/w/api.php";
const LIST_PAGE = "Wikipedia:Vital articles/Level 3";
const BATCH_SIZE = 50;

const titles: string[] = [];
let continuation: Record<string, string> = {};

do {
  const url = new URL(API_URL);
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "links",
    plnamespace: "0",
    pllimit: "max",
    titles: LIST_PAGE,
    ...continuation,
  }).toString();
  const body = await (await fetchWikipedia(url.toString())).json();
  for (const link of body.query.pages[0].links ?? []) titles.push(link.title);
  continuation = body.continue ?? {};
} while (Object.keys(continuation).length > 0);

console.log(`Collected ${titles.length} titles from the list page`);

const byPageId = new Map<number, Article>();

for (let i = 0; i < titles.length; i += BATCH_SIZE) {
  const url = new URL(API_URL);
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "revisions",
    rvprop: "ids|timestamp",
    redirects: "1",
    titles: titles.slice(i, i + BATCH_SIZE).join("|"),
  }).toString();
  const body = await (await fetchWikipedia(url.toString())).json();
  for (const page of body.query.pages) {
    if (page.missing || !page.revisions?.length) {
      console.warn(`Skipped (missing or no revisions): ${page.title}`);
      continue;
    }
    const revision = page.revisions[0];
    byPageId.set(page.pageid, {
      title: page.title,
      pageId: page.pageid,
      revisionId: revision.revid,
      timestamp: revision.timestamp,
    });
  }
}

const articles = [...byPageId.values()].sort((a, b) =>
  a.title.localeCompare(b.title),
);

const manifest = {
  listPage: LIST_PAGE,
  license: "CC BY-SA 4.0",
  fetchedAt: new Date().toISOString(),
  articles,
};

writeFileSync(
  join(import.meta.dirname, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Wrote ${articles.length} articles`);
