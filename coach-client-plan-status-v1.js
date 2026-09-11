/* DCC — alta de clientes, planes pendientes, alimentos a evitar y grasa corporal */
(function(){
  'use strict';
  if(window.__dccCoachClientPlanStatusV3)return;
  window.__dccCoachClientPlanStatusV3=true;

  const dataRef=()=>{try{return data||{}}catch(e){return window.data||{}};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const fmt=v=>Number(v).toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1});

  function addCss(){
    if(document.getElementById('dcc-plan-status-v3-css'))return;
    const s=document.createElement('style');
    s.id='dcc-plan-status-v3-css';
    s.textContent=`
      #coach-main .dcc-plan-status-v3{margin:11px 0 13px;padding:12px 13px;border:1px solid rgba(224,173,76,.55);border-radius:16px;background:radial-gradient(circle at 100% 0,rgba(224,173,76,.10),transparent 42%),linear-gradient(145deg,#12171b,#090d10);box-shadow:0 10px 24px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.025)}
      #coach-main .dcc-plan-status-head{display:flex;align-items:center;gap:10px;margin-bottom:8px;color:#efbd54;font-size:10px;font-weight:850;letter-spacing:1.7px;text-transform:uppercase}
      #coach-main .dcc-plan-status-icon{width:28px;height:28px;display:grid;place-items:center;border:1px solid rgba(224,173,76,.48);border-radius:9px;background:rgba(224,173,76,.08);color:#f2c85f;font-size:16px}
      #coach-main .dcc-plan-status-list{display:grid;gap:7px}
      #coach-main .dcc-plan-status-item{width:100%;display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:8px;padding:9px 10px;border:1px solid #29323a;border-radius:12px;background:#0a0f13;color:#f5f3ef;text-align:left}
      #coach-main .dcc-plan-status-item strong{display:block;font-size:12px}
      #coach-main .dcc-plan-status-item small{display:block;margin-top:2px;color:#929ba6;font-size:9px;line-height:1.25}
      #coach-main .dcc-plan-status-item .mark,#coach-main .dcc-plan-status-item .go{color:#efbd54;font-size:18px}
      #coach-main .dcc-foods-avoid-v3{margin:0 0 10px;padding:13px 14px;border:1px solid rgba(224,173,76,.34);border-radius:16px;background:linear-gradient(145deg,#0f1519,#090d10)}
      #coach-main .dcc-foods-avoid-v3 small{display:block;color:#efbd54;font-size:9px;font-weight:850;letter-spacing:1.7px;text-transform:uppercase}
      #coach-main .dcc-foods-avoid-v3 b{display:block;margin-top:6px;color:#f5f3ef;font-size:13px;line-height:1.4;font-weight:720}
      #coach-main .dcc-fat-down,#client-main .dcc-fat-down{color:#58e3a7!important}
      #coach-main .dcc-fat-up,#client-main .dcc-fat-up{color:#ff757c!important}
    `;
    document.head.appendChild(s);
  }

  function coachClient(){
    const d=dataRef(),root=document.querySelector('#coach-main .dcc-ca-wrap');
    if(!root)return null;
    const shownName=(root.querySelector('.dcc-ca-head h1')?.textContent||'').trim().toLowerCase();
    if(shownName){
      const byName=(d.clients||[]).find(c=>String(c.name||'').trim().toLowerCase()===shownName);
      if(byName)return byName;
    }
    for(const key of ['__dccClientAdminId','selectedClient','dccClientAdminId','openCoachClientId']){
      const id=window[key];
      if(id){const hit=(d.clients||[]).find(c=>String(c.id)===String(id));if(hit)return hit}
    }
    return null;
  }

  function mealReady(meal){
    if(Array.isArray(meal?.options)&&meal.options.length)return meal.options.some(o=>Array.isArray(o?.foods)&&o.foods.length>0);
    return Array.isArray(meal?.foods)&&meal.foods.length>0;
  }
  function dietReady(id){
    const diet=dataRef().diets?.[id];
    return !!diet&&['training','rest'].every(type=>{
      const meals=diet?.[type]?.meals;
      return Array.isArray(meals)&&meals.length>0&&meals.every(mealReady);
    });
  }
  function routineReady(id){
    const r=dataRef().routines?.[id];
    return Array.isArray(r)&&r.length>0&&r.every(day=>Array.isArray(day?.exercises)&&day.exercises.length>0);
  }
  function checkinPending(id){
    const x=dataRef().checkins?.[id];
    return !!(x?.sentAt&&!x?.reviewed);
  }

  function openProfileTab(kind){
    const label=kind==='diet'?'alimenta':'entrena';
    const tab=[...document.querySelectorAll('#coach-main .dcc-ca-tab')].find(x=>(x.textContent||'').toLowerCase().includes(label));
    tab?.click();
  }
  window.dccOpenPendingPlanTab=openProfileTab;
  window.dccOpenCoachPlanTask=function(id,kind){
    window.selectedClient=id;window.__dccClientAdminId=id;
    try{window.openClient?.(id)}catch(e){window.showClientAdmin?.(id)}
    setTimeout(()=>openProfileTab(kind),70);
  };

  function renderProfileWarnings(){
    const root=document.querySelector('#coach-main .dcc-ca-wrap');
    if(!root)return;
    const c=coachClient();if(!c)return;
    window.__dccClientAdminId=c.id;
    const pending=[];
    if(!dietReady(c.id))pending.push({kind:'diet',title:'Alimentación sin terminar',sub:'Completa la alimentación de entrenamiento y descanso.'});
    if(!routineReady(c.id))pending.push({kind:'routine',title:'Rutina sin terminar',sub:'Completa los días y ejercicios de la rutina.'});
    const sig=String(c.id)+'|'+pending.map(x=>x.kind).join(',');
    const old=root.querySelector('.dcc-plan-status-v1,.dcc-plan-status-v2,.dcc-plan-status-v3');
    if(!pending.length){old?.remove();root.dataset.dccPlanStatusSig=sig;return}
    if(old?.classList.contains('dcc-plan-status-v3')&&root.dataset.dccPlanStatusSig===sig)return;
    old?.remove();
    const box=document.createElement('section');
    box.className='dcc-plan-status-v3';
    box.innerHTML=`<div class="dcc-plan-status-head"><span class="dcc-plan-status-icon">!</span><span>Plan pendiente de completar</span></div><div class="dcc-plan-status-list">${pending.map(p=>`<button type="button" class="dcc-plan-status-item" onclick="dccOpenPendingPlanTab('${p.kind}')"><span class="mark">!</span><span><strong>${p.title}</strong><small>${p.sub}</small></span><span class="go">›</span></button>`).join('')}</div>`;
    const metrics=root.querySelector('.dcc-ca-metrics'),tabs=root.querySelector('.dcc-ca-tabs');
    if(metrics)metrics.insertAdjacentElement('afterend',box);else tabs?.insertAdjacentElement('beforebegin',box);
    root.dataset.dccPlanStatusSig=sig;
  }

  function renderFoods(){
    const root=document.querySelector('#coach-main .dcc-ca-wrap');if(!root)return;
    const old=root.querySelector('.dcc-foods-avoid-v3,.dcc-foods-avoid-v2');
    const summary=(root.querySelector('.dcc-ca-tab.active')?.textContent||'').toLowerCase().includes('resumen');
    if(!summary){old?.remove();return}
    const c=coachClient();if(!c){old?.remove();return}
    const foods=String(c.foodsToAvoid??c.foods_to_avoid??'').trim(),sig=String(c.id)+'|'+foods;
    if(old?.classList.contains('dcc-foods-avoid-v3')&&old.dataset.sig===sig)return;
    old?.remove();
    const card=document.createElement('section');card.className='dcc-foods-avoid-v3';card.dataset.sig=sig;
    card.innerHTML=`<small>Alimentos a evitar</small><b>${foods?esc(foods):'No se han indicado alimentos a evitar.'}</b>`;
    root.querySelector('.dcc-ca-tabs')?.insertAdjacentElement('afterend',card);
  }

  function taskHtml(t){
    const id=String(t.id).replace(/'/g,"\\'");
    const action=t.kind==='checkin'?`reviewCheckin('${id}')`:`dccOpenCoachPlanTask('${id}','${t.kind}')`;
    return `<button type="button" class="dcc-p9-row" onclick="${action}"><span class="dcc-p9-row-icon">${t.icon}</span><span class="dcc-p9-row-copy"><b>${esc(t.title)}</b><span>${esc(t.name)}</span></span><span class="dcc-p9-badge">PENDIENTE</span><span class="dcc-p9-arrow">›</span></button>`;
  }
  function patchDashboard(){
    const panel=document.getElementById('dccP9Tasks');if(!panel)return;
    const tasks=[];
    (dataRef().clients||[]).forEach(c=>{
      if(checkinPending(c.id))tasks.push({id:c.id,kind:'checkin',icon:'✓',title:'REVISAR CHECK-IN',name:c.name});
      if(!dietReady(c.id))tasks.push({id:c.id,kind:'diet',icon:'🍴',title:'CREAR ALIMENTACIÓN',name:c.name});
      if(!routineReady(c.id))tasks.push({id:c.id,kind:'routine',icon:'＋',title:'CREAR RUTINA',name:c.name});
    });
    panel.querySelector('.dcc-p9-count')?.replaceChildren(document.createTextNode(String(tasks.length)));
    const body=panel.querySelector('.dcc-p9-body');if(!body)return;
    const sig=tasks.map(t=>`${t.id}:${t.kind}`).join('|');if(panel.dataset.dccPlanTaskSig===sig)return;
    body.innerHTML=tasks.length?`<div class="dcc-p9-inner">${tasks.map(taskHtml).join('')}</div>`:`<div class="dcc-p9-inner"><div class="dcc-p9-empty"><span class="dcc-p9-empty-i">✓</span><span>No tienes tareas pendientes.</span></div></div>`;
    panel.dataset.dccPlanTaskSig=sig;
  }

  function patchNewClientForm(){
    const root=document.getElementById('dcc-new-client-premium');if(!root)return;
    const label=[...root.querySelectorAll('.dcc-nc-label')].find(x=>/%\s*de\s*grasa\s*inicial/i.test(x.textContent||''));
    const text=label?.querySelector('span:last-child');if(text)text.textContent='Grasa corporal inicial';
  }

  function installCreateFlow(){
    const base=window.createClient;if(typeof base!=='function'||base.__dccContinueSetupV3)return;
    const fn=async function(){
      const before=new Set((dataRef().clients||[]).map(c=>String(c.id)));
      const result=await base.apply(this,arguments);
      const created=(dataRef().clients||[]).find(c=>!before.has(String(c.id)));
      if(created){
        window.selectedClient=created.id;window.__dccClientAdminId=created.id;
        setTimeout(()=>{try{window.openClient?.(created.id)}catch(e){window.showClientAdmin?.(created.id)}},90);
      }
      return result;
    };
    fn.__dccContinueSetupV3=true;fn.__base=base;window.createClient=fn;
  }

  function initialFat(c){for(const v of [c?.bodyFatInitial,c?.initialBodyFat,c?.initial_body_fat]){const n=num(v);if(n!=null&&n>0&&n<70)return n}return null}
  function fatSeries(id){
    const d=dataRef(),c=(d.clients||[]).find(x=>String(x.id)===String(id)),a=[];
    const push=v=>{const n=num(v);if(n==null||n<=0||n>=70)return;if(!a.length||Math.abs(a[a.length-1]-n)>.001)a.push(n)};
    push(initialFat(c));(Array.isArray(d.bodyFatHistory?.[id])?d.bodyFatHistory[id]:[]).forEach(r=>push(r?.bodyFat??r?.body_fat));
    const x=d.checkins?.[id]||{};push(x.bodyFat??x.body_fat??c?.bodyFat??c?.body_fat);return a;
  }
  function cleanLegacy(el){
    if(!el)return;const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];while(w.nextNode())nodes.push(w.currentNode);
    nodes.forEach(n=>n.nodeValue=String(n.nodeValue||'').replace(/(\d+(?:[.,]\d+)?)\s*(?:pts?\.?|ptas?\.?|puntos?)\b/gi,'$1 %'));
  }
  function patchFat(){
    const root=document.querySelector('#coach-main .dcc-ca-wrap'),c=coachClient();
    if(root&&c){
      const s=fatSeries(c.id);if(s.length){
        const initial=s[0],current=s[s.length-1],delta=current-initial;
        const metric=[...root.querySelectorAll('.dcc-ca-metric')].find(x=>/grasa/i.test(x.querySelector('small')?.textContent||''));
        if(metric){
          const value=metric.querySelector('b');if(value)value.textContent=`${fmt(current)} %`;
          const trend=metric.querySelector('.dcc-ca-trend');if(trend){
            trend.classList.remove('dcc-fat-down','dcc-fat-up','good');
            if(Math.abs(delta)<.05)trend.textContent='Sin cambios desde el inicio';
            else if(delta<0){trend.textContent=`↓ ${fmt(Math.abs(delta))} % desde el inicio`;trend.classList.add('dcc-fat-down','good')}
            else{trend.textContent=`↑ ${fmt(Math.abs(delta))} % desde el inicio`;trend.classList.add('dcc-fat-up')}
          }
        }
      }
    }
    document.querySelectorAll('#coach-main .dcc-ca-trend,#coach-main .dcc-bfh-delta,#dcc-ci-modal .dcc-ci-rside,#client-main .dcpr6-chip,#client-main .dcpr6-chart-badge').forEach(cleanLegacy);
  }

  let queued=false;
  function run(){queued=false;installCreateFlow();patchNewClientForm();renderProfileWarnings();renderFoods();patchDashboard();patchFat()}
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(run)}
  function boot(){addCss();installCreateFlow();schedule();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});setInterval(schedule,1200)}
  document.addEventListener('click',()=>{setTimeout(schedule,0);setTimeout(schedule,120)},true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
