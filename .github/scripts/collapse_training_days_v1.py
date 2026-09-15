from pathlib import Path

# Entrenador: la rutina debe entrar recogida. Ningún día se abre automáticamente.
p = Path('client-admin-premium.js')
s = p.read_text()
repls = [
    ("if(!Number.isInteger(window.__dccTrainingOpen))window.__dccTrainingOpen=ds.length?0:null;", "if(window.__dccTrainingOpen!==null&&!Number.isInteger(window.__dccTrainingOpen))window.__dccTrainingOpen=null;"),
    ("trainingDay(id,d,i,edit||window.__dccTrainingOpen===i,edit)", "trainingDay(id,d,i,window.__dccTrainingOpen===i,edit)"),
    ("window.dccToggleTrainingDay=(id,i)=>{if(window.__dccTrainingEdit)return;window.__dccTrainingOpen=window.__dccTrainingOpen===i?null:i;render(id,'training')};", "window.dccToggleTrainingDay=(id,i)=>{window.__dccTrainingOpen=window.__dccTrainingOpen===i?null:i;render(id,'training')};"),
    ("window.dccModifyRoutine=id=>{window.__dccTrainingBackup=JSON.stringify(data?.routines?.[id]??null);window.__dccTrainingEdit=true;render(id,'training')};", "window.dccModifyRoutine=id=>{window.__dccTrainingBackup=JSON.stringify(data?.routines?.[id]??null);window.__dccTrainingEdit=true;window.__dccTrainingOpen=null;render(id,'training')};"),
]
for old,new in repls:
    if old not in s:
        raise SystemExit('client-admin pattern not found: '+old[:80])
    s=s.replace(old,new,1)
p.write_text(s)

# Si está activo el asistente de días, no debe ocultar todos salvo el primero ni abrir el Día 1.
p = Path('training-day-wizard-v1.js')
s = p.read_text()
repls = [
    ("cards.forEach((card,i)=>{card.style.display=i===state.active?'':'none'});", "cards.forEach(card=>{card.style.display=''});"),
    ("const active=cards[state.active];if(active){active.insertAdjacentHTML('beforeend',`<div class=\"dcc-tdw-nav\" data-dcc-tdw-nav=\"1\"><button class=\"dcc-tdw-prev\" ${state.active===0?'disabled':''} onclick=\"dccTrainingWizardDay(${state.active-1})\">← Anterior</button><button class=\"dcc-tdw-next\" ${state.active>=ds.length-1?'disabled':''} onclick=\"dccTrainingWizardDay(${state.active+1})\">Siguiente día →</button></div>`) }", ""),
]
# The nav line can differ only in whitespace; remove it with a targeted split if exact replacement misses.
old,new=repls[0]
if old not in s: raise SystemExit('wizard card visibility pattern not found')
s=s.replace(old,new,1)
old_nav="const active=cards[state.active];if(active){active.insertAdjacentHTML('beforeend',`<div class=\"dcc-tdw-nav\" data-dcc-tdw-nav=\"1\"><button class=\"dcc-tdw-prev\" ${state.active===0?'disabled':''} onclick=\"dccTrainingWizardDay(${state.active-1})\">← Anterior</button><button class=\"dcc-tdw-next\" ${state.active>=ds.length-1?'disabled':''} onclick=\"dccTrainingWizardDay(${state.active+1})\">Siguiente día →</button></div>`)}"
if old_nav not in s: raise SystemExit('wizard nav pattern not found')
s=s.replace(old_nav,'',1)
old="window.__dccTrainingOpen=state.active;save();try{window.dccClientAdmin(id(),'training')}catch(_){schedule()}"
new="window.__dccTrainingOpen=null;save();try{window.dccClientAdmin(id(),'training')}catch(_){schedule()}"
if old not in s: raise SystemExit('wizard count open pattern not found')
s=s.replace(old,new,1)
old="window.dccTrainingWizardDay=i=>{const ds=days();i=Math.max(0,Math.min(Number(i)||0,ds.length-1));state.active=i;window.__dccTrainingOpen=i;apply();document.querySelector('[data-dcc-tdw=\"1\"]')?.scrollIntoView({behavior:'smooth',block:'start'})};"
new="window.dccTrainingWizardDay=i=>{const ds=days();i=Math.max(0,Math.min(Number(i)||0,ds.length-1));state.active=i;window.__dccTrainingOpen=window.__dccTrainingOpen===i?null:i;try{window.dccClientAdmin(id(),'training')}catch(_){apply()}document.querySelector('[data-dcc-tdw=\"1\"]')?.scrollIntoView({behavior:'smooth',block:'start'})};"
if old not in s: raise SystemExit('wizard day toggle pattern not found')
s=s.replace(old,new,1)
p.write_text(s)
