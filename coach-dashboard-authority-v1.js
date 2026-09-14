/* DCC coach dashboard authority v3 — conteo único, inmediato y coherente de tareas */
(function(){
  'use strict';
  const BUILD='20260914-dashboard-authority-v3';
  if(window.__dccCoachDashboardAuthority===BUILD)return;
  window.__dccCoachDashboardAuthority=BUILD;

  const CACHE='dcc:coach-dashboard-snapshot:v3';
  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const isDashboard=()=>window.currentApp==='coach'&&window.currentScreen==='dashboard';
  const routineExists=id=>{const r=appData()?.routines?.[id];return Array.isArray(r)?r.length>0:Array.isArray(r?.routine)&&r.routine.length>0};
  const pendingCheck=id=>{const x=appData()?.checkins?.[id];return !!((x?.sentAt??x?.sent_at)&&!x?.reviewed)};
  const latestWorkout=id=>{const h=appData()?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b?.date??b?.workout_date??b?.created_at??0)-new Date(a?.date??a?.workout_date??a?.created_at??0))[0]||null};
  const daysSince=v=>{if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null};
  function dietIncomplete(id){
    const p=appData()?.diets?.[id];
    const training=Array.isArray(p?.training?.meals)?p.training.meals.length:0;
    const rest=Array.isArray(p?.rest?.meals)?p.rest.meals.length:0;
    return (training>0||rest>0)&&(training===0||rest===0);
  }

  function snapshot(){
    const cs=Array.isArray(appData()?.clients)?appData().clients:[];
    let tasks=0,attention=0;const dietTasks=[];
    cs.forEach(c=>{
      if(pendingCheck(c.id))tasks++;
      if(!routineExists(c.id))tasks++;
      if(dietIncomplete(c.id)){tasks++;dietTasks.push({id:String(c.id),name:String(c.name||'Cliente')})}
      const w=latestWorkout(c.id),gap=daysSince(w?.date??w?.workout_date??w?.created_at);
      if(gap!==null&&gap>=7)attention++;
    });
    return {clients:cs.length,checkins:cs.filter(c=>pendingCheck(c.id)).length,tasks,attention,dietTasks,at:Date.now()};
  }

  function readCache(){try{return JSON.parse(localStorage.getItem(CACHE)||'null')}catch(_){return null}}
  function writeCache(s){try{localStorage.setItem(CACHE,JSON.stringify(s))}catch(_){}}
  function setCount(rootSelector,value){const el=document.querySelector(rootSelector);if(el&&String(el.textContent)!==String(value))el.textContent=String(value)}

  function syncDietRows(s){
    const inner=document.querySelector('#dccP9Tasks .dcc-p9-inner');if(!inner)return;
    inner.querySelectorAll('[data-dcc-dashboard-diet-task]').forEach(x=>x.remove());
    const items=Array.isArray(s?.dietTasks)?s.dietTasks:[];
    if(!items.length)return;
    const empty=inner.querySelector('.dcc-p9-empty');if(empty)empty.remove();
    items.forEach(item=>{
      const b=document.createElement('button');b.type='button';b.className='dcc-p9-row';b.dataset.dccDashboardDietTask=item.id;
      b.innerHTML='<span class="dcc-p9-row-icon">!</span><span class="dcc-p9-row-copy"><b>COMPLETAR DIETA</b><span></span></span><span class="dcc-p9-badge">PENDIENTE</span><span class="dcc-p9-arrow">›</span>';
      const text=b.querySelector('.dcc-p9-row-copy span');if(text)text.textContent=item.name;
      b.addEventListener('click',()=>{if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(item.id,'food');else if(typeof window.openClient==='function')window.openClient(item.id)});
      inner.appendChild(b);
    });
  }

  function patch(s,save){
    if(!isDashboard())return;
    setCount('#dccP9Tasks .dcc-p9-count',s.tasks);
    setCount('#dccP9Attention .dcc-p9-count',s.attention);
    const stats=[...document.querySelectorAll('#coach-main .dcc-p9-stat strong')];
    if(stats[0])stats[0].textContent=String(s.clients);
    if(stats[1])stats[1].textContent=String(s.checkins);
    syncDietRows(s);
    if(save)writeCache(s);
  }

  function patchCached(){const s=readCache();if(s)patch(s,false)}
  let queued=false;
  function patchLive(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patch(snapshot(),true)})}

  function wrap(name){
    const fn=window[name];
    if(typeof fn!=='function'||fn.__dccDashboardLiveV3)return false;
    const wrapped=async function(){const out=await fn.apply(this,arguments);patchLive();return out};
    wrapped.__dccDashboardLiveV3=true;wrapped.__base=fn;window[name]=wrapped;return true;
  }

  function install(){
    ['loadClientsFromSupabase','loadRoutinesFromSupabase','loadCheckinsFromSupabase','loadWorkoutHistoryFromSupabase','loadDietsFromSupabase'].forEach(wrap);
    if(isDashboard()){
      const cached=readCache();
      if(cached)patch(cached,false);
      /* El estado local se calcula en el mismo ciclo: no espera a un clic ni a un repintado completo. */
      patch(snapshot(),true);
    }
  }

  let tries=0;const timer=setInterval(()=>{tries++;install();if(tries>100)clearInterval(timer)},80);
  install();
  window.addEventListener('pageshow',()=>{install();patchCached();patchLive()});
})();
