/* DCC — densidad compacta para tarjetas premium de clientes */
(function(){
'use strict';
const BUILD='20260916-clients-compact-density-v1';
if(window.__dccClientsCompactDensity===BUILD)return;
window.__dccClientsCompactDensity=BUILD;
function install(){
  let s=document.getElementById('dcc-clients-compact-density-v1');
  if(!s){s=document.createElement('style');s.id='dcc-clients-compact-density-v1';document.head.appendChild(s)}
  s.textContent=`
#coach-main.dcc-premium-clients .dcc-cl-list{gap:8px!important}
#coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{min-height:76px!important;padding:8px 10px!important;gap:10px!important;border-radius:17px!important}
#coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref:before{top:14px!important;bottom:14px!important}
#coach-main.dcc-premium-clients .dcc-client-avatar{width:44px!important;height:44px!important;flex:0 0 44px!important;border-radius:14px!important}
#coach-main.dcc-premium-clients .dcc-client-avatar svg{width:24px!important;height:24px!important}
#coach-main.dcc-premium-clients .dcc-client-copy{gap:3px!important}
#coach-main.dcc-premium-clients .dcc-client-name-ref{font-size:15.5px!important;line-height:1.08!important}
#coach-main.dcc-premium-clients .dcc-client-since{font-size:9.8px!important;line-height:1.1!important}
#coach-main.dcc-premium-clients .dcc-manage-client-btn{min-width:98px!important;height:38px!important;padding:0 7px 0 10px!important;gap:6px!important;border-radius:12px!important;font-size:10.8px!important}
#coach-main.dcc-premium-clients .dcc-manage-arrow{width:19px!important;height:19px!important;font-size:16px!important}
@media(max-width:390px){
#coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{min-height:72px!important;padding:7px 9px!important;gap:8px!important}
#coach-main.dcc-premium-clients .dcc-client-avatar{width:41px!important;height:41px!important;flex-basis:41px!important;border-radius:13px!important}
#coach-main.dcc-premium-clients .dcc-client-avatar svg{width:23px!important;height:23px!important}
#coach-main.dcc-premium-clients .dcc-client-name-ref{font-size:15px!important}
#coach-main.dcc-premium-clients .dcc-manage-client-btn{min-width:94px!important;height:36px!important;font-size:10.3px!important}
}
`;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
document.addEventListener('dcc:coach-screen',install);
})();
