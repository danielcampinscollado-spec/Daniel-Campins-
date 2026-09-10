/* DCC calendar form fix v17 — modal estable, Fecha/Hora vacías y botón Nueva sesión funcional */
(function(){
  'use strict';
  if(window.__dccCalendarFormFixV17)return;
  window.__dccCalendarFormFixV17=true;

  const id='dcc-calendar-form-fix-v17-css';
  if(!document.getElementById(id)){
    const style=document.createElement('style');
    style.id=id;
    style.textContent=`
      #dcc-cal-session-form .row{
        display:grid!important;
        grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
        gap:10px!important;
        width:100%!important;
        min-width:0!important;
        align-items:start!important;
      }
      #dcc-cal-session-form .row>label{
        width:100%!important;
        min-width:0!important;
        max-width:100%!important;
        margin:0 0 13px!important;
        overflow:hidden!important;
      }
      #dcc-cal-session-form .row input[type="date"],
      #dcc-cal-session-form .row input[type="time"]{
        display:block!important;
        width:100%!important;
        min-width:0!important;
        max-width:100%!important;
        box-sizing:border-box!important;
        margin-top:7px!important;
        overflow:hidden!important;
        -webkit-appearance:none!important;
        appearance:none!important;
      }
      #dcc-cal-session-form .row input[type="date"]::-webkit-date-and-time-value,
      #dcc-cal-session-form .row input[type="time"]::-webkit-date-and-time-value{
        min-width:0!important;
        text-align:center!important;
      }
      #dcc-cal-session-form .row input[type="date"]::-webkit-datetime-edit,
      #dcc-cal-session-form .row input[type="time"]::-webkit-datetime-edit{
        min-width:0!important;
        padding:0!important;
      }
      @media(max-width:390px){
        #dcc-cal-session-form .row{gap:8px!important}
        #dcc-cal-session-form .row input[type="date"],
        #dcc-cal-session-form .row input[type="time"]{
          padding-left:10px!important;
          padding-right:10px!important;
          font-size:13px!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function appData(){
    try{return data||{}}catch(e){return window.data||{}}
  }
  function esc(v){
    return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function notify(t){
    try{if(typeof toast==='function')return toast(t)}catch(e){}
    try{window.toast?.(t)}catch(e){}
  }

  function openSessionForm(){
    const clients=appData().clients||[];
    if(!clients.length){notify('Primero necesitas crear un cliente');return}

    const show=(typeof openModal==='function')?openModal:window.openModal;
    if(typeof show!=='function'){
      console.error('DCC calendario: openModal no disponible');
      notify('No se pudo abrir Nueva sesión');
      return;
    }

    show(`<div id="dcc-cal-session-form"><div class="head"><div><h2>Nueva sesión</h2><p class="sub">Programa una sesión para un cliente</p></div><button type="button" class="close" onclick="dccCalendarCloseModal()">×</button></div><label>Cliente<select id="dcc-cal-client"><option value="" disabled selected>Selecciona un cliente</option>${clients.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select></label><div class="row"><label>Fecha<input id="dcc-cal-date" type="date" value=""></label><label>Hora<input id="dcc-cal-time" type="time" value=""></label></div><label>Tipo de sesión<select id="dcc-cal-type"><option>Entrenamiento</option><option>Check-in</option><option>Revisión</option><option>Consulta</option></select></label><label>Notas<textarea id="dcc-cal-notes" placeholder="Ej. Pierna · revisar técnica de sentadilla"></textarea></label><button id="dcc-cal-save" type="button" class="save" onclick="dccCalendarSaveSession()">Guardar sesión →</button></div>`);

    document.getElementById('modal')?.classList.add('dcc-cal-session-overlay');
    requestAnimationFrame(()=>{
      const date=document.getElementById('dcc-cal-date');
      const time=document.getElementById('dcc-cal-time');
      if(date)date.value='';
      if(time)time.value='';
    });
  }

  function install(attempt){
    if(!window.__dccCoachCalendarV12||typeof window.dccCalendarSaveSession!=='function'){
      if((attempt||0)<80)setTimeout(()=>install((attempt||0)+1),80);
      return;
    }
    openSessionForm.__dccCalendarNewSessionV17=true;
    window.dccCalendarNewSession=openSessionForm;
  }

  install(0);
  setTimeout(()=>install(0),400);
  setTimeout(()=>install(0),1200);
  window.addEventListener('pageshow',()=>setTimeout(()=>install(0),80));
})();
