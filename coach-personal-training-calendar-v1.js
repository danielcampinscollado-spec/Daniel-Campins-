/* DCC — Calendario entrenador: gestión de entrenamientos personales */
(function(){
'use strict';
const BUILD='20260916-personal-training-calendar-v1';
if(window.__dccPersonalTrainingCalendar===BUILD)return;
window.__dccPersonalTrainingCalendar=BUILD;
const STYLE_ID='dcc-personal-training-calendar-v1-css';
const EDIT_ID='dcc-pt-edit-overlay';

function appData(){try{return data||{}}catch(_){return window.data||{}}}
function database(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function notify(t){try{if(typeof toast==='function')return toast(t)}catch(_){}try{window.toast?.(t)}catch(_){}}
function cache(){return window.__dccCalendarSessionsByMonth||{}}
function selectedKey(){return window.__dccCalendarSelected||new Date().toISOString().slice(0,10)}
function sessionsForSelected(){const key=selectedKey();return (cache()[key.slice(0,7)]||[]).filter(x=>x.session_date===key).sort((a,b)=>String(a.session_time||'').localeCompare(String(b.session_time||'')))}
function findSession(id){for(const rows of Object.values(cache())){const row=(rows||[]).find(x=>String(x.id)===String(id));if(row)return row}return null}
function clients(){return (appData().clients||[]).slice().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es'))}

function injectCss(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
  #coach-main.dcc-cal-v11 .dcc-cal-head p{max-width:520px!important}
  #coach-main.dcc-cal-v11 .dcc-cal-session{grid-template-columns:54px minmax(0,1fr) 38px!important}
  #coach-main.dcc-cal-v11 .dcc-pt-actions{display:flex;flex-direction:column;gap:6px;align-items:center}
  #coach-main.dcc-cal-v11 .dcc-pt-edit,#coach-main.dcc-cal-v11 .dcc-cal-session-delete{width:34px!important;height:34px!important;display:grid!important;place-items:center!important;border-radius:11px!important}
  #coach-main.dcc-cal-v11 .dcc-pt-edit{border:1px solid rgba(217,170,74,.38);background:rgba(217,170,74,.05);color:#e5b94e;font-size:17px;font-weight:800}
  html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-pt-edit{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.30)!important}
  #${EDIT_ID}{position:fixed;inset:0;z-index:50010;display:flex;align-items:center;justify-content:center;padding:max(18px,env(safe-area-inset-top)) 18px calc(22px + env(safe-area-inset-bottom));background:rgba(43,36,25,.28);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
  #${EDIT_ID} .dcc-pt-card{width:min(100%,560px);max-height:calc(100dvh - 44px);overflow:auto;padding:22px;box-sizing:border-box;border:1px solid rgba(183,123,19,.34);border-radius:26px;background:linear-gradient(145deg,#fffefa,#f8f1e5);color:#17191d;box-shadow:0 28px 80px rgba(72,52,19,.20)}
  #${EDIT_ID} *{box-sizing:border-box}#${EDIT_ID} .head{display:grid;grid-template-columns:1fr 46px;gap:12px;align-items:start;margin-bottom:20px}#${EDIT_ID} h2{margin:0;font-size:26px;line-height:1.05;color:#17191d}#${EDIT_ID} .sub{margin:7px 0 0;color:#747d88;font-size:9px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase}#${EDIT_ID} .close{width:44px;height:44px;border:1px solid rgba(183,123,19,.36);border-radius:14px;background:#fffaf1;color:#98640b;font-size:23px}
  #${EDIT_ID} label{display:block;margin:0 0 14px;color:#25282d;font-size:13px;font-weight:750}#${EDIT_ID} input,#${EDIT_ID} select,#${EDIT_ID} textarea{display:block;width:100%;margin-top:8px;padding:0 14px;border:1px solid rgba(183,123,19,.28);border-radius:15px;background:#fffefa;color:#17191d;-webkit-text-fill-color:#17191d;outline:0;font:600 14px/1.2 inherit}#${EDIT_ID} input,#${EDIT_ID} select{height:51px}#${EDIT_ID} textarea{min-height:92px;padding-top:13px;resize:vertical}#${EDIT_ID} .row{display:grid;grid-template-columns:1fr 1fr;gap:11px}#${EDIT_ID} .save{width:100%;height:56px;border:1px solid #e5b64d;border-radius:17px;background:linear-gradient(135deg,#f5d581,#e1ad3f);color:#18140c;font-size:16px;font-weight:900}#${EDIT_ID} .save:disabled{opacity:.6}
  @media(max-width:390px){#${EDIT_ID}{padding:10px}#${EDIT_ID} .dcc-pt-card{padding:18px;max-height:calc(100dvh - 20px)}#coach-main.dcc-cal-v11 .dcc-cal-session{grid-template-columns:50px minmax(0,1fr) 36px!important}}
  `;(document.head||document.documentElement).appendChild(s);
}

function personalizeNewModal(){
  const o=document.getElementById('dcc-session-standalone-overlay');if(!o||o.dataset.dccPt==='1')return;
  o.dataset.dccPt='1';
  const h=o.querySelector('h2');if(h)h.textContent='Nuevo entrenamiento personal';
  const sub=o.querySelector('.sub');if(sub)sub.textContent='Programa una sesión con un cliente';
  const type=o.querySelector('#dcc-cal-type');
  if(type){type.innerHTML='<option value="Entrenamiento personal">Presencial</option><option value="Entrenamiento online">Online</option><option value="Entrenamiento a domicilio">A domicilio</option>';const label=type.closest('label');if(label)label.childNodes[0].textContent='Modalidad';}
  const notes=o.querySelector('#dcc-cal-notes');if(notes)notes.placeholder='Objetivo de la sesión, ubicación o indicaciones para el cliente';
  const save=o.querySelector('#dcc-cal-save');if(save)save.textContent='Guardar entrenamiento →';
}

function enhanceCalendar(){
  injectCss();
  const main=document.getElementById('coach-main');if(!main?.classList.contains('dcc-cal-v11'))return;
  const title=main.querySelector('.dcc-cal-head h1');if(title)title.textContent='Entrenamientos personales';
  const intro=main.querySelector('.dcc-cal-head p');if(intro)intro.textContent='Organiza y gestiona tus sesiones de entrenamiento personal con cada cliente.';
  const add=main.querySelector('.dcc-cal-new');if(add)add.textContent='＋ Nuevo entreno';
  const agendaTitle=main.querySelector('.dcc-cal-agenda-head h2');if(agendaTitle)agendaTitle.textContent='Sesiones del día';
  const agendaOnly=main.querySelector('.dcc-cal-agenda-only');if(agendaOnly)agendaOnly.textContent='Entrenamientos programados para la fecha seleccionada.';
  const empty=main.querySelector('.dcc-cal-empty span:last-child');if(empty)empty.textContent='No hay entrenamientos personales programados para este día.';
  const rows=sessionsForSelected();
  [...main.querySelectorAll('.dcc-cal-session')].forEach((card,i)=>{
    const row=rows[i];if(!row||card.dataset.dccPt==='1')return;card.dataset.dccPt='1';card.dataset.sessionId=String(row.id);
    const del=card.querySelector('.dcc-cal-session-delete');if(!del)return;
    const actions=document.createElement('div');actions.className='dcc-pt-actions';
    const edit=document.createElement('button');edit.type='button';edit.className='dcc-pt-edit';edit.setAttribute('aria-label','Editar entrenamiento');edit.textContent='✎';edit.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openEdit(row.id)});
    del.parentNode.insertBefore(actions,del);actions.append(edit,del);
  });
}

function closeEdit(){document.getElementById(EDIT_ID)?.remove();document.body.classList.remove('dcc-session-open')}
function openEdit(id){
  const row=findSession(id);if(!row){notify('No se encontró el entrenamiento');return}closeEdit();
  const list=clients();const o=document.createElement('div');o.id=EDIT_ID;
  o.innerHTML=`<div class="dcc-pt-card" role="dialog" aria-modal="true"><div class="head"><div><h2>Editar entrenamiento</h2><p class="sub">Gestiona la sesión personal</p></div><button type="button" class="close" aria-label="Cerrar">×</button></div><label>Cliente<select id="dcc-pt-client">${list.map(c=>`<option value="${esc(c.id)}" ${String(c.id)===String(row.client_id)?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label><div class="row"><label>Fecha<input id="dcc-pt-date" type="date" value="${esc(row.session_date)}"></label><label>Hora<input id="dcc-pt-time" type="time" value="${esc(String(row.session_time||'').slice(0,5))}"></label></div><label>Modalidad<select id="dcc-pt-type"><option value="Entrenamiento personal">Presencial</option><option value="Entrenamiento online">Online</option><option value="Entrenamiento a domicilio">A domicilio</option></select></label><label>Notas<textarea id="dcc-pt-notes" maxlength="500" placeholder="Objetivo, ubicación o indicaciones">${esc(row.notes||'')}</textarea></label><button type="button" class="save" id="dcc-pt-save">Guardar cambios →</button></div>`;
  document.body.appendChild(o);document.body.classList.add('dcc-session-open');
  const type=o.querySelector('#dcc-pt-type');if(type){const known=['Entrenamiento personal','Entrenamiento online','Entrenamiento a domicilio'];type.value=known.includes(row.session_type)?row.session_type:'Entrenamiento personal'}
  o.querySelector('.close')?.addEventListener('click',closeEdit);o.addEventListener('click',e=>{if(e.target===o)closeEdit()});o.querySelector('#dcc-pt-save')?.addEventListener('click',()=>saveEdit(row));
}

async function saveEdit(original){
  const db=database();if(!db){notify('No se pudo conectar con la agenda');return}
  const client_id=document.getElementById('dcc-pt-client')?.value||'',session_date=document.getElementById('dcc-pt-date')?.value||'',session_time=document.getElementById('dcc-pt-time')?.value||'',session_type=document.getElementById('dcc-pt-type')?.value||'Entrenamiento personal',notes=document.getElementById('dcc-pt-notes')?.value.trim()||'';
  if(!client_id||!session_date||!session_time){notify('Selecciona cliente, fecha y hora');return}
  const b=document.getElementById('dcc-pt-save');if(b){b.disabled=true;b.textContent='Guardando…'}
  try{
    const res=await db.from('coach_calendar_sessions').update({client_id,session_date,session_time,session_type,notes}).eq('id',original.id);if(res.error)throw res.error;
    delete cache()[String(original.session_date).slice(0,7)];delete cache()[session_date.slice(0,7)];
    const d=new Date(session_date+'T12:00:00');window.__dccCalendarSelected=session_date;window.__dccCalendarMonthTs=new Date(d.getFullYear(),d.getMonth(),1,12).getTime();closeEdit();notify('Entrenamiento actualizado');
    if(typeof window.dccCalendarForceMonthSync==='function')await window.dccCalendarForceMonthSync();else window.showCoach?.('calendar');
  }catch(e){console.error('DCC editando entrenamiento:',e);notify('No se pudo actualizar el entrenamiento');if(b){b.disabled=false;b.textContent='Guardar cambios →'}}
}

const observer=new MutationObserver(()=>{personalizeNewModal();enhanceCalendar()});
function boot(){injectCss();enhanceCalendar();personalizeNewModal();observer.observe(document.documentElement,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('dcc:coach-screen',e=>{if(e.detail?.screen==='calendar')requestAnimationFrame(enhanceCalendar)});
window.addEventListener('pageshow',()=>requestAnimationFrame(enhanceCalendar));
})();