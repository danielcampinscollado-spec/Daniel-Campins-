/* DCC — Alimentación cliente premium v2 */
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
         ALIMENTACIÓN CLIENTE — PREMIUM COMPACTO Y COHERENTE
      ====================================================== */
      #client-main:has(.diet-switch) .client-header{
        margin:2px 2px 14px!important;
      }
      #client-main:has(.diet-switch) .client-header .section-eyebrow{
        display:block!important;
        color:#e9b74d!important;
        font-size:11px!important;
        font-weight:850!important;
        letter-spacing:3px!important;
        line-height:1.2!important;
        text-transform:uppercase!important;
      }
      #client-main:has(.diet-switch) .client-header .muted{
        display:inline-flex!important;
        align-items:center!important;
        gap:7px!important;
        width:auto!important;
        margin:10px 0 0!important;
        padding:7px 10px!important;
        border:1px solid rgba(232,178,68,.24)!important;
        border-radius:999px!important;
        background:linear-gradient(145deg,rgba(232,178,68,.08),rgba(232,178,68,.02))!important;
        color:#aab3bd!important;
        font-size:10px!important;
        font-weight:650!important;
        line-height:1!important;
        letter-spacing:.15px!important;
      }
      #client-main:has(.diet-switch) .client-header .muted::before{
        content:'';
        width:6px;
        height:6px;
        flex:none;
        border-radius:50%;
        background:#e8b44c;
        box-shadow:0 0 10px rgba(232,180,76,.46);
      }

      #client-main .diet-switch{
        display:grid!important;
        grid-template-columns:1fr 1fr!important;
        gap:5px!important;
        margin:0 0 14px!important;
        padding:4px!important;
        border:1px solid #26313c!important;
        border-radius:18px!important;
        background:linear-gradient(145deg,#0d141b,#080d12)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 12px 28px rgba(0,0,0,.18)!important;
      }
      #client-main .diet-switch button{
        min-height:43px!important;
        margin:0!important;
        padding:8px 10px!important;
        border:1px solid transparent!important;
        border-radius:14px!important;
        background:transparent!important;
        color:#8f99a5!important;
        font-size:11px!important;
        font-weight:780!important;
        letter-spacing:.05px!important;
        box-shadow:none!important;
      }
      #client-main .diet-switch button.active{
        border-color:rgba(232,178,68,.70)!important;
        background:radial-gradient(circle at 50% 0,rgba(242,194,91,.19),transparent 80%),linear-gradient(145deg,#282216,#15120c)!important;
        color:#f0c45f!important;
        box-shadow:0 0 20px rgba(226,171,62,.12),inset 0 1px 0 rgba(255,255,255,.04)!important;
      }

      #client-main .diet-pdf-card{
        position:relative!important;
        display:grid!important;
        grid-template-columns:42px minmax(0,1fr) auto!important;
        align-items:center!important;
        gap:11px!important;
        min-height:78px!important;
        margin:0 0 14px!important;
        padding:11px 12px!important;
        overflow:hidden!important;
        border:1px solid rgba(232,178,68,.58)!important;
        border-radius:19px!important;
        background:radial-gradient(circle at 100% 0,rgba(232,178,68,.10),transparent 40%),linear-gradient(145deg,#121922,#080e14)!important;
        box-shadow:0 15px 34px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.035)!important;
      }
      #client-main .diet-pdf-card::after{
        content:'';
        position:absolute;
        left:0;
        right:0;
        top:0;
        height:1px;
        background:linear-gradient(90deg,transparent,rgba(241,193,88,.52),transparent);
        pointer-events:none;
      }
      #client-main .diet-pdf-icon{
        width:38px!important;
        height:38px!important;
        max-width:38px!important;
        max-height:38px!important;
        flex:none!important;
        display:grid!important;
        place-items:center!important;
        border:1px solid rgba(232,178,68,.35)!important;
        border-radius:11px!important;
        background:rgba(232,178,68,.075)!important;
        color:#f0c35c!important;
      }
      #client-main .diet-pdf-icon svg{
        width:20px!important;
        height:20px!important;
        max-width:20px!important;
        max-height:20px!important;
        stroke-width:1.65!important;
      }
      #client-main .diet-pdf-text strong{
        color:#f5f4ef!important;
        font-size:13px!important;
        font-weight:780!important;
        line-height:1.15!important;
        letter-spacing:-.1px!important;
      }
      #client-main .diet-pdf-text span{
        margin-top:4px!important;
        color:#8994a0!important;
        font-size:9px!important;
        line-height:1.2!important;
      }
      #client-main .diet-pdf-button{
        min-height:38px!important;
        padding:8px 11px!important;
        border:1px solid rgba(232,178,68,.56)!important;
        border-radius:12px!important;
        background:linear-gradient(145deg,rgba(232,178,68,.09),rgba(232,178,68,.025))!important;
        color:#f0c35c!important;
        gap:6px!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;
      }
      #client-main .diet-pdf-button svg{width:14px!important;height:14px!important;max-width:14px!important;max-height:14px!important}
      #client-main .diet-pdf-button span{font-size:8.5px!important;font-weight:820!important;letter-spacing:.8px!important}

      #client-main .diet-list{
        display:grid!important;
        gap:9px!important;
      }
      #client-main .meal-card{
        position:relative!important;
        margin:0!important;
        overflow:hidden!important;
        border:1px solid rgba(232,178,68,.34)!important;
        border-radius:18px!important;
        background:radial-gradient(circle at 100% 0,rgba(232,178,68,.075),transparent 38%),linear-gradient(145deg,#121922,#090f15)!important;
        box-shadow:0 11px 26px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.025)!important;
        transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease!important;
      }
      #client-main .meal-card[open]{
        border-color:rgba(232,178,68,.72)!important;
        box-shadow:0 14px 32px rgba(0,0,0,.25),0 0 22px rgba(232,178,68,.06),inset 0 1px 0 rgba(255,255,255,.03)!important;
      }
      #client-main .meal-card summary{
        position:relative!important;
        min-height:70px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:space-between!important;
        gap:12px!important;
        padding:10px 14px!important;
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
      #client-main .meal-card summary b{
        min-width:0!important;
        display:flex!important;
        align-items:center!important;
        gap:12px!important;
        color:#f5f4ef!important;
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Segoe UI",Arial,sans-serif!important;
        font-size:15px!important;
        font-weight:760!important;
        line-height:1.15!important;
        letter-spacing:-.15px!important;
      }
      #client-main .meal-card summary b::before{
        width:38px!important;
        height:38px!important;
        flex:0 0 38px!important;
        display:block!important;
        border:1px solid rgba(232,178,68,.33)!important;
        border-radius:11px!important;
        background-color:rgba(232,178,68,.07)!important;
        background-size:21px 21px!important;
        background-position:center!important;
        background-repeat:no-repeat!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;
      }
      #client-main .meal-arrow{
        position:relative!important;
        width:28px!important;
        height:28px!important;
        flex:0 0 28px!important;
        display:block!important;
        border:1px solid #2a3540!important;
        border-radius:9px!important;
        background:#091017!important;
        color:transparent!important;
        font-size:0!important;
      }
      #client-main .meal-arrow::after{
        content:'';
        position:absolute;
        left:50%;
        top:50%;
        width:6px;
        height:6px;
        border-right:1.7px solid #d8b25d;
        border-bottom:1.7px solid #d8b25d;
        transform:translate(-62%,-50%) rotate(-45deg);
        transition:transform .18s ease;
      }
      #client-main .meal-card[open] .meal-arrow::after{
        transform:translate(-50%,-62%) rotate(45deg);
      }

      #client-main .meal-content{
        padding:10px 13px 13px!important;
        border-top:1px solid rgba(232,178,68,.13)!important;
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
        font-size:9px!important;
        font-weight:750!important;
        box-shadow:none!important;
      }
      #client-main .diet-option.active{
        border-color:rgba(232,178,68,.65)!important;
        background:rgba(232,178,68,.10)!important;
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
        border-bottom:1px solid rgba(255,255,255,.065)!important;
        color:#d7dce2!important;
        font-size:11px!important;
      }
      #client-main .food-row:last-child{border-bottom:0!important}
      #client-main .food-row b{
        flex:none!important;
        padding:5px 8px!important;
        border:1px solid rgba(232,178,68,.28)!important;
        border-radius:999px!important;
        background:rgba(232,178,68,.055)!important;
        color:#e8bd5c!important;
        font-size:9px!important;
        font-weight:780!important;
      }

      @media(max-width:430px){
        #client-main:has(.diet-switch) .client-header{margin-bottom:12px!important}
        #client-main .diet-switch{margin-bottom:12px!important}
        #client-main .diet-pdf-card{grid-template-columns:38px minmax(0,1fr) auto!important;min-height:72px!important;padding:9px 10px!important;gap:9px!important;margin-bottom:12px!important}
        #client-main .diet-pdf-icon{width:34px!important;height:34px!important;max-width:34px!important;max-height:34px!important;border-radius:10px!important}
        #client-main .diet-pdf-text strong{font-size:12.5px!important}
        #client-main .diet-pdf-button{min-height:35px!important;padding:7px 9px!important}
        #client-main .meal-card summary{min-height:64px!important;padding:9px 11px!important}
        #client-main .meal-card summary b{font-size:14px!important;gap:10px!important}
        #client-main .meal-card summary b::before{width:34px!important;height:34px!important;flex-basis:34px!important;background-size:19px 19px!important;border-radius:10px!important}
        #client-main .meal-arrow{width:26px!important;height:26px!important;flex-basis:26px!important}
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