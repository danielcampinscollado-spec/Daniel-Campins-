from pathlib import Path
import re, subprocess, sys

def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit(f'MISSING {label}')
    return text.replace(old,new,1)

# 1) INDEX: elimina duplicados, corrige geometría legacy y fuerza URLs nuevas.
p=Path('index.html'); s=p.read_text(encoding='utf-8')
s=s.replace('<script src="./checkin-coach-sync-v2.js?v=1"></script>\n','')
s=s.replace('./coach-premium-v8.js?v=20260910-1654','./coach-premium-v8.js?v=20260916-audit1')
s=s.replace('./coach-client-plan-status-v1.js?v=20260916-0948','./coach-client-plan-status-v1.js?v=20260916-audit1')
s=s.replace('./dcc-theme-system-v1.js?v=20260916-0919','./dcc-theme-system-v1.js?v=20260916-audit1')
s=s.replace('./coach-theme-premium-global.js?v=20260912-0705','./coach-theme-premium-global.js?v=20260916-audit1')
s=s.replace('grid-template-columns:repeat(7,minmax(0,1fr)) !important;','grid-template-columns:repeat(3,minmax(0,1fr)) !important;')
p.write_text(s,encoding='utf-8')

# 2) EJERCICIOS: la biblioteca deja de arrancar UI de clientes/entrenamiento por su cuenta.
p=Path('ejercicio-biblioteca.js'); s=p.read_text(encoding='utf-8')
s=re.sub(r"\n  const inlineEditor=document\.createElement\('script'\);.*?document\.head\.appendChild\(clientsSearchFix\);\n","\n  /* Los módulos de UI se cargan únicamente desde el bootstrap de soporte. */\n",s,flags=re.S)
p.write_text(s,encoding='utf-8')

# 3) CORE ENTRENADOR: una autoridad para Panel, Clientes y navegación.
p=Path('coach-premium-core-v9.js'); s=p.read_text(encoding='utf-8')
old_nav="""      #coach .side{height:62px!important;left:14px!important;right:14px!important;bottom:10px!important;border-radius:21px!important;padding:0 7px!important}\n      #coach-nav{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:0!important;height:100%!important}\n      #coach-nav button{height:100%!important;padding:5px 2px!important;font-size:8px!important;transition:none!important;transform:none!important}#coach-nav button svg{width:21px!important;height:21px!important}#coach-nav button span{font-size:7.3px!important;margin-top:2px!important}\n"""
new_nav="""      /* Navegación entrenador: única autoridad visual móvil. */\n      @media(max-width:900px){\n        body #coach#coach > .side{position:fixed!important;left:18px!important;right:18px!important;bottom:12px!important;top:auto!important;width:auto!important;height:76px!important;min-height:76px!important;margin:0!important;padding:5px!important;border:1.5px solid rgba(214,160,48,.78)!important;border-radius:38px!important;background:#11110f!important;background-image:none!important;box-shadow:0 12px 30px rgba(0,0,0,.24)!important;overflow:hidden!important;z-index:9999!important;box-sizing:border-box!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}\n        body #coach#coach > .side>h2,body #coach#coach > .side>.out{display:none!important}\n        body #coach#coach #coach-nav#coach-nav{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:2px!important;width:100%!important;height:100%!important;margin:0!important;padding:0!important;border:0!important;border-radius:33px!important;background:#11110f!important;background-image:none!important;box-shadow:none!important;overflow:hidden!important;box-sizing:border-box!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}\n        body #coach#coach #coach-nav#coach-nav button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:100%!important;height:100%!important;min-width:0!important;margin:0!important;padding:7px 3px!important;gap:4px!important;border:1px solid transparent!important;border-radius:31px!important;background:transparent!important;color:#d7aa4b!important;box-shadow:none!important;transition:none!important;transform:none!important}\n        body #coach#coach #coach-nav#coach-nav button svg{width:24px!important;height:24px!important;flex:0 0 24px!important;color:currentColor!important;stroke:currentColor!important}\n        body #coach#coach #coach-nav#coach-nav button span{margin:0!important;color:currentColor!important;font-size:11px!important;line-height:1!important;font-weight:600!important;white-space:nowrap!important}\n        body #coach#coach #coach-nav#coach-nav button.active{border:1.5px solid rgba(205,146,27,.78)!important;background:linear-gradient(145deg,#ffe994 0%,#f6cf61 46%,#e2a72f 100%)!important;color:#17140d!important;box-shadow:0 5px 14px rgba(185,126,18,.20),inset 0 1px 0 rgba(255,255,255,.92)!important}\n        html.dcc-theme-light-premium body #coach#coach > .side{background:#fffdf9!important;background-image:none!important;box-shadow:0 12px 30px rgba(103,76,29,.13),inset 0 1px 0 rgba(255,255,255,.98)!important}\n        html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav{background:#fffdf9!important;background-image:none!important}\n        html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active){background:transparent!important;color:#5f6268!important}\n        html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active{color:#17140d!important}\n      }\n"""
s=must_replace(s,old_nav,new_nav,'core nav css')

