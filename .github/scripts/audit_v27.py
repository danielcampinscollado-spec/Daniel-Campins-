from pathlib import Path
import re


def read(path):
    return Path(path).read_text(encoding="utf-8")


def write(path, text):
    Path(path).write_text(text, encoding="utf-8")


def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)


def sub1(text, pattern, repl, label, flags=0):
    out, n = re.subn(pattern, repl, text, count=1, flags=flags)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 regex replacement, found {n}")
    return out


# New client: source-level wording, reliable initial persistence and direct continuation.
p = "new-client-premium-v1.js"
s = read(p)
s = once(
    s,
    "      goal:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 12 20 4M17 4h3v3\"/></svg>'\n",
    "      goal:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 12 20 4M17 4h3v3\"/></svg>',\n      food:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M7 3v7M4.5 3v5.5A2.5 2.5 0 0 0 7 11v10M9.5 3v5.5A2.5 2.5 0 0 1 7 11\"/><path d=\"M16 3v18M16 3c3 2.5 3.5 7 0 10\"/></svg>'\n",
    "new client food icon",
)
s = once(s, "${icon('fat')}<span>% de grasa inicial</span>", "${icon('fat')}<span>Grasa corporal inicial</span>", "new client fat label")
s = once(s, '<span class="dcc-nc-label"><span>Alimentos a evitar</span></span>', '<span class="dcc-nc-label">${icon(\'food\')}<span>Alimentos a evitar</span></span>', "new client foods icon")
old = """    const id='client_'+Date.now();
    try{
      const {error}=await db.from('clients').insert({
        id,
        name,
        goal,
        weight,
        initial_weight:weight,
        initial_body_fat:bodyFat,
        age,
        height_cm:height,
        foods_to_avoid:foodsToAvoid,
        plan:'',
        status:'Pendiente'
      });
      if(error)throw error;
"""
new = """    const id='client_'+Date.now();
    const createdAt=new Date().toISOString();
    try{
      const {error}=await db.from('clients').insert({
        id,
        name,
        goal,
        weight,
        initial_weight:weight,
        initial_body_fat:bodyFat,
        age,
        height_cm:height,
        foods_to_avoid:foodsToAvoid,
        plan:'',
        status:'Pendiente',
        created_at:createdAt
      });
      if(error)throw error;

      const initialWrites=await Promise.all([
        db.from('client_weights').insert({client_id:id,weight,recorded_at:createdAt}),
        db.from('client_body_fat_history').insert({client_id:id,body_fat:bodyFat,recorded_at:createdAt}),
        db.from('client_checkins').upsert({client_id:id,weight:String(weight).replace('.',',')+' kg',body_fat:bodyFat,updated_at:createdAt},{onConflict:'client_id'})
      ]);
      const failed=initialWrites.find(x=>x?.error);
      if(failed){await db.from('clients').delete().eq('id',id);throw failed.error}
"""
s = once(s, old, new, "new client initial persistence")
s = once(
    s,
    "d.clients.push({id,name,goal,weight,initial:weight,bodyFatInitial:bodyFat,age,height:height,heightCm:height,height_cm:height,foodsToAvoid,foods_to_avoid:foodsToAvoid,plan:'',status:'Pendiente'});",
    "d.clients.push({id,name,goal,weight,initial:weight,initial_weight:weight,bodyFatInitial:bodyFat,initial_body_fat:bodyFat,age,height:height,heightCm:height,height_cm:height,foodsToAvoid,foods_to_avoid:foodsToAvoid,plan:'',status:'Pendiente',created_at:createdAt});",
    "new client local profile",
)
s = once(
    s,
    "d.checkins[id]={weight:(typeof money==='function'?money(weight):String(weight))+' kg',bodyFat,diet:'Pendiente',training:'Pendiente',comment:'Pendiente de revisión.',reviewed:false};",
    "d.checkins[id]={weight:(typeof money==='function'?money(weight):String(weight))+' kg',bodyFat,body_fat:bodyFat,diet:'Pendiente',training:'Pendiente',energy:'Pendiente',comment:'Pendiente de revisión.',reviewed:false,updatedAt:createdAt,updated_at:createdAt};",
    "new client local checkin",
)
s = once(
    s,
    "      try{if(typeof showCoach==='function')showCoach('clients');else window.showCoach?.('clients')}catch(e){}\n      notify('Cliente creado correctamente');",
    "      window.selectedClient=id;window.__dccClientAdminId=id;\n      try{if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'summary');else if(typeof window.openClient==='function')window.openClient(id);else window.showCoach?.('clients')}catch(e){console.error('DCC abriendo cliente recién creado:',e);window.showCoach?.('clients')}\n      notify('Cliente creado correctamente');",
    "new client direct profile",
)
write(p, s)


