/* DCC — una sola ubicación estable para Editar/Eliminar cliente */
(function(){
  'use strict';
  const BUILD='20260915-client-edit-visibility-v2';
  if(window.__dccClientEditVisibility===BUILD)return;
  window.__dccClientEditVisibility=BUILD;

  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  const root=()=>document.querySelector('#coach-main.dcc-ca');
  const isSummary=r=>norm(r?.querySelector('.dcc-ca-tab.active')?.textContent)==='resumen';
  const infoCard=r=>{
    const h=[...r.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent)==='información general');
    return h?.closest('.dcc-ca-card,.dcc-card,.card,section')||null;
  };

  function css(){
    if(document.getElementById('dcc-client-edit-visibility-v2-css'))return;
    const s=document.createElement('style');
    s.id='dcc-client-edit-visibility-v2-css';
    s.textContent=`
      /* Autoridades antiguas insertaban Editar justo debajo de la cabecera. Se conserva
         oculto para no entrar en un bucle remove/reinsert con sus observers antiguos. */
      #coach-main.dcc-ca .dcc-ca-head + .dcc-ca-profile-actions,
      #coach-main.dcc-ca .dcc-ca-head + .dcc-client-edit-authority-btn{display:none!important}
      #coach-main.dcc-ca .dcc-client-edit-authority-btn{display:none!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin:14px 0 0!important;padding:13px 0 0!important;border-top:1px solid rgba(177,119,18,.16)!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom>button{display:block!important;width:100%!important;min-height:42px!important;height:42px!important;margin:0!important;padding:8px 12px!important;border-radius:14px!important;font-size:10px!important;font-weight:800!important;box-shadow:none!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom>.dcc-ca-edit-client{border:1px solid #d7ae55!important;background:linear-gradient(135deg,#fffaf0,#f4e6bf)!important;color:#7a5415!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom>.dcc-ca-delete{border:1px solid #e3b8ba!important;background:#fff5f5!important;color:#b0444a!important}
      html:not(.dcc-theme-light-premium) #coach-main.dcc-ca .dcc-summary-actions-bottom>.dcc-ca-edit-client{background:#151109!important;color:#f0c96b!important;border-color:#8c692b!important}
      html:not(.dcc-theme-light-premium) #coach-main.dcc-ca .dcc-summary-actions-bottom>.dcc-ca-delete{background:#12090b!important;color:#ff6870!important;border-color:#6f272b!important}
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  function stopLegacyEditObserver(){
    const main=document.getElementById('coach-main');
    const old=main?.__dccClientEditV2Observer;
    try{old?.disconnect?.()}catch(_){}
    if(main)main.__dccClientEditV2Observer={disconnect(){}};
  }

  function openEditor(e){
    e?.preventDefault?.();e?.stopPropagation?.();
    const id=window.__dccClientAdminId??window.selectedClient;
    if(typeof window.dccCriticalOpenClientEditor==='function')return window.dccCriticalOpenClientEditor(id);
    if(typeof window.dccOpenClientProfileEditor==='function')return window.dccOpenClientProfileEditor(id);
  }

  function enforce(){
    css();stopLegacyEditObserver();
    const r=root();if(!r)return;

    /* Nunca se crean acciones fuera de Resumen. Los botones legacy superiores quedan
       ocultos por CSS sin provocar mutaciones recíprocas. */
    if(!isSummary(r)){
      r.querySelectorAll('.dcc-summary-actions-bottom').forEach(x=>x.remove());
      return;
    }

    const card=infoCard(r);if(!card)return;
    const del=[...r.querySelectorAll('button')].find(x=>norm(x.textContent)==='eliminar cliente')||null;
    let box=card.querySelector('.dcc-summary-actions-bottom');
    if(!box){box=document.createElement('div');box.className='dcc-summary-actions-bottom';card.appendChild(box)}

    let edit=box.querySelector('.dcc-ca-edit-client');
    if(!edit){edit=document.createElement('button');edit.type='button';edit.className='dcc-ca-edit-client';edit.textContent='Editar cliente';edit.onclick=openEditor;box.appendChild(edit)}
    if(del&&del.parentElement!==box)box.appendChild(del);
  }

  function wrap(){
    const base=window.dccClientAdmin;
    if(typeof base!=='function'||base.__dccEditVisibilityV2)return false;
    const wrapped=function(){
      const out=base.apply(this,arguments);
      requestAnimationFrame(enforce);
      return out;
    };
    wrapped.__dccEditVisibilityV2=true;
    wrapped.__base=base;
    window.dccClientAdmin=wrapped;
    return true;
  }

  function boot(){css();stopLegacyEditObserver();wrap();requestAnimationFrame(enforce)}
  boot();
  let tries=0;const timer=setInterval(()=>{tries++;stopLegacyEditObserver();wrap();if(tries>=20)clearInterval(timer)},100);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  window.addEventListener('pageshow',boot);
})();
