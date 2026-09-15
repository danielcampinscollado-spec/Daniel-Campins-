/* DCC — aviso compacto de planes pendientes, render síncrono y estable */
(function(){
  'use strict';
  const BUILD='20260915-client-plan-alert-compact-v5-stable';
  if(window.__dccClientPlanAlertCompact===BUILD)return;
  window.__dccClientPlanAlertCompact=BUILD;

  const STYLE_ID='dcc-client-plan-alert-compact-css';
  const appData=()=>{try{return data||{}}catch(_){return window.data||{}};

  function mealReady(meal){
    if(Array.isArray(meal?.options)&&meal.options.length)return meal.options.some(o=>Array.isArray(o?.foods)&&o.foods.length>0);
    return Array.isArray(meal?.foods)&&meal.foods.length>0;
  }
  function dietReady(id){
    const p=appData()?.diets?.[id];
    return !!p&&['training','rest'].every(type=>Array.isArray(p?.[type]?.meals)&&p[type].meals.length>0&&p[type].meals.every(mealReady));
  }
  function routineReady(id){
    const r=appData()?.routines?.[id],days=Array.isArray(r)?r:(Array.isArray(r?.routine)?r.routine:[]);
    return days.length>0&&days.every(day=>Array.isArray(day?.exercises)&&day.exercises.length>0);
  }

  function css(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      html body #coach-main .dcc-v5-plan{margin:9px 0 11px!important;padding:0!important;border:0!important;outline:0!important;background:none!important;box-shadow:none!important;border-radius:0!important;overflow:visible!important}
      #coach-main .dcc-plan-compact-alert{display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;gap:10px;min-height:52px;padding:9px 12px;border:1px solid rgba(224,173,76,.5);border-radius:16px;background:linear-gradient(145deg,rgba(224,173,76,.10),rgba(255,255,255,.025));box-shadow:none!important}
      #coach-main .dcc-plan-compact-icon{width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#f4cf69,#dca43c);color:#171109;font-size:17px;font-weight:950}
      #coach-main .dcc-plan-compact-copy b{display:block;font-size:12px;line-height:1.2;color:inherit}
      #coach-main .dcc-plan-compact-copy small{display:block;margin-top:3px;color:#8e96a0;font-size:9px;line-height:1.25}
      html.dcc-theme-light-premium #coach-main .dcc-plan-compact-alert{background:linear-gradient(145deg,#fffaf0,#fbf4e7);border-color:#e4c77f}
      html.dcc-theme-light-premium #coach-main .dcc-plan-compact-copy small{color:#8f887c}
    `;(document.head||document.documentElement).appendChild(s);
  }

  function apply(id){
    css();
    const main=document.querySelector('#coach-main.dcc-ca');if(!main)return;
    id=String(id??window.__dccClientAdminId??window.selectedClient??'');if(!id)return;
    main.querySelectorAll('.dcc-v5-plan').forEach(x=>x.remove());
    const pending=[];
    if(!dietReady(id))pending.push('Alimentación');
    if(!routineReady(id))pending.push('Rutina');
    if(!pending.length)return;
    const metrics=main.querySelector('.dcc-ca-metrics');if(!metrics)return;
    const box=document.createElement('section');box.className='dcc-v5-plan';
    const title=pending.length>1?'Tienes planes sin terminar':'Tienes un plan sin terminar';
    const sub=pending.length>1?'Alimentación y rutina pendientes.':pending[0]+' pendiente.';
    box.innerHTML=`<div class="dcc-plan-compact-alert"><span class="dcc-plan-compact-icon">!</span><span class="dcc-plan-compact-copy"><b>${title}</b><small>${sub}</small></span></div>`;
    metrics.insertAdjacentElement('afterend',box);
  }

  function wrap(){
    const base=window.dccClientAdmin;
    if(typeof base!=='function'||base.__dccPlanAlertStableV5)return false;
    const wrapped=function(id){const out=base.apply(this,arguments);apply(id);return out};
    wrapped.__dccPlanAlertStableV5=true;wrapped.__base=base;window.dccClientAdmin=wrapped;return true;
  }

  function boot(){css();if(!wrap()){let tries=0;const t=setInterval(()=>{tries++;if(wrap()||tries>=12)clearInterval(t)},100)}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.dccPlanStatusRefresh=()=>apply(window.__dccClientAdminId??window.selectedClient);
})();