# Premium loader: the first visible dashboard already counts every pending plan item.
p = "coach-premium-v8.js"
s = read(p)
old = """  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function latestWorkout(id){const h=getData()?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0]||null}
  function hasRoutine(id){const r=getData()?.routines?.[id];return Array.isArray(r)&&r.length>0}
  function pendingCheck(c){const x=getData()?.checkins?.[c.id];return !!(x?.sentAt&&!x?.reviewed)}
"""
new = """  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function workoutDate(x){return x?.workout_date??x?.date??x?.created_at??null}
  function latestWorkout(id){const h=getData()?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(workoutDate(b)||0)-new Date(workoutDate(a)||0))[0]||null}
  function hasRoutine(id){const r=getData()?.routines?.[id],days=Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[];return days.length>0&&days.every(d=>Array.isArray(d?.exercises)&&d.exercises.length>0)}
  function mealReady(m){if(Array.isArray(m?.options)&&m.options.length)return m.options.some(o=>Array.isArray(o?.foods)&&o.foods.length>0);return Array.isArray(m?.foods)&&m.foods.length>0}
  function hasDiet(id){const x=getData()?.diets?.[id];return !!x&&['training','rest'].every(t=>Array.isArray(x?.[t]?.meals)&&x[t].meals.length>0&&x[t].meals.every(mealReady))}
  function pendingCheck(c){const x=getData()?.checkins?.[c.id];return !!((x?.sentAt??x?.sent_at)&&!x?.reviewed)}
"""
s = once(s, old, new, "instant dashboard helpers")
s = once(
    s,
    "    cs.forEach(c=>{if(pendingCheck(c))tasks++;if(!hasRoutine(c.id))tasks++;const gap=daysSince(latestWorkout(c.id)?.date);if(gap!==null&&gap>=7)attention++});",
    "    cs.forEach(c=>{if(pendingCheck(c))tasks++;if(!hasDiet(c.id))tasks++;if(!hasRoutine(c.id))tasks++;const gap=daysSince(workoutDate(latestWorkout(c.id)));if(gap!==null&&gap>=7)attention++});",
    "instant dashboard task count",
)
s = s.replace("./coach-ui-v11.js?v=20260910-1932", "./coach-ui-v11.js?v=20260911-audit2")
s = s.replace("./coach-premium-core-v9.js?v=20260910-2015", "./coach-premium-core-v9.js?v=20260911-audit2")
write(p, s)


