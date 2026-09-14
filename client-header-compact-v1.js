/* DCC — cabecera compacta del perfil de cliente */
(function(){
  'use strict';
  const BUILD='20260914-client-header-compact-v1';
  if(window.__dccClientHeaderCompact===BUILD)return;
  window.__dccClientHeaderCompact=BUILD;
  const STYLE_ID='dcc-client-header-compact-css';
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();

  function css(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #coach-main.dcc-ca .dcc-ca-head{margin:10px 2px 7px!important}
      #coach-main.dcc-ca .dcc-ca-head h1{margin:0!important;font-size:29px!important;line-height:1.02!important;letter-spacing:-.8px!important}
      #coach-main.dcc-ca .dcc-ca-goal{margin-top:4px!important;font-size:12px!important;line-height:1.15!important}
      #coach-main.dcc-ca .dcc-client-compact-actions{display:flex!important;align-items:center!important;gap:7px!important;margin:5px 2px 10px!important;min-height:36px!important;flex-wrap:nowrap!important}
      #coach-main.dcc-ca .dcc-client-compact-actions>button{width:auto!important;min-width:0!important;min-height:36px!important;height:36px!important;margin:0!important;padding:7px 13px!important;border-radius:999px!important;font-size:10px!important;line-height:1!important;white-space:nowrap!important;box-shadow:none!important}
      #coach-main.dcc-ca .dcc-client-compact-actions>.dcc-ca-delete{background:rgba(145,34,45,.055)!important;color:#b83443!important;border:1px solid rgba(184,52,67,.34)!important}
      #coach-main.dcc-ca .dcc-ca-metrics{margin-top:0!important}
      @media(max-width:520px){#coach-main.dcc-ca .dcc-ca-head h1{font-size:27px!important}#coach-main.dcc-ca .dcc-client-compact-actions{margin-bottom:9px!important}}
    `;(document.head||document.documentElement).appendChild(s);
  }

  function isSummary(root){return norm(root.querySelector('.dcc-ca-tab.active')?.textContent)==='resumen'}
  function apply(){
    css();const root=document.querySelector('#coach-main.dcc-ca');if(!root)return;
    const head=root.querySelector('.dcc-ca-head'),metrics=root.querySelector('.dcc-ca-metrics');if(!head||!metrics||!isSummary(root))return;
    const buttons=[...root.querySelectorAll('button')];
    const edit=buttons.find(b=>norm(b.textContent)==='editar cliente');
    const del=buttons.find(b=>norm(b.textContent).includes('eliminar cliente'));
    if(!edit&&!del)return;
    let actions=root.querySelector('.dcc-client-compact-actions');
    if(!actions){actions=document.createElement('div');actions.className='dcc-client-compact-actions';head.insertAdjacentElement('afterend',actions)}
    if(edit&&edit.parentElement!==actions)actions.appendChild(edit);
    if(del&&del.parentElement!==actions)actions.appendChild(del);
    root.querySelectorAll('.dcc-ca-profile-actions').forEach(x=>{if(!x.children.length)x.remove()});
  }

  let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
  function boot(){apply();if(document.body&&!document.body.__dccClientHeaderCompactObserver){document.body.__dccClientHeaderCompactObserver=true;new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',boot);
})();
