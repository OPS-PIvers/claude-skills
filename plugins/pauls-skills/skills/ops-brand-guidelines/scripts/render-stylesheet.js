// Builds Resources/stylesheet.html from the tokens in DESIGN.md, then prints
// it to Resources/OPS Tech Stylesheet.pdf.
// Usage: node scripts/render-stylesheet.js   (needs Playwright with Chromium)
// Preview a proposal without touching the real files:
//   node scripts/render-stylesheet.js path/to/proposed-DESIGN.md path/to/preview.pdf
//
// Colors, type, spacing, radius and component styles are read from DESIGN.md.
// Slide and document sizes come from the Slides and Layout sections of
// DESIGN.md and are set by hand in slidePage() and documentPage().
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const resources = path.join(root, 'Resources');
const [designArg, pdfArg] = process.argv.slice(2);
const htmlFile = path.join(resources, pdfArg ? 'stylesheet-preview.html' : 'stylesheet.html');
const pdfFile = pdfArg || path.join(resources, 'OPS Tech Stylesheet.pdf');

// ---------- Read DESIGN.md front matter ----------

function parseFrontMatter(text) {
  const yaml = text.split(/^---\s*$/m)[1];
  const tree = {};
  const stack = [{ indent: -1, node: tree }];
  for (const raw of yaml.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.match(/^ */)[0].length;
    const m = raw.trim().match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    while (stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = stack[stack.length - 1].node;
    let value = m[2];
    if (value === '') {
      parent[m[1]] = {};
      stack.push({ indent, node: parent[m[1]] });
      continue;
    }
    const quoted = value.match(/^"([^"]*)"/);
    value = quoted ? quoted[1] : value.replace(/\s+#.*$/, '').trim();
    parent[m[1]] = value;
  }
  return tree;
}

const design = parseFrontMatter(fs.readFileSync(designArg || path.join(root, 'DESIGN.md'), 'utf8'));
const FONT = design.typography.body.fontFamily;

function lookup(ref) {
  const value = ref.split('.').reduce((node, key) => node && node[key], design);
  if (value === undefined) throw new Error('Unknown token: ' + ref);
  return value;
}
function resolve(value) {
  if (typeof value !== 'string') return value;
  const whole = value.match(/^\{([^}]+)\}$/);
  if (whole) return resolve(lookup(whole[1]));
  return value.replace(/\{([^}]+)\}/g, (_, ref) => resolve(lookup(ref)));
}
const color = (name) => resolve(design.colors[name]);
const refName = (value) => {
  const m = String(value).match(/^\{\w+\.([^}]+)\}$/);
  return m ? m[1] : null;
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const comp = (name, prop) => resolve(design.components[name][prop]);

// ---------- CSS from tokens ----------

function typeCss(t) {
  const out = [`font-family:"${t.fontFamily}",Calibri,Arial,sans-serif`, `font-size:${t.fontSize}`, `font-weight:${t.fontWeight}`, `line-height:${t.lineHeight}`];
  if (t.letterSpacing) out.push(`letter-spacing:${t.letterSpacing}`);
  return out;
}

const PROPS = {
  backgroundColor: (v) => [`background-color:${v}`],
  textColor: (v) => [`color:${v}`],
  borderColor: (v) => [`border-color:${v}`, 'border-style:solid'],
  borderWidth: (v) => [`border-width:${v}`],
  borderBottomColor: (v) => [`border-bottom-color:${v}`, 'border-bottom-style:solid'],
  borderBottomWidth: (v) => [`border-bottom-width:${v}`],
  rounded: (v) => [`border-radius:${v}`],
  height: (v) => [`height:${v}`],
  minHeight: (v) => [`min-height:${v}`],
  paddingX: (v) => [`padding-left:${v}`, `padding-right:${v}`],
  paddingY: (v) => [`padding-top:${v}`, `padding-bottom:${v}`],
  fontWeight: (v) => [`font-weight:${v}`],
  typography: (v) => typeCss(v),
  underlineWidth: (v) => ['text-decoration:underline', `text-decoration-thickness:${v}`],
  underlineOffset: (v) => [`text-underline-offset:${v}`],
  outlineColor: (v) => [`outline-color:${v}`, 'outline-style:solid'],
  outlineWidth: (v) => [`outline-width:${v}`],
  outlineOffset: (v) => [`outline-offset:${v}`],
  color: (v) => [`--fill:${v}`],
  trackColor: (v) => [`--track:${v}`],
  dotColor: (v) => [`--dot:${v}`],
  dotStyle: (v) => [`--dot-fill:${v === 'outline' ? 'transparent' : 'var(--dot)'}`],
};

function componentCss() {
  let css = '';
  for (const [name, props] of Object.entries(design.components)) {
    const decl = [];
    for (const [prop, raw] of Object.entries(props)) {
      if (!PROPS[prop]) throw new Error(`No CSS mapping for ${name}.${prop}`);
      decl.push(...PROPS[prop](resolve(raw)));
    }
    css += `.c-${name}{${decl.join(';')}}\n`;
  }
  for (const [name, t] of Object.entries(design.typography)) css += `.t-${name}{${typeCss(t).join(';')}}\n`;
  return css;
}

