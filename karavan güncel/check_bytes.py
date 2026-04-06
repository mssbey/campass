import os
base = r'c:\Users\PC\Desktop\karavan güncel'
fp = os.path.join(base, 'caravan_theme', 'static', 'src', 'css', 'style.css')
with open(fp, 'rb') as f:
    d = f.read(120)
print('Raw bytes:', ' '.join(f'{b:02x}' for b in d))
print()
print('As latin-1:', d.decode('latin-1'))
