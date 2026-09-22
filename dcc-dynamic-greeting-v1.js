/* DCC dynamic greeting v3 — refined local-time greeting for coach/client home screens */
(function(){
  'use strict';
  const BUILD='20260914-dcc-dynamic-greeting-v3';
  if(window.__dccDynamicGreeting===BUILD)return;
  window.__dccDynamicGreeting=BUILD;

  const STYLE_ID='dcc-dynamic-greeting-v3-css';
  let queued=false,cachedName='',nameRequested=false;
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim();
  const firstName=v=>{const s=norm(v);if(!s)return'';const first=s.split(' ')[0]||'';return first.charAt(0).toUpperCase()+first.slice(1).toLowerCase()};
  function greeting(){const h=new Date().getHours();if(h>=5&&h<12)return'Buenos días';if(h>=12&&h<20)return'Buenas tardes';return'Buenas noches'}
  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
  function appData(){try{if(typeof data!=='undefined'&&data)return data}catch(_){}return window.data||{}}
  function visible(el){if(!el)return false;try{return getComputedStyle(el).display!=='none'}catch(_){return true}}

  function css(){
    document.getElementById('dcc-dynamic-greeting-v1-css')?.remove();
    document.getElementById('dcc-dynamic-greeting-v2-css')?.remove();
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .dcc-time-greeting{margin:0 2px 11px;padding:5px 3px 4px;color:inherit;line-height:1.08}
      .dcc-time-greeting .dcc-time-greeting-kicker{display:block;margin-bottom:5px;color:#a77719;font-size:8px;font-weight:850;letter-spacing:2.5px;text-transform:uppercase}
      .dcc-time-greeting .dcc-time-greeting-text{display:block;font-size:clamp(23px,4vw,29px);font-weight:700;letter-spacing:-.7px}
      .dcc-time-greeting .dcc-time-greeting-hello{font-weight:690}
      .dcc-time-greeting .dcc-time-greeting-name{color:#b87b09;font-weight:740}
      .dcc-time-greeting .dcc-time-greeting-sub{display:block;margin-top:6px;color:#777d86;font-size:10.5px;line-height:1.3;letter-spacing:.02px}
      #coach-main.dcc-p9-dashboard .dcc-p9-hero{display:none!important}
      #coach-main.dcc-p9-dashboard .dcc-p9{padding-top:0!important}
      #coach-main.dcc-p9-dashboard .dcc-p9-stats{margin-top:6px!important}
      html:not(.dcc-theme-light-premium) .dcc-time-greeting .dcc-time-greeting-kicker{color:#e7bb55}
      html:not(.dcc-theme-light-premium) .dcc-time-greeting .dcc-time-greeting-name{color:#f0c96b}
      html:not(.dcc-theme-light-premium) .dcc-time-greeting .dcc-time-greeting-sub{color:#9ca4ae}
      html.dcc-theme-light-premium .dcc-time-greeting{color:#17191d}
      html.dcc-theme-light-premium .dcc-time-greeting .dcc-time-greeting-kicker{color:#a77719}
      html.dcc-theme-light-premium .dcc-time-greeting .dcc-time-greeting-name{color:#b87908}
      html.dcc-theme-light-premium .dcc-time-greeting .dcc-time-greeting-sub{color:#777d86}
      @media(max-width:560px){
        .dcc-time-greeting{margin:0 2px 9px;padding-top:3px}
        .dcc-time-greeting .dcc-time-greeting-text{font-size:24px;line-height:1.05;font-weight:690;letter-spacing:-.55px}
        .dcc-time-greeting .dcc-time-greeting-name{font-weight:730}
        .dcc-time-greeting .dcc-time-greeting-sub{margin-top:5px;font-size:10px}
      }
    `;(document.head||document.documentElement).appendChild(s);
  }

  function sessionNameFallback(){
    const d=appData();
    for(const v of [d?.profile?.name,d?.profile?.full_name,d?.user?.name,d?.user?.full_name,window.__dccSecureUserName,window.__dccUserName]){const n=firstName(v);if(n)return n}
    return'';
  }
  async function loadName(){
    if(nameRequested)return;nameRequested=true;cachedName=sessionNameFallback();
    const database=db();if(!database?.auth?.getSession)return;
    try{
      const sr=await database.auth.getSession(),user=sr?.data?.session?.user,meta=user?.user_metadata||{};
      cachedName=firstName(meta.full_name||meta.name||meta.given_name||cachedName);
      if(!cachedName&&user?.id&&database.from){const pr=await database.from('app_profiles').select('name,full_name').eq('user_id',user.id).maybeSingle();if(!pr?.error)cachedName=firstName(pr?.data?.name||pr?.data?.full_name||'')}
    }catch(_){}
    render();
  }
  function isCoachDashboard(root){return root.id==='coach-main'&&(window.currentScreen==='dashboard'||root.classList.contains('dcc-p9-dashboard')||!!root.querySelector('.dcc-p9-stat'))}
  function isClientHome(root){if(root.id!=='client-main'&&root.id!=='client-content'&&root.id!=='client')return false;if(root.id==='client'&&!visible(root))return false;const screen=String(window.currentScreen||window.clientScreen||'').toLowerCase();return !screen||screen==='home'||screen==='dashboard'||screen==='inicio'}
  function targetRoot(){
    /* El saludo dinámico pertenece al panel entrenador. En cliente interfería
       con la pantalla Inicio aprobada y podía quedar como único contenido. */
    const coach=document.getElementById('coach-main');
    if(coach&&visible(coach)&&isCoachDashboard(coach))return coach;
    return null;
  }
  function render(){
    css();const root=targetRoot();document.querySelectorAll('.dcc-time-greeting').forEach(el=>{if(!root||!root.contains(el))el.remove()});if(!root)return;
    let box=root.querySelector(':scope > .dcc-time-greeting');if(!box){box=document.createElement('div');box.className='dcc-time-greeting';box.setAttribute('aria-live','polite');const anchor=root.firstElementChild;if(anchor)root.insertBefore(box,anchor);else root.appendChild(box)}
    const name=cachedName||sessionNameFallback(),hello=greeting(),isCoach=root.id==='coach-main';
    box.innerHTML=`<span class="dcc-time-greeting-kicker">DCC FITNESS</span><span class="dcc-time-greeting-text"><span class="dcc-time-greeting-hello"></span>${name?'<span class="dcc-time-greeting-name"></span>':''}</span><span class="dcc-time-greeting-sub"></span>`;
    box.querySelector('.dcc-time-greeting-hello').textContent=name?`${hello}, `:hello;if(name)box.querySelector('.dcc-time-greeting-name').textContent=name;box.querySelector('.dcc-time-greeting-sub').textContent=isCoach?'Aquí tienes un resumen de tu actividad.':'Aquí tienes tu resumen de hoy.';
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}

  loadName();
  if(document.body)new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});else document.addEventListener('DOMContentLoaded',()=>new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true}),{once:true});
  document.addEventListener('click',()=>setTimeout(schedule,0),true);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});window.addEventListener('pageshow',schedule);[0,120,350,800,1600,3000].forEach(ms=>setTimeout(schedule,ms));
})();
