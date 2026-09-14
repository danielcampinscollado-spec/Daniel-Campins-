/* DCC coach UI v11 — dashboard counters + unified search only */
(function(){
  'use strict';

  if(window.__dccCoachUIV11)return;
  window.__dccCoachUIV11=true;

  const GOLD2='#f0c96b';
  const STYLE_ID='dcc-coach-ui-v11-css';
  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};

  function searchSvg(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>';
  }

  function injectCss(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #coach-main .dcc-u-search-wrap{display:block!important;width:100%!important;margin:0!important}
      #coach-main .dcc-u-search{
        width:100%!important;height:54px!important;min-height:54px!important;display:flex!important;align-items:center!important;gap:13px!important;
        padding:0 17px!important;margin:0!important;overflow:hidden!important;box-sizing:border-box!important;
        border:1px solid rgba(240,201,107,.58)!important;border-radius:18px!important;
        background:radial-gradient(circle at 90% 0,rgba(240,201,107,.075),transparent 34%),linear-gradient(145deg,#10151a,#080b0e)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.03),0 10px 24px rgba(0,0,0,.14)!important;color:#eef0f2!important
      }
      #coach-main .dcc-u-search>svg{width:21px!important;height:21px!important;min-width:21px!important;flex:0 0 21px!important;color:#f4f4f2!important}
      #coach-main .dcc-u-search>input{
        all:unset!important;-webkit-appearance:none!important;appearance:none!important;display:block!important;flex:1 1 auto!important;
        width:auto!important;min-width:0!important;height:100%!important;box-sizing:border-box!important;background:transparent!important;border:0!important;
        border-radius:0!important;outline:0!important;box-shadow:none!important;margin:0!important;padding:0!important;
        color:#f4f2ee!important;-webkit-text-fill-color:#f4f2ee!important;caret-color:${GOLD2}!important;
        font-family:inherit!important;font-size:14px!important;font-weight:600!important;line-height:54px!important
      }
      #coach-main .dcc-u-search>input::placeholder{color:#747d88!important;-webkit-text-fill-color:#747d88!important;opacity:1!important}
      #coach-main.dcc-premium-clients .dcc-cl-tools{display:block!important;grid-template-columns:none!important;gap:0!important}
      #coach-main.dcc-premium-clients .dcc-cl-filter{display:none!important}
    `;
    document.head.appendChild(s);
  }

  function daysSince(v){
    if(!v)return null;
    const d=new Date(v);
    return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null;
  }
  function pendingCheck(c){const x=getData()?.checkins?.[c.id];return !!(x?.sentAt&&!x?.reviewed)}
  function hasRoutine(id){const r=getData()?.routines?.[id];return Array.isArray(r)&&r.length>0}
  function latestWorkout(id){
    const h=getData()?.workoutHistory?.[id]||[];
    return h.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0]||null;
  }
  function taskCount(){
    const cs=Array.isArray(getData()?.clients)?getData().clients:[];
    return cs.reduce((n,c)=>n+(pendingCheck(c)?1:0)+(!hasRoutine(c.id)?1:0),0);
  }
  function attentionCount(){
    const cs=Array.isArray(getData()?.clients)?getData().clients:[];
    return cs.reduce((n,c)=>{const gap=daysSince(latestWorkout(c.id)?.date);return n+((gap!==null&&gap>=7)?1:0)},0);
  }

  function ensureCount(sectionId,count){
    const title=document.querySelector(`#${sectionId} .dcc-p9-head-title`);
    if(!title)return;
    let badge=title.querySelector('.dcc-p9-count');
    if(!badge){
      badge=document.createElement('span');
      badge.className='dcc-p9-count';
      title.appendChild(badge);
    }
    badge.textContent=String(count);
  }
  function patchDashboard(){
    ensureCount('dccP9Tasks',taskCount());
    ensureCount('dccP9Attention',attentionCount());
  }

  function makeSearch(input,placeholder){
    const box=document.createElement('div');
    box.className='dcc-u-search';
    box.innerHTML=searchSvg();
    input.placeholder=placeholder;
    box.appendChild(input);
    return box;
  }

  function patchClients(){
    const tools=document.querySelector('#coach-main.dcc-premium-clients .dcc-cl-tools');
    const input=document.getElementById('dccClientSearch');
    if(!tools||!input||tools.dataset.dccUnified==='1')return;
    tools.dataset.dccUnified='1';
    tools.classList.add('dcc-u-search-wrap');
    tools.replaceChildren(makeSearch(input,'Buscar cliente...'));
  }

  function patchMessages(){
    const main=document.getElementById('coach-main');
    const input=document.getElementById('messages-search');
    if(!main||!input||input.dataset.dccUnified==='1')return;
    input.dataset.dccUnified='1';
    let shell=input.parentElement;
    for(let i=0;i<3;i++){
      const p=shell?.parentElement;
      if(!p||p===main)break;
      const rect=p.getBoundingClientRect();
      if(p.querySelectorAll('input').length===1&&rect.height>0&&rect.height<=92&&rect.width>=240)shell=p;
      else break;
    }
    if(!shell)return;
    const marker=document.createElement('div');
    marker.className='dcc-u-search-wrap';
    marker.appendChild(makeSearch(input,'Buscar conversación...'));
    shell.replaceWith(marker);
  }

  function patchNav(){
    const nav=document.getElementById('coach-nav');
    if(!nav)return;
    const buttons=[...nav.querySelectorAll('button')];
    if(buttons[2])buttons[2].setAttribute('onclick',"showCoach('calendar')");
  }

  function afterScreen(screen){
    injectCss();
    patchNav();
    if(screen==='dashboard')patchDashboard();
    else if(screen==='clients')patchClients();
    else if(screen==='messages')patchMessages();
  }

  function hasPremium(fn,depth){
    if(!fn||typeof fn!=='function'||depth>8)return false;
    if(fn.__dccPremiumV9||fn.__dccPremiumV6)return true;
    return hasPremium(fn.__base,depth+1)||hasPremium(fn.__original,depth+1);
  }

  function install(attempt){
    injectCss();
    const current=window.showCoach;
    if(typeof current!=='function'||!hasPremium(current,0)){
      if((attempt||0)<30)setTimeout(()=>install((attempt||0)+1),60);
      return;
    }
    if(current.__dccUIV11){
      afterScreen(window.currentScreen||'');
      return;
    }
    const wrapped=function(screen){
      const result=current.apply(this,arguments);
      requestAnimationFrame(()=>afterScreen(screen));
      return result;
    };
    wrapped.__dccUIV11=true;
    wrapped.__base=current;
    window.showCoach=wrapped;
    requestAnimationFrame(()=>afterScreen(window.currentScreen||''));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>install(0),{once:true});
  else install(0);
  window.addEventListener('pageshow',()=>install(0));
})();
