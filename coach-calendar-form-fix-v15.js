/* DCC calendar form fix v20.1 — modal estable + preservación de controles reales */
(function(){
  'use strict';
  if(window.__dccCalendarFormFixV201)return;
  window.__dccCalendarFormFixV201=true;

  const STYLE_ID='dcc-calendar-form-fix-v20-css';
  const OVERLAY_ID='dcc-session-standalone-overlay';
  const baseCalendarClose=typeof window.dccCalendarCloseModal==='function'?window.dccCalendarCloseModal:null;
  const baseCalendarMove=typeof window.dccCalendarMove==='function'?window.dccCalendarMove:null;
  const baseCalendarSelect=typeof window.dccCalendarSelect==='function'?window.dccCalendarSelect:null;
  const baseCalendarSetView=typeof window.dccCalendarSetView==='function'?window.dccCalendarSetView:null;

  function appData(){try{return data||{}}catch(e){return window.data||{}}}
  function database(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function notify(t){try{if(typeof toast==='function')return toast(t)}catch(e){};try{window.toast?.(t)}catch(e){}}

  function injectCss(){
    if(document.getElementById(STYLE_ID))return;
    document.getElementById('dcc-calendar-form-fix-v19-css')?.remove();
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .dcc-cal-new{position:relative!important;z-index:50!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
      #${OVERLAY_ID}{position:fixed;inset:0;z-index:50000;display:flex;align-items:center;justify-content:center;padding:max(18px,env(safe-area-inset-top)) 18px calc(22px + env(safe-area-inset-bottom));background:rgba(0,0,0,.82);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
      #${OVERLAY_ID} .dcc-session-card{width:min(100%,560px);max-height:calc(100dvh - 44px);overflow:auto;box-sizing:border-box;padding:22px;border:1px solid rgba(240,201,107,.78);border-radius:26px;background:radial-gradient(circle at 95% 0,rgba(240,201,107,.10),transparent 28%),linear-gradient(145deg,#11171d,#080b0f);color:#f5f3ef;box-shadow:0 28px 80px rgba(0,0,0,.58),0 0 30px rgba(217,170,74,.08)}
      #${OVERLAY_ID} *{box-sizing:border-box}#${OVERLAY_ID} .head{display:grid;grid-template-columns:minmax(0,1fr) 48px;gap:12px;align-items:start;margin-bottom:20px}#${OVERLAY_ID} h2{margin:0;font-size:27px;line-height:1.05;letter-spacing:-.6px;color:#f7f4ee}#${OVERLAY_ID} .sub{margin:8px 0 0;color:#8d96a1;font-size:9px;letter-spacing:1.8px;text-transform:uppercase}#${OVERLAY_ID} .close{width:46px;height:46px;border:1px solid rgba(217,170,74,.48);border-radius:14px;background:#0b0f13;color:#f4f2ee;font-size:24px}
      #${OVERLAY_ID} label{display:block;margin:0 0 14px;color:#f0efec;font-size:13px;font-weight:750}#${OVERLAY_ID} input,#${OVERLAY_ID} select,#${OVERLAY_ID} textarea{display:block;width:100%;min-width:0;max-width:100%;margin-top:8px;padding:0 14px;border:1px solid rgba(159,170,182,.40);border-radius:15px;background:#0c1116;color:#f6f3ed;-webkit-text-fill-color:#f6f3ed;outline:0;font:600 14px/1.2 inherit}#${OVERLAY_ID} input,#${OVERLAY_ID} select{height:51px}#${OVERLAY_ID} textarea{min-height:92px;padding-top:13px;resize:vertical}#${OVERLAY_ID} input:focus,#${OVERLAY_ID} select:focus,#${OVERLAY_ID} textarea:focus{border-color:#f0c96b;box-shadow:0 0 0 3px rgba(217,170,74,.09)}
      #${OVERLAY_ID} .row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:11px;width:100%;min-width:0;align-items:start}#${OVERLAY_ID} .row>label{min-width:0;overflow:hidden}#${OVERLAY_ID} input[type="date"],#${OVERLAY_ID} input[type="time"]{-webkit-appearance:none;appearance:none;overflow:hidden}#${OVERLAY_ID} input[type="date"]::-webkit-date-and-time-value,#${OVERLAY_ID} input[type="time"]::-webkit-date-and-time-value{text-align:center;min-width:0}
      #${OVERLAY_ID} .save{width:100%;height:56px;margin-top:3px;border:1px solid #f3ce6a;border-radius:17px;background:linear-gradient(135deg,#d9a83d,#f4d679 52%,#dfad42);color:#15110a;font-size:16px;font-weight:900;box-shadow:0 10px 28px rgba(217,170,74,.16)}#${OVERLAY_ID} .save:disabled{opacity:.6}#${OVERLAY_ID} button:focus-visible,#${OVERLAY_ID} input:focus-visible,#${OVERLAY_ID} select:focus-visible,#${OVERLAY_ID} textarea:focus-visible{outline:2px solid #f0c96b;outline-offset:2px}body.dcc-session-open{overflow:hidden}
      @media(max-width:390px){#${OVERLAY_ID}{padding:10px}#${OVERLAY_ID} .dcc-session-card{padding:18px;max-height:calc(100dvh - 20px)}#${OVERLAY_ID} h2{font-size:24px}#${OVERLAY_ID} .row{gap:8px}#${OVERLAY_ID} input[type="date"],#${OVERLAY_ID} input[type="time"]{padding-left:10px;padding-right:10px;font-size:13px}}
    `;document.head.appendChild(s);
  }

  function closeStandalone(){document.getElementById(OVERLAY_ID)?.remove();document.body.classList.remove('dcc-session-open')}
  function closeAnyCalendarModal(){if(document.getElementById(OVERLAY_ID)){closeStandalone();return}if(baseCalendarClose&&baseCalendarClose!==closeAnyCalendarModal){try{return baseCalendarClose()}catch(e){console.warn('DCC cerrando modal de calendario:',e)}}}

  async function getClients(){
    const local=appData().clients||[];if(local.length)return local.slice().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es'));
    const db=database();if(!db)return [];
    try{const res=await db.from('clients').select('id,name').order('name',{ascending:true});if(res.error)throw res.error;return res.data||[]}catch(e){console.error('DCC calendario cargando clientes:',e);return []}
  }
  async function populateClients(){
    const select=document.getElementById('dcc-cal-client');if(!select)return;const clients=await getClients();if(!document.getElementById(OVERLAY_ID))return;
    if(!clients.length){select.innerHTML='<option value="" selected>No hay clientes disponibles</option>';return}
    select.innerHTML='<option value="" disabled selected>Selecciona un cliente</option>'+clients.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');requestAnimationFrame(()=>select.focus({preventScroll:true}));
  }

  function openStandalone(){
    try{
      injectCss();closeStandalone();const overlay=document.createElement('div');overlay.id=OVERLAY_ID;
      overlay.innerHTML=`<div class="dcc-session-card" role="dialog" aria-modal="true" aria-labelledby="dcc-session-title"><div class="head"><div><h2 id="dcc-session-title">Nueva sesión</h2><p class="sub">Programa una sesión para un cliente</p></div><button type="button" class="close" id="dcc-session-close" aria-label="Cerrar">×</button></div><label>Cliente<select id="dcc-cal-client"><option value="" selected>Cargando clientes…</option></select></label><div class="row"><label>Fecha<input id="dcc-cal-date" type="date" value=""></label><label>Hora<input id="dcc-cal-time" type="time" value=""></label></div><label>Tipo de sesión<select id="dcc-cal-type"><option>Entrenamiento</option><option>Check-in</option><option>Revisión</option><option>Consulta</option></select></label><label>Notas<textarea id="dcc-cal-notes" maxlength="500" placeholder="Ej. Pierna · revisar técnica de sentadilla"></textarea></label><button id="dcc-cal-save" type="button" class="save">Guardar sesión →</button></div>`;
      document.body.appendChild(overlay);document.body.classList.add('dcc-session-open');document.getElementById('dcc-session-close')?.addEventListener('click',closeStandalone);overlay.addEventListener('click',e=>{if(e.target===overlay)closeStandalone()});document.getElementById('dcc-cal-save')?.addEventListener('click',saveStandalone);populateClients();
    }catch(e){console.error('DCC abriendo Nueva sesión:',e);notify('No se pudo abrir Nueva sesión')}
  }

  async function saveStandalone(){
    const clientId=document.getElementById('dcc-cal-client')?.value||'',sessionDate=document.getElementById('dcc-cal-date')?.value||'',sessionTime=document.getElementById('dcc-cal-time')?.value||'',sessionType=document.getElementById('dcc-cal-type')?.value||'Entrenamiento',notes=document.getElementById('dcc-cal-notes')?.value.trim()||'';
    if(!clientId||!sessionDate||!sessionTime){notify('Selecciona cliente, fecha y hora');return}const db=database();if(!db){notify('No se pudo conectar con la agenda');return}
    const button=document.getElementById('dcc-cal-save');if(button){button.disabled=true;button.textContent='Guardando…'}
    try{
      const res=await db.from('coach_calendar_sessions').insert({client_id:clientId,session_date:sessionDate,session_time:sessionTime,session_type:sessionType,notes});if(res.error)throw res.error;
      const d=new Date(sessionDate+'T12:00:00');window.__dccCalendarSelected=sessionDate;window.__dccCalendarMonthTs=new Date(d.getFullYear(),d.getMonth(),1,12).getTime();if(window.__dccCalendarSessionsByMonth)delete window.__dccCalendarSessionsByMonth[sessionDate.slice(0,7)];closeStandalone();notify('Sesión guardada');
      if(typeof window.dccCalendarSelect==='function')window.dccCalendarSelect(d.getFullYear(),d.getMonth(),d.getDate());else window.showCoach?.('calendar');
    }catch(e){console.error('DCC guardando sesión:',e);notify('No se pudo guardar la sesión');if(button){button.disabled=false;button.textContent='Guardar sesión →'}}
  }

  function directHandler(e){e.preventDefault();e.stopPropagation();openStandalone()}
  function wireButton(){injectCss();const btn=document.querySelector('.dcc-cal-new');if(!btn||btn.__dccV201Bound)return;btn.__dccV201Bound=true;btn.removeAttribute('onclick');btn.onclick=null;btn.addEventListener('click',directHandler,false);btn.setAttribute('aria-label','Nueva sesión')}
  function captureHandler(e){const target=e.target?.closest?.('.dcc-cal-new');if(!target)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();openStandalone()}
  function keyHandler(e){if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))closeStandalone()}
  function restoreRealCalendarControls(){
    if(!window.__dccCoachCalendarV12)return;
    if(baseCalendarMove)window.dccCalendarMove=baseCalendarMove;
    if(baseCalendarSelect)window.dccCalendarSelect=baseCalendarSelect;
    if(baseCalendarSetView)window.dccCalendarSetView=baseCalendarSetView;
    window.dccCalendarNewSession=openStandalone;window.dccCalendarCloseModal=closeAnyCalendarModal;
  }

  window.dccCalendarNewSession=openStandalone;window.dccCalendarCloseModal=closeAnyCalendarModal;
  injectCss();document.addEventListener('click',captureHandler,true);document.addEventListener('keydown',keyHandler);wireButton();
  const root=document.getElementById('coach-main')||document.body;new MutationObserver(()=>wireButton()).observe(root,{childList:true,subtree:true});
  setTimeout(wireButton,100);setTimeout(wireButton,500);setTimeout(()=>{restoreRealCalendarControls();wireButton()},1600);setTimeout(restoreRealCalendarControls,2600);
  window.addEventListener('pageshow',()=>setTimeout(()=>{restoreRealCalendarControls();wireButton()},80));
})();
