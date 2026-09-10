/* DCC — Alimentación cliente premium v3 */
(function(){
  'use strict';
  if(window.__dccClientNutritionPremiumV2Loaded) return;
  window.__dccClientNutritionPremiumV2Loaded=true;

  function injectStyles(){
    if(document.getElementById('dcc-client-nutrition-premium-v2-style')) return;

    const s=document.createElement('style');
    s.id='dcc-client-nutrition-premium-v2-style';
    s.textContent=`
      /* =====================================================
         ALIMENTACIÓN CLIENTE — LUXURY / PREMIUM V3
      ====================================================== */
      #client-main.dcc-nutrition-premium{
        position:relative!important;
        isolation:isolate!important;
      }

      #client-main.dcc-nutrition-premium::before{
        content:'';
        position:absolute;
        z-index:0;
        pointer-events:none;
        top:-24px;
        left:-12px;
        right:-12px;
        height:250px;
        background:
          radial-gradient(circle at 82% 10%,rgba(240,198,99,.09),transparent 34%),
          radial-gradient(circle at 13% 38%,rgba(217,170,74,.035),transparent 31%);
        opacity:.95;
      }

      #client-main.dcc-nutrition-premium > *{
        position:relative!important;
        z-index:1;
      }

      #client-main:has(.diet-switch) .client-header{
        margin:3px 3px 15px!important;
      }

      #client-main:has(.diet-switch) .client-header .section-eyebrow{
        display:block!important;
        color:#e9b94f!important;
        font-family:"Avenir Next","SF Pro Text","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
        font-size:11px!important;
        font-weight:800!important;
        letter-spacing:3.25px!important;
        line-height:1.15!important;
        text-transform:uppercase!important;
        text-shadow:0 0 14px rgba(233,185,79,.06)!important;
      }

      #client-main:has(.diet-switch) .client-header .muted{
        display:inline-flex!important;
        align-items:center!important;
        gap:8px!important;
        width:auto!important;
        margin:11px 0 0!important;
        padding:7px 11px!important;
        border:1px solid rgba(226,176,73,.25)!important;
        border-radius:999px!important;
        background:linear-gradient(145deg,rgba(217,170,74,.075),rgba(12,16,21,.40))!important;
        color:#aab1ba!important;
        font-family:"Avenir Next","SF Pro Text","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
        font-size:10px!important;
        font-weight:560!important;
        line-height:1!important;
        letter-spacing:.22px!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 8px 24px rgba(0,0,0,.10)!important;
      }

      #client-main:has(.diet-switch) .client-header .muted::before{
        content:'';
        width:6px;
        height:6px;
        flex:none;
        border-radius:50%;
        background:#edbc53;
        box-shadow:0 0 11px rgba(237,188,83,.48);
      }

      /* Selector entrenamiento / descanso */
      #client-main .diet-switch{
        display:grid!important;
        grid-template-columns:1fr 1fr!important;
        gap:5px!important;
        margin:0 0 14px!important;
        padding:4px!important;
        border:1px solid rgba(105,119,136,.27)!important;
        border-radius:19px!important;
        background:
          radial-gradient(circle at 20% 0,rgba(217,170,74,.035),transparent 38%),
          linear-gradient(145deg,#0d141b,#080d12)!important;
        box-shadow:0 12px 28px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.025)!important;
      }

      #client-main .diet-switch button{
        min-height:43px!important;
        margin:0!important;
        padding:8px 10px!important;
        border:1px solid transparent!important;
        border-radius:14px!important;
        background:transparent!important;
        color:#929aa5!important;
        font-family:"Avenir Next","SF Pro Text","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
        font-size:11px!important;
        font-weight:620!important;
        letter-spacing:.16px!important;
        box-shadow:none!important;
      }

      #client-main .diet-switch button.active{
        border-color:rgba(233,183,77,.62)!important;
        background:
          radial-gradient(circle at 50% 0,rgba(242,194,91,.17),transparent 76%),
          linear-gradient(145deg,#292316,#15120d)!important;
        color:#f0c45f!important;
        box-shadow:0 0 20px rgba(226,171,62,.10),inset 0 1px 0 rgba(255,255,255,.045)!important;
      }

      /* PDF */
      #client-main .diet-pdf-card{
        position:relative!important;
        display:grid!important;
        grid-template-columns:42px minmax(0,1fr) auto!important;
        align-items:center!important;
        gap:11px!important;
        min-height:76px!important;
        margin:0 0 14px!important;
        padding:10px 12px!important;
        overflow:hidden!important;
        border:1px solid rgba(229,179,76,.43)!important;
        border-radius:19px!important;
        background:
          radial-gradient(circle at 88% 4%,rgba(240,198,99,.10),transparent 34%),
          linear-gradient(145deg,#121922,#080e14 72%)!important;
        box-shadow:0 15px 34px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.032),0 0 18px rgba(217,170,74,.025)!important;
      }

      #client-main .diet-pdf-card::before{
        content:'';
        position:absolute;
        pointer-events:none;
        top:0;
        right:10%;
        width:46%;
        height:1px;
        background:linear-gradient(90deg,transparent,rgba(244,203,104,.62),transparent);
      }

      #client-main .diet-pdf-card::after{
        content:'';
        position:absolute;
        pointer-events:none;
        right:-42px;
        top:-54px;
        width:138px;
        height:116px;
        border-radius:50%;
        background:radial-gradient(circle,rgba(234,186,82,.08),transparent 69%);
      }

      #client-main .diet-pdf-icon{
        width:38px!important;
        height:38px!important;
        max-width:38px!important;
        max-height:38px!important;
        flex:none!important;
        display:grid!important;
        place-items:center!important;
        border:1px solid rgba(232,178,68,.34)!important;
        border-radius:11px!important;
        background:linear-gradient(145deg,rgba(232,178,68,.10),rgba(232,178,68,.025))!important;
        color:#f0c35c!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;
      }

      #client-main .diet-pdf-icon svg{
        width:20px!important;
        height:20px!important;
        max-width:20px!important;
        max-height:20px!important;
        stroke-width:1.6!important;
      }

      #client-main .diet-pdf-text strong{
        color:#f2f0eb!important;
        font-family:"Avenir Next","SF Pro Display","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
        font-size:13px!important;
        font-weight:620!important;
        line-height:1.15!important;
        letter-spacing:.05px!important;
      }

      #client-main .diet-pdf-text span{
        margin-top:4px!important;
        color:#8f98a3!important;
        font-family:"Avenir Next","SF Pro Text","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
        font-size:9px!important;
        line-height:1.2!important;
        letter-spacing:.18px!important;
      }

      #client-main .diet-pdf-button{
        min-height:38px!important;
        padding:8px 11px!important;
        border:1px solid rgba(232,178,68,.47)!important;
        border-radius:12px!important;
        background:linear-gradient(145deg,rgba(232,178,68,.09),rgba(232,178,68,.02))!important;
        color:#f0c35c!important;
        gap:6px!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 6px 18px rgba(0,0,0,.12)!important;
      }

      #client-main .diet-pdf-button svg{
        width:14px!important;
        height:14px!important;
        max-width:14px!important;
        max-height:14px!important;
      }

      #client-main .diet-pdf-button span{
        font-family:"Avenir Next","SF Pro Text","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
        font-size:8.2px!important;
        font-weight:760!important;
        letter-spacing:1.15px!important;
      }

      /* Lista de comidas */
      #client-main .diet-list{
        display:grid!important;
        gap:9px!important;
      }

      #client-main .meal-card{
        position:relative!important;
        margin:0!important;
        overflow:hidden!important;
        border:1px solid rgba(219,171,72,.25)!important;
        border-radius:18px!important;
        background:
          radial-gradient(circle at 100% 0,rgba(236,188,84,.055),transparent 34%),
          linear-gradient(145deg,#111820 0%,#0a1016 64%,#080d12 100%)!important;
        box-shadow:0 11px 26px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.024)!important;
        transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease!important;
      }

      #client-main .meal-card::before{
        content:'';
        position:absolute;
        z-index:0;
        pointer-events:none;
        left:45px;
        right:52px;
        top:0;
        height:1px;
        background:linear-gradient(90deg,transparent,rgba(235,190,91,.21),transparent);
      }

      #client-main .meal-card::after{
        content:'';
        position:absolute;
        z-index:0;
        pointer-events:none;
        top:-44px;
        left:-50px;
        width:128px;
        height:112px;
        border-radius:50%;
        background:radial-gradient(circle,rgba(226,178,73,.05),transparent 70%);
      }

      #client-main .meal-card[open]{
        border-color:rgba(232,178,68,.58)!important;
        box-shadow:0 15px 32px rgba(0,0,0,.24),0 0 20px rgba(232,178,68,.045),inset 0 1px 0 rgba(255,255,255,.03)!important;
      }

      #client-main .meal-card summary{
        position:relative!important;
        z-index:1!important;
        min-height:66px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:space-between!important;
        gap:12px!important;
        padding:9px 13px!important;
        list-style:none!important;
        background:transparent!important;
      }

      #client-main .meal-card summary::-webkit-details-marker{display:none!important}

      #client-main .meal-card summary > div{
        min-width:0!important;
        display:flex!important;
        align-items:center!important;
        gap:10px!important;
      }

      /* Tipografía de desayuno/comida/cena: más editorial y menos pesada */
      #client-main .meal-card summary b{
        min-width:0!important;
        display:flex!important;
        align-items:center!important;
        gap:12px!important;
        color:#f1efe9!important;
        font-family:"Avenir Next","SF Pro Display","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
        font-size:15.25px!important;
        font-weight:570!important;
        line-height:1.12!important;
        letter-spacing:.02px!important;
        -webkit-font-smoothing:antialiased!important;
        text-rendering:geometricPrecision!important;
      }

      #client-main .meal-card summary b::before{
        width:38px!important;
        height:38px!important;
        flex:0 0 38px!important;
        display:block!important;
        border:1px solid rgba(230,180,76,.30)!important;
        border-radius:12px!important;
        background-color:rgba(226,177,71,.055)!important;
        background-size:20px 20px!important;
        background-position:center!important;
        background-repeat:no-repeat!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.022),0 0 12px rgba(217,170,74,.018)!important;
      }

      #client-main .meal-card[open] summary b{
        color:#f6f2e8!important;
      }

      #client-main .meal-card[open] summary b::before{
        border-color:rgba(236,185,78,.48)!important;
        background-color:rgba(226,177,71,.085)!important;
      }

      #client-main .meal-arrow{
        position:relative!important;
        z-index:1!important;
        width:29px!important;
        height:29px!important;
        flex:0 0 29px!important;
        display:block!important;
        border:1px solid rgba(87,101,116,.40)!important;
        border-radius:10px!important;
        background:linear-gradient(145deg,#0d141c,#080d12)!important;
        color:transparent!important;
        font-size:0!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.018)!important;
      }

      #client-main .meal-arrow::after{
        content:'';
        position:absolute;
        left:50%;
        top:50%;
        width:6px;
        height:6px;
        border-right:1.6px solid #d8b25d;
        border-bottom:1.6px solid #d8b25d;
        transform:translate(-62%,-50%) rotate(-45deg);
        transition:transform .18s ease;
      }

      #client-main .meal-card[open] .meal-arrow{
        border-color:rgba(226,177,71,.34)!important;
        background:rgba(217,170,74,.035)!important;
      }

      #client-main .meal-card[open] .meal-arrow::after{
        transform:translate(-50%,-62%) rotate(45deg);
      }

      #client-main .meal-content{
        position:relative!important;
        z-index:1!important;
        padding:10px 13px 13px!important;
        border-top:1px solid rgba(232,178,68,.12)!important;
        background:linear-gradient(180deg,rgba(255,255,255,.012),transparent)!important;
      }

      #client-main .diet-options{
        display:flex!important;
        flex-wrap:wrap!important;
        gap:6px!important;
        padding:0 0 9px!important;
      }

      #client-main .diet-option{
        min-height:32px!important;
        padding:6px 10px!important;
        border:1px solid #2a3540!important;
        border-radius:999px!important;
        background:#091017!important;
        color:#9aa5b0!important;
        font-family:"Avenir Next","SF Pro Text","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
        font-size:9px!important;
        font-weight:650!important;
        letter-spacing:.1px!important;
        box-shadow:none!important;
      }

      #client-main .diet-option.active{
        border-color:rgba(232,178,68,.60)!important;
        background:rgba(232,178,68,.09)!important;
        color:#f0c35c!important;
      }

      #client-main .food-row{
        min-height:44px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:space-between!important;
        gap:12px!important;
        margin:0!important;
        padding:9px 2px!important;
        border-bottom:1px solid rgba(255,255,255,.06)!important;
        color:#d7dce2!important;
        font-family:"Avenir Next","SF Pro Text","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
        font-size:11px!important;
        font-weight:480!important;
        letter-spacing:.06px!important;
      }

      #client-main .food-row:last-child{border-bottom:0!important}

      #client-main .food-row b{
        flex:none!important;
        padding:5px 8px!important;
        border:1px solid rgba(232,178,68,.25)!important;
        border-radius:999px!important;
        background:rgba(232,178,68,.05)!important;
        color:#e8bd5c!important;
        font-size:9px!important;
        font-weight:690!important;
      }

      @media(max-width:430px){
        #client-main:has(.diet-switch) .client-header{margin-bottom:13px!important}
        #client-main .diet-switch{margin-bottom:12px!important}
        #client-main .diet-pdf-card{grid-template-columns:38px minmax(0,1fr) auto!important;min-height:70px!important;padding:9px 10px!important;gap:9px!important;margin-bottom:12px!important}
        #client-main .diet-pdf-icon{width:34px!important;height:34px!important;max-width:34px!important;max-height:34px!important;border-radius:10px!important}
        #client-main .diet-pdf-text strong{font-size:12.5px!important}
        #client-main .diet-pdf-button{min-height:35px!important;padding:7px 9px!important}
        #client-main .meal-card summary{min-height:62px!important;padding:8px 11px!important}
        #client-main .meal-card summary b{font-size:14.5px!important;gap:10px!important;font-weight:560!important}
        #client-main .meal-card summary b::before{width:34px!important;height:34px!important;flex-basis:34px!important;background-size:19px 19px!important;border-radius:10px!important}
        #client-main .meal-arrow{width:27px!important;height:27px!important;flex-basis:27px!important}
      }
    `;

    document.head.appendChild(s);
  }

  function tagNutrition(){
    const main=document.getElementById('client-main');
    if(!main) return;
    const diet=main.querySelector('.diet-switch');
    main.classList.toggle('dcc-nutrition-premium',!!diet);
  }

  injectStyles();

  const observer=new MutationObserver(tagNutrition);
  function start(){
    const main=document.getElementById('client-main');
    if(!main){setTimeout(start,100);return;}
    observer.observe(main,{childList:true,subtree:true});
    tagNutrition();
  }

  start();
})();