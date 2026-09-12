/* DCC — bloqueo de sesión y entrada autenticada v2 */
(function(){
  'use strict';
  const BUILD='20260912-auth-session-guard-v2';
  if(window.__dccAuthSessionGuard===BUILD)return;
  window.__dccAuthSessionGuard=BUILD;

  const AUTHORITATIVE_OBJECTS=[
    'diets','routines','routineUpdatedAt','workoutHistory','weights',
    'messages','checkins','notificationState','bodyFatHistory'
  ];

  function db(){
    try{
      if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient;
    }catch(_){}
    return window.supabaseClient||null;
  }

  function appData(){
    try{return data||window.data||null}catch(_){return window.data||null}
  }

  function persist(){
    try{
      if(typeof saveData==='function')return saveData();
      if(typeof window.saveData==='function')return window.saveData();
    }catch(error){console.warn('DCC auth guard cache:',error)}
  }

  function clearAuthoritativeState(clearClients){
    const d=appData();
    if(!d)return;
    AUTHORITATIVE_OBJECTS.forEach(key=>{d[key]={}});
    if(clearClients)d.clients=[];
    try{d.completedTrainingDays={}}catch(_){}
    persist();
  }

  function showLogin(message){
    clearAuthoritativeState(true);
    try{currentClientId=null}catch(_){}
    try{window.currentClientId=null}catch(_){}
    window.__dccSecureRole=null;
    document.querySelector('.dcc-secure-session-badge')?.remove();

    const login=document.getElementById('login');
    const client=document.getElementById('client');
    const coach=document.getElementById('coach');
    if(login)login.style.display='flex';
    if(client)client.style.display='none';
    if(coach)coach.style.display='none';

    const status=document.getElementById('dcc-secure-auth-status');
    if(status&&message){
      status.textContent=message;
      status.dataset.type='error';
    }
  }

  async function session(){
    const client=db();
    if(!client?.auth)return null;
    try{
      const {data:result,error}=await client.auth.getSession();
      if(error)throw error;
      return result?.session||null;
    }catch(error){
      console.warn('DCC auth guard session:',error);
      return null;
    }
  }

  function wrapOpenApp(){
    const current=window.openApp;
    if(typeof current!=='function')return false;
    if(current.__dccSecureGuard===BUILD)return true;

    const wrapped=async function(app){
      if(app!=='client'&&app!=='coach')return current.apply(this,arguments);

      const active=await session();
      const role=window.__dccSecureRole;
      if(!active||role!==app){
        showLogin('Necesitas una sesión válida para acceder a esta área.');
        return false;
      }

      /* El servidor manda. Nunca pintar el panel del entrenador con una
         instantánea antigua del navegador mientras llega Supabase. */
      clearAuthoritativeState(app==='coach');
      return current.apply(this,arguments);
    };

    wrapped.__dccSecureGuard=BUILD;
    wrapped.__base=current;
    window.openApp=wrapped;
    return true;
  }

  function bindAuthState(){
    if(window.__dccAuthSessionGuardBound)return;
    const client=db();
    if(!client?.auth)return;
    window.__dccAuthSessionGuardBound=true;
    client.auth.onAuthStateChange((event,nextSession)=>{
      if(event==='SIGNED_OUT'||!nextSession){
        showLogin('La sesión ha finalizado. Vuelve a iniciar sesión.');
      }
    });
  }

  async function verifyExistingSession(){
    const active=await session();
    if(!active)showLogin('Inicia sesión para continuar.');
  }

  wrapOpenApp();
  bindAuthState();

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{
      wrapOpenApp();
      bindAuthState();
      verifyExistingSession();
    },{once:true});
  }else{
    verifyExistingSession();
  }

  window.addEventListener('pageshow',()=>{
    wrapOpenApp();
    verifyExistingSession();
  });
})();
