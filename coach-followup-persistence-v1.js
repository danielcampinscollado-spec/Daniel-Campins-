/* DCC — seguimiento del entrenador persistente + estado guardado */
(function(){
'use strict';
const BUILD='20260916-followup-persistence-v2';
if(window.__dccCoachFollowupPersistence===BUILD)return;
window.__dccCoachFollowupPersistence=BUILD;

const hasOwn=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function appData(){try{return typeof data!=='undefined'?data:(window.data||{})}catch(_){return window.data||{}}}
function client(id){return (appData().clients||[]).find(x=>String(x.id)===String(id))||null}
function database(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
function persist(){try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){console.warn('DCC seguimiento: no se pudo actualizar la caché local',e)}return false}
function notify(msg){try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}console.info(msg)}
function selectedId(){try{return String(window.selectedClient||'')}catch(_){return''}}
function freqLabel(v,photos){if(v==='weekly')return'Semanal';if(v==='biweekly')return'Cada 2 semanas';if(v==='monthly')return'Mensual';return photos?'Desactivadas':'Desactivado'}
function dateLabel(v){
  if(!v)return'Sin fecha';
  const m=String(v).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d=m?new Date(Number(m[1]),Number(m[2])-1,Number(m[3])):new Date(v);
  if(Number.isNaN(d.getTime()))return String(v);
  return d.toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'}).replace('.','');
}
function normalize(cl){
  if(!cl)return cl;
  if(cl.checkin_frequency!=null)cl.checkinFrequency=cl.checkin_frequency;
  if(cl.photo_frequency!=null)cl.photoFrequency=cl.photo_frequency;
  if(cl.next_diet_review!=null||cl.followup_configured_at)cl.nextDietReview=cl.next_diet_review||'';
  if(cl.next_routine_review!=null||cl.followup_configured_at)cl.nextRoutineReview=cl.next_routine_review||'';
  if(cl.followup_configured_at)cl.followupConfiguredAt=cl.followup_configured_at;
  return cl;
}
function normalizeAll(){(appData().clients||[]).forEach(normalize)}
function localLegacyConfigured(cl){
  return !!cl && (
    hasOwn(cl,'checkinFrequency')||hasOwn(cl,'photoFrequency')||
    hasOwn(cl,'nextDietReview')||hasOwn(cl,'nextRoutineReview')||
    hasOwn(cl,'followupConfiguredAt')
  );
}
function serverConfigured(cl){
  return !!cl && !!(
    cl.followup_configured_at||
    cl.checkin_frequency!=null||cl.photo_frequency!=null||
    cl.next_diet_review!=null||cl.next_routine_review!=null
  );
}
function isConfigured(cl){return serverConfigured(cl)||localLegacyConfigured(cl)}
function configOf(cl){
  cl=normalize(cl||{});
  return {
    checkin:cl.checkinFrequency??cl.checkin_frequency??'weekly',
    photos:cl.photoFrequency??cl.photo_frequency??'monthly',
    diet:cl.nextDietReview??cl.next_diet_review??'',
    routine:cl.nextRoutineReview??cl.next_routine_review??'',
    configured:isConfigured(cl)
  };
}
function applyConfig(cl,cfg,stamp){
  if(!cl)return;
  cl.checkinFrequency=cfg.checkin;cl.checkin_frequency=cfg.checkin;
  cl.photoFrequency=cfg.photos;cl.photo_frequency=cfg.photos;
  cl.nextDietReview=cfg.diet||'';cl.next_diet_review=cfg.diet||null;
  cl.nextRoutineReview=cfg.routine||'';cl.next_routine_review=cfg.routine||null;
  if(stamp){cl.followupConfiguredAt=stamp;cl.followup_configured_at=stamp}
}

function css(){
  if(document.getElementById('dcc-followup-persistence-v1-css'))return;
  const s=document.createElement('style');s.id='dcc-followup-persistence-v1-css';s.textContent=`
    #coach-main.dcc-ca .dcc-followup-badge{flex:none;display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border:1px solid rgba(69,190,133,.34);border-radius:999px;background:rgba(69,190,133,.08);color:#55d79c;font-size:8px;font-weight:900;letter-spacing:.2px}
    #coach-main.dcc-ca .dcc-followup-current{display:grid;margin-top:12px;border:1px solid rgba(217,170,74,.18);border-radius:15px;overflow:hidden;background:rgba(255,255,255,.015)}
    #coach-main.dcc-ca .dcc-followup-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:14px;padding:12px 13px;border-bottom:1px solid rgba(255,255,255,.07)}
    #coach-main.dcc-ca .dcc-followup-row:last-child{border-bottom:0}
    #coach-main.dcc-ca .dcc-followup-row span{color:#929aa5;font-size:10px}
    #coach-main.dcc-ca .dcc-followup-row b{font-size:11px;text-align:right;color:#f3c55b!important}
    #coach-main.dcc-ca .dcc-followup-edit{width:100%;min-height:44px;margin-top:12px;padding:11px 14px;border:1px solid rgba(217,170,74,.50);border-radius:13px;background:transparent;color:#d9aa4a;font-weight:900;font-size:11px}
    #coach-main.dcc-ca .dcc-followup-edit-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    #coach-main.dcc-ca .dcc-followup-cancel{width:100%;padding:12px;border:1px solid #39434c;border-radius:13px;background:transparent;color:#aeb5bd;font-weight:850}
    #coach-main.dcc-ca .dcc-v2-save[disabled]{opacity:.62;cursor:wait}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-followup-badge{background:#effaf4!important;border-color:rgba(47,142,94,.25)!important;color:#2e8b5c!important}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-followup-current{background:#fffaf0!important;border-color:rgba(183,123,22,.16)!important}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-followup-row{border-color:rgba(100,75,30,.10)!important}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-followup-row span{color:#6f7782!important}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-followup-row b{color:#8d5b08!important}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-followup-edit{background:#fffdf8!important;color:#8d5b08!important;border-color:rgba(177,119,18,.35)!important}
    html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-followup-cancel{background:#fffdf8!important;color:#6f7782!important;border-color:rgba(100,75,30,.18)!important}
  `;(document.head||document.documentElement).appendChild(s);
}

function followupCard(){return document.querySelector('#coach-main.dcc-ca .dcc-profile-v2-notes > .dcc-v2-card:first-child')}
function renderFollowupCard(id,editing){
  css();
  const cl=client(id),card=followupCard();if(!cl||!card)return;
  const cfg=configOf(cl),configured=cfg.configured;
  if(configured&&!editing){
    card.innerHTML=`<div class="dcc-v2-head"><div><h2>Configuración actual</h2><div class="dcc-v2-sub">Seguimiento guardado y sincronizado para este cliente</div></div><span class="dcc-followup-badge">✓ Guardado</span></div><div class="dcc-followup-current"><div class="dcc-followup-row"><span>Check-in</span><b>${esc(freqLabel(cfg.checkin,false))}</b></div><div class="dcc-followup-row"><span>Fotos de progreso</span><b>${esc(freqLabel(cfg.photos,true))}</b></div><div class="dcc-followup-row"><span>Revisar alimentación</span><b>${esc(dateLabel(cfg.diet))}</b></div><div class="dcc-followup-row"><span>Revisar rutina</span><b>${esc(dateLabel(cfg.routine))}</b></div></div><button type="button" class="dcc-followup-edit" onclick="dccEditCoachFollowup('${esc(id)}')">Modificar seguimiento</button>`;
    return;
  }
  card.innerHTML=`<div class="dcc-v2-head"><div><h2>${configured?'Modificar seguimiento':'Configuración de seguimiento'}</h2><div class="dcc-v2-sub">${configured?'Actualiza las frecuencias o fechas guardadas':'El entrenador decide la frecuencia para este cliente'}</div></div></div><div class="dcc-v2-form"><div class="dcc-v2-field"><label>Check-in</label><select id="dccV2CheckFreq"><option value="weekly" ${cfg.checkin==='weekly'?'selected':''}>Semanal</option><option value="biweekly" ${cfg.checkin==='biweekly'?'selected':''}>Cada 2 semanas</option><option value="monthly" ${cfg.checkin==='monthly'?'selected':''}>Mensual</option><option value="off" ${cfg.checkin==='off'?'selected':''}>Desactivado</option></select></div><div class="dcc-v2-field"><label>Fotos de progreso</label><select id="dccV2PhotoFreq"><option value="weekly" ${cfg.photos==='weekly'?'selected':''}>Semanal</option><option value="biweekly" ${cfg.photos==='biweekly'?'selected':''}>Cada 2 semanas</option><option value="monthly" ${cfg.photos==='monthly'?'selected':''}>Mensual</option><option value="off" ${cfg.photos==='off'?'selected':''}>Desactivadas</option></select></div><div class="dcc-v2-field"><label>Revisar alimentación</label><input id="dccV2DietDate" type="date" value="${esc(cfg.diet)}"></div><div class="dcc-v2-field"><label>Revisar rutina</label><input id="dccV2RoutineDate" type="date" value="${esc(cfg.routine)}"></div>${configured?`<div class="dcc-followup-edit-actions"><button type="button" class="dcc-followup-cancel" onclick="dccCancelCoachFollowup('${esc(id)}')">Cancelar</button><button type="button" class="dcc-v2-save" onclick="dccSaveCoachFollowup('${esc(id)}')">Actualizar seguimiento</button></div>`:`<button type="button" class="dcc-v2-save" onclick="dccSaveCoachFollowup('${esc(id)}')">Guardar seguimiento</button>`}</div>`;
}

async function readServerConfig(id){
  const db=database();if(!db)return null;
  const res=await db.from('clients').select('checkin_frequency,photo_frequency,next_diet_review,next_routine_review,followup_configured_at').eq('id',id).maybeSingle();
  if(res.error)throw res.error;
  return res.data||null;
}
async function writeServerConfig(id,cfg,stamp){
  const db=database();if(!db)throw new Error('No hay conexión con la base de datos');
  const payload={checkin_frequency:cfg.checkin,photo_frequency:cfg.photos,next_diet_review:cfg.diet||null,next_routine_review:cfg.routine||null,followup_configured_at:stamp};
  const res=await db.from('clients').update(payload).eq('id',id).select('id').maybeSingle();
  if(res.error)throw res.error;
  if(!res.data?.id)throw new Error('El cliente no se pudo actualizar');
  return true;
}
async function syncOne(id){
  const cl=client(id);if(!cl)return;
  let row=null;
  try{row=await readServerConfig(id)}catch(e){console.warn('DCC seguimiento: no se pudo leer la configuración remota',e);return}
  if(!row)return;
  const remoteHas=!!(row.followup_configured_at||row.checkin_frequency!=null||row.photo_frequency!=null||row.next_diet_review!=null||row.next_routine_review!=null);
  if(remoteHas){
    cl.checkin_frequency=row.checkin_frequency;cl.photo_frequency=row.photo_frequency;
    cl.next_diet_review=row.next_diet_review;cl.next_routine_review=row.next_routine_review;
    cl.followup_configured_at=row.followup_configured_at;
    normalize(cl);persist();return;
  }
  if(localLegacyConfigured(cl)){
    const cfg=configOf(cl),stamp=new Date().toISOString();
    try{await writeServerConfig(id,cfg,stamp);applyConfig(cl,cfg,stamp);persist()}catch(e){console.warn('DCC seguimiento: no se pudo migrar la configuración local',e)}
  }
}

const baseCoachNotes=typeof window.dccCoachNotes==='function'?window.dccCoachNotes:null;
window.dccCoachNotes=function(id){
  if(baseCoachNotes)baseCoachNotes.apply(this,arguments);
  renderFollowupCard(id,false);
  syncOne(id).then(()=>{
    if(String(selectedId())===String(id)&&document.querySelector('#coach-main.dcc-ca .dcc-profile-v2-notes'))renderFollowupCard(id,false);
  });
};
window.dccEditCoachFollowup=function(id){renderFollowupCard(id,true)};
window.dccCancelCoachFollowup=function(id){renderFollowupCard(id,false)};
window.dccSaveCoachFollowup=async function(id){
  const cl=client(id);if(!cl)return;
  const button=document.querySelector('#coach-main.dcc-ca .dcc-v2-save');
  const cfg={
    checkin:document.getElementById('dccV2CheckFreq')?.value||'weekly',
    photos:document.getElementById('dccV2PhotoFreq')?.value||'monthly',
    diet:document.getElementById('dccV2DietDate')?.value||'',
    routine:document.getElementById('dccV2RoutineDate')?.value||''
  };
  if(button){button.disabled=true;button.dataset.oldText=button.textContent;button.textContent='Guardando…'}
  try{
    const stamp=new Date().toISOString();
    await writeServerConfig(id,cfg,stamp);
    applyConfig(cl,cfg,stamp);persist();
    notify('Seguimiento actualizado');
    window.dccCoachNotes(id);
  }catch(e){
    console.error('DCC seguimiento: error guardando',e);
    notify('No se pudo guardar el seguimiento');
    if(button){button.disabled=false;button.textContent=button.dataset.oldText||'Guardar seguimiento'}
  }
};

normalizeAll();css();
document.addEventListener('dcc:coach-screen',()=>normalizeAll());
document.addEventListener('dcc:support-ready',()=>normalizeAll());
window.addEventListener('pageshow',normalizeAll);
const obs=new MutationObserver(()=>normalizeAll());
if(document.body)obs.observe(document.body,{childList:true,subtree:true});
else document.addEventListener('DOMContentLoaded',()=>obs.observe(document.body,{childList:true,subtree:true}),{once:true});
})();
