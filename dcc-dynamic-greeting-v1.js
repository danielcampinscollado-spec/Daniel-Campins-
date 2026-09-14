/* DCC dynamic greeting v1 — local-time greeting for coach/client home screens */
(function(){
  'use strict';
  const BUILD='20260914-dcc-dynamic-greeting-v1';
  if(window.__dccDynamicGreeting===BUILD)return;
  window.__dccDynamicGreeting=BUILD;

  const STYLE_ID='dcc-dynamic-greeting-v1-css';
  let queued=false;
  let cachedName='';
  let nameRequested=false;

  function norm(v){return String(v||'').replace(/\s+/g,' ').trim()}
  function firstName(v){
    const s=norm(v);
    if(!s)return'';
    const first=s.split(' ')[0]||'';
    return first.charAt(0).toUpperCase()+first.slice(1).toLowerCase();
  }
  function greeting(){
    const h=new Date().getHours();
    if(h>=5&&h<12)return'Buenos días';
    if(h>=12&&h<20)return'Buenas tardes';
    return'Buenas noches';
  }
  function db(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}
    return window.supabaseClient||null;
  }
  function appData(){
    try{if(typeof data!=='undefined'&&data)return data}catch(_){}
    return window.data||{};
  }
  function visible(el){
    if(!el)return false;
    try{return getComputedStyle(el).display!=='none'}catch(_){return true}
  }
  function css(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .dcc-time-greeting{margin:0 0 14px;padding:0 2px;color:inherit;line-height:1.05}
      .dcc-time-greeting .dcc-time-greeting-kicker{display:block;margin-bottom:5px;color:#a98a45;font-size:10px;font-weight:850;letter-spacing:1.7px;text-transform:uppercase}
      .dcc-time-greeting .dcc-time-greeting-text{display:block;font-size:clamp(25px,4.8vw,34px);font-weight:820;letter-spacing:-1.2px}
      html:not(.dcc-theme-light-premium) .dcc-time-greeting .dcc-time-greeting-kicker{color:#e7bb55}
      @media(max-width:560px){.dcc-time-greeting{margin-bottom:12px}.dcc-time-greeting .dcc-time-greeting-text{font-size:29px}}
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  function sessionNameFallback(){
    const d=appData();
    const candidates=[
      d?.profile?.name,d?.profile?.full_name,d?.user?.name,d?.user?.full_name,
      window.__dccSecureUserName,window.__dccUserName
    ];
    for(const v of candidates){const n=firstName(v);if(n)return n}
    return'';
  }

  async function loadName(){
    if(nameRequested)return;
    nameRequested=true;
    cachedName=sessionNameFallback();
    const database=db();
    if(!database?.auth?.getSession)return;
    try{
      const sr=await database.auth.getSession();
      const user=sr?.data?.session?.user;
      const meta=user?.user_metadata||{};
      cachedName=firstName(meta.full_name||meta.name||meta.given_name||cachedName);
      if(!cachedName&&user?.id&&database.from){
        const pr=await database.from('app_profiles').select('name,full_name').eq('user_id',user.id).maybeSingle();
        if(!pr?.error)cachedName=firstName(pr?.data?.name||pr?.data?.full_name||'');
      }
    }catch(_){}
    render();
  }

  function isCoachDashboard(root){
    if(root.id!=='coach-main')return false;
    return window.currentScreen==='dashboard'||root.classList.contains('dcc-p9-dashboard')||!!root.querySelector('.dcc-p9-stat');
  }
  function isClientHome(root){
    if(root.id!=='client-main'&&root.id!=='client-content'&&root.id!=='client')return false;
    if(root.id==='client'&&!visible(root))return false;
    const screen=String(window.currentScreen||window.clientScreen||'').toLowerCase();
    return !screen||screen==='home'||screen==='dashboard'||screen==='inicio';
  }
  function targetRoot(){
    const coach=document.getElementById('coach-main');
    if(coach&&visible(coach)&&isCoachDashboard(coach))return coach;
    for(const id of ['client-main','client-content','client']){
      const el=document.getElementById(id);
      if(el&&visible(el)&&isClientHome(el))return el;
    }
    return null;
  }
  function render(){
    css();
    const root=targetRoot();
    document.querySelectorAll('.dcc-time-greeting').forEach(el=>{if(!root||!root.contains(el))el.remove()});
    if(!root)return;

    let box=root.querySelector(':scope > .dcc-time-greeting');
    if(!box){
      box=document.createElement('div');
      box.className='dcc-time-greeting';
      box.setAttribute('aria-live','polite');
      const anchor=root.firstElementChild;
      if(anchor)root.insertBefore(box,anchor);else root.appendChild(box);
    }
    const name=cachedName||sessionNameFallback();
    const text=name?`${greeting()}, ${name}`:greeting();
    box.innerHTML=`<span class="dcc-time-greeting-kicker">DCC FITNESS</span><span class="dcc-time-greeting-text"></span>`;
    box.querySelector('.dcc-time-greeting-text').textContent=text;
  }
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;render()});
  }

  loadName();
  if(document.body)new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  else document.addEventListener('DOMContentLoaded',()=>new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true}),{once:true});
  document.addEventListener('click',()=>setTimeout(schedule,0),true);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
  window.addEventListener('pageshow',schedule);
  [0,120,350,800,1600,3000].forEach(ms=>setTimeout(schedule,ms));
})();