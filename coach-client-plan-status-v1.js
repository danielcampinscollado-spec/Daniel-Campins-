/* DCC — perfil entrenador: flujo de alta, planes pendientes, alimentos a evitar y % de grasa claro */
(function(){
  'use strict';
  if(window.__dccCoachClientPlanStatusV2)return;
  window.__dccCoachClientPlanStatusV2=true;

  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const fmt=v=>{const n=Number(v);return Number.isFinite(n)?n.toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1}):'—'};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const appData=()=>{try{return data||{}}catch(e){return window.data||{}};

  function css(){
    if(document.getElementById('dcc-plan-status-v2-css'))return;
    const s=document.createElement('style');
    s.id='dcc-plan-status-v2-css';
    s.textContent=`
      #coach-main .dcc-plan-status-v2{margin:11px 0 13px;padding:12px 13px;border:1px solid rgba(224,173,76,.55);border-radius:16px;background:radial-gradient(circle at 100% 0,rgba(224,173,76,.10),transparent 42%),linear-gradient(145deg,#12171b,#090d10);box-shadow:0 10px 24px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.025)}
      #coach-main .dcc-plan-status-head{display:flex;align-items:center;gap:10px;margin-bottom:8px;color:#efbd54;font-size:10px;font-weight:850;letter-spacing:1.7px;text-transform:uppercase}
      #coach-main .dcc-plan-status-icon{width:28px;height:28px;display:grid;place-items:center;border:1px solid rgba(224,173,76,.48);border-radius:9px;background:rgba(224,173,76,.08);color:#f2c85f;font-size:16px;line-height:1}
      #coach-main .dcc-plan-status-list{display:grid;gap:7px}
      #coach-main .dcc-plan-status-item{width:100%;display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:8px;padding:9px 10px;border:1px solid #29323a;border-radius:12px;background:#0a0f13;color:#f5f3ef;text-align:left}
      #coach-main .dcc-plan-status-item strong{display:block;font-size:12px}
      #coach-main .dcc-plan-status-item small{display:block;margin-top:2px;color:#929ba6;font-size:9px;line-height:1.25}
      #coach-main .dcc-plan-status-item .mark{color:#efbd54;font-size:17px;text-align:center}
      #coach-main .dcc-plan-status-item .go{color:#efbd54;font-size:18px}
      #coach-main .dcc-foods-avoid-v2{margin:0 0 10px;padding:13px 14px;border:1px solid rgba(224,173,76,.34);border-radius:16px;background:linear-gradient(145deg,#0f1519,#090d10)}
      #coach-main .dcc-foods-avoid-v2 small{display:block;color:#efbd54;font-size:9px;font-weight:850;letter-spacing:1.7px;text-transform:uppercase}
      #coach-main .dcc-foods-avoid-v2 b{display:block;margin-top:6px;color:#f5f3ef;font-size:13px;line-height:1.4;font-weight:720}
      #coach-main .dcc-ca-trend.dcc-fat-down,#dcc-ci-modal .dcc-ci-rside.dcc-fat-down,#client-main .dcpr6-chip.dcc-fat-down{color:#58e3a7!important}
      #coach-main .dcc-ca-trend.dcc-fat-up,#dcc-ci-modal .dcc-ci-rside.dcc-fat-up,#client-main .dcpr6-chip.dcc-fat-up{color:#ff757c!important}
    `;
    document.head.appendChild(s);
  }

  function activeCoachClient(){
    const d=appData();
    const root=document.querySelector('#coach-main .dcc-ca-wrap');
    if(!root)return null;
    const candidates=[];
    try{if(typeof currentClientId!=='undefined'&&currentClientId)candidates.push(currentClientId)}catch(e){}
    for(const key of ['__dccClientAdminId','dccClientAdminId','openCoachClientId','selectedClient'])if(window[key])candidates.push(window[key]);
    for(const id of candidates){const c=(d.clients||[]).find(x=>String(x.id)===String(id));if(c)return c}
    const name=(root.querySelector('.dcc-ca-head h1')?.textContent||'').trim().toLowerCase();
    if(name)return(d.clients||[]).find(x=>String(x.name||'').trim().toLowerCase()===name)||null;
    return null;
  }

  function mealHasFood(meal){
    if(!meal)return false;
    if(Array.isArray(meal.options)&&meal.options.length){
      return meal.options.some(o=>Array.isArray(o?.foods)&&o.foods.length>0);
    }
    return Array.isArray(meal.foods)&&meal.foods.length>0;
  }

  function dietComplete(id){
    const diet=appData().diets?.[id];
    if(!diet)return false;
    return ['training','rest'].every(type=>{
      const meals=diet?.[type]?.meals;
      return Array.isArray(meals)&&meals.length>0&&meals.every(mealHasFood);
    });
  }

  function routineComplete(id){
    const routine=appData().routines?.[id];
    return Array.isArray(routine)&&routine.length>0&&routine.every(day=>Array.isArray(day?.exercises)&&day.exercises.length>0);
  }

  function pendingCheckin(id){
    const x=appData().checkins?.[id];
    return !!(x?.sentAt&&!x?.reviewed);
  }

  function openTab(label){
    const tabs=[...document.querySelectorAll('#coach-main .dcc-ca-tab')];
    const tab=tabs.find(x=>(x.textContent||'').toLowerCase().includes(label));
    if(tab)tab.click();
  }
  window.dccOpenPendingPlanTab=function(kind){openTab(kind==='diet'?'alimenta':'entrena')};
  window.dccOpenCoachPlanTask=function(id,kind){
    window.selectedClient=id;
    window.__dccClientAdminId=id;
    try{
      if(typeof window.openClient==='function')window.openClient(id);
      else if(typeof window.showClientAdmin==='function')window.showClientAdmin(id);
    }catch(e){console.warn('DCC abriendo cliente:',e)}
    setTimeout(()=>window.dccOpenPendingPlanTab?.(kind),60);
  };

  function renderPlanStatus(){
    css();
    const root=document.querySelector('#coach-main .dcc-ca-wrap');
    if(!root)return;
    const client=activeCoachClient();
    if(!client)return;
    window.__dccClientAdminId=client.id;
    const pending=[];
    if(!dietComplete(client.id))pending.push({kind:'diet',title:'Alimentación sin terminar',sub:'Completa la dieta de entrenamiento y descanso.'});
    if(!routineComplete(client.id))pending.push({kind:'routine',title:'Rutina sin terminar',sub:'Completa todos los días y sus ejercicios.'});
    const sig=String(client.id)+'|'+pending.map(x=>x.kind).join(',');
    const old=root.querySelector('.dcc-plan-status-v2,.dcc-plan-status-v1');
    if(!pending.length){if(old)old.remove();root.dataset.dccPlanStatusSig=sig;return}
    if(old&&root.dataset.dccPlanStatusSig===sig&&old.classList.contains('dcc-plan-status-v2'))return;
    if(old)old.remove();
    const box=document.createElement('section');
    box.className='dcc-plan-status-v2';
    box.innerHTML=`<div class="dcc-plan-status-head"><span class="dcc-plan-status-icon">!</span><span>Plan pendiente de completar</span></div><div class="dcc-plan-status-list">${pending.map(p=>`<button type="button" class="dcc-plan-status-item" onclick="dccOpenPendingPlanTab('${p.kind}')"><span class="mark">!</span><span><strong>${p.title}</strong><small>${p.sub}</small></span><span class="go">›</span></button>`).join('')}</div>`;
    const metrics=root.querySelector('.dcc-ca-metrics');
    const tabs=root.querySelector('.dcc-ca-tabs');
    if(metrics)metrics.insertAdjacentElement('afterend',box);else if(tabs)tabs.insertAdjacentElement('beforebegin',box);else root.prepend(box);
    root.dataset.dccPlanStatusSig=sig;
  }

  function renderFoodsToAvoid(){
    const root=document.querySelector('#coach-main .dcc-ca-wrap');
    if(!root)return;
    const old=root.querySelector('.dcc-foods-avoid-v2');
    const active=(root.querySelector('.dcc-ca-tab.active')?.textContent||'').toLowerCase();
    if(!active.includes('resumen')){old?.remove();return}
    const client=activeCoachClient();
    if(!client){old?.remove();return}
    const foods=String(client.foodsToAvoid??client.foods_to_avoid??'').trim();
    const sig=String(client.id)+'|'+foods;
    if(old&&old.dataset.sig===sig)return;
    old?.remove();
    const card=document.createElement('section');
    card.className='dcc-foods-avoid-v2';
    card.dataset.sig=sig;
    card.innerHTML=`<small>Alimentos a evitar</small><b>${foods?esc(foods):'No se han indicado alimentos a evitar.'}</b>`;
    const tabs=root.querySelector('.dcc-ca-tabs');
    if(tabs)tabs.insertAdjacentElement('afterend',card);else root.appendChild(card);
  }

  function dashboardTaskRow(item){
    const action=item.kind==='checkin'
      ? `reviewCheckin('${String(item.id).replace(/'/g,"\\'")}')`
      : `dccOpenCoachPlanTask('${String(item.id).replace(/'/g,"\\'")}','${item.kind}')`;
    return `<button type="button" class="dcc-p9-row" onclick="${action}"><span class="dcc-p9-row-icon">${item.icon}</span><span class="dcc-p9-row-copy"><b>${esc(item.title)}</b><span>${esc(item.name)}</span></span><span class="dcc-p9-badge">PENDIENTE</span><span class="dcc-p9-arrow">›</span></button>`;
  }

  function patchDashboardTasks(){
    const panel=document.getElementById('dccP9Tasks');
    if(!panel)return;
    const d=appData(),clients=Array.isArray(d.clients)?d.clients:[],tasks=[];
    clients.forEach(c=>{
      if(pendingCheckin(c.id))tasks.push({id:c.id,kind:'checkin',icon:'✓',title:'REVISAR CHECK-IN',name:c.name});
      if(!dietComplete(c.id))tasks.push({id:c.id,kind:'diet',icon:'🍴',title:'CREAR ALIMENTACIÓN',name:c.name});
      if(!routineComplete(c.id))tasks.push({id:c.id,kind:'routine',icon:'＋',title:'CREAR RUTINA',name:c.name});
    });
    const sig=tasks.map(t=>`${t.id}:${t.kind}`).join('|');
    const count=panel.querySelector('.dcc-p9-count');
    if(count)count.textContent=String(tasks.length);
    const body=panel.querySelector('.dcc-p9-body');
    if(!body||panel.dataset.dccPlanTaskSig===sig)return;
    body.innerHTML=tasks.length
      ? `<div class="dcc-p9-inner">${tasks.map(dashboardTaskRow).join('')}</div>`
      : `<div class="dcc-p9-inner"><div class="dcc-p9-empty"><span class="dcc-p9-empty-i">✓</span><span>No tienes tareas pendientes.</span></div></div>`;
    panel.dataset.dccPlanTaskSig=sig;
  }

  function patchNewClientLabel(){
    const root=document.getElementById('dcc-new-client-premium');
    if(!root)return;
    const labels=[...root.querySelectorAll('.dcc-nc-label')];
    const fat=labels.find(x=>/%\s*de\s*grasa\s*inicial/i.test(x.textContent||''));
    if(!fat)return;
    const textSpan=fat.querySelector('span:last-child');
    if(textSpan)textSpan.textContent='Grasa corporal inicial';
  }

  function installCreateClientFlow(){
    const base=window.createClient;
    if(typeof base!=='function'||base.__dccContinueClientSetupV2)return;
    const wrapped=async function(){
      const before=new Set((appData().clients||[]).map(c=>String(c.id)));
      const result=await base.apply(this,arguments);
      const created=(appData().clients||[]).find(c=>!before.has(String(c.id)));
      if(created){
        window.selectedClient=created.id;
        window.__dccClientAdminId=created.id;
        setTimeout(()=>{
          try{
            if(typeof window.openClient==='function')window.openClient(created.id);
            else if(typeof window.showClientAdmin==='function')window.showClientAdmin(created.id);
          }catch(e){console.warn('DCC continuando alta de cliente:',e)}
        },80);
      }
      return result;
    };
    wrapped.__dccContinueClientSetupV2=true;
    wrapped.__base=base;
    window.createClient=wrapped;
  }

  function initialFat(c){
    for(const v of [c?.bodyFatInitial,c?.initialBodyFat,c?.initial_body_fat,c?.initialFat,c?.fatInitial]){const n=num(v);if(n!=null&&n>0&&n<70)return n}
    return null;
  }
  function fatSeries(id){
    const d=appData(),c=(d.clients||[]).find(x=>String(x.id)===String(id)),out=[];
    const push=v=>{const n=num(v);if(n==null||n<=0||n>=70)return;if(out.length&&Math.abs(out[out.length-1]-n)<.001)return;out.push(n)};
    push(initialFat(c));
    const rows=Array.isArray(d.bodyFatHistory?.[id])?d.bodyFatHistory[id]:[];
    rows.forEach(r=>push(r?.bodyFat??r?.body_fat));
    const x=d.checkins?.[id]||{};push(x.bodyFat??x.body_fat??c?.bodyFat??c?.body_fat);
    return out;
  }

  function replaceLegacyUnit(text){
    return String(text||'').replace(/(\d+(?:[.,]\d+)?)\s*(?:pts?\.?|ptas?\.?|puntos?)\b/gi,'$1 %');
  }
  function cleanNode(el){
    if(!el)return;
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{const next=replaceLegacyUnit(n.nodeValue);if(next!==n.nodeValue)n.nodeValue=next});
  }

  function patchFatCoach(){
    const root=document.querySelector('#coach-main .dcc-ca-wrap');
    const client=activeCoachClient();
    if(root&&client){
      const s=fatSeries(client.id);
      if(s.length){
        const initial=s[0],current=s[s.length-1],delta=current-initial;
        const metric=[...root.querySelectorAll('.dcc-ca-metric')].find(el=>/grasa/i.test(el.querySelector('small')?.textContent||''));
        if(metric){
          const value=metric.querySelector('b');if(value)value.textContent=`${fmt(current)} %`;
          const trend=metric.querySelector('.dcc-ca-trend');
          if(trend){
            trend.classList.remove('dcc-fat-down','dcc-fat-up','good','bad');
            if(Math.abs(delta)<.05)trend.textContent='Sin cambios desde el inicio';
            else if(delta<0){trend.textContent=`↓ ${fmt(Math.abs(delta))} % desde el inicio`;trend.classList.add('dcc-fat-down','good')}
            else{trend.textContent=`↑ ${fmt(Math.abs(delta))} % desde el inicio`;trend.classList.add('dcc-fat-up','bad')}
          }
        }
      }
    }
    document.querySelectorAll('#coach-main .dcc-ca-trend,#coach-main .dcc-bfh-delta,#dcc-ci-modal .dcc-ci-rside,#dcc-ci-modal .dcc-ci-review-row').forEach(cleanNode);
  }

  function patchFatClient(){
    const d=appData();let id=null;try{id=typeof currentClientId!=='undefined'?currentClientId:null}catch(e){id=window.currentClientId||null}
    if(!id)return;
    const s=fatSeries(id);if(!s.length)return;
    const initial=s[0],current=s[s.length-1],delta=current-initial;
    const root=document.querySelector('#client-main .dcpr6');
    if(root){
      const card=root.querySelector('.dcpr6-metrics .dcpr6-metric:nth-child(2)');
      if(card){
        const chip=card.querySelector('.dcpr6-chip');
        if(chip){
          chip.classList.remove('dcc-fat-down','dcc-fat-up');
          if(Math.abs(delta)<.05)chip.textContent='Sin cambios';
          else if(delta<0){chip.textContent=`↓ ${fmt(Math.abs(delta))} % desde el inicio`;chip.classList.add('dcc-fat-down')}
          else{chip.textContent=`↑ ${fmt(Math.abs(delta))} % desde el inicio`;chip.classList.add('dcc-fat-up')}
        }
      }
      cleanNode(root);
    }
    document.querySelectorAll('#client-main .dcpr6-chip,#client-main .dcpr6-chart-badge,#client-main .profile-stat').forEach(el=>{
      if(/grasa|pt\.?|pta|punto/i.test(el.textContent||''))cleanNode(el);
    });
  }

  let queued=false;
  function patchAll(){
    queued=false;
    installCreateClientFlow();
    patchNewClientLabel();
    renderPlanStatus();
    renderFoodsToAvoid();
    patchDashboardTasks();
    patchFatCoach();
    patchFatClient();
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(patchAll)}

  document.addEventListener('click',e=>{
    if(e.target.closest('#coach-main,#client-main,#dcc-ci-modal,#modal')){setTimeout(schedule,0);setTimeout(schedule,120)}
  },true);
  const boot=()=>{
    css();installCreateClientFlow();schedule();
    const obs=new MutationObserver(schedule);
    obs.observe(document.body,{childList:true,subtree:true,characterData:true});
    setInterval(schedule,1200);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
