/* DCC — autoridad final de la barra inferior Light Premium. Inline !important gana a cualquier tema legacy. */
(function(){
'use strict';
const BUILD='20260916-bottom-nav-white-v10-inline-authority';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;

function imp(el,prop,value){if(el)el.style.setProperty(prop,value,'important')}
function paint(root,nav){
  if(!root||!nav||innerWidth>900)return;
  const side=nav.closest('.side');
  if(!side)return;
  imp(side,'background','#fffdf9');imp(side,'background-image','none');imp(side,'background-color','#fffdf9');
  imp(side,'border','1px solid rgba(201,151,47,.34)');imp(side,'border-radius','27px');
  imp(side,'box-shadow','0 10px 28px rgba(83,61,25,.12), inset 0 1px 0 #fff');
  imp(side,'overflow','hidden');imp(side,'padding','5px');imp(side,'height','66px');imp(side,'min-height','66px');
  imp(side,'transition','none');imp(side,'animation','none');
  imp(nav,'background','#fffdf9');imp(nav,'background-image','none');imp(nav,'background-color','#fffdf9');
  imp(nav,'border','0');imp(nav,'box-shadow','none');imp(nav,'border-radius','22px');imp(nav,'overflow','hidden');
  imp(nav,'display','flex');imp(nav,'gap','3px');imp(nav,'transition','none');imp(nav,'animation','none');
  [...nav.querySelectorAll('button')].forEach(btn=>{
    const active=btn.classList.contains('active');
    imp(btn,'flex','1 1 0');imp(btn,'height','100%');imp(btn,'min-width','0');imp(btn,'margin','0');imp(btn,'border-radius','20px');
    imp(btn,'transition','none');imp(btn,'animation','none');imp(btn,'transform','none');imp(btn,'text-shadow','none');
    if(active){
      imp(btn,'background','linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)');
      imp(btn,'background-color','#f3c553');imp(btn,'border','1px solid rgba(209,151,35,.52)');imp(btn,'color','#17140d');
      imp(btn,'box-shadow','0 4px 12px rgba(197,137,25,.18), inset 0 1px 0 rgba(255,255,255,.75)');
    }else{
      imp(btn,'background','transparent');imp(btn,'background-image','none');imp(btn,'background-color','transparent');
      imp(btn,'border','1px solid transparent');imp(btn,'color','#5e5547');imp(btn,'box-shadow','none');
    }
    btn.querySelectorAll('svg,span').forEach(x=>imp(x,'color',active?'#17140d':'#5e5547'));
  });
}
function enforce(){paint(document.getElementById('coach'),document.getElementById('coach-nav'));paint(document.getElementById('client'),document.getElementById('client-nav'))}

let s=document.getElementById('dcc-bottom-nav-light-premium-v1');
if(!s){s=document.createElement('style');s.id='dcc-bottom-nav-light-premium-v1';(document.head||document.documentElement).appendChild(s)}
s.textContent=`@media(max-width:900px){body #coach .side,body #client .side{position:fixed!important;left:16px!important;right:16px!important;bottom:10px!important;top:auto!important;width:auto!important;height:66px!important;padding:5px!important;border-radius:27px!important;z-index:9999!important}body #coach .side>h2,body #client .side>h2,body #coach .side>.out,body #client .side>.out{display:none!important}body #coach #coach-nav,body #client #client-nav{width:100%!important;height:100%!important;margin:0!important;padding:0!important}body #coach #coach-nav button,body #client #client-nav button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:4px 2px!important}body #coach #coach-nav button::before,body #coach #coach-nav button::after,body #client #client-nav button::before,body #client #client-nav button::after{display:none!important;content:none!important}body #coach #coach-nav button svg,body #client #client-nav button svg{width:21px!important;height:21px!important;stroke:currentColor!important;filter:none!important}body #coach #coach-nav button span,body #client #client-nav button span{font-size:8px!important;line-height:1!important;font-weight:700!important;margin-top:2px!important}}`;

enforce();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enforce,{once:true});
window.addEventListener('load',enforce,{once:true});
window.addEventListener('pageshow',enforce);
document.getElementById('coach-nav')?.addEventListener('click',()=>requestAnimationFrame(enforce),true);
document.getElementById('client-nav')?.addEventListener('click',()=>requestAnimationFrame(enforce),true);
})();
