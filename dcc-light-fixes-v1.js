/* DCC — ajustes finales de temas + Apariencia solo en Inicio */
(function(){
'use strict';
if(window.__dccThemeFinalFixV3)return;window.__dccThemeFinalFixV3=true;
const s=document.createElement('style');s.id='dcc-theme-final-fix-v3';s.textContent=`
/* Apariencia: oculta por defecto. Solo Inicio la habilita. */
.dcc-theme-trigger{display:none!important;position:fixed!important;right:16px!important;bottom:104px!important;z-index:9997!important}
html.dcc-home-theme-visible .dcc-theme-trigger{display:flex!important}

/* LIGHT: conserva los ajustes actuales */
html.dcc-theme-light-premium #client-main .dct3-muscles{min-height:88px!important;padding:10px 13px!important;grid-template-columns:minmax(0,1fr) 124px!important}
html.dcc-theme-light-premium #client-main .dct3-muscle{height:68px!important;max-width:60px!important;background:#f7efe1!important}
html.dcc-theme-light-premium #client-main .dct3-muscle img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;opacity:1!important;visibility:visible!important}
html.dcc-theme-light-premium #client-main .dct3-routine{background-image:linear-gradient(90deg,#fffdf8 0%,#f9f0df 34%,rgba(249,240,223,.91) 46%,rgba(249,240,223,.28) 64%,transparent 75%),url('./assets/next-workout-plate.jpg')!important;background-size:100% 100%,auto 150%!important;background-position:center,right center!important;background-repeat:no-repeat!important}
html.dcc-theme-light-premium #client-main .meal-card summary b{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;font-size:15px!important;font-weight:600!important;line-height:1.15!important;letter-spacing:0!important;color:#17191d!important}
html.dcc-theme-light-premium #client-main .diet-pdf-text strong{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;font-size:15px!important;font-weight:600!important;line-height:1.15!important}
html.dcc-theme-light-premium #client-main .meal-card,html.dcc-theme-light-premium #client-main .meal-card summary,html.dcc-theme-light-premium #client-main .meal-arrow{transform:none!important;transition:none!important;-webkit-tap-highlight-color:transparent!important}
html.dcc-theme-light-premium #client-main .meal-card:active,html.dcc-theme-light-premium #client-main .meal-card summary:active,html.dcc-theme-light-premium #client-main .meal-card summary:focus{background-color:transparent!important;transform:none!important;outline:none!important;filter:none!important}
html.dcc-theme-light-premium #client-main .meal-card[open]{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important}
html.dcc-theme-light-premium #client-main .meal-content{background:#fffaf1!important}
html.dcc-theme-light-premium #client-main .meal-content *{color:#4f5864!important}

/* DARK PREMIUM: misma arquitectura visual del Light, paleta negro + dorado */
html:not(.dcc-theme-light-premium) #client-main .dch-eyebrow,
html:not(.dcc-theme-light-premium) #client-main .client-header .section-eyebrow,
html:not(.dcc-theme-light-premium) #client-main .dct3-eyebrow,
html:not(.dcc-theme-light-premium) #client-main .dcpr6-kicker,
html:not(.dcc-theme-light-premium) #client-main .dcc-cc-kicker,
html:not(.dcc-theme-light-premium) #client-main .dcc-cm-kicker{
 color:#e0ad4c!important;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;font-size:11px!important;font-weight:800!important;line-height:1.15!important;letter-spacing:3.15px!important;text-transform:uppercase!important;text-shadow:none!important
}
html:not(.dcc-theme-light-premium) #client-main .dch-stat,
html:not(.dcc-theme-light-premium) #client-main .dch-task-card,
html:not(.dcc-theme-light-premium) #client-main .dch-progress,
html:not(.dcc-theme-light-premium) #client-main .meal-card,
html:not(.dcc-theme-light-premium) #client-main .diet-pdf-card,
html:not(.dcc-theme-light-premium) #client-main .dct3-card,
html:not(.dcc-theme-light-premium) #client-main .dcpr6-panel,
html:not(.dcc-theme-light-premium) #client-main .dcpr6-metric,
html:not(.dcc-theme-light-premium) #client-main .dcc-cc-card,
html:not(.dcc-theme-light-premium) #client-main .dcc-cm-thread,
html:not(.dcc-theme-light-premium) #client-main .dcc-cm-compose{
 background:radial-gradient(circle at 100% 0,rgba(217,170,74,.08),transparent 38%),linear-gradient(145deg,#171b21,#0b0f14 72%)!important;border-color:rgba(217,170,74,.48)!important;box-shadow:0 12px 28px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.025)!important;color:#f6f4ef!important
}
html:not(.dcc-theme-light-premium) #client-main .dch-name,
html:not(.dcc-theme-light-premium) #client-main .dch-progress-title,
html:not(.dcc-theme-light-premium) #client-main .meal-card summary b,
html:not(.dcc-theme-light-premium) #client-main .diet-pdf-text strong,
html:not(.dcc-theme-light-premium) #client-main .dct3-title,
html:not(.dcc-theme-light-premium) #client-main .dcpr6-panel h2,
html:not(.dcc-theme-light-premium) #client-main .dcpr6-panel h3{color:#f7f5f0!important}
html:not(.dcc-theme-light-premium) #client-main .meal-card summary b,
html:not(.dcc-theme-light-premium) #client-main .diet-pdf-text strong{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;font-size:15px!important;font-weight:600!important;letter-spacing:0!important}
html:not(.dcc-theme-light-premium) #client-main .meal-card summary,
html:not(.dcc-theme-light-premium) #client-main .meal-card summary *,
html:not(.dcc-theme-light-premium) #client-main .meal-arrow{transition:none!important;transform:none!important;-webkit-tap-highlight-color:transparent!important}
html:not(.dcc-theme-light-premium) #client-main .meal-card summary:active,
html:not(.dcc-theme-light-premium) #client-main .meal-card summary:focus{outline:none!important;box-shadow:none!important;transform:none!important;background:transparent!important}

/* Inicio oscuro: mismo bloque protagonista de próximo entrenamiento */
html:not(.dcc-theme-light-premium) #client-main .dch-next{background-image:linear-gradient(90deg,#171b21 0%,#11151a 34%,rgba(17,21,26,.94) 47%,rgba(17,21,26,.62) 59%,rgba(8,10,13,.18) 72%,rgba(8,10,13,.08) 82%),url('./assets/next-workout-plate.jpg')!important;background-size:100% 100%,auto 145%!important;background-position:center,right center!important;background-repeat:no-repeat!important;border:1px solid rgba(217,170,74,.62)!important;box-shadow:0 14px 34px rgba(0,0,0,.30)!important}
html:not(.dcc-theme-light-premium) #client-main .dch-next-name{color:#f6f4ef!important;font-weight:400!important}
html:not(.dcc-theme-light-premium) #client-main .dch-next-day{color:#9aa2ad!important}

/* Entrenamiento oscuro: mismas proporciones y jerarquía del Light */
html:not(.dcc-theme-light-premium) #client-main .dcc-training-stable-v3 .dct3-muscles{min-height:98px!important;padding:10px 13px!important}
html:not(.dcc-theme-light-premium) #client-main .dcc-training-stable-v3 .dct3-muscle{background:#0d1115!important;border-color:rgba(217,170,74,.28)!important}
html:not(.dcc-theme-light-premium) #client-main .dcc-training-stable-v3 .dct3-muscle img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;opacity:1!important;visibility:visible!important}
html:not(.dcc-theme-light-premium) #client-main .dcc-training-stable-v3 .dct3-day{background:linear-gradient(145deg,#151a20,#0b0f14)!important;color:#8d96a2!important;border-color:rgba(255,255,255,.10)!important}
html:not(.dcc-theme-light-premium) #client-main .dcc-training-stable-v3 .dct3-day.active{background:linear-gradient(145deg,#f7d77d,#dfaa3f)!important;color:#1b1408!important;border-color:#efc55e!important;box-shadow:0 7px 20px rgba(217,170,74,.24)!important}
html:not(.dcc-theme-light-premium) #client-main .dcc-training-stable-v3 .dct3-routine{background-image:linear-gradient(90deg,#161a20 0%,#11151b 33%,rgba(17,21,27,.94) 46%,rgba(17,21,27,.55) 59%,rgba(9,11,15,.10) 74%),url('./assets/next-workout-plate.jpg')!important;background-size:100% 100%,auto 150%!important;background-position:center,right center!important;background-repeat:no-repeat!important;border-color:rgba(217,170,74,.70)!important;box-shadow:0 14px 34px rgba(0,0,0,.30)!important}
html:not(.dcc-theme-light-premium) #client-main .dcc-training-stable-v3 .dct3-routine h3{color:#f7f5f0!important}
html:not(.dcc-theme-light-premium) #client-main .dcc-training-stable-v3 .dct3-meta{color:#959eaa!important}
html:not(.dcc-theme-light-premium) #client-main .dcc-training-stable-v3 .dct3-start{background:linear-gradient(135deg,#f4cf70,#dca63a)!important;color:#15110a!important;border-color:#f1c967!important}
html:not(.dcc-theme-light-premium) #client-main .dcc-training-stable-v3 .dct3-view{background:#11161c!important;color:#e7bd5b!important;border-color:rgba(217,170,74,.42)!important}
html:not(.dcc-theme-light-premium) #client-main .dcc-training-stable-v3 .dct3-exercise{background:linear-gradient(145deg,#151a20,#0d1116)!important;color:#f3f2ee!important;border-color:rgba(217,170,74,.24)!important}

/* Entrenamiento activo oscuro: misma compactación que Light */
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-top{padding:11px 12px!important;border:1px solid rgba(217,170,74,.58)!important;border-radius:20px!important;background:radial-gradient(circle at 95% 0,rgba(217,170,74,.09),transparent 34%),linear-gradient(145deg,#171b21,#0b0f14 72%)!important;box-shadow:0 15px 34px rgba(0,0,0,.30)!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-title{color:#faf9f5!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-media{background:#0d1115!important;border-color:rgba(217,170,74,.35)!important;box-shadow:none!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-media img{object-fit:contain!important;object-position:center!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-badge{background:#11161c!important;color:#aab1bc!important;border-color:rgba(255,255,255,.12)!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-badge.gold{background:rgba(217,170,74,.08)!important;color:#f0c96b!important;border-color:rgba(217,170,74,.58)!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-tech,
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-elapsed{background:linear-gradient(145deg,#12171d,#0a0e13)!important;border-color:rgba(217,170,74,.52)!important}
html:not(.dcc-theme-light-premium) body.dcc-workout-mode #client-main .dwa3-card{background:radial-gradient(circle at 100% 0,rgba(217,170,74,.07),transparent 38%),linear-gradient(145deg,#171b21,#0d1116 65%,#090c10)!important;border-color:rgba(217,170,74,.54)!important}

/* Navegación: mismo acabado premium en ambos temas */
#client-nav{background:linear-gradient(145deg,#211f1a,#111210 58%,#1b1a16)!important;border:1px solid rgba(231,181,73,.78)!important;box-shadow:0 12px 34px rgba(0,0,0,.28),0 0 0 1px rgba(255,211,108,.09),inset 0 1px 0 rgba(255,230,157,.09)!important}
#client-nav button{color:#e8b94f!important}
#client-nav button svg{color:#e8b94f!important;stroke:currentColor!important}
#client-nav button span{color:#d8bd72!important}
#client-nav button.active{color:#1d1608!important;background:linear-gradient(145deg,#ffe8a4 0%,#e6af3d 72%,#c88920 100%)!important;border-color:#ffe39a!important;box-shadow:0 0 0 2px rgba(177,119,18,.42),0 0 20px rgba(237,187,72,.54),0 8px 20px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.62)!important}
#client-nav button.active svg,#client-nav button.active span{color:#1e1708!important}
`;
document.head.appendChild(s);

function homeVisible(){
 const main=document.getElementById('client-main');
 if(!main||document.body.classList.contains('dcc-workout-mode'))return false;
 const st=getComputedStyle(main);if(st.display==='none'||st.visibility==='hidden')return false;
 const active=Array.from(document.querySelectorAll('#client-nav button.active')).find(Boolean);
 const activeText=(active?.textContent||'').trim().toLowerCase();
 if(activeText.includes('inicio'))return true;
 return !!main.querySelector('.dch-wrap') && !main.querySelector('.dcc-training-stable-v3,.dcc-nutrition-premium,.dcpr6,.dcc-cc,.dcc-cm');
}
function syncAppearance(){document.documentElement.classList.toggle('dcc-home-theme-visible',homeVisible())}
function fixHome(){
 const id=(()=>{try{return currentClientId}catch(_){return window.currentClientId}})();
 const d=(()=>{try{return data}catch(_){return window.data}})()||{};
 const rr=d.routines?.[id],routine=Array.isArray(rr)?rr:Array.isArray(rr?.routine)?rr.routine:[],day=routine[0];if(!day)return;
 const raw=Array.isArray(day.muscleGroups)&&day.muscleGroups.length?day.muscleGroups:String(day.muscle||'').split(/[·+,&/]/);
 const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');const names=[];
 raw.forEach(v=>{const n=norm(v);let x=/pecho|pectoral/.test(n)?'Pectoral':/hombro|deltoid/.test(n)?'Hombro':/tricep/.test(n)?'Tríceps':String(v||'').trim();if(x&&!names.includes(x))names.push(x)});
 const txt=names.join(' · ');if(!txt)return;
 document.querySelectorAll('#client-main .dch-next *').forEach(el=>{if(el.children.length)return;const t=(el.textContent||'').trim();if(/^Pectoral\s*[·•-]|^Pecho\s*[·•-]/i.test(t)){el.textContent=txt;el.style.setProperty('max-width','58%','important')}})
}
let raf=0;const refresh=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{fixHome();syncAppearance()})};
const obs=new MutationObserver(refresh);obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','aria-current']});
document.addEventListener('click',()=>setTimeout(syncAppearance,0),true);
window.addEventListener('dcc:themechange',refresh);
fixHome();syncAppearance();
})();