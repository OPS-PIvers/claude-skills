#!/usr/bin/env node
/* Turn a figure-to-3d scene into one self-contained HTML page.

     node build.mjs <name>.scene.js [OUT.html] [--lib <mesh-library>] [--artifact]

   The scene is a plain script that calls mountModel({...}). The build bundles the engine with the pinned Three.js
   (esbuild, minified), inlines every mesh the scene names (`mesh: 'group/part'`) from the mesh library as base64
   GLB, writes the credits for those meshes from the library's manifest, and prints the size. OUT.html (default:
   <name>.html next to the scene) runs on its own: open it from disk, email it, publish it as an artifact.

   --artifact writes the page for publishing as a Claude artifact instead: no doctype, html, head or body tags (the
   artifact host adds its own), and the claude:viewport-fit-sides meta. Open that one through the artifact, not from
   disk. Build the plain file for disk, email and Drive.

   It also says whether the page would fit a SpartBoard mini-app (120k characters, nothing loaded from outside). A
   Three.js page never does; the line is there for the day a lighter renderer exists. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL = path.join(HERE, '..');
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i < 0 ? null : args.splice(i, 2)[1]; };
const libArg = opt('--lib');
const artifact = args.includes('--artifact'); if (artifact) args.splice(args.indexOf('--artifact'), 1);
const [scenePath, outArg] = args;
if (!scenePath) { console.error('usage: node build.mjs <name>.scene.js [OUT.html] [--lib <mesh-library>]'); process.exit(2); }

// the mesh library: --lib, else the repo's mesh-library/ (this skill lives at plugins/<plugin>/skills/<name>)
const lib = [libArg, path.join(SKILL, '..', '..', '..', '..', 'mesh-library'), path.join(process.cwd(), 'mesh-library')]
  .filter(Boolean).map(p => path.resolve(p)).find(p => fs.existsSync(path.join(p, 'manifest.json')));
const scene = fs.readFileSync(scenePath, 'utf8');
const ids = [...new Set([...scene.matchAll(/\bmesh\s*:\s*['"]([^'"]+)['"]/g)].map(m => m[1]))];
if (ids.length && !lib) { console.error('scene names meshes but no mesh library was found; pass --lib <folder with manifest.json>'); process.exit(1); }
const manifest = lib ? JSON.parse(fs.readFileSync(path.join(lib, 'manifest.json'), 'utf8')) : { groups: {}, meshes: {} };

const meshes = {}, bySource = new Map();
for (const id of ids) {
  const m = manifest.meshes[id];
  if (!m) { console.error(`mesh ${id} is not in ${path.join(lib, 'manifest.json')} (fetch and prep it first)`); process.exit(1); }
  meshes[id] = fs.readFileSync(path.join(lib, m.file)).toString('base64');
  const g = manifest.groups[id.split('/').slice(0, -1).join('/')];
  const src = g.source, key = src.id + '|' + src.credit;
  if (!bySource.has(key)) bySource.set(key, { name: src.name, url: src.url, license: src.license, credit: src.credit, parts: [] });
  bySource.get(key).parts.push(m.name);
}

const bundle = await esbuild.build({ sourcemap: process.env.F3D_DEBUG ? 'inline' : false,
  entryPoints: [path.join(SKILL, 'assets', 'engine.js')], bundle: true, minify: true, format: 'iife',
  target: 'es2020', write: false, legalComments: 'none', absWorkingDir: SKILL, logLevel: 'error',
});
const engine = bundle.outputFiles[0].text;

const title = (scene.match(/\btitle\s*:\s*(['"])(.*?)\1/) || [])[2] || 'Model';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const safe = s => s.replace(/<\/script/gi, '<\\/script');
const body = `<script id="f3d-meshes" type="application/json">${JSON.stringify(meshes)}</script>
<script id="f3d-credits" type="application/json">${safe(JSON.stringify([...bySource.values()]))}</script>
<script>/* three.js (MIT) and the figure-to-3d engine */${safe(engine)}</script>
<script>
${safe(scene)}
</script>
`;
const page = artifact
  ? `<title>${esc(title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="generator" content="figure-to-3d">
${body}`
  : `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="generator" content="figure-to-3d">
</head>
<body>
${body}</body>
</html>
`;
const out = outArg || scenePath.replace(/(\.scene)?\.js$/, '') + '.html';
fs.writeFileSync(out, page);
const kb = n => (n / 1024).toFixed(0) + ' KB';
const meshBytes = Object.values(meshes).reduce((s, b) => s + b.length, 0);
console.log(`${out}: ${(page.length / 1048576).toFixed(2)} MB (engine ${kb(engine.length)}, ${ids.length} meshes ${kb(meshBytes)}, scene ${kb(scene.length)})`);
if (page.length > 16 * 1048576) console.log('  over 16 MB: too big to publish as an artifact; lower the triangle budget in the recipe');
else if (page.length > 10 * 1048576) console.log('  over the 10 MB target; consider a lower triangle budget');
console.log(`  SpartBoard mini-app: ${page.length <= 120000 ? 'fits' : 'does not fit'} (${page.length.toLocaleString()} of 120,000 characters)`);
