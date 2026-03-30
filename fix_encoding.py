import os, glob

base = os.path.dirname(os.path.abspath(__file__))
patterns = ['**/*.css', '**/*.js', '**/*.xml', '**/*.html']
fixes = 0

# Double-encoded em-dash: UTF-8 bytes e2 80 94 read as cp1252 => chars U+00E2 U+20AC U+201D
# then re-encoded as UTF-8 => c3 a2 e2 82 ac e2 80 9d
MOJIBAKE_EMDASH = '\u00e2\u20ac\u201d'   # â€"
CORRECT_EMDASH = '\u2014'                 # —

# Double-encoded BOM: UTF-8 bytes ef bb bf read as cp1252 => chars U+00EF U+00BB U+00BF
# then re-encoded as UTF-8 => c3 af c2 bb c2 bf
MOJIBAKE_BOM = '\u00ef\u00bb\u00bf'       # ï»¿

for pat in patterns:
    for fpath in glob.glob(os.path.join(base, pat), recursive=True):
        if 'fix_encoding' in fpath or 'check_bytes' in fpath:
            continue
        with open(fpath, 'r', encoding='utf-8') as f:
            text = f.read()
        changed = False
        if text.startswith(MOJIBAKE_BOM):
            text = text[len(MOJIBAKE_BOM):]
            changed = True
        if text.startswith('\ufeff'):
            text = text[1:]
            changed = True
        if MOJIBAKE_EMDASH in text:
            text = text.replace(MOJIBAKE_EMDASH, CORRECT_EMDASH)
            changed = True
        if changed:
            with open(fpath, 'w', encoding='utf-8', newline='') as f:
                f.write(text)
            fixes += 1
            print(f'FIXED: {os.path.relpath(fpath, base)}')

print(f'\nDone. Fixed {fixes} file(s).')
