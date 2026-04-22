#!/usr/bin/env node
/**
 * Postbuild: generate a per-page OG image (1200×630 PNG) for every MDX doc
 * and write to dist/og/<locale>/<path>.png. Overwrites the <meta og:image>
 * injected by Head.astro at render time (which points here).
 *
 * Uses sharp with an in-memory SVG template. 米哈游「二相乐园」palette:
 *   bg #0D0B14, panel #1A1625 at 60%, primary #C84B7C (绯), accent #D4A853 (幻月金)
 *
 * Fonts: SVG uses "Noto Serif SC" for title, "Noto Sans SC" for meta; sharp
 * renders via fontconfig on the host. Chinese fallback stack ensures pages
 * render even without Noto SC locally — sharp substitutes a default CJK font.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const CONTENT_DIR = path.resolve('src/content/docs');
const OUT_DIR = path.resolve('dist/og');

const COLORS = {
  bg: '#0D0B14',
  panel: '#1A1625',
  primary: '#C84B7C',
  accent: '#D4A853',
  text: '#F5EEDC',
  muted: '#8B7E92',
};

const EVIDENCE_FILL = {
  A: '#3FA66A',
  B: '#4A8CC1',
  C: '#D4A853',
  X: '#C84B7C',
};

function escapeXml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Wrap long CJK titles by character count (CJK chars ~ 1.3× width of Latin). */
function wrapTitle(title, maxCharsPerLine = 18, maxLines = 3) {
  const chars = [...title];
  const lines = [];
  let cur = '';
  for (const c of chars) {
    if ([...cur].length >= maxCharsPerLine) {
      lines.push(cur);
      cur = '';
      if (lines.length === maxLines - 1) break;
    }
    cur += c;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  // If we truncated, add ellipsis.
  if ([...title].length > lines.join('').length) {
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1) + '…';
  }
  return lines;
}

