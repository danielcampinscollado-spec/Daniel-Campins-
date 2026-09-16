/* DCC — autoridad final de navegación entrenador: Light claro / Original oscuro. */
(function(){
'use strict';
const BUILD='20260916-coach-nav-theme-v16-final';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;

function isLight(){return document.documentElement.classList.contains('dcc-theme-light-premium')}
function imp(el,p,v){if(el)el.style.setProperty(p,v,'important')}

function installCss(){
  let s=document.getElementById('dcc-bottom-nav-light-premium-v1');
  if(!s){s=document.createElement('style');s.id='dcc-bottom-nav-light-premium-v1';(document.head||document.documentElement).appendChild(s)}
  s.textContent=`
@media(max-width:900px){
  body #coach#coach .side{box-sizing:border-box!important;height:68px!important;padding:5px!important;overflow:hidden!important;border-radius:27px!important;transition:none!important;animation:none!important}
  body #coach#coach #coach-nav#coach-nav{box-sizing:border-box!important;width:100%!important;height:100%!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:2px!important;padding:0!important;margin:0!important;overflow:hidden!important;border-radius:22px!important;transition:none!important;animation:none!important}
  body #coach#coach #coach-nav#coach-nav button{box-sizing:border-box!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;padding:5px 2px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;border-radius:19px!important;transform:none!important;transition:none!important;animation:none!important;overflow:hidden!important}
  body #coach#coach #coach-nav#coach-nav button svg{display:block!important;width:22px!important;height:22px!important;flex:0 0 22px!important}
  body #coach#coach #coach-nav#coach-nav button span{display:block!important;margin:0!important;line-height:1.05!important;white-space:nowrap!important}
  html.dcc-theme-light-premium body #coach#coach .side,html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav{background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important}
  html.dcc-theme-light-premium body #coach#coach .side{border:1px solid rgba(201,151,47,.34)!important;box-shadow:0 10px 28px rgba(83,61,25,.12),inset 0 1px 0 #fff!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav{border:0!important;box-shadow:none!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active){background:transparent!important;background-image:none!important;color:#69707d!important;border:1px solid transparent!important;box-shadow:none!important;text-shadow:none!important;filter:none!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active) svg,html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active) span{color:#69707d!important;stroke:currentColor!important;filter:none!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active{background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;color:#17140d!important;border:1px solid rgba(209,151,35,.52)!important;box-shadow:0 4px 12px rgba(197,137,25,.18),inset 0 1px 0 rgba(255,255,255,.78)!important;transform:none!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active svg,html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;stroke:currentColor!important;filter:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach .side{background:linear-gradient(145deg,#27241e 0%,#151512 58%,#211f19 100%)!important;background-color:#151512!important;border:1px solid rgba(224,171,62,.72)!important;box-shadow:0 12px 34px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,226,151,.08)!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav{background:transparent!important;background-image:none!important;border:0!important;box-shadow:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button:not(.active){background:transparent!important;color:#d9aa4a!important;border:1px solid transparent!important;box-shadow:none!important;text-shadow:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button:not(.active) svg,html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button:not(.active) span{color:#d9aa4a!important;stroke:currentColor!important;filter:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active{background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;color:#17140d!important;border:1px solid rgba(239,190,80,.72)!important;box-shadow:0 4px 14px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.72)!important;transform:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active svg,html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;stroke:currentColor!important}
  #coach-nav button::before,#coach-nav button::after{display:none!important;content:none!important}
}
/* Las tarjetas compactas de Clientes respetan el tema seleccionado. */
html:not(.dcc-theme-light-premium) body #coach#coach #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{background:linear-gradient(145deg,#17191e 0%,#0f1115 100%)!important;background-color:#111318!important;border-color:rgba(224,171,62,.34)!important;box-shadow:0 8px 20px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.035)!important}
html:not(.dcc-theme-light-premium) body #coach#coach #coach-main.dcc-premium-clients .dcc-client-avatar{background:linear-gradient(145deg,#26231c,#171713)!important;color:#e0ad43!important;border-color:rgba(224,171,62,.38)!important;box-shadow:none!important}
html:not(.dcc-theme-light-premium) body #coach#coach #coach-main.dcc-premium-clients .dcc-client-name-ref{color:#f4f1e9!important}
html:not(.dcc-theme-light-premium) body #coach#coach #coach-main.dcc-premium-clients .dcc-client-since{color:#8f96a3!important}
html:not(.dcc-theme-light-premium) body #coach#coach #coach-main.dcc-premium-clients .dcc-manage-client-btn{background:linear-gradient(145deg,#1c1d20,#121316)!important;color:#e5bd66!important;border-color:rgba(224,171,62,.62)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)!important}
`;
}

function apply(){
  installCss();
  const side=document.querySelector('#coach .side');
  const nav=document.getElementById('coach-nav');
  if(!side||!nav)return;
  const light=isLight();
  /* La fuente legacy pinta Light en negro. Aquí el tema real manda también por inline !important. */
  imp(side,'height','68px');imp(side,'padding','5px');imp(side,'overflow','hidden');imp(side,'border-radius','27px');
  imp(nav,'display','grid');imp(nav,'grid-template-columns','repeat(3,minmax(0,1fr))');imp(nav,'gap','2px');imp(nav,'width','100%');imp(nav,'height','100%');imp(nav,'padding','0');imp(nav,'margin','0');imp(nav,'overflow','hidden');imp(nav,'border-radius','22px');
  if(light){
    imp(side,'background','#fffdf9');imp(side,'background-image','none');imp(side,'background-color','#fffdf9');imp(side,'border','1px solid rgba(201,151,47,.34)');imp(side,'box-shadow','0 10px 28px rgba(83,61,25,.12), inset 0 1px 0 #fff');
    imp(nav,'background','#fffdf9');imp(nav,'background-image','none');imp(nav,'background-color','#fffdf9');imp(nav,'border','0');imp(nav,'box-shadow','none');
  }else{
    imp(side,'background','linear-gradient(145deg,#27241e 0%,#151512 58%,#211f19 100%)');imp(side,'background-color','#151512');imp(side,'border','1px solid rgba(224,171,62,.72)');imp(side,'box-shadow','0 12px 34px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,226,151,.08)');
    imp(nav,'background','transparent');imp(nav,'background-image','none');imp(nav,'border','0');imp(nav,'box-shadow','none');
  }
  [...nav.querySelectorAll('button')].forEach(btn=>{imp(btn,'width','100%');imp(btn,'height','100%');imp(btn,'min-width','0');imp(btn,'min-height','0');imp(btn,'margin','0');imp(btn,'transform','none');imp(btn,'align-self','stretch');});
}

function lateApply(){requestAnimationFrame(()=>requestAnimationFrame(apply))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',lateApply,{once:true});else lateApply();
window.addEventListener('load',lateApply);
window.addEventListener('pageshow',lateApply);
document.addEventListener('dcc:coach-screen',lateApply);
const rootObserver=new MutationObserver(m=>{if(m.some(x=>x.type==='attributes'&&x.attributeName==='class'))lateApply()});
rootObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
})();
