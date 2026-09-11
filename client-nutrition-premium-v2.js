/* DCC — Alimentación cliente premium v4. Presentación únicamente. */
(function(){
  'use strict';
  if(window.__dccClientNutritionPremiumV4Loaded)return;
  window.__dccClientNutritionPremiumV4Loaded=true;

  const STYLE_ID='dcc-client-nutrition-premium-v4-style';

  function injectStyles(){
    document.getElementById('dcc-client-nutrition-premium-v2-style')?.remove();
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #client-main.dcc-nutrition-premium{position:relative!important;isolation:isolate!important;padding-bottom:34px!important}
      #client-main.dcc-nutrition-premium::before{content:'';position:absolute;z-index:0;pointer-events:none;top:-24px;left:-12px;right:-12px;height:250px;background:radial-gradient(circle at 82% 10%,rgba(240,198,99,.09),transparent 34%),radial-gradient(circle at 13% 38%,rgba(217,170,74,.035),transparent 31%);opacity:.95}
      #client-main.dcc-nutrition-premium>*{position:relative!important;z-index:1}
      #client-main:has(.diet-switch) .client-header{margin:3px 3px 15px!important}
      #client-main:has(.diet-switch) .client-header .section-eyebrow{display:block!important;color:#e9b94f!important;font-size:11px!important;font-weight:800!important;letter-spacing:3.25px!important;line-height:1.15!important;text-transform:uppercase!important}
      #client-main:has(.diet-switch) .client-header .muted{display:inline-flex!important;align-items:center!important;gap:8px!important;width:auto!important;margin:11px 0 0!important;padding:7px 11px!important;border:1px solid rgba(226,176,73,.25)!important;border-radius:999px!important;background:linear-gradient(145deg,rgba(217,170,74,.075),rgba(12,16,21,.40))!important;color:#aab1ba!important;font-size:10px!important;line-height:1!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 8px 24px rgba(0,0,0,.10)!important}
      #client-main:has(.diet-switch) .client-header .muted::before{content:'';width:6px;height:6px;flex:none;border-radius:50%;background:#edbc53;box-shadow:0 0 11px rgba(237,188,83,.48)}

      #client-main .diet-switch{display:grid!important;grid-template-columns:1fr 1fr!important;gap:5px!important;margin:0 0 14px!important;padding:4px!important;border:1px solid rgba(105,119,136,.27)!important;border-radius:19px!important;background:linear-gradient(145deg,#0d141b,#080d12)!important;box-shadow:0 12px 28px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.025)!important}
      #client-main .diet-switch button{min-height:43px!important;margin:0!important;padding:8px 10px!important;border:1px solid transparent!important;border-radius:14px!important;background:transparent!important;color:#929aa5!important;font-size:11px!important;font-weight:650!important;box-shadow:none!important}
      #client-main .diet-switch button.active{border-color:rgba(233,183,77,.62)!important;background:linear-gradient(145deg,#292316,#15120d)!important;color:#f0c45f!important}

      #client-main .diet-pdf-card{position:relative!important;display:grid!important;grid-template-columns:42px minmax(0,1fr) auto!important;align-items:center!important;gap:11px!important;min-height:76px!important;margin:0 0 14px!important;padding:10px 12px!important;overflow:hidden!important;border:1px solid rgba(229,179,76,.43)!important;border-radius:19px!important;background:linear-gradient(145deg,#121922,#080e14 72%)!important;box-shadow:0 15px 34px rgba(0,0,0,.22)!important}
      #client-main .diet-pdf-icon{width:38px!important;height:38px!important;display:grid!important;place-items:center!important;border:1px solid rgba(232,178,68,.34)!important;border-radius:11px!important;background:rgba(232,178,68,.07)!important;color:#f0c35c!important}
      #client-main .diet-pdf-icon svg{width:20px!important;height:20px!important}
      #client-main .diet-pdf-text strong{display:block!important;color:#f2f0eb!important;font-size:13px!important;font-weight:650!important}
      #client-main .diet-pdf-text span{display:block!important;margin-top:4px!important;color:#8f98a3!important;font-size:9px!important}
      #client-main .diet-pdf-button{min-height:38px!important;padding:8px 11px!important;border:1px solid rgba(232,178,68,.47)!important;border-radius:12px!important;background:rgba(232,178,68,.06)!important;color:#f0c35c!important;box-shadow:none!important}

      #client-main .diet-list{display:grid!important;gap:9px!important}
      #client-main .meal-card{position:relative!important;margin:0!important;overflow:hidden!important;border:1px solid rgba(219,171,72,.25)!important;border-radius:18px!important;background:linear-gradient(145deg,#111820 0%,#0a1016 64%,#080d12 100%)!important;box-shadow:0 11px 26px rgba(0,0,0,.18)!important}
      #client-main .meal-card[open]{border-color:rgba(232,178,68,.58)!important}
      #client-main .meal-card summary{position:relative!important;z-index:1!important;min-height:66px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;padding:9px 13px!important;list-style:none!important;background:transparent!important}
      #client-main .meal-card summary::-webkit-details-marker{display:none!important}
      #client-main .meal-card summary b{min-width:0!important;display:flex!important;align-items:center!important;gap:12px!important;color:#f1efe9!important;font-size:15.25px!important;font-weight:600!important;line-height:1.12!important}
      #client-main .meal-card summary b::before{width:38px!important;height:38px!important;flex:0 0 38px!important;display:block!important;border:1px solid rgba(230,180,76,.30)!important;border-radius:12px!important;background-color:rgba(226,177,71,.055)!important;background-size:20px 20px!important;background-position:center!important;background-repeat:no-repeat!important}
      #client-main .meal-arrow{position:relative!important;width:29px!important;height:29px!important;flex:0 0 29px!important;border:1px solid rgba(87,101,116,.40)!important;border-radius:10px!important;background:#0b1118!important;color:transparent!important;font-size:0!important}
      #client-main .meal-arrow::after{content:'';position:absolute;left:50%;top:50%;width:6px;height:6px;border-right:1.6px solid #d8b25d;border-bottom:1.6px solid #d8b25d;transform:translate(-62%,-50%) rotate(-45deg)}
      #client-main .meal-card[open] .meal-arrow::after{transform:translate(-50%,-62%) rotate(45deg)}
      #client-main .meal-content{position:relative!important;z-index:1!important;padding:10px 13px 13px!important;border-top:1px solid rgba(232,178,68,.12)!important;background:transparent!important}
      #client-main .diet-options{display:flex!important;flex-wrap:wrap!important;gap:6px!important;padding:0 0 9px!important}
      #client-main .diet-option{min-height:32px!important;padding:6px 10px!important;border:1px solid #2a3540!important;border-radius:999px!important;background:#091017!important;color:#9aa5b0!important;font-size:9px!important;font-weight:650!important;box-shadow:none!important}
      #client-main .diet-option.active{border-color:rgba(232,178,68,.60)!important;background:rgba(232,178,68,.09)!important;color:#f0c35c!important}
      #client-main .food-row{min-height:44px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;margin:0!important;padding:9px 2px!important;border-bottom:1px solid rgba(255,255,255,.06)!important;color:#d7dce2!important;font-size:11px!important;font-weight:500!important}
      #client-main .food-row:last-child{border-bottom:0!important}
      #client-main .food-row b{flex:none!important;padding:5px 8px!important;border:1px solid rgba(232,178,68,.25)!important;border-radius:999px!important;background:rgba(232,178,68,.05)!important;color:#e8bd5c!important;font-size:9px!important;font-weight:700!important}

      /* LIGHT PREMIUM: contraste real y lectura limpia. */
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium{color:#17191d!important}
      html.dcc-theme-light-premium #client-main:has(.diet-switch) .client-header .muted{background:linear-gradient(145deg,#fff9ed,#f6ead3)!important;color:#626b77!important;border-color:rgba(187,126,20,.30)!important;box-shadow:0 7px 18px rgba(83,63,31,.06)!important}
      html.dcc-theme-light-premium #client-main .diet-switch{background:linear-gradient(145deg,#fffefa,#f8f0e3)!important;border-color:rgba(198,139,32,.32)!important;box-shadow:0 10px 25px rgba(83,63,31,.07),inset 0 1px 0 #fff!important}
      html.dcc-theme-light-premium #client-main .diet-switch button{color:#59626f!important}
      html.dcc-theme-light-premium #client-main .diet-switch button.active{background:linear-gradient(145deg,#ffedb4,#efc35f)!important;color:#21190c!important;border-color:#d8a63d!important;box-shadow:0 6px 17px rgba(186,127,21,.18)!important}
      html.dcc-theme-light-premium #client-main .diet-pdf-card{background:linear-gradient(145deg,#fffefa,#fbf5e9)!important;border-color:rgba(198,139,32,.40)!important;box-shadow:0 11px 28px rgba(83,63,31,.08),inset 0 1px 0 #fff!important}
      html.dcc-theme-light-premium #client-main .diet-pdf-icon{background:#fbf0da!important;color:#a56d0e!important;border-color:rgba(187,126,20,.34)!important}
      html.dcc-theme-light-premium #client-main .diet-pdf-text strong{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .diet-pdf-text span{color:#657080!important}
      html.dcc-theme-light-premium #client-main .diet-pdf-button{background:#fff2d2!important;color:#8b5b08!important;border-color:rgba(187,126,20,.40)!important}
      html.dcc-theme-light-premium #client-main .meal-card{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;border-color:rgba(198,139,32,.32)!important;box-shadow:0 10px 24px rgba(83,63,31,.07),inset 0 1px 0 #fff!important}
      html.dcc-theme-light-premium #client-main .meal-card[open]{border-color:rgba(198,139,32,.54)!important;box-shadow:0 13px 28px rgba(83,63,31,.09),inset 0 1px 0 #fff!important}
      html.dcc-theme-light-premium #client-main .meal-card summary b{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .meal-card summary b::before{background-color:#fff5df!important;border-color:rgba(187,126,20,.29)!important}
      html.dcc-theme-light-premium #client-main .meal-arrow{background:#fff2d2!important;border-color:rgba(187,126,20,.36)!important}
      html.dcc-theme-light-premium #client-main .meal-arrow::after{border-color:#9c660a!important}
      html.dcc-theme-light-premium #client-main .meal-content{background:#fffaf1!important;border-top-color:rgba(89,70,36,.11)!important}
      html.dcc-theme-light-premium #client-main .diet-option{background:#fff9ed!important;border-color:rgba(166,126,59,.25)!important;color:#5f6874!important}
      html.dcc-theme-light-premium #client-main .diet-option.active{background:#fff0c6!important;border-color:#d8a63d!important;color:#7d5007!important}
      html.dcc-theme-light-premium #client-main .food-row{color:#303640!important;border-bottom-color:rgba(89,70,36,.10)!important;font-weight:560!important}
      html.dcc-theme-light-premium #client-main .food-row b{background:#fff2d2!important;border-color:rgba(187,126,20,.33)!important;color:#8a5907!important;font-weight:760!important}
      html.dcc-theme-light-premium body:has(#client-main.dcc-nutrition-premium) .dcc-theme-trigger{display:none!important}

      @media(max-width:430px){
        #client-main .diet-pdf-card{grid-template-columns:38px minmax(0,1fr) auto!important;min-height:70px!important;padding:9px 10px!important;gap:9px!important;margin-bottom:12px!important}
        #client-main .diet-pdf-icon{width:34px!important;height:34px!important;border-radius:10px!important}
        #client-main .meal-card summary{min-height:62px!important;padding:8px 11px!important}
        #client-main .meal-card summary b{font-size:14.5px!important;gap:10px!important}
        #client-main .meal-card summary b::before{width:34px!important;height:34px!important;flex-basis:34px!important;background-size:19px 19px!important;border-radius:10px!important}
        #client-main .meal-arrow{width:27px!important;height:27px!important;flex-basis:27px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function tagNutrition(){
    const main=document.getElementById('client-main');
    if(!main)return;
    main.classList.toggle('dcc-nutrition-premium',!!main.querySelector('.diet-switch'));
  }

  function start(){
    injectStyles();
    const main=document.getElementById('client-main');
    if(!main){setTimeout(start,80);return;}
    if(!main.__dccNutritionV4Observer){
      const observer=new MutationObserver(tagNutrition);
      observer.observe(main,{childList:true,subtree:true});
      main.__dccNutritionV4Observer=observer;
    }
    tagNutrition();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();