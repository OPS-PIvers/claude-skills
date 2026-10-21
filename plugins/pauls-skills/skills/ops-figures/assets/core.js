/* ============================================================
   OPS Figures core (Orono Technology edition of Colorfigures).
   MIT License. Copyright (c) 2026 Paul Ivers, Orono Public Schools; (c) 2026 April Zhu (Colorfigures, iso-glow);
   (c) 2026 Tolga Cohce (iso-figure). The full notice is in the skill's LICENSE file.
   Projection, shapes, shading, ink, labels, page shell, and the teaching layer
   (caption, predictions, walk-through, present mode).
   A figure page includes this file (scripts/build.py inlines it), then calls mountFigure({...}).
   See SKILL.md for the drawing contract and conventions.
   One fixed view (front-left-top) and one fixed light (from above, behind the viewer's right shoulder: the front is lit,
   the left side is in shade, and cast shadows fall toward the lower left of the screen).
   ============================================================ */

/* ---------- palettes ---------- */
// Body colours are built from the OPS brand families (light / mid / dark = lit / shaded / deep shade).
const PALS = {
  blue:  { l:'#4356a0', m:'#2d3f89', d:'#1d2a5d' },   // Blue Light / Primary Blue / Blue Dark
  red:   { l:'#c13435', m:'#ad2122', d:'#7a1718' },   // Red Light / Primary Red / Red Dark
  gray:  { l:'#7a7a7a', m:'#666666', d:'#333333' },   // charcoal: Primary Gray family
  white: { l:'#ffffff', m:'#e1e4ef', d:'#b4bad0' },   // white with Blue Lighter shading
};
// Neutral materials stay realistic: these are what make an object read as metal, glass or china.
const METAL   = { l:'#eef0f2', m:'#c6cbd1', d:'#8f969e' };
const CLEAR   = { l:'#e4f0f4', m:'#c4dbe4', d:'#97b4c0' };
const CERAMIC = { l:'#fbfbf8', m:'#e5e5df', d:'#bfbfb7' };
const DARK    = { l:'#555a68', m:'#3c404c', d:'#272a33' };
const INK = '#1d2a5d';                 // OPS Blue Dark: every outline and printed mark
const SHADOW = '#adb4d2';              // a Blue Light tint, pale enough that blue bodies stay separate from it
const ACCENT = '#c13435';              // OPS Red Light: labels on a working part, chip hover
const FONT_HEAD = "Lexend,'Segoe UI',system-ui,sans-serif";
const FONT_BODY = "Roboto,'Segoe UI',system-ui,Arial,sans-serif";
const FONT_MONO = "ui-monospace,Consolas,Menlo,monospace";   // only for things that really are screens or LCDs

/* ---------- projection (x = depth toward viewer-right, y = toward viewer-left, z = up) ---------- */
const C = Math.cos(Math.PI/6), S = Math.sin(Math.PI/6);
let OX = 0, OY = 0;
/* VIEW turns the object in 90° steps about a vertical axis through its centre (RC):
   0 = front (+x) and left (+y) faces toward the viewer, 1 = turned once (the +y side becomes the front)…
   Figures keep modelling in their own coordinates; P / Dv / vis / tone / depthOf all apply the turn. */
let VIEW = 0, RC = [0, 0];
const VIEW_NAMES = ['front', 'left side', 'back', 'right side'];
const TURNS = [0, 2];                 // the views the UI offers: front and back (figures still draw correctly in all four)
const rotV = ([x,y,z]) => { switch (VIEW & 3){ case 1: return [y,-x,z]; case 2: return [-x,-y,z]; case 3: return [-y,x,z]; default: return [x,y,z]; } };
const rotXY = (x,y) => { const r = rotV([x-RC[0], y-RC[1], 0]); return [r[0]+RC[0], r[1]+RC[1]]; };
const P0 = (x,y,z) => [(x-y)*C + OX, (x+y)*S - z + OY];                       // raw iso, no turn
const P  = (x,y,z) => { const [a,b] = rotXY(x,y); return [(a-b)*C + OX, (a+b)*S - z + OY]; };
const Dv = (x,y,z) => { const [a,b,c] = rotV([x,y,z]); return [(a-b)*C, (a+b)*S - c]; };
// distance toward the viewer in the current view: draw parts with smaller depth first
const depthOf = p => { const [a,b] = rotXY(p[0],p[1]); return a + b + p[2]; };
// sort [{at:[x,y,z], svg}] back-to-front for the current view and join
const byDepth = parts => parts.filter(Boolean).sort((p,q) => depthOf(p.at) - depthOf(q.at)).map(p => p.svg).join('');
const f  = v => v.toFixed(1);
const pd = (pts, close=true) => 'M' + pts.map(p => { const q = P(p[0],p[1],p[2]); return f(q[0])+' '+f(q[1]); }).join('L') + (close ? 'Z' : '');
const sp = pts => 'M' + pts.map(q => f(q[0])+' '+f(q[1])).join('L') + 'Z';

