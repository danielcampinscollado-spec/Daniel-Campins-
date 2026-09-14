/* DCC — navegación estable hacia Calendario del entrenador */
(function(){
  'use strict';
  const BUILD='20260914-coach-calendar-nav-guard-v2';
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

  window.dccOpenCoachCalendar=function(){
    if(!coachVisible())return;
    window.currentScreen='calendar';
    /* La API del propio calendario llama a su render privado y evita atravesar routers antiguos. */
    if(typeof window.dccCalendarSetView==='function'){
      try{window.dccCalendarSetView(window.__dccCalendarView==='agenda'?'agenda':'month');markCalendarActive();return}catch(e){console.error('DCC calendar direct:',e)}
    }
    if(typeof window.showCoach==='function'){
      try{window.showCoach('calendar');window.currentScreen='calendar';markCalendarActive()}catch(e){console.error('DCC calendar fallback:',e)}
    }
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