const SHORT = {
  backgroundColor: 'bg', textColor: 'text', borderColor: 'border', borderWidth: 'border',
  borderBottomColor: 'rule', borderBottomWidth: 'rule', rounded: 'radius', height: 'height', minHeight: 'min-height',
  paddingX: 'pad-x', paddingY: 'pad-y', fontWeight: 'weight', typography: 'type',
  underlineWidth: 'underline', underlineOffset: 'underline', outlineColor: 'outline', outlineWidth: 'outline', outlineOffset: 'outline',
  color: 'fill', trackColor: 'track', dotColor: 'dot', dotStyle: 'dot',
};
function specLine(name) {
  const parts = new Map();
  for (const [prop, raw] of Object.entries(design.components[name])) {
    const value = String(raw).replace(/\{\w+\.([^}]+)\}/g, '$1');
    parts.set(SHORT[prop], [...(parts.get(SHORT[prop]) || []), value]);
  }
  return [...parts].map(([key, values]) => `${key} ${values.join(' ')}`).join(' · ');
}

// ---------- Small builders ----------

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255]
    .map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
}
const isLight = (hex) => /^#/.test(hex) && luminance(hex) > 0.7;
const label = (name, value) => `<div class="lab"><b>${esc(name)}</b>${value ? `<span>${esc(value)}</span>` : ''}</div>`;
const spec = (name, html, value) => `<div class="spec">${html}${label(name, value === undefined ? specLine(name) : value)}</div>`;
const logo = (file, style) => `<img src="${encodeURI(file)}" alt="" style="${style}">`;
const icon = (d, size = 14) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  search: icon('<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/>'),
  download: icon('<path d="M8 2.5v8M4.5 7.5L8 11l3.5-3.5M3 13.5h10"/>'),
  send: icon('<path d="M14 2L7 9M14 2l-4.5 12L7 9 2 6.5 14 2z"/>'),
  right: icon('<path d="M6 4l4 4-4 4"/>', 12),
  down: icon('<path d="M4 6l4 4 4-4"/>', 12),
  warn: icon('<path d="M8 2.5l6 10.5H2L8 2.5zM8 6.5v3M8 11.6v.1"/>', 15),
};

// ---------- Page 1: color ----------

function colorPage() {
  const names = Object.keys(design.colors);
  const sw = (n) => {
    const hex = color(n);
    return `<div class="sw"><div class="chip${isLight(hex) ? ' edge' : ''}" style="background:${hex}"></div>${label(n, hex)}</div>`;
  };
  const family = (f) =>
    names
      .filter((n) => n.startsWith(f) && !/\d/.test(n))
      .sort((a, b) => luminance(color(a)) - luminance(color(b)))
      .map(sw)
      .join('');
  const brand = `<div class="swrow">${family('blue')}${family('red')}</div><div class="swrow">${family('gray')}${sw('white')}</div>`;

  const ramps = ['blue', 'red', 'slate']
    .map((f) => {
      const steps = names.filter((n) => new RegExp(`^${f}-\\d+$`).test(n));
      return `<div class="ramp" style="grid-template-columns:repeat(${steps.length},1fr)">${steps
        .map((n) => {
          const hex = color(n);
          return `<div><div class="chip${isLight(hex) ? ' edge' : ''}" style="background:${hex}"></div>${label(n, hex)}</div>`;
        })
        .join('')}</div>`;
    })
    .join('');

  const groupStart = { primary: 'Ink and brand', canvas: 'Surfaces', 'on-surface': 'Text', divider: 'Lines' };
  const groups = [];
  for (const n of names.slice(names.indexOf('primary'))) {
    if (groupStart[n]) groups.push({ title: groupStart[n], keys: [] });
    groups[groups.length - 1].keys.push(n);
  }
  const roles = groups
    .map(
      (g) =>
        `<div class="group"><h3>${g.title}</h3>${g.keys
          .map((n) => {
            const value = color(n);
            return `<div class="role"><i class="dot${isLight(value) ? ' edge' : ''}" style="background:${value}"></i><b>${n}</b><span>${refName(design.colors[n]) || value}</span></div>`;
          })
          .join('')}</div>`
    )
    .join('');

  const line = (n) => `<div class="t-body" style="color:${color(n)}">${n}</div>`;
  const textDemo = `<div class="three">
    <div class="pad edge" style="background:${color('surface')}">${['on-surface', 'on-surface-muted', 'on-surface-disabled', 'primary', 'accent', 'danger'].map(line).join('')}</div>
    <div class="pad" style="background:${color('surface-inverted')}">${['on-inverted', 'on-inverted-muted', 'on-inverted-subtle'].map(line).join('')}</div>
    <div class="pad" style="background:${color('surface-loud')}">${['on-inverted', 'on-loud-muted'].map(line).join('')}</div>
  </div>`;

  return `<h2>Brand colors</h2>${brand}<h2>Ramps</h2>${ramps}<h2>Roles</h2><div class="roles">${roles}</div><h2>Text on surfaces</h2>${textDemo}`;
}

