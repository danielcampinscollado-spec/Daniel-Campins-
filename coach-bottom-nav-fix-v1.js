/* DCC — barra inferior entrenador Light Premium estable en móvil */
(function(){
'use strict';
const BUILD='20260916-coach-bottom-nav-light-v2';
if(window.__dccCoachBottomNavFix===BUILD)return;
window.__dccCoachBottomNavFix=BUILD;

function install(){
  let s=document.getElementById('dcc-coach-bottom-nav-fix-v1');
  if(!s){s=document.createElement('style');s.id='dcc-coach-bottom-nav-fix-v1';document.head.appendChild(s)}
  s.textContent=`
  @media(max-width:900px){
    html body #coach .side{
      position:fixed!important;
      left:18px!important;right:18px!important;bottom:10px!important;top:auto!important;
      width:auto!important;height:70px!important;min-height:70px!important;
      margin:0!important;padding:5px!important;
      border:1px solid rgba(193,145,50,.20)!important;
      border-radius:27px!important;
      background:rgba(255,252,246,.98)!important;
      box-shadow:0 12px 30px rgba(83,61,25,.13),inset 0 1px 0 rgba(255,255,255,.98)!important;
      backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;
      overflow:hidden!important;z-index:9999!important;box-sizing:border-box!important;
    }
    html body #coach .side>h2,html body #coach .side>.out{display:none!important}
    html body #coach #coach-nav,
    html body #coach .side #coach-nav.nav{
      position:relative!important;inset:auto!important;
      width:100%!important;height:100%!important;min-height:0!important;
      margin:0!important;padding:0!important;gap:3px!important;
      border:0!important;border-radius:22px!important;
      background:transparent!important;box-shadow:none!important;
      overflow:hidden!important;box-sizing:border-box!important;
    }
    html body #coach #coach-nav button{
      position:relative!important;display:flex!important;flex-direction:column!important;
      align-items:center!important;justify-content:center!important;
      width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;
      margin:0!important;padding:4px 2px!important;
      border:1px solid transparent!important;border-radius:20px!important;outline:0!important;
      background:transparent!important;color:#747c89!important;box-shadow:none!important;
      text-shadow:none!important;transform:none!important;box-sizing:border-box!important;
    }
    html body #coach #coach-nav button::before,
    html body #coach #coach-nav button::after{display:none!important;content:none!important}
    html body #coach #coach-nav button svg{
      width:21px!important;height:21px!important;min-width:21px!important;min-height:21px!important;
      color:#747c89!important;stroke:currentColor!important;filter:none!important;
    }
    html body #coach #coach-nav button span{
      color:#747c89!important;font-size:8px!important;line-height:1!important;font-weight:650!important;
      margin-top:2px!important;text-shadow:none!important;
    }
    html body #coach #coach-nav button.active{
      background:linear-gradient(145deg,#ffe79a 0%,#f3c553 55%,#e8aa31 100%)!important;
      border-color:rgba(209,151,35,.58)!important;color:#17140d!important;
      box-shadow:0 5px 14px rgba(197,137,25,.20),inset 0 1px 0 rgba(255,255,255,.66)!important;
      transform:none!important;
    }
    html body #coach #coach-nav button.active svg,
    html body #coach #coach-nav button.active span{
      color:#17140d!important;stroke:currentColor!important;filter:none!important;font-weight:800!important;
    }
    html body #coach #coach-nav::before,html body #coach #coach-nav::after{display:none!important;content:none!important}
  }
  `;
  document.head.appendChild(s);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});
else setTimeout(install,0);
window.addEventListener('load',()=>setTimeout(install,0),{once:true});
})();
