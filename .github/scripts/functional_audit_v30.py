from pathlib import Path


def load(path):
    return Path(path).read_text(encoding='utf-8')


def save(path, text):
    Path(path).write_text(text, encoding='utf-8')


def rep(text, old, new, label, required=True):
    n=text.count(old)
    if required and n!=1:
        raise RuntimeError(f'{label}: expected 1 occurrence, found {n}')
    if n:
        text=text.replace(old,new,1)
    return text

# -----------------------------------------------------------------------------
# CLIENT ADMIN: use real server field names, remove dead actions, surface foods,
# and never silently claim diet/routine saves when Supabase rejected them.
# -----------------------------------------------------------------------------
p='client-admin-premium.js'
s=load(p)

s=rep(s,
"return v.length?v:[num(cl?.initial??cl?.weight)??0]",
"return v.length?v:[num(cl?.initial??cl?.initial_weight??cl?.weight)??0]",
'initial weight fallback')

s=rep(s,
"['bodyFat','body_fat','fat','fatPct','fat_pct','grasa','porcentajeGrasa'].forEach(k=>push(cl?.[k]));",
"['bodyFatInitial','initial_body_fat'].forEach(k=>push(cl?.[k]));['bodyFat','body_fat','fat','fatPct','fat_pct','grasa','porcentajeGrasa'].forEach(k=>push(cl?.[k]));",
'initial body fat source')

s=rep(s,"Number.isNaN(d)?'—'","Number.isNaN(d.getTime())?'—'",'member date validation')
s=rep(s,"x?.date??x?.created_at??0","x?.workout_date??x?.date??x?.created_at??0",'workout 30 date')

old="function lastWorkout(id){const h=data?.workoutHistory?.[id]||[];return h.length?'Registrada':'Sin sesiones'}function lastCheckin(){return'Sin check-in'}"
new="""function lastWorkout(id){const h=data?.workoutHistory?.[id]||[];if(!h.length)return'Sin sesiones';const x=h.slice().sort((a,b)=>new Date(b?.workout_date??b?.date??b?.created_at??0)-new Date(a?.workout_date??a?.date??a?.created_at??0))[0],raw=x?.workout_date??x?.date??x?.created_at,d=new Date(raw||0);return Number.isFinite(d.getTime())?d.toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'}):'Registrada'}function lastCheckin(id){const x=data?.checkins?.[id];if(!x)return'Sin check-in';const raw=x.sentAt??x.sent_at??x.updatedAt??x.updated_at??x.created_at;if(!raw)return x.reviewed?'Revisado':'Registrado';const d=new Date(raw);if(!Number.isFinite(d.getTime()))return x.reviewed?'Revisado':'Registrado';return`${x.reviewed?'Revisado':'Registrado'} · ${d.toLocaleDateString('es-ES',{day:'numeric',month:'short'})}`}function avoidText(cl){return String(cl?.foods_to_avoid??cl?.foodsToAvoid??'').trim()}"""
s=rep(s,old,new,'real activity labels')

old="async function persistDiet(id,t){try{if(typeof saveData==='function')saveData();const d=data?.diets?.[id]?.[t];if(d&&window.supabaseClient)await supabaseClient.from('client_diets').upsert({client_id:id,diet_type:t,calories:d.calories||'',protein:d.protein||'',meals:d.meals||[],updated_at:new Date().toISOString()},{onConflict:'client_id,diet_type'})}catch(e){console.error(e)}}"
new="""async function persistDiet(id,t){try{if(typeof saveData==='function')saveData();const d=data?.diets?.[id]?.[t];if(!d)throw new Error('No existe la dieta que se intenta guardar');if(!window.supabaseClient)throw new Error('Sin conexión con Supabase');const {error}=await supabaseClient.from('client_diets').upsert({client_id:id,diet_type:t,calories:d.calories||'',protein:d.protein||'',meals:d.meals||[],updated_at:new Date().toISOString()},{onConflict:'client_id,diet_type'});if(error)throw error;return true}catch(e){console.error('Error guardando alimentación:',e);if(typeof toast==='function')toast('No se pudo guardar la alimentación');return false}}"""
s=rep(s,old,new,'diet persistence feedback')

old="function foodPane(id){const t=window.__dccDietType||'training',d=data?.diets?.[id]?.[t]||{meals:[]},ms=Array.isArray(d.meals)?d.meals:[],open=Number.isInteger(window.__dccDietOpenMeal)?window.__dccDietOpenMeal:null,map=window.__dccDietOptionMap||{};return`<div class=\"dcc-diet-switch\">"
new="""function foodPane(id){const t=window.__dccDietType||'training',d=data?.diets?.[id]?.[t]||{meals:[]},ms=Array.isArray(d.meals)?d.meals:[],open=Number.isInteger(window.__dccDietOpenMeal)?window.__dccDietOpenMeal:null,map=window.__dccDietOptionMap||{},avoid=avoidText(c(id));return`${avoid?`<section class=\"dcc-ca-card dcc-native-avoid-warning\"><div class=\"dcc-ca-title\"><h2>Aviso del cliente</h2></div><div style=\"margin-top:8px;color:#e8e5de;font-size:11px;line-height:1.45\">No incluir en la dieta: <b style=\"color:${G2}\">${esc(avoid)}</b>.</div></section>`:''}<div class=\"dcc-diet-switch\">"""
s=rep(s,old,new,'native food warning')

