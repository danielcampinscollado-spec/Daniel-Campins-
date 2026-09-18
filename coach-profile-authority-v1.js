/* DCC — identidad del entrenador autenticado y visible para su cliente */
(function(){
  'use strict';
  const BUILD='20260918-coach-profile-authority-v1';
  if(window.__dccCoachProfileAuthority===BUILD)return;
  window.__dccCoachProfileAuthority=BUILD;

  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  let loading=null;

  function fallbackName(user){
    const meta=user?.user_metadata||{};
    const candidate=String(meta.full_name||meta.name||'').trim();
    if(candidate)return candidate;
    const local=String(user?.email||'').split('@')[0].replace(/[._-]+/g,' ').trim();
    return local?local.replace(/\b\w/g,ch=>ch.toUpperCase()):'Entrenador';
  }

  function apply(profile){
    window.__dccCoachProfile=profile||null;
    const name=String(profile?.display_name||'').trim();
    if(name&&window.__dccSecureRole==='coach'){
      const title=document.querySelector('#coach .side h2');
      if(title)title.textContent=name.toUpperCase();
    }
    document.dispatchEvent(new CustomEvent('dcc:coach-profile-ready',{detail:{profile:profile||null}}));
    return profile||null;
  }

  window.dccCoachName=function(){
    return String(window.__dccCoachProfile?.display_name||'Tu entrenador').trim()||'Tu entrenador';
  };
  window.dccCoachUserId=function(){
    return window.__dccCoachProfile?.user_id||null;
  };
  window.dccIsCoachMessage=function(message){
    const role=Array.isArray(message)?message[3]:(message?.sender_role??message?.senderRole??message?.role);
    if(role==='coach')return true;
    if(role==='client')return false;
    const sender=String(Array.isArray(message)?message[0]:(message?.sender??message?.from??'')).trim().toLowerCase();
    const coach=String(window.dccCoachName()).trim().toLowerCase();
    return !!sender&&(sender===coach||/^(coach|trainer|entrenador|admin|daniel|daniel campins)$/.test(sender));
  };

  async function loadProfile(){
    if(loading)return loading;
    loading=(async()=>{
      const database=db();if(!database?.auth)return apply(null);
      const {data:sessionData,error:sessionError}=await database.auth.getSession();
      if(sessionError)throw sessionError;
      const user=sessionData?.session?.user;if(!user)return apply(null);
      const {data:appProfile,error:roleError}=await database.from('app_profiles').select('role').eq('user_id',user.id).maybeSingle();
      if(roleError)throw roleError;
      if(appProfile?.role==='coach'){
        let result=await database.from('coach_profiles').select('user_id,display_name,professional_bio,avatar_url').eq('user_id',user.id).maybeSingle();
        if(result.error)throw result.error;
        if(!result.data){
          const created=await database.from('coach_profiles').insert({user_id:user.id,display_name:fallbackName(user)}).select('user_id,display_name,professional_bio,avatar_url').single();
          if(created.error)throw created.error;
          result=created;
        }
        return apply(result.data);
      }
      const clientRow=await database.from('clients').select('coach_id').eq('auth_user_id',user.id).maybeSingle();
      if(clientRow.error)throw clientRow.error;
      if(!clientRow.data?.coach_id)return apply(null);
      const coach=await database.from('coach_profiles').select('user_id,display_name,professional_bio,avatar_url').eq('user_id',clientRow.data.coach_id).maybeSingle();
      if(coach.error)throw coach.error;
      return apply(coach.data);
    })().catch(error=>{console.error('DCC coach profile:',error);return apply(null)}).finally(()=>{loading=null});
    return loading;
  }

  window.dccLoadCoachProfile=loadProfile;
  document.addEventListener('dcc:support-ready',loadProfile);
  document.addEventListener('dcc:profile-critical-ready',loadProfile);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadProfile,{once:true});else queueMicrotask(loadProfile);
  const database=db();
  database?.auth?.onAuthStateChange?.((event,session)=>{
    if(event==='SIGNED_OUT'||!session)apply(null);
    else setTimeout(loadProfile,0);
  });
})();