// ---------- Page 2: type, spacing, radius ----------

function typePage() {
  const rows = Object.entries(design.typography)
    .map(([name, t]) => {
      const text = /^(display|headline|title)/.test(name)
        ? 'Exit ticket results'
        : name === 'label'
          ? 'Due date'
          : name === 'caption'
            ? 'Source: OMS exit ticket pilot, fall 2026'
            : 'Hand out three questions at the door.';
      const value = `${t.fontFamily} ${t.fontWeight} · ${t.fontSize} / ${t.lineHeight}${t.letterSpacing ? ' · ' + t.letterSpacing : ''}`;
      const ink = /^(display|headline|title)/.test(name) ? color('primary') : color('on-surface');
      return `<div class="trow">${label(name, value)}<div class="t-${name}" style="color:${ink}">${text}</div></div>`;
    })
    .join('');
  const px = (v) => parseInt(resolve(v), 10);
  const spacing = Object.entries(design.spacing)
    .filter(([, v]) => px(v) <= 64)
    .map(([n, v]) => `<div class="sp"><i style="width:${v};height:${v};background:${color('selected-bg')}"></i>${label(n, v)}</div>`)
    .join('');
  const radius = Object.entries(design.rounded)
    .map(([n, v]) => `<div class="sp"><i style="width:52px;height:52px;border:1.5px solid ${color('primary')};border-radius:${v}"></i>${label(n, v)}</div>`)
    .join('');
  return `<h2>Type scale</h2><div class="tlist">${rows}</div>
    <h2>Spacing</h2><div class="sprow">${spacing}${label('container-max', design.spacing['container-max'])}</div>
    <h2>Radius</h2><div class="sprow">${radius}</div>`;
}

// ---------- Pages 3 and 4: components ----------

function chart(width, height) {
  const series = [1, 2, 3, 4, 5, 6].map((i) => comp(`chart-series-${i}`, 'color'));
  const values = [82, 64, 51, 40, 28, 19];
  const axis = comp('chart-axis', 'color'), grid = comp('chart-grid', 'color');
  const left = 30, bottom = height - 22, top = 8, plot = bottom - top;
  const step = (width - left - 8) / series.length;
  let svg = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Bar chart in the six series colors" font-family="${FONT}">`;
  for (const tick of [0, 25, 50, 75, 100]) {
    const y = bottom - (plot * tick) / 100;
    if (tick) svg += `<line x1="${left}" x2="${width - 8}" y1="${y}" y2="${y}" stroke="${grid}"/>`;
    svg += `<text x="${left - 6}" y="${y + 3}" text-anchor="end" font-size="9" fill="${axis}">${tick}</text>`;
  }
  series.forEach((fill, i) => {
    const h = (plot * values[i]) / 100, x = left + step * i + step * 0.2;
    svg += `<rect x="${x}" y="${bottom - h}" width="${step * 0.6}" height="${h}" fill="${fill}"/>`;
    svg += `<text x="${x + step * 0.3}" y="${bottom + 13}" text-anchor="middle" font-size="9" fill="${axis}">${i + 1}</text>`;
  });
  return svg + `<line x1="${left}" x2="${width - 8}" y1="${bottom}" y2="${bottom}" stroke="${axis}"/></svg>`;
}

const status = (kind, text) => `<span class="st c-status${kind ? ' c-status-' + kind : ''}">${text}</span>`;
const progress = (pct, danger) =>
  `<div class="prog c-progress${danger ? ' c-progress-danger' : ''}"><div><i style="width:${pct}%"></i></div><span>${pct}%</span></div>`;

