/* DCC — ajuste visual de nutrición/gestión de cliente. Sin cargar módulos de aplicación. */
(function(){
'use strict';
const BUILD='20260917-nutrition-visual-only-audit-v3-compact-header';
if(window.__dccNutritionVisualOnly===BUILD)return;
window.__dccNutritionVisualOnly=BUILD;
const STYLE_ID='dcc-coach-client-visual-hotfix-v1';
function installCss(){
  const previous=document.getElementById(STYLE_ID);if(previous)previous.remove();
  const style=document.createElement('style');style.id=STYLE_ID;style.textContent=`
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-back{margin-bottom:0!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-profilebar{margin:8px 2px 6px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tabs{margin:8px 0 10px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-card .dcc-n2-plan{grid-template-columns:minmax(0,1fr)!important;gap:0!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-card .dcc-n2-plan>.dcc-n2-ico{display:none!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix{background:linear-gradient(145deg,#fffefa 0%,#f8f0e3 100%)!important;color:#17191d!important;border:1px solid rgba(183,123,19,.27)!important;box-shadow:0 8px 20px rgba(78,58,28,.06),inset 0 1px 0 rgba(255,255,255,.96)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix *{color:#5f6874!important;text-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix b,html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix strong{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix button{background:#fff1c8!important;color:#99650b!important;border:1px solid rgba(183,123,19,.26)!important;box-shadow:none!important}
`;(document.head||document.documentElement).appendChild(style)
}
function markRoutineHistory(){
  const main=document.getElementById('coach-main');if(!main||!main.classList.contains('dcc-ca'))return;
  [...main.querySelectorAll('button,section,article,div')].forEach(el=>{
    if(el.classList.contains('dcc-ca-wrap'))return;
    const text=String(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(!text.includes('rutina anterior')||text.length>180)return;
    const rect=el.getBoundingClientRect();if(rect.width<180||rect.height<42)return;el.classList.add('dcc-light-routine-history-fix')
  })
}
function refresh(){requestAnimationFrame(()=>{installCss();markRoutineHistory()})}
installCss();markRoutineHistory();
document.addEventListener('dcc:coach-screen',e=>{if(e.detail?.screen)refresh()});
})();