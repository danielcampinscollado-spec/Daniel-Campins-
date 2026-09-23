/* DCC — acciones del perfil de cliente */
(function(){
'use strict';
const BUILD='20260915-profile-actions-v3-training-actions';
if(window.__dccCoachProfileActions===BUILD)return;window.__dccCoachProfileActions=BUILD;

function css(){
  const old=document.getElementById('dcc-profile-actions-v1-css');if(old)old.remove();
  const s=document.createElement('style');s.id='dcc-profile-actions-v1-css';s.textContent=`
    #coach-main.dcc-ca .dcc-ca-status{display:none!important}
    #coach-main.dcc-ca .dcc-ca-edit{display:none!important}
    #coach-main.dcc-ca .dcc-ca-danger-row{display:none!important}
    #coach-main.dcc-ca .dcc-profile-delete-top{display:none!important}
    #coach-main.dcc-ca .dcc-profile-delete-bottom{display:block;width:100%!important;min-height:48px;margin:24px 0 8px!important;padding:12px 16px!important;border:1px solid rgba(190,55,60,.38)!important;border-radius:15px!important;background:rgba(155,28,34,.055)!important;color:#c94249!important;font-size:12px!important;font-weight:850!important;letter-spacing:.05px;text-align:center}
    #coach-main.dcc-ca .dcc-tr-actions{gap:10px!important;margin-top:14px!important}
    #coach-main.dcc-ca .dcc-tr-actions>.dcc-tr-edit,#coach-main.dcc-ca .dcc-tr-actions>.dcc-tr-new{min-height:72px!important;border-radius:17px!important;padding:14px 12px!important;font-size:14px!important;font-weight:900!important;line-height:1.2!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important}
    #coach-main.dcc-ca .dcc-tr-actions>.dcc-tr-edit{border:1px solid rgba(217,170,74,.62)!important;background:linear-gradient(145deg,rgba(217,170,74,.09),rgba(255,255,255,.02))!important;color:#e5b84f!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)!important}
    #coach-main.dcc-ca .dcc-tr-actions>.dcc-tr-new{border-color:#e8ba50!important;box-shadow:0 8px 20px rgba(185,125,20,.12)!important}
    #coach-main.dcc-ca .dcc-profile-v2-summary>.dcc-v2-card:nth-child(1),#coach-main.dcc-ca .dcc-profile-v2-summary>.dcc-v2-card:nth-child(2){cursor:pointer}
    #coach-main.dcc-ca .dcc-profile-v2-summary>.dcc-v2-card:nth-child(1) .dcc-v2-arrow,#coach-main.dcc-ca .dcc-profile-v2-summary>.dcc-v2-card:nth-child(2) .dcc-v2-arrow{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;transition:transform .18s ease,background .18s ease}
    #coach-main.dcc-ca .dcc-progress-expanded .dcc-v2-arrow,#coach-main.dcc-ca .dcc-strength-expanded .dcc-v2-arrow{transform:rotate(90deg);background:rgba(217,170,74,.10)}
    #coach-main.dcc-ca .dcc-progress-detail,#coach-main.dcc-ca .dcc-strength-detail{display:grid;gap:10px;margin-top:12px;padding-top:12px;border-top:1px solid rgba(217,170,74,.18)}
    #coach-main.dcc-ca .dcc-progress-detail-title,#coach-main.dcc-ca .dcc-strength-detail-title{font-size:11px;font-weight:900}
    #coach-main.dcc-ca .dcc-progress-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    #coach-main.dcc-ca .dcc-progress-change{padding:10px 11px;border:1px solid rgba(217,170,74,.18);border-radius:13px;background:rgba(217,170,74,.04)}
    #coach-main.dcc-ca .dcc-progress-change small{display:block;color:#8f98a3;font-size:8px}
    #coach-main.dcc-ca .dcc-progress-change b{display:block;margin-top:4px;font-size:12px}
    #coach-main.dcc-ca .dcc-progress-checkins{width:100%;min-height:40px;border:1px solid rgba(217,170,74,.34);border-radius:12px;background:transparent;color:#b77b16;font-size:10px;font-weight:850}
    #coach-main.dcc-ca .dcc-v2-muscle i{display:none!important}
    #coach-main.dcc-ca .dcc-v2-muscle{min-height:88px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;padding:10px 3px!important}
    #coach-main.dcc-ca .dcc-v2-muscle b{margin-top:0!important;font-size:9px!important}
    #coach-main.dcc-ca .dcc-v2-muscle strong{margin-top:10px!important;font-size:12px!important}
    #coach-main.dcc-ca .dcc-strength-periods{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
    #coach-main.dcc-ca .dcc-strength-period{min-height:34px;border:1px solid rgba(183,123,22,.22);border-radius:11px;background:transparent;color:inherit;font-size:9px;font-weight:800}
    #coach-main.dcc-ca .dcc-strength-period.active{background:linear-gradient(135deg,#f3cf69,#d9a63d);color:#17120a;border-color:#d9aa4a}
    #coach-main.dcc-ca .dcc-strength-list{display:grid;gap:6px}
    #coach-main.dcc-ca .dcc-strength-row{display:grid;grid-template-columns:1fr auto;align-items:center;gap:12px;padding:9px 10px;border:1px solid rgba(217,170,74,.15);border-radius:12px;background:rgba(217,170,74,.035)}
    #coach-main.dcc-ca .dcc-strength-row b{font-size:10px}.dcc-strength-row span{font-size:10px;font-weight:850;color:#8f98a3}
    #coach-main.dcc-ca .dcc-strength-empty{padding:11px;border-radius:12px;background:rgba(217,170,74,.05);color:#8f98a3;font-size:9px;line-height:1.45}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-profile-delete-bottom{background:#fff7f5!important;color:#b9363e!important;border-color:rgba(185,54,62,.28)!important;box-shadow:0 5px 14px rgba(130,54,54,.035)!important}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-tr-actions>.dcc-tr-edit{background:linear-gradient(145deg,#fffdf8,#fbf4e8)!important;color:#8d5b08!important;border-color:rgba(177,119,18,.42)!important;box-shadow:0 7px 18px rgba(78,58,28,.045)!important}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-progress-change,html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-strength-row{background:#fffaf0!important;border-color:rgba(183,123,22,.16)!important}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-strength-empty{background:#fffaf0!important}
    @media(max-width:390px){#coach-main.dcc-ca .dcc-tr-actions>.dcc-tr-edit,#coach-main.dcc-ca .dcc-tr-actions>.dcc-tr-new{min-height:68px!important;font-size:13px!important}.dcc-profile-delete-bottom{font-size:11px!important}}
  `;(document.head||document.documentElement).appendChild(s);
}

function parseNumber(text){const m=String(text||'').replace(/\./g,'').replace(',','.').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):null}
function fmtDelta(v,suffix){if(v==null||!Number.isFinite(v))return 'Sin datos suficientes';if(Math.abs(v)<.05)return 'Sin cambios';return (v>0?'+':'')+v.toFixed(1).replace('.',',')+' '+suffix}
function selectedId(){return String(window.selectedClient||'')}
function cards(){return [...document.querySelectorAll('#coach-main.dcc-ca .dcc-profile-v2-summary>.dcc-v2-card')]}
function namedCard(name){return cards().find(card=>card.querySelector('h2')?.textContent.trim()===name)||null}

function installHeader(){
  const main=document.getElementById('coach-main');if(!main?.classList.contains('dcc-ca'))return;
  const wrap=main.querySelector('.dcc-ca-wrap');if(!wrap)return;
  main.querySelectorAll('.dcc-ca-status,.dcc-ca-edit,.dcc-ca-danger-row,.dcc-profile-delete-top').forEach(x=>x.remove());
  let b=wrap.querySelector('.dcc-profile-delete-bottom');
  if(!b){b=document.createElement('button');b.type='button';b.className='dcc-profile-delete-bottom';b.textContent='Eliminar cliente';b.addEventListener('click',()=>{const id=selectedId();if(id&&typeof window.dccLegacyDelete==='function')window.dccLegacyDelete(id)})}
  if(wrap.lastElementChild!==b)wrap.appendChild(b);
}

function installProgress(){
  const card=namedCard('Progreso corporal');if(!card||card.dataset.dccProgressAction==='1')return;card.dataset.dccProgressAction='1';
  const arrow=card.querySelector('.dcc-v2-arrow');if(arrow){arrow.setAttribute('role','button');arrow.setAttribute('aria-label','Ver detalle del progreso corporal')}
  card.addEventListener('click',e=>{if(e.target.closest('button,a,input,select,textarea'))return;let detail=card.querySelector('.dcc-progress-detail');if(detail){detail.remove();card.classList.remove('dcc-progress-expanded');return}const stats=card.querySelectorAll('.dcc-v2-stat');const currentW=parseNumber(stats[0]?.querySelector('b')?.textContent),initialW=parseNumber(stats[0]?.querySelector('em')?.textContent),currentF=parseNumber(stats[1]?.querySelector('b')?.textContent),initialF=parseNumber(stats[1]?.querySelector('em')?.textContent);detail=document.createElement('div');detail.className='dcc-progress-detail';detail.innerHTML=`<div class="dcc-progress-detail-title">Evolución desde el inicio</div><div class="dcc-progress-detail-grid"><div class="dcc-progress-change"><small>Cambio de peso</small><b>${fmtDelta(currentW!=null&&initialW!=null?currentW-initialW:null,'kg')}</b></div><div class="dcc-progress-change"><small>Cambio de grasa</small><b>${fmtDelta(currentF!=null&&initialF!=null?currentF-initialF:null,'puntos')}</b></div></div><button type="button" class="dcc-progress-checkins">Ver seguimiento y check-ins ›</button>`;detail.querySelector('.dcc-progress-checkins').addEventListener('click',ev=>{ev.stopPropagation();const id=selectedId();if(id&&typeof window.dccOpenClientTab==='function')window.dccOpenClientTab(id,'followup')});card.appendChild(detail);card.classList.add('dcc-progress-expanded')})
}

function strengthValues(card){return [...card.querySelectorAll('.dcc-v2-muscle')].map(x=>({name:(x.querySelector('b')?.textContent||'').trim(),value:(x.querySelector('strong')?.textContent||'—').trim()})).filter(x=>x.name)}
function renderStrengthDetail(card,period){
  const detail=card.querySelector('.dcc-strength-detail');if(!detail)return;
  detail.querySelectorAll('.dcc-strength-period').forEach(b=>b.classList.toggle('active',b.dataset.period===period));
  const values=strengthValues(card),hasData=values.some(x=>x.value&&x.value!=='—');
  const list=detail.querySelector('.dcc-strength-list');
  if(!hasData){list.innerHTML=`<div class="dcc-strength-empty">Todavía no hay registros de fuerza suficientes para calcular la evolución de ${period==='1'?'1 mes':period+' meses'}. Cuando el cliente acumule entrenamientos, aquí aparecerá el aumento por grupo muscular y su evolución por periodo.</div>`;return}
  list.innerHTML=values.map(x=>`<div class="dcc-strength-row"><b>${x.name}</b><span>${x.value}</span></div>`).join('');
}
function installStrength(){
  const card=namedCard('Progreso de fuerza');if(!card||card.dataset.dccStrengthAction==='1')return;card.dataset.dccStrengthAction='1';
  const arrow=card.querySelector('.dcc-v2-arrow');if(arrow){arrow.setAttribute('role','button');arrow.setAttribute('aria-label','Ver detalle del progreso de fuerza')}
  card.addEventListener('click',e=>{if(e.target.closest('button,a,input,select,textarea'))return;let detail=card.querySelector('.dcc-strength-detail');if(detail){detail.remove();card.classList.remove('dcc-strength-expanded');return}detail=document.createElement('div');detail.className='dcc-strength-detail';detail.innerHTML=`<div class="dcc-strength-detail-title">Evolución de fuerza</div><div class="dcc-strength-periods"><button type="button" class="dcc-strength-period" data-period="1">1 mes</button><button type="button" class="dcc-strength-period" data-period="3">3 meses</button><button type="button" class="dcc-strength-period active" data-period="6">6 meses</button><button type="button" class="dcc-strength-period" data-period="12">1 año</button></div><div class="dcc-strength-list"></div>`;detail.querySelectorAll('.dcc-strength-period').forEach(b=>b.addEventListener('click',ev=>{ev.stopPropagation();renderStrengthDetail(card,b.dataset.period)}));card.appendChild(detail);card.classList.add('dcc-strength-expanded');renderStrengthDetail(card,'6')})
}

let queued=false;function refresh(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;css();installHeader();installProgress();installStrength()})}
refresh();const obs=new MutationObserver(refresh);obs.observe(document.documentElement,{childList:true,subtree:true});document.addEventListener('click',()=>setTimeout(refresh,0),true);window.addEventListener('pageshow',refresh);
})();