/* DCC — Light Premium V6: tema cliente completo + barra premium estable. Solo presentación. */
(function(){
  'use strict';
  if(window.__dccThemePremiumPolishV6)return;
  window.__dccThemePremiumPolishV6=true;

  const STYLE_ID='dcc-theme-premium-polish-v6-css';

  function installStyles(){
    ['dcc-theme-premium-polish-v3-css','dcc-theme-premium-polish-v4-css','dcc-theme-premium-polish-v5-css'].forEach(id=>document.getElementById(id)?.remove());
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      @keyframes dcc-nav-selected-pulse-v6{
        0%,100%{box-shadow:0 0 0 1px rgba(255,224,139,.95),0 0 13px rgba(244,187,58,.48),inset 0 1px 0 rgba(255,255,255,.82),inset 0 0 16px rgba(255,224,139,.24)}
        50%{box-shadow:0 0 0 1px rgba(255,238,176,1),0 0 24px rgba(255,196,62,.82),inset 0 1px 0 rgba(255,255,255,.95),inset 0 0 24px rgba(255,224,139,.38)}
      }

      html.dcc-theme-light-premium body,
      html.dcc-theme-light-premium .app,
      html.dcc-theme-light-premium #client-main,
      html.dcc-theme-light-premium #coach-main{
        background-color:#f5efe4!important;
      }

      /* ================= BARRA PREMIUM ================= */
      html.dcc-theme-light-premium body #client-nav,
      html.dcc-theme-light-premium body #coach-nav{
        box-sizing:border-box!important;
        background:linear-gradient(180deg,#24221c 0%,#12130f 52%,#1d1a14 100%)!important;
        background-color:#161713!important;
        border:1.5px solid #d8a63d!important;
        border-radius:24px!important;
        box-shadow:0 12px 30px rgba(69,47,10,.26),0 0 0 1px rgba(255,221,126,.12),inset 0 1px 0 rgba(255,236,181,.13)!important;
        overflow:hidden!important;
        isolation:isolate!important;
      }
      html.dcc-theme-light-premium body #client-nav::before,
      html.dcc-theme-light-premium body #client-nav::after,
      html.dcc-theme-light-premium body #coach-nav::before,
      html.dcc-theme-light-premium body #coach-nav::after{display:none!important;content:none!important}
      html.dcc-theme-light-premium body #client-nav button,
      html.dcc-theme-light-premium body #coach-nav button{
        box-sizing:border-box!important;background:transparent!important;color:#efbf55!important;border:1px solid transparent!important;border-radius:18px!important;box-shadow:none!important;transform:none!important;text-shadow:none!important
      }
      html.dcc-theme-light-premium body #client-nav button svg,
      html.dcc-theme-light-premium body #coach-nav button svg{color:#efbf55!important;stroke:currentColor!important;filter:drop-shadow(0 0 4px rgba(239,191,85,.20))!important}
      html.dcc-theme-light-premium body #client-nav button span,
      html.dcc-theme-light-premium body #coach-nav button span{color:#efd488!important}
      html.dcc-theme-light-premium body #client-nav button.active,
      html.dcc-theme-light-premium body #coach-nav button.active{
        background:linear-gradient(145deg,#ffeca9 0%,#f3c75f 48%,#daa030 100%)!important;background-color:#efbd52!important;color:#181207!important;border:1px solid #ffe6a0!important;animation:dcc-nav-selected-pulse-v6 1.8s ease-in-out infinite!important
      }
      html.dcc-theme-light-premium body #client-nav button.active svg,
      html.dcc-theme-light-premium body #coach-nav button.active svg,
      html.dcc-theme-light-premium body #client-nav button.active span,
      html.dcc-theme-light-premium body #coach-nav button.active span{color:#181207!important;stroke:currentColor!important;filter:none!important}

      /* ================= INICIO: PRÓXIMO ENTRENAMIENTO ================= */
      html.dcc-theme-light-premium #client-main .dch-next{
        position:relative!important;overflow:hidden!important;isolation:isolate!important;
        background-image:linear-gradient(90deg,#fffdf8 0%,#f9f0df 30%,rgba(249,240,223,.94) 39%,rgba(249,240,223,.62) 49%,rgba(249,240,223,.20) 60%,rgba(0,0,0,0) 70%),url('./assets/next-workout-plate.jpg')!important;
        background-size:100% 100%,auto 150%!important;background-position:center,right center!important;background-repeat:no-repeat,no-repeat!important;
        border:1px solid rgba(193,132,28,.68)!important;box-shadow:0 14px 34px rgba(66,47,20,.14)!important
      }
      html.dcc-theme-light-premium #client-main .dch-next::before{content:''!important;position:absolute!important;z-index:0!important;inset:0 0 0 auto!important;width:46%!important;pointer-events:none!important;background:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.015) 35%,rgba(0,0,0,.07) 100%)!important}
      html.dcc-theme-light-premium #client-main .dch-next .dch-iconbox,
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-label,
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-name,
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-day,
      html.dcc-theme-light-premium #client-main .dch-next .dch-routine-btn{z-index:2!important}

      /* ================= ALIMENTACIÓN ================= */
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium{color:#17191d!important}
      html.dcc-theme-light-premium #client-main:has(.diet-switch) .client-header .muted{
        background:linear-gradient(145deg,#fff9ed,#f6ead3)!important;color:#657080!important;border-color:rgba(187,126,20,.28)!important;box-shadow:0 7px 18px rgba(83,63,31,.07)!important
      }
      html.dcc-theme-light-premium #client-main .diet-switch{
        background:linear-gradient(145deg,#fffefa,#f8f0e3)!important;border-color:rgba(198,139,32,.32)!important;box-shadow:0 10px 25px rgba(83,63,31,.08),inset 0 1px 0 #fff!important
      }
      html.dcc-theme-light-premium #client-main .diet-switch button{color:#68717d!important}
      html.dcc-theme-light-premium #client-main .diet-switch button.active{
        background:linear-gradient(145deg,#ffedb4,#efc35f)!important;color:#21190c!important;border-color:#d8a63d!important;box-shadow:0 6px 17px rgba(186,127,21,.18),inset 0 1px 0 rgba(255,255,255,.6)!important
      }
      html.dcc-theme-light-premium #client-main .diet-pdf-card{
        background:linear-gradient(145deg,#fffefa,#fbf5e9)!important;border-color:rgba(198,139,32,.40)!important;box-shadow:0 11px 28px rgba(83,63,31,.09),inset 0 1px 0 #fff!important;color:#17191d!important
      }
      html.dcc-theme-light-premium #client-main .diet-pdf-card::before{background:linear-gradient(90deg,transparent,rgba(190,132,31,.34),transparent)!important}
      html.dcc-theme-light-premium #client-main .diet-pdf-card::after{background:radial-gradient(circle,rgba(234,186,82,.10),transparent 69%)!important}
      html.dcc-theme-light-premium #client-main .diet-pdf-icon{background:#fbf0da!important;color:#a56d0e!important;border-color:rgba(187,126,20,.34)!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .diet-pdf-text strong{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .diet-pdf-text span{color:#657080!important}
      html.dcc-theme-light-premium #client-main .diet-pdf-button{background:#fff2d2!important;color:#98640b!important;border-color:rgba(187,126,20,.38)!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .meal-card{
        background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;border-color:rgba(198,139,32,.30)!important;box-shadow:0 10px 24px rgba(83,63,31,.07),inset 0 1px 0 #fff!important
      }
      html.dcc-theme-light-premium #client-main .meal-card[open]{border-color:rgba(198,139,32,.52)!important;box-shadow:0 13px 28px rgba(83,63,31,.10),inset 0 1px 0 #fff!important}
      html.dcc-theme-light-premium #client-main .meal-card::before{background:linear-gradient(90deg,transparent,rgba(190,132,31,.18),transparent)!important}
      html.dcc-theme-light-premium #client-main .meal-card::after{background:radial-gradient(circle,rgba(226,178,73,.08),transparent 70%)!important}
      html.dcc-theme-light-premium #client-main .meal-card summary b,
      html.dcc-theme-light-premium #client-main .meal-card[open] summary b{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .meal-card summary b::before{background-color:#fff5df!important;border-color:rgba(187,126,20,.28)!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .meal-arrow{background:#fff2d2!important;border-color:rgba(187,126,20,.35)!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .meal-arrow::after{border-color:#a56d0e!important}
      html.dcc-theme-light-premium #client-main .meal-content{background:#fffaf1!important;border-top-color:rgba(89,70,36,.10)!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main .meal-content *{color:inherit}

      /* ================= ENTRENAMIENTO ================= */
      html.dcc-theme-light-premium #client-main .dcc-training-stable-v3{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dct3-day{
        background:linear-gradient(145deg,#fffefa,#f8f0e3)!important;color:#616a76!important;border-color:rgba(198,139,32,.26)!important;box-shadow:0 6px 16px rgba(83,63,31,.05)!important
      }
      html.dcc-theme-light-premium #client-main .dct3-day.active{background:linear-gradient(145deg,#ffedb4,#efc35f)!important;color:#21190c!important;border-color:#d8a63d!important;box-shadow:0 7px 18px rgba(186,127,21,.20)!important}
      html.dcc-theme-light-premium #client-main .dct3-card,
      html.dcc-theme-light-premium #client-main .dct3-routine,
      html.dcc-theme-light-premium #client-main .dct3-exercise,
      html.dcc-theme-light-premium #client-main .dct3-empty{
        background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.36)!important;box-shadow:0 11px 28px rgba(83,63,31,.08),inset 0 1px 0 #fff!important
      }
      html.dcc-theme-light-premium #client-main .dct3-title,
      html.dcc-theme-light-premium #client-main .dct3-routine h3,
      html.dcc-theme-light-premium #client-main .dct3-exercise strong{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dct3-tip p,
      html.dcc-theme-light-premium #client-main .dct3-meta,
      html.dcc-theme-light-premium #client-main .dct3-exercise span,
      html.dcc-theme-light-premium #client-main .dct3-empty{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dct3-label,
      html.dcc-theme-light-premium #client-main .dct3-exercise small{color:#ad7412!important}
      html.dcc-theme-light-premium #client-main .dct3-tip-icon{background:#fbf0da!important;color:#ad7412!important;border-color:rgba(187,126,20,.32)!important}
      html.dcc-theme-light-premium #client-main .dct3-muscle{background:#f7efe1!important;border-color:rgba(187,126,20,.26)!important}
      html.dcc-theme-light-premium #client-main .dct3-view{background:#fff9ed!important;color:#7b5310!important;border-color:rgba(185,122,17,.31)!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dct3-start{background:linear-gradient(135deg,#f7d77d,#e3ac39)!important;color:#171109!important;border-color:#e8b64a!important}

      /* ================= PROGRESO ================= */
      html.dcc-theme-light-premium #client-main .dcpr6{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dcpr6-head p{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dcpr6-metric,
      html.dcc-theme-light-premium #client-main .dcpr6-panel,
      html.dcc-theme-light-premium #client-main .dcpr6-force-list{
        background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.36)!important;box-shadow:0 11px 28px rgba(83,63,31,.08),inset 0 1px 0 #fff!important
      }
      html.dcc-theme-light-premium #client-main .dcpr6-metric-title,
      html.dcc-theme-light-premium #client-main .dcpr6-value,
      html.dcc-theme-light-premium #client-main .dcpr6-panel h2,
      html.dcc-theme-light-premium #client-main .dcpr6-force-name,
      html.dcc-theme-light-premium #client-main .dcpr6-constancy-pct{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dcpr6-metric-start,
      html.dcc-theme-light-premium #client-main .dcpr6-sub,
      html.dcc-theme-light-premium #client-main .dcpr6-constancy-copy p,
      html.dcc-theme-light-premium #client-main .dcpr6-force-empty{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dcpr6-icon{background:#fbf0da!important;color:#ad7412!important;border-color:rgba(187,126,20,.31)!important}
      html.dcc-theme-light-premium #client-main .dcpr6-switch{background:linear-gradient(145deg,#fffefa,#f8f0e3)!important;border-color:rgba(198,139,32,.30)!important;box-shadow:0 8px 20px rgba(83,63,31,.06)!important}
      html.dcc-theme-light-premium #client-main .dcpr6-switch button{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dcpr6-switch button.active{background:linear-gradient(145deg,#ffedb4,#efc35f)!important;color:#21190c!important;border-color:#d8a63d!important;box-shadow:0 6px 17px rgba(186,127,21,.18)!important}
      html.dcc-theme-light-premium #client-main .dcpr6-chart-badge{background:#fff2d2!important;color:#98640b!important;border-color:rgba(187,126,20,.35)!important}
      html.dcc-theme-light-premium #client-main .dcpr6-count{background:#fff9ee!important;color:#657080!important;border-color:rgba(166,126,59,.24)!important}
      html.dcc-theme-light-premium #client-main .dcpr6-force-row{border-top-color:rgba(89,70,36,.11)!important}
      html.dcc-theme-light-premium #client-main .dcpr6-best{background:#fff2d2!important;color:#98640b!important;border-color:rgba(187,126,20,.35)!important}
      html.dcc-theme-light-premium #client-main .dcpr6-bar{background:#eee4d5!important;border-color:rgba(166,126,59,.22)!important}
      html.dcc-theme-light-premium #client-main .dcpr6-chip{background:#e9f8f0!important;color:#168052!important;border-color:rgba(37,157,102,.35)!important}
      html.dcc-theme-light-premium #client-main .dcpr6-chip.neutral{background:#f3eee3!important;color:#657080!important;border-color:rgba(120,111,94,.20)!important}
      html.dcc-theme-light-premium #client-main .dcpr6-chart svg text{fill:#6c7580!important}

      /* ================= CHECK-IN ================= */
      html.dcc-theme-light-premium #client-main.dcc-client-checkin-v1{
        background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 60%,#f1e9dc 100%)!important;color:#17191d!important
      }
      html.dcc-theme-light-premium #client-main .dcc-cc-card,
      html.dcc-theme-light-premium #client-main .dcc-cc-data{
        background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.36)!important;box-shadow:0 11px 28px rgba(83,63,31,.08),inset 0 1px 0 #fff!important
      }
      html.dcc-theme-light-premium #client-main .dcc-cc-card-title,
      html.dcc-theme-light-premium #client-main .dcc-cc-row-name,
      html.dcc-theme-light-premium #client-main .dcc-cc-data-value,
      html.dcc-theme-light-premium #client-main .dcc-cc-comment-title{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-sub,
      html.dcc-theme-light-premium #client-main .dcc-cc-hint,
      html.dcc-theme-light-premium #client-main .dcc-cc-data-label,
      html.dcc-theme-light-premium #client-main .dcc-cc-comment-hint,
      html.dcc-theme-light-premium #client-main .dcc-cc-sent{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-card-icon{color:#ad7412!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-data-icon{background:#fbf0da!important;color:#ad7412!important;border-color:rgba(187,126,20,.32)!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-update{background:#fff9ec!important;color:#98640b!important;border-color:#d8a63d!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-options{background:#f7efe1!important;border-color:rgba(166,126,59,.24)!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-option{color:#646d79!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-option.active{background:linear-gradient(145deg,#ffe9a8,#eebd54)!important;color:#1b160d!important;border-color:#d8a63d!important;box-shadow:0 4px 13px rgba(186,127,21,.16)!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-comment{background:#fffefa!important;color:#17191d!important;border-color:rgba(166,126,59,.28)!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-comment::placeholder{color:#89919b!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-send{background:linear-gradient(135deg,#f7d77d,#e3ac39)!important;color:#171109!important;border-color:#e8b64a!important}

      /* ================= MENSAJES ================= */
      html.dcc-theme-light-premium #client-main.dcc-client-messages-v1{
        background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 60%,#f1e9dc 100%)!important;color:#17191d!important
      }
      html.dcc-theme-light-premium #client-main .dcc-cm-person{border-bottom-color:rgba(89,70,36,.15)!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-avatar,
      html.dcc-theme-light-premium #client-main .dcc-cm-mini{background:#fff5df!important;color:#a56d0e!important;border-color:rgba(187,126,20,.40)!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-person h1{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-role,
      html.dcc-theme-light-premium #client-main .dcc-cm-day{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-day::before,
      html.dcc-theme-light-premium #client-main .dcc-cm-day::after{background:rgba(89,70,36,.18)!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-bubble{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(166,126,59,.25)!important;box-shadow:0 7px 18px rgba(83,63,31,.06)!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-row.mine .dcc-cm-bubble{background:linear-gradient(145deg,#fff1c8,#f4d379)!important;color:#171109!important;border-color:#d6a43b!important;box-shadow:0 7px 18px rgba(186,127,21,.14)!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-time{color:#7d858f!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-row.mine .dcc-cm-time{color:#835b10!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-empty{background:#fffefa!important;color:#657080!important;border-color:rgba(166,126,59,.25)!important}
      html.dcc-theme-light-premium body .dcc-cm-composer{background:rgba(255,250,241,.98)!important;border-color:rgba(198,139,32,.38)!important;box-shadow:0 -9px 25px rgba(83,63,31,.14),inset 0 1px 0 #fff!important}
      html.dcc-theme-light-premium body .dcc-cm-input{background:#fffefa!important;color:#17191d!important;border-color:rgba(166,126,59,.28)!important;box-shadow:none!important}
      html.dcc-theme-light-premium body .dcc-cm-input::placeholder{color:#8a929c!important}
      html.dcc-theme-light-premium body .dcc-cm-send{background:linear-gradient(135deg,#f7d77d,#e3ac39)!important;color:#171109!important;border-color:#e8b64a!important}
      html.dcc-theme-light-premium body:has(#client-main.dcc-client-messages-v1) .dcc-theme-trigger{bottom:calc(190px + env(safe-area-inset-bottom))!important}
    `;
    document.head.appendChild(style);
  }

  function forcePremiumNav(){
    const light=document.documentElement.classList.contains('dcc-theme-light-premium');
    ['client-nav','coach-nav'].forEach(id=>{
      const nav=document.getElementById(id);
      if(!nav)return;
      if(!light){
        ['background','background-color','border','border-radius','box-shadow','overflow','isolation'].forEach(p=>nav.style.removeProperty(p));
        nav.querySelectorAll('button').forEach(btn=>{
          ['background','background-color','border','box-shadow','color','animation','transform'].forEach(p=>btn.style.removeProperty(p));
          btn.querySelectorAll('svg,span').forEach(el=>['color','stroke','filter','font-weight'].forEach(p=>el.style.removeProperty(p)));
        });
        return;
      }
      nav.style.setProperty('background','linear-gradient(180deg,#24221c 0%,#12130f 52%,#1d1a14 100%)','important');
      nav.style.setProperty('background-color','#161713','important');
      nav.style.setProperty('border','1.5px solid #d8a63d','important');
      nav.style.setProperty('border-radius','24px','important');
      nav.style.setProperty('box-shadow','0 12px 30px rgba(69,47,10,.26),0 0 0 1px rgba(255,221,126,.12),inset 0 1px 0 rgba(255,236,181,.13)','important');
      nav.style.setProperty('overflow','hidden','important');
      nav.style.setProperty('isolation','isolate','important');
      nav.querySelectorAll('button').forEach(btn=>{
        const active=btn.classList.contains('active');
        btn.style.setProperty('color',active?'#181207':'#efbf55','important');
        btn.style.setProperty('border',active?'1px solid #ffe6a0':'1px solid transparent','important');
        btn.style.setProperty('background',active?'linear-gradient(145deg,#ffeca9 0%,#f3c75f 48%,#daa030 100%)':'transparent','important');
        btn.style.setProperty('background-color',active?'#efbd52':'transparent','important');
        btn.style.setProperty('box-shadow',active?'0 0 0 1px rgba(255,224,139,.95),0 0 18px rgba(244,187,58,.68),inset 0 1px 0 rgba(255,255,255,.86)':'none','important');
        btn.style.setProperty('transform','none','important');
        btn.style.setProperty('animation',active?'dcc-nav-selected-pulse-v6 1.8s ease-in-out infinite':'none','important');
        btn.querySelectorAll('svg').forEach(el=>{el.style.setProperty('color',active?'#181207':'#efbf55','important');el.style.setProperty('stroke','currentColor','important');el.style.setProperty('filter',active?'none':'drop-shadow(0 0 4px rgba(239,191,85,.20))','important')});
        btn.querySelectorAll('span').forEach(el=>{el.style.setProperty('color',active?'#181207':'#efd488','important');if(active)el.style.setProperty('font-weight','700','important');else el.style.removeProperty('font-weight')});
      });
    });
  }

  function forceNextWorkout(){
    const card=document.querySelector('#client-main .dch-next');
    if(!card)return;
    if(!document.documentElement.classList.contains('dcc-theme-light-premium')){
      ['background-image','background-size','background-position','background-repeat'].forEach(p=>card.style.removeProperty(p));
      return;
    }
    card.style.setProperty('background-image',"linear-gradient(90deg,#fffdf8 0%,#f9f0df 30%,rgba(249,240,223,.94) 39%,rgba(249,240,223,.62) 49%,rgba(249,240,223,.20) 60%,rgba(0,0,0,0) 70%),url('./assets/next-workout-plate.jpg')",'important');
    card.style.setProperty('background-size','100% 100%,auto 150%','important');
    card.style.setProperty('background-position','center,right center','important');
    card.style.setProperty('background-repeat','no-repeat,no-repeat','important');
  }

  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;installStyles();forcePremiumNav();forceNextWorkout()});
  }

  installStyles();
  document.addEventListener('DOMContentLoaded',schedule);
  window.addEventListener('dcc:themechange',schedule);
  document.addEventListener('click',e=>{if(e.target.closest('#client-nav button,#coach-nav button'))setTimeout(schedule,0)},true);
  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
  schedule();
})();