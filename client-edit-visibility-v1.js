/* DCC — acciones de cliente estables: una sola pasada, sin RAF ni observers */
(function(){
  'use strict';
  const BUILD='20260915-client-edit-visibility-v3-stable';
  if(window.__dccClientEditVisibility===BUILD)return;
  window.__dccClientEditVisibility=BUILD;

  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  const root=()=>document.querySelector('#coach-main.dcc-ca');

  function css(){
    if(document.getElementById('dcc-client-edit-visibility-v3-css'))return;
    const s=document.createElement('style');s.id='dcc-client-edit-visibility-v3-css';s.textContent=`
      #coach-main.dcc-ca .dcc-ca-head + .dcc-ca-profile-actions,#coach-main.dcc-ca .dcc-client-edit-authority-btn{display:none!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin:14px 0 0!important;padding:13px 0 0!important;border-top:1px solid rgba(177,119,18,.16)!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom>button{display:block!important;width:100%!important;min-height:42px!important;height:42px!important;margin:0!important;padding:8px 12px!important;border-radius:14px!important;font-size:10px!important;font-weight:800!important;box-shadow:none!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom>.dcc-ca-edit-client{border:1px solid #d7ae55!important;background:linear-gradient(135deg,#fffaf0,#f4e6bf)!important;color:#7a5415!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom>.dcc-ca-delete{border:1px solid #e3b8ba!important;background:#fff5f5!important;color:#b0444a!important}
      html:not(.dcc-theme-light-premium) #coach-main.dcc-ca .dcc-summary-actions-bottom>.dcc-ca-edit-client{background:#151109!important;color:#f0c96b!important;border-color:#8c692b!important}
      html:not(.dcc-theme-light-premium) #coach-main.dcc-ca .dcc-summary-actions-bottom>.dcc-ca-delete{background:#12090b!important;color:#ff6870!important;border-color:#6f272b!important}
    `;(document.head||document.documentElement).appendChild(s);
  }

  function openEditor(e){
    e?.preventDefault?.();e?.stopPropagation?.();
    const id=window.__dccClientAdminId??window.selectedClient;
    if(typeof window.dccCriticalOpenClientEditor==='function')return window.dccCriticalOpenClientEditor(id);
    if(typeof window.dccOpenClientProfileEditor==='function')return window.dccOpenClientProfileEditor(id);
  }

  function enforce(id,tab){
    css();const r=root();if(!r)return;
    const active=norm(tab||r.querySelector('.dcc-ca-tab.active')?.textContent);
    r.querySelectorAll('.dcc-summary-actions-bottom').forEach(x=>x.remove());
    if(active!=='summary'&&active!=='resumen')return;
    const h=[...r.querySelectorAll('h2')].find(x=>norm(x.textContent)==='información general');
    const card=h?.closest('.dcc-ca-card');if(!card)return;
    const box=document.createElement('div');box.className='dcc-summary-actions-bottom';
    const edit=document.createElement('button');edit.type='button';edit.className='dcc-ca-edit-client';edit.textContent='Editar cliente';edit.onclick=openEditor;box.appendChild(edit);
    const del=[...r.querySelectorAll('button')].find(x=>norm(x.textContent)==='eliminar cliente');
    if(del)box.appendChild(del);
    card.appendChild(box);
    window.__dccClientAdminId=String(id??window.selectedClient??'');
  }

  function wrap(){
    const base=window.dccClientAdmin;
    if(typeof base!=='function'||base.__dccEditVisibilityStableV3)return false;
    const wrapped=function(id,tab='summary'){const out=base.apply(this,arguments);enforce(id,tab);return out};
    wrapped.__dccEditVisibilityStableV3=true;wrapped.__base=base;window.dccClientAdmin=wrapped;return true;
  }

  function boot(){css();if(!wrap()){let tries=0;const t=setInterval(()=>{tries++;if(wrap()||tries>=12)clearInterval(t)},100)}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
