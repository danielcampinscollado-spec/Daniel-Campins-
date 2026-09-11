from pathlib import Path
p=Path('client-admin-premium.js')
s=p.read_text(encoding='utf-8')
old="render(id,'training')};window.dccRoutineHistory"
new="render(id,'training')}};window.dccRoutineHistory"
if s.count(old)!=1:
    raise SystemExit(f'expected one routine save closure, found {s.count(old)}')
p.write_text(s.replace(old,new,1),encoding='utf-8')
print('client admin save closure fixed')