# Coach UI: counters agree with the real plan state and the base calendar has no fake actions.
p = "coach-ui-v11.js"
s = read(p)
old = """  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function pendingCheck(c){const x=getData()?.checkins?.[c.id];return !!(x?.sentAt&&!x?.reviewed)}
  function hasRoutine(id){const r=getData()?.routines?.[id];return Array.isArray(r)&&r.length>0}
  function latestWorkout(id){const h=getData()?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0]||null}
  function taskCount(){const cs=Array.isArray(getData()?.clients)?getData().clients:[];return cs.reduce((n,c)=>n+(pendingCheck(c)?1:0)+(!hasRoutine(c.id)?1:0),0)}
  function attentionCount(){const cs=Array.isArray(getData()?.clients)?getData().clients:[];return cs.reduce((n,c)=>{const gap=daysSince(latestWorkout(c.id)?.date);return n+((gap!==null&&gap>=7)?1:0)},0)}
"""
new = """  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function workoutDate(x){return x?.workout_date??x?.date??x?.created_at??null}
  function pendingCheck(c){const x=getData()?.checkins?.[c.id];return !!((x?.sentAt??x?.sent_at)&&!x?.reviewed)}
  function hasRoutine(id){const r=getData()?.routines?.[id],days=Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[];return days.length>0&&days.every(d=>Array.isArray(d?.exercises)&&d.exercises.length>0)}
  function mealReady(m){if(Array.isArray(m?.options)&&m.options.length)return m.options.some(o=>Array.isArray(o?.foods)&&o.foods.length>0);return Array.isArray(m?.foods)&&m.foods.length>0}
  function hasDiet(id){const x=getData()?.diets?.[id];return !!x&&['training','rest'].every(t=>Array.isArray(x?.[t]?.meals)&&x[t].meals.length>0&&x[t].meals.every(mealReady))}
  function latestWorkout(id){const h=getData()?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(workoutDate(b)||0)-new Date(workoutDate(a)||0))[0]||null}
  function taskCount(){const cs=Array.isArray(getData()?.clients)?getData().clients:[];return cs.reduce((n,c)=>n+(pendingCheck(c)?1:0)+(!hasDiet(c.id)?1:0)+(!hasRoutine(c.id)?1:0),0)}
  function attentionCount(){const cs=Array.isArray(getData()?.clients)?getData().clients:[];return cs.reduce((n,c)=>{const gap=daysSince(workoutDate(latestWorkout(c.id)));return n+((gap!==null&&gap>=7)?1:0)},0)}
"""
s = once(s, old, new, "coach ui counters")
s = once(s, "onclick=\"toast('La creación de sesiones la configuramos en el siguiente paso')\"", "onclick=\"window.dccCalendarNewSession?dccCalendarNewSession():toast('No se pudo abrir Nueva sesión')\"", "calendar real new session")
s = once(s, "Vista de agenda preparada para añadir y gestionar sesiones.", "Sesiones programadas para la fecha seleccionada.", "calendar agenda wording")
write(p, s)


