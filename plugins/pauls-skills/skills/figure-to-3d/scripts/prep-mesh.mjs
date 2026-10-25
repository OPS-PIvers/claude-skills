#!/usr/bin/env node
/* Turn raw meshes into clean, small parts for the mesh library.

     node prep-mesh.mjs <recipe.json> --src <folder of raw files> [--out <mesh-library>]

   A recipe (kept next to the meshes, as mesh-library/<group>/recipe.json, so a mesh can always be rebuilt) names
   the group, its source and license, and the parts:

     { "group": "bp3d/heart", "units": "mm", "up": "z", "front": "-y", "scale": 0.1,
       "source": { "id": "bp3d", "name": "BodyParts3D", "url": "…", "license": "CC BY 4.0", "credit": "…" },
       "budget": 120000,                                   // triangles for the whole group
       "parts": [ { "id": "right-atrium", "name": "Right atrium", "files": ["FJ2439"], "tris": 12000 }, … ] }

   A part may also give "keep": { "z": [1160, null] } (source units and axes) to drop every triangle with a corner
   outside that range: a vessel cut to a short stub, a bone cut where the figure stops.

   Each part's files (OBJ, GLB or glTF, looked up in --src by name with or without the extension) are merged into one
   mesh, turned to Y up with the front toward +Z, scaled (to cm by default), centred on the *group* (so parts keep
   their places relative to each other), welded, simplified to the part's triangle target, given smooth normals,
   quantized and meshopt-compressed. Out: <out>/<group>/<id>.glb, plus the group's entries in <out>/manifest.json
   (source, license, credit, triangles, bounds and centre of every part, sha256 of every file). */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, quantize, meshopt, dedup, prune } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder } from 'meshoptimizer';
import draco3d from 'draco3dgltf';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i < 0 ? null : args.splice(i, 2)[1]; };
const src = opt('--src');
const out = path.resolve(opt('--out') || path.join(HERE, '..', '..', '..', '..', '..', 'mesh-library'));
const recipePath = args[0];
if (!recipePath || !src) { console.error('usage: node prep-mesh.mjs <recipe.json> --src <folder> [--out <mesh-library>]'); process.exit(2); }
const recipe = JSON.parse(fs.readFileSync(recipePath, 'utf8'));

await MeshoptSimplifier.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(), 'meshopt.encoder': MeshoptEncoder });

// ---- read raw files into plain triangle soups: { pos: Float32Array, idx: Uint32Array } ----
function readOBJ(file) {
  const v = [], idx = [];
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (line.startsWith('v ')) { const p = line.split(/\s+/); v.push(+p[1], +p[2], +p[3]); }
    else if (line.startsWith('f ')) {
      const f = line.trim().split(/\s+/).slice(1).map(s => parseInt(s, 10)).map(i => i < 0 ? v.length / 3 + i : i - 1);
      for (let k = 1; k + 1 < f.length; k++) idx.push(f[0], f[k], f[k + 1]);
    }
  }
  return [{ pos: new Float32Array(v), idx: new Uint32Array(idx) }];
}
async function readGLTF(file) {                         // every primitive, with its node's world transform baked in
  const doc = await io.read(file), soups = [];
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh(); if (!mesh) continue;
    const m = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const a = prim.getAttribute('POSITION'); if (!a) continue;
      const pos = new Float32Array(a.getCount() * 3), p = [0, 0, 0];
      for (let i = 0; i < a.getCount(); i++) {
        a.getElement(i, p);
        pos[i*3]   = m[0]*p[0] + m[4]*p[1] + m[8]*p[2]  + m[12];
        pos[i*3+1] = m[1]*p[0] + m[5]*p[1] + m[9]*p[2]  + m[13];
        pos[i*3+2] = m[2]*p[0] + m[6]*p[1] + m[10]*p[2] + m[14];
      }
      const ia = prim.getIndices();
      const idx = ia ? Uint32Array.from(ia.getArray()) : Uint32Array.from({ length: a.getCount() }, (_, i) => i);
      soups.push({ pos, idx });
    }
  }
  return soups;
}
function find(name) {
  for (const f of [name, name + '.obj', name + '.glb', name + '.gltf']) {
    const p = path.join(src, f); if (fs.existsSync(p)) return p;
  }
  throw new Error(`no file for ${name} in ${src}`);
}
async function readAny(name) {
  const file = find(name);
  return /\.obj$/i.test(file) ? readOBJ(file) : readGLTF(file);
}

