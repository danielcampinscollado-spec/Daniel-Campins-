/* DCC — aviso compacto de planes pendientes */
(function(){
  'use strict';
  const BUILD='20260914-client-plan-alert-compact-v2';
  if(window.__dccClientPlanAlertCompact===BUILD)return;
  window.__dccClientPlanAlertCompact=BUILD;

  const STYLE_ID='dcc-client-plan-alert-compact-css';
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();

  function css(){
    let s=document.getElementById(STYLE_ID);
    if(s)s.remove();
    s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      html body #coach-main.dcc-ca section.dcc-v5-plan,
      html body #coach-main .dcc-v5-plan{margin:9px 0 11px!important;padding:0!important;border:0!important;border-width:0!important;border-color:transparent!important;outline:0!important;background:none!important;box-shadow:none!important;border-radius:0!important;overflow:visible!important}
      html body #coach-main .dcc-v5-plan::before,html body #coach-main .dcc-v5-plan::after{display:none!important;content:none!important;border:0!important;box-shadow:none!important}
      #coach-main .dcc-v5-plan>.dcc-v5-plan-title,#coach-main .dcc-v5-plan>.dcc-v5-plan-list{display:none!important}
      #coach-main .dcc-plan-compact-alert{display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;gap:10px;min-height:52px;padding:9px 12px;border:1px solid rgba(224,173,76,.5);border-radius:16px;background:linear-gradient(145deg,rgba(224,173,76,.10),rgba(255,255,255,.025));box-shadow:none!important;outline:0!important}
      #coach-main .dcc-plan-compact-icon{width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#f4cf69,#dca43c);color:#171109;font-size:17px;font-weight:950}
      #coach-main .dcc-plan-compact-copy b{display:block;font-size:12px;line-height:1.2;color:inherit}
      #coach-main .dcc-plan-compact-copy small{display:block;margin-top:3px;color:#8e96a0;font-size:9px;line-height:1.25}
      body.dcc-light #coach-main .dcc-plan-compact-alert,[data-theme="light"] #coach-main .dcc-plan-compact-alert,html.dcc-theme-light-premium #coach-main .dcc-plan-compact-alert{background:linear-gradient(145deg,#fffaf0,#fbf4e7);border-color:#e4c77f}
      body.dcc-light #coach-main .dcc-plan-compact-copy small,[data-theme="light"] #coach-main .dcc-plan-compact-copy small,html.dcc-theme-light-premium #coach-main .dcc-plan-compact-copy small{color:#8f887c}
    `;(document.head||document.documentElement).appendChild(s);
  }

  function apply(){
    css();
    document.querySelectorAll('#coach-main .dcc-v5-plan').forEach(box=>{
      const items=[...box.querySelectorAll('.dcc-v5-plan-item')];if(!items.length)return;
      const titles=items.map(x=>norm(x.querySelector('b')?.textContent||x.textContent));
      const hasDiet=titles.some(t=>/aliment/.test(t)),hasRoutine=titles.some(t=>/rutina|entren/.test(t));
      let sub='Hay información pendiente de completar.';
      if(hasDiet&&hasRoutine)sub='Alimentación y rutina pendientes.';else if(hasDiet)sub='Alimentación pendiente.';else if(hasRoutine)sub='Rutina pendiente.';
      const title=items.length>1?'Tienes planes sin terminar':'Tienes un plan sin terminar';
      let alert=box.querySelector('.dcc-plan-compact-alert');if(!alert){alert=document.createElement('div');alert.className='dcc-plan-compact-alert';box.appendChild(alert)}
      alert.innerHTML=`<span class="dcc-plan-compact-icon">!</span><span class="dcc-plan-compact-copy"><b>${title}</b><small>${sub}</small></span>`;
    });
  }
  let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
  function observe(){if(!document.body||document.body.__dccPlanAlertCompactObserverV2)return;document.body.__dccPlanAlertCompactObserverV2=true;new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});apply()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
})();
