from pathlib import Path

replacements = {
    'client-delete-persist-v1.js': [
        (
            "const appData=()=>{try{return data||{}}catch(e){return window.data||{}};",
            "const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};"
        )
    ],
    'client-metrics-sync-v10.js': [
        (
            "const appData=()=>{try{return data||{}}catch(e){return window.data||{}};",
            "const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};"
        )
    ],
    'client-progress-final-v9.js': [
        (
            "const appData=()=>{try{return data||{}}catch(e){return window.data||{}};",
            "const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};"
        )
    ],
    'progress-premium.js': [
        (
            "window.dccProgressMetric=(id,m)=>{window.__dccProgressMetric=m;renderProgress(id)};window.dccProgressAll=b=>{const g=b.closest('.dcc-p-section').querySelector('.dcc-p-grid');g.classList.toggle('show-all');b.textContent=g.classList.contains('show-all')?'Ver menos ‹':'Ver todos ›'}\n}\nfunction install()",
            "window.dccProgressMetric=(id,m)=>{window.__dccProgressMetric=m;renderProgress(id)};window.dccProgressAll=b=>{const g=b.closest('.dcc-p-section').querySelector('.dcc-p-grid');g.classList.toggle('show-all');b.textContent=g.classList.contains('show-all')?'Ver menos ‹':'Ver todos ›'}\nfunction install()"
        )
    ],
}

changed = []
for filename, edits in replacements.items():
    p = Path(filename)
    s = p.read_text(encoding='utf-8')
    original = s
    for old, new in edits:
        count = s.count(old)
        if count != 1:
            raise SystemExit(f'{filename}: expected exactly one match, found {count}')
        s = s.replace(old, new, 1)
    if s != original:
        p.write_text(s, encoding='utf-8')
        changed.append(filename)

print('fixed:', ', '.join(changed))
