/* DCC — Clientes light: referencia aprobada + fecha de alta */
(function(){
'use strict';
const BUILD='20260916-clients-reference-v5-start-date';
if(window.__dccClientsNameOnly===BUILD)return;window.__dccClientsNameOnly=BUILD;

const userIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="3.2"></circle><path d="M5.8 20c.5-4.6 2.5-7 6.2-7s5.7 2.4 6.2 7"></path></svg>';
const months=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function clients(){try{return Array.isArray(data?.clients)?data.clients:(Array.isArray(window.data?.clients)?window.data.clients:[])}catch(_){return[]}}
function formatSince(value){
  if(!value)return'';
  const m=String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(!m)return'';
  const y=Number(m[1]),mo=Number(m[2]),d=Number(m[3]);
  if(!y||mo<1||mo>12||d<1||d>31)return'';
  return `Desde el ${d} de ${months[mo-1]} de ${y}`;
}
function clientForCard(card,name){
  const click=card.getAttribute('onclick')||'';
  const id=click.match(/openClient\(['\"]([^'\"]+)/)?.[1]||'';
  return clients().find(c=>String(c?.id||'')===String(id))||clients().find(c=>String(c?.name||'').trim().toLowerCase()===String(name||'').trim().toLowerCase())||null;
}

function injectCss(){
  let s=document.getElementById('dcc-clients-name-only-v1');
  if(!s){s=document.createElement('style');s.id='dcc-clients-name-only-v1';document.head.appendChild(s)}
  s.textContent=`
    #coach-main.dcc-premium-clients .dcc-cl-subtools>span{font-size:0!important;letter-spacing:1.2px!important;color:#8f96a3!important}
    #coach-main.dcc-premium-clients .dcc-cl-subtools>span:after{content:attr(data-dcc-label);font-size:10px!important;font-weight:850!important}
    #coach-main.dcc-premium-clients .dcc-cl-list{gap:10px!important}
    #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{
      display:flex!important;grid-template-columns:none!important;align-items:center!important;
      width:100%!important;min-height:92px!important;padding:12px!important;gap:12px!important;
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
      border:1px solid rgba(213,164,56,.38)!important;border-radius:50%!important;background:rgba(217,170,74,.09)!important;color:#b57b18!important;
    }
    #coach-main.dcc-premium-clients .dcc-client-avatar svg{width:30px!important;height:30px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important}
    #coach-main.dcc-premium-clients .dcc-client-copy{flex:1 1 auto!important;min-width:0!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:5px!important}
    #coach-main.dcc-premium-clients .dcc-client-name-ref{
      min-width:0!important;margin:0!important;color:#111318!important;
      font-size:16px!important;font-weight:850!important;line-height:1.15!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
    }
    #coach-main.dcc-premium-clients .dcc-client-since{
      color:#7d8594!important;font-size:11.5px!important;font-weight:500!important;line-height:1.2!important;
      white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
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
    html:not(.dcc-theme-light-premium) #coach-main.dcc-premium-clients .dcc-client-since{color:#9aa3af!important}
    html:not(.dcc-theme-light-premium) #coach-main.dcc-premium-clients .dcc-client-avatar{background:rgba(217,170,74,.08)!important;color:#f0c96b!important}
    html:not(.dcc-theme-light-premium) #coach-main.dcc-premium-clients .dcc-manage-client-btn{color:#f0c96b!important;border-color:#d9aa4a!important;background:rgba(217,170,74,.025)!important}
    @media(max-width:390px){
      #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{min-height:88px!important;padding:10px!important;gap:9px!important}
      #coach-main.dcc-premium-clients .dcc-client-avatar{width:48px!important;height:48px!important;flex-basis:48px!important}
      #coach-main.dcc-premium-clients .dcc-client-avatar svg{width:27px!important;height:27px!important}
      #coach-main.dcc-premium-clients .dcc-client-name-ref{font-size:15px!important}
      #coach-main.dcc-premium-clients .dcc-client-since{font-size:10px!important}
      #coach-main.dcc-premium-clients .dcc-manage-client-btn{min-width:116px!important;height:42px!important;padding:0 9px!important;font-size:10.5px!important;gap:5px!important}
      #coach-main.dcc-premium-clients .dcc-manage-client-btn .dcc-manage-arrow{font-size:19px!important}
    }
  `;
  document.head.appendChild(s);
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
    const c=clientForCard(card,oldName);
    const since=formatSince(c?.created_at||c?.createdAt||c?.start_date||c?.startDate);
    card.querySelectorAll(':scope > .dcc-client-avatar,:scope > .dcc-client-copy,:scope > .dcc-client-name-ref,:scope > .dcc-manage-client-btn').forEach(el=>el.remove());
    const avatar=document.createElement('span');avatar.className='dcc-client-avatar';avatar.innerHTML=userIcon;
    const copy=document.createElement('span');copy.className='dcc-client-copy';
    const name=document.createElement('span');name.className='dcc-client-name-ref';name.textContent=oldName;
    copy.appendChild(name);
    if(since){const date=document.createElement('span');date.className='dcc-client-since';date.textContent=since;copy.appendChild(date)}
    const btn=document.createElement('button');btn.type='button';btn.className='dcc-manage-client-btn';btn.setAttribute('aria-label',`Gestionar cliente ${oldName}`);btn.innerHTML='Gestionar cliente<span class="dcc-manage-arrow">›</span>';
    card.append(avatar,copy,btn);
    card.dataset.dccReferenceReady='5';
  });
}

document.addEventListener('dcc:coach-screen',e=>{if(e.detail?.screen==='clients')requestAnimationFrame(apply)});
const obs=new MutationObserver(()=>{if(document.getElementById('coach-main')?.classList.contains('dcc-premium-clients'))apply()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{injectCss();obs.observe(document.body,{childList:true,subtree:true});apply()},{once:true});
else{injectCss();obs.observe(document.body,{childList:true,subtree:true});apply()}
})();
