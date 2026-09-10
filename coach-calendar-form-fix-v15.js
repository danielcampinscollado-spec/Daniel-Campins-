/* DCC calendar form fix v16 — corrige Fecha/Hora en Safari móvil y sin valores por defecto */
(function(){
  'use strict';
  if(window.__dccCalendarFormFixV16)return;
  window.__dccCalendarFormFixV16=true;

  const id='dcc-calendar-form-fix-v16-css';
  if(!document.getElementById(id)){
    const style=document.createElement('style');
    style.id=id;
    style.textContent=`
      /* Safari da a date/time un ancho intrínseco que puede romper columnas grid. */
      #dcc-cal-session-form .row{
        display:grid !important;
        grid-template-columns:minmax(0,1fr) minmax(0,1fr) !important;
        gap:10px !important;
        width:100% !important;
        min-width:0 !important;
        align-items:start !important;
      }

      #dcc-cal-session-form .row > label{
        width:100% !important;
        min-width:0 !important;
        max-width:100% !important;
        margin:0 0 13px !important;
        overflow:hidden !important;
      }

      #dcc-cal-session-form .row input[type="date"],
      #dcc-cal-session-form .row input[type="time"]{
        display:block !important;
        width:100% !important;
        min-width:0 !important;
        max-width:100% !important;
        box-sizing:border-box !important;
        margin-top:7px !important;
        overflow:hidden !important;
        -webkit-appearance:none !important;
        appearance:none !important;
      }

      #dcc-cal-session-form .row input[type="date"]::-webkit-date-and-time-value,
      #dcc-cal-session-form .row input[type="time"]::-webkit-date-and-time-value{
        min-width:0 !important;
        text-align:center !important;
      }

      #dcc-cal-session-form .row input[type="date"]::-webkit-datetime-edit,
      #dcc-cal-session-form .row input[type="time"]::-webkit-datetime-edit{
        min-width:0 !important;
        padding:0 !important;
      }

      @media(max-width:390px){
        #dcc-cal-session-form .row{
          gap:8px !important;
        }
        #dcc-cal-session-form .row input[type="date"],
        #dcc-cal-session-form .row input[type="time"]{
          padding-left:10px !important;
          padding-right:10px !important;
          font-size:13px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function install(attempt){
    const current=window.dccCalendarNewSession;
    if(typeof current!=='function'){
      if((attempt||0)<60)setTimeout(()=>install((attempt||0)+1),80);
      return;
    }
    if(current.__dccEmptyDateTimeV16)return;

    const wrapped=function(){
      const result=current.apply(this,arguments);
      requestAnimationFrame(()=>{
        const date=document.getElementById('dcc-cal-date');
        const time=document.getElementById('dcc-cal-time');
        if(date)date.value='';
        if(time)time.value='';
      });
      return result;
    };
    wrapped.__dccEmptyDateTimeV16=true;
    wrapped.__base=current;
    window.dccCalendarNewSession=wrapped;
  }

  install(0);
  window.addEventListener('pageshow',()=>setTimeout(()=>install(0),80));
})();