/* ---------- 2D shapes in a plane's (u,v) coords (v up), mapped to 3D by a plane ---------- */
const arcUV  = (cu,cv,r,a0,a1,n=7) => { const o=[]; for (let i=0;i<=n;i++){ const a=(a0+(a1-a0)*i/n)*Math.PI/180; o.push([cu+r*Math.cos(a), cv+r*Math.sin(a)]); } return o; };
const rrUV   = (u0,v0,u1,v1,r,n=7) => r <= 0 ? rectUV(u0,v0,u1,v1) : [...arcUV(u1-r,v0+r,r,-90,0,n), ...arcUV(u1-r,v1-r,r,0,90,n), ...arcUV(u0+r,v1-r,r,90,180,n), ...arcUV(u0+r,v0+r,r,180,270,n)];
const rectUV = (u0,v0,u1,v1) => [[u0,v0],[u1,v0],[u1,v1],[u0,v1]];
const ellUV  = (cu,cv,ru,rv,n=24) => Array.from({length:n}, (_,i) => { const a=i/n*2*Math.PI; return [cu+ru*Math.cos(a), cv+rv*Math.sin(a)]; });
const PX = x => ([u,v]) => [x,u,v];      // front-facing plane x = const   (u = y, v = z)
const PY = y => ([u,v]) => [u,y,v];      // side plane y = const           (u = x, v = z)
const PZ = z => ([u,v]) => [u,v,z];      // horizontal plane z = const     (u = x, v = y)
const on = (plane, uv) => uv.map(plane);

/* ---------- vectors + shading ---------- */
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const norm=a=>{ const l=Math.hypot(...a)||1; return a.map(v=>v/l); };
const avg=ps=>ps.reduce((s,p)=>[s[0]+p[0]/ps.length,s[1]+p[1]/ps.length,s[2]+p[2]/ps.length],[0,0,0]);
const vis = n => { const r = rotV(n); return r[0]+r[1]+r[2] > 1e-6; };   // viewer looks from (+1,+1,+1) after the turn
const facing = vis;                                                       // readable alias: is this face toward the viewer?
const SHADOW_K = 0.85, AZ_MIN = 20, AZ_MAX = 160;
// cast shadows are drawn shorter than the shading light implies (0.45 × height instead of 0.85 ×): long shadows of tall
// parts on thin supports (a lamp shade, a fan head) land far from the object and read as separate blobs
const SHADOW_LEN = 0.45;
let L = [0,0,1], SH = [0,0];
function setLight(deg){ const a=deg*Math.PI/180; SH=[SHADOW_K*Math.cos(a), SHADOW_K*Math.sin(a)]; L=norm([-SH[0],-SH[1],1]); }
const LIN = norm([.6,.2,1]);                       // fixed light for interiors / small props
const tone  = (n,m) => { const d=dot(rotV(n),L);   return d>-.15 ? m.l : d>-.45 ? m.m : m.d; };   // exterior, follows the sun
const toneI = (n,m) => { const d=dot(rotV(n),LIN); return d>.6 ? m.l : d>.05 ? m.m : m.d; };      // interior / props
const mix = (a,b,t) => '#' + [1,3,5].map(i => Math.round(parseInt(a.substr(i,2),16)*(1-t) + parseInt(b.substr(i,2),16)*t).toString(16).padStart(2,'0')).join('');
const matOf = hex => ({ l:hex, m:mix(hex,'#000000',.16), d:mix(hex,'#000000',.42) });
const ease = t => t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;

/* ---------- drawing primitives (all return SVG strings) ---------- */
const ink   = (d,w=1.0) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
const fill  = (d,c,extra='') => `<path d="${d}" fill="${c}" ${extra}/>`;
const face  = (d,c) => `<path d="${d}" fill="${c}" stroke="${c}" stroke-width=".7" stroke-linejoin="round"/>`;
const shape = (pts,c,w=.9) => fill(pd(pts),c) + (w ? ink(pd(pts),w) : '');
const line  = (pts,w=.9) => ink(pd(pts,false),w);
// Loft between two rings of equal length (closed). colour(n) picks each strip's fill; flip = seen from inside.
function loft(A, B, colour, flip=false){
  const n=A.length, cen=avg(A.concat(B)); let s='';
  for (let i=0;i<n;i++){
    const a0=A[i], a1=A[(i+1)%n], b1=B[(i+1)%n], b0=B[i];
    let nr = norm(cross(sub(a1,a0), sub(b0,a0)));
    if (!isFinite(nr[0])) continue;
    if (dot(nr, sub(avg([a0,a1,b1,b0]), cen)) < 0) nr = nr.map(v=>-v);
    if (flip) nr = nr.map(v=>-v);
    if (vis(nr)) s += face(pd([a0,a1,b1,b0]), colour(nr));
  }
  return s;
}
function hull(pts){
  pts = pts.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]); const lo=[], up=[];
  for (const p of pts){ while(lo.length>=2 && cr(lo[lo.length-2],lo[lo.length-1],p)<=0) lo.pop(); lo.push(p); }
  for (const p of pts.reverse()){ while(up.length>=2 && cr(up[up.length-2],up[up.length-1],p)<=0) up.pop(); up.push(p); }
  lo.pop(); up.pop(); return lo.concat(up);
}
// Silhouette ink, weighted by how thick the part is on screen (like a hand inker): the w you pass is the most it gets.
// Thickness = 2 × area / perimeter of the outline (a rod's diameter, about half a box's width), as a share of the
// frame width. A long thin rod, a handle or a knob stays light (~1–1.5); a grinder, kettle or machine body gets the
// heavy ~2.4–2.8. Thin parts stay thin and parts keep air between them.
const hullInk = (pts3, w=1.4) => { const h = hull(pts3.map(p=>P(...p))); let a = 0, per = 0;
  for (let i = 0; i < h.length; i++){ const p = h[i], q = h[(i+1) % h.length]; a += p[0]*q[1] - q[0]*p[1]; per += Math.hypot(q[0]-p[0], q[1]-p[1]); }
  const thick = per ? Math.abs(a) / per / (INK_K * INK_REF_VB) : 0;
  return ink(sp(h), Math.min(w, .9 + 20*thick)); };
