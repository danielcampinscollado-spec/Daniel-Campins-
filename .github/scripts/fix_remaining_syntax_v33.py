from pathlib import Path

appdata_old = "const appData=()=>{try{return data||{}}catch(e){return window.data||{}};"
appdata_new = "const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};"

replacements = {
    'client-delete-persist-v1.js': [(appdata_old, appdata_new)],
    'client-metrics-sync-v10.js': [(appdata_old, appdata_new)],
    'client-progress-final-v9.js': [(appdata_old, appdata_new)],
    'client-profile-preferences-v1.js': [(appdata_old, appdata_new)],
    'coach-panel-state-v10.js': [(appdata_old, appdata_new)],
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
        old_count = s.count(old)
        new_count = s.count(new)
        if old_count == 1:
            s = s.replace(old, new, 1)
        elif old_count == 0 and new_count >= 1:
            pass
        else:
            raise SystemExit(f'{filename}: unexpected syntax state old={old_count} new={new_count}')
    if s != original:
        p.write_text(s, encoding='utf-8')
        changed.append(filename)

print('fixed:', ', '.join(changed) if changed else 'none')
