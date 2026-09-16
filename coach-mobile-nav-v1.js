/* DCC — navegación móvil del entrenador. Autoridad visual única. */
(function(){
'use strict';
const BUILD='20260916-coach-mobile-nav-v3-inline-authority';
if(window.__dccCoachMobileNav===BUILD)return;
window.__dccCoachMobileNav=BUILD;
const ID='dcc-coach-mobile-nav-v1-css';
let s=document.getElementById(ID);if(!s){s=document.createElement('style');s.id=ID;(document.head||document.documentElement).appendChild(s)}
s.textContent=`
@media(max-width:900px){
 html.dcc-theme-light-premium,html.dcc-theme-light-premium body,html.dcc-theme-light-premium body #coach{background:#f5efe4!important;background-color:#f5efe4!important}
 html.dcc-theme-light-premium body #coach{min-height:100dvh!important;overflow-x:hidden!important}
 body #coach#coach > .side{position:fixed!important;left:18px!important;right:18px!important;bottom:max(12px,env(safe-area-inset-bottom))!important;top:auto!important;width:auto!important;height:78px!important;min-height:78px!important;margin:0!important;padding:4px!important;border:1.5px solid #dda52f!important;outline:0!important;border-radius:40px!important;background:#fffdf9!important;background-image:none!important;box-shadow:0 12px 30px rgba(103,76,29,.11)!important;filter:none!important;backdrop-filter:none!important;overflow:hidden!important;z-index:9999!important;box-sizing:border-box!important;transform:none!important}
 body #coach#coach > .side::before,body #coach#coach > .side::after{display:none!important;content:none!important}
 body #coach#coach > .side>h2,body #coach#coach > .side>.out{display:none!important}
 body #coach#coach #coach-nav#coach-nav{position:relative!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:stretch!important;gap:0!important;width:100%!important;height:100%!important;margin:0!important;padding:0!important;border:0!important;outline:0!important;border-radius:35px!important;background:#fffdf9!important;background-image:none!important;box-shadow:none!important;overflow:hidden!important;box-sizing:border-box!important;filter:none!important}
 body #coach#coach #coach-nav#coach-nav::before,body #coach#coach #coach-nav#coach-nav::after{display:none!important;content:none!important}
 body #coach#coach #coach-nav#coach-nav button{position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:calc(100% - 8px)!important;height:calc(100% - 8px)!important;margin:4px!important;padding:6px 3px!important;gap:4px!important;border:1.5px solid transparent!important;border-radius:31px!important;outline:0!important;background:transparent!important;background-image:none!important;color:#5f6268!important;-webkit-text-fill-color:#5f6268!important;box-shadow:none!important;text-shadow:none!important;filter:none!important;box-sizing:border-box!important}
 body #coach#coach #coach-nav#coach-nav button::before,body #coach#coach #coach-nav#coach-nav button::after{display:none!important;content:none!important}
 body #coach#coach #coach-nav#coach-nav button svg{display:block!important;width:24px!important;height:24px!important;flex:0 0 24px!important;color:#5f6268!important;stroke:currentColor!important;filter:none!important}
 body #coach#coach #coach-nav#coach-nav button span{display:block!important;margin:0!important;color:#5f6268!important;-webkit-text-fill-color:#5f6268!important;font-size:11px!important;line-height:1!important;font-weight:600!important;white-space:nowrap!important;text-shadow:none!important}
 body #coach#coach #coach-nav#coach-nav button.active{border-color:#dda52f!important;background:linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)!important;color:#17140d!important;-webkit-text-fill-color:#17140d!important;box-shadow:0 5px 14px rgba(185,126,18,.18),inset 0 1px 0 rgba(255,255,255,.92),inset 0 0 0 2px rgba(255,244,190,.38)!important}
 body #coach#coach #coach-nav#coach-nav button.active svg,body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;-webkit-text-fill-color:#17140d!important;stroke:currentColor!important;font-weight:800!important}
}
`;
function imp(el,p,v){if(el)el.style.setProperty(p,v,'important')}
function paint(){
 if(!matchMedia('(max-width:900px)').matches)return;
 const coach=document.getElementById('coach'), side=coach?.querySelector(':scope > .side'), nav=document.getElementById('coach-nav');
 if(!side||!nav)return;
 [['position','fixed'],['left','18px'],['right','18px'],['bottom','max(12px, env(safe-area-inset-bottom))'],['top','auto'],['width','auto'],['height','78px'],['min-height','78px'],['margin','0'],['padding','4px'],['border','1.5px solid #dda52f'],['outline','0'],['border-radius','40px'],['background','#fffdf9'],['background-image','none'],['box-shadow','0 12px 30px rgba(103,76,29,.11)'],['filter','none'],['overflow','hidden'],['z-index','9999'],['box-sizing','border-box']].forEach(x=>imp(side,x[0],x[1]));
 [['display','grid'],['grid-template-columns','repeat(3,minmax(0,1fr))'],['align-items','stretch'],['gap','0'],['width','100%'],['height','100%'],['margin','0'],['padding','0'],['border','0'],['outline','0'],['border-radius','35px'],['background','#fffdf9'],['background-image','none'],['box-shadow','none'],['overflow','hidden'],['box-sizing','border-box'],['filter','none']].forEach(x=>imp(nav,x[0],x[1]));
 nav.querySelectorAll('button').forEach(b=>{
   const active=b.classList.contains('active');
   [['width','calc(100% - 8px)'],['height','calc(100% - 8px)'],['margin','4px'],['padding','6px 3px'],['border-radius','31px'],['outline','0'],['box-sizing','border-box'],['filter','none'],['text-shadow','none']].forEach(x=>imp(b,x[0],x[1]));
   imp(b,'border',active?'1.5px solid #dda52f':'1.5px solid transparent');
   imp(b,'background',active?'linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)':'transparent');
   imp(b,'background-image',active?'linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)':'none');
   imp(b,'box-shadow',active?'0 5px 14px rgba(185,126,18,.18), inset 0 1px 0 rgba(255,255,255,.92), inset 0 0 0 2px rgba(255,244,190,.38)':'none');
   const c=active?'#17140d':'#5f6268'; imp(b,'color',c);imp(b,'-webkit-text-fill-color',c);
   b.querySelectorAll('svg,span').forEach(n=>{imp(n,'color',c);imp(n,'-webkit-text-fill-color',c)});
 });
}
let observed=null;
function bind(){paint();const nav=document.getElementById('coach-nav');if(!nav||nav===observed)return;observed=nav;new MutationObserver(()=>requestAnimationFrame(paint)).observe(nav,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
document.addEventListener('dcc:coach-screen',()=>requestAnimationFrame(bind));
document.addEventListener('dcc:profile-critical-ready',()=>requestAnimationFrame(bind));
window.addEventListener('pageshow',bind);
})();