old="if(t==='progress')return`<section class=\"dcc-ca-card\"><div class=\"dcc-ca-title\"><h2>Progreso</h2></div><div class=\"dcc-ca-grid\">${info('Peso inicial',m.initial+' kg')}${info('Peso actual',m.current+' kg')}${info('% grasa inicial',m.fi??'—')}${info('% grasa actual',m.fc??'—')}</div></section>`;"
new="if(t==='progress')return`<section class=\"dcc-ca-card\"><div class=\"dcc-ca-title\"><h2>Progreso</h2></div><div class=\"dcc-ca-grid\">${info('Peso inicial',m.initial.toFixed(1).replace('.',',')+' kg')}${info('Peso actual',m.current.toFixed(1).replace('.',',')+' kg')}${info('Grasa inicial',m.fi!=null?m.fi.toFixed(1).replace('.',',')+' %':'—')}${info('Grasa actual',m.fc!=null?m.fc.toFixed(1).replace('.',',')+' %':'—')}</div></section>`;"
s=rep(s,old,new,'progress units')

old="${info('Objetivo',esc(cl.goal||'—'))}${info('Edad',clientAge(cl))}${info('Altura',clientHeight(cl))}${info('Último check-in',lastCheckin(id))}"
new="${info('Objetivo',esc(cl.goal||'—'))}${info('Edad',clientAge(cl))}${info('Altura',clientHeight(cl))}${info('Último check-in',lastCheckin(id))}${info('Alimentos a evitar',esc(avoidText(cl)||'Sin alimentos indicados'))}"
s=rep(s,old,new,'foods in summary')

old="window.dccDietAddFood=async(id,t,mi,oi)=>{const m=mealRef(id,t,mi),n=prompt('Nombre del alimento','');"
new="window.dccDietAddFood=async(id,t,mi,oi)=>{const avoid=avoidText(c(id));if(avoid)alert(`Aviso del cliente\\nNo incluir: ${avoid}.`);const m=mealRef(id,t,mi),n=prompt('Nombre del alimento','');"
s=rep(s,old,new,'native add-food warning')
s=rep(s,"};window.dccDietRemoveFood=async", "};window.dccDietAddFood.__dccNativeAvoidWarning=true;window.dccDietRemoveFood=async",'food warning marker')

old="window.dccSaveRoutine=async id=>{if(typeof saveData==='function')saveData();try{if(window.supabaseClient)await supabaseClient.from('client_routines').upsert({client_id:id,routine:data.routines[id],updated_at:new Date().toISOString()},{onConflict:'client_id'})}catch(e){console.warn('Rutina guardada localmente; sincronización remota no disponible',e)}window.__dccTrainingEdit=false;delete window.__dccTrainingBackup;render(id,'training')}"
new="""window.dccSaveRoutine=async id=>{if(typeof saveData==='function')saveData();try{if(!window.supabaseClient)throw new Error('Sin conexión con Supabase');const {error}=await supabaseClient.from('client_routines').upsert({client_id:id,routine:data.routines[id],updated_at:new Date().toISOString()},{onConflict:'client_id'});if(error)throw error;window.__dccTrainingEdit=false;delete window.__dccTrainingBackup;render(id,'training');if(typeof toast==='function')toast('Rutina guardada')}catch(e){console.error('No se pudo guardar la rutina:',e);if(typeof toast==='function')toast('No se pudo guardar la rutina');render(id,'training')}"""
s=rep(s,old,new,'routine save feedback')

old="`<button class=\"dcc-tr-history\" onclick=\"dccRoutineHistory('${id}')\"><b>↶ &nbsp; Rutina anterior</b><small>Consulta el histórico de rutinas de este cliente</small></button><button class=\"dcc-tr-new\" onclick=\"dccCreateRoutine('${id}')\">＋ &nbsp; Crear nueva rutina</button>`"
new="`<button class=\"dcc-tr-new\" onclick=\"dccCreateRoutine('${id}')\">＋ &nbsp; Crear nueva rutina</button>`"
s=rep(s,old,new,'remove dead routine history button')

save(p,s)

