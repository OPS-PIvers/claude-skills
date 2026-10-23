#!/usr/bin/env python3
"""Build the OPS Figures gallery: every figure as its own page, plus an index of them all.

    python gallery/build.py [OUT_DIR] [--shots]      (default OUT_DIR: _site)

Figures come from two places:
  - the ops-figures skill's examples (plugins/pauls-skills/skills/ops-figures/assets/examples), and
  - gallery/figures/: drop more figures here. A page that loads <script src="core.js"> is built with the skill's
    build.py; a page that is already self-contained (a built OUT.html, or a figure saved from SpartBoard) is copied.
A figure in gallery/figures/ with the same file name as an example replaces it.

--shots takes a screenshot of each figure with headless Chrome for its card (set CHROME to the browser's path if it
isn't found), cropped to the drawing and saved as WebP when Pillow is installed. Without it, or if Chrome isn't
there, the cards show the figure's title only.
"""
import html, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILL = os.path.join(ROOT, 'plugins', 'pauls-skills', 'skills', 'ops-figures')
EXAMPLES = os.path.join(SKILL, 'assets', 'examples')
EXTRA = os.path.join(ROOT, 'gallery', 'figures')
SKILL_BUILD = os.path.join(SKILL, 'scripts', 'build.py')
CORE_TAG = re.compile(r'<script\s+src=["\'](?:\./)?core\.js["\']\s*>\s*</script>')

def meta(page, name):
    """Fig. number, title and hint from the figure's mountFigure({...}) call."""
    def field(key):
        m = re.search(key + r"""\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1""", page)
        return m.group(2).replace("\\'", "'").replace('\\"', '"') if m else ''
    title = field('title') or (re.search(r'<title>(.*?)</title>', page, re.S) or [None, name])[1]
    return {'fig': field('fig'), 'title': title.strip(), 'hint': field('hint')}

def find_chrome():
    for c in [os.environ.get('CHROME'), shutil.which('google-chrome'), shutil.which('chromium'), shutil.which('chrome'),
              r'C:\Program Files\Google\Chrome\Application\chrome.exe',
              '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']:
        if c and os.path.exists(c): return c

def shoot(chrome, page_path, png_path, profile):
    url = 'file:///' + os.path.abspath(page_path).replace('\\', '/').lstrip('/') + '?present=0&steps=0&settings=0'
    subprocess.run([chrome, '--headless=new', '--hide-scrollbars', '--no-sandbox', f'--user-data-dir={profile}',
                    '--window-size=1000,720', '--virtual-time-budget=2500', f'--screenshot={os.path.abspath(png_path)}', url],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=90)
    if not os.path.exists(png_path): return None
    try:                                    # crop to the drawing (no buttons, stats or caption) and shrink to a WebP
        from PIL import Image
    except ImportError:
        return os.path.basename(png_path)
    im = Image.open(png_path); w, h = im.size
    im = im.crop((int(w*.19), int(h*.08), int(w*.87), int(h*.86))).convert('RGB')
    im.thumbnail((720, 720))
    webp = png_path[:-4] + '.webp'; im.save(webp, quality=80); os.remove(png_path)
    return os.path.basename(webp)

def card(f):
    no = f'<span class="no">Fig. {html.escape(f["fig"])}</span>' if f['fig'] else ''
    img = f'<img src="{f["shot"]}" alt="" loading="lazy">' if f['shot'] else '<div class="noshot"></div>'
    hint = f'<p class="hint">{html.escape(f["hint"][:1].upper() + f["hint"][1:])}.</p>' if f['hint'] else ''
    return f'''    <li class="card">
      <a class="open" href="{f["slug"]}.html">{img}<h2>{no}{html.escape(f["title"])}</h2></a>
      {hint}
      <p class="ways"><a href="{f["slug"]}.html?present=0&amp;steps=0">Explore freely</a></p>
    </li>'''

