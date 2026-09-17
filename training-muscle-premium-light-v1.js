/* DCC — selector muscular premium light: anatomía hombre/mujer + ilustraciones compactas */
(function(){
  'use strict';
  const BUILD='20260917-muscle-premium-light-v2-anatomy-mobile';
  if(window.__dccMusclePremiumLight===BUILD)return;
  window.__dccMusclePremiumLight=BUILD;

  const MALE_SPRITE='./assets/muscles/premium-light-sprite.jpg?v=20260917-1';
  const FEMALE_SPRITE='./assets/muscles/premium-light-female.svg?v=20260917-1';
  const STORE='dcc-training-anatomy-v1';

  const MALE_POS={
    'Pectoral':[0,0],'Dorsal':[1,0],'Hombros':[2,0],
    'Trapecio':[0,1],'Bíceps':[1,1],'Tríceps':[2,1],
    'Antebrazos':[0,2],'Core':[1,2],'Cuádriceps':[2,2],
    'Isquiotibiales':[0,3],'Femoral':[0,3],'Glúteos':[1,3],'Gemelos':[2,3]
  };
  const FEMALE_POS={
    'Pectoral':[0,0],'Dorsal':[1,0],'Hombros':[2,0],'Trapecio':[3,0],
    'Bíceps':[0,1],'Tríceps':[1,1],'Antebrazos':[2,1],'Core':[3,1],
    'Cuádriceps':[0,2],'Isquiotibiales':[1,2],'Femoral':[1,2],'Glúteos':[2,2],'Gemelos':[3,2]
  };
  const norm=v=>String(v||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const canon=v=>{
    const n=norm(v).toLowerCase();
    if(n==='femoral'||n==='femorales'||n==='isquios'||n==='isquiotibiales')return'Isquiotibiales';
    if(n==='gluteo'||n==='gluteos')return'Glúteos';
    if(n==='biceps')return'Bíceps';
    if(n==='triceps')return'Tríceps';
    if(n==='cuadriceps')return'Cuádriceps';
    return Object.keys(MALE_POS).find(k=>norm(k).toLowerCase()===n)||String(v||'');
  };
  const getAnatomy=()=>{try{return sessionStorage.getItem(STORE)||''}catch(_){return''}};
  const setAnatomy=value=>{try{sessionStorage.setItem(STORE,value)}catch(_){}};

  function css(){
    if(document.getElementById('dcc-muscle-premium-light-css-v2'))return;
    document.getElementById('dcc-muscle-premium-light-css')?.remove();
    const s=document.createElement('style');s.id='dcc-muscle-premium-light-css-v2';s.textContent=`
      #coach-main .dcc-muscle-anatomy{margin:10px 0 12px;padding:11px;border:1px solid rgba(183,123,19,.23);border-radius:16px;background:linear-gradient(155deg,#fffefa,#fbf5e9);box-shadow:0 7px 18px rgba(83,63,31,.045)}
      #coach-main .dcc-muscle-anatomy-title{font-size:13px;font-weight:900;color:#17191d;line-height:1.15}
      #coach-main .dcc-muscle-anatomy-sub{margin-top:3px;font-size:9px;color:#777f89;line-height:1.3}
      #coach-main .dcc-muscle-anatomy-options{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}
      #coach-main .dcc-muscle-anatomy-option{position:relative;min-width:0;height:74px;padding:5px 7px;border:1px solid rgba(183,123,19,.24);border-radius:13px;background:#fffdf8;color:#17191d;display:grid;grid-template-columns:62px minmax(0,1fr);align-items:center;gap:5px;text-align:left;overflow:hidden}
      #coach-main .dcc-muscle-anatomy-option.on{border-color:#cf982d;background:linear-gradient(145deg,#fff8e4,#f8e5aa);box-shadow:0 6px 16px rgba(183,123,19,.12)}
      #coach-main .dcc-muscle-anatomy-preview{width:62px;height:58px;border-radius:9px;background-repeat:no-repeat;mix-blend-mode:multiply;filter:grayscale(1) saturate(0)}
      #coach-main .dcc-muscle-anatomy-preview.male{background-image:url('${MALE_SPRITE}');background-size:186px 232px;background-position:0 0}
      #coach-main .dcc-muscle-anatomy-preview.female{background-image:url('${FEMALE_SPRITE}');background-size:248px 186px;background-position:0 0}
      #coach-main .dcc-muscle-anatomy-option b{display:block;font-size:11px;line-height:1.05}
      #coach-main .dcc-muscle-anatomy-option small{display:block;margin-top:3px;color:#7a818b;font-size:8px;line-height:1.1}
      #coach-main .dcc-muscle-anatomy-dot{position:absolute;right:6px;top:6px;width:18px;height:18px;border:1px solid rgba(183,123,19,.55);border-radius:50%;background:#fffdf8;color:transparent;display:grid;place-items:center;font-size:10px;font-weight:900}
      #coach-main .dcc-muscle-anatomy-option.on .dcc-muscle-anatomy-dot{background:#d5a33d;border-color:#ca9225;color:#171109}
      #coach-main .dcc-muscle-anatomy-hint{margin:7px 1px 0;font-size:8px;color:#9a6812;font-weight:750}
      #coach-main .dcc-muscle-premium-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;margin-top:9px!important}
      #coach-main .dcc-muscle-premium-grid.dcc-await-anatomy{display:none!important}
      #coach-main button.dcc-muscle-premium-card{position:relative!important;min-width:0!important;min-height:96px!important;padding:6px 4px 7px!important;border:1px solid rgba(183,123,19,.22)!important;border-radius:13px!important;background:linear-gradient(155deg,#fffefa,#fbf5e9)!important;color:#17191d!important;box-shadow:0 5px 14px rgba(83,63,31,.045)!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px!important;overflow:hidden!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
      #coach-main button.dcc-muscle-premium-card.is-selected{border-color:#d09a31!important;background:linear-gradient(145deg,#fff8e3,#f4d77d)!important;box-shadow:0 6px 16px rgba(183,123,19,.13),inset 0 1px 0 #fff!important}
      #coach-main .dcc-muscle-premium-art{width:64px!important;height:48px!important;flex:none!important;background-repeat:no-repeat!important;border-radius:8px!important;mix-blend-mode:multiply!important}
      #coach-main .dcc-muscle-premium-name{max-width:100%;font-size:9.5px!important;line-height:1.05!important;font-weight:850!important;letter-spacing:-.12px!important;color:#17191d!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
      #coach-main .dcc-muscle-premium-check{position:absolute!important;right:5px!important;top:5px!important;width:19px!important;height:19px!important;border:1px solid rgba(183,123,19,.48)!important;border-radius:50%!important;background:#fffdf8!important;color:transparent!important;display:grid!important;place-items:center!important;font-size:9px!important;font-weight:900!important}
      #coach-main button.dcc-muscle-premium-card.is-selected .dcc-muscle-premium-check{background:#d9aa4a!important;color:#171109!important;border-color:#d09a2d!important}
      #coach-main .training-muscle-counter{color:#8e6114!important;font-weight:850!important}
      @media(max-width:350px){
        #coach-main .dcc-muscle-premium-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        #coach-main button.dcc-muscle-premium-card{min-height:94px!important}
      }
    `;(document.head||document.documentElement).appendChild(s);
  }

  function parse(card){
    const raw=card.getAttribute('onclick')||'';
    const m=raw.match(/toggleTrainingMuscle\('([^']*)',(\d+),'([^']*)'\)/);
    return m?{id:m[1],day:Number(m[2]),group:m[3].replace(/\\'/g,"'")}:null;
  }
  function routineDay(info){
    const r=window.data?.routines?.[info.id];
    const ds=Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[];
    return ds[info.day];
  }
  function selectedList(info){
    const d=routineDay(info);
    const arr=Array.isArray(d?.muscleGroups)?d.muscleGroups:Array.isArray(d?.muscles)?d.muscles:[];
    return arr.map(canon);
  }
  function spriteStyle(group,anatomy){
    const g=canon(group);
    if(anatomy==='female'){
      const pos=FEMALE_POS[g];if(!pos)return'';
      return `background-image:url("${FEMALE_SPRITE}")!important;background-size:256px 192px!important;background-position:${-pos[0]*64}px ${-pos[1]*64}px!important`;
    }
    const pos=MALE_POS[g];if(!pos)return'';
    return `background-image:url("${MALE_SPRITE}")!important;background-size:192px 192px!important;background-position:${-pos[0]*64}px ${-pos[1]*48}px!important`;
  }
  function anatomyHtml(){
    const a=getAnatomy();
    return `<section class="dcc-muscle-anatomy" data-dcc-anatomy="1">
      <div class="dcc-muscle-anatomy-title">¿Qué anatomía quieres utilizar?</div>
      <div class="dcc-muscle-anatomy-sub">La elección solo afecta a las ilustraciones de los músculos.</div>
      <div class="dcc-muscle-anatomy-options">
        <button type="button" class="dcc-muscle-anatomy-option ${a==='male'?'on':''}" data-anatomy="male">
          <span class="dcc-muscle-anatomy-dot">✓</span><span class="dcc-muscle-anatomy-preview male"></span><span><b>Hombre</b><small>Ilustración masculina</small></span>
        </button>
        <button type="button" class="dcc-muscle-anatomy-option ${a==='female'?'on':''}" data-anatomy="female">
          <span class="dcc-muscle-anatomy-dot">✓</span><span class="dcc-muscle-anatomy-preview female"></span><span><b>Mujer</b><small>Ilustración femenina</small></span>
        </button>
      </div>
      ${a?'':'<div class="dcc-muscle-anatomy-hint">Elige una anatomía para ver los grupos musculares.</div>'}
    </section>`;
  }
  function ensureAnatomy(grid){
    let box=grid.previousElementSibling;
    if(!box?.matches?.('[data-dcc-anatomy="1"]')){
      grid.insertAdjacentHTML('beforebegin',anatomyHtml());
      box=grid.previousElementSibling;
    }
    box.querySelectorAll('[data-anatomy]').forEach(btn=>{
      btn.onclick=e=>{
        e.preventDefault();e.stopPropagation();
        setAnatomy(btn.dataset.anatomy);
        box.outerHTML=anatomyHtml();
        decorate();
      };
    });
  }
  function decorate(){
    css();
    const cards=[...document.querySelectorAll('#coach-main button[onclick*="toggleTrainingMuscle"]')];
    if(!cards.length)return;
    const grid=cards[0].parentElement;if(!grid)return;
    grid.classList.add('dcc-muscle-premium-grid');
    ensureAnatomy(grid);
    const anatomy=getAnatomy();
    grid.classList.toggle('dcc-await-anatomy',!anatomy);
    cards.forEach(card=>{
      const info=parse(card);if(!info)return;
      const group=canon(info.group);
      if(!(MALE_POS[group]||FEMALE_POS[group]))return;
      const list=selectedList(info),order=list.indexOf(group)+1;
      card.classList.add('dcc-muscle-premium-card');
      card.classList.toggle('is-selected',order>0);
      card.innerHTML=`<span class="dcc-muscle-premium-check">${order>0?order:''}</span><span class="dcc-muscle-premium-art" style='${spriteStyle(group,anatomy||"male")}'></span><span class="dcc-muscle-premium-name">${group}</span>`;
    });
  }

  let raf=0;function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;decorate()})}
  function wrap(){
    const old=window.toggleTrainingMuscle;
    if(typeof old==='function'&&!old.__dccPremiumLightV2){
      const fn=function(){
        const info={id:String(arguments[0]),day:Number(arguments[1]),group:String(arguments[2]||'')};
        const before=selectedList(info);
        if(!before.includes(canon(info.group))&&before.length>=3){
          if(typeof window.toast==='function')window.toast('Puedes seleccionar hasta 3 grupos musculares');
          return false;
        }
        const r=old.apply(this,arguments);requestAnimationFrame(decorate);return r;
      };
      fn.__dccPremiumLightV2=true;fn.__dccOriginal=old;window.toggleTrainingMuscle=fn;
    }
  }
  function start(){
    wrap();decorate();
    const root=document.getElementById('coach-main');
    if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
    let tries=0;const timer=setInterval(()=>{wrap();decorate();if(++tries>80)clearInterval(timer)},250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();