# -----------------------------------------------------------------------------
# PROFILE PREFERENCES: it used to repaint the whole body every mutation and poll
# every second. Native source now owns these fields; keep only fallback/delete.
# -----------------------------------------------------------------------------
p='client-profile-preferences-v1.js'
s=load(p)
s=rep(s,"if(typeof base!=='function'||base.__dccProfileFlowV2)return;","if(typeof base!=='function'||base.__dccProfileFlowV2||base.__dccAuditCreateFlowV11)return;",'skip native create wrapper')
s=rep(s,"if(add){const c=clientFor(clientId()),f=foods(c);if(f)alert(`Aviso del cliente\\nNo incluir: ${f}.`)}","if(add&&!window.dccDietAddFood?.__dccNativeAvoidWarning){const c=clientFor(clientId()),f=foods(c);if(f)alert(`Aviso del cliente\\nNo incluir: ${f}.`)}",'avoid duplicate food alert')

start=s.index("  let busy=false;")
end=s.index("  if(document.readyState==='loading')",start)
replacement="""  let busy=false;
  function schedule(){
    if(busy)return;busy=true;
    requestAnimationFrame(()=>{
      busy=false;
      loadPlanStatus();
      if(!window.createClient?.__dccAuditCreateFlowV11)installCreateFlow();
      patchNewClientLabel();
    });
  }

  function boot(){
    css();loadPlanStatus();installDeleteGuard();schedule();
    window.addEventListener('pageshow',schedule);
    window.dccProfilePreferencesRefresh=schedule;
  }
"""
s=s[:start]+replacement+s[end:]
save(p,s)

# -----------------------------------------------------------------------------
# PLAN STATUS: make it the single owner of trainer task rows; no body-wide
# character observer and no permanent timer.
# -----------------------------------------------------------------------------
p='coach-client-plan-status-v1.js'
s=load(p)
s=s.replace("const count=panel.querySelector('.dcc-p9-count');if(count)count.textContent=String(tasks.length);","const count=panel.querySelector('.dcc-p9-count');if(count&&count.textContent!==String(tasks.length))count.textContent=String(tasks.length);",1)
s=s.replace("badge.textContent=String(n)}","if(badge.textContent!==String(n))badge.textContent=String(n)}",1)

# Make the two top dashboard cards agree with the actual accordion counts.
needle="    const body=panel.querySelector('.dcc-p9-body');"
insert="""    const taskStat=[...document.querySelectorAll('#coach-main .dcc-p9-stat')].find(x=>/tareas pendientes/i.test(x.textContent||''));
    const taskStrong=taskStat?.querySelector('strong');if(taskStrong&&taskStrong.textContent!==String(tasks.length))taskStrong.textContent=String(tasks.length);
    const body=panel.querySelector('.dcc-p9-body');"""
s=rep(s,needle,insert,'sync top task counter')
needle="      const title=attention.querySelector('.dcc-p9-head-title');"
insert="""      const attentionStat=[...document.querySelectorAll('#coach-main .dcc-p9-stat')].find(x=>/requieren atención/i.test(x.textContent||''));
      const attentionStrong=attentionStat?.querySelector('strong');if(attentionStrong&&attentionStrong.textContent!==String(n))attentionStrong.textContent=String(n);
      const title=attention.querySelector('.dcc-p9-head-title');"""
s=rep(s,needle,insert,'sync top attention counter')

# Native profile now shows foods/warning. Do not inject duplicate blocks.
s=s.replace("const foods=foodsToAvoid(c),wantFood=active==='summary'||active.includes('resumen'),wantDiet=(active==='food'||active.includes('alimenta'))&&!!foods;",
"const foods=foodsToAvoid(c),nativeFoods=[...root.querySelectorAll('.dcc-ca-info span')].some(x=>(x.textContent||'').trim().toLowerCase()==='alimentos a evitar'),nativeDiet=!!root.querySelector('.dcc-native-avoid-warning'),wantFood=(active==='summary'||active.includes('resumen'))&&!nativeFoods,wantDiet=(active==='food'||active.includes('alimenta'))&&!!foods&&!nativeDiet;",1)

old="""  function boot(){
    addCss();installWrappers();schedule();
    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});
    setInterval(schedule,1500);
  }
"""
new="""  function boot(){
    addCss();installWrappers();
    const observe=()=>{const main=document.getElementById('coach-main');if(!main){setTimeout(observe,100);return}new MutationObserver(schedule).observe(main,{childList:true,subtree:true});schedule()};
    observe();
    window.addEventListener('pageshow',schedule);
    window.dccPlanStatusRefresh=schedule;
  }
"""
s=rep(s,old,new,'remove global plan polling')
save(p,s)

# -----------------------------------------------------------------------------
# COACH PANEL STATE: task rows are now owned by coach-client-plan-status-v1.
# Keep this layer for counter colors / accordion state / management routing only.
# -----------------------------------------------------------------------------
p='coach-panel-state-v10.js'
s=load(p)
s=s.replace("if(main.classList.contains('dcc-p9-dashboard')){colorCounters(main);closeNewAccordions(main);patchTasks(main)}","if(main.classList.contains('dcc-p9-dashboard')){colorCounters(main);closeNewAccordions(main)}",1)
s=s.replace("'\\\"':'&quot'","'\\\"':'&quot;'",1)
save(p,s)

print('functional audit v30 applied')