INDEX = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>OPS Figures</title>
<meta name="description" content="Interactive teaching figures of everyday machines, from Orono Public Schools.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@500;600;700&family=Roboto:wght@400;500&display=swap">
<style>
  :root{--bg:#f3f3f3;--ink:#1d2a5d;--blue:#2d3f89;--blue-lighter:#eaecf5;--red-light:#c13435;--text:#333;--muted:#666;--rule:#ccc;
    --head:Lexend,system-ui,sans-serif;--body:Roboto,system-ui,sans-serif}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 var(--body)}
  main{max-width:1180px;margin:0 auto;padding:40px 16px 56px}
  header{margin-bottom:28px}
  header h1{font:700 clamp(28px,5vw,40px)/1.15 var(--head);color:var(--ink);margin:0 0 8px}
  header p{margin:0;max-width:62ch;color:var(--muted)}
  ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
  .card{background:#fff;border:1px solid var(--blue-lighter);border-radius:10px;overflow:hidden;display:flex;flex-direction:column}
  .card .open{color:inherit;text-decoration:none;display:block}
  .card img,.noshot{display:block;width:100%;height:auto;aspect-ratio:680/562;object-fit:cover;background:var(--bg);border-bottom:1px solid var(--blue-lighter)}
  .card h2{font:600 19px/1.3 var(--head);color:var(--ink);margin:14px 16px 4px}
  .card .no{color:var(--red-light);margin-right:8px}
  .card .open:hover h2{text-decoration:underline;text-underline-offset:3px}
  .card .open:focus-visible{outline:3px solid var(--blue);outline-offset:-3px}
  .hint{margin:0 16px;color:var(--muted);font-size:14px}
  .ways{margin:auto 0 0;padding:12px 16px 14px;display:flex;gap:16px;font:500 14px var(--head)}
  .ways a{color:var(--blue)}
  footer{margin-top:40px;font-size:13px;color:var(--muted)}
  footer a{color:inherit}
</style></head>
<body><main>
  <header>
    <h1>OPS Figures</h1>
    <p>Interactive drawings of everyday machines. Each one opens ready to project: Next (or the → key) runs the real
      steps in order, and the buttons work in any order. Explore freely opens it without the step-by-step bar.</p>
  </header>
  <ul>
__CARDS__
  </ul>
  <footer>Orono Public Schools. Based on <a href="https://april-zhu.com/colorfigures">Colorfigures</a> by April Zhu (MIT).</footer>
</main></body></html>
'''

def main(argv):
    shots = '--shots' in argv
    args = [a for a in argv[1:] if a != '--shots']
    out = os.path.abspath(args[0] if args else os.path.join(ROOT, '_site'))
    shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
    sources = {}
    for d in (EXAMPLES, EXTRA):
        if os.path.isdir(d):
            for n in sorted(os.listdir(d)):
                p = os.path.join(d, n)             # only real files in the folder: no links out of the repo
                if n.lower().endswith(('.html', '.htm')) and os.path.isfile(p) and not os.path.islink(p): sources[n] = p
    chrome = find_chrome() if shots else None
    if shots and not chrome: print('Chrome not found: building without screenshots')
    figs = []
    for name, src in sources.items():
        slug = re.sub(r'[^a-z0-9]+', '-', os.path.splitext(name)[0].lower()).strip('-')
        dest = os.path.join(out, slug + '.html')
        page = open(src, encoding='utf-8').read()
        if CORE_TAG.search(page):
            subprocess.run([sys.executable, SKILL_BUILD, src, dest], check=True, stdout=subprocess.DEVNULL)
        else:
            shutil.copyfile(src, dest)
        f = dict(meta(page, slug), slug=slug, shot=None)
        if chrome: f['shot'] = shoot(chrome, dest, os.path.join(out, slug + '.png'), os.path.join(out, '.chrome-' + slug))
        shutil.rmtree(os.path.join(out, '.chrome-' + slug), ignore_errors=True)
        figs.append(f)
        print(f'  {slug}.html  Fig. {f["fig"] or "–"}  {f["title"]}' + ('  (screenshot)' if f['shot'] else ''))
    figs.sort(key=lambda f: (f['fig'] == '', f['fig'], f['title']))
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(INDEX.replace('__CARDS__', '\n'.join(map(card, figs))))
    open(os.path.join(out, '.nojekyll'), 'w').close()
    print(f'wrote {len(figs)} figures and index.html to {out}')

if __name__ == '__main__':
    main(sys.argv)
