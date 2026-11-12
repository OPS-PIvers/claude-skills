// Builds Resources/stylesheet.html from the tokens in DESIGN.md, then prints
// it to Resources/OPS Tech Stylesheet.pdf.
// Usage: node scripts/render-stylesheet.js   (needs Playwright with Chromium)
//
// Colors, type, spacing, radius and component styles are read from DESIGN.md.
// Slide, document and logo sizes come from SKILL.md and are set in the
// SLIDES, DOCUMENT and LOGOS sections below. Update them when SKILL.md changes.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const resources = path.join(root, 'Resources');

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

const design = parseFrontMatter(fs.readFileSync(path.join(root, 'DESIGN.md'), 'utf8'));

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

// ---------- CSS from tokens ----------

function typeCss(t) {
  const out = [
    `font-family:"${t.fontFamily}",Arial,sans-serif`,
    `font-size:${t.fontSize}`,
    `font-weight:${t.fontWeight}`,
    `line-height:${t.lineHeight}`,
  ];
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
  borderTopColor: (v) => [`border-top-color:${v}`, 'border-top-style:solid'],
  borderTopWidth: (v) => [`border-top-width:${v}`],
  rounded: (v) => [`border-radius:${v}`],
  padding: (v) => [`padding:${v}`],
  paddingX: (v) => [`padding-left:${v}`, `padding-right:${v}`],
  paddingY: (v) => [`padding-top:${v}`, `padding-bottom:${v}`],
  marginY: (v) => [`margin-top:${v}`, `margin-bottom:${v}`],
  boxShadow: (v) => [`box-shadow:${v}`],
  fontWeight: (v) => [`font-weight:${v}`],
  typography: (v) => typeCss(v),
  color: () => [],
  leadTextColor: () => [],
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
    if (props.leadTextColor) css += `.c-${name} b{color:${resolve(props.leadTextColor)}}\n`;
  }
  for (const [name, t] of Object.entries(design.typography)) {
    css += `.t-${name}{${typeCss(t).join(';')}}\n`;
  }
  return css;
}

