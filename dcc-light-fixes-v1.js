/* DCC — Theme final polish V7: visual only, sin observers de navegación */
(function(){
'use strict';
if(window.__dccThemeFinalFixV7)return;window.__dccThemeFinalFixV7=true;
['dcc-theme-final-fix-v3','dcc-theme-final-fix-v4','dcc-theme-final-fix-v5','dcc-theme-final-fix-v6'].forEach(id=>document.getElementById(id)?.remove());
const s=document.createElement('style');s.id='dcc-theme-final-fix-v7';s.textContent=`
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
`;
document.head.appendChild(s);
})();