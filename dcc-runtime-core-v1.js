/* DCC — runtime canónico cliente. Una sola capa de presentación y coordinación, sin observers globales. */
(function(){
  'use strict';
  if(window.__dccRuntimeCoreV1)return;
  window.__dccRuntimeCoreV1=true;

  const STYLE_ID='dcc-runtime-core-v1-css';
  const LABELS={home:'BIENVENIDO',food:'ALIMENTACIÓN',training:'ENTRENAMIENTO',progress:'PROGRESO',checkin:'CHECK-IN SEMANAL',messages:'MENSAJES'};
  let frame=0;
  let renderingTraining=false;

  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();

  function detectClientScreen(main){
    if(!main)return '';
    if(window.activeWorkout)return 'workout';
    if(main.querySelector('.dch-wrap'))return 'home';
    if(main.querySelector('.dcc-training-stable-v3'))return 'training';
    if(main.classList.contains('dcc-nutrition-premium'))return 'food';
    if(main.querySelector('.dcpr6-wrap,.dcpr6-shell'))return 'progress';
    if(main.querySelector('.dcc-cc-wrap,.dcc-cc-shell'))return 'checkin';
    if(main.querySelector('.dcc-cm-wrap,.dcc-cm-shell'))return 'messages';
    const t=norm(main.textContent).slice(0,1800);
    if(t.includes('habla con daniel'))return 'messages';
    if(t.includes('check-in semanal')||t.includes('checkin semanal'))return 'checkin';
    if(t.includes('progreso')&&(/peso|grasa|fuerza/.test(t)))return 'progress';
    if(t.includes('plan de alimentacion')||(t.includes('dia de entrenamiento')&&t.includes('dia de descanso')))return 'food';
    if(t.includes('entrenamiento')&&(t.includes('musculos')||t.includes('ejercicios')))return 'training';
    if(t.includes('bienvenido'))return 'home';
    return '';
  }

  function installStyles(){
    [
      'dcc-runtime-visual-stability-v3-css','dcc-light-premium-final-polish-v1-css','dcc-light-premium-final-polish-v2-css',
      'dcc-theme-premium-polish-v3-css','dcc-client-training-refinements-v9'
    ].forEach(id=>document.getElementById(id)?.remove());
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      body:not([data-dcc-client-screen="home"]) .dcc-theme-trigger{display:none!important}
      body[data-dcc-client-screen="home"] .dcc-theme-trigger{display:flex!important}
      body[data-dcc-client-screen="workout"] #client-nav{display:none!important}

      html.dcc-theme-light-premium #client-main{background:linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f1e9dc 100%)!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main h1,html.dcc-theme-light-premium #client-main h2,html.dcc-theme-light-premium #client-main h3{color:#17191d!important;text-shadow:none!important}
      html.dcc-theme-light-premium #client-main .muted{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dcc-unified-kicker,
      html.dcc-theme-light-premium #client-main .dch-eyebrow,
      html.dcc-theme-light-premium #client-main .client-header .section-eyebrow,
      html.dcc-theme-light-premium #client-main .dct3-eyebrow,
      html.dcc-theme-light-premium #client-main .dcpr6-kicker,
      html.dcc-theme-light-premium #client-main .dcc-cc-kicker,
      html.dcc-theme-light-premium #client-main .dcc-cm-kicker{
        display:block!important;margin:0 0 9px!important;padding:0!important;background:transparent!important;border:0!important;
        color:#b77b13!important;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;
        font-size:11px!important;font-weight:800!important;line-height:1.15!important;letter-spacing:3.15px!important;text-transform:uppercase!important
      }

      html.dcc-theme-light-premium #client-main .card,
      html.dcc-theme-light-premium #client-main .meal-card,
      html.dcc-theme-light-premium #client-main .dwa3-card,
      html.dcc-theme-light-premium #client-main .dwa3-tip,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="checkin"] .card,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="progress"] .card{
        background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.34)!important;box-shadow:0 10px 28px rgba(83,63,31,.08)!important
      }

      html.dcc-theme-light-premium #client-main .dch-next{
        background-image:linear-gradient(90deg,#fffdf8 0%,#f9f0df 34%,rgba(249,240,223,.98) 46%,rgba(249,240,223,.90) 55%,rgba(249,240,223,.52) 65%,rgba(249,240,223,.08) 78%,rgba(0,0,0,0) 86%),url('./assets/next-workout-plate.jpg')!important;
        background-size:100% 100%,auto 138%!important;background-position:center,right center!important;background-repeat:no-repeat!important
      }
      html.dcc-theme-light-premium #client-main .dch-next-name,html.dcc-theme-light-premium #client-main .dch-next-day,html.dcc-theme-light-premium #client-main .dch-next-label{position:relative!important;z-index:3!important;max-width:58%!important}

      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .meal-card summary,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .meal-card summary *,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .food-row,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .food-row *{
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;letter-spacing:0!important
      }
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .meal-card summary b{font-size:14px!important;font-weight:650!important;line-height:1.2!important}

      #client-main .dct3-days{grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:4px!important;margin-bottom:11px!important}
      #client-main .dct3-day{height:44px!important;min-height:44px!important;padding:0 1px!important;border-radius:11px!important;gap:2px!important}
      #client-main .dct3-day span{font-size:6px!important;line-height:1!important;letter-spacing:.8px!important}
      #client-main .dct3-day b{font-size:14px!important;line-height:1!important}
      #client-main .dct3-actions{display:flex!important;align-items:center!important;justify-content:flex-start!important;flex-wrap:wrap!important;gap:8px!important;margin-top:12px!important}
      #client-main .dct3-start,#client-main .dct3-view{width:auto!important;min-width:0!important;min-height:39px!important;height:39px!important;padding:0 14px!important;border-radius:12px!important;font-size:10.5px!important;font-weight:700!important}

      html.dcc-theme-light-premium #client-main .dct3-day{background:linear-gradient(145deg,#fffefa,#f6eddf)!important;color:#69727e!important;border-color:rgba(166,126,59,.23)!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dct3-day.active{background:linear-gradient(145deg,#ffe7a0,#e2aa37)!important;color:#1c160b!important;border-color:#d5a13b!important;box-shadow:0 6px 16px rgba(186,127,21,.18)!important}
      html.dcc-theme-light-premium #client-main .dct3-card{background:linear-gradient(145deg,#fffefa,#f8f1e5)!important;color:#17191d!important;border-color:rgba(190,132,31,.32)!important;box-shadow:0 9px 25px rgba(83,63,31,.08)!important}
      html.dcc-theme-light-premium #client-main .dct3-tip p{color:#59636f!important}
      html.dcc-theme-light-premium #client-main .dct3-routine{
        position:relative!important;overflow:hidden!important;min-height:138px!important;padding:14px!important;border:1px solid rgba(193,132,28,.62)!important;border-radius:22px!important;
        background-image:linear-gradient(90deg,#fffdf8 0%,#f9f0df 31%,rgba(249,240,223,.96) 44%,rgba(249,240,223,.69) 55%,rgba(249,240,223,.20) 67%,rgba(0,0,0,0) 77%),url('./assets/next-workout-plate.jpg')!important;
        background-size:100% 100%,auto 145%!important;background-position:center,right center!important;background-repeat:no-repeat!important;box-shadow:0 16px 36px rgba(73,52,20,.14)!important
      }
      html.dcc-theme-light-premium #client-main .dct3-routine>*{position:relative!important;z-index:2!important}
      html.dcc-theme-light-premium #client-main .dct3-routine h3,html.dcc-theme-light-premium #client-main .dct3-routine .dct3-meta{max-width:56%!important}
      html.dcc-theme-light-premium #client-main .dct3-start{background:linear-gradient(135deg,#f8d97f,#e3ac39 64%,#f2c75e)!important;color:#171109!important;border-color:#e2ad3e!important}
      html.dcc-theme-light-premium #client-main .dct3-view{background:rgba(255,251,242,.97)!important;color:#6e4910!important;border-color:rgba(173,117,19,.35)!important}

      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"]{color:#17191d!important;background:#f5efe4!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .dwa3{color:#17191d!important;padding-bottom:118px!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .dwa3-top{padding:12px!important;border:1px solid rgba(193,132,28,.52)!important;border-radius:20px!important;background:linear-gradient(145deg,#fffefa,#fbf5e9)!important;box-shadow:0 14px 34px rgba(73,52,20,.10)!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .dwa3-title{color:#17191d!important;text-shadow:none!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .dwa3-badge,html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .dwa3-tech,html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] .dwa3-elapsed{background:#fffaf0!important;color:#5f6875!important;border-color:rgba(166,126,59,.24)!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="workout"] input{background:#fffefa!important;color:#17191d!important;border-color:rgba(166,126,59,.28)!important}

      html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="color:#f5f5f2"],html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="color:#fff"]{color:#17191d!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="background:#101"],html.dcc-theme-light-premium #client-main[data-dcc-screen="messages"] [style*="background:#111"]{background:#fffefa!important;color:#17191d!important}

      html.dcc-theme-light-premium body #client-nav,html.dcc-theme-light-premium body #coach-nav{background:linear-gradient(145deg,#28251f,#151513 58%,#222019)!important;border:1px solid rgba(231,181,73,.78)!important;box-shadow:0 12px 34px rgba(68,49,18,.26),0 0 0 1px rgba(255,211,108,.10)!important}
      html.dcc-theme-light-premium body #client-nav button,html.dcc-theme-light-premium body #coach-nav button{color:#e8b94f!important;background:transparent!important;border:1px solid transparent!important;box-shadow:none!important}
      html.dcc-theme-light-premium body #client-nav button.active,html.dcc-theme-light-premium body #coach-nav button.active{color:#1d1608!important;background:linear-gradient(145deg,#ffe8a4,#e6af3d 72%,#c88920)!important;border-color:#ffe39a!important;box-shadow:0 0 0 2px rgba(177,119,18,.42),0 0 18px rgba(237,187,72,.52),0 8px 20px rgba(0,0,0,.24)!important;transform:translateY(-1px)!important}
      html.dcc-theme-light-premium body #client-nav button.active *,html.dcc-theme-light-premium body #coach-nav button.active *{color:#1d1608!important;stroke:currentColor!important;filter:none!important}
    `;
    document.head.appendChild(s);
  }

  function ensureKicker(main,screen){
    const label=LABELS[screen];
    if(!label)return;
    const wanted=norm(label);
    let node=Array.from(main.querySelectorAll('div,p,span,small,strong')).find(el=>el.children.length===0&&norm(el.textContent)===wanted);
    if(!node){const h1=main.querySelector('h1');if(!h1)return;node=document.createElement('div');node.textContent=label;h1.parentNode?.insertBefore(node,h1)}
    node.classList.add('dcc-unified-kicker');
  }

  function ensureTraining(main,screen){
    if(screen!=='training'||window.activeWorkout||main.querySelector('.dcc-training-stable-v3')||renderingTraining)return;
    if(typeof window.dccRenderTrainingOverview!=='function')return;
    renderingTraining=true;
    try{window.dccRenderTrainingOverview()}catch(e){console.warn('DCC training recovery',e)}
    requestAnimationFrame(()=>{renderingTraining=false;schedule()});
  }

  function sync(){
    installStyles();
    const main=document.getElementById('client-main');
    const screen=detectClientScreen(main);
    document.body.dataset.dccClientScreen=screen||'';
    document.body.classList.toggle('dcc-workout-mode',screen==='workout');
    if(main){main.dataset.dccScreen=screen||'';ensureKicker(main,screen);ensureTraining(main,screen)}
    try{window.dispatchEvent(new CustomEvent('dcc:screen-rendered',{detail:{screen}}))}catch(_){}
  }
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(sync)}

  function wrap(name){
    const current=window[name];
    if(typeof current!=='function'||current.__dccRuntimeCoreWrapped)return;
    const wrapped=function(){const result=current.apply(this,arguments);queueMicrotask(schedule);return result};
    wrapped.__dccRuntimeCoreWrapped=true;wrapped.__base=current;window[name]=wrapped;
  }

  installStyles();wrap('showClient');wrap('showCoach');
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{wrap('showClient');wrap('showCoach');schedule()},{once:true});else schedule();
  window.addEventListener('dcc:themechange',schedule);
  window.addEventListener('dcc:runtime-bridge-ready',()=>{wrap('showClient');wrap('showCoach');schedule()});
  document.addEventListener('click',()=>setTimeout(schedule,0),true);
})();