// One line of values for a component, written the way DESIGN.md writes them.
const SHORT = {
  backgroundColor: 'bg', textColor: 'text', leadTextColor: 'lead', borderColor: 'border', borderWidth: 'border',
  borderBottomColor: 'rule', borderBottomWidth: 'rule', borderTopColor: 'rule', borderTopWidth: 'rule',
  rounded: 'radius', padding: 'pad', paddingX: 'pad-x', paddingY: 'pad-y', marginY: 'margin-y',
  boxShadow: 'ring', fontWeight: 'weight', typography: 'type', color: 'color',
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

const label = (name, value) =>
  `<div class="lab"><b>${esc(name)}</b>${value ? `<span>${esc(value)}</span>` : ''}</div>`;

function swatch(name) {
  const hex = color(name);
  return `<div class="sw"><div class="chip${isLight(hex) ? ' edge' : ''}" style="background:${hex}"></div>${label(name, hex)}</div>`;
}

// A specimen with its token name and values under it.
const spec = (name, html, value) =>
  `<div class="spec">${html}${label(name, value === undefined ? specLine(name) : value)}</div>`;

const logo = (file, style) => `<img src="${encodeURI(file)}" alt="" style="${style}">`;

// ---------- Page 1: color ----------

function colorPage() {
  const names = Object.keys(design.colors);
  const families = ['blue', 'red', 'gray'];
  const family = (f) =>
    names
      .filter((n) => n.startsWith(f) && !/\d/.test(n))
      .sort((a, b) => luminance(color(a)) - luminance(color(b)))
      .map(swatch)
      .join('');
  const canonical = `<div class="swrow">${family('blue')}${family('red')}</div><div class="swrow">${family('gray')}</div>`;

  const ramps = families
    .map((f) => {
      const steps = names.filter((n) => new RegExp(`^${f}-\\d+$`).test(n));
      return `<div class="ramp">${steps
        .map((n) => {
          const hex = color(n);
          return `<div><div class="chip${isLight(hex) ? ' edge' : ''}" style="background:${hex}"></div>${label(n, hex)}</div>`;
        })
        .join('')}</div>`;
    })
    .join('');

  // Semantic roles start at "primary". A new group starts at each key below.
  const groupStart = {
    primary: 'Brand',
    surface: 'Surfaces',
    'on-surface': 'Text',
    'border-subtle': 'Borders',
    info: 'States',
    'primary-hover': 'Interactive states',
  };
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
            const from = refName(design.colors[n]);
            return `<div class="role"><i class="dot${isLight(value) ? ' edge' : ''}" style="background:${value}"></i><b>${n}</b><span>${from || value}</span></div>`;
          })
          .join('')}</div>`
    )
    .join('');

  const textRoles = groups.find((g) => g.title === 'Text').keys;
  const onLight = textRoles.filter((n) => !n.includes('inverted'));
  const onDark = textRoles.filter((n) => n.includes('inverted'));
  const sample = (n) =>
    `<div style="color:${color(n)}" class="${n.startsWith('accent') ? 't-headline-md' : 't-body-sm'}">${n}</div>`;
  const textDemo = `<div class="pair">
    <div class="panel edge" style="background:${color('surface')}">${onLight.map(sample).join('')}</div>
    <div class="panel" style="background:${color('surface-inverted')}">${onDark.map(sample).join('')}</div>
  </div>`;

  return `
    <h2>Canonical colors</h2>${canonical}
    <h2>Tint ramps</h2>${ramps}
    <h2>Semantic roles</h2><div class="roles">${roles}</div>
    <h2>Text on surfaces</h2>${textDemo}`;
}

function dominance() {
  return `<div class="mix">
    <div style="border-color:${color('primary')}">Blue 60%</div>
    <div style="border-color:${color('secondary')}">Red 15%</div>
    <div style="border-color:${color('border')}">Neutral 25%</div>
  </div>`;
}

// ---------- Page 2: type, spacing, radius ----------

function typePage() {
  const heading = 'Exit ticket results';
  const body = 'Hand out three questions at the door.';
  const short = 'Due date';
  const rows = Object.entries(design.typography)
    .map(([name, t]) => {
      const text = name === 'display' ? 'Exit tickets' : /^(headline|title)/.test(name) ? heading : /^body/.test(name) ? body : name === 'caption' ? 'Source: OMS exit ticket pilot, fall 2026' : short;
      const value = `${t.fontFamily} ${t.fontWeight} · ${t.fontSize} / ${t.lineHeight}${t.letterSpacing ? ' · ' + t.letterSpacing : ''}`;
      const ink = /^(display|headline|title)/.test(name) ? color('primary-strong') : color('on-surface');
      return `<div class="trow">${label(name, value)}<div class="t-${name}" style="color:${ink}">${text}</div></div>`;
    })
    .join('');

  const spacing = Object.entries(design.spacing)
    .filter(([n]) => n !== 'container-max')
    .map(([n, v]) => `<div class="sp"><i style="width:${v};height:${v};background:${color('primary-subtle')}"></i>${label(n, v)}</div>`)
    .join('');

  const radius = Object.entries(design.rounded)
    .map(([n, v]) => `<div class="sp"><i style="width:56px;height:56px;border:1.5px solid ${color('primary')};border-radius:${v}"></i>${label(n, v)}</div>`)
    .join('');

  return `
    <h2>Type scale</h2><div class="tlist">${rows}</div>
    <h2>Spacing</h2><div class="sprow">${spacing}${label('container-max', design.spacing['container-max'])}</div>
    <h2>Radius</h2><div class="sprow">${radius}</div>`;
}

// ---------- Page 3: components ----------

function chart(width, height, onDark) {
  const series = [1, 2, 3, 4, 5, 6].map((i) => resolve(design.components[`chart-series-${i}`].color));
  const values = [82, 64, 51, 40, 28, 19];
  const axis = resolve(design.components['chart-axis'].color);
  const grid = resolve(design.components['chart-grid'].color);
  const left = 30, bottom = height - 22, top = 8;
  const plot = bottom - top;
  const step = (width - left - 8) / series.length;
  let svg = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Bar chart in the six series colors">`;
  for (const tick of [0, 25, 50, 75, 100]) {
    const y = bottom - (plot * tick) / 100;
    if (tick) svg += `<line x1="${left}" x2="${width - 8}" y1="${y}" y2="${y}" stroke="${grid}"/>`;
    svg += `<text x="${left - 6}" y="${y + 3}" text-anchor="end" font-size="9" fill="${axis}">${tick}</text>`;
  }
  series.forEach((fill, i) => {
    const h = (plot * values[i]) / 100;
    const x = left + step * i + step * 0.18;
    svg += `<rect x="${x}" y="${bottom - h}" width="${step * 0.64}" height="${h}" fill="${fill}"/>`;
    svg += `<text x="${x + step * 0.32}" y="${bottom + 13}" text-anchor="middle" font-size="9" fill="${axis}">${i + 1}</text>`;
  });
  svg += `<line x1="${left}" x2="${width - 8}" y1="${bottom}" y2="${bottom}" stroke="${axis}"/></svg>`;
  return svg;
}