# Premium core: diet + routine tasks are native, filters are accurate, calendar is real.
p = "coach-premium-core-v9.js"
s = read(p)
old = """  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function latestWorkout(id){const d=getData(),h=d?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0]||null}
  function hasRoutine(id){const r=getData()?.routines?.[id];return Array.isArray(r)&&r.length>0}
  function pendingCheck(c){const x=getData()?.checkins?.[c.id];return !!(x?.sentAt&&!x?.reviewed)}
  function trainingProgress(c){const d=getData(),r=d?.routines?.[c.id];if(!Array.isArray(r)||!r.length)return 0;const h=d?.workoutHistory?.[c.id]||[];if(!h.length)return 0;const recent=h.filter(x=>{const gap=daysSince(x.date);return gap!==null&&gap<=30}).length;return Math.min(100,Math.round(recent/Math.max(1,r.length*4)*100))}
"""
new = """  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function workoutDate(x){return x?.workout_date??x?.date??x?.created_at??null}
  function latestWorkout(id){const d=getData(),h=d?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(workoutDate(b)||0)-new Date(workoutDate(a)||0))[0]||null}
  function routineDays(id){const r=getData()?.routines?.[id];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]}
  function hasRoutine(id){const days=routineDays(id);return days.length>0&&days.every(d=>Array.isArray(d?.exercises)&&d.exercises.length>0)}
  function mealReady(m){if(Array.isArray(m?.options)&&m.options.length)return m.options.some(o=>Array.isArray(o?.foods)&&o.foods.length>0);return Array.isArray(m?.foods)&&m.foods.length>0}
  function hasDiet(id){const x=getData()?.diets?.[id];return !!x&&['training','rest'].every(t=>Array.isArray(x?.[t]?.meals)&&x[t].meals.length>0&&x[t].meals.every(mealReady))}
  function pendingCheck(c){const x=getData()?.checkins?.[c.id];return !!((x?.sentAt??x?.sent_at)&&!x?.reviewed)}
  function needsPlan(c){return !hasDiet(c.id)||!hasRoutine(c.id)}
  function trainingProgress(c){const r=routineDays(c.id);if(!r.length)return 0;const h=getData()?.workoutHistory?.[c.id]||[];if(!h.length)return 0;const recent=h.filter(x=>{const gap=daysSince(workoutDate(x));return gap!==null&&gap<=30}).length;return Math.min(100,Math.round(recent/Math.max(1,r.length*4)*100))}
"""
s = once(s, old, new, "premium core helpers")
old = """    cs.forEach(c=>{
      if(pendingCheck(c))tasks.push({icon:'✓',title:'REVISAR CHECK-IN',text:c.name,badge:'HOY',action:`reviewCheckin('${esc(c.id)}')`});
      if(!hasRoutine(c.id))tasks.push({icon:'＋',title:'ASIGNAR RUTINA',text:c.name,badge:'PENDIENTE',action:`openClient('${esc(c.id)}')`});
      const gap=daysSince(latestWorkout(c.id)?.date);
      if(gap!==null&&gap>=7)attention.push({icon:'!',title:c.name,text:`${gap} DÍAS SIN REGISTRAR ENTRENAMIENTO`,badge:'SEGUIMIENTO',action:`openClient('${esc(c.id)}')`});
    });
    const hr=new Date().getHours(),g=hr<13?'BUENOS DÍAS':hr<20?'BUENAS TARDES':'BUENAS NOCHES';
    const tasksOpen=window.__dccCoachTasksOpen!==false;
    const attentionOpen=window.__dccCoachAttentionOpen!==false;
"""
new = """    cs.forEach(c=>{
      const id=esc(c.id);
      if(pendingCheck(c))tasks.push({icon:icon('check'),title:'REVISAR CHECK-IN',text:c.name,badge:'PENDIENTE',action:`reviewCheckin('${id}')`});
      if(!hasDiet(c.id))tasks.push({icon:icon('diet'),title:'CREAR ALIMENTACIÓN',text:c.name,badge:'PENDIENTE',action:`window.dccClientAdmin?dccClientAdmin('${id}','food'):openClient('${id}')`});
      if(!hasRoutine(c.id))tasks.push({icon:icon('dumbbell'),title:'CREAR RUTINA',text:c.name,badge:'PENDIENTE',action:`window.dccClientAdmin?dccClientAdmin('${id}','training'):openClient('${id}')`});
      const gap=daysSince(workoutDate(latestWorkout(c.id)));
      if(gap!==null&&gap>=7)attention.push({icon:'!',title:c.name,text:`${gap} DÍAS SIN REGISTRAR ENTRENAMIENTO`,badge:'SEGUIMIENTO',action:`window.dccClientAdmin?dccClientAdmin('${id}','summary'):openClient('${id}')`});
    });
    const hr=new Date().getHours(),g=hr<13?'BUENOS DÍAS':hr<20?'BUENAS TARDES':'BUENAS NOCHES';
    const tasksOpen=false,attentionOpen=false;window.__dccCoachTasksOpen=false;window.__dccCoachAttentionOpen=false;
"""
s = once(s, old, new, "premium core tasks")
s = once(s, '<span class="dcc-p9-head-title">REQUIEREN ATENCIÓN</span>', '<span class="dcc-p9-head-title">REQUIEREN ATENCIÓN <span class="dcc-p9-count">${attention.length}</span></span>', "native attention count")
old = """  function clientCard(c){
    const p=trainingProgress(c),goal=c.goal||c.objective||c.objetivo||'Objetivo por definir',weight=c.weight||c.peso||'';
    return `<article class="dcc-cl-card" data-name="${esc(c.name).toLowerCase()}" data-pending="${pendingCheck(c)?'1':'0'}"><div class="dcc-cl-info"><div class="dcc-cl-name">${esc(c.name)}</div><div class="dcc-cl-goal">${esc(goal)}</div>${weight?`<div class="dcc-cl-weight">${esc(weight)} kg</div>`:''}</div><div class="dcc-cl-training"><div class="dcc-cl-tr-title"><span class="dcc-cl-dumbbell">⌁</span> Entrenamiento</div><div class="dcc-cl-progress"><div class="dcc-cl-track"><div class="dcc-cl-fill" style="width:${p}%"></div></div><span class="dcc-cl-pct">${p}%</span></div></div><button class="dcc-cl-manage" onclick="openClient('${esc(c.id)}')">Gestionar<br>cliente</button></article>`;
  }
"""
new = """  function clientCard(c){
    const p=trainingProgress(c),goal=c.goal||c.objective||c.objetivo||'Objetivo por definir',weight=c.weight||c.peso||'',pending=pendingCheck(c)||needsPlan(c),id=esc(c.id);
    return `<article class="dcc-cl-card" data-name="${esc(c.name).toLowerCase()}" data-pending="${pending?'1':'0'}"><div class="dcc-cl-info"><div class="dcc-cl-name">${esc(c.name)}</div><div class="dcc-cl-goal">${esc(goal)}</div>${weight?`<div class="dcc-cl-weight">${esc(weight)} kg</div>`:''}</div><div class="dcc-cl-training"><div class="dcc-cl-tr-title"><span class="dcc-cl-dumbbell">⌁</span> Entrenamiento</div><div class="dcc-cl-progress"><div class="dcc-cl-track"><div class="dcc-cl-fill" style="width:${p}%"></div></div><span class="dcc-cl-pct">${p}%</span></div></div><button class="dcc-cl-manage" onclick="window.dccClientAdmin?dccClientAdmin('${id}','summary'):openClient('${id}')">Gestionar<br>cliente</button></article>`;
  }
"""
s = once(s, old, new, "client card pending and manage")
s = once(s, "<button onclick=\"toast('Calendario próximamente')\">${icon('calendar')}<span>Calendario</span></button>", "<button onclick=\"showCoach('calendar')\">${icon('calendar')}<span>Calendario</span></button>", "real calendar nav")
s = once(s, "const map={dashboard:0,clients:1,checkins:3,messages:4};", "const map={dashboard:0,clients:1,calendar:2,checkins:3,messages:4};", "calendar active nav")
write(p, s)


