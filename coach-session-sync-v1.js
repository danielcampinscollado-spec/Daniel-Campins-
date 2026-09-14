/* DCC — puente de sesión entrenador -> sincronización canónica de clientes */
(function(){
  'use strict';
  const BUILD='20260914-coach-session-sync-v1';
  if(window.__dccCoachSessionSync===BUILD)return;
  window.__dccCoachSessionSync=BUILD;

  let running=null;
  let authBound=false;

  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};

  function coachVisible(){
    const el=document.getElementById('coach');
    if(!el)return false;
    try{return getComputedStyle(el).display!=='none'}catch(_){return true}
  }

  async function sessionIsCoach(session){
    const database=db();
    if(!database||!session?.user)return false;
    if(window.__dccSecureRole==='coach')return true;
    const {data,error}=await database.from('app_profiles').select('role').eq('user_id',session.user.id).maybeSingle();
    if(error)throw error;
    if(data?.role!=='coach')return false;
    window.__dccSecureRole='coach';
    return true;
  }

  async function syncNow(reason='manual'){
    if(running)return running;
    running=(async()=>{
      const database=db();
      if(!database?.auth)return false;
      const {data,error}=await database.auth.getSession();
      if(error)throw error;
      const session=data?.session;
      if(!session||!(await sessionIsCoach(session)))return false;
      const sync=window.dccCoachClientSync;
      if(typeof sync!=='function')return false;
      const clients=await sync(false);
      if(!Array.isArray(clients))return false;
      if(coachVisible()&&typeof window.showCoach==='function'){
        const screen=window.currentScreen==='clients'?'clients':'dashboard';
        window.showCoach(screen);
      }
      try{document.dispatchEvent(new CustomEvent('dcc:coach-clients-synced',{detail:{count:clients.length,reason}}))}catch(_){}
      return true;
    })().catch(error=>{console.warn('DCC coach session sync:',error);return false}).finally(()=>{running=null});
    return running;
  }

  function bindAuth(){
    const database=db();
    if(!database?.auth||authBound)return false;
    authBound=true;
    database.auth.onAuthStateChange((event,session)=>{
      if(!session)return;
      queueMicrotask(()=>syncNow('auth:'+event));
    });
    queueMicrotask(()=>syncNow('initial'));
    return true;
  }

  window.dccCoachSessionSyncNow=syncNow;
  bindAuth();
  document.addEventListener('DOMContentLoaded',bindAuth,{once:true});
  window.addEventListener('load',()=>{bindAuth();syncNow('load')},{once:true});
  window.addEventListener('pageshow',()=>{bindAuth();syncNow('pageshow')});
})();
