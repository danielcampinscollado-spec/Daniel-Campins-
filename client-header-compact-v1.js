/* DCC — cabecera compacta del perfil de cliente, misma geometría en claro y oscuro */
(function(){
  'use strict';
  const BUILD='20260914-client-header-compact-v3';
  if(window.__dccClientHeaderCompact===BUILD)return;
  window.__dccClientHeaderCompact=BUILD;
  const STYLE_ID='dcc-client-header-compact-css';
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();

  function css(){
    let s=document.getElementById(STYLE_ID);if(s)s.remove();
    s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      /* Misma estructura y espaciado en Light y Dark; solo cambia la paleta del tema. */
      #coach-main.dcc-ca .dcc-ca-wrap{padding-top:0!important}
      #coach-main.dcc-ca .dcc-ca-back{margin:0 0 8px!important}
      #coach-main.dcc-ca .dcc-client-compact-top{
        display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:end!important;
        gap:8px!important;margin:0 2px 9px!important;padding:0!important;min-height:0!important
      }
      #coach-main.dcc-ca .dcc-client-compact-top .dcc-ca-head{
        margin:0!important;padding:0!important;min-height:0!important;height:auto!important;display:block!important
      }
      #coach-main.dcc-ca .dcc-ca-head h1{
        margin:0!important;padding:0!important;font-size:29px!important;line-height:1!important;letter-spacing:-.8px!important;min-height:0!important
      }
      #coach-main.dcc-ca .dcc-ca-goal{margin:3px 0 0!important;padding:0!important;font-size:12px!important;line-height:1.1!important;min-height:0!important}
      #coach-main.dcc-ca .dcc-client-compact-actions{
        display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:6px!important;
        margin:0!important;padding:0!important;min-height:32px!important;height:auto!important;flex-wrap:nowrap!important
      }
      #coach-main.dcc-ca .dcc-client-compact-actions>button{
        width:auto!important;min-width:0!important;min-height:32px!important;height:32px!important;margin:0!important;
        padding:6px 10px!important;border-radius:999px!important;font-size:9px!important;line-height:1!important;
        white-space:nowrap!important;box-shadow:none!important
      }
      #coach-main.dcc-ca .dcc-client-compact-actions>.dcc-ca-delete{
        background:rgba(145,34,45,.055)!important;color:#b83443!important;border:1px solid rgba(184,52,67,.34)!important
      }
      #coach-main.dcc-ca .dcc-ca-metrics{margin:0!important;padding:0!important}
      #coach-main.dcc-ca .dcc-ca-profile-actions:empty{display:none!important;margin:0!important;padding:0!important;min-height:0!important}
      @media(max-width:390px){
        #coach-main.dcc-ca .dcc-client-compact-top{gap:6px!important}
        #coach-main.dcc-ca .dcc-ca-head h1{font-size:26px!important}
        #coach-main.dcc-ca .dcc-ca-goal{font-size:10px!important}
        #coach-main.dcc-ca .dcc-client-compact-actions{gap:4px!important}
        #coach-main.dcc-ca .dcc-client-compact-actions>button{height:30px!important;min-height:30px!important;padding:5px 8px!important;font-size:8px!important}
      }
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
    let top=root.querySelector('.dcc-client-compact-top');
    if(!top){top=document.createElement('div');top.className='dcc-client-compact-top';head.parentElement.insertBefore(top,head);top.appendChild(head)}
    let actions=top.querySelector('.dcc-client-compact-actions');
    if(!actions){actions=document.createElement('div');actions.className='dcc-client-compact-actions';top.appendChild(actions)}
    if(edit&&edit.parentElement!==actions)actions.appendChild(edit);
    if(del&&del.parentElement!==actions)actions.appendChild(del);
    root.querySelectorAll('.dcc-ca-profile-actions').forEach(x=>{if(!x.children.length)x.remove()});
  }

  let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
  function boot(){apply();if(document.body&&!document.body.__dccClientHeaderCompactObserver){document.body.__dccClientHeaderCompactObserver=true;new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',boot);
})();
