/* DCC — perfil entrenador: avisos de plan pendiente + % de grasa comprensible */
(function(){
  'use strict';
  if(window.__dccCoachClientPlanStatusV1)return;
  window.__dccCoachClientPlanStatusV1=true;

  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const fmt=v=>{const n=Number(v);return Number.isFinite(n)?n.toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1}):'—'};
  const appData=()=>{try{return data||{}}catch(e){return window.data||{}};

  function css(){
    if(document.getElementById('dcc-plan-status-v1-css'))return;
    const s=document.createElement('style');
    s.id='dcc-plan-status-v1-css';
    s.textContent=`
      #coach-main .dcc-plan-status-v1{margin:11px 0 13px;padding:12px 13px;border:1px solid rgba(224,173,76,.55);border-radius:16px;background:radial-gradient(circle at 100% 0,rgba(224,173,76,.10),transparent 42%),linear-gradient(145deg,#12171b,#090d10);box-shadow:0 10px 24px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.025)}
      #coach-main .dcc-plan-status-head{display:flex;align-items:center;gap:10px;margin-bottom:8px;color:#efbd54;font-size:10px;font-weight:850;letter-spacing:1.7px;text-transform:uppercase}
      #coach-main .dcc-plan-status-icon{width:28px;height:28px;display:grid;place-items:center;border:1px solid rgba(224,173,76,.48);border-radius:9px;background:rgba(224,173,76,.08);color:#f2c85f;font-size:16px;line-height:1}
      #coach-main .dcc-plan-status-list{display:grid;gap:7px}
      #coach-main .dcc-plan-status-item{width:100%;display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:8px;padding:9px 10px;border:1px solid #29323a;border-radius:12px;background:#0a0f13;color:#f5f3ef;text-align:left}
      #coach-main .dcc-plan-status-item strong{display:block;font-size:12px}
      #coach-main .dcc-plan-status-item small{display:block;margin-top:2px;color:#929ba6;font-size:9px;line-height:1.25}
      #coach-main .dcc-plan-status-item .mark{color:#efbd54;font-size:17px;text-align:center}
      #coach-main .dcc-plan-status-item .go{color:#efbd54;font-size:18px}
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
    for(const key of ['__dccClientAdminId','dccClientAdminId','openCoachClientId'])if(window[key])candidates.push(window[key]);
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

  function openTab(label){
    const tabs=[...document.querySelectorAll('#coach-main .dcc-ca-tab')];
    const tab=tabs.find(x=>(x.textContent||'').toLowerCase().includes(label));
    if(tab)tab.click();
  }
  window.dccOpenPendingPlanTab=function(kind){openTab(kind==='diet'?'alimenta':'entrena')};

  function renderPlanStatus(){
    css();
    const root=document.querySelector('#coach-main .dcc-ca-wrap');
    if(!root)return;
    const client=activeCoachClient();
    if(!client)return;
    const pending=[];
    if(!dietComplete(client.id))pending.push({kind:'diet',title:'Alimentación sin terminar',sub:'Completa la dieta de entrenamiento y descanso.'});
    if(!routineComplete(client.id))pending.push({kind:'routine',title:'Rutina sin terminar',sub:'Completa todos los días y sus ejercicios.'});
    const sig=String(client.id)+'|'+pending.map(x=>x.kind).join(',');
    const old=root.querySelector('.dcc-plan-status-v1');
    if(!pending.length){if(old)old.remove();root.dataset.dccPlanStatusSig=sig;return}
    if(old&&root.dataset.dccPlanStatusSig===sig)return;
    if(old)old.remove();
    const box=document.createElement('section');
    box.className='dcc-plan-status-v1';
    box.innerHTML=`<div class="dcc-plan-status-head"><span class="dcc-plan-status-icon">!</span><span>Plan pendiente de completar</span></div><div class="dcc-plan-status-list">${pending.map(p=>`<button type="button" class="dcc-plan-status-item" onclick="dccOpenPendingPlanTab('${p.kind}')"><span class="mark">!</span><span><strong>${p.title}</strong><small>${p.sub}</small></span><span class="go">›</span></button>`).join('')}</div>`;
    const metrics=root.querySelector('.dcc-ca-metrics');
    const tabs=root.querySelector('.dcc-ca-tabs');
    if(metrics)metrics.insertAdjacentElement('afterend',box);else if(tabs)tabs.insertAdjacentElement('beforebegin',box);else root.prepend(box);
    root.dataset.dccPlanStatusSig=sig;
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
  function patchAll(){queued=false;renderPlanStatus();patchFatCoach();patchFatClient()}
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(patchAll)}

  document.addEventListener('click',e=>{
    if(e.target.closest('#coach-main,#client-main,#dcc-ci-modal')){setTimeout(schedule,0);setTimeout(schedule,100)}
  },true);
  const boot=()=>{
    css();schedule();
    const obs=new MutationObserver(schedule);
    obs.observe(document.body,{childList:true,subtree:true,characterData:true});
    setInterval(schedule,1400);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
