/* DCC dynamic greeting — estable, sin MutationObserver ni bucles de render */
(function(){
  'use strict';
  const BUILD='20260915-dcc-dynamic-greeting-v4-stable';
  if(window.__dccDynamicGreeting===BUILD)return;
  window.__dccDynamicGreeting=BUILD;

  const STYLE_ID='dcc-dynamic-greeting-v4-css';
  let cachedName='',nameRequested=false;
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim();
  const firstName=v=>{const s=norm(v);if(!s)return'';const first=s.split(' ')[0]||'';return first.charAt(0).toUpperCase()+first.slice(1).toLowerCase()};
  const greeting=()=>{const h=new Date().getHours();return h>=5&&h<12?'Buenos días':h>=12&&h<20?'Buenas tardes':'Buenas noches'};
  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
  function appData(){try{if(typeof data!=='undefined'&&data)return data}catch(_){}return window.data||{}}

  function css(){
    if(document.getElementById(STYLE_ID))return;
    ['dcc-dynamic-greeting-v1-css','dcc-dynamic-greeting-v2-css','dcc-dynamic-greeting-v3-css'].forEach(id=>document.getElementById(id)?.remove());
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .dcc-time-greeting{margin:0 2px 11px;padding:5px 3px 4px;color:inherit;line-height:1.08}
      .dcc-time-greeting-kicker{display:block;margin-bottom:5px;color:#a77719;font-size:8px;font-weight:850;letter-spacing:2.5px;text-transform:uppercase}
      .dcc-time-greeting-text{display:block;font-size:clamp(23px,4vw,29px);font-weight:690;letter-spacing:-.7px}
      .dcc-time-greeting-hello{font-weight:650}.dcc-time-greeting-name{color:#b87b09;font-weight:710}
      .dcc-time-greeting-sub{display:block;margin-top:6px;color:#777d86;font-size:10.5px;line-height:1.3}
      #coach-main.dcc-p9-dashboard .dcc-p9-hero{display:none!important}#coach-main.dcc-p9-dashboard .dcc-p9{padding-top:0!important}#coach-main.dcc-p9-dashboard .dcc-p9-stats{margin-top:6px!important}
      html:not(.dcc-theme-light-premium) .dcc-time-greeting-kicker{color:#e7bb55}html:not(.dcc-theme-light-premium) .dcc-time-greeting-name{color:#f0c96b}html:not(.dcc-theme-light-premium) .dcc-time-greeting-sub{color:#9ca4ae}
      html.dcc-theme-light-premium .dcc-time-greeting{color:#17191d}
      @media(max-width:560px){.dcc-time-greeting{margin:0 2px 9px;padding-top:3px}.dcc-time-greeting-text{font-size:24px;line-height:1.05;font-weight:660}.dcc-time-greeting-name{font-weight:700}.dcc-time-greeting-sub{margin-top:5px;font-size:10px}}
    `;(document.head||document.documentElement).appendChild(s);
  }

  function sessionNameFallback(){
    const d=appData();for(const v of [d?.profile?.name,d?.profile?.full_name,d?.user?.name,d?.user?.full_name,window.__dccSecureUserName,window.__dccUserName]){const n=firstName(v);if(n)return n}return'';
  }
  function render(){
    css();const root=document.getElementById('coach-main');if(!root)return;
    const dashboard=root.classList.contains('dcc-p9-dashboard');
    root.querySelectorAll(':scope > .dcc-time-greeting').forEach(el=>{if(!dashboard)el.remove()});
    if(!dashboard)return;
    let box=root.querySelector(':scope > .dcc-time-greeting');
    if(!box){box=document.createElement('div');box.className='dcc-time-greeting';const anchor=root.firstElementChild;if(anchor)root.insertBefore(box,anchor);else root.appendChild(box)}
    const name=cachedName||sessionNameFallback(),hello=greeting();
    const signature=hello+'|'+name;if(box.dataset.sig===signature)return;box.dataset.sig=signature;
    box.innerHTML='<span class="dcc-time-greeting-kicker">DCC FITNESS</span><span class="dcc-time-greeting-text"><span class="dcc-time-greeting-hello"></span><span class="dcc-time-greeting-name"></span></span><span class="dcc-time-greeting-sub">Aquí tienes un resumen de tu actividad.</span>';
    box.querySelector('.dcc-time-greeting-hello').textContent=name?hello+', ':hello;
    box.querySelector('.dcc-time-greeting-name').textContent=name;
  }

  async function loadName(){
    if(nameRequested)return;nameRequested=true;cachedName=sessionNameFallback();const database=db();if(!database?.auth?.getSession){render();return}
    try{const sr=await database.auth.getSession(),user=sr?.data?.session?.user,meta=user?.user_metadata||{};cachedName=firstName(meta.full_name||meta.name||meta.given_name||cachedName)}catch(_){}
    render();
  }

  function wrap(){
    const base=window.showCoach;if(typeof base!=='function'||base.__dccGreetingStableV4)return false;
    const wrapped=function(screen){const out=base.apply(this,arguments);if(screen==='dashboard')render();else document.querySelector('#coach-main > .dcc-time-greeting')?.remove();return out};
    wrapped.__dccGreetingStableV4=true;wrapped.__dccPremiumV9=!!base.__dccPremiumV9;wrapped.__dccPremiumV6=!!base.__dccPremiumV6;wrapped.__base=base;window.showCoach=wrapped;return true;
  }
  css();loadName();if(!wrap()){let tries=0;const t=setInterval(()=>{tries++;if(wrap()||tries>=12)clearInterval(t)},120)}
  window.addEventListener('pageshow',()=>{wrap();render()});
})();
