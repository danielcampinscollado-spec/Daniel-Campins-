/* DCC — protege el redirect de Supabase Auth en previews de Vercel */
(function(){
  'use strict';
  const BUILD='20260913-auth-preview-redirect-v2';
  if(window.__dccAuthPreviewRedirectGuard===BUILD)return;
  window.__dccAuthPreviewRedirectGuard=BUILD;

  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}
    return window.supabaseClient||null;
  }

  function isPreview(){
    const host=String(window.location.hostname||'').toLowerCase();
    return host.endsWith('.vercel.app')&&host!=='daniel-campins.vercel.app';
  }

  function currentRedirect(){
    const url=new URL(window.location.href);
    /* Conservamos _vercel_share para que el callback siga teniendo acceso al Preview protegido. */
    const share=url.searchParams.get('_vercel_share');
    url.search='';
    if(share)url.searchParams.set('_vercel_share',share);
    url.hash='';
    return url.toString();
  }

  function install(){
    const auth=database()?.auth;
    if(!auth||typeof auth.signInWithOtp!=='function')return false;
    if(auth.signInWithOtp.__dccPreviewRedirectGuard===BUILD)return true;

    const base=auth.signInWithOtp.bind(auth);
    const wrapped=async function(args){
      const next={...(args||{})};
      next.options={...((args&&args.options)||{})};
      if(isPreview())next.options.emailRedirectTo=currentRedirect();
      return base(next);
    };
    wrapped.__dccPreviewRedirectGuard=BUILD;
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