function componentPages() {
  const topBar = spec(
    'top-bar',
    `<div class="c-top-bar bar"><span class="c-top-bar-title">Devices</span><span class="c-nav-link c-nav-link-active">Re-enrollment</span><span class="c-nav-link">Inventory</span><span class="c-nav-link">Repairs</span><div class="c-top-bar-search find">${ICON.search}Search devices</div></div>`
  ) + `<div class="minor">${['top-bar-title', 'nav-link', 'nav-link-active', 'top-bar-search'].map((n) => label(n, specLine(n))).join('')}</div>`;

  const btn = (name, text, ic = '') => {
    const base = name.replace(/-hover$/, '');
    const classes = [...new Set(['button', base, name])].map((n) => 'c-' + n).join(' ');
    return spec(name, `<span class="btn ${classes}">${ic}${text}</span>`);
  };
  const buttons = `<div class="cols4">
    ${btn('button', 'Download CSV', ICON.download)}${btn('button-hover', 'Download CSV', ICON.download)}
    ${btn('button-primary', 'Send reminder', ICON.send)}${btn('button-primary-hover', 'Send reminder', ICON.send)}
    ${btn('button-danger', 'Delete quiz')}${btn('button-danger-hover', 'Delete quiz')}
    ${btn('button-disabled', 'Send reminder')}
  </div>`;

  const field = (state, value, note, noteClass) =>
    spec(state, `<div class="c-input-label">Due date</div><div class="c-input${state === 'input' ? '' : ' c-' + state} inbox">${value}</div><div class="c-${noteClass}">${note}</div>`);
  const inputs = `<div class="cols4">
    ${field('input', 'March 1', 'Staff see this date in the email.', 'input-helper')}
    ${field('input-focus', 'March 1', 'Staff see this date in the email.', 'input-helper')}
    ${field('input-error', 'February 1', 'Choose a date after today.', 'input-error-message')}
    ${field('input-disabled', 'March 1', 'Staff see this date in the email.', 'input-helper')}
  </div><div class="minor">${['input-label', 'input-helper', 'input-error-message'].map((n) => label(n, specLine(n))).join('')}</div>`;

  const alerts =
    spec('alert-danger', `<div class="c-alert-danger alert">${ICON.warn}<span><b>Action required:</b> Orono Middle School has 412 devices left.</span><a>Send reminder</a></div>`) +
    `<div style="height:10px"></div>` +
    spec('alert-info', `<div class="c-alert-info alert"><span><b>Heads up:</b> The Wi-Fi password changes Monday.</span></div>`);

  const seg = spec(
    'segment',
    `<div class="segs"><span class="c-segment c-segment-selected">All buildings <i>4</i></span><span class="c-segment">Needs action <i>1</i></span><span class="c-segment">In progress <i>2</i></span><span class="c-segment">Done <i>1</i></span></div>`
  ) + label('segment-selected', specLine('segment-selected'));

  const statuses = `<div class="cols4">
    ${spec('status', status('', 'In progress'))}${spec('status-done', status('done', 'Done'))}
    ${spec('status-action', status('action', 'Action required'))}${spec('status-not-started', status('not-started', 'Not started'))}
  </div>`;
  const progs = `<div class="cols4">${spec('progress', progress(62))}${spec('progress-danger', progress(21, true))}${spec('link', '<a class="c-link">Open the help center</a>')}</div>`;
  const list = spec('list-row', ['Orono Middle School staff|Feb 10', 'All buildings|Feb 3'].map((r) => `<div class="c-list-row lrow"><span>${r.split('|')[0]}</span><span style="color:${color('on-surface-muted')}">${r.split('|')[1]}</span></div>`).join(''));

  const row = (name, d, r, l, pct, kind, word, sync, o = {}) =>
    `<tr class="c-table-row${o.sub ? ' c-table-row-sub' : ''}"><td><span class="name${o.sub ? ' subname' : ' c-table-row-name'}">${o.sub ? '' : o.open ? ICON.down : ICON.right}${name}</span></td><td class="n">${d}</td><td class="n">${r}</td><td class="n"${o.danger ? ` style="color:${color('danger')};font-weight:500"` : ''}>${l}</td><td>${progress(pct, o.danger)}</td><td>${status(kind, word)}</td></tr>`;
  const panel = `<div class="c-panel" style="overflow:hidden">
      <div class="sum"><strong class="t-title" style="color:${color('primary')}">1,560 of 2,080 devices re-enrolled</strong><span>520 left, 412 of them at Orono Middle School</span>
        <div class="track"><i style="width:75%;background:${color('primary')}"></i><i style="width:19.8%;background:${color('danger')}"></i></div></div>
      <table class="grid"><thead><tr>${['Building', 'Devices', 'Re-enrolled', 'Left', 'Progress', 'Status'].map((h, i) => `<th class="c-table-header${i > 0 && i < 4 ? ' n' : ''}">${h}</th>`).join('')}</tr></thead><tbody>
        ${row('Schumann Elementary', 412, 412, 0, 100, 'done', 'Done', '7:42 AM')}
        ${row('Orono Middle School', 520, 108, 412, 21, 'action', 'Action required', '7:40 AM', { open: true, danger: true })}
        ${row('Grade 6', 174, 108, 66, 62, '', 'In progress', '7:40 AM', { sub: true })}
        ${row('Grade 7', 172, 0, 172, 0, 'not-started', 'Not started', 'Yesterday', { sub: true })}
        ${row('Orono High School', 760, 669, 91, 88, '', 'In progress', '7:41 AM')}
      </tbody></table></div>
    <div class="minor">${['panel', 'table-header', 'table-row', 'table-row-name', 'table-row-sub'].map((n) => label(n, specLine(n))).join('')}</div>`;

  const series = [1, 2, 3, 4, 5, 6].map((i) => `<div class="sw"><div class="chip" style="background:${comp('chart-series-' + i, 'color')};height:18px"></div>${label('chart-series-' + i, refName(design.components['chart-series-' + i].color))}</div>`).join('');
  const g0 = design.components['chart-gradient-start'].color, g1 = design.components['chart-gradient-end'].color;
  const charts = `<div class="swrow six">${series}</div>
    <div class="chip" style="height:18px;margin-top:10px;background:linear-gradient(90deg,${resolve(g0)},${resolve(g1)})"></div>
    <div class="ends">${label('chart-gradient-start', refName(g0))}${label('chart-gradient-end', refName(g1))}</div>
    <div style="margin-top:10px">${chart(720, 170)}</div>
    <div class="minor">${label('chart-axis', refName(design.components['chart-axis'].color))}${label('chart-grid', refName(design.components['chart-grid'].color))}</div>`;

  return {
    a: `<h2>Top bar</h2>${topBar}<h2>Buttons</h2>${buttons}<h2>Inputs</h2>${inputs}<h2>Alerts</h2>${alerts}<h2>Filter row</h2>${seg}`,
    b: `<h2>Status</h2>${statuses}<h2>Progress and links</h2>${progs}<h2>Panel and table</h2>${panel}<h2>List rows</h2>${list}`,
    charts: `<h2>Chart colors</h2>${charts}`,
  };
}

