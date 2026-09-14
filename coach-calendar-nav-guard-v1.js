/* DCC — navegación estable hacia Calendario del entrenador */
(function(){
  'use strict';
  const BUILD='20260914-coach-calendar-nav-guard-v3';
  if(window.__dccCoachCalendarNavGuard===BUILD)return;
  window.__dccCoachCalendarNavGuard=BUILD;

  function coachVisible(){
    const coach=document.getElementById('coach');if(!coach)return false;
    try{return getComputedStyle(coach).display!=='none'&&getComputedStyle(coach).visibility!=='hidden'}catch(_){return true}
  }
  function calendarButton(){const nav=document.getElementById('coach-nav');return nav?[...nav.querySelectorAll('button')][2]||null:null}
  function markCalendarActive(){
    const nav=document.getElementById('coach-nav');if(!nav)return;
    [...nav.querySelectorAll('button')].forEach((b,i)=>{
      const active=i===2;
      if(b.classList.contains('active')!==active)b.classList.toggle('active',active);
      if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    });
  }
  function renderCalendar(){
    if(!coachVisible())return false;
    window.currentScreen='calendar';
    let ok=false;
    if(typeof window.showCoach==='function'){
      try{window.showCoach('calendar');ok=true}catch(e){console.error('DCC calendar render:',e)}
    }
    window.currentScreen='calendar';markCalendarActive();
    return ok;
  }

  window.dccOpenCoachCalendar=function(){
    if(!coachVisible())return;
    renderCalendar();
    /* Si termina de cargar una capa antigua justo después del toque, reafirma Calendario sin necesitar un segundo toque. */
    requestAnimationFrame(()=>{
      window.currentScreen='calendar';markCalendarActive();
      setTimeout(()=>{
        if(window.currentApp==='coach'&&window.currentScreen!=='calendar')renderCalendar();
        else markCalendarActive();
      },90);
    });
  };

  function patch(){const b=calendarButton();if(!b)return false;b.setAttribute('onclick','dccOpenCoachCalendar()');return true}

  document.addEventListener('click',e=>{
    const target=calendarButton(),b=e.target?.closest?.('#coach-nav button');
    if(!target||b!==target)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    window.dccOpenCoachCalendar();
  },true);

  function boot(){
    if(patch())return;
    let tries=0;const timer=setInterval(()=>{tries++;if(patch()||tries>40)clearInterval(timer)},100);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',()=>setTimeout(boot,60));
})();
