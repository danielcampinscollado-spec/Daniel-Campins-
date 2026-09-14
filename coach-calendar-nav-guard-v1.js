/* DCC — navegación inferior estable del entrenador */
(function(){
  'use strict';
  const BUILD='20260914-coach-primary-nav-guard-v6';
  if(window.__dccCoachPrimaryNavGuard===BUILD)return;
  window.__dccCoachPrimaryNavGuard=BUILD;

  const ROUTES=['dashboard','clients','calendar','checkins','messages'];
  let navToken=0;

  function coachVisible(){
    const coach=document.getElementById('coach');if(!coach)return false;
    try{return getComputedStyle(coach).display!=='none'&&getComputedStyle(coach).visibility!=='hidden'}catch(_){return true}
  }
  function navButtons(){const nav=document.getElementById('coach-nav');return nav?[...nav.querySelectorAll('button')]:[]}
  function markActive(index){
    navButtons().forEach((b,i)=>{
      const active=i===index;
      b.classList.toggle('active',active);
      if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    });
  }
  function render(screen,index){
    if(!coachVisible())return false;
    window.currentScreen=screen;
    try{
      if(typeof window.showCoach!=='function')return false;
      window.showCoach(screen);
      window.currentScreen=screen;
      markActive(index);
      return true;
    }catch(e){console.error('DCC '+screen+' render:',e);return false}
  }
  function openStable(index){
    const screen=ROUTES[index];
    if(!screen||!coachVisible())return;
    const mine=++navToken;
    render(screen,index);
    [50,120,240,420,700,1050,1500,2000].forEach(delay=>setTimeout(()=>{
      if(mine!==navToken||!coachVisible())return;
      if(window.currentScreen!==screen)render(screen,index);else markActive(index);
    },delay));
  }

  window.dccOpenCoachPrimary=openStable;
  window.dccOpenCoachCalendar=()=>openStable(2);
  window.dccOpenCoachCheckins=()=>openStable(3);
  window.dccOpenCoachMessages=()=>openStable(4);

  function patch(){
    const buttons=navButtons();if(buttons.length<5)return false;
    ROUTES.forEach((screen,index)=>{
      if(buttons[index])buttons[index].setAttribute('onclick',`dccOpenCoachPrimary(${index})`);
    });
    return true;
  }

  document.addEventListener('click',e=>{
    const b=e.target?.closest?.('#coach-nav button');if(!b)return;
    const buttons=navButtons(),index=buttons.indexOf(b);
    if(index<0||index>=ROUTES.length)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    openStable(index);
  },true);

  function boot(){
    patch();
    let tries=0;const timer=setInterval(()=>{tries++;patch();if(tries>50)clearInterval(timer)},100);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',()=>setTimeout(boot,60));
})();
