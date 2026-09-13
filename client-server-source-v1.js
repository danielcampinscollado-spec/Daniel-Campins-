/* DCC — Supabase como fuente de verdad para la lista de clientes */
(function(){
  'use strict';
  const BUILD='20260913-client-source-v5';
  if(window.__dccClientServerSource===BUILD)return;
  window.__dccClientServerSource=BUILD;

  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  let syncing=null;
  let lastRenderedSignature='';

  function persist(){
    try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(error){console.warn('DCC client sync: no se pudo persistir cache local',error)}
  }

  function normalizeClient(row,previous={}){
    return {
      ...previous,
      ...row,
      id:row.id,
      name:row.name||'',
      goal:row.goal||'',
      weight:Number(row.weight)||0,
      initial:row.initial_weight!=null?Number(row.initial_weight):(Number(row.weight)||0),
      bodyFatInitial:row.initial_body_fat!=null?Number(row.initial_body_fat):null,
      age:row.age!=null?Number(row.age):null,
      height:row.height_cm!=null?Number(row.height_cm):null,
      heightCm:row.height_cm!=null?Number(row.height_cm):null,
      height_cm:row.height_cm!=null?Number(row.height_cm):null,
      foodsToAvoid:String(row.foods_to_avoid||''),
      foods_to_avoid:String(row.foods_to_avoid||''),
      plan:row.plan||'',
      status:row.status||'Pendiente',
      created_at:row.created_at||previous.created_at||null
    };
  }

  function pruneDeletedClientDomains(validIds){
    const d=appData();
    [
      'checkins','diets','routines','previousRoutines','routineUpdatedAt',
      'weights','workoutHistory','bodyFatHistory','messages','notificationState',
      'completedTrainingDays','dietHistory'
    ].forEach(key=>{
      const obj=d[key];
      if(!obj||typeof obj!=='object'||Array.isArray(obj))return;
      Object.keys(obj).forEach(id=>{if(!validIds.has(String(id)))delete obj[id]});
    });
  }

  function clearStaleClients(){
    const d=appData();
    if(!Array.isArray(d.clients)||d.clients.length===0)return;
    d.clients=[];
    persist();
  }

  function showAuthRequired(){
    const main=document.getElementById('coach-main');
    if(!main||document.getElementById('dcc-client-auth-required'))return;
    const box=document.createElement('div');
    box.id='dcc-client-auth-required';
    box.style.cssText='margin:18px 0;padding:18px;border:1px solid rgba(218,172,70,.45);border-radius:18px;background:#fffaf0;color:#27231b;box-shadow:0 10px 28px rgba(86,64,22,.08)';
    box.innerHTML='<b style="display:block;margin-bottom:6px">Acceso seguro necesario</b><span style="font-size:13px;line-height:1.45;color:#6d6250">La lista antigua del navegador se ha descartado. Para cargar y gestionar los clientes reales, entra con tu sesión segura de entrenador.</span>';
    main.prepend(box);
  }

  async function getCoachSession(){
    const database=db();
    if(!database?.auth)return null;
    const result=await database.auth.getSession();
    const session=result?.data?.session||null;
    if(!session)return null;
    try{
      const profile=await database.from('app_profiles').select('role').eq('user_id',session.user.id).maybeSingle();
      if(profile.error||profile.data?.role!=='coach')return null;
    }catch(_){return null}
    return session;
  }

  function rerenderCoachScreen(rows,options){
    if(options.render===false||window.currentApp!=='coach'||typeof window.showCoach!=='function')return;
    const screen=window.currentScreen;
    if(screen!=='dashboard'&&screen!=='clients')return;
    const signature=screen+':'+rows.map(row=>String(row.id)).join('|');
    if(signature===lastRenderedSignature)return;
    lastRenderedSignature=signature;
    queueMicrotask(()=>{
      if(window.currentApp==='coach'&&window.currentScreen===screen&&typeof window.showCoach==='function'){
        window.showCoach(screen);
      }
    });
  }

  async function syncClients(options={}){
    if(syncing)return syncing;
    syncing=(async()=>{
      const database=db();
      if(!database)return false;
      const session=await getCoachSession();
      if(!session){
        clearStaleClients();
        queueMicrotask(showAuthRequired);
        return false;
      }

      const result=await database.from('clients').select('*').order('created_at',{ascending:true});
      if(result.error)throw result.error;
      const rows=Array.isArray(result.data)?result.data:[];
      const d=appData();
      const previous=new Map((d.clients||[]).map(c=>[String(c.id),c]));
      d.clients=rows.map(row=>normalizeClient(row,previous.get(String(row.id))||{}));
      const validIds=new Set(d.clients.map(c=>String(c.id)));
      pruneDeletedClientDomains(validIds);
      persist();
      document.getElementById('dcc-client-auth-required')?.remove();
      rerenderCoachScreen(rows,options);
      return true;
    })().catch(error=>{
      console.error('DCC client sync:',error);
      clearStaleClients();
      queueMicrotask(showAuthRequired);
      return false;
    }).finally(()=>{syncing=null});
    return syncing;
  }

  window.dccSyncClientsFromServer=syncClients;

  async function syncCoachVisible(){
    if(window.__dccSecureRole!=='coach')return;
    if(window.currentApp!=='coach')return;
    if(window.currentScreen==='dashboard'||window.currentScreen==='clients'){
      await syncClients({render:true});
    }
  }

  const installShowCoachWrapper=()=>{
    const current=window.showCoach;
    if(typeof current!=='function'||current.__dccClientServerSourceV5)return false;
    const wrapped=function(screen){
      if(screen==='clients')clearStaleClients();
      const out=current.apply(this,arguments);
      if(screen==='dashboard'||screen==='clients')queueMicrotask(()=>syncClients({render:true}));
      return out;
    };
    wrapped.__dccClientServerSourceV5=true;
    wrapped.__base=current;
    window.showCoach=wrapped;
    return true;
  };

  function bootstrap(){
    installShowCoachWrapper();
    syncCoachVisible();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootstrap,{once:true});
  else queueMicrotask(bootstrap);
  window.addEventListener('load',()=>{installShowCoachWrapper();syncCoachVisible()},{once:true});
  window.addEventListener('pageshow',syncCoachVisible);
})();
