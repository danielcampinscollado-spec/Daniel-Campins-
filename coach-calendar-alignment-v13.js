/* DCC calendar alignment v13 — evita colisión entre .out del menú y días de otros meses */
(function(){
  'use strict';
  if(window.__dccCalendarAlignmentV13)return;
  window.__dccCalendarAlignmentV13=true;

  const id='dcc-calendar-alignment-v13-css';
  if(document.getElementById(id))return;

  const style=document.createElement('style');
  style.id=id;
  style.textContent=`
    /* En móvil, la clase global .out oculta el botón "Salir".
       Los días externos del calendario también usaban .out y desaparecían,
       desplazando todos los días una columna. Los mantenemos dentro del grid. */
    #coach-main.dcc-cal-v11 .dcc-cal-grid > button.dcc-cal-day.out{
      display:grid !important;
      place-items:center !important;
    }
  `;
  document.head.appendChild(style);
})();