function buildSvg({ title, description, evidenceLevel, refCount, lastReviewed, locale }) {
  const W = 1200;
  const H = 630;
  const lines = wrapTitle(title, 16, 3);
  const lineHeight = 88;
  const titleStartY = 260 - ((lines.length - 1) * lineHeight) / 2;

  const evidenceFill = evidenceLevel && EVIDENCE_FILL[evidenceLevel] ? EVIDENCE_FILL[evidenceLevel] : null;

  const metaParts = [];
  if (evidenceLevel) metaParts.push(`证据 ${evidenceLevel}`);
  if (typeof refCount === 'number' && refCount > 0) metaParts.push(`参考文献 ${refCount}`);
  if (lastReviewed) metaParts.push(`复查 ${lastReviewed}`);
  const metaText = metaParts.join('  ·  ');

  const brand = 'HRT药典 · hrtyaku.com';
  const tagline = '循证 · 减害 · 引导就医';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.bg}"/>
      <stop offset="100%" stop-color="#1E1A2E"/>
    </linearGradient>
    <linearGradient id="accentBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${COLORS.primary}"/>
      <stop offset="100%" stop-color="${COLORS.accent}"/>
    </linearGradient>
    <style>
      .title { font-family: "Noto Serif SC", "Noto Serif CJK SC", "Source Han Serif SC", "Songti SC", "SimSun", serif; font-weight: 700; fill: ${COLORS.text}; }
      .desc  { font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif; font-weight: 400; fill: ${COLORS.muted}; }
      .brand { font-family: "Noto Serif SC", serif; font-weight: 600; fill: ${COLORS.accent}; letter-spacing: 0.1em; }
      .meta  { font-family: "JetBrains Mono", "Menlo", monospace; font-weight: 500; fill: ${COLORS.muted}; letter-spacing: 0.08em; }
      .tag   { font-family: "Noto Sans SC", sans-serif; font-weight: 400; fill: ${COLORS.muted}; letter-spacing: 0.3em; }
      .badge { font-family: "JetBrains Mono", monospace; font-weight: 700; fill: #fff; }
    </style>
  </defs>

  <!-- background -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>

  <!-- diagonal clip-path panel (米哈游 style) -->
  <path d="M 60 60 L ${W - 76} 60 L ${W - 60} 76 L ${W - 60} ${H - 60} L 76 ${H - 60} L 60 ${H - 76} Z"
        fill="${COLORS.panel}" fill-opacity="0.7" stroke="${COLORS.primary}" stroke-opacity="0.25" stroke-width="1.5"/>

  <!-- accent bar top -->
  <rect x="80" y="90" width="140" height="4" fill="url(#accentBar)"/>

  <!-- brand line -->
  <text x="80" y="130" class="brand" font-size="22">${escapeXml(brand)}</text>
  <text x="80" y="160" class="tag" font-size="14">${escapeXml(tagline)}</text>

  <!-- title -->
  ${lines
    .map(
      (ln, i) =>
        `<text x="80" y="${titleStartY + i * lineHeight}" class="title" font-size="68">${escapeXml(ln)}</text>`,
    )
    .join('\n  ')}

  <!-- description -->
  ${
    description
      ? `<text x="80" y="${titleStartY + lines.length * lineHeight + 24}" class="desc" font-size="22">${escapeXml(
          [...description].slice(0, 48).join('') + ([...description].length > 48 ? '…' : ''),
        )}</text>`
      : ''
  }

  <!-- meta strip bottom -->
  <rect x="60" y="${H - 100}" width="${W - 120}" height="1" fill="${COLORS.primary}" fill-opacity="0.3"/>
  ${evidenceFill
    ? `<rect x="80" y="${H - 78}" width="44" height="44" rx="6" fill="${evidenceFill}"/>
       <text x="102" y="${H - 48}" class="badge" font-size="28" text-anchor="middle">${escapeXml(evidenceLevel)}</text>`
    : ''}
  <text x="${evidenceFill ? 140 : 80}" y="${H - 50}" class="meta" font-size="20">${escapeXml(metaText)}</text>
  <text x="${W - 80}" y="${H - 50}" class="meta" font-size="18" text-anchor="end">${escapeXml((locale || 'zh').toUpperCase())}</text>
</svg>`;
}

function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const body = m[1];
  const out = {};
  // minimal yaml-like: key: value on single line (quoted or bare)
  for (const line of body.split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let val = kv[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function walk(dir, relParts, out) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      walk(abs, [...relParts, name], out);
    } else if (/\.(md|mdx)$/.test(name)) {
      const slug = name.replace(/\.(md|mdx)$/, '');
      const parts = slug === 'index' ? relParts : [...relParts, slug];
      out.push({ abs, parts });
    }
  }
}

async function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error('No content dir; skipping OG generation.');
    return;
  }
  const entries = [];
  walk(CONTENT_DIR, [], entries);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0;
  let fail = 0;
  for (const { abs, parts } of entries) {
    try {
      const src = fs.readFileSync(abs, 'utf8');
      const fm = parseFrontmatter(src);
      if (!fm || !fm.title) continue;

      const locale = parts[0];
      // Count references from the raw yaml line (array).
      const refLine = src.match(/^references:\s*\[([^\]]*)\]/m);
      const refCount = refLine
        ? refLine[1].split(',').filter((s) => s.trim().length > 0).length
        : 0;

      const svg = buildSvg({
        title: fm.title,
        description: fm.description,
        evidenceLevel: fm.evidenceLevel,
        refCount,
        lastReviewed: fm.lastReviewed,
        locale,
      });

      const outPath = path.join(OUT_DIR, ...parts) + '.png';
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      await sharp(Buffer.from(svg))
        .resize(1200, 630, { fit: 'cover' })
        .png({ compressionLevel: 9 })
        .toFile(outPath);
      ok++;
    } catch (err) {
      fail++;
      console.warn(`OG fail ${abs}: ${err.message}`);
    }
  }
  console.log(`OG images generated: ${ok} ok · ${fail} failed · out=${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
