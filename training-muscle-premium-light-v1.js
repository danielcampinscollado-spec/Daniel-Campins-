/* DCC — selector muscular premium light con ilustraciones anatómicas doradas */
(function(){
  'use strict';
  const BUILD='20260917-muscle-premium-light-v1';
  if(window.__dccMusclePremiumLight===BUILD)return;
  window.__dccMusclePremiumLight=BUILD;

  const SPRITE='./assets/muscles/premium-light-sprite.jpg?v=20260917-1';
  const POS={
    'Pectoral':[0,0],'Dorsal':[1,0],'Hombros':[2,0],
    'Trapecio':[0,1],'Bíceps':[1,1],'Tríceps':[2,1],
    'Antebrazos':[0,2],'Core':[1,2],'Cuádriceps':[2,2],
    'Isquiotibiales':[0,3],'Femoral':[0,3],'Glúteos':[1,3],'Gemelos':[2,3]
  };
  const norm=v=>String(v||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const canon=v=>{
    const n=norm(v).toLowerCase();
    if(n==='femoral'||n==='femorales'||n==='isquios'||n==='isquiotibiales')return'Isquiotibiales';
    if(n==='gluteo'||n==='gluteos')return'Glúteos';
    if(n==='biceps')return'Bíceps';
    if(n==='triceps')return'Tríceps';
    if(n==='cuadriceps')return'Cuádriceps';
    return Object.keys(POS).find(k=>norm(k).toLowerCase()===n)||String(v||'');
  };
  function css(){
    if(document.getElementById('dcc-muscle-premium-light-css'))return;
    const s=document.createElement('style');s.id='dcc-muscle-premium-light-css';s.textContent=`
      #coach-main .dcc-muscle-premium-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;margin-top:12px!important}
      #coach-main button.dcc-muscle-premium-card{position:relative!important;min-height:128px!important;padding:9px 8px 10px!important;border:1px solid rgba(183,123,19,.25)!important;border-radius:16px!important;background:linear-gradient(155deg,#fffefa,#fbf5e9)!important;color:#17191d!important;box-shadow:0 8px 20px rgba(83,63,31,.055)!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:6px!important;overflow:hidden!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
      #coach-main button.dcc-muscle-premium-card.is-selected{border-color:#d3a13b!important;background:linear-gradient(145deg,#fff7dc,#f4d77d)!important;box-shadow:0 8px 22px rgba(183,123,19,.15),inset 0 1px 0 #fff!important}
      #coach-main .dcc-muscle-premium-art{width:100px!important;height:68px!important;flex:none!important;background-image:url('${SPRITE}')!important;background-repeat:no-repeat!important;background-size:300px 272px!important;border-radius:10px!important;mix-blend-mode:multiply!important}
      #coach-main .dcc-muscle-premium-name{font-size:12px!important;line-height:1.05!important;font-weight:850!important;letter-spacing:-.15px!important;color:#17191d!important}
      #coach-main .dcc-muscle-premium-check{position:absolute!important;right:8px!important;top:8px!important;width:23px!important;height:23px!important;border:1px solid rgba(183,123,19,.48)!important;border-radius:50%!important;background:#fffdf8!important;color:transparent!important;display:grid!important;place-items:center!important;font-size:13px!important;font-weight:900!important}
      #coach-main button.dcc-muscle-premium-card.is-selected .dcc-muscle-premium-check{background:#d9aa4a!important;color:#171109!important;border-color:#d09a2d!important}
      #coach-main .training-muscle-counter{color:#8e6114!important;font-weight:800!important}
      @media(max-width:390px){#coach-main button.dcc-muscle-premium-card{min-height:120px!important;padding:8px 6px!important}#coach-main .dcc-muscle-premium-art{width:92px!important;height:63px!important;background-size:276px 250px!important}#coach-main .dcc-muscle-premium-name{font-size:11px!important}}
    `;(document.head||document.documentElement).appendChild(s);
  }
  function parse(card){
    const raw=card.getAttribute('onclick')||'';
    const m=raw.match(/toggleTrainingMuscle\('([^']*)',(\d+),'([^']*)'\)/);
    return m?{id:m[1],day:Number(m[2]),group:m[3].replace(/\\'/g,"'")}:null;
  }
  function selected(info){
    const d=window.data?.routines?.[info.id]?.[info.day];
    const arr=Array.isArray(d?.muscleGroups)?d.muscleGroups:Array.isArray(d?.muscles)?d.muscles:[];
    return arr.some(x=>canon(x)===canon(info.group));
  }
  function decorate(){
    css();
    const cards=[...document.querySelectorAll('#coach-main button[onclick*="toggleTrainingMuscle"]')];
    if(!cards.length)return;
    cards[0].parentElement?.classList.add('dcc-muscle-premium-grid');
    cards.forEach(card=>{
      const info=parse(card);if(!info)return;
      const group=canon(info.group),pos=POS[group]||POS[info.group];if(!pos)return;
      card.classList.add('dcc-muscle-premium-card');
      card.classList.toggle('is-selected',selected(info));
      const scale=window.matchMedia('(max-width:390px)').matches?0.92:1;
      const x=-pos[0]*100*scale,y=-pos[1]*68*scale;
      card.innerHTML=`<span class="dcc-muscle-premium-check">✓</span><span class="dcc-muscle-premium-art" style="background-position:${x}px ${y}px!important"></span><span class="dcc-muscle-premium-name">${group}</span>`;
    });
  }
  let raf=0;function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;decorate()})}
  function wrap(){const old=window.toggleTrainingMuscle;if(typeof old==='function'&&!old.__dccPremiumLight){const fn=function(){const r=old.apply(this,arguments);requestAnimationFrame(decorate);return r};fn.__dccPremiumLight=true;fn.__dccOriginal=old;window.toggleTrainingMuscle=fn}}
  function start(){wrap();decorate();const root=document.getElementById('coach-main');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});setInterval(wrap,900)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();