// Axis-aligned box: three visible faces, shaded, each outlined. shade = tone (sunlit) or toneI (interior).
function box(x0,y0,z0,x1,y1,z1,m,shade=toneI,w=.9){
  // all six faces, drawn only when they face the viewer (sides first, then top) — correct in every VIEW
  const F = [
    [[0,1,0],  [[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]]],
    [[1,0,0],  [[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]]],
    [[0,-1,0], [[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]]],
    [[-1,0,0], [[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1]]],
    [[0,0,1],  [[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]]] ];
  return F.filter(([n]) => vis(n)).map(([n,q]) => shape(q, shade(n,m), w)).join('');
}
// Rounded-profile extrusion: profile (u=y, v=z) swept along x from x0 to x1. Body of most machines.
function extrude(profileUV, x0, x1, m, shade=tone){ return loft(on(PX(x0),profileUV), on(PX(x1),profileUV), n=>shade(n,m)); }
// Vertical cylinder (axis z) centred (x,y), radius r from z0 to z1, with top cap.
function cyl(x,y,z0,z1,r,m,shade=toneI,w=1.2,n=24){
  const A=on(PZ(z0),ellUV(x,y,r,r,n)), B=on(PZ(z1),ellUV(x,y,r,r,n));
  return loft(A,B,nr=>shade(nr,m)) + fill(pd(B),shade([0,0,1],m)) + hullInk([...A,...B],w) + ink(pd(B),w*.8);
}
// Cylinder lying along x (e.g. a knob or dial sticking out of a front face): centred (y,z), from x0 to x1.
function cylX(x0,x1,y,z,r,m,shade=toneI,w=1.1,n=20){
  const A=on(PX(x0),ellUV(y,z,r,r,n)), B=on(PX(x1),ellUV(y,z,r,r,n));
  // cap on whichever end faces the viewer (the +x end in VIEW 0)
  const capB = vis([1,0,0]), cap = capB ? B : A, cn = capB ? [1,0,0] : [-1,0,0];
  return loft(A,B,nr=>shade(nr,m)) + (vis(cn) ? fill(pd(cap),shade(cn,m)) : '') + hullInk([...A,...B],w) + (vis(cn) ? ink(pd(cap),w*.8) : '');
}
// Cylinder between any two 3D points a and b (a lamp arm, a rod, a pipe at an angle, a handle bar), radius r.
// The end facing the viewer gets a cap. For a tapered part (a cone, a lamp shade) pass r1 for the radius at b.
function rod(a, b, r, m, shade=toneI, w=1, r1=r, n=16){
  const d = norm(sub(b, a)), u = norm(cross(d, Math.abs(d[2]) < .9 ? [0,0,1] : [1,0,0])), v = cross(d, u);
  const ring = (p, rr) => Array.from({length:n}, (_,i) => { const t = i/n*2*Math.PI, c = Math.cos(t)*rr, s2 = Math.sin(t)*rr;
    return [p[0] + u[0]*c + v[0]*s2, p[1] + u[1]*c + v[1]*s2, p[2] + u[2]*c + v[2]*s2]; });
  const A = ring(a, r), B = ring(b, r1), capB = vis(d), cap = capB ? B : A, cn = capB ? d : d.map(x => -x);
  return loft(A, B, nr => shade(nr, m)) + (Math.max(r, r1) > 0 ? fill(pd(cap), shade(cn, m)) + ink(pd(cap), w*.8) : '') + hullInk([...A, ...B], w);
}
// Text lying flat on a front plane x = const, centred at (y,z) baseline; reads left-to-right on screen.
// fam: FONT_HEAD (Lexend) for printed lettering; pass FONT_MONO for a screen or LCD.
const txM = (o, U, V) => `matrix(${U[0].toFixed(4)} ${U[1].toFixed(4)} ${V[0].toFixed(4)} ${V[1].toFixed(4)} ${f(o[0])} ${f(o[1])})`;
const tx = (x,y,z,str,size,col=INK,weight=700,fam=FONT_HEAD) => { const o=P(x,y,z);
  return `<text transform="${txM(o, Dv(0,-1,0), Dv(0,0,-1))}" font-size="${size}" fill="${col}" text-anchor="middle" font-family="${fam}" font-weight="${weight}" letter-spacing=".04em">${str}</text>`; };
// Text on a side plane y = const, centred at (x,z).
const txY = (x,y,z,str,size,col=INK,weight=700,fam=FONT_HEAD) => { const o=P(x,y,z);
  return `<text transform="${txM(o, Dv(1,0,0), Dv(0,0,-1))}" font-size="${size}" fill="${col}" text-anchor="middle" font-family="${fam}" font-weight="${weight}" letter-spacing=".04em">${str}</text>`; };
// Cast shadow of a set of 3D points (any outline of the object), pushed along the light onto z = 0.
// the light stays put relative to the viewer, so the shadow is cast in turned coordinates
// z0: the surface it falls on (a board, a counter); clip it to that surface with clipTo(...) if it could spill off.
// clip: the 3D outline of the surface it falls on (e.g. boardTop(...)), so it can't spill over the edge.
const castShadow = (pts3, z0=0, clip=null) => { const k = SHADOW_LEN / SHADOW_K;
  const s = fill(sp(hull(pts3.map(([x,y,z]) => { const [a,b] = rotXY(x,y); return P0(a+(z-z0)*SH[0]*k, b+(z-z0)*SH[1]*k, z0); }))), SHADOW);
  return clip ? clipTo(clip, s) : s; };