function componentPage() {
  const c = design.components;
  const btn = (name, text, extra = '') => spec(name, `<span class="btn c-${extra || name} c-${name}">${text}</span>`);
  const buttons = `<div class="btns">
      ${btn('button-primary', 'Save rubric')}
      ${btn('button-primary-hover', 'Save rubric', 'button-primary')}
      ${btn('button-primary-active', 'Save rubric', 'button-primary')}
      ${btn('button-primary-disabled', 'Save rubric', 'button-primary')}
      ${spec('button-inverted', `<div class="darkpad" style="background:${color('surface-inverted')}"><span class="btn c-button-inverted">Open deck</span></div>`)}
      ${btn('button-secondary', 'Cancel')}
      ${btn('button-secondary-hover', 'Cancel', 'button-secondary')}
      ${btn('button-outlined', 'Preview quiz')}
      ${btn('button-outlined-hover', 'Preview quiz', 'button-outlined')}
      ${btn('button-ghost', 'Edit')}
      ${btn('button-destructive', 'Delete quiz')}
      ${btn('button-destructive-hover', 'Delete quiz', 'button-destructive')}
      ${btn('button-submit', 'Send RSVP')}
      ${btn('button-submit-hover', 'Send RSVP', 'button-submit')}
      ${btn('button-ghost-hover', 'Edit', 'button-ghost')}
    </div>`;

  const field = (state, value, note, noteClass) =>
    spec(
      state,
      `<div class="field"><div class="c-input-label">Due date</div><div class="c-input ${state === 'input' ? '' : 'c-' + state}">${value}</div><div class="c-${noteClass}">${note}</div></div>`
    );
  const inputs = `<div class="fields">
    ${field('input', 'March 6', 'Students see this date.', 'input-helper')}
    ${field('input-hover', 'March 6', 'Students see this date.', 'input-helper')}
    ${field('input-focus', 'March 6', 'Students see this date.', 'input-helper')}
    ${field('input-error', 'March 1', 'Choose a date after today.', 'input-error-message')}
    ${field('input-disabled', 'March 6', 'Students see this date.', 'input-helper')}
  </div>
  <div class="minor">${label('input-label', specLine('input-label'))}${label('input-helper', specLine('input-helper'))}${label('input-error-message', specLine('input-error-message'))}</div>`;

  const callouts = `<div class="two">
    ${spec('callout-info', '<div class="c-callout-info t-body-sm"><b>Heads up:</b> The Wi-Fi password changes Monday.</div>')}
    ${spec('callout-warning', '<div class="c-callout-warning t-body-sm"><b>Action required:</b> Re-enroll your devices before March 1.</div>')}
  </div>`;

  const row = (a, b) => `<div class="c-list-row t-body-sm lrow"><span>${a}</span><span>${b}</span></div>`;
  const lists = `<div class="two">
    ${spec('list-row', row('PD hours', 'Mar 6') + row('Staff survey', 'Apr 2') + row('Device re-enrollment', 'Mar 1'))}
    ${spec('section-divider', '<div class="t-body-sm">Staff survey</div><div class="c-section-divider"></div><div class="t-title-sm">Device re-enrollment</div>')}
  </div>`;

  const card = (cls, title, sub) => `<div class="c-card ${cls}"><div class="t-title-sm">${title}</div><div class="t-body-sm" style="color:${color('on-surface-muted')}">${sub}</div></div>`;
  const cards = `<div class="two">
    ${spec('card', card('', 'Exit ticket', '3 questions'))}
    ${spec('card-selected', card('c-card-selected', 'Quick poll', '1 question'))}
  </div>`;

  const th = (t, right) => `<th class="c-table-header"${right ? ' style="text-align:right"' : ''}>${t}</th>`;
  const tr = (cells, status, action) =>
    `<tr class="c-table-row${action ? ' c-table-row-action-required' : ''}"><td>${cells[0]}</td><td style="text-align:right">${cells[1]}</td><td class="c-status-text ${status}"${action ? ' style="color:inherit"' : ''}>${cells[2]}</td></tr>`;
  const table = `<table>
      <thead><tr>${th('Building')}${th('Devices', true)}${th('Status')}</tr></thead>
      <tbody>
        ${tr(['Schumann Elementary', '412', 'Active'], 'c-status-text-active')}
        ${tr(['Orono Intermediate', '388', 'Pending'], '')}
        ${tr(['Orono Middle School', '520', 'Action required'], '', true)}
        ${tr(['Orono High School', '760', 'Active'], 'c-status-text-active')}
      </tbody>
    </table>
    <div class="minor">${['table-header', 'table-row', 'table-row-action-required'].map((n) => label(n, specLine(n))).join('')}</div>`;

  const status = `<div class="flow free">
    ${spec('status-text', '<span class="c-status-text">Pending</span>')}
    ${spec('status-text-active', '<span class="c-status-text c-status-text-active">Active</span>')}
    ${spec('status-text-action', '<span class="c-status-text c-status-text-action">Action required</span>')}
  </div>`;

  const chips = `<div class="flow free">
    ${spec('chip', '<span class="btn c-chip">Grade 6</span>')}
    ${spec('chip-selected', '<span class="btn c-chip c-chip-selected">Grade 7</span>')}
  </div>`;

  const nav = spec(
    'nav-bar',
    `<div class="c-nav-bar nav">${logo('Primary Logo.png', 'height:40px')}<span class="c-nav-link c-nav-link-active">Quizzes</span><span class="c-nav-link">Rubrics</span><span class="c-nav-link">Results</span></div>`
  ) + `<div class="minor">${label('nav-link', specLine('nav-link'))}${label('nav-link-active', specLine('nav-link-active'))}</div>`;

  const series = [1, 2, 3, 4, 5, 6]
    .map((i) => {
      const raw = c[`chart-series-${i}`].color;
      return `<div class="sw"><div class="chip" style="background:${resolve(raw)};height:20px"></div>${label('chart-series-' + i, refName(raw))}</div>`;
    })
    .join('');
  const g0 = c['chart-gradient-start'].color, g1 = c['chart-gradient-end'].color;
  const charts = `<div class="swrow six">${series}</div>
    <div class="chip" style="height:20px;margin-top:12px;background:linear-gradient(90deg,${resolve(g0)},${resolve(g1)})"></div>
    <div class="ends">${label('chart-gradient-start', refName(g0))}${label('chart-gradient-end', refName(g1))}</div>
    <div style="margin-top:14px">${chart(720, 200)}</div>
    <div class="minor">${label('chart-axis', refName(c['chart-axis'].color))}${label('chart-grid', refName(c['chart-grid'].color))}</div>`;

  return {
    a: `<h2>Buttons</h2>${buttons}<h2>Inputs</h2>${inputs}<h2>Callouts</h2>${callouts}<div class="two"><div><h2>Status</h2>${status}</div><div><h2>Filter chips</h2>${chips}</div></div>`,
    b: `<h2>Lists and sections</h2>${lists}<h2>Cards</h2>${cards}<h2>Tables</h2>${table}<h2>Navigation</h2>${nav}`,
    charts: `<h2>Chart colors</h2>${charts}<h2>Dominance</h2>${dominance()}`,
  };
}

