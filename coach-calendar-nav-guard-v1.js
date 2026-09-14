/* DCC — navegación estable hacia Calendario del entrenador */
(function(){
  'use strict';
  const BUILD='20260914-coach-calendar-nav-guard-v1';
  if(window.__dccCoachCalendarNavGuard===BUILD)return;
  window.__dccCoachCalendarNavGuard=BUILD;

  let recovering=false;

  function coachVisible(){
    const coach=document.getElementById('coach');
    if(!coach)return false;
    try{return getComputedStyle(coach).display!=='none'&&getComputedStyle(coach).visibility!=='hidden'}catch(_){return true}
  }

  function calendarButton(){
    const nav=document.getElementById('coach-nav');
    if(!nav)return null;
    const buttons=[...nav.querySelectorAll('button')];
    return buttons[2]||null;
  }

  function markCalendarActive(){
    const nav=document.getElementById('coach-nav');
    if(!nav)return;
    const buttons=[...nav.querySelectorAll('button')];
    buttons.forEach((b,i)=>{
      b.classList.toggle('active',i===2);
      if(i===2)b.setAttribute('aria-current','page');
      else b.removeAttribute('aria-current');
    });
  }

  function openCalendar(){
    if(!coachVisible()||typeof window.showCoach!=='function')return;
    window.currentScreen='calendar';
    try{window.showCoach('calendar')}catch(e){console.error('DCC calendar nav:',e);return}
    markCalendarActive();

    // Evita que una capa antigua devuelva la navegación al Panel justo después del toque.
    setTimeout(()=>{
      const main=document.getElementById('coach-main');
      const calendarVisible=!!main?.classList.contains('dcc-cal-v11')||!!main?.querySelector('.dcc-cal');
      if(window.currentScreen==='calendar'&&calendarVisible){markCalendarActive();return}
      if(recovering)return;
      recovering=true;
      window.currentScreen='calendar';
      try{window.showCoach('calendar')}catch(e){console.error('DCC calendar nav recovery:',e)}
      markCalendarActive();
      setTimeout(()=>{recovering=false},180);
    },140);
  }

  function patchButton(){
    const b=calendarButton();
    if(!b)return;
    b.setAttribute('onclick',"showCoach('calendar')");
  }

  document.addEventListener('click',e=>{
    const b=e.target?.closest?.('#coach-nav button');
    const target=calendarButton();
    if(!b||!target||b!==target)return;
    // Se carga después de la protección de cambios sin guardar: si aquella cancela,
    // este listener no llega a ejecutarse. Si permite salir, abrimos Calendario una sola vez.
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openCalendar();
  },true);

  let queued=false;
  function schedulePatch(){
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;patchButton();if(window.currentScreen==='calendar')markCalendarActive()});
  }

  function boot(){
    patchButton();
    if(document.body&&!document.body.__dccCalendarNavObserver){
      document.body.__dccCalendarNavObserver=true;
      new MutationObserver(schedulePatch).observe(document.body,{childList:true,subtree:true});
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.addEventListener('pageshow',()=>setTimeout(boot,60));
})();