// A board for the object to stand on (a tray, a desk top, a counter): a rounded slab from (x0,y0) to (x1,y1), h thick.
// Draw it first; then castShadow(points, h, boardTop(x0,y0,x1,y1,h,r)) so shadows lie on it and stop at its edge.
const BOARD = { l:'#e4e6ec', m:'#cdd0da', d:'#a9adba' }, WOOD = { l:'#d9a86c', m:'#bf8a4f', d:'#8e6236' };
const boardTop = (x0,y0,x1,y1,h=3,r=5) => on(PZ(h), rrUV(x0,y0,x1,y1,r));
function board(x0,y0,x1,y1,h=3,r=5,m=BOARD){
  const A = on(PZ(0), rrUV(x0,y0,x1,y1,r)), B = boardTop(x0,y0,x1,y1,h,r);
  return loft(A, B, n => toneI(n, m)) + fill(pd(B), m.l) + ink(pd(B), 1) + hullInk([...A, ...B], 1.8);
}
// Group helpers: clickable target, clip to an opening.
const act  = (name, inner, data='') => `<g data-act="${name}" ${data}>${inner}</g>`;
let _clipN = 0;
// Part label (for "how does it work" figures): a white pill with a leader line to a 3D point on the part.
// dx, dy = where the pill sits, in screen units at the reference zoom (they scale with the figure like stroke widths).
// on = that part is working right now (the pill turns OPS Red Light). Labels can be hidden with the Labels switch,
// and Present mode draws them larger (TAG_K).
let TAG_K = 1;
function tag(p3, dx, dy, text, on=false){
  const k = INK_K, [X,Y] = P(...p3), fs = 8.6*k*TAG_K, w = text.length*fs*.66 + fs*1.6, h = fs*1.85, cx = X + dx*k, cy = Y + dy*k;
  return `<g class="tag${on ? ' on' : ''}"><path d="M${f(X)} ${f(Y)}L${f(cx)} ${f(cy)}" fill="none" stroke="${INK}" stroke-width="1"/>`
    + `<circle cx="${f(X)}" cy="${f(Y)}" r="${f(1.3*k)}" fill="${INK}"/>`
    + `<rect x="${f(cx-w/2)}" y="${f(cy-h/2)}" width="${f(w)}" height="${f(h)}" rx="${f(h/2)}" fill="${on ? ACCENT : '#ffffff'}" stroke="${INK}" stroke-width="1.2"/>`
    + `<text x="${f(cx)}" y="${f(cy+fs*.36)}" font-size="${f(fs)}" text-anchor="middle" font-family="${FONT_HEAD}" font-weight="700" letter-spacing=".05em" fill="${on ? '#ffffff' : INK}">${text}</text></g>`;
}
const clipTo = (pts3, inner) => { const id = 'k' + (++_clipN); return `<clipPath id="${id}"><path d="${pd(pts3)}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`; };

/* ---------- constant on-screen line weight ----------
   Stroke widths are written in model units, and each figure is zoomed to fill the frame, so a small
   object would get fat lines. INK_K rescales every stroke-width (and the wobble/grain filter) so all
   figures match the reference zoom of the booth / vending machine (viewBox ≈ 585 units wide). */
const INK_REF_VB = 585;
let INK_K = 1;
const inkScale = svg => INK_K === 1 ? svg : svg.replace(/stroke-width="([\d.]+)"/g, (_, w) => `stroke-width="${(+w * INK_K).toFixed(2)}"`);


