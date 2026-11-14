import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Article = {
  title: string;
  pageId: number;
  revisionId: number;
  timestamp: string;
};

export const articles: Article[] = JSON.parse(
  readFileSync(join(import.meta.dirname, "manifest.json"), "utf8"),
).articles;

export const cacheDir = join(import.meta.dirname, ".cache");

export const cacheFileOf = (article: Article) =>
  join(cacheDir, `${article.pageId}-${article.revisionId}.html`);
