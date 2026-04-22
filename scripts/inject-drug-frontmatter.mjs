#!/usr/bin/env node
/**
 * One-shot helper: inject `drug:` frontmatter block into medication MDX pages.
 * Idempotent — skips files that already contain `^drug:` in the first 20 lines.
 * Anchors on the unique `references:` frontmatter line for each file.
 */
import fs from 'node:fs';
import path from 'node:path';

const DRUGS = {
  'src/content/docs/zh/medications/antiandrogens/spironolactone.mdx': {
    nonProprietaryName: 'Spironolactone',
    activeIngredient: '螺内酯 (Spironolactone)',
    mechanismOfAction: '醛固酮受体拮抗剂(保钾利尿);高剂量下兼具雄激素受体拮抗作用,并抑制睾酮合成',
    atc: 'C03DA01',
  },
  'src/content/docs/zh/medications/antiandrogens/bicalutamide.mdx': {
    nonProprietaryName: 'Bicalutamide',
    activeIngredient: '比卡鲁胺 (Bicalutamide)',
    mechanismOfAction: '非甾体选择性雄激素受体拮抗剂;单用时血清睾酮不下降,肝毒性是主要安全关注',
    atc: 'L02BB03',
  },
  'src/content/docs/zh/medications/antiandrogens/gnrh-agonists.mdx': {
    nonProprietaryName: 'GnRH agonist',
    activeIngredient: '亮丙瑞林 / 戈舍瑞林 / 曲普瑞林 (Leuprolide / Goserelin / Triptorelin)',
    mechanismOfAction: 'GnRH 受体激动剂;持续激动导致垂体脱敏,LH/FSH 分泌抑制,睾酮降至去势水平',
    atc: 'L02AE',
  },
  'src/content/docs/zh/medications/estrogens/oral.mdx': {
    nonProprietaryName: 'Estradiol valerate / Estradiol',
    activeIngredient: '戊酸雌二醇 / 雌二醇 (Estradiol valerate / Estradiol)',
    mechanismOfAction: '雌激素受体激动剂;口服经肝脏首过代谢,影响凝血因子与 SHBG',
    atc: 'G03CA03',
  },
  'src/content/docs/zh/medications/estrogens/sublingual.mdx': {
    nonProprietaryName: 'Estradiol',
    activeIngredient: '雌二醇 (Estradiol)',
    mechanismOfAction: '雌激素受体激动剂;舌下黏膜吸收部分绕过肝首过,血药浓度呈尖峰谷值波动',
    atc: 'G03CA03',
  },
  'src/content/docs/zh/medications/estrogens/gel.mdx': {
    nonProprietaryName: 'Estradiol',
    activeIngredient: '雌二醇 (Estradiol)',
    mechanismOfAction: '雌激素受体激动剂;经皮吸收完全绕过肝首过,VTE 风险显著低于口服',
    atc: 'G03CA03',
  },
  'src/content/docs/zh/medications/estrogens/transdermal-patch.mdx': {
    nonProprietaryName: 'Estradiol',
    activeIngredient: '雌二醇 (Estradiol)',
    mechanismOfAction: '雌激素受体激动剂;经皮贴剂提供稳态释放,绕过肝首过,血药浓度平稳',
    atc: 'G03CA03',
  },
  'src/content/docs/zh/medications/estrogens/injection.mdx': {
    nonProprietaryName: 'Estradiol valerate',
    activeIngredient: '戊酸雌二醇 (Estradiol valerate)',
    mechanismOfAction: '雌激素受体激动剂;肌注酯类缓慢水解释放雌二醇,半衰期 4-5 天',
    atc: 'G03CA03',
  },
  'src/content/docs/zh/medications/estrogens/cypionate.mdx': {
    nonProprietaryName: 'Estradiol cypionate',
    activeIngredient: '环戊丙酸雌二醇 (Estradiol cypionate)',
    mechanismOfAction: '雌激素受体激动剂;肌注长效酯,释放比戊酸酯更缓慢',
    atc: 'G03CA03',
  },
  'src/content/docs/zh/medications/estrogens/enanthate.mdx': {
    nonProprietaryName: 'Estradiol enanthate',
    activeIngredient: '庚酸雌二醇 (Estradiol enanthate)',
    mechanismOfAction: '雌激素受体激动剂;肌注长效酯,半衰期约 7-10 天,给药间隔更长',
    atc: 'G03CA03',
  },
  'src/content/docs/zh/medications/estrogens/undecylate.mdx': {
    nonProprietaryName: 'Estradiol undecylate',
    activeIngredient: '十一酸雌二醇 (Estradiol undecylate)',
    mechanismOfAction: '雌激素受体激动剂;肌注超长效酯,半衰期 20+ 天,已在多数市场停产',
    atc: 'G03CA03',
  },
  'src/content/docs/zh/medications/progestogens/progesterone.mdx': {
    nonProprietaryName: 'Progesterone',
    activeIngredient: '微粒化黄体酮 (Micronized progesterone)',
    mechanismOfAction: '孕激素受体激动剂;口服代谢生成别孕烷醇酮等神经活性代谢物,影响镇静',
    atc: 'G03DA04',
  },
  'src/content/docs/zh/medications/progestogens/dydrogesterone.mdx': {
    nonProprietaryName: 'Dydrogesterone',
    activeIngredient: '地屈孕酮 (Dydrogesterone)',
    mechanismOfAction: '选择性孕激素受体激动剂(反式孕酮异构体);无雄激素/雌激素活性',
    atc: 'G03DB01',
  },
  'src/content/docs/zh/medications/progestogens/drospirenone.mdx': {
    nonProprietaryName: 'Drospirenone',
    activeIngredient: '屈螺酮 (Drospirenone)',
    mechanismOfAction: '孕激素受体激动剂,兼具抗盐皮质激素和抗雄激素活性;结构类似螺内酯',
    atc: 'G03AA12',
  },
};

let injected = 0;
let skipped = 0;

for (const [relPath, drug] of Object.entries(DRUGS)) {
  const abs = path.resolve(relPath);
  if (!fs.existsSync(abs)) {
    console.warn(`SKIP (missing): ${relPath}`);
    continue;
  }
  const src = fs.readFileSync(abs, 'utf8');
  const head = src.split('\n').slice(0, 20).join('\n');
  if (/^drug:/m.test(head)) {
    skipped++;
    continue;
  }
  const refLineMatch = src.match(/^references:\s*\[[^\]]*\]\s*$/m);
  if (!refLineMatch) {
    console.warn(`SKIP (no references line): ${relPath}`);
    continue;
  }
  const refLine = refLineMatch[0];
  const block =
    refLine +
    '\n' +
    'drug:\n' +
    `  nonProprietaryName: "${drug.nonProprietaryName}"\n` +
    `  activeIngredient: "${drug.activeIngredient}"\n` +
    `  mechanismOfAction: "${drug.mechanismOfAction}"\n` +
    `  atc: "${drug.atc}"`;
  const next = src.replace(refLine, block);
  fs.writeFileSync(abs, next);
  injected++;
  console.log(`✓ ${relPath}`);
}

console.log(`\nInjected: ${injected} · Skipped (already had drug:): ${skipped}`);
