/* DCC — Editar cliente existe únicamente en Resumen, sin MutationObserver */
(function(){
  'use strict';
  const BUILD='20260914-client-edit-visibility-v1';
  if(window.__dccClientEditVisibility===BUILD)return;
  window.__dccClientEditVisibility=BUILD;

  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  function root(){return document.querySelector('#coach-main.dcc-ca')}
  function isSummary(r){return norm(r?.querySelector('.dcc-ca-tab.active')?.textContent)==='resumen'}
  function editButtons(r){return [...(r?.querySelectorAll('button,a,[role="button"],[onclick]')||[])].filter(x=>norm(x.textContent)==='editar cliente')}
  function infoCard(r){const h=[...r.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent)==='información general');return h?.closest('.dcc-ca-card,.dcc-card,.card,section')||null}

  function enforce(){
    const r=root();if(!r)return;
    const edits=editButtons(r);
    if(!isSummary(r)){
      edits.forEach(x=>x.remove());
      r.querySelectorAll('.dcc-ca-profile-actions,.dcc-summary-actions-bottom,.dcc-summary-actions-fixed,.dcc-client-compact-actions').forEach(x=>x.remove());
      return;
    }

    const card=infoCard(r);if(!card)return;
    let edit=edits[0]||null;
    edits.slice(1).forEach(x=>x.remove());
    const del=[...r.querySelectorAll('button')].find(x=>norm(x.textContent).includes('eliminar cliente'))||null;

    let box=card.querySelector('.dcc-ca-profile-actions,.dcc-summary-actions-bottom');
    if(!box){box=document.createElement('div');box.className='dcc-ca-profile-actions';card.appendChild(box)}

    if(!edit&&typeof window.dccOpenClientProfileEditor==='function'){
      edit=document.createElement('button');edit.type='button';edit.className='dcc-ca-edit-client';edit.textContent='Editar cliente';
      edit.onclick=e=>{e.preventDefault();e.stopPropagation();window.dccOpenClientProfileEditor()};
    }
    if(edit&&edit.parentElement!==box)box.appendChild(edit);
    if(del&&del.parentElement!==box)box.appendChild(del);
  }

  function wrap(){
    const base=window.dccClientAdmin;if(typeof base!=='function'||base.__dccEditVisibilityV1)return false;
    const wrapped=function(){const out=base.apply(this,arguments);requestAnimationFrame(enforce);return out};
    wrapped.__dccEditVisibilityV1=true;wrapped.__base=base;window.dccClientAdmin=wrapped;return true;
  }

  function boot(){wrap();requestAnimationFrame(enforce)}
  boot();let tries=0;const timer=setInterval(()=>{tries++;if(wrap()||tries>80)clearInterval(timer)},100);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  window.addEventListener('pageshow',boot);
})();