# Client administration: canonical body fat/activity, useful status, remote error handling and no dead history button.
p = "client-admin-premium.js"
s = read(p)
s = sub1(
    s,
    r"function findFatValues\(id,cl\)\{.*?\}function memberSince",
    "function findFatValues(id,cl){const out=[],push=x=>{const n=num(x);if(n===null||n<2||n>70)return;if(!out.length||Math.abs(out[out.length-1]-n)>.001)out.push(n)};push(cl?.initial_body_fat??cl?.bodyFatInitial??cl?.initialBodyFat);const hist=Array.isArray(data?.bodyFatHistory?.[id])?data.bodyFatHistory[id].slice():[];hist.sort((a,b)=>new Date(a?.recorded_at??a?.recordedAt??0)-new Date(b?.recorded_at??b?.recordedAt??0)).forEach(r=>push(r?.bodyFat??r?.body_fat));const x=data?.checkins?.[id]||{};push(x.bodyFat??x.body_fat);push(cl?.bodyFat??cl?.body_fat);return out}function memberSince",
    "canonical body fat series",
    re.S,
)
s = sub1(s, r"function memberSince\(cl\)\{.*?\}function clientAge", "function memberSince(cl){const r=cl?.created_at??cl?.createdAt??cl?.joined_at;if(!r)return'—';const d=new Date(r);return Number.isNaN(d.getTime())?'—':d.toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})}function clientAge", "valid member date", re.S)
s = sub1(
    s,
    r"function workouts30\(id\)\{.*?\}\s*function normalizeOptions",
    "function workoutStamp(x){return x?.workout_date??x?.date??x?.created_at??null}function workouts30(id){const h=data?.workoutHistory?.[id]||[],cut=Date.now()-30*864e5;return h.filter(x=>{const t=new Date(workoutStamp(x)||0).getTime();return Number.isFinite(t)&&t>=cut})}function lastWorkout(id){const h=data?.workoutHistory?.[id]||[];if(!h.length)return'Sin sesiones';const last=h.slice().sort((a,b)=>new Date(workoutStamp(b)||0)-new Date(workoutStamp(a)||0))[0],d=new Date(workoutStamp(last)||0);return Number.isFinite(d.getTime())?d.toLocaleDateString('es-ES',{day:'2-digit',month:'short'}):'Registrada'}function lastCheckin(id){const x=data?.checkins?.[id]||{},raw=x.sentAt??x.sent_at;if(!raw)return'Sin check-in';const d=new Date(raw);if(!Number.isFinite(d.getTime()))return x.reviewed?'Revisado':'Pendiente';return`${x.reviewed?'Revisado':'Pendiente'} · ${d.toLocaleDateString('es-ES',{day:'2-digit',month:'short'})}`}function normalizeOptions",
    "real activity and checkin",
    re.S,
)
s = sub1(
    s,
    r"async function persistDiet\(id,t\)\{.*?\}\nfunction foodPane",
    "async function persistDiet(id,t){const d=data?.diets?.[id]?.[t];if(!d)return false;try{if(!window.supabaseClient)throw new Error('Sin conexión con Supabase');const {error}=await supabaseClient.from('client_diets').upsert({client_id:id,diet_type:t,calories:d.calories||'',protein:d.protein||'',meals:d.meals||[],updated_at:new Date().toISOString()},{onConflict:'client_id,diet_type'});if(error)throw error;if(typeof saveData==='function')saveData();return true}catch(e){console.error('DCC guardando alimentación:',e);if(typeof toast==='function')toast('No se pudo guardar la alimentación');try{await window.loadDietsFromSupabase?.()}catch(_){}return false}}\nfunction foodPane",
    "diet persistence",
    re.S,
)
history = '<button class="dcc-tr-history" onclick="dccRoutineHistory(\'${id}\')"><b>↶ &nbsp; Rutina anterior</b><small>Consulta el histórico de rutinas de este cliente</small></button>'
if history not in s:
    raise SystemExit("routine history button: expected dead control")
