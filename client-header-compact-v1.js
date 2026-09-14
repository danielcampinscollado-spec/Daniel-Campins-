/* DCC — cabecera limpia y acciones del cliente bajo Información general */
(function(){
  'use strict';
  const BUILD='20260914-client-header-compact-v7';
  if(window.__dccClientHeaderCompact===BUILD)return;
  window.__dccClientHeaderCompact=BUILD;
  const STYLE_ID='dcc-client-header-compact-css';
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();

  function css(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #coach-main.dcc-ca .dcc-ca-wrap{padding-top:0!important}
      #coach-main.dcc-ca .dcc-ca-back{margin:0 0 10px!important}
      #coach-main.dcc-ca .dcc-client-compact-top{display:block!important;margin:0 2px 10px!important;padding:0!important;min-height:0!important;height:auto!important}
      #coach-main.dcc-ca .dcc-client-compact-top .dcc-ca-head{margin:0!important;padding:0!important;min-height:0!important;height:auto!important;display:block!important}
      #coach-main.dcc-ca .dcc-client-compact-top .dcc-ca-head h1{margin:0!important;padding:0!important;font-size:29px!important;line-height:1!important;letter-spacing:-.8px!important}
      #coach-main.dcc-ca .dcc-client-compact-top .dcc-ca-goal{margin:4px 0 0!important;padding:0!important;font-size:12px!important;line-height:1.15!important}
      #coach-main.dcc-ca .dcc-ca-metrics{margin-top:0!important}
      #coach-main.dcc-ca .dcc-client-compact-actions{display:none!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important;margin:18px 0 2px!important;padding-top:15px!important;border-top:1px solid rgba(177,119,18,.16)!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom>button{width:100%!important;min-height:44px!important;height:44px!important;margin:0!important;padding:8px 12px!important;border-radius:14px!important;font-size:11px!important;font-weight:800!important;box-shadow:none!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom>.dcc-ca-delete{background:rgba(145,34,45,.055)!important;color:#b83443!important;border:1px solid rgba(184,52,67,.34)!important}
      #coach-main.dcc-ca .dcc-ca-profile-actions:empty{display:none!important}
      @media(max-width:430px){
        #coach-main.dcc-ca .dcc-client-compact-top .dcc-ca-head h1{font-size:27px!important}
        #coach-main.dcc-ca .dcc-client-compact-top .dcc-ca-goal{font-size:10px!important}
        #coach-main.dcc-ca .dcc-summary-actions-bottom>button{min-height:42px!important;height:42px!important;font-size:10px!important}
      }
    `;(document.head||document.documentElement).appendChild(s);
  }

  function isSummary(root){return norm(root.querySelector('.dcc-ca-tab.active')?.textContent)==='resumen'}
  function infoCard(root){
    const heading=[...root.querySelectorAll('h1,h2,h3,h4')].find(h=>norm(h.textContent)==='información general');
    if(!heading)return null;
    return heading.closest('.dcc-ca-card,.dcc-card,.card,section')||heading.parentElement;
  }
  function apply(){
    css();const root=document.querySelector('#coach-main.dcc-ca');if(!root)return;
    const wrap=root.querySelector('.dcc-ca-wrap')||root;
    const head=root.querySelector('.dcc-ca-head'),metrics=root.querySelector('.dcc-ca-metrics');if(!head||!metrics)return;

    let top=root.querySelector('.dcc-client-compact-top');
    if(!top){top=document.createElement('div');top.className='dcc-client-compact-top'}
    if(top.parentElement!==wrap)wrap.insertBefore(top,metrics);
    if(head.parentElement!==top)top.appendChild(head);
    if(metrics.previousElementSibling!==top)top.insertAdjacentElement('afterend',metrics);

    root.querySelector('.dcc-client-compact-actions')?.remove();
    const existingBottom=root.querySelector('.dcc-summary-actions-bottom');
    if(!isSummary(root)){existingBottom?.remove();return}

    const buttons=[...root.querySelectorAll('button')];
    const edit=buttons.find(b=>norm(b.textContent)==='editar cliente');
    const del=buttons.find(b=>norm(b.textContent).includes('eliminar cliente'));
    const card=infoCard(root);
    if(!card||(!edit&&!del))return;

    let actions=existingBottom;
    if(!actions){actions=document.createElement('div');actions.className='dcc-summary-actions-bottom'}
    if(actions.parentElement!==card)card.appendChild(actions);
    if(edit&&edit.parentElement!==actions)actions.appendChild(edit);
    if(del&&del.parentElement!==actions)actions.appendChild(del);
    root.querySelectorAll('.dcc-ca-profile-actions').forEach(x=>{if(!x.children.length)x.remove()});
  }

  let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
  function boot(){
    apply();
    if(document.body&&!document.body.__dccClientHeaderCompactObserverV7){
      document.body.__dccClientHeaderCompactObserverV7=true;
      new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',boot);
})();
