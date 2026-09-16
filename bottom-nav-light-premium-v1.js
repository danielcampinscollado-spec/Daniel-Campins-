/* DCC — shell visual móvil del entrenador: barra Light + estados de acordeón. */
(function(){
'use strict';
const BUILD='20260916-coach-nav-v33-persistent-light';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;
const STYLE_ID='dcc-bottom-nav-light-premium-v1';
function installStyles(){
 let s=document.getElementById(STYLE_ID);
 if(!s){s=document.createElement('style');s.id=STYLE_ID;(document.head||document.documentElement).appendChild(s)}
 s.textContent=`
html.dcc-theme-light-premium body,html.dcc-theme-light-premium body .app,html.dcc-theme-light-premium body #coach,html.dcc-theme-light-premium body #coach #coach-main{background-color:#f5efe4!important}
.dcc-p9-caret{font-size:0!important;width:24px!important;height:24px!important;display:grid!important;place-items:center!important}
.dcc-p9-caret::before{content:''!important;display:block!important;width:10px!important;height:10px!important;border-right:2.5px solid #b77b13!important;border-bottom:2.5px solid #b77b13!important;transform:rotate(45deg)!important;transition:transform .16s ease!important}
.dcc-p9-accordion:not(.closed) .dcc-p9-caret::before{transform:rotate(225deg)!important}
@media(max-width:900px){
 body #coach#coach{background:#f5efe4!important;background-image:linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f0e8dc 100%)!important;overflow-x:hidden!important}
 body #coach#coach > .side{position:fixed!important;left:30px!important;right:30px!important;bottom:max(14px,env(safe-area-inset-bottom))!important;top:auto!important;width:auto!important;height:76px!important;min-height:76px!important;margin:0!important;padding:0!important;border:0!important;outline:0!important;border-radius:39px!important;background:transparent!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important;-webkit-box-shadow:none!important;filter:none!important;-webkit-filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;overflow:visible!important;z-index:9999!important;box-sizing:border-box!important;transform:none!important}
 body #coach#coach > .side::before,body #coach#coach > .side::after{display:none!important;content:none!important;background:none!important;border:0!important;box-shadow:none!important}
 body #coach#coach > .side>h2,body #coach#coach > .side>.out{display:none!important}
 body #coach#coach #coach-nav#coach-nav{position:absolute!important;inset:0!important;isolation:isolate!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:stretch!important;gap:0!important;width:100%!important;height:76px!important;margin:0!important;padding:4px!important;border:1.5px solid #d6a33c!important;outline:0!important;border-radius:39px!important;background:#fffdf9!important;background-color:#fffdf9!important;background-image:none!important;box-shadow:0 10px 28px rgba(93,67,25,.12)!important;-webkit-box-shadow:0 10px 28px rgba(93,67,25,.12)!important;filter:none!important;-webkit-filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;overflow:hidden!important;box-sizing:border-box!important}
 body #coach#coach #coach-nav#coach-nav::before{display:block!important;content:''!important;position:absolute!important;inset:0!important;z-index:0!important;border-radius:37px!important;background:#fffdf9!important;background-color:#fffdf9!important;background-image:none!important;box-shadow:none!important;pointer-events:none!important}
 body #coach#coach #coach-nav#coach-nav::after,body #coach#coach #coach-nav#coach-nav button::before,body #coach#coach #coach-nav#coach-nav button::after{display:none!important;content:none!important;background:none!important;border:0!important;box-shadow:none!important}
 body #coach#coach #coach-nav#coach-nav button{position:relative!important;z-index:1!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;padding:7px 3px!important;gap:4px!important;border:1.5px solid transparent!important;border-radius:34px!important;outline:0!important;background:transparent!important;background-color:transparent!important;background-image:none!important;color:#666b73!important;-webkit-text-fill-color:#666b73!important;box-shadow:none!important;-webkit-box-shadow:none!important;text-shadow:none!important;filter:none!important;-webkit-filter:none!important;box-sizing:border-box!important;transform:none!important}
 body #coach#coach #coach-nav#coach-nav button svg{display:block!important;width:24px!important;height:24px!important;flex:0 0 24px!important;color:#666b73!important;stroke:currentColor!important;filter:none!important}
 body #coach#coach #coach-nav#coach-nav button span{display:block!important;margin:0!important;color:#666b73!important;-webkit-text-fill-color:#666b73!important;font-size:11px!important;line-height:1!important;font-weight:650!important;white-space:nowrap!important;text-shadow:none!important}
 body #coach#coach #coach-nav#coach-nav button.active{border-color:#d9a43a!important;background:linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)!important;background-color:#f3c64d!important;background-image:linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)!important;color:#17140d!important;-webkit-text-fill-color:#17140d!important;box-shadow:0 5px 14px rgba(185,126,18,.18),inset 0 1px 0 rgba(255,255,255,.92)!important;-webkit-box-shadow:0 5px 14px rgba(185,126,18,.18),inset 0 1px 0 rgba(255,255,255,.92)!important}
 body #coach#coach #coach-nav#coach-nav button.active svg,body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;-webkit-text-fill-color:#17140d!important;stroke:currentColor!important;font-weight:800!important}
}
`;
}
function paint(){
 installStyles();
 if(!matchMedia('(max-width:900px)').matches)return;
 const side=document.querySelector('#coach > .side'),nav=document.getElementById('coach-nav');
 if(!side||!nav)return;
 const imp=(el,p,v)=>el.style.setProperty(p,v,'important');
 [['background','transparent'],['background-color','transparent'],['background-image','none'],['border','0'],['box-shadow','none'],['filter','none']].forEach(([p,v])=>imp(side,p,v));
 [['background','#fffdf9'],['background-color','#fffdf9'],['background-image','none'],['border','1.5px solid #d6a33c'],['box-shadow','0 10px 28px rgba(93,67,25,.12)'],['filter','none']].forEach(([p,v])=>imp(nav,p,v));
 nav.querySelectorAll('button').forEach(b=>{const on=b.classList.contains('active'),c=on?'#17140d':'#666b73';imp(b,'background',on?'linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)':'transparent');imp(b,'background-image',on?'linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)':'none');imp(b,'border',on?'1.5px solid #d9a43a':'1.5px solid transparent');imp(b,'color',c);imp(b,'-webkit-text-fill-color',c);b.querySelectorAll('svg,span').forEach(x=>{imp(x,'color',c);imp(x,'-webkit-text-fill-color',c)})});
}
function repaintSoon(){requestAnimationFrame(()=>{paint();setTimeout(paint,40)})}
installStyles();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',repaintSoon,{once:true});else repaintSoon();
document.addEventListener('dcc:coach-screen',repaintSoon);
document.addEventListener('dcc:feature-ready',repaintSoon);
document.addEventListener('dcc:profile-critical-ready',repaintSoon);
window.addEventListener('dcc:themechange',repaintSoon);
window.addEventListener('pageshow',repaintSoon);
document.addEventListener('click',e=>{if(e.target?.closest?.('#coach-nav,.dcc-p9-accordion-head'))setTimeout(repaintSoon,0)},true);
})();