s = s.replace(history, "", 1)
s = once(s, "${info('% grasa inicial',m.fi??'—')}${info('% grasa actual',m.fc??'—')}", "${info('Grasa corporal inicial',m.fi!=null?m.fi.toFixed(1).replace('.',',')+' %':'—')}${info('Grasa corporal actual',m.fc!=null?m.fc.toFixed(1).replace('.',',')+' %':'—')}", "coach fat units")
s = sub1(
    s,
    r"window\.dccSaveRoutine=async id=>\{.*?\};window\.dccRoutineHistory",
    "window.dccSaveRoutine=async id=>{try{if(!window.supabaseClient)throw new Error('Sin conexión con Supabase');const {error}=await supabaseClient.from('client_routines').upsert({client_id:id,routine:data.routines[id],updated_at:new Date().toISOString()},{onConflict:'client_id'});if(error)throw error;if(typeof saveData==='function')saveData();window.__dccTrainingEdit=false;delete window.__dccTrainingBackup;if(typeof toast==='function')toast('Rutina guardada');render(id,'training')}catch(e){console.error('DCC guardando rutina:',e);window.__dccTrainingEdit=true;if(typeof toast==='function')toast('No se pudo guardar la rutina');render(id,'training')}};window.dccRoutineHistory",
    "routine persistence",
    re.S,
)
write(p, s)


