/* DCC — coherencia visual entrenador: Light claro / Original oscuro. */
(function(){
'use strict';
const BUILD='20260916-theme-consistency-v15';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;

function installThemeAuthority(){
  document.getElementById('dcc-bottom-nav-light-premium-v1')?.remove();
  const s=document.createElement('style');
  s.id='dcc-bottom-nav-light-premium-v1';
  s.textContent=`
@media(max-width:900px){
  /* LIGHT PREMIUM: barra clara, solo la pestaña activa en dorado */
  html.dcc-theme-light-premium body #coach#coach .side{
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    border:1px solid rgba(201,151,47,.34)!important;border-radius:27px!important;
    box-shadow:0 10px 28px rgba(83,61,25,.12),inset 0 1px 0 #fff!important;
    overflow:hidden!important;padding:5px!important;transition:none!important;animation:none!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav{
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    border:0!important;border-radius:22px!important;box-shadow:none!important;overflow:hidden!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button,
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active){
    background:transparent!important;background-image:none!important;color:#69707d!important;
    border:1px solid transparent!important;box-shadow:none!important;text-shadow:none!important;
    transition:none!important;animation:none!important;transform:none!important;filter:none!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active) svg,
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active) span{
    color:#69707d!important;stroke:currentColor!important;filter:none!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active{
    background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;
    color:#17140d!important;border:1px solid rgba(209,151,35,.52)!important;
    box-shadow:0 4px 12px rgba(197,137,25,.18),inset 0 1px 0 rgba(255,255,255,.78)!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active svg,
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active span{
    color:#17140d!important;stroke:currentColor!important;filter:none!important;
  }

  /* DCC ORIGINAL / DARK: barra oscura y dorada */
  html:not(.dcc-theme-light-premium) body #coach#coach .side{
    background:linear-gradient(145deg,#27241e 0%,#151512 58%,#211f19 100%)!important;
    background-color:#151512!important;border:1px solid rgba(224,171,62,.72)!important;
    border-radius:27px!important;box-shadow:0 12px 34px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,226,151,.08)!important;
    overflow:hidden!important;padding:5px!important;
  }
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav{
    background:transparent!important;background-image:none!important;border:0!important;border-radius:22px!important;box-shadow:none!important;
  }
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button{
    background:transparent!important;color:#d9aa4a!important;border:1px solid transparent!important;box-shadow:none!important;text-shadow:none!important;
  }
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button svg,
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button span{color:#d9aa4a!important;stroke:currentColor!important;filter:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active{
    background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;color:#17140d!important;
    border:1px solid rgba(239,190,80,.72)!important;box-shadow:0 4px 14px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.72)!important;
  }
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active svg,
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;stroke:currentColor!important}

  #coach-nav button::before,#coach-nav button::after{display:none!important;content:none!important}
}

/* Las tarjetas compactas de Clientes estaban pintadas claras sin comprobar el tema. */
html:not(.dcc-theme-light-premium) body #coach#coach #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{
  background:linear-gradient(145deg,#17191e 0%,#0f1115 100%)!important;background-color:#111318!important;
  border-color:rgba(224,171,62,.34)!important;box-shadow:0 8px 20px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.035)!important;
}
html:not(.dcc-theme-light-premium) body #coach#coach #coach-main.dcc-premium-clients .dcc-client-avatar{
  background:linear-gradient(145deg,#26231c,#171713)!important;color:#e0ad43!important;border-color:rgba(224,171,62,.38)!important;box-shadow:none!important;
}
html:not(.dcc-theme-light-premium) body #coach#coach #coach-main.dcc-premium-clients .dcc-client-name-ref{color:#f4f1e9!important}
html:not(.dcc-theme-light-premium) body #coach#coach #coach-main.dcc-premium-clients .dcc-client-since{color:#8f96a3!important}
html:not(.dcc-theme-light-premium) body #coach#coach #coach-main.dcc-premium-clients .dcc-manage-client-btn{
  background:linear-gradient(145deg,#1c1d20,#121316)!important;color:#e5bd66!important;border-color:rgba(224,171,62,.62)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)!important;
}

/* LIGHT: conserva las tarjetas aprobadas claras. */
html.dcc-theme-light-premium body #coach#coach #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{
  background:linear-gradient(145deg,rgba(255,255,255,.94),rgba(255,250,239,.82))!important;
  border-color:rgba(201,151,47,.30)!important;
}
`;
  (document.head||document.documentElement).appendChild(s);

  /* v14 dejó estilos inline blancos: se eliminan para que mande el tema seleccionado. */
  const side=document.querySelector('#coach .side');
  const nav=document.getElementById('coach-nav');
  [side,nav].forEach(el=>{
    if(!el)return;
    ['background','background-image','background-color','border','box-shadow'].forEach(p=>el.style.removeProperty(p));
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installThemeAuthority,{once:true});
else installThemeAuthority();
window.addEventListener('pageshow',installThemeAuthority);

/* El selector de Apariencia cambia clases en <html>; no repintamos nodos, solo dejamos que CSS cambie de tema. */
const rootObserver=new MutationObserver(muts=>{
  if(muts.some(m=>m.type==='attributes'&&m.attributeName==='class')){
    const side=document.querySelector('#coach .side');
    const nav=document.getElementById('coach-nav');
    [side,nav].forEach(el=>{
      if(!el)return;
      ['background','background-image','background-color','border','box-shadow'].forEach(p=>el.style.removeProperty(p));
    });
  }
});
rootObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
})();
