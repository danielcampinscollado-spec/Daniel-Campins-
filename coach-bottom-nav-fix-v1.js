/* DCC — barra inferior entrenador Light Premium persistente en todas las pantallas */
(function(){
'use strict';
const BUILD='20260916-coach-bottom-nav-light-v4-persistent';
if(window.__dccCoachBottomNavFix===BUILD)return;
window.__dccCoachBottomNavFix=BUILD;
let raf=0;
function css(){
  let s=document.getElementById('dcc-coach-bottom-nav-fix-v1');
  if(!s){s=document.createElement('style');s.id='dcc-coach-bottom-nav-fix-v1';document.head.appendChild(s)}
  s.textContent=`@media(max-width:900px){
    html body #coach .side>h2,html body #coach .side>.out{display:none!important}
    html body #coach #coach-nav button::before,html body #coach #coach-nav button::after,html body #coach #coach-nav::before,html body #coach #coach-nav::after{display:none!important;content:none!important}
  }`;
  document.head.appendChild(s);
}
function set(el,p,v){if(!el)return;const same=el.style.getPropertyValue(p)===v&&el.style.getPropertyPriority(p)==='important';if(!same)el.style.setProperty(p,v,'important')}
function apply(){
  if(!matchMedia('(max-width:900px)').matches)return;
  const side=document.querySelector('#coach .side'),nav=document.getElementById('coach-nav');
  if(!side||!nav)return;
  const sideRules={position:'fixed',left:'18px',right:'18px',bottom:'10px',top:'auto',width:'auto',height:'70px','min-height':'70px',margin:'0',padding:'5px',border:'1px solid rgba(197,151,55,.28)','border-radius':'27px',background:'rgba(255,252,246,.985)','background-color':'rgba(255,252,246,.985)','box-shadow':'0 12px 30px rgba(83,61,25,.13), inset 0 1px 0 rgba(255,255,255,.98)','backdrop-filter':'blur(18px)','-webkit-backdrop-filter':'blur(18px)',overflow:'hidden','z-index':'9999','box-sizing':'border-box'};
  Object.entries(sideRules).forEach(([p,v])=>set(side,p,v));
  const navRules={position:'relative',inset:'auto',width:'100%',height:'100%','min-height':'0',margin:'0',padding:'0',gap:'3px',border:'0','border-radius':'22px',background:'transparent','background-color':'transparent','box-shadow':'none',overflow:'hidden','box-sizing':'border-box'};
  Object.entries(navRules).forEach(([p,v])=>set(nav,p,v));
  [...nav.querySelectorAll('button')].forEach(b=>{
    const active=b.classList.contains('active');
    const rules={position:'relative',display:'flex','flex-direction':'column','align-items':'center','justify-content':'center',width:'100%',height:'100%','min-width':'0','min-height':'0',margin:'0',padding:'4px 2px',border:active?'1px solid rgba(209,151,35,.55)':'1px solid transparent','border-radius':'20px',outline:'0',background:active?'linear-gradient(145deg,#ffe79a 0%,#f3c553 55%,#e8aa31 100%)':'transparent','background-color':active?'#f3c553':'transparent',color:active?'#17140d':'#6f7784','box-shadow':active?'0 5px 14px rgba(197,137,25,.18), inset 0 1px 0 rgba(255,255,255,.68)':'none','text-shadow':'none',transform:'none','box-sizing':'border-box'};
    Object.entries(rules).forEach(([p,v])=>set(b,p,v));
    b.querySelectorAll('svg').forEach(x=>{set(x,'color',active?'#17140d':'#6f7784');set(x,'stroke','currentColor');set(x,'filter','none');set(x,'width','21px');set(x,'height','21px')});
    b.querySelectorAll('span').forEach(x=>{set(x,'color',active?'#17140d':'#6f7784');set(x,'font-size','8px');set(x,'line-height','1');set(x,'font-weight',active?'800':'650');set(x,'margin-top','2px');set(x,'text-shadow','none')});
  });
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}
function boot(){css();schedule();setTimeout(apply,80);setTimeout(apply,350)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('load',schedule,{once:true});window.addEventListener('pageshow',schedule);window.addEventListener('resize',schedule);window.addEventListener('dcc:themechange',schedule);document.addEventListener('dcc:coach-screen',schedule);
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
})();
