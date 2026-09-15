/* DCC — ubicación definitiva de Editar/Eliminar bajo Información general */
(function(){
  'use strict';
  const BUILD='20260914-client-summary-actions-position-v1';
  if(window.__dccClientSummaryActionsPosition===BUILD)return;
  window.__dccClientSummaryActionsPosition=BUILD;
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  function isSummary(root){return norm(root.querySelector('.dcc-ca-tab.active')?.textContent)==='resumen'}
  function infoCard(root){
    const title=[...root.querySelectorAll('h1,h2,h3')].find(x=>norm(x.textContent)==='información general');
    return title?.closest('.dcc-ca-card')||null;
  }
  function apply(){
    const root=document.querySelector('#coach-main.dcc-ca');if(!root)return;
    if(!isSummary(root))return;
    const card=infoCard(root);if(!card)return;
    let box=root.querySelector('.dcc-ca-profile-actions')||root.querySelector('.dcc-summary-actions-bottom');
    if(!box){box=document.createElement('div');box.className='dcc-ca-profile-actions dcc-summary-actions-fixed'}
    box.classList.add('dcc-summary-actions-fixed');
    if(box.parentElement!==card)card.appendChild(box);
    const buttons=[...root.querySelectorAll('button')];
    const edits=buttons.filter(b=>norm(b.textContent)==='editar cliente');
    const dels=buttons.filter(b=>norm(b.textContent)==='eliminar cliente');
    const edit=edits.find(b=>b.classList.contains('dcc-client-edit-authority-btn'))||edits[0];
    const del=dels[0];
    edits.forEach(b=>{if(b!==edit)b.remove()});dels.forEach(b=>{if(b!==del)b.remove()});
    if(edit&&edit.parentElement!==box)box.appendChild(edit);
    if(del&&del.parentElement!==box)box.appendChild(del);
    root.querySelectorAll('.dcc-client-compact-actions').forEach(x=>x.remove());
  }
  function css(){if(document.getElementById('dcc-summary-actions-fixed-css'))return;const s=document.createElement('style');s.id='dcc-summary-actions-fixed-css';s.textContent=`
    #coach-main.dcc-ca .dcc-summary-actions-fixed{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin:14px 0 0!important;padding:13px 0 0!important;border-top:1px solid rgba(177,119,18,.16)!important}
    #coach-main.dcc-ca .dcc-summary-actions-fixed>button{width:100%!important;min-height:42px!important;height:42px!important;margin:0!important;padding:8px 12px!important;border-radius:14px!important;font-size:10px!important;font-weight:800!important;box-shadow:none!important}
    #coach-main.dcc-ca .dcc-summary-actions-fixed>.dcc-ca-delete{background:rgba(145,34,45,.055)!important;color:#b83443!important;border:1px solid rgba(184,52,67,.34)!important}
    @media(max-width:430px){#coach-main.dcc-ca .dcc-summary-actions-fixed>button{min-height:40px!important;height:40px!important;font-size:9px!important}}
  `;(document.head||document.documentElement).appendChild(s)}
  let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;css();apply()})}
  function boot(){css();apply();if(document.body&&!document.body.__dccSummaryActionsPositionObserver){document.body.__dccSummaryActionsPositionObserver=true;new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']})}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',boot);
})();