// ---------- Logos ----------

function logoSection() {
  const dark = color('surface-inverted');
  const files = `<div class="logos">
    <div><div class="lbox edge">${logo('Primary Logo.png', 'width:2.3in')}</div>${label('Primary Logo.png', 'Footers of tools and documents')}</div>
    <div><div class="lbox edge">${logo('Secondary Logo.png', 'width:0.9in')}</div>${label('Secondary Logo.png', 'Title slides, compact spaces')}</div>
    <div><div class="lbox edge">${logo('Torch Icon.png', 'width:0.9in')}</div>${label('Torch Icon.png', 'Favicon')}</div>
    <div><div class="lbox edge">${logo('OPS Tech Logo 2.png', 'width:1.5in')}</div>${label('OPS Tech Logo 2.png', 'On request only')}</div>
  </div>`;
  const onDark = `<div class="logos two">
    <div><div class="lbox" style="background:${dark}">${logo('Secondary Logo.png', 'width:0.8in')}</div>${label('Secondary Logo.png', 'On primary')}</div>
    <div class="flow" style="align-items:flex-end;gap:28px">
      <div>${logo('Primary Logo.png', 'width:80px')}${label('Screen minimum', '80px wide')}</div>
      <div>${logo('Primary Logo.png', 'width:0.75in')}${label('Print minimum', '0.75in wide')}</div>
    </div>
  </div>`;
  return `<h2>Logos</h2>${files}${onDark}`;
}

// ---------- Document (sizes from DESIGN.md Layout) ----------

function documentPage() {
  const ink = color('primary'), muted = color('on-surface-muted'), line = color('border');
  const doc = `<div class="docwrap"><div class="doc">
      <div style="margin:0 -66px;padding:44px 66px 22px;background:${ink};color:#fff;display:flex;justify-content:space-between;align-items:flex-end">
        <b style="font:500 30pt/1 ${FONT};letter-spacing:-0.03em">Tech notes</b><span style="font-size:9.5pt;color:${color('on-inverted-muted')}">Staff newsletter · February 2027</span></div>
      <div style="margin-top:36px;font:500 9.5pt ${FONT};color:${muted}">Professional development</div>
      <div style="font:500 31pt/1.08 ${FONT};letter-spacing:-0.028em;color:${ink};margin-top:8px;max-width:600px">Exit tickets take three minutes and show who's lost</div>
      <div style="margin-top:12px;font:300 14pt/1.4 ${FONT};max-width:540px">Twelve Orono Middle School teachers tried them for five weeks last fall.</div>
      <div style="display:grid;grid-template-columns:1fr 190px;gap:40px;margin-top:24px">
        <div><p style="margin:0">The teachers handed out three questions at the door every day. Of the 212 students in those classes, 84% answered every day.</p>
          <p>Sorting the answers took about two minutes after class. Teachers started the next lesson with the question most students missed.</p></div>
        <div style="border-top:1px solid ${ink};padding-top:10px;align-self:start"><b style="display:block;font:400 46pt/1 ${FONT};letter-spacing:-0.04em;color:${color('danger')}">84%</b><span style="display:block;margin-top:8px;font-size:9pt;line-height:1.4;color:${muted}">of 212 students answered every day for five weeks</span></div>
      </div>
      <div class="c-alert-info" style="margin-top:24px;font-size:10.5pt"><b>Due Friday:</b> Submit your PD hours in Frontline.</div>
      <div style="margin-top:30px;font:500 9.5pt ${FONT};color:${muted}">Also this month</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px;margin-top:12px">
        ${[
          ['Wi-Fi password change', 'The staff Wi-Fi password changes Monday, February 22. The new password is in the staff portal.'],
          ['Chromebook repairs', 'Repairs dropped 40% after the case swap in August. The help desk logged 186 this fall and 310 last fall.'],
          ['Device re-enrollment', 'Every student Chromebook has to re-enroll by March 1. Orono Middle School has 412 left.'],
        ]
          .map(([t, b]) => `<div style="border-top:1px solid ${ink};padding-top:10px"><div style="font:500 12pt/1.25 ${FONT};letter-spacing:-0.01em;color:${ink}">${t}</div><p style="margin:6px 0 0;font-size:9.5pt;line-height:1.5">${b}</p></div>`)
          .join('')}
      </div>
      <div style="margin-top:30px;font:500 9.5pt ${FONT};color:${muted}">PD sessions</div>
      <table class="grid" style="margin-top:8px;border-top:1px solid ${line};border-bottom:1px solid ${line}"><thead><tr>${['Building', 'Date', 'Time', 'Room'].map((h) => `<th class="c-table-header" style="padding-left:0">${h}</th>`).join('')}</tr></thead><tbody>
        <tr class="c-table-row"><td style="padding-left:0" class="c-table-row-name">Orono Middle School</td><td style="padding-left:0">March 4</td><td style="padding-left:0">3:10 PM</td><td style="padding-left:0">Media center</td></tr>
        <tr class="c-table-row"><td style="padding-left:0" class="c-table-row-name">Orono High School</td><td style="padding-left:0">March 11</td><td style="padding-left:0">3:10 PM</td><td style="padding-left:0">Room 204</td></tr>
      </tbody></table>
      <div style="position:absolute;left:66px;right:66px;bottom:34px;padding-top:14px;border-top:1px solid ${line};display:flex;justify-content:space-between;align-items:center;font-size:8.5pt;color:${muted}">${logo('Primary Logo.png', 'height:19px')}<span>Orono Public Schools · Page 1</span></div>
    </div></div>`;
  const specs = [
    ['Masthead', 'bg primary · title 30pt 500'],
    ['Section label', '9.5pt 500 · on-surface-muted'],
    ['Headline', '31pt 500 · primary'],
    ['Lede', '14pt 300'],
    ['Body', '10.5pt 400 · on-surface'],
    ['Figure', '46pt 400 · danger'],
    ['Alert', 'alert-info'],
    ['Story title', '12pt 500 · primary'],
    ['Table', 'table-header · table-row'],
    ['Footer', 'Primary Logo.png 19px · 8.5pt'],
    ['Scale', '65% of letter size'],
  ]
    .map(([a, b]) => `<div class="docspec">${label(a, b)}</div>`)
    .join('');
  return `<h2>Newsletter</h2><div class="docrow">${doc}<div style="flex:1">${specs}</div></div>`;
}