# Final quality layer: avoid needless rewrite loops and expose a deterministic refresh hook.
p = "coach-client-plan-status-v1.js"
s = read(p)
old = """  function installMetricEditors(){
    const weight=function(){const c=ensureActiveClient();if(c)openMetric(c.id,'weight')};weight.__dccQualityV5=true;window.updateClientWeight=weight;
    const fat=function(){const c=ensureActiveClient();if(c)openMetric(c.id,'bodyFat')};fat.__dccQualityV5=true;window.updateClientBodyFat=fat;
    const coachWeight=function(id){if(clientById(id))openMetric(id,'weight')};coachWeight.__dccQualityV5=true;window.addWeight=coachWeight;
  }
"""
new = """  function installMetricEditors(){
    if(!window.updateClientWeight?.__dccQualityV5){const weight=function(){const c=ensureActiveClient();if(c)openMetric(c.id,'weight')};weight.__dccQualityV5=true;window.updateClientWeight=weight}
    if(!window.updateClientBodyFat?.__dccQualityV5){const fat=function(){const c=ensureActiveClient();if(c)openMetric(c.id,'bodyFat')};fat.__dccQualityV5=true;window.updateClientBodyFat=fat}
    if(!window.addWeight?.__dccQualityV5){const coachWeight=function(id){if(clientById(id))openMetric(id,'weight')};coachWeight.__dccQualityV5=true;window.addWeight=coachWeight}
  }
"""
s = once(s, old, new, "metric editor stability")
s = once(s, "  function schedule(){if(queued)return;queued=true;requestAnimationFrame(patchCurrent)}", "  function schedule(){if(queued)return;queued=true;requestAnimationFrame(patchCurrent)}\n  window.dccQualityRefresh=schedule;", "quality refresh hook")
s = once(s, "    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});\n    setInterval(schedule,1500);", "    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});\n    setInterval(schedule,4000);", "quality observer")
write(p, s)


# Older body-fat module must not replace the final editor.
p = "client-metrics-sync-v10.js"
s = read(p)
s = once(s, "    if(current.__dccMetricsV11)return;", "    if(current.__dccQualityV5)return;\n    if(current.__dccMetricsV11)return;", "body fat editor precedence")
write(p, s)


# Calendar source parity and HTML escaping.
p = "coach-calendar-v12.js"
s = read(p)
s = once(s, '<label>Fecha<input id="dcc-cal-date" type="date" value="${date}"></label><label>Hora<input id="dcc-cal-time" type="time" value="09:00"></label>', '<label>Fecha<input id="dcc-cal-date" type="date" value=""></label><label>Hora<input id="dcc-cal-time" type="time" value=""></label>', "calendar blank defaults")
write(p, s)

p = "coach-calendar-form-fix-v15.js"
s = read(p)
s = once(s, "'\"':'&quot'", "'\"':'&quot;'", "calendar quote escape")
write(p, s)


# Guarantee premium new-client source is actually loaded and bust changed top-level scripts.
p = "index.html"
s = read(p)
admin_marker = '<script src="./client-admin-premium.js?v=20260910-2405"></script>'
if './new-client-premium-v1.js?' in s:
    s, n = re.subn(r'<script src="\./new-client-premium-v1\.js\?v=[^"]+"></script>', '<script src="./new-client-premium-v1.js?v=20260911-audit2"></script>', s, count=1)
    if n != 1:
        raise SystemExit("new-client cache bust failed")
    s = once(s, admin_marker, '<script src="./client-admin-premium.js?v=20260911-audit2"></script>', "admin cache bust")
else:
    s = once(s, admin_marker, '<script src="./new-client-premium-v1.js?v=20260911-audit2"></script>\n<script src="./client-admin-premium.js?v=20260911-audit2"></script>', "guarantee new-client load")
s = once(s, './coach-premium-v8.js?v=20260910-1654', './coach-premium-v8.js?v=20260911-audit2', "coach loader cache bust")
s = once(s, './coach-client-plan-status-v1.js?v=20260911-0610', './coach-client-plan-status-v1.js?v=20260911-audit2', "quality cache bust")
write(p, s)

print("Audit v27 patches applied")
