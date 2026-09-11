from pathlib import Path

patches=[
    ('client-admin-premium.js',"render(id,'training')};window.dccRoutineHistory","render(id,'training')}};window.dccRoutineHistory",'client admin routine save closure'),
    ('coach-panel-state-v10.js',"const appData=()=>{try{return data||{}}catch(e){return window.data||{}};","const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};",'coach state appData closure'),
    ('client-profile-preferences-v1.js',"const appData=()=>{try{return data||{}}catch(e){return window.data||{}};","const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};",'profile preferences appData closure'),
]
for path,old,new,label in patches:
    p=Path(path);s=p.read_text(encoding='utf-8')
    if s.count(old)!=1:
        raise SystemExit(f'{label}: expected one match, found {s.count(old)}')
    p.write_text(s.replace(old,new,1),encoding='utf-8')
print('critical JavaScript syntax closures fixed')