// ---------- Slides (sizes from DESIGN.md Slides) ----------

function slidePage() {
  const bg = color('surface-inverted'), muted = color('on-inverted-muted'), subtle = color('on-inverted-subtle'), line = color('divider-inverted');
  const h = (t) => `<div style="font:500 30pt/1.15 ${FONT};letter-spacing:-0.022em;max-width:9.4in">${t}</div>`;
  const src = (t) => `<div style="position:absolute;left:0.75in;bottom:0.45in;font:400 10pt ${FONT};color:${subtle}">${t}</div>`;
  const slides = [
    ['Title slide', 'bg primary · Secondary Logo 0.8in · title 78pt 500 · details 16pt', bg,
      `${logo('Secondary Logo.png', 'position:absolute;left:0.75in;top:0.62in;width:0.8in')}
       <div style="position:absolute;left:0.75in;bottom:1.55in;font:500 78pt/0.98 ${FONT};letter-spacing:-0.04em">Exit tickets</div>
       <div style="position:absolute;left:0.75in;right:0.75in;bottom:0.62in;padding-top:0.19in;border-top:1px solid ${line};display:flex;justify-content:space-between;font:400 16pt ${FONT};color:${muted}"><span>OMS staff PD</span><span>March 4, 2027</span></div>`],
    ['Content slide', 'bg primary · title 30pt 500 · body 20pt 300 on-inverted-muted', bg,
      h("Exit tickets take 3 minutes and show who's lost") +
      `<div style="position:absolute;left:0.75in;right:0.75in;top:2.5in;font:300 20pt ${FONT};color:${muted}">${['Three questions at the door', 'Sort the answers into piles after class', 'Start the next class with the question most students missed']
        .map((t) => `<div style="padding:0.2in 0;border-top:1px solid ${line}">${t}</div>`)
        .join('')}</div>` + src('Source: OMS exit ticket pilot, fall 2026')],
    ['Content slide, one number', 'number 180pt 400 on-inverted · rows divider-inverted', bg,
      h('Most students answered every day') +
      `<div style="position:absolute;left:0.75in;top:2.4in;font:400 180pt/0.9 ${FONT};letter-spacing:-0.055em">84%</div>
       <div style="position:absolute;left:0.8in;top:5in;font:300 20pt/1.35 ${FONT};color:${muted};max-width:5.4in">of 212 students answered every day for five weeks</div>
       <div style="position:absolute;right:0.75in;top:2.6in;width:4.2in">${[['Questions per ticket', 3], ['Minutes to sort', 2], ['Teachers', 12]]
         .map(([a, b]) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:0.19in 0;border-top:1px solid ${line};font:300 18pt ${FONT};color:${muted}"><span>${a}</span><b style="font:500 22pt ${FONT};color:#fff">${b}</b></div>`)
         .join('')}</div>` + src('Source: OMS exit ticket pilot, fall 2026')],
    ['Section divider', 'bg surface-loud · title 72pt 500 · label 20pt 300 on-loud-muted', color('surface-loud'),
      `<div style="position:absolute;left:0.8in;top:0.66in;font:300 20pt ${FONT};color:${color('on-loud-muted')}">Part 2</div>
       <div style="position:absolute;left:0.75in;bottom:1in;font:500 72pt/0.98 ${FONT};letter-spacing:-0.04em">Write your own</div>`],
    ['Chart slide', 'highlight series on-inverted · other series blue-600', bg,
      h('Chromebook repairs dropped 40% after the case swap') +
      `<div style="position:absolute;left:0.75in;right:0.75in;top:2.8in">${[['Fall 2025', 310, line], ['Fall 2026', 186, '#fff']]
        .map(([y, n, c]) => `<div style="display:grid;grid-template-columns:1.6in 1fr;align-items:center;margin-bottom:0.35in;font:300 18pt ${FONT};color:${muted}"><span>${y}</span><div style="display:flex;align-items:center;gap:0.2in"><i style="display:block;height:1.05in;width:${(n / 310) * 8.4}in;background:${c}"></i><b style="font:500 32pt ${FONT};color:#fff">${n}</b></div></div>`)
        .join('')}</div>` + src('Source: OMS help desk tickets, fall 2025 and fall 2026')],
    ['Closing slide', 'bg primary · Secondary Logo 0.8in · title 78pt 500 · details 16pt', bg,
      `${logo('Secondary Logo.png', 'position:absolute;left:0.75in;top:0.62in;width:0.8in')}
       <div style="position:absolute;left:0.75in;bottom:1.55in;font:500 78pt/0.98 ${FONT};letter-spacing:-0.04em">Try one this week</div>
       <div style="position:absolute;left:0.75in;right:0.75in;bottom:0.62in;padding-top:0.19in;border-top:1px solid ${line};display:flex;justify-content:space-between;font:400 16pt ${FONT};color:${muted}"><span>Next session</span><span>March 18, 2027</span></div>`],
  ];
  return `<h2>Slides</h2><div class="slides">${slides
    .map(([name, value, background, html]) => `<div><div class="frame"><div class="slide" style="background:${background}">${html}</div></div>${label(name, value)}</div>`)
    .join('')}</div>`;
}

// ---------- Page shell ----------

const components = componentPages();
const pages = [
  ['Color', colorPage()],
  ['Type, spacing and radius', typePage()],
  ['Components', components.a],
  ['Components', components.b],
  ['Logos and charts', logoSection() + components.charts],
  ['Newsletter', documentPage()],
  ['Slides', slidePage()],
];

const g = color;
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OPS Tech stylesheet</title>
<!-- Generated from ../DESIGN.md by scripts/render-stylesheet.js. Edit the script or DESIGN.md, then re-run it. -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${FONT.replace(/ /g, '+')}:wght@300;400;500;600&display=swap">
<style>
@page { size: letter; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; background: #fff; }
body { font: 400 9pt/1.4 ${FONT}, Calibri, Arial, sans-serif; color: ${g('on-surface')}; font-variant-numeric: tabular-nums; }
.page { width: 8.5in; height: 11in; padding: 0.4in 0.5in 0.33in; display: flex; flex-direction: column; overflow: hidden; break-after: page; }
.page > header, .page > footer { display: flex; justify-content: space-between; font-size: 8pt; color: ${g('on-surface-muted')}; }
.page > footer { margin-top: auto; padding-top: 8px; }
.page > header b { font-weight: 600; color: ${g('primary')}; }
h2 { font: 600 12pt/1.2 ${FONT}; letter-spacing: -0.01em; color: ${g('primary')}; margin: 16px 0 8px; }
h3 { font: 500 8.5pt/1.2 ${FONT}; color: ${g('on-surface-muted')}; margin: 0 0 3px; }
table { border-collapse: collapse; width: 100%; }
th { text-align: left; }
a { text-underline-offset: 3px; }

.lab { margin-top: 4px; font-size: 6.5pt; line-height: 1.35; }
.lab b { display: block; font-weight: 500; color: ${g('on-surface')}; }
.lab span { display: block; color: ${g('on-surface-muted')}; }
.edge { box-shadow: inset 0 0 0 1px ${g('border')}; }
.chip { height: 30px; border-radius: 6px; }
.swrow { display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; margin-bottom: 8px; }
.swrow.six { margin: 0; grid-template-columns: repeat(6, 1fr); }
.ramp { display: grid; margin-bottom: 8px; }
.ramp .chip { border-radius: 0; height: 28px; }
.roles { columns: 4; column-gap: 18px; }
.group { break-inside: avoid; margin-bottom: 10px; }
.role { display: flex; align-items: center; gap: 6px; padding: 2.5px 0; border-bottom: 1px solid ${g('divider')}; font-size: 6.5pt; }
.role b { font-weight: 500; white-space: nowrap; }
.role span { margin-left: auto; color: ${g('on-surface-muted')}; white-space: nowrap; }
.dot { width: 11px; height: 11px; border-radius: 3px; flex: none; }
.three { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 12px; }
.pad { border-radius: 8px; padding: 10px 14px; }

.trow { display: grid; grid-template-columns: 1.6in 1fr; gap: 14px; align-items: center; padding: 6px 0; border-bottom: 1px solid ${g('divider')}; }
.trow .lab { margin: 0; }
.sprow { display: flex; gap: 22px; align-items: flex-end; }
.sp i { display: block; }

.flow { display: flex; flex-wrap: wrap; gap: 12px 15px; align-items: flex-start; }
.cols4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px 14px; align-items: start; }
.minor { display: flex; gap: 20px; margin-top: 4px; }
.minor .lab { flex: 1; }
.btn { display: inline-flex; align-items: center; gap: 7px; }
.bar { display: flex; align-items: center; gap: 26px; }
.bar .c-top-bar-title { margin-right: 10px; }
.find { margin-left: auto; display: flex; align-items: center; gap: 8px; width: 220px; }
.inbox { display: flex; align-items: center; margin: 5px 0; }
.alert { display: flex; align-items: center; gap: 10px; }
.alert a { margin-left: auto; font-weight: 500; text-decoration: underline; }
.alert b, .c-alert-info b { font-weight: 600; }
.segs { display: flex; gap: 2px; }
.segs i { font-style: normal; font-weight: 400; color: ${g('on-surface-muted')}; margin-left: 4px; }
.st { display: flex; align-items: center; gap: 7px; }
.st::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--dot-fill, var(--dot)); box-shadow: inset 0 0 0 1.5px var(--dot); }
.prog { display: flex; align-items: center; gap: 10px; height: auto; background: none; }
.prog div { width: 96px; height: ${comp('progress', 'height')}; border-radius: ${comp('progress', 'rounded')}; background: var(--track); overflow: hidden; }
.prog i { display: block; height: 100%; background: var(--fill); }
.prog span { width: 34px; text-align: right; color: ${g('on-surface-muted')}; font-size: 13px; }
.lrow { display: flex; justify-content: space-between; }
.sum { display: grid; grid-template-columns: 1fr auto; gap: 6px 24px; align-items: baseline; padding: 16px 20px 18px; border-bottom: 1px solid ${g('border')}; font-size: 13px; color: ${g('on-surface-muted')}; }
.track { grid-column: 1 / -1; display: flex; gap: 2px; height: 8px; margin-top: 6px; border-radius: 4px; overflow: hidden; background: ${g('track')}; }
.track i { display: block; }
.grid td { padding: 0 12px; height: inherit; white-space: nowrap; }
.grid th { white-space: nowrap; }
.grid tr:last-child td { border-bottom: 0; }
.grid tr.c-table-row td { border-bottom: 1px solid ${g('divider')}; }
.grid tbody tr:last-child td { border-bottom: 0; }
.grid th:first-child, .grid td:first-child { padding-left: 20px; }
.grid .n { text-align: right; }
.grid .name { display: flex; align-items: center; gap: 8px; }
.grid .subname { padding-left: 22px; }
.ends { display: flex; justify-content: space-between; }
.ends .lab:last-child { text-align: right; }

.logos { display: grid; grid-template-columns: 2.5in 1fr 1fr 1.7in; gap: 14px; margin-bottom: 12px; }
.logos.two { grid-template-columns: 2.5in 1fr; align-items: end; }
.lbox { height: 1.05in; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
.docrow { display: flex; gap: 0.3in; align-items: flex-start; }
.docwrap { width: 5.525in; height: 7.15in; flex: none; box-shadow: inset 0 0 0 1px ${g('border')}; overflow: hidden; }
.doc { width: 8.5in; height: 11in; padding: 0 66px; zoom: 0.65; position: relative; font: 400 10.5pt/1.55 ${FONT}; color: ${g('on-surface')}; }
.doc p { margin: 10px 0 0; }
.docspec { padding: 3px 0 6px; border-bottom: 1px solid ${g('divider')}; }
.slides { display: grid; grid-template-columns: 3.5in 3.5in; justify-content: space-between; gap: 10px; }
.frame { width: 3.5in; height: 1.969in; overflow: hidden; border-radius: 4px; }
.slide { width: 13.333in; height: 7.5in; zoom: 0.2625; position: relative; color: #fff; padding: 0.66in 0.75in; }

${componentCss()}</style>
</head>
<body>
${pages
  .map(
    ([name, body], i) => `<section class="page">
<header><b>OPS Tech stylesheet</b><span>${name}</span></header>
${body}
<footer><span>Generated from DESIGN.md, version ${esc(design.version)}</span><span>${i + 1} of ${pages.length}</span></footer>
</section>`
  )
  .join('\n')}
</body>
</html>
`;

fs.writeFileSync(htmlFile, html);

// ---------- Print ----------

(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + htmlFile, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(() =>
    [...document.querySelectorAll('.page')]
      .map((p, i) => (p.scrollHeight > p.clientHeight + 1 ? `page ${i + 1} overflows by ${p.scrollHeight - p.clientHeight}px` : null))
      .filter(Boolean)
  );
  if (overflow.length) console.warn(overflow.join('\n'));
  await page.pdf({ path: pdfFile, format: 'Letter', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  if (pdfArg) fs.unlinkSync(htmlFile);
})();