// drop triangles with a corner outside keep's ranges, e.g. { z: [1160, null] }
function trim(s, keep) {
  const tests = Object.entries(keep).map(([ax, [lo, hi]]) => [{ x: 0, y: 1, z: 2 }[ax], lo ?? -Infinity, hi ?? Infinity]);
  const ok = v => tests.every(([k, lo, hi]) => s.pos[v*3 + k] >= lo && s.pos[v*3 + k] <= hi);
  const map = new Map(), pos = [], idx = [];
  const use = v => { if (!map.has(v)) { map.set(v, pos.length / 3); pos.push(s.pos[v*3], s.pos[v*3+1], s.pos[v*3+2]); } return map.get(v); };
  for (let i = 0; i < s.idx.length; i += 3)
    if (ok(s.idx[i]) && ok(s.idx[i+1]) && ok(s.idx[i+2])) idx.push(use(s.idx[i]), use(s.idx[i+1]), use(s.idx[i+2]));
  return { pos: new Float32Array(pos), idx: new Uint32Array(idx) };   // unused corners dropped, so bounds stay true
}

// ---- axes: the source's up and front become +Y and +Z ----
const AX = { x: [1,0,0], y: [0,1,0], z: [0,0,1] };
const axis = s => { const a = AX[s.replace('-', '')]; return s.startsWith('-') ? a.map(c => -c) : a; };
const up = axis(recipe.up || 'y'), front = axis(recipe.front || 'z');
const right = [up[1]*front[2] - up[2]*front[1], up[2]*front[0] - up[0]*front[2], up[0]*front[1] - up[1]*front[0]];
const dot = (a, x, y, z) => a[0]*x + a[1]*y + a[2]*z;
const scale = recipe.scale ?? ({ mm: .1, cm: 1, m: 100 }[recipe.units] ?? 1);

// Area-weighted smooth normals on the welded mesh (gltf-transform's normals() unwelds, which breaks the indices).
function smoothNormals(doc) {
  for (const mesh of doc.getRoot().listMeshes()) for (const prim of mesh.listPrimitives()) {
    const p = prim.getAttribute('POSITION').getArray(), ix = prim.getIndices().getArray(), n = new Float32Array(p.length);
    for (let i = 0; i < ix.length; i += 3) {
      const a = ix[i]*3, b = ix[i+1]*3, c = ix[i+2]*3;
      const ux = p[b]-p[a], uy = p[b+1]-p[a+1], uz = p[b+2]-p[a+2], vx = p[c]-p[a], vy = p[c+1]-p[a+1], vz = p[c+2]-p[a+2];
      const nx = uy*vz - uz*vy, ny = uz*vx - ux*vz, nz = ux*vy - uy*vx;
      for (const o of [a, b, c]) { n[o] += nx; n[o+1] += ny; n[o+2] += nz; }
    }
    for (let i = 0; i < n.length; i += 3) { const l = Math.hypot(n[i], n[i+1], n[i+2]) || 1; n[i] /= l; n[i+1] /= l; n[i+2] /= l; }
    prim.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(n).setBuffer(doc.getRoot().listBuffers()[0]));
  }
}

const parts = [];
for (const part of recipe.parts) {
  let soups = (await Promise.all(part.files.map(readAny))).flat();
  if (part.keep) soups = soups.map(s => trim(s, part.keep));
  let n = 0, t = 0; for (const s of soups) { n += s.pos.length / 3; t += s.idx.length; }
  const pos = new Float32Array(n * 3), idx = new Uint32Array(t);
  let vo = 0, io2 = 0;
  for (const s of soups) {
    for (let i = 0; i < s.pos.length; i += 3) {
      const x = s.pos[i], y = s.pos[i+1], z = s.pos[i+2], o = vo * 3 + i;
      pos[o] = dot(right, x, y, z) * scale; pos[o+1] = dot(up, x, y, z) * scale; pos[o+2] = dot(front, x, y, z) * scale;
    }
    for (let i = 0; i < s.idx.length; i++) idx[io2 + i] = s.idx[i] + vo;
    vo += s.pos.length / 3; io2 += s.idx.length;
  }
  parts.push({ ...part, pos, idx });
}

