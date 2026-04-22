#!/usr/bin/env node
/**
 * Fetch Google Search Console performance data for hrtyaku.com.
 *
 * Auth: Google Cloud service account. One-time setup in docs/seo-setup.md.
 *
 * Env vars:
 *   GSC_CREDENTIALS_PATH   Path to service-account JSON (default: .gsc-credentials.json at repo root)
 *   GSC_SITE_URL           "sc-domain:hrtyaku.com"  (for domain property)
 *                          or "https://hrtyaku.com/" (for URL-prefix property)
 *                          Default: sc-domain:hrtyaku.com
 *   GSC_DAYS               Days of data to fetch (default: 28)
 *
 * Output: docs/data/gsc-YYYY-MM-DD.csv
 *   columns: query, impressions, clicks, ctr, position, top_page
 *
 * Usage:
 *   npm run seo:gsc
 */
import fs from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';

const ROOT = process.cwd();
const CRED_PATH = process.env.GSC_CREDENTIALS_PATH
  ? path.resolve(process.env.GSC_CREDENTIALS_PATH)
  : path.join(ROOT, '.gsc-credentials.json');
const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:hrtyaku.com';
const DAYS = Number(process.env.GSC_DAYS || 28);

const OUT_DIR = path.join(ROOT, 'docs', 'data');

function die(msg) {
  console.error(`\n❌ ${msg}\n`);
  console.error('One-time setup: see docs/seo-setup.md\n');
  process.exit(1);
}

if (!fs.existsSync(CRED_PATH)) {
  die(
    `Service account JSON not found: ${CRED_PATH}\n` +
      `Create a service account in GCP, download key, save to .gsc-credentials.json,\n` +
      `then add its email as a user in Search Console > Settings > Users and permissions.`,
  );
}

let creds;
try {
  creds = JSON.parse(fs.readFileSync(CRED_PATH, 'utf8'));
} catch (e) {
  die(`Failed to parse credentials JSON: ${e.message}`);
}

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}
const today = new Date();
const endDate = toISODate(new Date(today.getTime() - 2 * 24 * 3600 * 1000)); // GSC lag ~2d
const startDate = toISODate(new Date(today.getTime() - (DAYS + 2) * 24 * 3600 * 1000));

console.log(`→ GSC query  site=${SITE_URL}  ${startDate} → ${endDate}`);

const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const webmasters = google.webmasters({ version: 'v3', auth });

// Fetch queries (top 1000 by clicks)
const { data: qData } = await webmasters.searchanalytics.query({
  siteUrl: SITE_URL,
  requestBody: {
    startDate,
    endDate,
    dimensions: ['query'],
    rowLimit: 1000,
    dataState: 'final',
  },
});

// Also fetch query+page to find best landing page per query
const { data: qpData } = await webmasters.searchanalytics.query({
  siteUrl: SITE_URL,
  requestBody: {
    startDate,
    endDate,
    dimensions: ['query', 'page'],
    rowLimit: 5000,
    dataState: 'final',
  },
});

// Build map: query -> top landing page (by clicks)
const topPageByQuery = new Map();
for (const row of qpData.rows || []) {
  const q = row.keys?.[0];
  const pg = row.keys?.[1];
  if (!q || !pg) continue;
  const prev = topPageByQuery.get(q);
  if (!prev || (row.clicks ?? 0) > prev.clicks) {
    topPageByQuery.set(q, { page: pg, clicks: row.clicks ?? 0 });
  }
}

// Compose CSV
function escCsv(s) {
  const v = String(s ?? '');
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}
const lines = ['query,impressions,clicks,ctr,position,top_page'];
for (const row of (qData.rows || []).sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))) {
  const q = row.keys?.[0] ?? '';
  const imp = row.impressions ?? 0;
  const clk = row.clicks ?? 0;
  const ctr = row.ctr != null ? (row.ctr * 100).toFixed(2) : '';
  const pos = row.position != null ? row.position.toFixed(2) : '';
  const tp = topPageByQuery.get(q)?.page ?? '';
  lines.push([escCsv(q), imp, clk, ctr, pos, escCsv(tp)].join(','));
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const outPath = path.join(OUT_DIR, `gsc-${toISODate(today)}.csv`);
fs.writeFileSync(outPath, lines.join('\n'));

// Also write a "latest" alias for refresh script to find
fs.writeFileSync(path.join(OUT_DIR, 'gsc-latest.csv'), lines.join('\n'));

console.log(`✓ ${lines.length - 1} queries → ${outPath}`);
console.log(`✓ Alias: docs/data/gsc-latest.csv`);