/* ---------- page shell (OPS brand: Lexend headings, Roboto body, blue/red/gray) ---------- */
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap';
const CORE_CSS = `
  :root{--w:760px;--bg:#f3f3f3;--ink:#1d2a5d;--blue:#2d3f89;--blue-light:#4356a0;--blue-lighter:#eaecf5;--red-light:#c13435;
    --text:#333333;--muted:#666666;--rule:#cccccc;--head:${FONT_HEAD};--body:${FONT_BODY}}
  html.present{--w:1100px}
  *{box-sizing:border-box} html,body{margin:0;min-height:100%}
  body{background-color:var(--bg);
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .2  0 0 0 0 .25  0 0 0 0 .42  .09 0 0 0 0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>");
    overflow-x:hidden;color:var(--text);font:14px/1.45 var(--body);display:flex;flex-direction:column;align-items:center;padding:24px 16px 32px}
  header{width:100%;max-width:var(--w);display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
  header h1{font:600 18px/1.3 var(--head);color:var(--ink);margin:0} header h1 .no{color:var(--red-light);margin-right:8px}
  header .hint{color:var(--muted)}
  #fig{width:100%;max-width:var(--w);height:auto;display:block;margin:4px 0 4px;user-select:none;overflow:visible}
  #fig [data-act]{cursor:pointer}
  .stage{position:relative;width:100%;max-width:var(--w)}
  .actions{position:absolute;top:4px;left:0;display:flex;flex-direction:column;align-items:flex-start;gap:8px;z-index:2;max-width:230px}
  .actions .cap,.ctl label{color:var(--muted);font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;margin:0 0 2px}
  html.nolabels #fig .tag{display:none}
  .ctl[hidden],.predict[hidden],.walk[hidden]{display:none}
  /* the step caption: one plain sentence saying what is happening, read out to screen readers */
  .caption{width:100%;max-width:var(--w);min-height:2.9em;margin:0 0 10px;text-align:center;font:500 17px/1.4 var(--head);color:var(--ink);text-wrap:balance}
  .predict{width:100%;max-width:560px;display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 0 14px;
    background:var(--blue-lighter);border-left:3px solid var(--blue);border-radius:6px;padding:12px 16px;font-size:15px}
  .predict p{margin:0} .predict strong{font-family:var(--head);color:var(--blue);margin-right:8px}
  .walk{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin:0 0 16px}
  .walk .pos{color:var(--muted);font-variant-numeric:tabular-nums;min-width:7.5em;text-align:center}
  /* ui.flash(text): a short note under the buttons ("the can is empty, refill it") */
  .toast{position:absolute;left:0;z-index:3;font-size:13px;background:var(--blue-lighter);color:var(--text);
    border-left:3px solid var(--blue);border-radius:6px;padding:6px 10px;opacity:0;transition:opacity .2s;pointer-events:none;max-width:250px}
  .toast.show{opacity:1}
  .stats{position:absolute;top:4px;right:0;display:flex;flex-direction:column;align-items:flex-end;gap:10px;z-index:2;text-align:right}
  .stat .k{font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .stat .v{font:700 34px/1.05 var(--head);letter-spacing:-.01em;font-variant-numeric:tabular-nums;color:var(--ink)}
  .stat.small .v{font-size:20px}
  .stat .v.bump{animation:bump .35s ease-out}
  @keyframes bump{0%{transform:scale(1.18)}100%{transform:none}}
  @media (prefers-reduced-motion:reduce){.stat .v.bump{animation:none}}
  .stepwrap{position:relative;display:flex;align-items:center;gap:8px}
  button{font:500 13px/1.3 var(--head);color:var(--blue);background:#fff;border:1.5px solid var(--blue);border-radius:6px;padding:6px 14px;cursor:pointer;white-space:nowrap}
  button:hover{background:var(--blue-lighter)}
  button:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
  button:disabled{color:#999;border-color:#ccc;background:#f3f3f3;cursor:default}
  button.primary{background:var(--blue);color:#fff} button.primary:hover{background:var(--blue-light)}
  button.primary:disabled{background:#ccc;border-color:#ccc;color:#666}
  button[aria-pressed=true]{background:var(--blue);color:#fff}
  .act .car{margin-left:6px;font-size:10px}
  .chips{display:none;flex-wrap:wrap;gap:6px;background:#fff;border:1.5px solid var(--blue);border-radius:8px;box-shadow:0 6px 18px rgba(29,42,93,.18);
    padding:8px;width:max-content;max-width:min(300px,62vw);position:absolute;left:calc(100% + 10px);top:-4px;z-index:3}
  .stepwrap.open .chips{display:flex}
  .chip{font-size:12px;padding:4px 9px}
  .chip.current{background:var(--blue);color:#fff}
  .chip.off{opacity:.45}
  .controls{width:100%;max-width:var(--w);display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px 28px;border-top:1px solid var(--rule);padding-top:16px}
  .ctl{display:flex;flex-direction:column;gap:6px}
  input[type=range]{width:100%;accent-color:var(--blue)}
  .row{display:flex;gap:8px;flex-wrap:wrap}
  .sw{width:26px;height:26px;padding:0;border-radius:50%;border:1.5px solid var(--rule)} .sw:hover{filter:brightness(1.05)}
  .sw[aria-pressed=true]{outline:2px solid var(--ink);outline-offset:2px}
  /* Present mode: readable from the back of a classroom */
  html.present body{font-size:17px}
  html.present header h1{font-size:26px}
  html.present .actions{max-width:320px;gap:10px}
  html.present .act{font-size:18px;padding:9px 18px}
  html.present .chip{font-size:16px;padding:6px 12px}
  html.present .caption{font-size:27px}
  html.present .predict{max-width:820px;font-size:22px} html.present .walk button,html.present .predict button{font-size:19px;padding:9px 20px}
  html.present .toast{font-size:17px;max-width:340px}
  html.present .stat .v{font-size:48px} html.present .stat.small .v{font-size:28px}
  @media (max-width:560px){body{padding:14px 12px 24px}header .hint,.actions .cap{display:none}.actions{flex-direction:row;flex-wrap:wrap;gap:6px}.act{font-size:12px;padding:5px 11px}.stats{position:static;flex-direction:row;justify-content:flex-end;gap:18px;margin-bottom:4px}.actions{position:static;max-width:none;margin:6px 0 4px}.chips{left:0;top:calc(100% + 8px)}.caption{font-size:15px}}`;

const filterFor = k => `<filter id="hand" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${(0.045/k).toFixed(4)}" numOctaves="2" seed="4" result="warp"/>
  <feDisplacementMap id="wob" in="SourceGraphic" in2="warp" scale="${(1.6*k).toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="wob"/>
  <feTurbulence type="fractalNoise" baseFrequency="${(0.9/k).toFixed(4)}" numOctaves="3" seed="11" result="n1"/>
  <feColorMatrix in="n1" type="matrix" values=".3 0 0 0 .84  .3 0 0 0 .84  .3 0 0 0 .84  0 0 0 0 1" result="grain"/>
  <feTurbulence type="fractalNoise" baseFrequency="${(0.012/k).toFixed(4)}" numOctaves="2" seed="7" result="n2"/>
  <feColorMatrix in="n2" type="matrix" values=".3 0 0 0 .85  .3 0 0 0 .85  .3 0 0 0 .85  0 0 0 0 1" result="blot"/>
  <feBlend in="wob" in2="grain" mode="multiply" result="g1"/><feBlend in="g1" in2="blot" mode="multiply" result="g2"/>
  <feComposite in="g2" in2="wob" operator="in"/></filter>`;

