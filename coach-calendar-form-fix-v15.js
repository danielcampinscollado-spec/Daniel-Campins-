/* DCC calendar form v22 — editor claro de entrenamientos personales */
(function(){
  'use strict';
  const BUILD='20260925-calendar-form-v23-compact-native-picker';
  if(window.__dccCalendarFormBuild===BUILD)return;
  window.__dccCalendarFormBuild=BUILD;

  const STYLE_ID='dcc-calendar-form-v22-css';
  const OVERLAY_ID='dcc-session-standalone-overlay';
  let editingId=null;

  function appData(){try{return data||{}}catch(e){return window.data||{}}}
  function database(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function notify(t){try{if(typeof toast==='function')return toast(t)}catch(e){}try{window.toast?.(t)}catch(e){}}
  function normalType(v){return String(v||'').toLowerCase()==='a domicilio'?'A domicilio':'En gimnasio'}
  function formatDate(v){if(!v)return 'Seleccionar';const d=new Date(v+'T12:00:00');return Number.isFinite(d.getTime())?d.toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'}):v}
  function formatTime(v){return v?String(v).slice(0,5):'Seleccionar'}

  function injectCss(){
    document.getElementById('dcc-calendar-form-v21-css')?.remove();
    document.getElementById('dcc-calendar-form-fix-v203-css')?.remove();
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .dcc-cal-new{position:relative!important;z-index:5!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-move{display:grid!important;place-items:center!important;color:#9a650a!important;-webkit-text-fill-color:#9a650a!important;background:linear-gradient(145deg,#fffdf8 0%,#f8eedc 100%)!important;border:1px solid rgba(183,123,19,.42)!important;box-shadow:0 4px 12px rgba(78,58,28,.06)!important;opacity:1!important;font-size:30px!important;font-weight:700!important;line-height:1!important}
      #${OVERLAY_ID}{position:fixed;inset:0;z-index:50000;display:flex;align-items:center;justify-content:center;padding:max(18px,env(safe-area-inset-top)) 18px calc(22px + env(safe-area-inset-bottom));background:rgba(43,36,25,.28)!important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
      #${OVERLAY_ID} .dcc-session-card{width:min(100%,560px);max-height:calc(100dvh - 44px);overflow:auto;box-sizing:border-box;padding:16px;border:1px solid rgba(183,123,19,.34)!important;border-radius:20px;background:radial-gradient(circle at 95% 0,rgba(217,170,74,.08),transparent 28%),linear-gradient(145deg,#fffefa 0%,#f8f1e5 100%)!important;color:#17191d!important;box-shadow:0 28px 80px rgba(72,52,19,.20),inset 0 1px 0 rgba(255,255,255,.96)!important}
      #${OVERLAY_ID} *{box-sizing:border-box}#${OVERLAY_ID} .head{display:grid;grid-template-columns:minmax(0,1fr) 38px;gap:9px;align-items:start;margin-bottom:12px}#${OVERLAY_ID} h2{margin:0;font-size:23px;line-height:1.02;letter-spacing:-.6px;color:#17191d!important}#${OVERLAY_ID} .sub{margin:5px 0 0;color:#747d88!important;font-size:8px;letter-spacing:1.5px;text-transform:uppercase}#${OVERLAY_ID} .close{width:38px;height:38px;border:1px solid rgba(183,123,19,.36)!important;border-radius:11px;background:#fffaf1!important;color:#98640b!important;font-size:19px;box-shadow:none!important}
      #${OVERLAY_ID} label{display:block;margin:0 0 9px;color:#25282d!important;font-size:11px;font-weight:750}#${OVERLAY_ID} input,#${OVERLAY_ID} select,#${OVERLAY_ID} textarea{display:block;width:100%;min-width:0;max-width:100%;margin-top:5px;padding:0 11px;border:1px solid rgba(183,123,19,.28)!important;border-radius:12px;background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;outline:0;font:600 12px/1.2 inherit;box-shadow:inset 0 1px 0 rgba(255,255,255,.96)!important}#${OVERLAY_ID} select{height:42px;text-align:center;text-align-last:center}#${OVERLAY_ID} textarea{min-height:66px;padding-top:10px;resize:vertical}#${OVERLAY_ID} textarea::placeholder{color:#737c88!important;-webkit-text-fill-color:#737c88!important;opacity:1!important}
      #${OVERLAY_ID} .row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;width:100%;min-width:0}
      #${OVERLAY_ID} .picker{position:relative;height:42px;margin-top:5px;border:1px solid rgba(183,123,19,.28)!important;border-radius:12px;background:#fffefa!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.96)!important;overflow:hidden}
      #${OVERLAY_ID} .picker input{position:absolute;inset:0;width:100%;height:100%;margin:0;border:0!important;border-radius:0;background:transparent!important;box-shadow:none!important;text-align:center!important;color:transparent!important;-webkit-text-fill-color:transparent!important;color-scheme:light!important;cursor:pointer}
      #${OVERLAY_ID} .picker input::-webkit-date-and-time-value{text-align:center!important}
      #${OVERLAY_ID} .picker input::-webkit-calendar-picker-indicator{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}
      #${OVERLAY_ID} .picker-display{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 10px;pointer-events:none;color:#737c88;font-size:12px;font-weight:700;text-align:center}
      #${OVERLAY_ID} .picker.has-value .picker-display{color:#17191d}
      #${OVERLAY_ID} .save{width:100%;height:44px;margin-top:2px;border:1px solid #e5b64d!important;border-radius:13px;background:linear-gradient(135deg,#f5d581 0%,#e1ad3f 100%)!important;color:#18140c!important;font-size:13px;font-weight:900;box-shadow:0 10px 24px rgba(185,125,20,.14)!important}#${OVERLAY_ID} .save:disabled{opacity:.6}body.dcc-session-open{overflow:hidden}
      @media(max-width:390px){#${OVERLAY_ID}{padding:10px}#${OVERLAY_ID} .dcc-session-card{padding:18px;max-height:calc(100dvh - 20px)}#${OVERLAY_ID} h2{font-size:24px}#${OVERLAY_ID} .row{gap:8px}}
    `;document.head.appendChild(s);
  }

  function closeStandalone(){document.getElementById(OVERLAY_ID)?.remove();document.body.classList.remove('dcc-session-open');editingId=null}
  async function getClients(){
    const local=appData().clients||[];if(local.length)return local.slice().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es'));
    const db=database();if(!db)return [];
    try{const res=await db.from('clients').select('id,name').order('name',{ascending:true});if(res.error)throw res.error;return res.data||[]}catch(e){console.error('DCC agenda cargando clientes:',e);return []}
  }
  async function populateClients(selected){
    const select=document.getElementById('dcc-cal-client');if(!select)return;const clients=await getClients();if(!document.getElementById(OVERLAY_ID))return;
    if(!clients.length){select.innerHTML='<option value="" selected>No hay clientes disponibles</option>';return}
    select.innerHTML='<option value="" selected disabled>Seleccionar</option>'+clients.map(c=>`<option value="${esc(c.id)}"${String(c.id)===String(selected)?' selected':''}>${esc(c.name)}</option>`).join('');
    if(!selected)select.value='';
  }

  function syncPicker(inputId,displayId,kind){
    const input=document.getElementById(inputId),display=document.getElementById(displayId),wrap=input?.closest('.picker');if(!input||!display||!wrap)return;
    const paint=()=>{const has=!!input.value;wrap.classList.toggle('has-value',has);display.textContent=kind==='date'?formatDate(input.value):formatTime(input.value)};
    input.addEventListener('input',paint);input.addEventListener('change',paint);const openNative=()=>{try{if(typeof input.showPicker==='function')input.showPicker();else input.focus()}catch(_){input.focus()}};wrap.addEventListener('click',e=>{if(e.target===input)return;openNative()});display.addEventListener('click',openNative);paint();
  }

  function openEditor(session){
    try{
      injectCss();closeStandalone();editingId=session?.id||null;
      const selectedDate=session?.session_date||'';
      const selectedTime=session?.session_time?String(session.session_time).slice(0,5):'';
      const modality=session?.session_type?normalType(session.session_type):'';
      const notes=session?.notes||'';
      const isEdit=!!editingId;
      const overlay=document.createElement('div');overlay.id=OVERLAY_ID;
      overlay.innerHTML=`<div class="dcc-session-card" role="dialog" aria-modal="true" aria-labelledby="dcc-session-title"><div class="head"><div><h2 id="dcc-session-title">${isEdit?'Editar entreno':'Nuevo entreno'}</h2><p class="sub">${isEdit?'Actualiza este entrenamiento personal':'Programa un entrenamiento personal'}</p></div><button type="button" class="close" id="dcc-session-close" aria-label="Cerrar">×</button></div><label>Cliente<select id="dcc-cal-client"><option value="">Cargando clientes…</option></select></label><div class="row"><label>Fecha<div class="picker"><input id="dcc-cal-date" type="date" value="${esc(selectedDate)}"><span class="picker-display" id="dcc-cal-date-display">Seleccionar</span></div></label><label>Hora<div class="picker"><input id="dcc-cal-time" type="time" value="${esc(selectedTime)}"><span class="picker-display" id="dcc-cal-time-display">Seleccionar</span></div></label></div><label>Modalidad<select id="dcc-cal-type"><option value=""${!modality?' selected':''} disabled>Seleccionar</option><option value="En gimnasio"${modality==='En gimnasio'?' selected':''}>En gimnasio</option><option value="A domicilio"${modality==='A domicilio'?' selected':''}>A domicilio</option></select></label><label>Notas <span style="font-weight:500;color:#7b838d">(opcional)</span><textarea id="dcc-cal-notes" maxlength="500" placeholder="Añade alguna nota…">${esc(notes)}</textarea></label><button id="dcc-cal-save" type="button" class="save">${isEdit?'Guardar cambios':'Guardar entreno'} →</button></div>`;
      document.body.appendChild(overlay);document.body.classList.add('dcc-session-open');
      document.getElementById('dcc-session-close')?.addEventListener('click',closeStandalone);
      overlay.addEventListener('click',e=>{if(e.target===overlay)closeStandalone()});
      document.getElementById('dcc-cal-save')?.addEventListener('click',saveEditor);
      syncPicker('dcc-cal-date','dcc-cal-date-display','date');syncPicker('dcc-cal-time','dcc-cal-time-display','time');
      populateClients(session?.client_id||'');
    }catch(e){console.error('DCC abriendo editor de entreno:',e);notify('No se pudo abrir el entrenamiento')}
  }

  async function saveEditor(){
    const clientId=document.getElementById('dcc-cal-client')?.value||'',sessionDate=document.getElementById('dcc-cal-date')?.value||'',sessionTime=document.getElementById('dcc-cal-time')?.value||'',sessionType=document.getElementById('dcc-cal-type')?.value||'',notes=document.getElementById('dcc-cal-notes')?.value.trim()||'';
    if(!clientId||!sessionDate||!sessionTime||!sessionType){notify('Selecciona cliente, fecha, hora y modalidad');return}
    const db=database();if(!db){notify('No se pudo conectar con la agenda');return}
    const button=document.getElementById('dcc-cal-save');if(button){button.disabled=true;button.textContent='Guardando…'}
    try{
      const payload={client_id:clientId,session_date:sessionDate,session_time:sessionTime,session_type:sessionType,notes};
      const wasEditing=!!editingId;
      const res=editingId?await db.from('coach_calendar_sessions').update(payload).eq('id',editingId):await db.from('coach_calendar_sessions').insert(payload);
      if(res.error)throw res.error;
      const d=new Date(sessionDate+'T12:00:00');window.__dccCalendarSelected=sessionDate;window.__dccCalendarMonthTs=new Date(d.getFullYear(),d.getMonth(),1,12).getTime();window.__dccCalendarView='agenda';
      if(window.__dccCalendarSessionsByMonth)delete window.__dccCalendarSessionsByMonth[sessionDate.slice(0,7)];
      closeStandalone();notify(wasEditing?'Entrenamiento actualizado':'Entrenamiento guardado');
      if(typeof window.dccCalendarRefresh==='function')window.dccCalendarRefresh();else if(typeof window.dccCalendarSelect==='function')window.dccCalendarSelect(d.getFullYear(),d.getMonth(),d.getDate());
    }catch(e){console.error('DCC guardando entreno:',e);notify('No se pudo guardar el entrenamiento');if(button){button.disabled=false;button.textContent=editingId?'Guardar cambios →':'Guardar entreno →'}}
  }

  function captureNew(e){const target=e.target?.closest?.('.dcc-cal-new');if(!target)return;e.preventDefault();e.stopPropagation();openEditor(null)}
  function keyHandler(e){if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))closeStandalone()}

  window.dccCalendarOpenSessionEditor=openEditor;
  window.dccCalendarNewSession=()=>openEditor(null);
  window.dccCalendarCloseModal=closeStandalone;
  injectCss();
  document.addEventListener('click',captureNew,true);
  document.addEventListener('keydown',keyHandler);
})();