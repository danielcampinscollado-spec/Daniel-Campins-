/* DCC calendar form fix v20.3 — modal estable Light Premium + controles calendario visibles */
(function(){
  'use strict';
  if(window.__dccCalendarFormFixV203)return;
  window.__dccCalendarFormFixV203=true;

  const STYLE_ID='dcc-calendar-form-fix-v203-css';
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
    document.getElementById('dcc-calendar-form-fix-v202-css')?.remove();
    document.getElementById('dcc-calendar-form-fix-v20-css')?.remove();
    document.getElementById('dcc-calendar-form-fix-v19-css')?.remove();
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .dcc-cal-new{position:relative!important;z-index:50!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}

      /* Flechas de cambio de mes: contraste Light Premium */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-move{
        display:grid!important;place-items:center!important;
        color:#9a650a!important;-webkit-text-fill-color:#9a650a!important;
        background:linear-gradient(145deg,#fffdf8 0%,#f8eedc 100%)!important;
        border:1px solid rgba(183,123,19,.42)!important;
        box-shadow:0 4px 12px rgba(78,58,28,.06)!important;
        opacity:1!important;font-size:30px!important;font-weight:700!important;line-height:1!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-move:hover,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-move:active{
        color:#704604!important;-webkit-text-fill-color:#704604!important;
        background:#fff2cc!important;border-color:#d9aa4a!important;
      }

      /* Día seleccionado / hoy: nunca negro en Light Premium */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day.today,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day.selected,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day.today.selected{
        background:linear-gradient(135deg,#f7da82 0%,#e7b640 100%)!important;
        color:#17130a!important;border:1px solid #d9aa4a!important;
        box-shadow:0 5px 14px rgba(183,123,19,.15)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day.today:after,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day.selected:after{background:#8d5b08!important}

      /* Nueva sesión — Light Premium */
      #${OVERLAY_ID}{position:fixed;inset:0;z-index:50000;display:flex;align-items:center;justify-content:center;padding:max(18px,env(safe-area-inset-top)) 18px calc(22px + env(safe-area-inset-bottom));background:rgba(43,36,25,.28)!important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
      #${OVERLAY_ID} .dcc-session-card{width:min(100%,560px);max-height:calc(100dvh - 44px);overflow:auto;box-sizing:border-box;padding:22px;border:1px solid rgba(183,123,19,.34)!important;border-radius:26px;background:radial-gradient(circle at 95% 0,rgba(217,170,74,.08),transparent 28%),linear-gradient(145deg,#fffefa 0%,#f8f1e5 100%)!important;color:#17191d!important;box-shadow:0 28px 80px rgba(72,52,19,.20),inset 0 1px 0 rgba(255,255,255,.96)!important}
      #${OVERLAY_ID} *{box-sizing:border-box}
      #${OVERLAY_ID} .head{display:grid;grid-template-columns:minmax(0,1fr) 48px;gap:12px;align-items:start;margin-bottom:20px}
      #${OVERLAY_ID} h2{margin:0;font-size:27px;line-height:1.05;letter-spacing:-.6px;color:#17191d!important}
      #${OVERLAY_ID} .sub{margin:8px 0 0;color:#747d88!important;font-size:9px;letter-spacing:1.8px;text-transform:uppercase}
      #${OVERLAY_ID} .close{width:46px;height:46px;border:1px solid rgba(183,123,19,.36)!important;border-radius:14px;background:#fffaf1!important;color:#98640b!important;font-size:24px;box-shadow:none!important}
      #${OVERLAY_ID} label{display:block;margin:0 0 14px;color:#25282d!important;font-size:13px;font-weight:750}
      #${OVERLAY_ID} input,#${OVERLAY_ID} select,#${OVERLAY_ID} textarea{display:block;width:100%;min-width:0;max-width:100%;margin-top:8px;padding:0 14px;border:1px solid rgba(183,123,19,.28)!important;border-radius:15px;background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;outline:0;font:600 14px/1.2 inherit;box-shadow:inset 0 1px 0 rgba(255,255,255,.96)!important}
      #${OVERLAY_ID} input,#${OVERLAY_ID} select{height:51px}
      #${OVERLAY_ID} textarea{min-height:92px;padding-top:13px;resize:vertical}
      #${OVERLAY_ID} textarea::placeholder,#${OVERLAY_ID} input::placeholder{color:#737c88!important;-webkit-text-fill-color:#737c88!important;opacity:1!important}
      #${OVERLAY_ID} input:focus,#${OVERLAY_ID} select:focus,#${OVERLAY_ID} textarea:focus{border-color:#d9aa4a!important;box-shadow:0 0 0 3px rgba(217,170,74,.11)!important}
      #${OVERLAY_ID} .row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:11px;width:100%;min-width:0;align-items:start}
      #${OVERLAY_ID} .row>label{min-width:0;overflow:hidden}
      #${OVERLAY_ID} input[type="date"],#${OVERLAY_ID} input[type="time"]{-webkit-appearance:none;appearance:none;overflow:hidden;color-scheme:light!important}
      #${OVERLAY_ID} input[type="date"]::-webkit-date-and-time-value,#${OVERLAY_ID} input[type="time"]::-webkit-date-and-time-value{text-align:center;min-width:0;color:#17191d!important}
      #${OVERLAY_ID} .save{width:100%;height:56px;margin-top:3px;border:1px solid #e5b64d!important;border-radius:17px;background:linear-gradient(135deg,#f5d581 0%,#e1ad3f 100%)!important;color:#18140c!important;font-size:16px;font-weight:900;box-shadow:0 10px 24px rgba(185,125,20,.14)!important}
      #${OVERLAY_ID} .save:disabled{opacity:.6}
      #${OVERLAY_ID} button:focus-visible,#${OVERLAY_ID} input:focus-visible,#${OVERLAY_ID} select:focus-visible,#${OVERLAY_ID} textarea:focus-visible{outline:2px solid #d9aa4a;outline-offset:2px}
      body.dcc-session-open{overflow:hidden}
      @media(max-width:390px){#${OVERLAY_ID}{padding:10px}#${OVERLAY_ID} .dcc-session-card{padding:18px;max-height:calc(100dvh - 20px)}#${OVERLAY_ID} h2{font-size:24px}#${OVERLAY_ID} .row{gap:8px}#${OVERLAY_ID} input[type="date"],#${OVERLAY_ID} input[type="time"]{padding-left:10px;padding-right:10px;font-size:13px}}
    `;document.head.appendChild(s);
  }

  function closeStandalone(){document.getElementById(OVERLAY_ID)?.remove();document.body.classList.remove('dcc-session-open')}
  function closeAnyCalendarModal(){if(document.getElementById(OVERLAY_ID)){closeStandalone();return}if(baseCalendarClose&&baseCalendarClose!==closeAnyCalendarModal){try{return baseCalendarClose()}catch(e){console.warn('DCC cerrando modal de calendario:',e)}}}
  async function getClients(){const local=appData().clients||[];if(local.length)return local.slice().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es'));const db=database();if(!db)return [];try{const res=await db.from('clients').select('id,name').order('name',{ascending:true});if(res.error)throw res.error;return res.data||[]}catch(e){console.error('DCC calendario cargando clientes:',e);return []}}
  async function populateClients(){const select=document.getElementById('dcc-cal-client');if(!select)return;const clients=await getClients();if(!document.getElementById(OVERLAY_ID))return;if(!clients.length){select.innerHTML='<option value="" selected>No hay clientes disponibles</option>';return}select.innerHTML='<option value="" disabled selected>Selecciona un cliente</option>'+clients.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');requestAnimationFrame(()=>select.focus({preventScroll:true}))}
  function openStandalone(){try{injectCss();closeStandalone();const overlay=document.createElement('div');overlay.id=OVERLAY_ID;overlay.innerHTML=`<div class="dcc-session-card" role="dialog" aria-modal="true" aria-labelledby="dcc-session-title"><div class="head"><div><h2 id="dcc-session-title">Nueva sesión</h2><p class="sub">Programa una sesión para un cliente</p></div><button type="button" class="close" id="dcc-session-close" aria-label="Cerrar">×</button></div><label>Cliente<select id="dcc-cal-client"><option value="" selected>Cargando clientes…</option></select></label><div class="row"><label>Fecha<input id="dcc-cal-date" type="date" value=""></label><label>Hora<input id="dcc-cal-time" type="time" value=""></label></div><label>Tipo de sesión<select id="dcc-cal-type"><option>Entrenamiento</option><option>Check-in</option><option>Revisión</option><option>Consulta</option></select></label><label>Notas<textarea id="dcc-cal-notes" maxlength="500" placeholder="Ej. Pierna · revisar técnica de sentadilla"></textarea></label><button id="dcc-cal-save" type="button" class="save">Guardar sesión →</button></div>`;document.body.appendChild(overlay);document.body.classList.add('dcc-session-open');document.getElementById('dcc-session-close')?.addEventListener('click',closeStandalone);overlay.addEventListener('click',e=>{if(e.target===overlay)closeStandalone()});document.getElementById('dcc-cal-save')?.addEventListener('click',saveStandalone);populateClients()}catch(e){console.error('DCC abriendo Nueva sesión:',e);notify('No se pudo abrir Nueva sesión')}}
  async function saveStandalone(){const clientId=document.getElementById('dcc-cal-client')?.value||'',sessionDate=document.getElementById('dcc-cal-date')?.value||'',sessionTime=document.getElementById('dcc-cal-time')?.value||'',sessionType=document.getElementById('dcc-cal-type')?.value||'Entrenamiento',notes=document.getElementById('dcc-cal-notes')?.value.trim()||'';if(!clientId||!sessionDate||!sessionTime){notify('Selecciona cliente, fecha y hora');return}const db=database();if(!db){notify('No se pudo conectar con la agenda');return}const button=document.getElementById('dcc-cal-save');if(button){button.disabled=true;button.textContent='Guardando…'}try{const res=await db.from('coach_calendar_sessions').insert({client_id:clientId,session_date:sessionDate,session_time:sessionTime,session_type:sessionType,notes});if(res.error)throw res.error;const d=new Date(sessionDate+'T12:00:00');window.__dccCalendarSelected=sessionDate;window.__dccCalendarMonthTs=new Date(d.getFullYear(),d.getMonth(),1,12).getTime();if(window.__dccCalendarSessionsByMonth)delete window.__dccCalendarSessionsByMonth[sessionDate.slice(0,7)];closeStandalone();notify('Sesión guardada');if(typeof window.dccCalendarSelect==='function')window.dccCalendarSelect(d.getFullYear(),d.getMonth(),d.getDate());else window.showCoach?.('calendar')}catch(e){console.error('DCC guardando sesión:',e);notify('No se pudo guardar la sesión');if(button){button.disabled=false;button.textContent='Guardar sesión →'}}}
  function directHandler(e){e.preventDefault();e.stopPropagation();openStandalone()}
  function wireButton(){injectCss();const btn=document.querySelector('.dcc-cal-new');if(!btn||btn.__dccV203Bound)return;btn.__dccV203Bound=true;btn.removeAttribute('onclick');btn.onclick=null;btn.addEventListener('click',directHandler,false);btn.setAttribute('aria-label','Nueva sesión')}
  function captureHandler(e){const target=e.target?.closest?.('.dcc-cal-new');if(!target)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();openStandalone()}
  function keyHandler(e){if(e.key==='Escape'&&document.getElementById(OVERLAY_ID))closeStandalone()}
  function restoreRealCalendarControls(){if(!window.__dccCoachCalendarV12)return;if(baseCalendarMove)window.dccCalendarMove=baseCalendarMove;if(baseCalendarSelect)window.dccCalendarSelect=baseCalendarSelect;if(baseCalendarSetView)window.dccCalendarSetView=baseCalendarSetView;window.dccCalendarNewSession=openStandalone;window.dccCalendarCloseModal=closeAnyCalendarModal}
  window.dccCalendarNewSession=openStandalone;window.dccCalendarCloseModal=closeAnyCalendarModal;
  injectCss();document.addEventListener('click',captureHandler,true);document.addEventListener('keydown',keyHandler);wireButton();const root=document.getElementById('coach-main')||document.body;new MutationObserver(()=>wireButton()).observe(root,{childList:true,subtree:true});setTimeout(wireButton,100);setTimeout(wireButton,500);setTimeout(()=>{restoreRealCalendarControls();wireButton()},1600);setTimeout(restoreRealCalendarControls,2600);window.addEventListener('pageshow',()=>setTimeout(()=>{restoreRealCalendarControls();wireButton()},80));
})();
