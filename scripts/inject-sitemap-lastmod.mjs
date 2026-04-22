#!/usr/bin/env node
/**
 * Postbuild: inject <lastmod> into dist/sitemap-0.xml from MDX frontmatter.
 *
 * Astro / Starlight's bundled sitemap does not include lastmod. This script
 * walks src/content/docs/**, reads each page's `lastReviewed`, and rewrites
 * the dist sitemap so search engines see per-page freshness.
 *
 * Pages without lastReviewed fall back to the build time.
 * Pages not in content (e.g. /tools interactive pages) fall back to build time.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const CONTENT_DIR = path.resolve('src/content/docs');
const SITE = 'https://hrtyaku.com';
const BUILD_TIME = new Date().toISOString();

// Walk content dir -> map of { "/zh/medications/.../" : "2026-04-15" }
function buildLastmodMap() {
  const map = new Map();
  function walk(dir, relParts) {
    for (const name of fs.readdirSync(dir)) {
      const abs = path.join(dir, name);
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) {
        walk(abs, [...relParts, name]);
      } else if (/\.(md|mdx)$/.test(name)) {
        const slug = name.replace(/\.(md|mdx)$/, '');
        const src = fs.readFileSync(abs, 'utf8');
        const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (!fm) continue;
        const lr = fm[1].match(/^lastReviewed:\s*['"]?([0-9-]+)['"]?/m);
        if (!lr) continue;
        const iso = new Date(lr[1]).toISOString();
        // Starlight URL convention: index.mdx -> folder/, else folder/slug/
        let urlPath;
        if (slug === 'index') {
          urlPath = '/' + [...relParts].join('/') + (relParts.length ? '/' : '');
        } else {
          urlPath = '/' + [...relParts, slug].join('/') + '/';
        }
        map.set(SITE + urlPath, iso);
      }
    }
  }
  walk(CONTENT_DIR, []);
  return map;
}

function injectIntoSitemap(sitemapPath, lastmodMap) {
  if (!fs.existsSync(sitemapPath)) return 0;
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  let replaced = 0;
  // Remove any pre-existing <lastmod> to be idempotent.
  xml = xml.replace(/<lastmod>[^<]+<\/lastmod>/g, '');
  // For each <url><loc>...</loc>...</url>, insert <lastmod> before </url>.
  xml = xml.replace(
    /<url>\s*<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g,
    (match, loc, inner) => {
      const iso = lastmodMap.get(loc) ?? BUILD_TIME;
      replaced++;
      return `<url><loc>${loc}</loc>${inner}<lastmod>${iso}</lastmod></url>`;
    },
  );
  fs.writeFileSync(sitemapPath, xml);
  return replaced;
}

if (!fs.existsSync(DIST_DIR)) {
  console.error('dist/ not found — run astro build first.');
  process.exit(1);
}

const lastmodMap = buildLastmodMap();
console.log(`Loaded lastReviewed for ${lastmodMap.size} content pages`);

// Walk dist/ for any sitemap-*.xml (Starlight/@astrojs/sitemap pattern).
let total = 0;
for (const name of fs.readdirSync(DIST_DIR)) {
  if (/^sitemap-\d+\.xml$/.test(name)) {
    const n = injectIntoSitemap(path.join(DIST_DIR, name), lastmodMap);
    console.log(`✓ ${name}: ${n} <url> entries updated`);
    total += n;
  }
}
console.log(`\nTotal URLs with lastmod: ${total}`);