/* mountFigure({
     fig:'03', title:'Photo booth', hint:'click the curtain…',
     size:[W,D,H],                 // bounding box, used to frame the view (shadow range included)
     palette:'blue',               // default PALS key: blue | red | gray | white
     state:{...},                  // figure state (st.pal is built in). Keep it plain JSON: Walk through's Back saves copies of it
     scene: (st, m) => svgString,  // m = current palette {l,m,d}
     caption: st => 'sentence',    // shown under the figure: what is happening right now, in plain words
     buttons: [{label, onClick(st, ui), predict?}             // listed in the order a person would use them
               | {label, choices: st => [{label, onClick(st,ui), current?, disabled?, why?}], predict?}],   // opens a picker
              // predict: 'What will happen to the water when it heats?' (or st => text). Asked once, before that
              //   button's first press, while the Predict switch is on.
     walk: ['Load', 'Program>Quick', 'Start'],   // optional: the steps Walk through runs, in ?press= syntax
              //   (default: every button without a picker, in order)
     stats: st => [{label, value, small?}],   // optional: big numbers top-right (credit, litres, height)
     buttonsLabel: 'Machine',      // optional: the small heading over the buttons (default 'Try it')
     acts: { name(st, el, ui){} },  // presses on act(name, …) groups; el has dataset
     params(st, q){}               // optional: read URLSearchParams for screenshot states
   })  -> ui = { st, render, animate(stepFn), after(sec, fn), flash(text,ms), running }
   animate(step): calls step(dt seconds) every frame and re-renders until step returns false.
   after(sec, fn): runs fn once, sec seconds from now. Use it instead of setTimeout for anything that changes state,
   so Walk through knows the step is still running and Back can cancel it. */