// ---------- LOGOS and DOCUMENT (sizes from SKILL.md) ----------

function logoPage() {
  const dark = color('surface-inverted');
  const files = `<div class="logos">
    <div><div class="lbox">${logo('Primary Logo.png', 'width:2.4in')}</div>${label('Primary Logo.png', 'Default')}</div>
    <div><div class="lbox">${logo('Secondary Logo.png', 'width:1in')}</div>${label('Secondary Logo.png', 'Square and compact spaces')}</div>
    <div><div class="lbox">${logo('Torch Icon.png', 'width:1in')}</div>${label('Torch Icon.png', 'Favicon, small accent')}</div>
    <div><div class="lbox">${logo('OPS Tech Logo 2.png', 'width:1.6in')}</div>${label('OPS Tech Logo 2.png', 'On request only')}</div>
  </div>`;
  const onDark = `<div class="logos three">
    <div><div class="lbox" style="background:${dark}">${logo('Secondary Logo.png', 'width:0.9in')}</div>${label('Secondary Logo.png', 'On blue-900')}</div>
    <div><div class="lbox" style="background:${dark}"><div style="background:#fff;border-radius:8px;padding:10px 14px;line-height:0">${logo('Primary Logo.png', 'width:1.7in')}</div></div>${label('Primary Logo.png', 'On blue-900, white plate')}</div>
    <div><div class="lbox" style="background:${dark}">${logo('Torch Icon.png', 'width:0.9in')}</div>${label('Torch Icon.png', 'On blue-900')}</div>
  </div>`;
  const minimum = `<div class="flow" style="align-items:flex-end">
    <div>${logo('Primary Logo.png', 'width:80px')}${label('Screen minimum', '80px wide')}</div>
    <div>${logo('Primary Logo.png', 'width:0.75in')}${label('Print minimum', '0.75in wide')}</div>
  </div>`;

  const blue = color('blue'), blueDark = color('blue-dark'), redLight = color('red-light'), gray = color('gray'), ink = color('gray-dark');
  const doc = `<div class="docwrap"><div class="doc">
      ${logo('Primary Logo.png', 'width:2.5in')}
      <div style="font:700 26pt/1.2 Lexend;color:${blue};margin-top:0.35in">Exit tickets</div>
      <div style="font:700 22pt/1.25 Lexend;color:${blueDark};margin-top:0.3in">Results from the fall pilot</div>
      <p>Twelve teachers handed out three questions at the door each day for five weeks. Most students answered every day.</p>
      <div style="font:700 18pt/1.3 Lexend;color:${redLight};margin-top:0.25in">Write your own</div>
      <p>Ask one question about today's lesson and one about the lesson before it. Sort the answers into piles before the next class.</p>
      <div class="c-callout-info" style="margin-top:0.18in"><b>Due Friday:</b> Submit your PD hours in Frontline.</div>
      <div style="font:700 14pt/1.3 Lexend;color:${gray};margin-top:0.25in">Sessions</div>
      <table style="font-size:11pt;margin-top:6px">
        <thead><tr><th class="c-table-header" style="font-size:11pt">Building</th><th class="c-table-header" style="font-size:11pt">Date</th></tr></thead>
        <tbody>
          <tr class="c-table-row" style="font-size:11pt"><td>Orono Middle School</td><td>March 4</td></tr>
          <tr class="c-table-row" style="font-size:11pt"><td>Orono High School</td><td>March 11</td></tr>
        </tbody>
      </table>
      <div style="position:absolute;bottom:0.5in;left:1in;right:1in;font:400 9pt Roboto;color:${gray};text-align:center">1</div>
    </div></div>`;
  const docSpecs = [
    ['Header logo', 'Primary Logo.png · 2.5in wide'],
    ['Title', 'Lexend 700 · 26pt · blue'],
    ['H1', 'Lexend 700 · 22pt · blue-dark'],
    ['H2', 'Lexend 700 · 18pt · red-light'],
    ['H3', 'Lexend 700 · 14pt · gray'],
    ['Body', 'Roboto 400 · 11pt · gray-dark'],
    ['Callout', 'callout-info'],
    ['Table', 'table-header · table-row'],
    ['Footer', 'Roboto 400 · 9pt · gray'],
  ]
    .map(([a, b]) => `<div class="docspec">${label(a, b)}</div>`)
    .join('');

  return {
    logos: `<h2>Logos</h2>${files}${onDark}${minimum}`,
    document: `<h2>Document</h2><div class="docrow">${doc}<div style="flex:1">${docSpecs}${label('Scale', '65% of letter size')}</div></div>`,
  };
}

