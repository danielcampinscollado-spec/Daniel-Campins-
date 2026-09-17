/* DCC — autoridad visual móvil del entrenador, sincronizada con el tema global. */
(function(){
'use strict';
const BUILD='20260917-coach-nav-v37-theme-stable';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;
const STYLE_ID='dcc-bottom-nav-light-premium-v1';

function installStyles(){
 let s=document.getElementById(STYLE_ID);
 if(!s){s=document.createElement('style');s.id=STYLE_ID;(document.head||document.documentElement).appendChild(s)}
 s.textContent=`
.dcc-p9-caret{font-size:0!important;width:24px!important;height:24px!important;display:grid!important;place-items:center!important}
.dcc-p9-caret::before{content:''!important;display:block!important;width:10px!important;height:10px!important;border-right:2.5px solid #b77b13!important;border-bottom:2.5px solid #b77b13!important;transform:rotate(45deg)!important;transition:transform .16s ease!important}
.dcc-p9-accordion:not(.closed) .dcc-p9-caret::before{transform:rotate(225deg)!important}

/* Modo black: Clientes conserva superficies oscuras. */
html:not(.dcc-theme-light-premium) body #coach #coach-main.dcc-premium-clients,
html:not(.dcc-theme-light-premium) body #coach #coach-main.dcc-final-clients{background:#080a0e!important;color:#f4f1e9!important}
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-cl-search,
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-fcl-search,
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-cl-sort,
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-fcl-sort{background:linear-gradient(145deg,#151a21,#0d1116)!important;background-color:#10141a!important;color:#d9dde4!important;border-color:rgba(217,170,74,.38)!important;box-shadow:none!important}
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-cl-search input,
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-fcl-search input{background:transparent!important;background-color:transparent!important;color:#f1f3f6!important;-webkit-text-fill-color:#f1f3f6!important;border:0!important;box-shadow:none!important}
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-cl-search input::placeholder,
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-fcl-search input::placeholder{color:#777f8c!important;-webkit-text-fill-color:#777f8c!important;opacity:1!important}
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-client-card-authority,
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-cl-card,
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-fcl-card{background:linear-gradient(145deg,#12171d,#0a0e13)!important;background-color:#0d1116!important;color:#f4f1e9!important;border-color:rgba(217,170,74,.38)!important;box-shadow:0 8px 22px rgba(0,0,0,.18)!important}
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-client-copy-authority strong,
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-cl-name,
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-fcl-name{color:#f4f1e9!important}
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-client-copy-authority small{color:#8d95a1!important}
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-client-avatar-authority{background:#17170f!important;color:#e8b94f!important;border-color:rgba(217,170,74,.42)!important}
html:not(.dcc-theme-light-premium) body #coach #coach-main .dcc-client-manage-authority{background:#101319!important;color:#e8b94f!important;border-color:#c9952f!important;box-shadow:none!important}

@media(max-width:900px){
 body #coach#coach > .side{position:fixed!important;left:30px!important;right:30px!important;bottom:max(14px,env(safe-area-inset-bottom))!important;top:auto!important;width:auto!important;height:76px!important;min-height:76px!important;margin:0!important;padding:0!important;border:0!important;outline:0!important;border-radius:39px!important;background:transparent!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important;filter:none!important;backdrop-filter:none!important;overflow:visible!important;z-index:9999!important;box-sizing:border-box!important;transform:none!important}
 body #coach#coach > .side::before,body #coach#coach > .side::after{display:none!important;content:none!important}
 body #coach#coach > .side>h2,body #coach#coach > .side>.out{display:none!important}
 body #coach#coach #coach-nav#coach-nav{position:absolute!important;inset:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:stretch!important;gap:0!important;width:100%!important;height:76px!important;margin:0!important;padding:4px!important;border:1.5px solid #d6a33c!important;outline:0!important;border-radius:39px!important;overflow:hidden!important;box-sizing:border-box!important;filter:none!important;transform:none!important}
 html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav{background:linear-gradient(145deg,#171915 0%,#090b09 58%,#15150f 100%)!important;background-color:#0d0f0c!important;background-image:linear-gradient(145deg,#171915 0%,#090b09 58%,#15150f 100%)!important;box-shadow:0 10px 28px rgba(0,0,0,.34)!important}
 html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav{background:#fffdf9!important;background-color:#fffdf9!important;background-image:none!important;box-shadow:0 10px 28px rgba(93,67,25,.12)!important}
 body #coach#coach #coach-nav#coach-nav::before,body #coach#coach #coach-nav#coach-nav::after,body #coach#coach #coach-nav#coach-nav button::before,body #coach#coach #coach-nav#coach-nav button::after{display:none!important;content:none!important}
 body #coach#coach #coach-nav#coach-nav button{position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;padding:7px 3px!important;gap:4px!important;border:1.5px solid transparent!important;border-radius:34px!important;outline:0!important;background:transparent!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important;box-sizing:border-box!important;transform:none!important}
 html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button{color:#a0a5ad!important;-webkit-text-fill-color:#a0a5ad!important}
 html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button{color:#666b73!important;-webkit-text-fill-color:#666b73!important}
 body #coach#coach #coach-nav#coach-nav button svg{display:block!important;width:24px!important;height:24px!important;flex:0 0 24px!important;color:currentColor!important;stroke:currentColor!important;filter:none!important}
 body #coach#coach #coach-nav#coach-nav button span{display:block!important;margin:0!important;color:currentColor!important;-webkit-text-fill-color:currentColor!important;font-size:11px!important;line-height:1!important;font-weight:650!important;white-space:nowrap!important;text-shadow:none!important}
 body #coach#coach #coach-nav#coach-nav button.active{border-color:#d9a43a!important;background:linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)!important;background-color:#f3c64d!important;background-image:linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)!important;color:#17140d!important;-webkit-text-fill-color:#17140d!important;box-shadow:0 5px 14px rgba(185,126,18,.18),inset 0 1px 0 rgba(255,255,255,.92)!important}
 body #coach#coach #coach-nav#coach-nav button.active svg,body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;-webkit-text-fill-color:#17140d!important;stroke:currentColor!important;font-weight:800!important}
}
`;
}

function clearThemeInline(el){
 if(!el)return;
 ['background','background-color','background-image','color','-webkit-text-fill-color','border','box-shadow','filter','transform'].forEach(p=>el.style.removeProperty(p));
}

function stabilize(){
 installStyles();
 if(!matchMedia('(max-width:900px)').matches)return;
 const side=document.querySelector('#coach > .side'),nav=document.getElementById('coach-nav');
 if(!side||!nav)return;
 const imp=(el,p,v)=>el.style.setProperty(p,v,'important');
 [['background','transparent'],['background-color','transparent'],['background-image','none'],['border','0'],['box-shadow','none'],['filter','none'],['transform','none']].forEach(([p,v])=>imp(side,p,v));
 clearThemeInline(nav);
 nav.querySelectorAll('button').forEach(b=>{
   clearThemeInline(b);
   b.querySelectorAll('svg,span').forEach(x=>{x.style.removeProperty('color');x.style.removeProperty('-webkit-text-fill-color');x.style.removeProperty('transform')});
 });
}

installStyles();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',stabilize,{once:true});else stabilize();
/* Sin temporizadores ni repintados dobles: se corrige en el mismo ciclo del cambio. */
document.addEventListener('dcc:coach-screen',stabilize);
document.addEventListener('dcc:feature-ready',stabilize);
document.addEventListener('dcc:profile-critical-ready',stabilize);
window.addEventListener('dcc:themechange',stabilize);
window.addEventListener('pageshow',stabilize);
})();