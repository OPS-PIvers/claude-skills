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
  const k = INK_K, [X,Y] = P(...p3), fs = 8.6*k*TAG_K, w = text.length*fs*.8 + fs*2.6, h = fs*1.85, cx = X + dx*k, cy = Y + dy*k;
  return `<g class="tag${on ? ' on' : ''}"><path d="M${f(X)} ${f(Y)}L${f(cx)} ${f(cy)}" fill="none" stroke="${INK}" stroke-width="1"/>`
    + `<circle cx="${f(X)}" cy="${f(Y)}" r="${f(1.3*k)}" fill="${INK}"/>`
    + `<rect x="${f(cx-w/2)}" y="${f(cy-h/2)}" width="${f(w)}" height="${f(h)}" rx="${f(h/2)}" fill="${on ? ACCENT : '#ffffff'}" stroke="${INK}" stroke-width="1.2"/>`
    + `<text x="${f(cx)}" y="${f(cy+fs*.36)}" font-size="${f(fs)}" text-anchor="middle" font-family="${FONT_HEAD}" font-weight="700" letter-spacing=".05em" fill="${on ? '#ffffff' : INK}">${text}</text></g>`;
}
const clipTo = (pts3, inner) => { const id = 'k' + (++_clipN); return `<clipPath id="${id}"><path d="${pd(pts3)}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`; };
// The least time (seconds) a caption stays up before the figure replaces it on its own: about 3 words a second while
// watching the picture, plus a second to notice it changed, never under 3 s. Pace every animated phase to this.
const READ_S = text => Math.max(3, 1 + String(text).trim().split(/\s+/).length / 3);

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
  :root{--w:1280px;--bg:#f3f3f3;--ink:#1d2a5d;--blue:#2d3f89;--blue-light:#4356a0;--blue-lighter:#eaecf5;--red-light:#c13435;
    --text:#333333;--muted:#666666;--rule:#cccccc;--head:${FONT_HEAD};--body:${FONT_BODY}}
  *{box-sizing:border-box}
  /* The page fits the window (or the SpartBoard frame) without scrolling: header, figure, caption and controls are
     all on screen, and the figure takes whatever height is left and scales to fit it. Only a very short window
     (the figure would drop under 240px) scrolls. */
  html,body{margin:0;height:100%}
  body{background-color:var(--bg);
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .2  0 0 0 0 .25  0 0 0 0 .42  .09 0 0 0 0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>");
    overflow-x:hidden;overflow-y:auto;color:var(--text);font:14px/1.45 var(--body);display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 16px}
  header,.stage,.narr,.walk,.controls{width:100%;max-width:var(--w);flex:none}
  header{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
  header h1{font:600 18px/1.3 var(--head);color:var(--ink);margin:0} header h1 .no{color:var(--red-light);margin-right:8px}
  header .hint{color:var(--muted)}
  .stage{position:relative;flex:1 1 0;min-height:240px;display:flex;flex-direction:column}
  #fig{flex:1 1 0;min-height:0;width:100%;height:100%;display:block;user-select:none;overflow:visible}
  #fig [data-act]{cursor:pointer}
  .actions{position:absolute;top:4px;left:0;display:flex;flex-direction:column;align-items:flex-start;gap:8px;z-index:2;max-width:230px}
  .actions .cap,.ctl label{color:var(--muted);font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;margin:0}
  html.nolabels #fig .tag{display:none}
  .ctl[hidden],.predict[hidden],.walk[hidden]{display:none}
  /* narration: the step's earlier captions, then the current one, in a box of fixed height so the figure never jumps.
     It reads like a wheel: the current caption sits on a white band at the front, and each earlier one is tilted
     further back, smaller and fainter (--d = how many captions ago), fading out at the top. A new caption rolls in from
     below. The box scrolls (wheel or swipe, no visible bar) to reach anything that faded out. A Predict question takes
     the box's place while it is asked. */
  .narr{height:5.6em;overflow-y:auto;scrollbar-width:none;font:500 17px/1.35 var(--head);display:flex;flex-direction:column;
    perspective:420px;-webkit-mask-image:linear-gradient(transparent,#000 1.8em);mask-image:linear-gradient(transparent,#000 1.8em)}
  .narr::-webkit-scrollbar{display:none}
  .caplog{margin:auto 0 4px;padding:0;list-style:none;text-align:center;font-size:.8em;font-weight:400;color:var(--muted);text-wrap:balance}
  .caplog li{margin:0 0 2px;transform-origin:50% 100%;transform:rotateX(calc(var(--d) * 16deg)) scale(calc(1 - var(--d) * .05));opacity:calc(1 - var(--d) * .22)}
  .caption{margin:0 auto 2px;max-width:100%;text-align:center;color:var(--ink);font-weight:600;text-wrap:balance;background:#fff;
    border-radius:8px;padding:.15em .8em;box-shadow:0 0 0 1px var(--blue-lighter),0 3px 12px rgba(29,42,93,.12)}
  .caption:empty{visibility:hidden}
  .narr.roll .caption{animation:capIn .38s cubic-bezier(.2,.8,.3,1)}
  .narr.roll .caplog{animation:logUp .38s cubic-bezier(.2,.8,.3,1)}
  @keyframes capIn{from{transform:translateY(.7em) rotateX(-55deg);opacity:0}}
  @keyframes logUp{from{transform:translateY(1.1em)}}
  @media (prefers-reduced-motion:reduce){.narr.roll .caption,.narr.roll .caplog{animation:none}}
  .narr:has(.predict:not([hidden])){-webkit-mask-image:none;mask-image:none}
  .narr:has(.predict:not([hidden])) > :not(.predict){display:none}
  .predict{width:100%;max-width:680px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:14px;
    background:var(--blue-lighter);border-left:3px solid var(--blue);border-radius:6px;padding:10px 16px;font:400 15px/1.4 var(--body)}
  .predict p{margin:0} .predict strong{font-family:var(--head);color:var(--blue);margin-right:8px}
  .walk{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
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
  /* the switches: one compact row under the caption. The Settings button folds them away (Present does this itself),
     leaving just the button at the right. */
  .controls{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px 18px;border-top:1px solid var(--rule);padding-top:8px}
  .controls.closed{justify-content:flex-end;border-top-color:transparent;padding-top:0}
  .controls.closed > .ctl{display:none}
  button.setbtn{border:none;background:none;color:var(--muted);font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;padding:3px 6px}
  button.setbtn:hover{background:none;color:var(--blue)}
  .ctl{display:flex;align-items:center;gap:8px}
  .ctl .row button{padding:3px 10px;font-size:12px}
  input[type=range]{width:110px;accent-color:var(--blue)}
  .ctl output{min-width:2.6em;font:500 12px var(--body);color:var(--ink);font-variant-numeric:tabular-nums}
  .row{display:flex;gap:6px;flex-wrap:wrap}
  .sw{width:22px;height:22px;padding:0;border-radius:50%;border:1.5px solid var(--rule)} .sw:hover{filter:brightness(1.05)}
  .sw[aria-pressed=true]{outline:2px solid var(--ink);outline-offset:2px}
  /* Present mode: readable from the back of a classroom. The top of the screen is the easiest place to read, so the
     title and stats come first, then the caption box (newest caption on top, rolling in from above, earlier ones
     tilting back below it); the figure is centred; the buttons sit in one row under it, with Back and Next at the
     two ends (Walk through is on), the button Next will press outlined and the step count under the row. */
  html.present body{font-size:17px}
  html.present header{order:-2;align-items:center} html.present header .hint{display:none}
  html.present header:not(:has(h1)){display:none}
  html.present .stage > h1{position:absolute;left:0;top:50%;transform:translateY(-50%);z-index:2;width:max-content;
    max-width:clamp(160px,21vw,300px);margin:0;font:600 clamp(24px,2.1vw,34px)/1.2 var(--head);color:var(--ink);text-wrap:balance}
  html.present .stage > h1 .no{display:block;margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
  html.present .stage > h1::after{content:'';display:block;width:44px;height:3px;margin-top:16px;border-radius:2px;background:var(--red-light)}
  html.present .stats{top:50%;transform:translateY(-50%);gap:18px}
  html.present .narr{order:-1;font-size:26px;height:4.4em;flex-direction:column;
    -webkit-mask-image:linear-gradient(#000 calc(100% - 1.4em),transparent);mask-image:linear-gradient(#000 calc(100% - 1.4em),transparent)}
  html.present .caption{order:-1;margin:2px auto}
  html.present .caplog{margin:0 0 auto;display:flex;flex-direction:column-reverse}
  html.present .caplog li{margin:2px 0 0;transform-origin:50% 0;transform:rotateX(calc(var(--d) * -16deg)) scale(calc(1 - var(--d) * .05))}
  html.present .narr.roll .caption{animation-name:capDown}
  html.present .narr.roll .caplog{animation-name:logDown}
  @keyframes capDown{from{transform:translateY(-.7em) rotateX(55deg);opacity:0}}
  @keyframes logDown{from{transform:translateY(-1.1em)}}
  html.present .walk{display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"back acts next" ". pos .";align-items:center;gap:2px 16px}
  html.present #wback{grid-area:back} html.present #wnext{grid-area:next} html.present .walk .pos{grid-area:pos;font-size:14px}
  html.present #wback::before{content:'\\2190  '} html.present #wnext::after{content:'  \\2192'}
  /* one line: fitRow() steps the row's text (buttons, Back and Next) down from 18px until it fits; it wraps only if
     even 12px can't */
  html.present .actions{grid-area:acts;position:static;flex-direction:row;flex-wrap:nowrap;justify-content:center;align-items:center;max-width:none;min-width:0;gap:10px}
  html.present .actions.wrap{flex-wrap:wrap}
  html.present .actions .cap{display:none}
  html.present .act{font-size:var(--act-fs,18px);padding:.5em .85em}
  html.present .act.nextup{outline:3px solid var(--red-light);outline-offset:3px}
  html.present .chips{left:50%;top:auto;bottom:calc(100% + 10px);transform:translateX(-50%);max-width:min(620px,90vw)}
  html.present .chip{font-size:16px;padding:6px 12px}
  html.present .predict{max-width:900px;font-size:22px} html.present .predict button{font-size:19px;padding:9px 20px}
  html.present .walk > button{font-size:calc(var(--act-fs,18px) + 1px);padding:.47em 1em}
  html.present .toast{position:fixed;font-size:17px;max-width:340px;transform:translate(-50%,-100%)}
  html.present .stat .v{font-size:40px} html.present .stat.small .v{font-size:26px}
  @media (max-width:560px){body{padding:10px 12px}header .hint,.actions .cap{display:none}.actions{flex-direction:row;flex-wrap:wrap;gap:6px}.act{font-size:12px;padding:5px 11px}.stats{position:static;flex-direction:row;justify-content:flex-end;gap:18px;margin-bottom:4px}.actions{position:static;max-width:none;margin:6px 0 4px}.chips{left:0;top:calc(100% + 8px)}.narr{font-size:15px}.controls{gap:8px 14px}}
  /* the phone-only pieces stay out of the way everywhere else */
  .figtag,.sheethead,.scrim,.rowpad,.setbtn .gear{display:none}
  /* The phone layout (html.phone: a window 760px wide or less, or a landscape phone; PHONE in the script decides it).
     Always Present, with no Present switch. Top: a one-line FIG. 01 · TITLE tag, then the caption box (about three
     lines). Middle: the figure, as big as the room left allows, with the stats as a small overlay in its top-right
     corner. Bottom: the figure's buttons, then ← · 3 / 5 · Next →. On a touch screen (html.touch) the buttons are one
     row that scrolls sideways and keeps the next-up button centred, and a swipe on the figure presses Next or Back;
     with a mouse they wrap in rows. The settings are a gear at the top right that opens a bottom sheet (html.sheet).
     A landscape phone (html.land) puts the figure on the left and all of that in a panel on the right. */
  html.phone body{font-size:15px;gap:6px;padding:8px 12px max(10px,env(safe-area-inset-bottom))}
  html.phone header{display:none}
  html.phone .figtag{display:block;order:-1;flex:none;width:100%;margin:3px 0 0;padding:0 40px;text-align:center;
    font:700 11px/1.3 var(--head);letter-spacing:.12em;text-transform:uppercase;color:var(--red-light)}
  html.phone .figtag b{color:var(--ink);font-weight:600}
  html.phone .narr{font-size:17px;height:4.5em;-webkit-mask-image:linear-gradient(#000 calc(100% - .9em),transparent);mask-image:linear-gradient(#000 calc(100% - .9em),transparent)}
  html.phone .stats{position:absolute;top:2px;right:0;left:auto;transform:none;flex-direction:column;align-items:flex-end;gap:6px;margin:0;pointer-events:none}
  html.phone .stat .k{font-size:10px} html.phone .stat .v{font-size:20px} html.phone .stat.small .v{font-size:15px}
  html.phone .walk{display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"acts acts acts" "back pos next";align-items:center;gap:8px 10px}
  html.phone .actions{margin:0;gap:8px;min-width:0}
  html.phone .act{font-size:14px;padding:.5em .85em}
  html.phone:not(.touch) .actions{flex-wrap:wrap;justify-content:center}
  html.phone.touch .actions{flex-wrap:nowrap;justify-content:flex-start;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:none;
    scroll-snap-type:x proximity;padding:7px 0;margin:-4px -12px 0;
    -webkit-mask-image:linear-gradient(90deg,transparent,#000 26px,#000 calc(100% - 26px),transparent);mask-image:linear-gradient(90deg,transparent,#000 26px,#000 calc(100% - 26px),transparent)}
  html.phone.touch .actions::-webkit-scrollbar{display:none}
  html.phone.touch .stepwrap,html.phone.touch .rowpad{flex:none} html.phone.touch .rowpad{display:block;height:1px}
  html.phone.touch .act{font-size:15px;scroll-snap-align:center}
  html.phone.touch .stage{touch-action:pan-y pinch-zoom}
  html.phone #wback{width:48px;height:44px;padding:0;font-size:0}
  html.phone #wback::before{content:'\\2190';font:500 20px/1 var(--head)}
  html.phone #wnext{height:44px;padding:0 22px;font-size:17px}
  html.phone .walk .pos{min-width:0;white-space:nowrap;font:600 15px/1.2 var(--head);color:var(--ink)}
  html.phone .chips.float{display:flex;position:fixed;top:auto;transform:none;z-index:6;max-width:calc(100vw - 16px)}
  html.phone .toast{font-size:15px;max-width:min(340px,calc(100vw - 24px))}
  html.phone .controls{position:fixed;top:4px;right:6px;width:auto;max-width:none;border:0;padding:0;z-index:5}
  html.phone:not(.sheet) .controls > .ctl{display:none}
  html.phone .setbtn{width:34px;height:34px;padding:0;border-radius:50%;display:grid;place-items:center;color:var(--muted)}
  html.phone .setbtn .gear{display:block;width:20px;height:20px}
  html.phone .setbtn .lbl{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
  html.phone.sheet .scrim{display:block;position:fixed;inset:0;z-index:4;background:rgba(29,42,93,.28)}
  html.phone.sheet .controls{top:auto;left:0;right:0;bottom:0;display:flex;flex-direction:column;flex-wrap:nowrap;align-items:stretch;gap:0;
    max-height:88%;overflow-y:auto;justify-content:flex-start;background:#fff;border-radius:18px 18px 0 0;box-shadow:0 -10px 40px rgba(29,42,93,.25);
    padding:8px 20px max(16px,env(safe-area-inset-bottom));animation:sheetUp .28s cubic-bezier(.2,.8,.3,1)}
  @keyframes sheetUp{from{transform:translateY(100%)}}
  @media (prefers-reduced-motion:reduce){html.phone.sheet .controls{animation:none}}
  html.phone.sheet .controls::before{content:'';flex:none;align-self:center;width:40px;height:4px;border-radius:2px;background:var(--rule);margin:0 0 6px}
  html.phone.sheet .sheethead{display:flex;justify-content:space-between;align-items:center;font:600 17px/1.3 var(--head);color:var(--ink)}
  .sheethead button{width:44px;height:44px;margin-right:-10px;padding:0;border:0;background:none;font-size:26px;line-height:1;color:var(--muted)}
  .sheethead button:hover{background:none;color:var(--ink)}
  html.phone.sheet .controls > .ctl:not([hidden]){display:flex;justify-content:space-between;gap:16px;min-height:48px;border-bottom:1px solid var(--blue-lighter)}
  html.phone.sheet .controls > .ctl label{font-size:12px;color:var(--ink)}
  html.phone.sheet .ctl .row button{font-size:14px;padding:6px 16px}
  html.phone.sheet .ctl input[type=range]{width:140px}
  html.phone.sheet #prsctl,html.phone.sheet .setbtn{display:none}
  html.phone.land body{display:grid;grid-template-columns:minmax(0,59fr) minmax(0,41fr);grid-template-rows:auto auto minmax(0,1fr) auto;
    align-items:start;column-gap:18px;row-gap:6px;padding:8px 14px}
  html.phone.land .stage{grid-column:1;grid-row:1 / -1;align-self:stretch;min-height:0}
  html.phone.land .figtag{grid-column:2;grid-row:1;padding:0 40px 0 0;text-align:left;margin:9px 0 0}
  html.phone.land .narr{grid-column:2;grid-row:2;font-size:15px}
  html.phone.land .walk{grid-column:2;grid-row:4}
  html.phone.land .controls{top:4px;right:8px}`;
/* The phone layout's conditions, in one place: the script turns them into classes on <html> (phone, land, touch) and
   follows them as the window is resized or the phone turned. */
const PHONE = { on:'(max-width:760px), (max-height:500px) and (orientation:landscape)',
  land:'(max-height:500px) and (orientation:landscape)', touch:'(pointer:coarse)' };

const WOBBLE = .6;   // the hand-drawn wobble a figure starts with (the settings slider goes 0–6)
const SPEEDS = [.25, .5, .75, 1, 1.5, 2, 3];   // the settings speed slider's stops; 1 = as written
const filterFor = k => `<filter id="hand" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${(0.045/k).toFixed(4)}" numOctaves="2" seed="4" result="warp"/>
  <feDisplacementMap id="wob" in="SourceGraphic" in2="warp" scale="${(WOBBLE*k).toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="wob"/>
  <feTurbulence type="fractalNoise" baseFrequency="${(0.9/k).toFixed(4)}" numOctaves="3" seed="11" result="n1"/>
  <feColorMatrix in="n1" type="matrix" values=".3 0 0 0 .84  .3 0 0 0 .84  .3 0 0 0 .84  0 0 0 0 1" result="grain"/>
  <feTurbulence type="fractalNoise" baseFrequency="${(0.012/k).toFixed(4)}" numOctaves="2" seed="7" result="n2"/>
  <feColorMatrix in="n2" type="matrix" values=".3 0 0 0 .85  .3 0 0 0 .85  .3 0 0 0 .85  0 0 0 0 1" result="blot"/>
  <feBlend in="wob" in2="grain" mode="multiply" result="g1"/><feBlend in="g1" in2="blot" mode="multiply" result="g2"/>
  <feComposite in="g2" in2="wob" operator="in"/></filter>`;

/* mountFigure({
     fig:'03', title:'Photo booth', hint:'click the curtain…',
     size:[W,D,H],                 // bounding box, used to frame the view (shadow range included)
     state:{...},                  // figure state (st.pal is built in: every figure starts blue). Keep it plain JSON: Walk through's Back saves copies of it
     scene: (st, m) => svgString,  // m = current palette {l,m,d}
     caption: st => 'sentence',    // shown under the figure: what is happening right now, in plain words
              //   a caption the figure changes on its own must stay up READ_S(it) seconds; earlier captions of the
              //   step are listed above the current one automatically
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
    <div class="figtag" id="figtag"><span class="no">Fig. ${cfg.fig}</span> &middot; <b>${cfg.title}</b></div>
    <div class="narr" id="narr">
      <ol class="caplog" id="caplog" aria-label="Earlier in this step"></ol>
      <p class="caption" id="caption" aria-live="polite"></p>
      <div class="predict" id="predict" hidden><p><strong>Predict</strong><span id="pq"></span></p><button class="primary" id="pgo">Show me</button></div>
    </div>
    <div class="walk" id="walkbar" hidden><button id="wback" aria-label="Back">Back</button><span class="pos" id="wpos"></span><button class="primary" id="wnext">Next</button></div>
    <div class="controls" id="controls">
      <div class="sheethead"><span>Settings</span><button id="sheetx" aria-label="Close settings">&times;</button></div>
      <div class="ctl"><label for="wb">Hand-drawn wobble</label><input id="wb" type="range" min="0" max="6" step="0.1" value="${WOBBLE}"></div>
      <div class="ctl"><label for="spd">Speed</label><input id="spd" type="range" min="0" max="${SPEEDS.length - 1}" step="1" value="${SPEEDS.indexOf(1)}"><output id="spdv" for="spd">1×</output></div>
      <div class="ctl"><label>Colour</label><div class="row" id="pals"></div></div>
      ${tog('lbl', 'Labels', true)}${tog('prd', 'Predict first', !hasPredict)}${tog('wlk', 'Walk through', walkList.length < 2)}${tog('prs', 'Present', false)}
      <button class="setbtn" id="setbtn" aria-expanded="true" aria-controls="controls"><svg class="gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg><span class="lbl">Hide settings</span></button>
    </div>
    <div class="scrim" id="scrim"></div>`;
  const st = cfg.state || {};            // kept as the same object, so a figure may hold on to it
  if (!st.pal) st.pal = 'blue';
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

  const art = $('art'), capEl = $('caption'), presenting = () => document.documentElement.classList.contains('present');
  // caption history: the earlier captions of the current step stay listed above the current one. A caption the figure
  // replaces on its own must have been up for READ_S(it); a shortfall is recorded on <html data-errors>. Numbers don't
  // count as a new caption ("Layer 3 of 24" → "Layer 4 of 24" just updates in place).
  const capLog = [], logEl = $('caplog'), narrEl = $('narr'), capKey = t => t.replace(/\d+/g, '#');
  let capSince = performance.now(), capFresh = true;
  function setCaption(c){
    const prev = capEl.textContent;
    if (capKey(prev) !== capKey(c)){
      if (!capFresh && !inPress && prev){
        const up = (performance.now() - capSince) / 1000, need = READ_S(prev);
        if (up < need / speed - .25) noteErr(`caption up ${up.toFixed(1)} s, needs ${need.toFixed(1)} s: "${prev.slice(0, 48)}"`);
        capLog.push(prev); if (capLog.length > 4) capLog.shift();
        logEl.replaceChildren(...capLog.map((t, i) => { const li = document.createElement('li');
          li.textContent = t; li.style.setProperty('--d', capLog.length - i); return li; }));
      }
      if (prev){ narrEl.classList.remove('roll'); void narrEl.offsetWidth; narrEl.classList.add('roll'); }   // restart the roll-in
      capFresh = false; capSince = performance.now();
    }
    capEl.textContent = c; narrEl.scrollTop = presenting() ? 0 : narrEl.scrollHeight;
  }
  // a press that changes the state or starts an animation begins a new step: the history clears and its first
  // caption isn't timed (a press that only flashes why it can't run leaves both alone)
  const newStep = () => { capLog.length = 0; logEl.replaceChildren(); capFresh = true; };
  // (a caption a press replaces is the reader moving on, so it isn't timed either)
  let inPress = false;
  const userStep = fn => { const before = JSON.stringify(st), r0 = ui.running; inPress = true;
    try { fn(); } finally { inPress = false; }
    if (ui.running > r0 || JSON.stringify(st) !== before) newStep(); };
  const ui = { st, running: 0 };
  ui.render = () => { _clipN = 0; art.innerHTML = inkScale(cfg.scene(st, PALS[st.pal]));
    const c = cfg.caption ? cfg.caption(st) || '' : ''; if (capEl.textContent !== c) setCaption(c);
    if (ui.drawStats) ui.drawStats(); drawWalk(); };
  // big numbers in the top-right corner (credit, change, score…); a value that changes gets a little bump
  const statsEl = $('stats'), prevStats = {};
  ui.drawStats = () => { if (!statsEl) return;
    const list = cfg.stats(st).filter(Boolean), html = list.map(x => `<div class="stat${x.small ? ' small' : ''}"><div class="k">${x.label}</div><div class="v" data-k="${x.label}">${x.value}</div></div>`).join('');
    if (statsEl._html !== html){ statsEl._html = html; statsEl.innerHTML = html;
      statsEl.querySelectorAll('.v').forEach(v => { if (prevStats[v.dataset.k] != null && prevStats[v.dataset.k] !== v.textContent) v.classList.add('bump'); prevStats[v.dataset.k] = v.textContent; }); fitSides(); } };
  // Present stands the title in a column left of the figure and the stats in one on its right, leaving the top to the
  // caption. The stage keeps the wider column's room clear on both sides, so the figure stays centred and never runs
  // under either; the room only grows, so a changing value can't make it jump. The phone layout has no room beside the
  // figure: the title goes back to the (hidden) header, and the fig tag over the caption shows it instead.
  let sideRoom = 0;
  // the phone layout (see PHONE): isPhone follows the window; ?touch=1 / ?touch=0 force the touch-screen path (testing)
  const mq = { on: matchMedia(PHONE.on), land: matchMedia(PHONE.land), touch: matchMedia(PHONE.touch) };
  let isPhone = false;
  const touchOn = () => q.get('touch') === '1' || (q.get('touch') !== '0' && mq.touch.matches);
  const titleEl = document.querySelector('header h1');
  function fitSides(reset){ const stage = svg.parentElement, beside = presenting() && !isPhone;
    if (beside !== (titleEl.parentElement === stage)){ if (beside) stage.prepend(titleEl); else document.querySelector('header').prepend(titleEl); }
    if (reset || !beside){ sideRoom = 0; stage.style.removeProperty('padding-inline'); if (!beside) return; }
    const w = Math.ceil(Math.max(titleEl.offsetWidth, statsEl ? statsEl.offsetWidth : 0)) + 24;
    if (w > sideRoom){ sideRoom = w; stage.style.paddingInline = w + 'px'; } }
  let flashT = 0, lastAct = null;   // lastAct: the button just pressed, so Present can show the note above it
  const toast = $('toast');
  ui.flash = (text, ms=1800) => { toast.textContent = text;
    if (presenting()){ const r = (lastAct && lastAct.isConnected && !lastAct.hidden ? lastAct : $('walkbar')).getBoundingClientRect();
      const m = isPhone ? toast.offsetWidth/2 + 8 : 180;   // keep the note on screen
      toast.style.left = Math.max(m, Math.min(innerWidth - m, r.left + r.width/2)) + 'px'; toast.style.top = (r.top - 10) + 'px'; }
    else { toast.style.left = ''; toast.style.top = (($('btns') ? $('btns').offsetTop + $('btns').offsetHeight : 0) + 8) + 'px'; }
    toast.classList.add('show');
    clearTimeout(flashT); flashT = setTimeout(() => toast.classList.remove('show'), ms); };
  // animations run on a ~60 fps timer rather than requestAnimationFrame, so they also run in headless test shots.
  // ui.running counts the ones in flight (Walk through waits for 0); stopAll cancels them (Back does this).
  // The Speed setting scales every animation's time (and so every ui.after delay). ui.finish() runs whatever is in
  // flight to its end at once, including anything it starts on the way, so Next can skip the rest of a step.
  let gen = 0, speed = 1;
  const live = new Set();
  ui.animate = step => { const g = gen, a = { step, done: false }; live.add(a); ui.running++; let last = performance.now();
    const end = () => { a.done = true; live.delete(a); ui.running = Math.max(0, ui.running - 1); };
    const loop = () => { if (g !== gen || a.done) return;
      const now = performance.now(), dt = Math.max(0, Math.min(.05,(now-last)/1000)) * speed; last = now;
      let more = false; try { more = step(dt) !== false; } finally { if (!more) end(); }
      ui.render(); if (more) setTimeout(loop, 16); };
    a.end = end; setTimeout(loop, 16); };
  ui.after = (sec, fn) => { let t = 0; ui.animate(dt => { t += dt; if (t < sec) return true; fn(); return false; }); };
  ui.stopAll = () => { gen++; ui.running = 0; live.clear(); };
  ui.finish = () => { if (!live.size) return;
    for (let guard = 0; live.size && guard < 200000; guard++){
      const a = live.values().next().value; let more = false;
      try { more = a.step(.05) !== false; } finally { if (!more) a.end(); } }
    if (live.size){ noteErr('finish: an animation never ended'); ui.stopAll(); }
    capFresh = true; ui.render(); };

  // Predict first: a button with `predict` asks its question before its first press; "Show me" then does the step
  const predictEl = $('predict'), pgo = $('pgo'), asked = new Set();
  let predictOn = hasPredict && q.get('predict') === '1', pending = null, pendingLabel = '';
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
  // (partPress: this press started a part's action, so the swipe watcher on the stage ignores it)
  let partPress = false, wantCentre = false;
  svg.addEventListener('pointerdown', e => { if (e.button) return; const a = e.target.closest('[data-act]'); if (!a || !cfg.acts || !cfg.acts[a.dataset.act]) return;
    e.preventDefault(); lastAct = null; partPress = wantCentre = true; hidePredict(); userStep(() => cfg.acts[a.dataset.act](st, a, ui)); ui.render(); });
  const btns = $('btns'), actEls = new Map();   // button config -> its .act element
  if (btns) buttons.forEach(b => {
    const wrap = document.createElement('div'); wrap.className = 'stepwrap';
    const el = document.createElement('button'); el.className = 'act';
    el.innerHTML = `${b.label}${b.choices ? '<span class="car">▾</span>' : ''}`;
    wrap.appendChild(el); btns.appendChild(wrap); actEls.set(b, el);
    if (!b.choices){ el.onclick = () => { closeChips(); lastAct = el; wantCentre = true; withPredict(b, () => userStep(() => b.onClick(st, ui))); ui.render(); }; return; }
    const chips = document.createElement('div'); chips.className = 'chips'; wrap.appendChild(chips); el._chips = chips;
    el.onclick = e => { e.stopPropagation(); const open = !wrap.classList.contains('open'); closeChips();
      if (!open) return;
      chips.innerHTML = '';
      // every choice stays clickable, so nothing silently ignores a press:
      //   current:true  = the one in use (shown selected); a press just says so
      //   disabled:true = not possible right now (shown faded); a press says why (c.why, or a generic note)
      for (const c of b.choices(st)){ const ch = document.createElement('button'); ch.className = 'chip' + (c.current ? ' current' : c.disabled ? ' off' : ''); ch.textContent = c.label;
        if (c.current) ch.setAttribute('aria-pressed', 'true');
        ch.onclick = ev => { ev.stopPropagation(); closeChips(); lastAct = el; wantCentre = true;
          if (c.current) return ui.flash(`${c.label} is already set`);
          if (c.disabled) return ui.flash(c.why || `${c.label} isn't possible right now`);
          withPredict(b, () => userStep(() => c.onClick(st, ui))); ui.render(); }; chips.appendChild(ch); }
      wrap.classList.add('open');
      // on a phone the picker floats over the page above its button (the button row scrolls, and would clip it),
      // kept inside the screen
      if (isPhone){ document.body.appendChild(chips); chips.classList.add('float');
        const r = el.getBoundingClientRect(), w = chips.offsetWidth;
        chips.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width/2 - w/2)) + 'px';
        chips.style.bottom = (innerHeight - r.top + 10) + 'px'; } };
  });
  function closeChips(){ document.querySelectorAll('.stepwrap.open').forEach(w => { w.classList.remove('open');
    const c = w.firstChild._chips; if (c && c.classList.contains('float')){ c.classList.remove('float'); c.style.left = c.style.bottom = ''; w.appendChild(c); } }); }
  document.addEventListener('click', closeChips);

  // Walk through: Next runs the real button for each step, in order; Back restores the state saved before that step
  const startSnap = JSON.stringify(st), hist = [];
  let walkOn = false, wi = 0;
  const restore = json => { ui.stopAll(); hidePredict(); const pal = st.pal, o = JSON.parse(json);
    for (const k of Object.keys(st)) delete st[k]; Object.assign(st, o); st.pal = pal; newStep(); };
  const starts = (s, t) => s.trim().toLowerCase().startsWith(t.trim().toLowerCase());
  // a step's name on the Next button: the button's full label, plus the choice for a picker step
  const stepName = s => { const [label, choice] = s.split('>'), b = buttons.find(b => starts(b.label, label));
    return (b ? b.label : label.trim()) + (choice != null ? ': ' + choice.trim() : ''); };
  function runWalk(i){
    const [label, choice] = walkList[i].split('>'), b = buttons.find(b => starts(b.label, label));
    if (!b) return noteErr(`walk: no button "${label}"`);
    lastAct = actEls.get(b) || wnext;
    withPredict(b, () => userStep(() => {
      if (choice == null) return b.onClick(st, ui);
      const c = b.choices(st).find(c => starts(c.label, choice));
      if (!c) return noteErr(`walk: no choice "${choice}" in "${label}"`);
      if (c.disabled) return ui.flash(c.why || `${c.label} isn't possible right now`);
      c.onClick(st, ui); })); }
  const wnext = $('wnext'), wback = $('wback'), wpos = $('wpos'), walkbar = $('walkbar');
  function drawWalk(){
    // in Present the bar is the button row, so it stays up with Walk through off (just without Back and Next)
    walkbar.hidden = !walkOn && !presenting(); wback.hidden = wnext.hidden = wpos.hidden = !walkOn;
    const nb = walkOn && wi < walkList.length ? buttons.find(b => starts(b.label, walkList[wi].split('>')[0])) : null;
    actEls.forEach((el, b) => el.classList.toggle('nextup', b === nb));
    // the phone's button row scrolls the next-up button to its centre whenever the step changes or a button is pressed
    const at = walkOn ? wi : -1;
    if (at !== centredAt || wantCentre){ wantCentre = false; const first = centredAt === null; centredAt = at; if (nb) centreNext(first); }
    if (!walkOn) return;
    // a phone shows "3 / 5" and "Next →"; the aria-labels always say it in full
    const n = walkList.length, posL = wi === 0 ? `${n} steps` : `Step ${wi} of ${n}`, nxL = wi >= n ? 'Start over' : `Next: ${stepName(walkList[wi])}`;
    const pos = isPhone && wi > 0 ? `${wi} / ${n}` : posL, nx = isPhone && wi < n ? 'Next' : nxL;
    if (wpos.textContent !== pos) wpos.textContent = pos;
    if (wnext.textContent !== nx) wnext.textContent = nx;
    if (wpos.getAttribute('aria-label') !== posL) wpos.setAttribute('aria-label', posL);
    if (wnext.getAttribute('aria-label') !== nxL) wnext.setAttribute('aria-label', nxL);
    wnext.disabled = false; wback.disabled = !hist.length; }
  let centredAt = null;
  function centreNext(instant){ if (!btns || !isPhone || !touchOn()) return;
    const up = btns.querySelector('.act.nextup'); if (!up) return;
    const r = up.getBoundingClientRect(), br = btns.getBoundingClientRect();
    const left = btns.scrollLeft + r.left + r.width/2 - (br.left + br.width/2);
    if (Math.abs(left - btns.scrollLeft) < 1) return;
    btns.scrollTo({ left, behavior: instant || matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' }); }
  // spacers at both ends of the phone's button row, so even the first and last button can scroll to the centre
  const padL = document.createElement('span'), padR = document.createElement('span');
  padL.className = padR.className = 'rowpad';
  if (btns){ btns.insertBefore(padL, btns.querySelector('.stepwrap')); btns.appendChild(padR); }
  function padRow(){ if (!btns || !isPhone || !touchOn()) return;
    const acts = btns.querySelectorAll('.stepwrap'), cw = btns.clientWidth, gap = parseFloat(getComputedStyle(btns).columnGap) || 0;
    if (!acts.length) return;
    padL.style.width = Math.max(0, (cw - acts[0].offsetWidth)/2 - gap) + 'px';
    padR.style.width = Math.max(0, (cw - acts[acts.length - 1].offsetWidth)/2 - gap) + 'px';
    // with no next-up button (Walk through off) the row starts at its first button
    if (!btns.querySelector('.act.nextup')) btns.scrollLeft = padL.offsetWidth - 14; }
  // Next never makes you wait: during a Predict question it answers Show me, and while a step is still running it
  // finishes that step at once and goes straight on to the next one
  wnext.onclick = () => { if (pending) return pgo.click();
    ui.finish();
    if (wi >= walkList.length){ restore(startSnap); hist.length = 0; wi = 0; ui.render(); return; }
    hist.push(JSON.stringify(st)); wi++; runWalk(wi - 1); ui.render(); };
  wback.onclick = () => { if (!hist.length) return; restore(hist.pop()); wi--; ui.render(); };
  // a phone's touch screen: a sideways swipe on the figure (at least 40px, more across than down) presses Next (to the
  // left) or Back (to the right). A press that started a part's action isn't a swipe, and up-and-down still scrolls.
  let swipe = null;
  const stageEl = svg.parentElement;
  stageEl.addEventListener('pointerdown', e => { const acted = partPress; partPress = false;
    swipe = isPhone && touchOn() && e.isPrimary && !acted ? { id: e.pointerId, x: e.clientX, y: e.clientY } : null; });
  stageEl.addEventListener('pointerup', e => { const s = swipe; swipe = null;
    if (!s || e.pointerId !== s.id || !walkOn) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    const b = dx < 0 ? wnext : wback;
    if (!b.hidden && !b.disabled) b.click(); });
  stageEl.addEventListener('pointercancel', () => { swipe = null; });

  // switches under the figure
  const setTog = (id, on) => { const b = $(id); b.textContent = on ? 'On' : 'Off'; b.setAttribute('aria-pressed', on); };
  const setLabels = on => { document.documentElement.classList.toggle('nolabels', !on); setTog('lbl', on); };
  $('lbl').onclick = () => setLabels(document.documentElement.classList.contains('nolabels'));
  const setPredict = on => { predictOn = on; if (!on) hidePredict(); else asked.clear(); setTog('prd', on); drawWalk(); };
  $('prd').onclick = () => setPredict(!predictOn);
  const setWalk = on => { walkOn = on; setTog('wlk', on); restore(startSnap); hist.length = 0; wi = 0; asked.clear(); ui.render(); };
  $('wlk').onclick = () => setWalk(!walkOn);
  const setSettings = open => { $('controls').classList.toggle('closed', !open);
    $('setbtn').lastChild.textContent = open ? 'Hide settings' : 'Settings'; $('setbtn').setAttribute('aria-expanded', open); };
  // on a phone the Settings button is a gear that opens the switches as a bottom sheet; the backdrop, × and Escape close it
  const sheetOpen = () => document.documentElement.classList.contains('sheet');
  const setSheet = open => { if (sheetOpen() === open) return;
    document.documentElement.classList.toggle('sheet', open); $('setbtn').setAttribute('aria-expanded', open);
    if (open) $('sheetx').focus({ preventScroll:true }); else if (isPhone) $('setbtn').focus({ preventScroll:true }); };
  $('setbtn').onclick = () => isPhone ? setSheet(true) : setSettings($('controls').classList.contains('closed'));
  $('sheetx').onclick = $('scrim').onclick = () => setSheet(false);
  // Present keeps the button row on one line: its text (buttons, Back and Next together) shrinks from 18px down to
  // 12px until it fits.
  // It is measured with the longest Next label, so the buttons keep one size through the whole walk.
  function fitRow(){ if (!btns) return; walkbar.style.removeProperty('--act-fs'); btns.classList.remove('wrap');
    if (!presenting() || isPhone) return;     // a phone's row scrolls (touch) or wraps (mouse) at a set size
    const label = wnext.textContent, longest = walkList.map(s => `Next: ${stepName(s)}`).reduce((a, b) => b.length > a.length ? b : a, 'Start over');
    if (walkOn) wnext.textContent = longest;
    const over = () => btns.scrollWidth > btns.clientWidth + 1;
    for (let px = 17; px >= 12 && over(); px--) walkbar.style.setProperty('--act-fs', px + 'px');
    btns.classList.toggle('wrap', over()); wnext.textContent = label; }
  // The figure's frame. Present shifts it to centre the figure (no button column to clear). A phone frames the drawing
  // itself (its outline, labels and shadow as drawn now, at most a quarter of the usual frame past any side of it), so
  // the figure fills the width or height that's left instead of keeping the usual frame's margins. A portrait phone is
  // taller than the figure: it is centred between the caption and the buttons, the room left over split above and below.
  function setView(){ let vb = [presenting() ? vbW*.06 : 0, 0, vbW, vbH];
    if (isPhone) try { const b = art.getBBox(), p = Math.max(b.width, b.height) * .025;
      const x0 = Math.max(-vbW*.25, b.x - p), y0 = Math.max(-vbH*.25, b.y - p), x1 = Math.min(vbW*1.25, b.x + b.width + p), y1 = Math.min(vbH*1.25, b.y + b.height + p);
      if (x1 - x0 > vbW*.2 && y1 - y0 > vbH*.2) vb = [x0, y0, x1 - x0, y1 - y0]; } catch (e) {}
    const s = vb.map(f).join(' '); if (svg.getAttribute('viewBox') !== s) svg.setAttribute('viewBox', s);
    placeStats(); }
  // …and the stats stay on the drawn figure's top-right corner, not at the top of that room
  function placeStats(){ if (!statsEl) return;
    const par = svg.getAttribute('preserveAspectRatio'), vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect();
    const h = vb && vb.width ? Math.min(r.height, r.width * vb.height / vb.width) : r.height;
    statsEl.style.top = par && r.height - h > 8 ? (r.bottom - h - svg.parentElement.getBoundingClientRect().top + 2) + 'px' : ''; }
  if (window.ResizeObserver) new ResizeObserver(placeStats).observe(svg);
  // everything that depends on the window: the phone layout (turned on or off as the window crosses PHONE.on, which
  // forces Present on), the label size, the frame, the title and stats columns, and the button row
  function relayout(){ const root = document.documentElement, on = mq.on.matches;
    root.classList.toggle('land', on && mq.land.matches); root.classList.toggle('touch', on && touchOn());
    if (on !== isPhone){ isPhone = on; root.classList.toggle('phone', on); centredAt = null;
      if (!on){ setSheet(false); $('setbtn').setAttribute('aria-expanded', !$('controls').classList.contains('closed')); }
      if (presenting() !== (on || presentWant)) return setPresent(on || presentWant);
      ui.render(); }
    fitAll(); }
  function fitAll(){ const k = presenting() && !isPhone ? 1.35 : 1; if (k !== TAG_K){ TAG_K = k; ui.render(); }
    setView(); fitSides(true); fitRow(); padRow(); centreNext(true); }
  addEventListener('resize', relayout);
  for (const m of Object.values(mq)) m.addEventListener('change', relayout);
  if (document.fonts) document.fonts.ready.then(() => { if (isPhone) setView(); fitRow(); fitSides(true); padRow(); centreNext(true); });
  // Present moves the buttons into the Back / Next row, the title and stats into columns either side of the figure,
  // centres the figure (no button column to clear), and turns Walk through on from the start (unless the page opened
  // with ?steps=0); turning it off puts back whatever Walk through was. A phone is always in Present: presentWant is
  // what the switch (or ?present=) asks for, and it applies again once the window is wider.
  let walkWas = false, presentWant = true;
  const setPresent = (on, keepWalk) => { if (presenting() === on) return;
    document.documentElement.classList.toggle('present', on); setTog('prs', on);
    if (on){ if (btns) walkbar.insertBefore(btns, wnext);
      walkWas = walkOn; setSettings(false); if (!keepWalk) setWalk(walkList.length > 1); }
    else { if (btns) svg.parentElement.prepend(btns);
      if (!walkWas) setWalk(false); }
    TAG_K = on && !isPhone ? 1.35 : 1; ui.render(); fitAll(); };
  $('prs').onclick = () => { presentWant = !presenting(); setPresent(presentWant || isPhone); };
  // with Walk through on, a clicker or the keyboard runs it: → / Page Down / Space = Next (or Show me), ← / Page Up = Back
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sheetOpen()){ e.preventDefault(); return setSheet(false); }
    if (!walkOn || sheetOpen() || e.altKey || e.ctrlKey || e.metaKey || e.target.closest('input, .chips') || document.querySelector('.stepwrap.open')) return;
    const k = e.key, fwd = k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !e.target.closest('button')), back = k === 'ArrowLeft' || k === 'PageUp';
    if (!fwd && !back) return;
    e.preventDefault();
    if (fwd) wnext.click(); else if (!wback.disabled) wback.click(); });
  const setSpeed = i => { speed = SPEEDS[i]; $('spd').value = i; $('spdv').textContent = speed + '×'; };
  $('spd').oninput = e => setSpeed(+e.target.value);
  if (SPEEDS.includes(+q.get('speed'))) setSpeed(SPEEDS.indexOf(+q.get('speed')));
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
  // Next and Back press the Walk through buttons (?press=Next@300,Next@3000,Back@6000).
  // A Predict question that comes up is answered with "Show me". Script errors and unknown labels are recorded on
  // <html data-errors="…">, and so is every caption replaced before READ_S(it) had passed. Other params: ?labels=0 ?predict=1 (Predict first on)
  // ?steps=0 (Walk through off) ?present=0 (the normal layout) ?pal=red ?settings=0 (switches folded away) ?speed=2
  window.__st = st;
  if (q.has('press')) q.get('press').split(',').forEach(item => { const [what, ms] = item.split('@'), [label, choice] = what.split('>');
    setTimeout(() => { const b = [...document.querySelectorAll('.act, #walkbar button')].find(b => starts(b.textContent, label));
      if (!b) return noteErr(`no button "${label}"`);
      b.click();
      if (choice != null){ const c = [...(b._chips || b.parentElement).querySelectorAll('.chip')].find(c => starts(c.textContent, choice));
        if (c) c.click(); else return noteErr(`no choice "${choice}" in "${label}"`); }
      if (pending) pgo.click(); }, +ms || 0); });
  setPredict(predictOn);
  if (q.get('settings') === '0') setSettings(false);
  setLight(st.az); ui.render();
  if (art.querySelector('.tag')){ $('lblctl').hidden = false; setLabels(q.get('labels') !== '0'); }
  // a figure opens in Present with Walk through on; ?present=0 / ?steps=0 open it without them (a phone is always in
  // Present)
  if (q.get('steps') !== '0' && walkList.length > 1) setWalk(true);
  presentWant = q.get('present') !== '0';
  isPhone = mq.on.matches; document.documentElement.classList.toggle('phone', isPhone);
  if (presentWant || isPhone) setPresent(true, q.get('steps') === '0');
  relayout();
  return ui;
}
