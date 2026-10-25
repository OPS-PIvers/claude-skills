#!/usr/bin/env node
/* Find and download raw meshes for the mesh library. prep-mesh.mjs then cleans them into parts.

     node fetch-mesh.mjs search bp3d <words>            BodyParts3D structures matching the words (FMA id, name, files)
     node fetch-mesh.mjs parts bp3d <FMA id>             the mesh files in one structure, each with its own most
                                                         specific name and its bounds (mm), to write a recipe from
     node fetch-mesh.mjs get bp3d <recipe.json> [--to D] the recipe's OBJ files, from the BodyParts3D archive (62 MB,
                                                         downloaded once into the cache)
     node fetch-mesh.mjs search si <words>               Smithsonian Open Access 3D (CC0): GLB files
     node fetch-mesh.mjs search sketchfab <words>        Sketchfab models you may download (CC BY or CC0 only)
     node fetch-mesh.mjs get sketchfab <uid> [--to D]    download one (needs a Sketchfab token: SKETCHFAB_TOKEN, or
                                                         one saved on the cloud environment for api.sketchfab.com)
     node fetch-mesh.mjs get url <url> [--to D]          any file: a GLB from NIH 3D (3d.nih.gov, download it from the
                                                         model's page) or the Smithsonian

   Downloads go to --to (default: the cache's raw/ folder); the cache is $FIGURE_TO_3D_CACHE or
   ~/.cache/figure-to-3d. Every search prints the license; record it, and the credit line, in the recipe. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const CACHE = process.env.FIGURE_TO_3D_CACHE || path.join(os.homedir(), '.cache', 'figure-to-3d');
const BP3D = 'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/';
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i < 0 ? null : args.splice(i, 2)[1]; };
const to = path.resolve(opt('--to') || path.join(CACHE, 'raw'));
const [cmd, source, ...rest] = args;
const words = rest.join(' ');

async function download(url, file, headers = {}) {
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return file;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  process.stderr.write(`downloading ${url}\n`);
  const r = await fetch(url, { headers, redirect: 'follow' });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${url}`);
  fs.writeFileSync(file + '.part', Buffer.from(await r.arrayBuffer()));
  fs.renameSync(file + '.part', file);
  return file;
}
async function json(url, headers = {}) {
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${url}`);
  return r.json();
}
const tsv = file => fs.readFileSync(file, 'utf8').split('\n').slice(1).filter(Boolean).map(l => l.split('\t'));

// ---- BodyParts3D: the part-of tree, one OBJ per element; a structure is a set of elements ----
async function bp3dTables() {
  const d = path.join(CACHE, 'bp3d');
  const parts = tsv(await download(BP3D + 'partof_parts_list_e.txt', path.join(d, 'partof_parts_list_e.txt')));
  const elems = tsv(await download(BP3D + 'partof_element_parts.txt', path.join(d, 'partof_element_parts.txt')));
  const byConcept = new Map(), names = new Map(parts.map(([c, , n]) => [c, n]));
  for (const [c, n, f] of elems) { names.set(c, names.get(c) || n); if (!byConcept.has(c)) byConcept.set(c, new Set()); byConcept.get(c).add(f); }
  return { names, byConcept };
}
async function bp3dZip() {
  return download(BP3D + 'partof_BP3D_4.0_obj_99.zip', path.join(CACHE, 'bp3d', 'partof_BP3D_4.0_obj_99.zip'));
}
function unzip(zip, members, dest) {           // the system's unzip, else Python's zipfile
  fs.mkdirSync(dest, { recursive: true });
  try { execFileSync('unzip', ['-o', '-j', '-q', zip, ...members, '-d', dest]); return; } catch (e) { if (e.code !== 'ENOENT') throw e; }
  execFileSync('python3', ['-I', '-c', `import sys,zipfile,os
z=zipfile.ZipFile(sys.argv[1]); d=sys.argv[2]
for m in sys.argv[3:]: open(os.path.join(d,os.path.basename(m)),'wb').write(z.read(m))`, zip, dest, ...members]);
}
const member = f => `partof_BP3D_4.0_obj_99/${f}.obj`;

async function main() {
  if (cmd === 'search' && source === 'bp3d') {
    const { names, byConcept } = await bp3dTables();
    const re = new RegExp(words.split(/\s+/).map(w => `(?=.*${w.replace(/[^\w-]/g, '')})`).join(''), 'i');
    const hits = [...names].filter(([, n]) => re.test(n)).sort((a, b) => a[1].localeCompare(b[1]));
    for (const [c, n] of hits.slice(0, 80)) console.log(`${c.padEnd(9)} ${String(byConcept.get(c)?.size || 0).padStart(4)} files  ${n}`);
    console.log(`${hits.length} match(es). License: CC BY 4.0, credit "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International".`);
    return;
  }
  if (cmd === 'parts' && source === 'bp3d') {
    const { names, byConcept } = await bp3dTables();
    const files = [...(byConcept.get(rest[0]) || [])].sort();
    if (!files.length) throw new Error('no files for ' + rest[0]);
    const zip = await bp3dZip(), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bp3d-'));
    unzip(zip, files.map(member), tmp);
    for (const f of files) {   // the most specific structure an element belongs to names it
      let best = rest[0]; for (const [c, s] of byConcept) if (s.has(f) && s.size < byConcept.get(best).size) best = c;
      const head = fs.readFileSync(path.join(tmp, f + '.obj'), 'utf8').slice(0, 1500);
      const b = (head.match(/Bounds\(mm\): (\([^)]*\)-\([^)]*\))/) || [])[1] || '';
      console.log(`${f.padEnd(8)} ${names.get(best).padEnd(60)} ${b}`);
    }
    fs.rmSync(tmp, { recursive: true });
    return;
  }
  if (cmd === 'get' && source === 'bp3d') {
    const recipe = JSON.parse(fs.readFileSync(rest[0], 'utf8'));
    const files = [...new Set(recipe.parts.flatMap(p => p.files))];
    unzip(await bp3dZip(), files.map(member), to);
    console.log(`${files.length} OBJ files in ${to}\nnext: node prep-mesh.mjs ${rest[0]} --src ${to}`);
    return;
  }
  if (cmd === 'search' && source === 'si') {
    const q = encodeURIComponent(words);
    const r = await json(`https://3d-api.si.edu/api/v1.0/content/file/search?q=${q}&file_type=glb&rows=60`);
    const seen = new Set();
    for (const row of r.rows || []) {
      const c = row.content || {}; if (!/High|Medium|Low/.test(c.quality) || seen.has(c.uri)) continue; seen.add(c.uri);
      console.log(`${(c.quality || '').padEnd(6)} ${row.title}\n       ${c.uri}${c.draco_compressed ? '  (Draco)' : ''}`);
    }
    console.log('License: CC0 (Smithsonian Open Access). Download one with: get url <uri>');
    return;
  }
  if (cmd === 'search' && source === 'sketchfab') {
    for (const lic of ['by', 'cc0']) {
      const r = await json(`https://api.sketchfab.com/v3/search?type=models&downloadable=true&license=${lic}&count=12&q=${encodeURIComponent(words)}`);
      for (const m of r.results || [])
        console.log(`${m.uid}  ${lic === 'by' ? 'CC BY' : 'CC0  '}  ${m.name}  by ${m.user?.displayName || m.user?.username}  (${m.faceCount ?? '?'} faces)  ${m.viewerUrl}`);
    }
    console.log('Credit for CC BY: "<name>" by <author>, licensed under CC BY 4.0, <viewerUrl>.');
    return;
  }
  if (cmd === 'get' && source === 'sketchfab') {
    const h = process.env.SKETCHFAB_TOKEN ? { Authorization: 'Token ' + process.env.SKETCHFAB_TOKEN } : {};
    const r = await fetch(`https://api.sketchfab.com/v3/models/${rest[0]}/download`, { headers: h });
    if (r.status === 401 || r.status === 403) throw new Error('Sketchfab wants a token for downloads: none is set, so skip Sketchfab');
    if (!r.ok) throw new Error(`${r.status} from Sketchfab`);
    const d = await r.json(), m = await json(`https://api.sketchfab.com/v3/models/${rest[0]}`);
    const link = d.glb?.url || d.gltf?.url;
    const file = await download(link, path.join(to, rest[0] + (d.glb ? '.glb' : '.zip')));
    console.log(`${file}\nlicense: ${m.license?.label}\ncredit: "${m.name}" by ${m.user?.displayName}, ${m.license?.label}, ${m.viewerUrl}`);
    return;
  }
  if (cmd === 'get' && source === 'url') {
    const name = decodeURIComponent(new URL(rest[0]).pathname.split('/').pop() || 'download');
    console.log(await download(rest[0], path.join(to, name)));
    return;
  }
  console.error(fs.readFileSync(new URL(import.meta.url), 'utf8').match(/\/\*([\s\S]*?)\*\//)[1]);
  process.exit(2);
}
main().catch(e => { console.error(e.message); process.exit(1); });
