/* DCC — acciones y limpieza del perfil de cliente */
(function(){
'use strict';
const BUILD='20260915-profile-actions-v1';
if(window.__dccCoachProfileActions===BUILD)return;window.__dccCoachProfileActions=BUILD;

function css(){
  if(document.getElementById('dcc-profile-actions-v1-css'))return;
  const s=document.createElement('style');s.id='dcc-profile-actions-v1-css';s.textContent=`
    #coach-main.dcc-ca .dcc-ca-status{display:none!important}
    #coach-main.dcc-ca .dcc-ca-edit{display:none!important}
    #coach-main.dcc-ca .dcc-ca-danger-row{display:none!important}
    #coach-main.dcc-ca .dcc-profile-delete-top{flex:none;width:auto!important;margin:0!important;padding:10px 13px!important;border:1px solid rgba(190,55,60,.42)!important;border-radius:13px!important;background:rgba(155,28,34,.07)!important;color:#c94249!important;font-size:10px!important;font-weight:850!important;white-space:nowrap}
    #coach-main.dcc-ca .dcc-profile-v2-summary>.dcc-v2-card:first-child{cursor:pointer}
    #coach-main.dcc-ca .dcc-profile-v2-summary>.dcc-v2-card:first-child .dcc-v2-arrow{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;transition:transform .18s ease,background .18s ease}
    #coach-main.dcc-ca .dcc-profile-v2-summary>.dcc-v2-card:first-child.dcc-progress-expanded .dcc-v2-arrow{transform:rotate(90deg);background:rgba(217,170,74,.10)}
    #coach-main.dcc-ca .dcc-progress-detail{display:grid;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid rgba(217,170,74,.18)}
    #coach-main.dcc-ca .dcc-progress-detail-title{font-size:11px;font-weight:900}
    #coach-main.dcc-ca .dcc-progress-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    #coach-main.dcc-ca .dcc-progress-change{padding:10px 11px;border:1px solid rgba(217,170,74,.18);border-radius:13px;background:rgba(217,170,74,.04)}
    #coach-main.dcc-ca .dcc-progress-change small{display:block;color:#8f98a3;font-size:8px}
    #coach-main.dcc-ca .dcc-progress-change b{display:block;margin-top:4px;font-size:12px}
    #coach-main.dcc-ca .dcc-progress-checkins{width:100%;min-height:40px;border:1px solid rgba(217,170,74,.34);border-radius:12px;background:transparent;color:#b77b16;font-size:10px;font-weight:850}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-profile-delete-top{background:#fff7f5!important;color:#b9363e!important;border-color:rgba(185,54,62,.30)!important}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-progress-change{background:#fffaf0!important;border-color:rgba(183,123,22,.16)!important}
    @media(max-width:390px){#coach-main.dcc-ca .dcc-profile-delete-top{padding:9px 10px!important;font-size:9px!important}}
  `;(document.head||document.documentElement).appendChild(s);
}

function parseNumber(text){
  const m=String(text||'').replace(/\./g,'').replace(',','.').match(/-?\d+(?:\.\d+)?/);
  return m?Number(m[0]):null;
}
function fmtDelta(v,suffix){
  if(v==null||!Number.isFinite(v))return 'Sin datos suficientes';
  if(Math.abs(v)<.05)return 'Sin cambios';
  return (v>0?'+':'')+v.toFixed(1).replace('.',',')+' '+suffix;
}
function selectedId(){return String(window.selectedClient||'')}

function installHeader(){
  const main=document.getElementById('coach-main');
  if(!main?.classList.contains('dcc-ca'))return;
  const bar=main.querySelector('.dcc-ca-profilebar');if(!bar)return;
  main.querySelectorAll('.dcc-ca-status').forEach(x=>x.remove());
  main.querySelectorAll('.dcc-ca-edit').forEach(x=>x.remove());
  main.querySelectorAll('.dcc-ca-danger-row').forEach(x=>x.remove());
  if(!bar.querySelector('.dcc-profile-delete-top')){
    const b=document.createElement('button');b.type='button';b.className='dcc-profile-delete-top';b.textContent='Eliminar cliente';
    b.addEventListener('click',()=>{const id=selectedId();if(id&&typeof window.dccLegacyDelete==='function')window.dccLegacyDelete(id)});
    bar.appendChild(b);
  }
}

function progressCard(){
  return [...document.querySelectorAll('#coach-main.dcc-ca .dcc-profile-v2-summary>.dcc-v2-card')].find(card=>card.querySelector('h2')?.textContent.trim()==='Progreso corporal')||null;
}
function installProgress(){
  const card=progressCard();if(!card||card.dataset.dccProgressAction==='1')return;
  card.dataset.dccProgressAction='1';
  const arrow=card.querySelector('.dcc-v2-arrow');if(arrow){arrow.setAttribute('role','button');arrow.setAttribute('aria-label','Ver detalle del progreso corporal')}
  card.addEventListener('click',e=>{
    if(e.target.closest('button,a,input,select,textarea'))return;
    let detail=card.querySelector('.dcc-progress-detail');
    if(detail){detail.remove();card.classList.remove('dcc-progress-expanded');return}
    const stats=card.querySelectorAll('.dcc-v2-stat');
    const currentW=parseNumber(stats[0]?.querySelector('b')?.textContent),initialW=parseNumber(stats[0]?.querySelector('em')?.textContent);
    const currentF=parseNumber(stats[1]?.querySelector('b')?.textContent),initialF=parseNumber(stats[1]?.querySelector('em')?.textContent);
    detail=document.createElement('div');detail.className='dcc-progress-detail';
    detail.innerHTML=`<div class="dcc-progress-detail-title">Evolución desde el inicio</div><div class="dcc-progress-detail-grid"><div class="dcc-progress-change"><small>Cambio de peso</small><b>${fmtDelta(currentW!=null&&initialW!=null?currentW-initialW:null,'kg')}</b></div><div class="dcc-progress-change"><small>Cambio de grasa</small><b>${fmtDelta(currentF!=null&&initialF!=null?currentF-initialF:null,'puntos')}</b></div></div><button type="button" class="dcc-progress-checkins">Ver seguimiento y check-ins ›</button>`;
    detail.querySelector('.dcc-progress-checkins').addEventListener('click',ev=>{ev.stopPropagation();const id=selectedId();if(id&&typeof window.dccOpenClientTab==='function')window.dccOpenClientTab(id,'followup')});
    card.appendChild(detail);card.classList.add('dcc-progress-expanded');
  });
}

let queued=false;
function refresh(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;css();installHeader();installProgress()})}
css();refresh();
const obs=new MutationObserver(refresh);obs.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',()=>setTimeout(refresh,0),true);
window.addEventListener('pageshow',refresh);
})();