# Dashboard: usa estado real directamente, sin parche DOM posterior.
s=must_replace(s,
"  function hasRoutine(id){const r=getData()?.routines?.[id];return Array.isArray(r)&&r.length>0}\n",
"  function routineDays(id){const r=getData()?.routines?.[id];return Array.isArray(r)?r:(Array.isArray(r?.routine)?r.routine:[])}\n  function routineComplete(id){const days=routineDays(id);return days.length>0&&days.every(day=>Array.isArray(day?.exercises)&&day.exercises.length>0)}\n  function mealReady(meal){if(Array.isArray(meal?.options)&&meal.options.length)return meal.options.some(o=>Array.isArray(o?.foods)&&o.foods.length>0);return Array.isArray(meal?.foods)&&meal.foods.length>0}\n  function dietDayComplete(day){return Array.isArray(day?.meals)&&day.meals.length>0&&day.meals.every(mealReady)}\n  function dietComplete(id){const p=getData()?.diets?.[id];return !!p&&(dietDayComplete(p.training)||dietDayComplete(p.rest))}\n  function pendingClient(c){return String(c?.status||'').trim().toLowerCase()==='pendiente'}\n",
'dashboard helpers')
old_tasks="""    cs.forEach(c=>{\n      if(pendingCheck(c))tasks.push({icon:'✓',title:'REVISAR CHECK-IN',text:c.name,badge:'HOY',action:`reviewCheckin('${esc(c.id)}')`});\n      if(!hasRoutine(c.id))tasks.push({icon:'＋',title:'ASIGNAR RUTINA',text:c.name,badge:'PENDIENTE',action:`openClient('${esc(c.id)}')`});\n      const gap=daysSince(latestWorkout(c.id)?.date);\n      if(gap!==null&&gap>=7)attention.push({icon:'!',title:c.name,text:`${gap} DÍAS SIN REGISTRAR ENTRENAMIENTO`,badge:'SEGUIMIENTO',action:`openClient('${esc(c.id)}')`});\n    });\n"""
new_tasks="""    cs.forEach(c=>{\n      if(pendingCheck(c))tasks.push({icon:'✓',title:'REVISAR CHECK-IN',text:c.name,badge:'HOY',action:`reviewCheckin('${esc(c.id)}')`});\n      if(!routineComplete(c.id))tasks.push({icon:'＋',title:'COMPLETAR RUTINA',text:c.name,badge:'PENDIENTE',action:`openClient('${esc(c.id)}')`});\n      if(!dietComplete(c.id))tasks.push({icon:'＋',title:'COMPLETAR ALIMENTACIÓN',text:c.name,badge:'PENDIENTE',action:`openClient('${esc(c.id)}')`});\n      if(pendingClient(c))tasks.push({icon:'＋',title:'REVISAR CLIENTE',text:c.name,badge:'PENDIENTE',action:`openClient('${esc(c.id)}')`});\n      const gap=daysSince(latestWorkout(c.id)?.date);\n      if(gap!==null&&gap>=7)attention.push({icon:'!',title:c.name,text:`${gap} DÍAS SIN REGISTRAR ENTRENAMIENTO`,badge:'SEGUIMIENTO',action:`openClient('${esc(c.id)}')`});\n    });\n"""
s=must_replace(s,old_tasks,new_tasks,'dashboard task source')

