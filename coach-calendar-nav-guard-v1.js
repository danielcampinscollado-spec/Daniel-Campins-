/* DCC — navegación inferior estable del entrenador; sincroniza también el estado interno de index */
(function(){
  'use strict';
  const BUILD='20260914-coach-primary-nav-guard-v10';
  if(window.__dccCoachPrimaryNavGuard===BUILD)return;
  window.__dccCoachPrimaryNavGuard=BUILD;

  const ROUTES=['dashboard','clients','calendar','checkins','messages'];

  function coachVisible(){
    const coach=document.getElementById('coach');
    if(!coach)return false;
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
  function clearInstantDashboard(screen){
    if(screen==='dashboard')return;
    const main=document.getElementById('coach-main');
    if(main?.dataset?.dccInstant)delete main.dataset.dccInstant;
    window.__dccCoachRouteIntent=screen;
  }

  function openStable(index){
    const screen=ROUTES[index];
    if(!screen||!coachVisible())return;
    try{
      clearInstantDashboard(screen);

      /* IMPORTANTE: showCoach actualiza el `let currentScreen` interno de index.html.
         Escribir solo window.currentScreen no lo actualiza y los loaders asíncronos
         podían interpretar que seguíamos en dashboard y devolver Check-in/Mensajes a Inicio. */
      if(typeof window.showCoach==='function'){
        window.showCoach(screen);
      }else{
        return;
      }

      /* Check-in conserva su renderer premium, pero solo DESPUÉS de sincronizar
         el estado interno mediante showCoach('checkins'). */
      if(screen==='checkins'&&typeof window.dccRenderCoachCheckins==='function'){
        window.dccRenderCoachCheckins();
      }

      window.currentScreen=screen;
      window.__dccCoachRouteIntent=screen;
      markActive(index);

      requestAnimationFrame(()=>{
        window.currentScreen=screen;
        window.__dccCoachRouteIntent=screen;
        markActive(index);
      });
    }catch(e){console.error('DCC '+screen+' render:',e)}
  }

  window.dccOpenCoachPrimary=openStable;
  window.dccOpenCoachCalendar=()=>openStable(2);
  window.dccOpenCoachCheckins=()=>openStable(3);
  window.dccOpenCoachMessages=()=>openStable(4);

  function patch(){
    const buttons=navButtons();
    /* Solo parcheamos la navegación premium definitiva de 5 botones.
       El menú legacy de 7 botones existe durante el arranque y no debe tocarse. */
    if(buttons.length!==5)return false;
    ROUTES.forEach((screen,index)=>{
      const b=buttons[index];
      if(b&&b.getAttribute('onclick')!==`dccOpenCoachPrimary(${index})`)b.setAttribute('onclick',`dccOpenCoachPrimary(${index})`);
    });
    return true;
  }

  document.addEventListener('click',e=>{
    const b=e.target?.closest?.('#coach-nav button');
    if(!b)return;
    const buttons=navButtons();
    if(buttons.length!==5)return;
    const index=buttons.indexOf(b);
    if(index<0||index>=ROUTES.length)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    openStable(index);
  },true);

  function boot(){
    if(patch())return;
    let tries=0;
    const timer=setInterval(()=>{tries++;if(patch()||tries>60)clearInterval(timer)},100);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',()=>setTimeout(boot,60));
})();
