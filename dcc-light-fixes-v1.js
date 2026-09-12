/* DCC — Theme final polish V8: visual only, sin observers de navegación */
(function(){
'use strict';
if(window.__dccThemeFinalFixV8)return;window.__dccThemeFinalFixV8=true;
['dcc-theme-final-fix-v3','dcc-theme-final-fix-v4','dcc-theme-final-fix-v5','dcc-theme-final-fix-v6','dcc-theme-final-fix-v7'].forEach(id=>document.getElementById(id)?.remove());
const s=document.createElement('style');s.id='dcc-theme-final-fix-v8';s.textContent=`
.dcc-theme-trigger{display:none!important;position:fixed!important;right:14px!important;bottom:92px!important;z-index:9997!important}
body:has(#client-main .dch-wrap) .dcc-theme-trigger{display:flex!important}
body.dcc-workout-mode .dcc-theme-trigger{display:none!important}

html:not(.dcc-theme-light-premium) body #client-main .dch-eyebrow,
html:not(.dcc-theme-light-premium) body #client-main .client-header .section-eyebrow,
html:not(.dcc-theme-light-premium) body #client-main .dct3-eyebrow,
html:not(.dcc-theme-light-premium) body #client-main .dcpr6-kicker,
html:not(.dcc-theme-light-premium) body #client-main .dcc-cc-kicker,
html:not(.dcc-theme-light-premium) body #client-main .dcc-cm-kicker{color:#e0ad4c!important;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;font-size:11px!important;font-weight:800!important;line-height:1.15!important;letter-spacing:3.15px!important;text-transform:uppercase!important;text-shadow:none!important}

html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .meal-card summary,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .meal-card summary *,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .food-row,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .food-row b,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .diet-pdf-text,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .diet-pdf-text *{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;letter-spacing:0!important}
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .meal-card summary b,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .diet-pdf-text strong{font-size:15px!important;font-weight:650!important;line-height:1.15!important;color:#f6f4ef!important}

html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-muscles{min-height:88px!important;padding:10px 13px!important;grid-template-columns:minmax(0,1fr) 154px!important;gap:8px!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-muscles .dct3-title{max-width:100%!important;font-size:17px!important;line-height:1.16!important;color:#f7f5f0!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-routine{position:relative!important;overflow:hidden!important;min-height:138px!important;padding:14px!important;border:1px solid rgba(217,170,74,.68)!important;border-radius:22px!important;background-color:#11151a!important;background-image:linear-gradient(90deg,#171b21 0%,#11151a 31%,rgba(17,21,26,.98) 43%,rgba(17,21,26,.88) 51%,rgba(17,21,26,.62) 58%,rgba(17,21,26,.18) 70%,rgba(0,0,0,0) 78%),url('./assets/next-workout-plate.jpg')!important;background-size:100% 100%,auto 145%!important;background-position:center,right center!important;background-repeat:no-repeat,no-repeat!important;box-shadow:0 14px 34px rgba(0,0,0,.30)!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-routine h3{color:#f7f5f0!important;font-size:20px!important;font-weight:650!important;line-height:1.13!important;max-width:58%!important;margin:0!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-routine .dct3-meta{color:#959eaa!important;font-size:10px!important;max-width:58%!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-start{background:linear-gradient(135deg,#f4cf70,#dca63a)!important;color:#15110a!important;border-color:#f1c967!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-view{background:rgba(13,17,22,.92)!important;color:#e7bd5b!important;border-color:rgba(217,170,74,.42)!important}

html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-top{grid-template-columns:minmax(0,1fr) 112px!important;gap:8px 10px!important;padding:11px 12px!important;border:1px solid rgba(217,170,74,.58)!important;border-radius:20px!important;background:linear-gradient(145deg,#171b21,#0b0f14 72%)!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-media{width:108px!important;height:100px!important;padding:6px!important;border:1px solid rgba(217,170,74,.36)!important;border-radius:15px!important;background:#0d1115!important;display:grid!important;place-items:center!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-media img{width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important;border:0!important;background:transparent!important}
body.dcc-workout-mode #client-main .dwa3-history.first{min-height:58px!important;padding:8px 12px!important;grid-template-columns:34px minmax(0,1fr)!important;gap:9px!important}

/* ===== PANEL ENTRENADOR · LIGHT PREMIUM ===== */
html.dcc-theme-light-premium body #coach,
html.dcc-theme-light-premium body #coach #coach-main,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard,
html.dcc-theme-light-premium body #coach #coach-main.dcc-final-dashboard,
html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients,
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-messages,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-chat,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca{
  --dcc-gold:#b77b13!important;--dcc-gold2:#d7a53f!important;--dcc-border:rgba(190,132,31,.42)!important;--dcc-border-soft:rgba(190,132,31,.26)!important;
  background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f1e9dc 100%)!important;color:#17191d!important
}
html.dcc-theme-light-premium body #coach #coach-main{padding-top:max(18px,env(safe-area-inset-top))!important;padding-bottom:118px!important}
html.dcc-theme-light-premium body #coach #coach-main h1,
html.dcc-theme-light-premium body #coach #coach-main h2,
html.dcc-theme-light-premium body #coach #coach-main h3,
html.dcc-theme-light-premium body #coach #coach-main strong,
html.dcc-theme-light-premium body #coach #coach-main b{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main p,
html.dcc-theme-light-premium body #coach #coach-main .muted,
html.dcc-theme-light-premium body #coach #coach-main [class*="sub"],
html.dcc-theme-light-premium body #coach #coach-main [class*="meta"]{color:#657080!important}

html.dcc-theme-light-premium body #coach #coach-main .dcc-fd-hero,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fd-stats,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fd-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fd-banner,
html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-hero,
html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-stat,
html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-accordion,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-agenda,
html.dcc-theme-light-premium body #coach #coach-main .card,
html.dcc-theme-light-premium body #coach #coach-main .metrics{
  background:linear-gradient(145deg,#fffefa 0%,#fbf6ec 100%)!important;background-color:#fffaf1!important;border:1px solid rgba(198,139,32,.38)!important;box-shadow:0 12px 30px rgba(83,63,31,.08),inset 0 1px 0 rgba(255,255,255,.95)!important;color:#17191d!important
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-agenda{border-radius:20px!important}

html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-search,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-tabs,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-sort,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-tabs,
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-search,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-tabs,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-tabs,
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-composer,
html.dcc-theme-light-premium body #coach #coach-main input,
html.dcc-theme-light-premium body #coach #coach-main textarea,
html.dcc-theme-light-premium body #coach #coach-main select{
  background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(185,122,17,.30)!important;box-shadow:none!important
}
html.dcc-theme-light-premium body #coach #coach-main input::placeholder,
html.dcc-theme-light-premium body #coach #coach-main textarea::placeholder{color:#7a8390!important;-webkit-text-fill-color:#7a8390!important;opacity:1!important}

html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-new,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-new,
html.dcc-theme-light-premium body #coach #coach-main .btn,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-mark,
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-send{
  background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e9bd55!important;box-shadow:0 8px 22px rgba(185,125,20,.18)!important
}
html.dcc-theme-light-premium body #coach #coach-main .ghost,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-back,
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-back,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-move{
  background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.28)!important
}

html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-kicker,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-kicker,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-kicker,
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-kicker,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-kicker,
html.dcc-theme-light-premium body #coach #coach-main [class*="eyebrow"]{
  color:#b77b13!important;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;font-size:11px!important;font-weight:800!important;letter-spacing:3px!important;text-transform:uppercase!important
}

/* Clientes */
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card [class*="name"]{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card [class*="goal"],
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card [class*="weight"]{color:#657080!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card button{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.44)!important}

/* Calendario */
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-head h1{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-tab{color:#68717e!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-tab.active{background:linear-gradient(145deg,#fff2c5,#edc45d)!important;color:#1d1608!important;border-color:#d6a53d!important;box-shadow:0 7px 18px rgba(185,125,20,.18)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-month-head strong{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-week span{color:#7a8390!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day{color:#22262c!important;background:transparent!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day.out{color:#a1a7af!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day.selected{border-color:#d8a63d!important;background:#fff5d8!important;color:#8d5a08!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day.today{background:#17191d!important;color:#fff8e9!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-empty,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-session{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.28)!important}

/* Check-in */
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-tab{color:#68717e!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-tab.active{background:linear-gradient(145deg,#fff2c5,#edc45d)!important;color:#1d1608!important;border-color:#d6a53d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-card{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-card button{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important}

/* Mensajes */
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card [class*="name"]{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card button{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-avatar{background:#fff7e4!important;color:#a46b0b!important;border-color:rgba(185,122,17,.38)!important}

/* Navegación del entrenador: mismo tratamiento premium del cliente */
html.dcc-theme-light-premium body #coach #coach-nav{background:linear-gradient(145deg,#28251f,#151513 58%,#222019)!important;border:1px solid rgba(231,181,73,.78)!important;box-shadow:0 12px 34px rgba(68,49,18,.26),0 0 0 1px rgba(255,211,108,.10),inset 0 1px 0 rgba(255,230,157,.10)!important}
html.dcc-theme-light-premium body #coach #coach-nav button{color:#e8b94f!important;background:transparent!important;border-color:transparent!important}
html.dcc-theme-light-premium body #coach #coach-nav button.active{color:#1d1608!important;background:linear-gradient(145deg,#ffe8a4 0%,#e6af3d 72%,#c88920 100%)!important;border-color:#ffe39a!important;box-shadow:0 0 0 2px rgba(177,119,18,.42),0 0 18px rgba(237,187,72,.52)!important}
html.dcc-theme-light-premium body #coach #coach-nav button.active *{color:#1d1608!important}

@media(max-width:520px){
 html.dcc-theme-light-premium body #coach #coach-main{padding-top:max(22px,env(safe-area-inset-top))!important}
 html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card,
 html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-card,
 html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card{border-radius:18px!important}
}
`;
document.head.appendChild(s);

/* Al cambiar de pestaña de entrenador, empezar siempre desde arriba. */
document.addEventListener('click',function(e){
  const b=e.target.closest('#coach-nav button');
  if(!b)return;
  requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
  setTimeout(()=>window.scrollTo({top:0,left:0,behavior:'auto'}),60);
},true);

/* Al entrar por primera vez al panel, corrige cualquier scroll heredado. */
if(document.getElementById('coach')&&getComputedStyle(document.getElementById('coach')).display!=='none'){
  requestAnimationFrame(()=>window.scrollTo(0,0));
}
})();