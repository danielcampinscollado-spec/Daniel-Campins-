/* DCC — Router cliente autoritativo final v2 */
(function(){
  'use strict';
  const BUILD='20260922-client-final-router-v2';
  if(window.__dccClientFinalRouter===BUILD)return;
  window.__dccClientFinalRouter=BUILD;

  function setScreen(screen){
    try{window.currentScreen=screen}catch(_){}
    try{if(typeof currentScreen!=='undefined')currentScreen=screen}catch(_){}
    const nav=document.getElementById('client-nav');
    if(!nav)return;
    const map={home:0,food:1,training:2,progress:3,checkin:4,messages:5};
    const buttons=nav.querySelectorAll('button');
    buttons.forEach(b=>b.classList.remove('active'));
    const i=map[screen];
    if(i!==undefined&&buttons[i])buttons[i].classList.add('active');
  }

  /* Mantener la cadena funcional ya instalada.
     El router anterior la "desenvolvía" hasta showClient legado y con ello
     saltaba las autoridades de Check-in, Mensajes y otras pantallas. */
  const delegated=window.showClient;
  if(typeof delegated!=='function')return;

  function route(screen){
    const target=String(screen||'home');

    if(target==='home'){
      setScreen('home');
      try{
        if(typeof window.dccClientGoHome==='function'){
          window.dccClientGoHome();
          return true;
        }
        if(typeof window.dccRenderClientHomeApproved==='function'){
          window.dccRenderClientHomeApproved();
          return true;
        }
      }catch(error){
        console.error('DCC final router home',error);
      }
      return delegated.apply(this,arguments);
    }

    if(target==='training'&&!window.activeWorkout){
      setScreen('training');
      try{
        if(typeof window.dccRenderTrainingOverview==='function'){
          window.dccRenderTrainingOverview();
          return true;
        }
      }catch(error){
        console.error('DCC final router training',error);
      }
      return delegated.apply(this,arguments);
    }

    setScreen(target);
    return delegated.apply(this,arguments);
  }

  route.__dccFinalClientRouter=true;
  route.__base=delegated;
  window.showClient=route;

  let repairing=false;
  function ensureHome(){
    if(repairing)return;
    const app=document.getElementById('client');
    const main=document.getElementById('client-main');
    if(!app||!main)return;

    let visible=false;
    try{visible=getComputedStyle(app).display!=='none'}catch(_){visible=true}
    if(!visible||window.currentApp!=='client'||!window.currentClientId)return;

    const screen=String(window.currentScreen||'home');
    if(screen!=='home')return;
    if(main.querySelector('.dcc-home2'))return;

    repairing=true;
    try{route('home')}catch(error){console.error('DCC final router repair',error)}
    finally{setTimeout(()=>{repairing=false},0)}
  }

  const retryDelays=[0,50,120,250,500,900,1500,2500,4000,6500,9000];
  function retryHome(){retryDelays.forEach(ms=>setTimeout(ensureHome,ms))}
  retryHome();

  document.addEventListener('DOMContentLoaded',retryHome,{once:true});
  window.addEventListener('pageshow',retryHome);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)retryHome()});

  const main=document.getElementById('client-main');
  if(main){
    new MutationObserver(()=>queueMicrotask(ensureHome)).observe(main,{childList:true});
  }
})();
