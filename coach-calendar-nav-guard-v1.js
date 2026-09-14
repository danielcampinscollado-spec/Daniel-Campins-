/* DCC — navegación estable hacia Calendario y Mensajes del entrenador */
(function(){
  'use strict';
  const BUILD='20260914-coach-primary-nav-guard-v5';
  if(window.__dccCoachPrimaryNavGuard===BUILD)return;
  window.__dccCoachPrimaryNavGuard=BUILD;

  let navToken=0;
  function coachVisible(){
    const coach=document.getElementById('coach');if(!coach)return false;
    try{return getComputedStyle(coach).display!=='none'&&getComputedStyle(coach).visibility!=='hidden'}catch(_){return true}
  }
  function navButtons(){const nav=document.getElementById('coach-nav');return nav?[...nav.querySelectorAll('button')]:[]}
  function markActive(index){
    navButtons().forEach((b,i)=>{
      const active=i===index;
      if(b.classList.contains('active')!==active)b.classList.toggle('active',active);
      if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    });
  }
  function render(screen,index){
    if(!coachVisible())return false;
    window.currentScreen=screen;
    let ok=false;
    if(typeof window.showCoach==='function'){
      try{window.showCoach(screen);ok=true}catch(e){console.error('DCC '+screen+' render:',e)}
    }
    window.currentScreen=screen;markActive(index);
    return ok;
  }
  function openStable(screen,index){
    if(!coachVisible())return;
    const mine=++navToken;
    render(screen,index);
    [60,140,280,520,900,1400].forEach(delay=>setTimeout(()=>{
      if(mine!==navToken||window.currentApp!=='coach')return;
      if(window.currentScreen!==screen)render(screen,index);else markActive(index);
    },delay));
  }

  window.dccOpenCoachCalendar=()=>openStable('calendar',2);
  window.dccOpenCoachMessages=()=>openStable('messages',4);

  function patch(){
    const buttons=navButtons();if(buttons.length<5)return false;
    buttons[2].setAttribute('onclick','dccOpenCoachCalendar()');
    buttons[4].setAttribute('onclick','dccOpenCoachMessages()');
    return true;
  }

  document.addEventListener('click',e=>{
    const b=e.target?.closest?.('#coach-nav button');if(!b)return;
    const buttons=navButtons(),index=buttons.indexOf(b);
    if(index!==2&&index!==4){navToken++;return}
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    if(index===2)window.dccOpenCoachCalendar();else window.dccOpenCoachMessages();
  },true);

  function boot(){
    if(patch())return;
    let tries=0;const timer=setInterval(()=>{tries++;if(patch()||tries>50)clearInterval(timer)},100);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',()=>setTimeout(boot,60));
})();