# Clientes: el propio core genera la tarjeta aprobada; se elimina la mutación posterior.
pattern=r"  function clientCard\(c\)\{.*?\n  \}\n  function renderClients\(\)\{"
replacement="""  function clientSince(c){\n    const raw=c?.created_at||c?.createdAt||c?.start_date||c?.startDate;if(!raw)return'';const d=new Date(raw);if(!Number.isFinite(d.getTime()))return'';return `Desde ${d.toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})}`\n  }\n  function clientCard(c){\n    const id=esc(c.id),name=esc(c.name||'Cliente'),since=esc(clientSince(c));\n    return `<article class=\"dcc-client-card-authority\" data-name=\"${name.toLowerCase()}\" onclick=\"openClient('${id}')\"><span class=\"dcc-client-avatar-authority\">${icon('clients')}</span><span class=\"dcc-client-copy-authority\"><strong>${name}</strong>${since?`<small>${since}</small>`:''}</span><button type=\"button\" class=\"dcc-client-manage-authority\" onclick=\"event.stopPropagation();openClient('${id}')\">Gestionar<span>›</span></button></article>`;\n  }\n  function renderClients(){"""
s,n=re.subn(pattern,replacement,s,count=1,flags=re.S)
if n!=1:raise SystemExit('MISSING clientCard block')
# Search/filter selectors now target authoritative cards too.
s=s.replace("document.querySelectorAll('.dcc-cl-card').forEach(x=>x.style.display=x.dataset.name.includes(q)?'grid':'none')","document.querySelectorAll('.dcc-client-card-authority').forEach(x=>x.style.display=x.dataset.name.includes(q)?'flex':'none')")
s=s.replace("[...l.querySelectorAll('.dcc-cl-card')].sort","[...l.querySelectorAll('.dcc-client-card-authority')].sort")
# Insert client card CSS before nav authority marker.
marker='      /* Navegación entrenador: única autoridad visual móvil. */'
client_css="""      .dcc-client-card-authority{position:relative;display:flex;align-items:center;width:100%;height:64px;min-height:64px;padding:6px 10px;gap:9px;border:1px solid rgba(201,151,47,.30);border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.94),rgba(255,250,239,.82));box-shadow:0 6px 15px rgba(86,63,25,.06),inset 0 1px 0 rgba(255,255,255,.98);cursor:pointer;overflow:hidden;color:#111318}\n      .dcc-client-card-authority:before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(#f6d66f,#d79a27)}\n      .dcc-client-avatar-authority{width:42px;height:42px;flex:0 0 42px;display:grid;place-items:center;border:1px solid rgba(190,134,27,.30);border-radius:14px;background:linear-gradient(145deg,#fffaf0,#f8e7b7);color:#9c6810}.dcc-client-avatar-authority svg{width:23px;height:23px}\n      .dcc-client-copy-authority{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.dcc-client-copy-authority strong{color:#111318!important;font-size:15.5px;font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dcc-client-copy-authority small{color:#858c98;font-size:9.8px;font-weight:600}\n      .dcc-client-manage-authority{flex:0 0 auto;min-width:106px;height:36px;padding:0 7px 0 10px;display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1.3px solid #c9952f;border-radius:12px;background:rgba(255,252,245,.82);color:#714909;font-size:10.8px;font-weight:820}.dcc-client-manage-authority span{width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(145deg,#f8d978,#e5ad3d);color:#2f220b;font-size:16px}\n      html:not(.dcc-theme-light-premium) body #coach .dcc-client-card-authority{background:linear-gradient(145deg,#10151a,#080b0e);color:#f5f3ef;border-color:rgba(217,170,74,.42)}html:not(.dcc-theme-light-premium) body #coach .dcc-client-copy-authority strong{color:#f5f3ef!important}html:not(.dcc-theme-light-premium) body #coach .dcc-client-copy-authority small{color:#8d96a1}\n\n"""
if marker not in s:raise SystemExit('MISSING nav marker after replacement')
s=s.replace(marker,client_css+marker,1)
p.write_text(s,encoding='utf-8')

# 4) LIGHT: el día seleccionado siempre gana al estado "hoy".
p=Path('coach-light-stable-v1.js'); s=p.read_text(encoding='utf-8')
s=s.replace('html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day.today{background:#1b1b18!important;color:#fff8e8!important}', 'html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day.today:not(.selected){background:#1b1b18!important;color:#fff8e8!important}')
p.write_text(s,encoding='utf-8')

# 5) Tema coach: fuerza nueva URL del único stylesheet coach-light.
p=Path('coach-theme-premium-global.js'); s=p.read_text(encoding='utf-8')
s=s.replace('./coach-light-stable-v1.js?v=20260912-2','./coach-light-stable-v1.js?v=20260916-audit1')
p.write_text(s,encoding='utf-8')

# 6) Validaciones estáticas de la arquitectura resultante.
idx=Path('index.html').read_text(encoding='utf-8')
assert idx.count('checkin-coach-sync-v2.js')==1, 'checkin sync duplicado'
assert 'repeat(7,minmax(0,1fr)) !important' not in idx, 'nav legacy 7 columnas'
core=Path('coach-premium-core-v9.js').read_text(encoding='utf-8')
assert "repeat(5,minmax(0,1fr))" not in core, 'nav legacy 5 columnas'
assert 'dcc-client-card-authority' in core
assert 'COMPLETAR ALIMENTACIÓN' in core
lib=Path('ejercicio-biblioteca.js').read_text(encoding='utf-8')
assert 'clients-search-final-fix.js' not in lib
assert "inlineEditor.src='./training-inline-fix.js" not in lib

for f in Path('.').rglob('*.js'):
    if 'node_modules' in f.parts:continue
    r=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
    if r.returncode:
        print(r.stderr);raise SystemExit('Syntax failure: '+str(f))
print('DEEP_RUNTIME_CLEANUP_OK')
