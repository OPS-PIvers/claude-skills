#!/usr/bin/env python3
"""Turn an OPS Figures page into one self-contained HTML file.

    python build.py figure.html [OUT.html] [--strip-comments]      (python3 on Mac/Linux)

figure.html loads the engine with <script src="core.js"></script> (handy while working: put a copy of
assets/core.js next to it). The build replaces that tag with the engine itself, so OUT.html (default:
figure.built.html) runs on its own — open it from disk, email it, host it anywhere.

--strip-comments drops the comments and blank lines from every inline script (about 10–15% smaller, for a
SpartBoard mini-app near its limit). Strings, template literals and regexes are left exactly as they are.
"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CORE = os.path.join(HERE, '..', 'assets', 'core.js')

# After one of these (or at the start, or after a keyword below) a / starts a regex, not a division.
REGEX_AFTER = set('(,=:[!&|?{};+-*%<>~^}')
REGEX_WORDS = {'return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete', 'void', 'throw', 'yield', 'await'}

def strip_js(src):
    """Remove // and /* */ comments and blank lines from JavaScript, outside strings, templates and regexes."""
    out, i, n = [], 0, len(src)
    tpl = []                                   # brace depth inside each open ${ … } of a template literal
    last, word = '', ''                        # last code character and last identifier, for regex-or-division

    def read_quoted(j, q):                     # j at the opening quote; returns the index after the closing one
        j += 1
        while j < n and src[j] != q:
            j += 2 if src[j] == '\\' else 1
        return j + 1

    def read_template(j):                      # j just after ` or }; returns (end, closed by ` rather than ${)
        while j < n:
            c = src[j]
            if c == '\\': j += 2; continue
            if c == '`': return j + 1, True
            if c == '$' and src[j+1:j+2] == '{': return j + 2, False
            j += 1
        return j, True

    while i < n:
        c, d = src[i], src[i+1:i+2]
        if c == '/' and d == '/':
            i = src.find('\n', i)
            i = n if i < 0 else i
            continue
        if c == '/' and d == '*':
            i = src.find('*/', i + 2)
            i = n if i < 0 else i + 2
            if i < n and not src[i].isspace() and out and not out[-1].isspace(): out.append(' ')
            continue
        if c.isspace():
            j = i
            while j < n and src[j].isspace(): j += 1
            ws = src[i:j]
            if '\n' in ws:                     # trims the line end, the next line's indent and blank lines
                while out and out[-1].strip(' \t') == '': out.pop()
                if out: out.append('\n')
            elif out and out[-1] != '\n': out.append(ws)
            i = j
            continue
        if c in '\'"':
            j = read_quoted(i, c); out.append(src[i:j]); i = j; last, word = c, ''
            continue
        if c == '`' or (c == '}' and tpl and tpl[-1] == 0):
            if c == '}': tpl.pop()
            j, closed = read_template(i + 1)
            if not closed: tpl.append(0)
            out.append(src[i:j]); i = j; last, word = '`', ''
            continue
        if c == '/' and (last in REGEX_AFTER or last == '' or word in REGEX_WORDS):
            j, cls = i + 1, False
            while j < n and (cls or src[j] != '/'):
                if src[j] == '\\': j += 1
                elif src[j] == '[': cls = True
                elif src[j] == ']': cls = False
                j += 1
            j += 1
            while j < n and (src[j].isalnum() or src[j] == '_'): j += 1
            out.append(src[i:j]); i = j; last, word = '/', ''
            continue
        if c.isalnum() or c in '_$':
            j = i
            while j < n and (src[j].isalnum() or src[j] in '_$'): j += 1
            word = src[i:j]; out.append(word); i = j; last = word[-1]
            continue
        if tpl:
            if c == '{': tpl[-1] += 1
            elif c == '}': tpl[-1] -= 1
        out.append(c); i += 1; last, word = c, ''
    return ''.join(out).strip('\n')

def strip_scripts(page):
    def one(m):
        if re.search(r'\bsrc\s*=', m.group(1)): return m.group(0)
        return '<script' + m.group(1) + '>\n' + strip_js(m.group(2)) + '\n</script>'
    return re.sub(r'<script(\b[^>]*)>(.*?)</script>', one, page, flags=re.S | re.I)

def main(argv):
    strip = '--strip-comments' in argv
    args = [a for a in argv[1:] if a != '--strip-comments']
    if not args:
        sys.exit(__doc__)
    src = args[0]
    out = args[1] if len(args) > 1 else re.sub(r'\.html?$', '', src) + '.built.html'
    page = open(src, encoding='utf-8').read()
    core = open(CORE, encoding='utf-8').read()
    tag = re.search(r'<script\s+src=["\'](?:\./)?core\.js["\']\s*>\s*</script>', page)
    if not tag:
        sys.exit('no <script src="core.js"></script> in ' + src)
    if '</script' in core.lower():
        sys.exit('core.js contains "</script" and cannot be inlined')
    page = page[:tag.start()] + '<script>\n' + core + '\n</script>' + page[tag.end():]
    if strip:
        page = strip_scripts(page)
    open(out, 'w', encoding='utf-8').write(page)
    print(f'wrote {out}' + (f' ({len(page):,} characters)' if strip else ''))

if __name__ == '__main__':
    main(sys.argv)
