#!/usr/bin/env node
/* Check a built figure-to-3d page the way a person would see it, before handing it over.

     node verify.mjs OUT.html [--shots <folder>] [--width 1280 --height 800]

   Opens the page in headless Chromium and screenshots: 6 angles (front, back, left, right, top, a three-quarter
   view), every Walk through step, Take apart, the cut at three depths, and Present. In every shot it checks that
   no two labels overlap and none runs off the page. It also reads <html data-errors> (script errors, a caption
   replaced before it could be read), and checks the file size, triangles and draw calls against a budget.

   Headless Chromium draws WebGL in software, so its frame rate says nothing about a real laptop: triangles and
   draw calls are the performance check instead. Exit code 1 if anything failed; the shots are in --shots
   (default: <OUT>.shots/) for you to look at. Look at them: a check can pass on a page that still reads badly. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { console.error('verify needs Playwright (npm i -g playwright, then npx playwright install chromium)'); process.exit(2); }

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : args.splice(i, 2)[1]; };
const W = +opt('--width', 1280), H = +opt('--height', 800);
const shotsArg = opt('--shots', null), page0 = args[0];
if (!page0) { console.error('usage: node verify.mjs OUT.html [--shots folder]'); process.exit(2); }
const shots = path.resolve(shotsArg || page0.replace(/\.html?$/, '') + '.shots');
const BUDGET = { mb: 10, triangles: 400000, calls: 120 };

fs.mkdirSync(shots, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const logs = [];
page.on('pageerror', e => logs.push('page error: ' + e.message));
page.on('console', m => { if (m.type() === 'error') logs.push('console: ' + m.text()); });
const url = 'file://' + path.resolve(page0);
const problems = [];
const results = [];

async function open(q = '') {
  await page.goto(url + q);
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 90000 });
  await page.evaluate(() => window.F3D.ready);
}
function overlaps(labels) {
  const bad = [];
  for (let i = 0; i < labels.length; i++) {
    const a = labels[i];
    if (a.l < 0 || a.t < 0 || a.r > W || a.b > H) bad.push(`"${a.text}" runs off the page`);
    for (let j = i + 1; j < labels.length; j++) {
      const b = labels[j];
      if (a.l < b.r - 1 && b.l < a.r - 1 && a.t < b.b - 1 && b.t < a.b - 1) bad.push(`"${a.text}" overlaps "${b.text}"`);
    }
  }
  return bad;
}
async function shot(name, act) {
  if (act) await page.evaluate(act);
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(shots, name + '.png') });
  const labels = await page.evaluate(() => window.F3D.labels());
  const bad = overlaps(labels);
  const caption = await page.evaluate(() => document.querySelector('.f3d-cap p:last-child')?.textContent || '');
  results.push({ name, labels: labels.length, caption, problems: bad });
  for (const b of bad) problems.push(`${name}: ${b}`);
  if (caption.length > 130) problems.push(`${name}: caption is ${caption.length} characters (keep it under about 90, never past 130)`);
}

await open();
const info = await page.evaluate(() => window.F3D.info());
const angles = { front: [0, 6], back: [180, 6], left: [-90, 6], right: [90, 6], top: [0, 80], 'three-quarter': [35, 20] };
for (const [n, [az, el]] of Object.entries(angles)) await shot('view-' + n, `window.F3D.view({az:${az},el:${el}})`);
for (let i = 0; i < info.steps; i++) await shot(`step-${i + 1}`, `window.F3D.go(${i})`);
await open();
if (info.apart) await shot('apart', 'window.F3D.apart(1)');
await open();
if (info.section) for (const v of [.3, .5, .7]) await shot('cut-' + Math.round(v * 100), `window.F3D.cut(${v})`);
await open('?present=1');
await shot('present');
const errors = await page.evaluate(() => document.documentElement.dataset.errors || '');
await browser.close();

const size = fs.statSync(page0).size;
if (errors.trim()) problems.push('data-errors:' + errors);
for (const l of logs) problems.push(l);
if (size > BUDGET.mb * 1048576) problems.push(`file is ${(size / 1048576).toFixed(1)} MB (target under ${BUDGET.mb} MB)`);
if (info.triangles > BUDGET.triangles) problems.push(`${info.triangles} triangles drawn (budget ${BUDGET.triangles})`);
if (info.calls > BUDGET.calls) problems.push(`${info.calls} draw calls (budget ${BUDGET.calls})`);

const report = { page: page0, size, ...info, shots: results, problems };
fs.writeFileSync(path.join(shots, 'report.json'), JSON.stringify(report, null, 2));
console.log(`${page0}: ${(size / 1048576).toFixed(2)} MB, ${info.parts} parts, ${info.triangles} triangles, ${info.calls} draw calls`);
console.log(`${results.length} shots in ${path.relative(process.cwd(), shots) || shots}`);
if (problems.length) { console.log(`${problems.length} problem(s):`); for (const p of problems) console.log('  - ' + p); process.exit(1); }
console.log('no problems found (now look at the shots)');
