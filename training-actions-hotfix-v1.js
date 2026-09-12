/* DCC — capa final de estabilidad visual. Actúa sobre el DOM REAL de producción. */
(function(){
  'use strict';
  if(window.__dccRuntimeVisualStabilityV3)return;
  window.__dccRuntimeVisualStabilityV3=true;

  const STYLE_ID='dcc-runtime-visual-stability-v3-css';
  const LABELS={home:'BIENVENIDO',food:'ALIMENTACIÓN',training:'ENTRENAMIENTO',progress:'PROGRESO',checkin:'CHECK-IN SEMANAL',messages:'MENSAJES'};
  let frame=0;
  let renderingTraining=false;

  function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim()}

  function detectScreen(main){
    if(!main)return '';
    if(window.activeWorkout)return 'workout';
    if(main.querySelector('.dch-wrap'))return 'home';
    if(main.querySelector('.dcc-training-stable-v3'))return 'training';
    if(main.classList.contains('dcc-nutrition-premium'))return 'food';
    const t=norm(main.textContent).slice(0,1800);
    if(t.includes('habla con daniel')||t.includes('mensajes'))return 'messages';
    if(t.includes('check-in semanal')||t.includes('checkin semanal'))return 'checkin';
    if(t.includes('progreso')&&(/peso|grasa|fuerza/.test(t)))return 'progress';
    if(t.includes('plan de alimentacion')||t.includes('dia de entrenamiento')&&t.includes('dia de descanso'))return 'food';
    if(t.includes('entrenamiento')&&(t.includes('musculos')||t.includes('ejercicios')))return 'training';
    if(t.includes('bienvenido'))return 'home';
    return '';
  }

  function findExact(main,text){
    const wanted=norm(text);
    const nodes=main.querySelectorAll('div,p,span,small,strong');
    for(const el of nodes){
      if(el.children.length===0&&norm(el.textContent)===wanted)return el;
    }
    return null;
  }

  function ensureKicker(main,screen){
    const label=LABELS[screen];
    if(!label)return;
    let node=findExact(main,label);
    if(!node){
      const h1=main.querySelector('h1');
      if(!h1)return;
      node=document.createElement('div');
      node.textContent=label;
      h1.parentNode?.insertBefore(node,h1);
    }
    node.classList.add('dcc-unified-kicker');
  }

  function ensurePremiumTraining(main,screen){
    if(screen!=='training'||window.activeWorkout||main.querySelector('.dcc-training-stable-v3')||renderingTraining)return;
    if(typeof window.dccRenderTrainingOverview!=='function')return;
    renderingTraining=true;
    try{window.dccRenderTrainingOverview();}catch(e){console.warn('DCC training recovery',e)}
    requestAnimationFrame(()=>{renderingTraining=false;schedule()});
  }

  function installStyles(){
    document.getElementById('dcc-light-premium-final-polish-v1-css')?.remove();
    document.getElementById('dcc-light-premium-final-polish-v2-css')?.remove();
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* Jerarquía común de encabezados cliente */
      html.dcc-theme-light-premium #client-main .dcc-unified-kicker,
      html.dcc-theme-light-premium #client-main .dch-eyebrow,
      html.dcc-theme-light-premium #client-main .client-header .section-eyebrow,
      html.dcc-theme-light-premium #client-main .dct3-eyebrow,
      html.dcc-theme-light-premium #client-main .dcpr6-kicker,
      html.dcc-theme-light-premium #client-main .dcc-cc-kicker,
      html.dcc-theme-light-premium #client-main .dcc-cm-kicker{
        display:block!important;margin:0 0 9px!important;padding:0!important;
        color:#b77b13!important;background:transparent!important;border:0!important;
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;
        font-size:11px!important;font-weight:800!important;line-height:1.15!important;
        letter-spacing:3.15px!important;text-transform:uppercase!important;text-shadow:none!important;
      }
      html.dcc-theme-light-premium #client-main h1,
      html.dcc-theme-light-premium #client-main h2,
      html.dcc-theme-light-premium #client-main h3{color:#17191d!important;text-shadow:none!important}

      /* Inicio: tarjeta próximo entrenamiento */
      html.dcc-theme-light-premium #client-main .dch-next{
        background-image:linear-gradient(90deg,#fffdf8 0%,#f9f0df 34%,rgba(249,240,223,.98) 46%,rgba(249,240,223,.90) 55%,rgba(249,240,223,.52) 65%,rgba(249,240,223,.08) 78%,rgba(0,0,0,0) 86%),url('./assets/next-workout-plate.jpg')!important;
        background-size:100% 100%,auto 138%!important;background-position:center,right center!important;background-repeat:no-repeat!important;
      }
      html.dcc-theme-light-premium #client-main .dch-next-name,
      html.dcc-theme-light-premium #client-main .dch-next-day,
      html.dcc-theme-light-premium #client-main .dch-next-label{position:relative!important;z-index:3!important;max-width:58%!important}

      /* Alimentación real: tipografía normal, sin Georgia ni artificios */
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .meal-card summary,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .meal-card summary *,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .food-row,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .food-row *,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary *{
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;letter-spacing:0!important;
      }
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .meal-card summary b,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary b{font-size:14px!important;font-weight:650!important;line-height:1.2!important}

      /* Portada premium de entrenamiento: siempre sobre la versión legacy */
      html.dcc-theme-light-premium #client-main .dcc-training-stable-v3{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dct3-day{background:linear-gradient(145deg,#fffefa,#f6eddf)!important;color:#69727e!important;border-color:rgba(166,126,59,.23)!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dct3-day.active{background:linear-gradient(145deg,#ffe7a0,#e2aa37)!important;color:#1c160b!important;border-color:#d5a13b!important;box-shadow:0 6px 16px rgba(186,127,21,.18)!important}
      html.dcc-theme-light-premium #client-main .dct3-card{background:linear-gradient(145deg,#fffefa,#f8f1e5)!important;color:#17191d!important;border-color:rgba(190,132,31,.32)!important;box-shadow:0 9px 25px rgba(83,63,31,.08)!important}
      html.dcc-theme-light-premium #client-main .dct3-tip p{color:#59636f!important}
      html.dcc-theme-light-premium #client-main .dct3-muscles{min-height:104px!important;padding:11px 14px!important;grid-template-columns:minmax(0,1fr) minmax(124px,.72fr)!important;gap:10px!important}
      html.dcc-theme-light-premium #client-main .dct3-muscle{width:58px!important;max-width:58px!important;height:72px!important;flex:0 0 58px!important;background:#f8efe1!important;border-color:rgba(187,126,20,.28)!important}
      html.dcc-theme-light-premium #client-main .dct3-muscle img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;opacity:1!important;visibility:visible!important;filter:none!important}
      html.dcc-theme-light-premium #client-main .dct3-routine{
        position:relative!important;overflow:hidden!important;min-height:146px!important;padding:15px!important;border:1px solid rgba(193,132,28,.62)!important;border-radius:22px!important;
        background-image:linear-gradient(90deg,#fffdf8 0%,#f9f0df 31%,rgba(249,240,223,.96) 44%,rgba(249,240,223,.69) 55%,rgba(249,240,223,.20) 67%,rgba(0,0,0,0) 77%),url('./assets/next-workout-plate.jpg')!important;
        background-size:100% 100%,auto 150%!important;background-position:center,right center!important;background-repeat:no-repeat!important;box-shadow:0 16px 36px rgba(73,52,20,.14)!important;
      }
      html.dcc-theme-light-premium #client-main .dct3-routine>*{position:relative!important;z-index:2!important}
      html.dcc-theme-light-premium #client-main .dct3-routine h3,
      html.dcc-theme-light-premium #client-main .dct3-routine .dct3-meta{max-width:58%!important}
      html.dcc-theme-light-premium #client-main .dct3-routine h3{font-size:20px!important;font-weight:650!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dct3-meta{color:#66707c!important}
      html.dcc-theme-light-premium #client-main .dct3-start{background:linear-gradient(135deg,#f8d97f,#e3ac39 64%,#f2c75e)!important;color:#171109!important;border-color:#e2ad3e!important;box-shadow:0 9px 22px rgba(186,127,21,.20)!important}
      html.dcc-theme-light-premium #client-main .dct3-view{background:rgba(255,251,242,.97)!important;color:#6e4910!important;border-color:rgba(173,117,19,.35)!important}
      html.dcc-theme-light-premium #client-main .dct3-exercise{background:rgba(255,253,248,.94)!important;color:#17191d!important;border-color:rgba(166,126,59,.18)!important}

      /* Sesión activa LEGACY: la interfaz real que todavía genera index.html */
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"]{color:#17191d!important;background:#f5efe4!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"]>.top{
        padding:15px!important;margin-bottom:12px!important;border:1px solid rgba(193,132,28,.52)!important;border-radius:22px!important;
        background:radial-gradient(circle at 92% 0,rgba(221,168,59,.10),transparent 34%),linear-gradient(145deg,#fffefa,#fbf5e9)!important;
        box-shadow:0 14px 34px rgba(73,52,20,.10)!important;
      }
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"]>.top *,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .card h1,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .card h2,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .card h3,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .card b{color:#17191d!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .muted{color:#66707c!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .card,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] details.card{
        background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.34)!important;box-shadow:0 10px 28px rgba(83,63,31,.08)!important;
      }
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] [style*="background:linear-gradient(145deg,#11151c"],
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] [style*="background:#101"],
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] [style*="background: #101"]{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] input{background:#fffefa!important;color:#17191d!important;border-color:rgba(166,126,59,.28)!important}

      /* Mensajes legacy: corrige colores inline oscuros que ganaban al tema */
      html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="color:#f5f5f2"],
      html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="color: #f5f5f2"],
      html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="color:#fff"]{color:#17191d!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="color:#858"],
      html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="color: #858"]{color:#657080!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="background:#101"],
      html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="background: #101"],
      html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="background:#111"]{background:#fffefa!important;color:#17191d!important}

      /* Check-in y progreso legacy */
      html.dcc-theme-light-premium #client-main[data-dcc-screen="checkin"] .card,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="progress"] .card{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.34)!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="checkin"] .checkin-option{border-color:rgba(166,126,59,.22)!important}

      /* Menú inferior: gana a las múltiples reglas legacy con !important */
      html.dcc-theme-light-premium body #client-nav,
      html.dcc-theme-light-premium body #coach-nav{background:linear-gradient(145deg,#28251f,#151513 58%,#222019)!important;border:1px solid rgba(231,181,73,.78)!important;box-shadow:0 12px 34px rgba(68,49,18,.26),0 0 0 1px rgba(255,211,108,.10)!important}
      html.dcc-theme-light-premium body #client-nav button,
      html.dcc-theme-light-premium body #coach-nav button{color:#e8b94f!important;background:transparent!important;border:1px solid transparent!important;box-shadow:none!important;filter:none!important}
      html.dcc-theme-light-premium body #client-nav button.active,
      html.dcc-theme-light-premium body #coach-nav button.active{color:#1d1608!important;background:linear-gradient(145deg,#ffe8a4,#e6af3d 72%,#c88920)!important;border-color:#ffe39a!important;box-shadow:0 0 0 2px rgba(177,119,18,.42),0 0 18px rgba(237,187,72,.52),0 8px 20px rgba(0,0,0,.24)!important;transform:translateY(-1px)!important}
      html.dcc-theme-light-premium body #client-nav button.active *,
      html.dcc-theme-light-premium body #coach-nav button.active *{color:#1d1608!important;stroke:currentColor!important;filter:none!important}

      @media(max-width:430px){
        html.dcc-theme-light-premium #client-main .dct3-muscles{min-height:98px!important;padding:10px 12px!important;grid-template-columns:minmax(0,1fr) 122px!important}
        html.dcc-theme-light-premium #client-main .dct3-muscle{width:55px!important;max-width:55px!important;height:68px!important;flex-basis:55px!important}
        html.dcc-theme-light-premium #client-main .dct3-routine{min-height:138px!important;padding:14px!important;background-size:100% 100%,auto 145%!important}
        html.dcc-theme-light-premium #client-main .dct3-routine h3,
        html.dcc-theme-light-premium #client-main .dct3-routine .dct3-meta{max-width:54%!important}
      }
    `;
    document.head.appendChild(s);
  }

  function refine(){
    installStyles();
    const main=document.getElementById('client-main');
    if(main){
      const screen=detectScreen(main);
      if(screen){
        main.dataset.dccScreen=screen;
        document.body.classList.toggle('dcc-workout-mode',screen==='workout');
        ensureKicker(main,screen);
        ensurePremiumTraining(main,screen);
      }
    }
    const style=document.getElementById(STYLE_ID);
    if(style&&style!==document.head.lastElementChild)document.head.appendChild(style);
  }

  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(refine)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  window.addEventListener('dcc:themechange',schedule);
  window.addEventListener('hashchange',schedule);
  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','open']});
})();