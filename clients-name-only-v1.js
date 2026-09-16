/* DCC — Clientes light: referencia aprobada */
(function(){
'use strict';
const BUILD='20260915-clients-reference-v4';
if(window.__dccClientsNameOnly===BUILD)return;window.__dccClientsNameOnly=BUILD;

const userIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="3.2"></circle><path d="M5.8 20c.5-4.6 2.5-7 6.2-7s5.7 2.4 6.2 7"></path></svg>';

function injectCss(){
  let s=document.getElementById('dcc-clients-name-only-v1');
  if(!s){s=document.createElement('style');s.id='dcc-clients-name-only-v1';document.head.appendChild(s)}
  s.textContent=`
    #coach-main.dcc-premium-clients .dcc-cl-subtools>span{font-size:0!important;letter-spacing:1.2px!important;color:#8f96a3!important}
    #coach-main.dcc-premium-clients .dcc-cl-subtools>span:after{content:attr(data-dcc-label);font-size:10px!important;font-weight:850!important}
    #coach-main.dcc-premium-clients .dcc-cl-list{gap:10px!important}
    #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{
      display:flex!important;grid-template-columns:none!important;align-items:center!important;
      width:100%!important;min-height:86px!important;padding:11px 12px!important;gap:12px!important;
      border-radius:17px!important;cursor:pointer!important;overflow:hidden!important;
    }
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-info,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-active,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-chevron,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-goal,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-weight,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-ref-meta,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-training,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-manage{display:none!important}
    #coach-main.dcc-premium-clients .dcc-client-avatar{
      width:54px!important;height:54px!important;flex:0 0 54px!important;display:flex!important;align-items:center!important;justify-content:center!important;
      border-radius:50%!important;background:rgba(217,170,74,.09)!important;color:#b57b18!important;
    }
    #coach-main.dcc-premium-clients .dcc-client-avatar svg{width:30px!important;height:30px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important}
    #coach-main.dcc-premium-clients .dcc-client-name-ref{
      flex:1 1 auto!important;min-width:0!important;margin:0!important;color:#111318!important;
      font-size:16px!important;font-weight:850!important;line-height:1.15!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
    }
    #coach-main.dcc-premium-clients .dcc-manage-client-btn{
      flex:0 0 auto!important;width:auto!important;min-width:132px!important;height:44px!important;margin:0!important;padding:0 13px!important;
      display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:9px!important;
      border:1.4px solid #d5a438!important;border-radius:13px!important;background:rgba(255,255,255,.30)!important;
      color:#80530a!important;font-family:inherit!important;font-size:11.5px!important;font-weight:800!important;line-height:1!important;
      letter-spacing:0!important;text-transform:none!important;white-space:nowrap!important;box-shadow:none!important;cursor:pointer!important;
    }
    #coach-main.dcc-premium-clients .dcc-manage-client-btn .dcc-manage-arrow{font-size:21px!important;line-height:1!important;color:#8f5e0d!important;font-weight:700!important;margin-top:-1px!important}
    html:not(.dcc-theme-light-premium) #coach-main.dcc-premium-clients .dcc-client-name-ref{color:#f5f3ef!important}
    html:not(.dcc-theme-light-premium) #coach-main.dcc-premium-clients .dcc-client-avatar{background:rgba(217,170,74,.08)!important;color:#f0c96b!important}
    html:not(.dcc-theme-light-premium) #coach-main.dcc-premium-clients .dcc-manage-client-btn{color:#f0c96b!important;border-color:#d9aa4a!important;background:rgba(217,170,74,.025)!important}
    @media(max-width:390px){
      #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{min-height:82px!important;padding:10px!important;gap:10px!important}
      #coach-main.dcc-premium-clients .dcc-client-avatar{width:48px!important;height:48px!important;flex-basis:48px!important}
      #coach-main.dcc-premium-clients .dcc-client-avatar svg{width:27px!important;height:27px!important}
      #coach-main.dcc-premium-clients .dcc-client-name-ref{font-size:15px!important}
      #coach-main.dcc-premium-clients .dcc-manage-client-btn{min-width:122px!important;height:42px!important;padding:0 10px!important;font-size:10.5px!important;gap:6px!important}
      #coach-main.dcc-premium-clients .dcc-manage-client-btn .dcc-manage-arrow{font-size:19px!important}
    }
  `;
}

function apply(){
  injectCss();
  const main=document.getElementById('coach-main');
  if(!main||!main.classList.contains('dcc-premium-clients'))return;
  const cards=[...main.querySelectorAll('.dcc-cl-card.dcc-cl-card-ref')];
  const label=main.querySelector('.dcc-cl-subtools>span');
  if(label)label.setAttribute('data-dcc-label',`CLIENTES ACTIVOS (${cards.length})`);
  cards.forEach(card=>{
    const oldName=card.querySelector('.dcc-cl-name')?.textContent?.trim()||card.dataset.name||'Cliente';
    if(card.dataset.dccReferenceReady==='1')return;
    card.dataset.dccReferenceReady='1';
    const avatar=document.createElement('span');avatar.className='dcc-client-avatar';avatar.innerHTML=userIcon;
    const name=document.createElement('span');name.className='dcc-client-name-ref';name.textContent=oldName;
    const btn=document.createElement('button');btn.type='button';btn.className='dcc-manage-client-btn';btn.setAttribute('aria-label',`Gestionar cliente ${oldName}`);btn.innerHTML='Gestionar cliente<span class="dcc-manage-arrow">›</span>';
    card.append(avatar,name,btn);
  });
}

document.addEventListener('dcc:coach-screen',e=>{if(e.detail?.screen==='clients')requestAnimationFrame(apply)});
const obs=new MutationObserver(()=>{if(document.getElementById('coach-main')?.classList.contains('dcc-premium-clients'))apply()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{injectCss();obs.observe(document.body,{childList:true,subtree:true});apply()},{once:true});
else{injectCss();obs.observe(document.body,{childList:true,subtree:true});apply()}
})();