// ---------- SLIDES (sizes and color roles from SKILL.md) ----------

function slidePage() {
  const bg = color('surface-inverted'), raised = color('surface-raised');
  const muted = color('on-surface-inverted-muted'), subtle = color('on-surface-inverted-subtle');
  const accent = color('accent-on-inverted'), line = color('divider-inverted');
  const title = (t, size = 32) => `<div style="font:700 ${size}pt/1.15 Lexend;position:absolute;left:0.6in;top:0.5in;right:0.6in">${t}</div>`;
  const source = (t, c = subtle) => `<div style="position:absolute;left:0.6in;bottom:0.35in;font:400 10pt Roboto;color:${c}">${t}</div>`;
  const bullets = (items) => `<ul style="margin:0;padding-left:0.3in;font:400 20pt/1.5 Roboto">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  const cover = (heading) => `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
      ${logo('Secondary Logo.png', 'width:1.75in')}
      <div style="font:700 48pt/1.1 Lexend;margin-top:0.4in">${heading}</div>
      <div style="font:400 24pt Roboto;color:${muted};margin-top:0.15in">OMS staff PD</div>
      <div style="font:400 18pt Roboto;color:${muted};margin-top:0.1in">March 4, 2027</div>
    </div>`;

  const slides = [
    ['Title slide', 'blue-900 · Secondary Logo 1.75in · title 48pt · subtitle 24pt blue-100', bg, '#fff', cover('Exit tickets')],
    ['Section divider', 'blue-700 · title 44pt', raised, '#fff', `<div style="height:100%;display:flex;align-items:center;padding:0 0.6in;font:700 44pt Lexend">Try it this week</div>`],
    [
      'Agenda',
      'blue-900 · title 32pt · rows 20pt · hairlines blue-600',
      bg,
      '#fff',
      title('Agenda') +
        `<div style="position:absolute;left:0.6in;right:0.6in;top:1.8in;font:400 20pt Roboto">${[
          ['Results from the fall pilot', '3:10'],
          ['Three sample questions', '3:20'],
          ['Write your own', '3:35'],
        ]
          .map(([a, b]) => `<div style="display:flex;justify-content:space-between;padding:0.22in 0;border-bottom:1px solid ${line}"><span>${a}</span><span style="color:${muted}">${b}</span></div>`)
          .join('')}</div>`,
    ],
    [
      'Content, two columns',
      'blue-900 · claim title 32pt · body 20pt · hairline blue-600 · source 10pt #8da0c7',
      bg,
      '#fff',
      title("Exit tickets take 3 minutes and show who's lost") +
        `<div style="position:absolute;left:0.6in;top:1.8in;width:5.6in">${bullets(['Three questions at the door', 'Two minutes to sort the answers'])}</div>
         <div style="position:absolute;left:6.65in;top:1.8in;height:4.8in;border-left:1px solid ${line}"></div>
         <div style="position:absolute;left:7.1in;top:1.8in;width:5.6in">${bullets(['Start the next class with the not-yet pile', 'Keep the questions for the unit review'])}</div>` +
        source('Source: OMS exit ticket pilot, fall 2026'),
    ],
    [
      'Content, one number',
      'blue-900 · number 96pt red-400 · body 20pt',
      bg,
      '#fff',
      title('Most students answered every day') +
        `<div style="position:absolute;left:0.6in;top:2.1in;font:700 96pt/1 Lexend;color:${accent}">84%</div>
         <div style="position:absolute;left:0.6in;top:3.9in;font:400 20pt Roboto;color:${muted}">of 212 students answered all five days</div>` +
        source('Source: OMS exit ticket pilot, fall 2026'),
    ],
    [
      'Content, featured surface',
      'blue-900 · one blue-700 surface · radius 12px',
      bg,
      '#fff',
      title('Chromebook repairs dropped 40% after the case swap') +
        `<div style="position:absolute;left:0.6in;top:1.9in;width:5.2in;font:400 20pt/1.5 Roboto">New cases went on every student device in August 2026.</div>
         <div style="position:absolute;left:6.6in;top:1.9in;width:6.1in;height:4.5in;background:${raised};border-radius:12px;padding:0.4in;display:flex;gap:0.6in;align-items:flex-end">
           ${[['2025', 310], ['2026', 186]]
             .map(([y, n]) => `<div style="flex:1;text-align:center;font:400 18pt Roboto"><div style="font:700 28pt Lexend">${n}</div><div style="height:${(n / 310) * 2.4}in;background:#fff;margin:0.1in 0"></div><div style="color:${muted}">${y}</div></div>`)
             .join('')}
         </div>` +
        source('Source: OMS help desk tickets, 2025 and 2026'),
    ],
    [
      'Light slide',
      'white · title blue-900 · table-header · table-row',
      '#fff',
      color('on-surface'),
      `<div style="color:${color('primary-strong')}">${title('The middle school has 520 devices left to re-enroll')}</div>
       <table style="position:absolute;left:0.6in;top:2in;width:12.1in;font-size:20pt">
         <thead><tr><th class="c-table-header" style="font-size:20pt">Building</th><th class="c-table-header" style="font-size:20pt;text-align:right">Devices left</th><th class="c-table-header" style="font-size:20pt">Status</th></tr></thead>
         <tbody>
           <tr class="c-table-row" style="font-size:20pt"><td>Schumann Elementary</td><td style="text-align:right">0</td><td>Done</td></tr>
           <tr class="c-table-row" style="font-size:20pt"><td>Orono Intermediate</td><td style="text-align:right">0</td><td>Done</td></tr>
           <tr class="c-table-row c-table-row-action-required" style="font-size:20pt"><td>Orono Middle School</td><td style="text-align:right">520</td><td>Action required</td></tr>
           <tr class="c-table-row" style="font-size:20pt"><td>Orono High School</td><td style="text-align:right">0</td><td>Done</td></tr>
         </tbody>
       </table>` + source('Source: OPS device management console, February 2027', color('on-surface-subtle')),
    ],
    ['Closing slide', 'Same layout as the title slide', bg, '#fff', cover('Try one this week')],
  ];

  return `<h2>Slides</h2><div class="slides">${slides
    .map(
      ([name, value, background, ink, html]) =>
        `<div><div class="frame${background === '#fff' ? ' edge' : ''}"><div class="slide" style="background:${background};color:${ink}">${html}</div></div>${label(name, value)}</div>`
    )
    .join('')}</div>`;
}

// ---------- Page shell ----------

const components = componentPage();
const logos = logoPage();
const pages = [
  ['Color', colorPage()],
  ['Type, spacing and radius', typePage()],
  ['Components', components.a],
  ['Components', components.b],
  ['Logos and charts', logos.logos + components.charts],
  ['Document', logos.document],
  ['Slides', slidePage()],
];

const g = (n) => color(n);
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OPS Tech stylesheet</title>
<!-- Generated from ../DESIGN.md by scripts/render-stylesheet.js. Edit the script or DESIGN.md, then re-run it. -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap">
<style>
@page { size: letter; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; background: #fff; }
body { font: 400 9pt/1.4 Roboto, Arial, sans-serif; color: ${g('on-surface')}; }
.page { width: 8.5in; height: 11in; padding: 0.45in 0.5in 0.4in; display: flex; flex-direction: column; overflow: hidden; break-after: page; }
.page > header, .page > footer { display: flex; justify-content: space-between; font-size: 8pt; color: ${g('on-surface-muted')}; }
.page > footer { margin-top: auto; padding-top: 8px; }
.page > header b { font: 600 8pt Lexend; color: ${g('primary-strong')}; }
h2 { font: 700 13pt/1.2 Lexend; color: ${g('primary-strong')}; margin: 16px 0 8px; }
h3 { font: 600 9pt/1.2 Lexend; color: ${g('on-surface')}; margin: 0 0 3px; }
p { margin: 6px 0 0; }
table { border-collapse: collapse; width: 100%; }
th { text-align: left; }
td { padding: inherit; padding-left: 12px; padding-right: 12px; }

.lab { margin-top: 4px; font-size: 7pt; line-height: 1.3; }
.lab b { display: block; font-weight: 500; color: ${g('on-surface')}; }
.lab span { display: block; color: ${g('on-surface-muted')}; }
.edge { box-shadow: inset 0 0 0 1px ${g('border')}; }
.chip { height: 30px; border-radius: 6px; }

.swrow { display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; margin-bottom: 8px; }
.swrow.six { margin: 0; grid-template-columns: repeat(6, 1fr); }
.ramp { display: grid; grid-template-columns: repeat(11, 1fr); margin-bottom: 8px; }
.ramp .chip { border-radius: 0; height: 30px; }
.roles { columns: 4; column-gap: 18px; }
.role b { white-space: nowrap; }
.group { break-inside: avoid; margin-bottom: 10px; }
.role { display: flex; align-items: center; gap: 6px; padding: 2.5px 0; border-bottom: 1px solid ${g('divider')}; font-size: 7pt; }
.role b { font-weight: 500; }
.role span { margin-left: auto; white-space: nowrap; color: ${g('on-surface-muted')}; }
.dot { width: 11px; height: 11px; border-radius: 3px; flex: none; }
.pair { display: grid; grid-template-columns: 2fr 3fr; gap: 14px; }
.pair .panel div { white-space: nowrap; }
.panel { border-radius: 8px; padding: 8px 14px; }
.mix { display: grid; grid-template-columns: 60fr 15fr 25fr; font-size: 7.5pt; }
.mix div { border-top: 8px solid; padding-top: 4px; }

.trow { display: grid; grid-template-columns: 1.5in 1fr; gap: 14px; align-items: center; padding: 4px 0; border-bottom: 1px solid ${g('divider')}; }
.trow .lab { margin: 0; }
.sprow { display: flex; gap: 22px; align-items: flex-end; }
.sp i { display: block; }

.flow { display: flex; flex-wrap: wrap; gap: 12px 15px; align-items: flex-start; margin-bottom: 12px; }
.flow .spec { width: 1.72in; }
.flow.free .spec { width: auto; }
.btn { display: inline-block; }
.btns { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px 12px; align-items: start; }
.darkpad { padding: 12px; border-radius: 8px; display: inline-block; }
.fields { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.field .c-input { margin: 4px 0; }
.minor { display: flex; gap: 26px; margin-top: 4px; }
.minor .lab { flex: 1; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
.lrow { display: flex; justify-content: space-between; }
.nav { display: flex; align-items: center; gap: 28px; }
.nav .c-nav-link-active { padding-bottom: 4px; }
.ends { display: flex; justify-content: space-between; }
.ends .lab:last-child { text-align: right; }

.logos { display: grid; grid-template-columns: 2.6in 1fr 1fr 1.8in; gap: 16px; margin-bottom: 14px; }
.logos.three { grid-template-columns: 1fr 1.4fr 1fr; }
.lbox { height: 1.15in; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
.logos:not(.three) .lbox { box-shadow: inset 0 0 0 1px ${g('divider')}; }
.docrow { display: flex; gap: 0.35in; align-items: flex-start; }
.docwrap { width: 5.525in; height: 7.15in; flex: none; box-shadow: inset 0 0 0 1px ${g('border')}; }
.doc { width: 8.5in; height: 11in; padding: 0.8in 1in; zoom: 0.65; position: relative; font: 400 11pt/1.5 Roboto; }
.doc p { margin: 8px 0 0; }
.docspec { padding: 3px 0 6px; border-bottom: 1px solid ${g('divider')}; }

.slides { display: grid; grid-template-columns: 3.5in 3.5in; justify-content: space-between; gap: 7px; }
.frame { width: 3.5in; height: 1.969in; overflow: hidden; border-radius: 4px; }
.slide { width: 13.333in; height: 7.5in; zoom: 0.2625; position: relative; }

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

fs.writeFileSync(path.join(resources, 'stylesheet.html'), html);

// ---------- Print ----------

(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(resources, 'stylesheet.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(() =>
    [...document.querySelectorAll('.page')]
      .map((p, i) => (p.scrollHeight > p.clientHeight + 1 ? `page ${i + 1} overflows by ${p.scrollHeight - p.clientHeight}px` : null))
      .filter(Boolean)
  );
  if (overflow.length) console.warn(overflow.join('\n'));
  await page.pdf({
    path: path.join(resources, 'OPS Tech Stylesheet.pdf'),
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
})();
