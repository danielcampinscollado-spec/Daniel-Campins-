/* DCC — protege el redirect de Supabase Auth en previews de Vercel */
(function(){
  'use strict';
  if(window.__dccAuthPreviewRedirectGuardV1)return;
  window.__dccAuthPreviewRedirectGuardV1=true;

  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}
    return window.supabaseClient||null;
  }

  function isPreview(){
    const host=String(window.location.hostname||'').toLowerCase();
    return host.endsWith('.vercel.app')&&host!=='daniel-campins.vercel.app';
  }

  function currentRedirect(){
    return window.location.origin+window.location.pathname;
  }

  function install(){
    const auth=database()?.auth;
    if(!auth||typeof auth.signInWithOtp!=='function')return false;
    if(auth.signInWithOtp.__dccPreviewRedirectGuardV1)return true;

    const base=auth.signInWithOtp.bind(auth);
    const wrapped=async function(args){
      const next={...(args||{})};
      next.options={...((args&&args.options)||{})};
      if(isPreview()){
        /* En una RC siempre forzamos el retorno a la misma RC. */
        next.options.emailRedirectTo=currentRedirect();
      }
      return base(next);
    };
    wrapped.__dccPreviewRedirectGuardV1=true;
    wrapped.__base=base;
    auth.signInWithOtp=wrapped;
    return true;
  }

  if(!install()){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(install()||tries>=80)clearInterval(timer);
    },100);
  }
})();
