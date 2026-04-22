#!/usr/bin/env node
/**
 * Merge GSC (docs/data/gsc-latest.csv) + Trends (docs/data/trends-latest.json)
 * into a snapshot section of docs/seo-keyword-gap.md.
 *
 * Strategy: do NOT rewrite the hand-curated P0/P1/P2 tables. Instead append/
 * replace a bounded "AUTO SNAPSHOT" block delimited by HTML comments so humans
 * and automation don't collide.
 *
 * Usage:
 *   npm run seo:refresh
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const GAP_FILE = path.join(ROOT, 'docs', 'seo-keyword-gap.md');
const GSC_CSV = path.join(ROOT, 'docs', 'data', 'gsc-latest.csv');
const TRENDS_JSON = path.join(ROOT, 'docs', 'data', 'trends-latest.json');

const MARK_BEGIN = '<!-- AUTO-SNAPSHOT:BEGIN -->';
const MARK_END = '<!-- AUTO-SNAPSHOT:END -->';

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(',');
  return lines.slice(1).map((ln) => {
    // Naive split; our writer doesn't use commas inside unquoted fields.
    const cols = [];
    let cur = '';
    let inQ = false;
    for (const c of ln) {
      if (inQ) {
        if (c === '"') inQ = false;
        else cur += c;
      } else if (c === '"') {
        inQ = true;
      } else if (c === ',') {
        cols.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    cols.push(cur);
    const row = {};
    header.forEach((h, i) => (row[h] = cols[i]));
    return row;
  });
}

let gsc = [];
if (fs.existsSync(GSC_CSV)) {
  gsc = parseCsv(fs.readFileSync(GSC_CSV, 'utf8'));
  console.log(`✓ GSC loaded: ${gsc.length} queries`);
} else {
  console.log(`- GSC missing (${GSC_CSV}) — run npm run seo:gsc first`);
}

let trends = null;
if (fs.existsSync(TRENDS_JSON)) {
  trends = JSON.parse(fs.readFileSync(TRENDS_JSON, 'utf8'));
  console.log(`✓ Trends loaded: ${trends.results.length} keywords`);
} else {
  console.log(`- Trends missing (${TRENDS_JSON}) — run npm run seo:trends first`);
}

if (!gsc.length && !trends) {
  console.error('No data sources found. Aborting.');
  process.exit(1);
}

function fmtNum(n) {
  return n == null ? '—' : String(n);
}

const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
const sections = [];

sections.push(`## AUTO SNAPSHOT — ${now} UTC`);
sections.push('');
sections.push('> 本节由 `npm run seo:refresh` 自动生成。上方手工表格保留不动。');
sections.push('');

// --- Trends block ---
if (trends) {
  sections.push(`### Google Trends(geo=${trends.geo}, range ${trends.rangeStart} → ${trends.rangeEnd})`);
  sections.push('');
  sections.push(`tier 阈值: H ≥ ${trends.tierThresholds.H} · M ≥ ${trends.tierThresholds.M} (0-100 相对指数)`);
  sections.push('');
  sections.push('| 关键词 | 分类 | avg | peak | recent-4w | slope | tier | target |');
  sections.push('|---|---|---|---|---|---|---|---|');
  for (const r of [...trends.results].sort((a, b) => (b.avg ?? -1) - (a.avg ?? -1))) {
    const slope = r.slope === '+' ? '↑' : r.slope === '-' ? '↓' : '—';
    sections.push(
      `| ${r.term} | ${r.category ?? '—'} | ${fmtNum(r.avg)} | ${fmtNum(r.peak)} | ${fmtNum(r.recent)} | ${slope} | ${r.tier ?? '?'} | \`${r.target ?? ''}\` |`,
    );
  }
  sections.push('');
}

// --- GSC block ---
if (gsc.length) {
  // Derive tiers from impressions percentiles.
  const imps = gsc.map((r) => Number(r.impressions || 0)).sort((a, b) => b - a);
  const p80 = imps[Math.floor(imps.length * 0.05)] || 0; // top 5% → H
  const p50 = imps[Math.floor(imps.length * 0.25)] || 0; // top 25% → M
  const gscTier = (n) => (n >= p80 ? 'H' : n >= p50 ? 'M' : 'L');

  const topN = gsc.slice(0, 40);
  sections.push(`### Google Search Console — top 40 queries (last 28 days)`);
  sections.push('');
  sections.push(`tier 阈值: H ≥ ${p80} impressions (top 5%) · M ≥ ${p50} (top 25%)`);
  sections.push('');
  sections.push('| query | impressions | clicks | ctr | avg pos | tier | top landing page |');
  sections.push('|---|---|---|---|---|---|---|');
  for (const r of topN) {
    const imp = Number(r.impressions || 0);
    const page = (r.top_page || '').replace(/^https?:\/\/[^/]+/, '');
    sections.push(
      `| ${r.query} | ${r.impressions} | ${r.clicks} | ${r.ctr}% | ${r.position} | ${gscTier(imp)} | \`${page || '—'}\` |`,
    );
  }
  sections.push('');

  // Opportunities: pages with high impressions but rank 10-30 (striking distance)
  const strike = gsc.filter((r) => {
    const p = Number(r.position || 0);
    const imp = Number(r.impressions || 0);
    return p >= 10 && p <= 30 && imp >= 20;
  }).slice(0, 20);
  if (strike.length) {
    sections.push('### Striking distance (rank 10-30, ≥20 impressions) — quick-win 改写目标');
    sections.push('');
    sections.push('| query | position | impressions | clicks | landing page |');
    sections.push('|---|---|---|---|---|');
    for (const r of strike) {
      const page = (r.top_page || '').replace(/^https?:\/\/[^/]+/, '');
      sections.push(`| ${r.query} | ${r.position} | ${r.impressions} | ${r.clicks} | \`${page || '—'}\` |`);
    }
    sections.push('');
  }

  // Cross-check vs Trends: if trends says H but GSC shows rank > 20 → under-served
  if (trends) {
    const trendsMap = new Map(trends.results.map((r) => [r.term, r]));
    const underserved = [];
    for (const g of gsc.slice(0, 200)) {
      const t = trendsMap.get(g.query);
      const p = Number(g.position || 0);
      if (t && t.tier === 'H' && p > 20) {
        underserved.push({ query: g.query, position: g.position, impressions: g.impressions, trendsAvg: t.avg });
      }
    }
    if (underserved.length) {
      sections.push('### Trends 高但 GSC 排位 >20 — 优先改写');
      sections.push('');
      sections.push('| query | GSC pos | GSC imp | Trends avg |');
      sections.push('|---|---|---|---|');
      for (const r of underserved) {
        sections.push(`| ${r.query} | ${r.position} | ${r.impressions} | ${r.trendsAvg} |`);
      }
      sections.push('');
    }
  }
}

const snapshotBlock = `${MARK_BEGIN}\n\n${sections.join('\n')}\n${MARK_END}\n`;

let gap = fs.readFileSync(GAP_FILE, 'utf8');
if (gap.includes(MARK_BEGIN) && gap.includes(MARK_END)) {
  gap = gap.replace(
    new RegExp(`${MARK_BEGIN}[\\s\\S]*?${MARK_END}\\n?`),
    snapshotBlock,
  );
} else {
  gap = gap.replace(/\n?$/, '\n\n' + snapshotBlock);
}
fs.writeFileSync(GAP_FILE, gap);
console.log(`✓ ${GAP_FILE} updated`);
