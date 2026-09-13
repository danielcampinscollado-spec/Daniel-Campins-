/* DCC — vinculación segura automática de cliente autenticado por email */
(function(){
  'use strict';
  if(window.__dccAuthClientClaimV1)return;
  window.__dccAuthClientClaimV1=true;

  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){ }return window.supabaseClient||null};
  let running=null;

  function setClient(id){
    try{currentClientId=id}catch(_){ }
    window.currentClientId=id;
  }

  async function claim(session){
    if(running)return running;
    running=(async()=>{
      const database=db(),user=session?.user;
      if(!database||!user)return false;
      if(window.__dccSecureRole==='coach'||window.__dccSecureRole==='client')return true;

      const profile=await database.from('app_profiles').select('role').eq('user_id',user.id).maybeSingle();
      if(profile.error)throw profile.error;
      if(profile.data?.role==='coach')return false;

      const {data:id,error}=await database.rpc('dcc_claim_client_access');
      if(error)throw error;
      if(!id)return false;

      setClient(String(id));
      window.__dccSecureRole='client';
      document.getElementById('dcc-secure-auth-v1')?.querySelector('.dcc-auth-pending')?.remove();
      if(typeof window.openApp==='function')await window.openApp('client');
      return true;
    })().catch(error=>{
      console.error('DCC vinculando acceso de cliente:',error);
      return false;
    }).finally(()=>{running=null});
    return running;
  }

  async function bootstrap(){
    const database=db();
    if(!database?.auth)return;
    try{
      const {data,error}=await database.auth.getSession();
      if(error)throw error;
      if(data?.session)setTimeout(()=>claim(data.session),60);
    }catch(error){console.warn('DCC claim sesión inicial:',error)}

    database.auth.onAuthStateChange((event,session)=>{
      if(session&&event!=='SIGNED_OUT')setTimeout(()=>claim(session),60);
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootstrap,{once:true});
  else bootstrap();
})();
