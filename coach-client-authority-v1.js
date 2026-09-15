/* DCC client authority v1 — client-admin-premium is the single coach client-detail authority */
(function(){
  'use strict';
  if(window.__dccCoachClientAuthorityV1)return;
  window.__dccCoachClientAuthorityV1=true;

  function install(){
    if(typeof window.dccClientAdmin!=='function')return false;
    const open=function(id){ return window.dccClientAdmin(id,'summary'); };
    open.__dccClientAdminPremium=true;
    open.__dccSingleAuthority=true;
    window.openClient=open;
    window.showClientAdmin=open;
    return true;
  }

  let tries=0;
  const timer=setInterval(function(){
    tries++;
    if(install() || tries>80)clearInterval(timer);
  },50);
  install();

  window.addEventListener('pageshow',install);
})();