/* DCC coach dashboard authority v2 — panel counts without delayed rerenders */
(function(){
  'use strict';
  const BUILD='20260914-dashboard-authority-v2';
  if(window.__dccCoachDashboardAuthority===BUILD)return;
  window.__dccCoachDashboardAuthority=BUILD;

  const CACHE='dcc:coach-dashboard-snapshot:v2';
  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const isDashboard=()=>window.currentApp==='coach'&&window.currentScreen==='dashboard';
  const routineExists=id=>{const r=appData()?.routines?.[id];return Array.isArray(r)?r.length>0:Array.isArray(r?.routine)&&r.routine.length>0};
  const pendingCheck=id=>{const x=appData()?.checkins?.[id];return !!((x?.sentAt??x?.sent_at)&&!x?.reviewed)};
  const latestWorkout=id=>{const h=appData()?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b?.date??b?.workout_date??b?.created_at??0)-new Date(a?.date??a?.workout_date??a?.created_at??0))[0]||null};
  const daysSince=v=>{if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null};

  function snapshot(){
    const cs=Array.isArray(appData()?.clients)?appData().clients:[];
    let tasks=0,attention=0;
    cs.forEach(c=>{
      if(pendingCheck(c.id))tasks++;
      if(!routineExists(c.id))tasks++;
      const w=latestWorkout(c.id),gap=daysSince(w?.date??w?.workout_date??w?.created_at);
      if(gap!==null&&gap>=7)attention++;
    });
    return {clients:cs.length,checkins:cs.filter(c=>pendingCheck(c.id)).length,tasks,attention,at:Date.now()};
  }

  function readCache(){try{return JSON.parse(localStorage.getItem(CACHE)||'null')}catch(_){return null}}
  function writeCache(s){try{localStorage.setItem(CACHE,JSON.stringify(s))}catch(_){}}
  function setCount(rootSelector,value){const el=document.querySelector(rootSelector);if(el&&String(el.textContent)!==String(value))el.textContent=String(value)}
  function patch(s,save){
    if(!isDashboard())return;
    setCount('#dccP9Tasks .dcc-p9-count',s.tasks);
    setCount('#dccP9Attention .dcc-p9-count',s.attention);
    const stats=[...document.querySelectorAll('#coach-main .dcc-p9-stat strong')];
    if(stats[0])stats[0].textContent=String(s.clients);
    if(stats[1])stats[1].textContent=String(s.checkins);
    if(save)writeCache(s);
  }

  function patchCached(){const s=readCache();if(s)patch(s,false)}
  let queued=false;
  function patchLive(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patch(snapshot(),true)})}

  function wrap(name){
    const fn=window[name];
    if(typeof fn!=='function'||fn.__dccDashboardLiveV2)return false;
    const wrapped=async function(){const out=await fn.apply(this,arguments);patchLive();return out};
    wrapped.__dccDashboardLiveV2=true;wrapped.__base=fn;window[name]=wrapped;return true;
  }

  function install(){
    ['loadClientsFromSupabase','loadRoutinesFromSupabase','loadCheckinsFromSupabase','loadWorkoutHistoryFromSupabase'].forEach(wrap);
    if(isDashboard()){patchCached();setTimeout(patchLive,0)}
  }

  let tries=0;const timer=setInterval(()=>{tries++;install();if(tries>100)clearInterval(timer)},80);
  install();
  document.addEventListener('click',()=>{if(isDashboard())setTimeout(patchCached,0)},true);
  window.addEventListener('pageshow',()=>{install();patchCached()});
})();