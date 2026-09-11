/* DCC — Theme final polish V4: parity Light/Dark + Apariencia solo Inicio */
(function(){
'use strict';
if(window.__dccThemeFinalFixV4)return;window.__dccThemeFinalFixV4=true;
const STYLE_ID='dcc-theme-final-fix-v4';
function install(){
 document.getElementById('dcc-theme-final-fix-v3')?.remove();
 let s=document.getElementById(STYLE_ID);
 if(!s){s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
/* Apariencia: siempre oculta salvo Inicio real */
.dcc-theme-trigger{display:none!important;position:fixed!important;right:14px!important;bottom:92px!important;z-index:9997!important}
html.dcc-home-theme-visible .dcc-theme-trigger{display:flex!important}

/* ===== DARK PREMIUM: misma arquitectura que Light ===== */
html:not(.dcc-theme-light-premium) body #client-main .dch-eyebrow,
html:not(.dcc-theme-light-premium) body #client-main .client-header .section-eyebrow,
html:not(.dcc-theme-light-premium) body #client-main .dct3-eyebrow,
html:not(.dcc-theme-light-premium) body #client-main .dcpr6-kicker,
html:not(.dcc-theme-light-premium) body #client-main .dcc-cc-kicker,
html:not(.dcc-theme-light-premium) body #client-main .dcc-cm-kicker{color:#e0ad4c!important;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;font-size:11px!important;font-weight:800!important;line-height:1.15!important;letter-spacing:3.15px!important;text-transform:uppercase!important;text-shadow:none!important}

/* Alimentación oscuro: misma tipografía premium del Light */
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .meal-card summary,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .meal-card summary *,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .food-row,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .food-row b,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .diet-pdf-text,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .diet-pdf-text *{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;letter-spacing:0!important}
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .meal-card summary b,
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .diet-pdf-text strong{font-size:15px!important;font-weight:650!important;line-height:1.15!important;color:#f6f4ef!important}
html:not(.dcc-theme-light-premium) body #client-main.dcc-nutrition-premium .meal-card summary{transition:none!important;transform:none!important;-webkit-tap-highlight-color:transparent!important}

/* Entrenamiento portada oscuro: mismo hero con disco + degradado */
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-routine{position:relative!important;overflow:hidden!important;isolation:isolate!important;min-height:138px!important;padding:14px!important;border:1px solid rgba(217,170,74,.68)!important;border-radius:22px!important;background-image:linear-gradient(90deg,#171b21 0%,#11151a 31%,rgba(17,21,26,.97) 43%,rgba(17,21,26,.82) 52%,rgba(17,21,26,.42) 62%,rgba(8,10,13,.08) 74%),url('./assets/next-workout-plate.jpg')!important;background-size:100% 100%,auto 150%!important;background-position:center,right center!important;background-repeat:no-repeat,no-repeat!important;box-shadow:0 14px 34px rgba(0,0,0,.30)!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-routine>*{position:relative!important;z-index:2!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-routine h3{color:#f7f5f0!important;font-size:20px!important;font-weight:650!important;max-width:62%!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-routine .dct3-meta{color:#959eaa!important;max-width:62%!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-routine .dct3-label{color:#e0ad4c!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-start{background:linear-gradient(135deg,#f4cf70,#dca63a)!important;color:#15110a!important;border-color:#f1c967!important}
html:not(.dcc-theme-light-premium) body #client-main .dcc-training-stable-v3 .dct3-view{background:rgba(13,17,22,.92)!important;color:#e7bd5b!important;border-color:rgba(217,170,74,.42)!important}

/* Activo oscuro: ilustración igual de contenida que Light */
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-top{grid-template-columns:minmax(0,1fr) 112px!important;gap:8px 10px!important;padding:11px 12px!important;border:1px solid rgba(217,170,74,.58)!important;border-radius:20px!important;background:radial-gradient(circle at 95% 0,rgba(217,170,74,.09),transparent 34%),linear-gradient(145deg,#171b21,#0b0f14 72%)!important;box-shadow:0 15px 34px rgba(0,0,0,.30)!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-media{width:108px!important;height:100px!important;align-self:center!important;justify-self:center!important;border:1px solid rgba(217,170,74,.36)!important;border-radius:15px!important;overflow:hidden!important;padding:6px!important;background:#0d1115!important;box-shadow:none!important;display:grid!important;place-items:center!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-media img{width:100%!important;height:100%!important;display:block!important;object-fit:contain!important;object-position:center!important;border:0!important;border-radius:10px!important;background:transparent!important;padding:0!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-title{font-size:21px!important;line-height:1.05!important;color:#faf9f5!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-kicker{margin-bottom:7px!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-badges{margin-top:8px!important;gap:5px!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-badge{min-height:25px!important;padding:0 8px!important;background:#11161c!important;color:#aab1bc!important;border-color:rgba(255,255,255,.12)!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-badge.gold{background:rgba(217,170,74,.08)!important;color:#f0c96b!important;border-color:rgba(217,170,74,.58)!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-tech,
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-elapsed{min-height:41px!important;background:linear-gradient(145deg,#12171d,#0a0e13)!important;border-color:rgba(217,170,74,.52)!important}

/* Historial compacto en ambos temas */
body.dcc-workout-mode #client-main .dwa3-history.first{min-height:58px!important;padding:8px 12px!important;grid-template-columns:34px minmax(0,1fr)!important;gap:9px!important}
body.dcc-workout-mode #client-main .dwa3-history.first .dwa3-history-icon{width:34px!important;height:34px!important}
body.dcc-workout-mode #client-main .dwa3-history.first span{margin:0!important}
body.dcc-workout-mode #client-main .dwa3-history.first strong{margin-top:2px!important}

@media(max-width:390px){html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-top{grid-template-columns:minmax(0,1fr) 104px!important}html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-media{width:100px!important;height:94px!important;padding:5px!important}}
`;
 document.head.appendChild(s);
 }
 if(s!==document.head.lastElementChild)document.head.appendChild(s);
}
function isHome(){
 const main=document.getElementById('client-main');if(!main||document.body.classList.contains('dcc-workout-mode'))return false;
 const active=document.querySelector('#client-nav button.active');
 const text=(active?.textContent||'').trim().toLowerCase();
 if(text)return text.includes('inicio');
 return !!main.querySelector('.dch-wrap')&&!main.querySelector('.dcc-training-stable-v3,.dcc-nutrition-premium,.dcpr6,.dcc-cc,.dcc-cm,.dwa3');
}
function syncAppearance(){
 const home=isHome();document.documentElement.classList.toggle('dcc-home-theme-visible',home);
 document.querySelectorAll('.dcc-theme-trigger').forEach(t=>t.style.setProperty('display',home?'flex':'none','important'));
}
function sync(){install();syncAppearance()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();
let raf=0;new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(sync)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
document.addEventListener('click',()=>setTimeout(sync,0),true);
})();