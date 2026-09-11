from pathlib import Path

# Repair the missing closure introduced in the routine-save audit patch.
p=Path('client-admin-premium.js')
s=p.read_text(encoding='utf-8')
old="render(id,'training')};window.dccRoutineHistory"
new="render(id,'training')}};window.dccRoutineHistory"
if s.count(old)!=1:
    raise SystemExit(f'client admin: expected one routine save closure, found {s.count(old)}')
p.write_text(s.replace(old,new,1),encoding='utf-8')

# Repair the appData arrow-function closure in the coach state layer.
p=Path('coach-panel-state-v10.js')
s=p.read_text(encoding='utf-8')
old="const appData=()=>{try{return data||{}}catch(e){return window.data||{}};"
new="const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};"
if s.count(old)!=1:
    raise SystemExit(f'coach state: expected one appData closure, found {s.count(old)}')
p.write_text(s.replace(old,new,1),encoding='utf-8')

print('critical JavaScript syntax closures fixed')
