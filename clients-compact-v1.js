/* DCC — clientes compactos v1 */
(function(){
  'use strict';
  if(window.__dccCompactClientsV1)return;
  window.__dccCompactClientsV1=true;

  const STYLE_ID='dcc-compact-clients-v1';
  function appData(){try{return data||{}}catch(_){return window.data||{}}}
  function esc(v){return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
  function num(v){const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null}
  function fmt(v){const n=num(v);return n===null?'—':String(Math.round(n*10)/10).replace('.',',')}
  function latestFat(c){
    const d=appData(),vals=[],push=v=>{const n=num(v);if(n!==null&&n>=2&&n<=70)vals.push(n)};
    ['bodyFat','body_fat','fat','fatPct','fat_pct','grasa','porcentajeGrasa'].forEach(k=>push(c?.[k]));
    const check=d?.checkins?.[c?.id];
    if(check)['bodyFat','body_fat','fat','fatPct','fat_pct','grasa','porcentajeGrasa'].forEach(k=>push(check?.[k]));
    const history=d?.bodyFatHistory?.[c?.id]||d?.body_fat_history?.[c?.id]||[];
    if(Array.isArray(history))history.forEach(x=>push(typeof x==='object'?(x.bodyFat??x.body_fat??x.value??x.fat):x));
    return vals.length?vals[vals.length-1]:null;
  }
  function clientByCard(card){
    const name=String(card?.dataset?.name||'').trim().toLowerCase();
    return (appData()?.clients||[]).find(c=>String(c?.name||'').trim().toLowerCase()===name)||null;
  }
  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #coach-main.dcc-premium-clients .dcc-cl-subtools{margin:12px 2px 10px!important}
      #coach-main.dcc-premium-clients .dcc-cl-tabs{border:0!important;background:transparent!important;overflow:visible!important}
      #coach-main.dcc-premium-clients .dcc-cl-tabs .dcc-cl-tab{display:none!important}
      #coach-main.dcc-premium-clients .dcc-cl-tabs:after{content:attr(data-client-count);display:block;color:#d9aa4a;font-size:10px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase}
      #coach-main.dcc-premium-clients .dcc-cl-list{gap:8px!important}
      #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact{position:relative!important;display:flex!important;align-items:center!important;min-height:78px!important;padding:13px 50px 13px 15px!important;border-radius:16px!important;cursor:pointer!important}
      #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-info{width:100%!important}
      #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-name{font-size:16px!important;line-height:1.15!important}
      #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-goal{margin-top:4px!important;font-size:10.5px!important}
      #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-quick{display:flex;align-items:center;gap:14px;margin-top:7px;color:#a4abb5;font-size:10.5px;font-weight:750}
      #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-quick b{color:#f0c96b;font-weight:800}
      #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-arrow{position:absolute;right:16px;top:50%;transform:translateY(-52%);color:#f0c96b;font-size:28px;font-weight:400;line-height:1}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact{background:linear-gradient(145deg,#fffefa 0%,#f8f0e3 100%)!important;color:#17191d!important;border:1px solid rgba(183,123,19,.28)!important;box-shadow:0 7px 18px rgba(78,58,28,.06),inset 0 1px 0 rgba(255,255,255,.96)!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-name{color:#17191d!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-goal{color:#a86f0f!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-quick{color:#68717c!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-quick b,html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-arrow{color:#b77b13!important}
      #coach-main.dcc-ca.dcc-client-since-moved .dcc-ca-metrics{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      #coach-main.dcc-ca.dcc-client-since-moved .dcc-ca-metrics .dcc-ca-metric:nth-child(3){display:none!important}
      @media(max-width:390px){#coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact{min-height:72px!important;padding:12px 46px 12px 13px!important}#coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-name{font-size:15px!important}#coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-compact .dcc-cl-arrow{right:14px!important}}
    `;document.head.appendChild(s);
  }
  function compactClients(){
    installStyle();
    const main=document.getElementById('coach-main');if(!main?.classList.contains('dcc-premium-clients'))return;
    const clients=appData()?.clients||[],tabs=main.querySelector('.dcc-cl-tabs');
    if(tabs)tabs.dataset.clientCount=`CLIENTES (${clients.length})`;
    main.querySelectorAll('.dcc-cl-card:not(.dcc-cl-compact)').forEach(card=>{
      const c=clientByCard(card);if(!c)return;
      const goal=c.goal||c.objective||c.objetivo||'Objetivo por definir',weight=c.weight??c.peso,fat=latestFat(c);
      card.classList.add('dcc-cl-compact');
      card.innerHTML=`<div class="dcc-cl-info"><div class="dcc-cl-name">${esc(c.name)}</div><div class="dcc-cl-goal">${esc(goal)}</div><div class="dcc-cl-quick"><span>${weight!==undefined&&weight!==null&&weight!==''?`${esc(fmt(weight))} kg`:'Peso —'}</span><span><b>${fat!==null?`${esc(fmt(fat))}%`:'— %'}</b> grasa</span></div></div><span class="dcc-cl-arrow" aria-hidden="true">›</span>`;
      card.onclick=()=>{try{openClient(c.id)}catch(_){window.openClient?.(c.id)}};
    });
  }
  function moveClientSince(){
    const main=document.getElementById('coach-main');if(!main?.classList.contains('dcc-ca'))return;
    const metric=[...main.querySelectorAll('.dcc-ca-metric')].find(x=>/miembro desde|cliente desde/i.test(x.querySelector('small')?.textContent||''));
    const general=[...main.querySelectorAll('.dcc-ca-card')].find(x=>/información general/i.test(x.querySelector('h2')?.textContent||''));
    const grid=general?.querySelector('.dcc-ca-grid');
    if(!metric||!grid||grid.querySelector('[data-dcc-client-since]'))return;
    const value=metric.querySelector('b')?.textContent?.trim()||'—',row=document.createElement('div');
    row.className='dcc-ca-info';row.dataset.dccClientSince='1';row.innerHTML=`<span>Cliente desde</span><b>${esc(value)}</b>`;grid.appendChild(row);main.classList.add('dcc-client-since-moved');
  }
  function apply(){compactClients();moveClientSince()}
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  const observer=new MutationObserver(queue),start=()=>{installStyle();observer.observe(document.getElementById('coach-main')||document.body,{childList:true,subtree:true});queue()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('pageshow',queue);
})();