// centre the group on the middle of its bounding box
const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (const p of parts) for (let i = 0; i < p.pos.length; i++) { const k = i % 3; lo[k] = Math.min(lo[k], p.pos[i]); hi[k] = Math.max(hi[k], p.pos[i]); }
const mid = lo.map((l, k) => (l + hi[k]) / 2);
for (const p of parts) for (let i = 0; i < p.pos.length; i++) p.pos[i] -= mid[i % 3];

const total = parts.reduce((s, p) => s + p.idx.length / 3, 0);
const budget = recipe.budget || 150000;
const dir = path.join(out, recipe.group); fs.mkdirSync(dir, { recursive: true });
const entries = [];
let kept = 0;
for (const p of parts) {
  const tris = p.idx.length / 3;
  const target = p.tris ?? Math.round(budget * tris / total);
  const doc = new Document(), buf = doc.createBuffer();
  const prim = doc.createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(p.pos).setBuffer(buf))
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(p.idx).setBuffer(buf));
  const scene = doc.createScene();
  scene.addChild(doc.createNode(p.id).setMesh(doc.createMesh(p.id).addPrimitive(prim)));
  await doc.transform(
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: Math.min(1, target / tris), error: 0.01, lockBorder: false }),
    smoothNormals,
    dedup(), prune(),
    quantize({ quantizePosition: 14, quantizeNormal: 10 }),
    meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
  );
  const pr = doc.getRoot().listMeshes()[0].listPrimitives()[0];
  const nt = pr.getIndices().getCount() / 3;
  // bounds and centre from the original (unquantized) positions
  const b0 = [Infinity, Infinity, Infinity], b1 = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < p.pos.length; i++) { const k = i % 3; b0[k] = Math.min(b0[k], p.pos[i]); b1[k] = Math.max(b1[k], p.pos[i]); }
  const r3 = a => a.map(v => Math.round(v * 100) / 100);
  const file = path.join(dir, p.id + '.glb');
  const bytes = await io.writeBinary(doc);
  fs.writeFileSync(file, bytes);
  kept += nt;
  entries.push({
    id: `${recipe.group}/${p.id}`, name: p.name, file: path.relative(out, file).split(path.sep).join('/'),
    source: recipe.source.id, sourceIds: p.files, ...(p.ref ? { ref: p.ref } : {}),
    triangles: nt, bytes: bytes.length, units: 'cm',
    bounds: [r3(b0), r3(b1)], center: r3(b0.map((v, k) => (v + b1[k]) / 2)),
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  });
  console.log(`${p.id.padEnd(28)} ${String(tris).padStart(7)} → ${String(nt).padStart(6)} tris  ${(bytes.length / 1024).toFixed(0).padStart(5)} KB`);
}

// ---- manifest: one group entry (replaced on a rebuild), meshes listed by id ----
const mf = path.join(out, 'manifest.json');
const manifest = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : { groups: {}, meshes: {} };
for (const id of Object.keys(manifest.meshes)) if (id.startsWith(recipe.group + '/')) delete manifest.meshes[id];
manifest.groups[recipe.group] = {
  source: recipe.source, units: 'cm', recipe: path.relative(out, path.resolve(recipePath)).split(path.sep).join('/'),
  origin: mid.map(v => Math.round(v * 1000) / 1000), triangles: kept,
};
for (const e of entries) manifest.meshes[e.id] = e;
const sortKeys = o => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a < b ? -1 : 1));
manifest.groups = sortKeys(manifest.groups); manifest.meshes = sortKeys(manifest.meshes);
fs.writeFileSync(mf, JSON.stringify(manifest, null, 2) + '\n');
console.log(`${recipe.group}: ${entries.length} parts, ${kept} triangles → ${path.relative(process.cwd(), dir)}`);
