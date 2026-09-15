/* DCC — autoridad única de navegación: un toque = un render */
(function(){
'use strict';const BUILD='20260915-coach-navigation-authority-v3-single-render';if(window.__dccCoachNavigationAuthority===BUILD)return;window.__dccCoachNavigationAuthority=BUILD;
const ROUTES=['dashboard','clients','calendar','checkins','messages'],SET=new Set(ROUTES);
function sync(screen){if(!SET.has(screen))return;window.currentScreen=screen;window.currentApp='coach';window.__dccCoachRouteIntent=screen;const m=document.getElementById('coach-main');if(screen!=='dashboard'&&m?.dataset?.dccInstant)delete m.dataset.dccInstant}
function buttons(){const n=document.getElementById('coach-nav');return n?[...n.querySelectorAll('button')]:[]}
function mark(screen){const i=ROUTES.indexOf(screen),b=buttons();if(i<0||b.length!==5)return;b.forEach((x,j)=>{const on=j===i;x.classList.toggle('active',on);on?x.setAttribute('aria-current','page'):x.removeAttribute('aria-current')})}
function installShow(){const base=window.showCoach;if(typeof base!=='function'||base.__dccNavigationAuthorityV3)return false;const w=function(screen){if(!SET.has(screen))return base.apply(this,arguments);sync(screen);mark(screen);const out=base.apply(this,arguments);sync(screen);mark(screen);return out};w.__dccNavigationAuthorityV3=true;w.__dccPremiumV9=!!base.__dccPremiumV9;w.__dccPremiumV6=!!base.__dccPremiumV6;w.__base=base;window.showCoach=w;return true}
function open(screen){if(!SET.has(screen)||typeof window.showCoach!=='function')return;sync(screen);mark(screen);try{window.showCoach(screen)}catch(e){console.error('DCC navegación '+screen,e)}sync(screen);mark(screen)}
function patchNav(){const b=buttons();if(b.length!==5)return false;b.forEach((x,i)=>{x.onclick=null;x.removeAttribute('onclick');x.dataset.dccRoute=ROUTES[i]});return true}
document.addEventListener('click',e=>{const b=e.target?.closest?.('#coach-nav button');if(!b)return;const list=buttons(),i=list.indexOf(b),screen=ROUTES[i];if(!screen)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open(screen)},true);
window.dccOpenCoachPrimary=i=>open(ROUTES[i]);window.dccOpenCoachCalendar=()=>open('calendar');window.dccOpenCoachCheckins=()=>open('checkins');window.dccOpenCoachMessages=()=>open('messages');
function boot(){installShow();patchNav();let n=0,t=setInterval(()=>{installShow();patchNav();if(++n>=12)clearInterval(t)},100)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.addEventListener('pageshow',()=>{installShow();patchNav()});
})();
