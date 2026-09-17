/* DCC coach dashboard authority v6 — tareas sincronizadas + presentación estable */
(function(){
  'use strict';
  const BUILD='20260917-dashboard-authority-v6-panel-detail';
  if(window.__dccCoachDashboardAuthority===BUILD)return;
  window.__dccCoachDashboardAuthority=BUILD;

  const CACHE='dcc:coach-dashboard-snapshot:v5';
  const STYLE_ID='dcc-dashboard-detail-v6';
  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const isDashboard=()=>window.currentApp==='coach'&&window.currentScreen==='dashboard';
  const norm=v=>String(v??'').trim().toLowerCase();
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch]));
  const initials=name=>{const p=String(name||'Cliente').trim().split(/\s+/).filter(Boolean);return (p.slice(0,2).map(x=>x.charAt(0)).join('')||'C').toUpperCase()};

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
html.dcc-theme-light-premium body #coach #dccP9Tasks .dcc-p9-row-icon{width:34px!important;height:34px!important;display:grid!important;place-items:center!important;justify-self:center!important;border:1px solid rgba(183,123,19,.26)!important;border-radius:50%!important;background:linear-gradient(145deg,#fff8e7,#f7dfaa)!important;color:#6f4a0d!important;font-size:11px!important;font-weight:900!important;letter-spacing:.2px!important;line-height:1!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #dccP9Attention .dcc-p9-inner.dcc-attention-empty{border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #dccP9Attention .dcc-p9-inner.dcc-attention-empty .dcc-p9-empty{width:100%!important;padding:11px 8px 14px!important;text-align:center!important;color:#656d78!important;font-size:10.5px!important}
`;(document.head||document.documentElement).appendChild(s)
  }

  function routineDays(id){const r=appData()?.routines?.[id];return Array.isArray(r)?r:(Array.isArray(r?.routine)?r.routine:[])}
  function routineComplete(id){const days=routineDays(id);return days.length>0&&days.every(day=>Array.isArray(day?.exercises)&&day.exercises.length>0)}
  function mealReady(meal){if(Array.isArray(meal?.options)&&meal.options.length)return meal.options.some(o=>Array.isArray(o?.foods)&&o.foods.length>0);return Array.isArray(meal?.foods)&&meal.foods.length>0}
  function dietDayComplete(day){return Array.isArray(day?.meals)&&day.meals.length>0&&day.meals.every(mealReady)}
  function dietComplete(id){
    const p=appData()?.diets?.[id];
    if(!p)return false;
    return dietDayComplete(p.training)||dietDayComplete(p.rest);
  }
  function pendingCheck(id){const x=appData()?.checkins?.[id];return !!((x?.sentAt??x?.sent_at)&&!x?.reviewed)}
  function pendingClient(c){return norm(c?.status)==='pendiente'}
  const latestWorkout=id=>{const h=appData()?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b?.date??b?.workout_date??b?.created_at??0)-new Date(a?.date??a?.workout_date??a?.created_at??0))[0]||null};
  const daysSince=v=>{if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null};

  function taskItems(){
    const cs=Array.isArray(appData()?.clients)?appData().clients:[];
    const items=[];
    cs.forEach(c=>{
      if(pendingCheck(c.id))items.push({kind:'checkin',id:String(c.id),name:String(c.name||'Cliente'),title:'REVISAR CHECK-IN'});
      if(!routineComplete(c.id))items.push({kind:'routine',id:String(c.id),name:String(c.name||'Cliente'),title:'COMPLETAR RUTINA'});
      if(!dietComplete(c.id))items.push({kind:'diet',id:String(c.id),name:String(c.name||'Cliente'),title:'COMPLETAR ALIMENTACIÓN'});
      if(pendingClient(c))items.push({kind:'client',id:String(c.id),name:String(c.name||'Cliente'),title:'REVISAR CLIENTE'});
    });
    return items;
  }

  function snapshot(){
    const cs=Array.isArray(appData()?.clients)?appData().clients:[];
    const items=taskItems();let attention=0;
    cs.forEach(c=>{const w=latestWorkout(c.id),gap=daysSince(w?.date??w?.workout_date??w?.created_at);if(gap!==null&&gap>=7)attention++});
    return {clients:cs.length,checkins:cs.filter(c=>pendingCheck(c.id)).length,tasks:items.length,items,attention,at:Date.now()};
  }

  function readCache(){try{return JSON.parse(localStorage.getItem(CACHE)||'null')}catch(_){return null}}
  function writeCache(s){try{localStorage.setItem(CACHE,JSON.stringify(s))}catch(_){}}
  function setCount(selector,value){const el=document.querySelector(selector);if(el&&String(el.textContent)!==String(value))el.textContent=String(value)}

  function openTask(item){
    if(item.kind==='checkin'&&typeof window.reviewCheckin==='function'){window.reviewCheckin(item.id);return}
    window.selectedClient=item.id;window.__dccClientAdminId=item.id;
    if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(item.id,item.kind==='diet'?'food':item.kind==='routine'?'training':'summary');
    else window.openClient?.(item.id);
  }

  function syncTaskRows(s){
    const body=document.querySelector('#dccP9Tasks .dcc-p9-body');if(!body)return;
    let inner=body.querySelector('.dcc-p9-inner');
    if(!inner){inner=document.createElement('div');inner.className='dcc-p9-inner';body.replaceChildren(inner)}
    const items=Array.isArray(s?.items)?s.items:[];
    const signature=items.map(x=>`${x.kind}:${x.id}:${x.name}`).join('|');
    if(inner.dataset.dccTaskAuthority===signature)return;
    inner.dataset.dccTaskAuthority=signature;inner.replaceChildren();
    if(!items.length){const e=document.createElement('div');e.className='dcc-p9-empty';e.innerHTML='<span class="dcc-p9-empty-i">✓</span><span>No tienes tareas pendientes.</span>';inner.appendChild(e);return}
    items.forEach(item=>{
      const b=document.createElement('button');b.type='button';b.className='dcc-p9-row';
      b.innerHTML=`<span class="dcc-p9-row-icon">${esc(initials(item.name))}</span><span class="dcc-p9-row-copy"><b>${esc(item.title)}</b><span>${esc(item.name)}</span></span><span class="dcc-p9-badge">PENDIENTE</span><span class="dcc-p9-arrow">›</span>`;
      b.addEventListener('click',()=>openTask(item));inner.appendChild(b);
    });
  }

  function syncAttentionState(s){
    const inner=document.querySelector('#dccP9Attention .dcc-p9-inner');if(!inner)return;
    inner.classList.toggle('dcc-attention-empty',Number(s?.attention||0)===0);
  }

  function patch(s,save){
    if(!isDashboard()||!s)return;
    installStyle();
    setCount('#dccP9Tasks .dcc-p9-count',s.tasks);setCount('#dccP9Attention .dcc-p9-count',s.attention);
    const stats=[...document.querySelectorAll('#coach-main .dcc-p9-stat strong')];if(stats[0])stats[0].textContent=String(s.clients);if(stats[1])stats[1].textContent=String(s.checkins);
    syncTaskRows(s);syncAttentionState(s);if(save)writeCache(s);
  }

  function patchCached(){const s=readCache();if(s)patch(s,false)}
  let queued=false;
  function patchLive(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patch(snapshot(),true)})}
  function wrap(name){const fn=window[name];if(typeof fn!=='function'||fn.__dccDashboardLiveV6)return false;const wrapped=async function(){const out=await fn.apply(this,arguments);patchLive();return out};wrapped.__dccDashboardLiveV6=true;wrapped.__base=fn;window[name]=wrapped;return true}
  function install(){
    installStyle();
    ['loadClientsFromSupabase','loadRoutinesFromSupabase','loadCheckinsFromSupabase','loadWorkoutHistoryFromSupabase','loadDietsFromSupabase'].forEach(wrap);
    if(isDashboard()){
      const live=snapshot();
      if(live.clients>0)patch(live,true);else patchCached();
    }
  }

  let tries=0;const timer=setInterval(()=>{tries++;install();if(tries>100)clearInterval(timer)},80);install();
  function observe(){const main=document.getElementById('coach-main');if(!main)return;new MutationObserver(()=>{if(isDashboard())patchLive()}).observe(main,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
  document.addEventListener('click',e=>{const t=norm(e.target?.closest?.('button')?.textContent||e.target?.textContent);if(t==='panel'||t.includes('tareas pendientes')||t.includes('requieren atención'))setTimeout(patchLive,0)},true);
  window.addEventListener('pageshow',()=>{install();patchCached();patchLive()});
})();
