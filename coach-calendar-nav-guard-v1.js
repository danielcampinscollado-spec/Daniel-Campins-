/* DCC — navegación inferior estable del entrenador: una acción = un render */
(function(){
  'use strict';
  const BUILD='20260915-coach-primary-nav-guard-v12';
  if(window.__dccCoachPrimaryNavGuard===BUILD)return;
  window.__dccCoachPrimaryNavGuard=BUILD;

  const ROUTES=['dashboard','clients','calendar','checkins','messages'];
  function coachVisible(){const coach=document.getElementById('coach');if(!coach)return false;try{return getComputedStyle(coach).display!=='none'&&getComputedStyle(coach).visibility!=='hidden'}catch(_){return true}}
  function navButtons(){const nav=document.getElementById('coach-nav');return nav?[...nav.querySelectorAll('button')]:[]}
  function markActive(index){navButtons().forEach((b,i)=>{const active=i===index;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}
  function syncLegacy(screen){
    window.currentScreen=screen;window.__dccCoachRouteIntent=screen;
    try{window.eval('currentScreen='+JSON.stringify(screen)+';currentApp="coach"')}catch(_){}
  }
  function clearInstantDashboard(screen){if(screen==='dashboard')return;const main=document.getElementById('coach-main');if(main?.dataset?.dccInstant)delete main.dataset.dccInstant}

  function openStable(index){
    const screen=ROUTES[index];if(!screen||!coachVisible()||typeof window.showCoach!=='function')return;
    try{
      clearInstantDashboard(screen);syncLegacy(screen);markActive(index);
      window.showCoach(screen);
      syncLegacy(screen);markActive(index);
    }catch(e){console.error('DCC '+screen+' render:',e)}
  }

  window.dccOpenCoachPrimary=openStable;window.dccOpenCoachCalendar=()=>openStable(2);window.dccOpenCoachCheckins=()=>openStable(3);window.dccOpenCoachMessages=()=>openStable(4);

  function patch(){
    const buttons=navButtons();if(buttons.length!==5)return false;
    ROUTES.forEach((screen,index)=>{const b=buttons[index],next=`dccOpenCoachPrimary(${index})`;if(b&&b.getAttribute('onclick')!==next)b.setAttribute('onclick',next)});return true;
  }

  document.addEventListener('click',e=>{
    const b=e.target?.closest?.('#coach-nav button');if(!b)return;
    const buttons=navButtons();if(buttons.length!==5)return;
    const index=buttons.indexOf(b);if(index<0||index>=ROUTES.length)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openStable(index);
  },true);

  function boot(){if(patch())return;let tries=0;const timer=setInterval(()=>{tries++;if(patch()||tries>20)clearInterval(timer)},100)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',()=>setTimeout(boot,40));
})();
