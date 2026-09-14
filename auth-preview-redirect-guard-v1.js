/* DCC — protege el redirect de Supabase Auth en previews de Vercel */
(function(){
  'use strict';
  const BUILD='20260914-auth-preview-redirect-v7';
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

  function loadAuthority(src,key){
    if(document.querySelector('script[data-dcc-authority="'+key+'"]'))return;
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.dataset.dccAuthority=key;
    s.onerror=()=>console.error('DCC: no se pudo cargar '+src);
    (document.head||document.documentElement).appendChild(s);
  }

  if(!install()){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(install()||tries>=80)clearInterval(timer);
    },100);
  }

  loadAuthority('./coach-dashboard-authority-v1.js?v=20260914-2','dashboard');
  loadAuthority('./coach-client-authority-v1.js?v=20260914-2','client');
  loadAuthority('./coach-live-consistency-v2.js?v=20260914-5','live-consistency');
})();