addEventListener('error', e => { document.documentElement.dataset.errors = (document.documentElement.dataset.errors || '') + ' ' + e.message + ';'; });
function mountFigure(cfg){
  document.title = cfg.title;
  if (!document.querySelector('link[data-ops-fonts]')){
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONTS_URL; l.dataset.opsFonts = ''; document.head.appendChild(l); }
  const style = document.createElement('style'); style.textContent = CORE_CSS; document.head.appendChild(style);
  const buttons = cfg.buttons || [];
  const hasPredict = buttons.some(b => b.predict);
  const walkList = cfg.walk || buttons.filter(b => !b.choices).map(b => b.label);
  const tog = (id, label, hide) => `<div class="ctl" id="${id}ctl"${hide ? ' hidden' : ''}><label>${label}</label><div class="row"><button id="${id}" aria-pressed="false">Off</button></div></div>`;
  document.body.innerHTML = `
    <header><h1><span class="no">Fig. ${cfg.fig}</span>${cfg.title}</h1><span class="hint">${cfg.hint || ''}</span></header>
    <div class="stage">
      ${buttons.length ? `<div class="actions" id="btns"><div class="cap">${cfg.buttonsLabel || 'Try it'}</div></div>` : ''}
      ${cfg.stats ? '<div class="stats" id="stats"></div>' : ''}
      <div class="toast" id="toast" role="status"></div>
      <svg id="fig" role="img" aria-label="${cfg.title}"><defs id="fdefs"></defs><g id="art" filter="url(#hand)"></g></svg>
    </div>
    <p class="caption" id="caption" aria-live="polite"></p>
    <div class="predict" id="predict" hidden><p><strong>Predict</strong><span id="pq"></span></p><button class="primary" id="pgo">Show me</button></div>
    <div class="walk" id="walkbar" hidden><button id="wback">Back</button><span class="pos" id="wpos"></span><button class="primary" id="wnext">Next</button></div>
    <div class="controls">
      <div class="ctl"><label for="wb">Hand-drawn wobble</label><input id="wb" type="range" min="0" max="6" step="0.1" value="1.6"></div>
      <div class="ctl"><label>Colour</label><div class="row" id="pals"></div></div>
      ${tog('lbl', 'Labels', true)}${tog('prd', 'Predict first', !hasPredict)}${tog('wlk', 'Walk through', walkList.length < 2)}${tog('prs', 'Present', false)}
    </div>`;
  const st = cfg.state || {};            // kept as the same object, so a figure may hold on to it
  if (!st.pal) st.pal = cfg.palette || 'blue';
  if (st.az == null) st.az = 105;
  const q = new URLSearchParams(location.search);
  if (PALS[q.get('pal')]) st.pal = q.get('pal');
  if (cfg.params) cfg.params(st, q);
  const $ = id => document.getElementById(id);
  const noteErr = m => { document.documentElement.dataset.errors = (document.documentElement.dataset.errors || '') + ' ' + m + ';'; };

  // frame on the object itself: centred, filling ~60% of the width / ~78% of the height of a 4:3 view.
  // The cast shadow is allowed to spill outside the frame (svg overflow is visible).
  const [W,D,H] = cfg.size, pts = [];
  OX = OY = 0; RC = cfg.center || [W/2, D/2];
  VIEW = 0;
  for (const x of [0,W]) for (const y of [0,D]) for (const z of [0,H]) pts.push(P(x,y,z));
  const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]);
  const bw = Math.max(...xs)-Math.min(...xs), bh = Math.max(...ys)-Math.min(...ys);
  // the object fills ~74% of the width / ~88% of the height, nudged right of centre so the buttons (top left) stay clear
  const vbW = Math.max(bw/.74, bh/.88/.75), vbH = vbW*.75;
  OX = (vbW-bw)/2 + vbW*.06 - Math.min(...xs); OY = vbH*.04 - Math.min(...ys);   // sit a little high: shadows fall downward
  const svg = $('fig');
  svg.setAttribute('viewBox', `0 0 ${f(vbW)} ${f(vbH)}`);
  INK_K = vbW / INK_REF_VB;
  $('fdefs').innerHTML = filterFor(INK_K);

  const art = $('art'), capEl = $('caption');
  const ui = { st, running: 0 };
  ui.render = () => { _clipN = 0; art.innerHTML = inkScale(cfg.scene(st, PALS[st.pal]));
    const c = cfg.caption ? cfg.caption(st) || '' : ''; if (capEl.textContent !== c) capEl.textContent = c;
    if (ui.drawStats) ui.drawStats(); drawWalk(); };
  // big numbers in the top-right corner (credit, change, score…); a value that changes gets a little bump
  const statsEl = $('stats'), prevStats = {};
  ui.drawStats = () => { if (!statsEl) return;
    const list = cfg.stats(st).filter(Boolean), html = list.map(x => `<div class="stat${x.small ? ' small' : ''}"><div class="k">${x.label}</div><div class="v" data-k="${x.label}">${x.value}</div></div>`).join('');
    if (statsEl._html !== html){ statsEl._html = html; statsEl.innerHTML = html;
      statsEl.querySelectorAll('.v').forEach(v => { if (prevStats[v.dataset.k] != null && prevStats[v.dataset.k] !== v.textContent) v.classList.add('bump'); prevStats[v.dataset.k] = v.textContent; }); } };
  let flashT = 0;
  const toast = $('toast');
  ui.flash = (text, ms=1800) => { toast.textContent = text;
    toast.style.top = (($('btns') ? $('btns').offsetTop + $('btns').offsetHeight : 0) + 8) + 'px'; toast.classList.add('show');
    clearTimeout(flashT); flashT = setTimeout(() => toast.classList.remove('show'), ms); };
  // animations run on a ~60 fps timer rather than requestAnimationFrame, so they also run in headless test shots.
  // ui.running counts the ones in flight (Walk through waits for 0); stopAll cancels them (Back does this).
  let gen = 0;
  ui.animate = step => { const g = gen; ui.running++; let last = performance.now();
    const loop = () => { if (g !== gen) return;
      const now = performance.now(), dt = Math.max(0, Math.min(.05,(now-last)/1000)); last = now;
      let more = false; try { more = step(dt) !== false; } finally { if (!more) ui.running = Math.max(0, ui.running - 1); }
      ui.render(); if (more) setTimeout(loop, 16); };
    setTimeout(loop, 16); };
  ui.after = (sec, fn) => { let t = 0; ui.animate(dt => { t += dt; if (t < sec) return true; fn(); return false; }); };
  ui.stopAll = () => { gen++; ui.running = 0; };

  // Predict first: a button with `predict` asks its question before its first press; "Show me" then does the step
  const predictEl = $('predict'), pgo = $('pgo'), asked = new Set();
  let predictOn = hasPredict && q.get('predict') !== '0', pending = null, pendingLabel = '';
  const hidePredict = () => { pending = null; predictEl.hidden = true; };
  function withPredict(b, go){
    if (predictOn && b.predict && !asked.has(b.label)){
      asked.add(b.label); pending = go; pendingLabel = b.label;
      $('pq').textContent = typeof b.predict === 'function' ? b.predict(st) : b.predict;
      predictEl.hidden = false; pgo.focus({ preventScroll:true }); drawWalk(); return; }
    hidePredict(); go(); }
  // a press that changed nothing (out of order: the figure only flashed why) doesn't use up its question
  pgo.onclick = () => { const go = pending, label = pendingLabel; hidePredict(); if (!go) return;
    const before = JSON.stringify(st); go(); if (JSON.stringify(st) === before) asked.delete(label); ui.render(); };

  // clickable parts react on press, not on click: while something animates, the scene is redrawn every frame, so the
  // element under the pointer is replaced between press and release and a 'click' would never fire
  svg.addEventListener('pointerdown', e => { if (e.button) return; const a = e.target.closest('[data-act]'); if (!a || !cfg.acts || !cfg.acts[a.dataset.act]) return;
    e.preventDefault(); hidePredict(); cfg.acts[a.dataset.act](st, a, ui); ui.render(); });
  const btns = $('btns');
  if (btns) buttons.forEach(b => {
    const wrap = document.createElement('div'); wrap.className = 'stepwrap';
    const el = document.createElement('button'); el.className = 'act';
    el.innerHTML = `${b.label}${b.choices ? '<span class="car">▾</span>' : ''}`;
    wrap.appendChild(el); btns.appendChild(wrap);
    if (!b.choices){ el.onclick = () => { closeChips(); withPredict(b, () => b.onClick(st, ui)); ui.render(); }; return; }
    const chips = document.createElement('div'); chips.className = 'chips'; wrap.appendChild(chips);
    el.onclick = e => { e.stopPropagation(); const open = !wrap.classList.contains('open'); closeChips();
      if (!open) return;
      chips.innerHTML = '';
      // every choice stays clickable, so nothing silently ignores a press:
      //   current:true  = the one in use (shown selected); a press just says so
      //   disabled:true = not possible right now (shown faded); a press says why (c.why, or a generic note)
      for (const c of b.choices(st)){ const ch = document.createElement('button'); ch.className = 'chip' + (c.current ? ' current' : c.disabled ? ' off' : ''); ch.textContent = c.label;
        if (c.current) ch.setAttribute('aria-pressed', 'true');
        ch.onclick = ev => { ev.stopPropagation(); closeChips();
          if (c.current) return ui.flash(`${c.label} is already set`);
          if (c.disabled) return ui.flash(c.why || `${c.label} isn't possible right now`);
          withPredict(b, () => c.onClick(st, ui)); ui.render(); }; chips.appendChild(ch); }
      wrap.classList.add('open'); };
  });
  function closeChips(){ document.querySelectorAll('.stepwrap.open').forEach(w => w.classList.remove('open')); }
  document.addEventListener('click', closeChips);

  // Walk through: Next runs the real button for each step, in order; Back restores the state saved before that step
  const startSnap = JSON.stringify(st), hist = [];
  let walkOn = false, wi = 0;
  const restore = json => { ui.stopAll(); hidePredict(); const pal = st.pal, o = JSON.parse(json);
    for (const k of Object.keys(st)) delete st[k]; Object.assign(st, o); st.pal = pal; };
  const starts = (s, t) => s.trim().toLowerCase().startsWith(t.trim().toLowerCase());
  // a step's name on the Next button: the button's full label, plus the choice for a picker step
  const stepName = s => { const [label, choice] = s.split('>'), b = buttons.find(b => starts(b.label, label));
    return (b ? b.label : label.trim()) + (choice != null ? ': ' + choice.trim() : ''); };
  function runWalk(i){
    const [label, choice] = walkList[i].split('>'), b = buttons.find(b => starts(b.label, label));
    if (!b) return noteErr(`walk: no button "${label}"`);
    withPredict(b, () => {
      if (choice == null) return b.onClick(st, ui);
      const c = b.choices(st).find(c => starts(c.label, choice));
      if (!c) return noteErr(`walk: no choice "${choice}" in "${label}"`);
      if (c.disabled) return ui.flash(c.why || `${c.label} isn't possible right now`);
      c.onClick(st, ui); }); }
  const wnext = $('wnext'), wback = $('wback'), wpos = $('wpos'), walkbar = $('walkbar');
  function drawWalk(){
    walkbar.hidden = !walkOn; if (!walkOn) return;
    const n = walkList.length, pos = wi === 0 ? `${n} steps` : `Step ${wi} of ${n}`, nx = wi >= n ? 'Start over' : `Next: ${stepName(walkList[wi])}`;
    if (wpos.textContent !== pos) wpos.textContent = pos;
    if (wnext.textContent !== nx) wnext.textContent = nx;
    wnext.disabled = ui.running > 0 || !!pending; wback.disabled = !hist.length; }
  wnext.onclick = () => { if (ui.running || pending) return;
    if (wi >= walkList.length){ restore(startSnap); hist.length = 0; wi = 0; ui.render(); return; }
    hist.push(JSON.stringify(st)); wi++; runWalk(wi - 1); ui.render(); };
  wback.onclick = () => { if (!hist.length) return; restore(hist.pop()); wi--; ui.render(); };

  // switches under the figure
  const setTog = (id, on) => { const b = $(id); b.textContent = on ? 'On' : 'Off'; b.setAttribute('aria-pressed', on); };
  const setLabels = on => { document.documentElement.classList.toggle('nolabels', !on); setTog('lbl', on); };
  $('lbl').onclick = () => setLabels(document.documentElement.classList.contains('nolabels'));
  const setPredict = on => { predictOn = on; if (!on) hidePredict(); else asked.clear(); setTog('prd', on); drawWalk(); };
  $('prd').onclick = () => setPredict(!predictOn);
  const setWalk = on => { walkOn = on; setTog('wlk', on); restore(startSnap); hist.length = 0; wi = 0; asked.clear(); ui.render(); };
  $('wlk').onclick = () => setWalk(!walkOn);
  const setPresent = on => { document.documentElement.classList.toggle('present', on); TAG_K = on ? 1.35 : 1; setTog('prs', on); ui.render(); };
  $('prs').onclick = () => setPresent(!document.documentElement.classList.contains('present'));
  $('wb').oninput = e => $('wob').setAttribute('scale', (e.target.value * INK_K).toFixed(2));
  const pals = $('pals');
  for (const [k,p] of Object.entries(PALS)){
    const b = document.createElement('button'); b.className='sw'; b.title = k[0].toUpperCase() + k.slice(1); b.setAttribute('aria-label', b.title);
    b.style.background = p.l; b.setAttribute('aria-pressed', k===st.pal);
    b.onclick = () => { st.pal=k; [...pals.children].forEach(c=>c.setAttribute('aria-pressed', c===b)); ui.render(); };
    pals.appendChild(b);
  }
  // testing: ?press=Label@ms,Label@ms clicks the buttons whose text starts with Label at those times after load
  // (any order, repeats allowed); Label>Choice picks a choice from a picker button (?press=Speed>3@300).
  // With ?steps=1, Next and Back press the Walk through buttons (?steps=1&press=Next@300,Next@3000,Back@6000).
  // A Predict question that comes up is answered with "Show me". Script errors and unknown labels are recorded on
  // <html data-errors="…">. Other params: ?labels=0 ?predict=0 ?steps=1 (Walk through on) ?present=1 ?pal=red
  window.__st = st;
  if (q.has('press')) q.get('press').split(',').forEach(item => { const [what, ms] = item.split('@'), [label, choice] = what.split('>');
    setTimeout(() => { const b = [...document.querySelectorAll('.act, #walkbar button')].find(b => starts(b.textContent, label));
      if (!b) return noteErr(`no button "${label}"`);
      b.click();
      if (choice != null){ const c = [...b.parentElement.querySelectorAll('.chip')].find(c => starts(c.textContent, choice));
        if (c) c.click(); else return noteErr(`no choice "${choice}" in "${label}"`); }
      if (pending) pgo.click(); }, +ms || 0); });
  setPredict(predictOn);
  if (q.get('present') === '1') setPresent(true);
  setLight(st.az); ui.render();
  if (art.querySelector('.tag')){ $('lblctl').hidden = false; setLabels(q.get('labels') !== '0'); }
  if (q.get('steps') === '1' && walkList.length > 1) setWalk(true);
  return ui;
}
