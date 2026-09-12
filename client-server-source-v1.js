/* DCC — Supabase como fuente de verdad para la lista de clientes */
(function(){
  'use strict';
  if(window.__dccClientServerSourceV1)return;
  window.__dccClientServerSourceV1=true;

  const appData=()=>{try{return data||{}}catch(_){return window.data||{}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  let syncing=null;

  function persist(){
    try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(error){console.warn('DCC client sync: no se pudo persistir cache local',error)}
  }

  async function syncClients(options={}){
    if(syncing)return syncing;
    syncing=(async()=>{
      const database=db();
      if(!database)return false;
      const result=await database.from('clients').select('*').order('created_at',{ascending:true});
      if(result.error)throw result.error;
      const rows=Array.isArray(result.data)?result.data:[];
      const d=appData();
      d.clients=rows;
      persist();

      if(options.render!==false&&window.currentApp==='coach'&&window.currentScreen==='clients'&&typeof window.showCoach==='function'){
        window.showCoach('clients');
      }
      return true;
    })().catch(error=>{
      console.error('DCC client sync:',error);
      return false;
    }).finally(()=>{syncing=null});
    return syncing;
  }

  window.dccSyncClientsFromServer=syncClients;

  async function syncWhenCoachVisible(){
    try{
      const database=db();
      if(!database?.auth)return;
      const session=await database.auth.getSession();
      if(session?.data?.session||window.__dccSecureRole==='coach')await syncClients({render:true});
    }catch(error){console.warn('DCC client sync inicial:',error)}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(syncWhenCoachVisible,180),{once:true});
  else setTimeout(syncWhenCoachVisible,180);
  window.addEventListener('pageshow',()=>setTimeout(syncWhenCoachVisible,80));

  const installShowCoachWrapper=()=>{
    const current=window.showCoach;
    if(typeof current!=='function'||current.__dccClientServerSourceV1)return false;
    const wrapped=function(screen){
      const out=current.apply(this,arguments);
      if(screen==='clients')setTimeout(()=>syncClients({render:false}).then(ok=>{if(ok&&window.currentScreen==='clients'&&typeof current==='function')current.call(window,'clients')}),0);
      return out;
    };
    wrapped.__dccClientServerSourceV1=true;
    wrapped.__base=current;
    window.showCoach=wrapped;
    return true;
  };

  installShowCoachWrapper();
  let tries=0;
  const timer=setInterval(()=>{tries++;if(installShowCoachWrapper()||tries>40)clearInterval(timer)},250);
})();
