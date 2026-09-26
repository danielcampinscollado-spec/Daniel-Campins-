/* DCC — protege el redirect de Supabase Auth en previews de Vercel */
(function(){
  'use strict';
  const BUILD='20260915-auth-preview-redirect-v35-navigation-authority';
  if(window.__dccAuthPreviewRedirectGuard===BUILD)return;
  window.__dccAuthPreviewRedirectGuard=BUILD;

  function database(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
  function isPreview(){const host=String(window.location.hostname||'').toLowerCase();return host.endsWith('.vercel.app')&&host!=='daniel-campins.vercel.app'}
  function currentRedirect(){const url=new URL(window.location.href),share=url.searchParams.get('_vercel_share');url.search='';if(share)url.searchParams.set('_vercel_share',share);url.hash='';return url.toString()}
  function install(){
    const auth=database()?.auth;if(!auth||typeof auth.signInWithOtp!=='function')return false;
    if(auth.signInWithOtp.__dccPreviewRedirectGuard===BUILD)return true;
    const base=auth.signInWithOtp.bind(auth);const wrapped=async function(args){const next={...(args||{})};next.options={...((args&&args.options)||{})};if(isPreview())next.options.emailRedirectTo=currentRedirect();return base(next)};
    wrapped.__dccPreviewRedirectGuard=BUILD;wrapped.__base=base;auth.signInWithOtp=wrapped;return true;
  }
  if(!install()){let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>=80)clearInterval(timer)},100)}

  loadAuthority('./coach-dashboard-authority-v1.js?v=20260914-5','dashboard');
  loadAuthority('./coach-client-authority-v1.js?v=20260914-2','client');
  loadAuthority('./coach-live-consistency-v2.js?v=20260914-6','live-consistency');
  loadAuthority('./dcc-dynamic-greeting-v1.js?v=20260915-4','dynamic-greeting');
  loadAuthority('./coach-edit-safety-v1.js?v=20260914-3','navigation-safety');
  loadAuthority('./nutrition-flow-authority-v1.js?v=20260914-1','nutrition-flow');
  loadAuthority('./nutrition-meal-setup-v1.js?v=20260914-3','nutrition-meal-setup');
  loadAuthority('./client-plan-alert-compact-v1.js?v=20260915-5','client-plan-alert-compact');
  loadAuthority('./client-header-compact-v1.js?v=20260914-8','client-header-compact');
  loadAuthority('./client-edit-visibility-v1.js?v=20260915-3','client-edit-visibility');
  loadAuthority('./checkin-premium.js?v=20260914-2','checkin-direct');
  loadAuthority('./messages-premium.js?v=20260914-1','messages-direct');
  loadAuthority('./coach-navigation-authority-v1.js?v=20260915-1','coach-navigation-authority');
  loadAuthority('./coach-render-stability-v1.js?v=20260915-2','render-stability');
})();
