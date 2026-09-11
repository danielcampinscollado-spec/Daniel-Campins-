/* DCC — Light Premium final polish: visual only. */
(function(){
  'use strict';
  if(window.__dccLightPremiumFinalPolishV2)return;
  window.__dccLightPremiumFinalPolishV2=true;

  const STYLE_ID='dcc-light-premium-final-polish-v2-css';

  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const muscleAsset=name=>{
    const n=norm(name);
    if(n.includes('pectoral')||n.includes('pecho'))return './assets/muscles/pecho.png';
    if(n.includes('hombro')||n.includes('deltoide'))return './assets/muscles/hombros.png';
    if(n.includes('triceps'))return './assets/muscles/triceps.png';
    if(n.includes('biceps'))return './assets/muscles/biceps.png';
    if(n.includes('espalda')||n.includes('dorsal'))return './assets/muscles/espalda.png';
    if(n.includes('cuadriceps'))return './assets/muscles/cuadriceps.png';
    if(n.includes('femoral')||n.includes('isquio'))return './assets/muscles/isquios.png';
    if(n.includes('glute'))return './assets/muscles/gluteos.png';
    if(n.includes('gemelo')||n.includes('pantorrilla'))return './assets/muscles/gemelos.png';
    if(n.includes('core')||n.includes('abdomen'))return './assets/muscles/core.png';
    return '';
  };

  function install(){
    document.getElementById('dcc-light-premium-final-polish-v1-css')?.remove();
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* ENCABEZADOS PRINCIPALES — misma tipografía, tamaño y color */
      html.dcc-theme-light-premium #client-main .dch-eyebrow,
      html.dcc-theme-light-premium #client-main .client-header .section-eyebrow,
      html.dcc-theme-light-premium #client-main .dct3-eyebrow,
      html.dcc-theme-light-premium #client-main .dcpr6-kicker,
      html.dcc-theme-light-premium #client-main .dcc-cc-kicker,
      html.dcc-theme-light-premium #client-main .dcc-cm-kicker{
        color:#b77b13!important;
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;
        font-size:11px!important;
        font-weight:800!important;
        line-height:1.15!important;
        letter-spacing:3.15px!important;
        text-transform:uppercase!important;
        text-shadow:none!important;
      }

      /* INICIO — próximo entrenamiento: texto siempre legible y separado del disco */
      html.dcc-theme-light-premium #client-main .dch-next{
        background-image:
          linear-gradient(90deg,#fffdf8 0%,#f9f0df 34%,rgba(249,240,223,.98) 46%,rgba(249,240,223,.92) 55%,rgba(249,240,223,.58) 63%,rgba(249,240,223,.10) 76%,rgba(0,0,0,0) 84%),
          url('./assets/next-workout-plate.jpg')!important;
        background-size:100% 100%,auto 138%!important;
        background-position:center,right center!important;
      }
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-name,
      html.dcc-theme-light-premium #client-main .dch-next h1,
      html.dcc-theme-light-premium #client-main .dch-next h2,
      html.dcc-theme-light-premium #client-main .dch-next h3,
      html.dcc-theme-light-premium #client-main .dch-next [class*="title"]{
        position:relative!important;
        z-index:4!important;
        max-width:58%!important;
        color:#17191d!important;
        white-space:normal!important;
        overflow:visible!important;
        text-overflow:clip!important;
      }
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-label,
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-day{position:relative!important;z-index:4!important;max-width:58%!important}

      /* ALIMENTACIÓN — misma tipografía y medida que “Plan de alimentación” */
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary *,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .food-row,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .food-row b{
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;
        letter-spacing:0!important;
      }
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary b{
        font-size:13px!important;
        font-weight:650!important;
        line-height:1.15!important;
      }
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary{
        -webkit-tap-highlight-color:transparent!important;
        -webkit-touch-callout:none!important;
        appearance:none!important;
        -webkit-appearance:none!important;
        outline:none!important;
        animation:none!important;
        transition:none!important;
        transform:none!important;
        background:transparent!important;
      }
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary:active,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary:focus,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary:focus-visible{
        outline:none!important;
        background:transparent!important;
        box-shadow:none!important;
        transform:none!important;
      }
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary::-webkit-details-marker{display:none!important}
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary::marker{display:none!important;content:''!important}
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-arrow,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-arrow:active,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-arrow:focus{
        animation:none!important;
        transition:none!important;
        transform:none!important;
        outline:none!important;
        -webkit-tap-highlight-color:transparent!important;
      }

      /* PORTADA ENTRENAMIENTO — más compacta y con ilustraciones siempre visibles */
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-muscles{
        min-height:104px!important;
        padding:11px 14px!important;
        grid-template-columns:minmax(0,1fr) minmax(124px,.72fr)!important;
        gap:10px!important;
      }
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-visuals{gap:6px!important}
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-muscle{
        width:58px!important;
        max-width:58px!important;
        height:72px!important;
        flex:0 0 58px!important;
        background:#f8efe1!important;
        border-color:rgba(187,126,20,.28)!important;
      }
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-muscle img{
        display:block!important;
        width:100%!important;
        height:100%!important;
        object-fit:contain!important;
        opacity:1!important;
        visibility:visible!important;
        position:relative!important;
        z-index:2!important;
        filter:none!important;
        mix-blend-mode:normal!important;
      }

      /* PORTADA ENTRENAMIENTO — bloque de ejercicios protagonista con discos, pero más compacto */
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        min-height:146px!important;
        padding:15px!important;
        border:1px solid rgba(193,132,28,.62)!important;
        border-radius:22px!important;
        background-image:
          linear-gradient(90deg,#fffdf8 0%,#f9f0df 31%,rgba(249,240,223,.96) 44%,rgba(249,240,223,.70) 55%,rgba(249,240,223,.24) 66%,rgba(0,0,0,0) 76%),
          url('./assets/next-workout-plate.jpg')!important;
        background-size:100% 100%,auto 150%!important;
        background-position:center,right center!important;
        background-repeat:no-repeat,no-repeat!important;
        box-shadow:0 16px 36px rgba(73,52,20,.14),inset 0 1px 0 rgba(255,255,255,.88)!important;
      }
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine::after{
        content:''!important;position:absolute!important;inset:0!important;z-index:0!important;pointer-events:none!important;
        background:linear-gradient(90deg,transparent 0%,transparent 60%,rgba(0,0,0,.05) 100%)!important;
      }
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine>*{position:relative!important;z-index:2!important}
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine .dct3-label{color:#aa7010!important}
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine h3{color:#17191d!important;font-size:20px!important;font-weight:650!important;max-width:58%!important}
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine .dct3-meta{color:#66707c!important;max-width:58%!important}
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-actions{margin-top:14px!important;gap:9px!important}
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-start{
        background:linear-gradient(135deg,#f8d97f,#e3ac39 64%,#f2c75e)!important;color:#171109!important;border-color:#e2ad3e!important;
        box-shadow:0 9px 22px rgba(186,127,21,.20),inset 0 1px 0 rgba(255,255,255,.52)!important
      }
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-view{
        background:rgba(255,251,242,.96)!important;color:#6e4910!important;border-color:rgba(173,117,19,.35)!important;box-shadow:0 5px 14px rgba(83,63,31,.07)!important
      }
      html.dcc-theme-light-premium body:has(#client-main .dcc-training-stable-v3) .dcc-theme-trigger{display:none!important}

      /* ENTRENAMIENTO ACTIVO — cabecera Light Premium limpia y legible */
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top{
        position:relative!important;
        padding:15px!important;
        border:1px solid rgba(193,132,28,.54)!important;
        border-radius:22px!important;
        background:radial-gradient(circle at 92% 0,rgba(221,168,59,.10),transparent 34%),linear-gradient(145deg,#fffefa 0%,#fbf5e9 100%)!important;
        box-shadow:0 15px 34px rgba(73,52,20,.12),inset 0 1px 0 #fff!important;
      }
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-title{color:#17191d!important;text-shadow:none!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-kicker span{color:#a86f0d!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-kicker small{color:#68717d!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-back{background:#fffaf0!important;color:#24211c!important;border-color:rgba(166,126,59,.28)!important;box-shadow:0 5px 14px rgba(83,63,31,.06)!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media{background:linear-gradient(145deg,#f8efe0,#eee3d3)!important;border-color:rgba(187,126,20,.42)!important;box-shadow:0 6px 16px rgba(83,63,31,.08)!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-badge{background:#fffaf0!important;color:#5f6875!important;border-color:rgba(166,126,59,.24)!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-badge.gold{background:#fff0c6!important;color:#8e5d0a!important;border-color:rgba(187,126,20,.46)!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-tech,
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-elapsed{background:#fff9ed!important;border-color:rgba(187,126,20,.40)!important;box-shadow:none!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-tech{color:#17191d!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-tech svg,
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-elapsed{color:#a66d0b!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-elapsed-icon{background:#fbf0da!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-elapsed strong{color:#17191d!important}
      html.dcc-theme-light-premium body.dcc-workout-mode .dcc-theme-trigger{display:none!important}

      @media(max-width:430px){
        html.dcc-theme-light-premium #client-main .dch-next .dch-next-name,
        html.dcc-theme-light-premium #client-main .dch-next h1,
        html.dcc-theme-light-premium #client-main .dch-next h2,
        html.dcc-theme-light-premium #client-main .dch-next h3,
        html.dcc-theme-light-premium #client-main .dch-next [class*="title"]{max-width:55%!important;font-size:15px!important;line-height:1.16!important}
        html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-muscles{min-height:98px!important;padding:10px 12px!important;grid-template-columns:minmax(0,1fr) 122px!important}
        html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-muscle{width:55px!important;max-width:55px!important;height:68px!important;flex-basis:55px!important}
        html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine{min-height:138px!important;padding:14px!important;background-size:100% 100%,auto 145%!important}
        html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine h3,
        html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine .dct3-meta{max-width:54%!important}
        html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top{padding:12px!important;border-radius:19px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function getAppData(){try{return data||{}}catch(_){return window.data||{}}}
  function getClientId(){try{return currentClientId||null}catch(_){return window.currentClientId||null}}

  function fixHomeNextWorkout(){
    const card=document.querySelector('#client-main .dch-next');
    if(!card)return;
    const dayText=card.querySelector('.dch-next-day')?.textContent||'';
    const match=dayText.match(/(\d+)/);
    const dayIndex=Math.max(0,(match?Number(match[1]):1)-1);
    const id=getClientId();
    const routineRaw=getAppData()?.routines?.[id];
    const routine=Array.isArray(routineRaw)?routineRaw:Array.isArray(routineRaw?.routine)?routineRaw.routine:[];
    const day=routine[dayIndex];
    if(!day)return;
    const groups=Array.isArray(day.muscleGroups)&&day.muscleGroups.length
      ? day.muscleGroups.map(x=>String(x||'').trim()).filter(Boolean)
      : String(day.muscle||'').split(/[·+,&/]/).map(x=>x.trim()).filter(Boolean);
    if(!groups.length)return;
    const label=groups.slice(0,3).map(x=>/^pecho$/i.test(x)?'Pectoral':x).join(' · ');
    const target=card.querySelector('.dch-next-name')||Array.from(card.querySelectorAll('h1,h2,h3,[class*="title"]')).find(el=>/Pectoral|Pecho|Hombro|Espalda|Pierna|Glúteo|Bíceps|Tríceps/i.test(el.textContent||''));
    if(target&&target.textContent!==label)target.textContent=label;
  }

  function restoreTrainingImages(){
    const section=document.querySelector('#client-main .dcc-training-stable-v3 .dct3-muscles');
    if(!section)return;
    const names=(section.querySelector('.dct3-title')?.textContent||'').split('·').map(x=>x.trim()).filter(Boolean).slice(0,2);
    const visuals=section.querySelector('.dct3-visuals');
    if(!visuals)return;
    names.forEach((name,index)=>{
      let box=visuals.children[index];
      if(!box){box=document.createElement('div');box.className='dct3-muscle';visuals.appendChild(box);}
      let img=box.querySelector('img');
      if(!img){img=document.createElement('img');img.alt=name;box.appendChild(img);}
      const src=muscleAsset(name);
      if(src&&img.getAttribute('src')!==src)img.setAttribute('src',src);
      img.style.display='block';img.style.opacity='1';img.style.visibility='visible';
      img.onerror=()=>{if(img.dataset.retry!=='1'){img.dataset.retry='1';img.src=src+'?v=2';}};
    });
  }

  function removeMealTapArtifacts(){
    document.querySelectorAll('#client-main.dcc-nutrition-premium .meal-card summary').forEach(summary=>{
      summary.style.webkitTapHighlightColor='transparent';
      summary.style.outline='none';
      summary.style.transform='none';
      summary.style.animation='none';
    });
  }

  function refine(){
    install();
    fixHomeNextWorkout();
    restoreTrainingImages();
    removeMealTapArtifacts();
    const s=document.getElementById(STYLE_ID);
    if(s&&s.parentNode&&s!==document.head.lastElementChild)document.head.appendChild(s);
  }

  let frame=0;
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(refine)}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
  window.addEventListener('dcc:themechange',schedule);
  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','open','src']});
})();
