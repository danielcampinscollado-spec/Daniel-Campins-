/* DCC bootstrap — núcleo consolidado y carga por función. */
(function(){
'use strict';
const BUILD='20260916-support-bootstrap-v23-clean-nav-today';
if(window.__dccSupportBootstrap===BUILD)return;
window.__dccSupportBootstrap=BUILD;

/* Primer pintado: evita que el lateral oscuro original llegue a verse alrededor de la barra. */
(function navPrepaint(){
 if(document.getElementById('dcc-coach-nav-prepaint-v2'))return;
 const s=document.createElement('style');s.id='dcc-coach-nav-prepaint-v2';s.textContent=`@media(max-width:900px){body #coach#coach>.side{background:#fffdf9!important;background-color:#fffdf9!important;background-image:none!important;border-color:#d9a43a!important;outline:0!important;box-shadow:0 12px 30px rgba(103,76,29,.11),inset 0 0 0 8px #fffdf9!important;-webkit-box-shadow:0 12px 30px rgba(103,76,29,.11),inset 0 0 0 8px #fffdf9!important}body #coach#coach #coach-nav#coach-nav{background:#fffdf9!important;background-color:#fffdf9!important;background-image:none!important;box-shadow:none!important;-webkit-box-shadow:none!important}body #coach#coach>.side::before,body #coach#coach>.side::after{display:none!important;content:none!important}}`;(document.head||document.documentElement).appendChild(s)
})();

function pathOf(src){return src.replace(/^\.\//,'').split('?')[0]}
function exactExisting(src){try{const wanted=new URL(src,location.href);return [...document.scripts].find(s=>{try{const got=new URL(s.src,location.href);return got.pathname===wanted.pathname&&got.search===wanted.search}catch(_){return false}})}catch(_){return null}}
const pending=new Map();
function load(src){if(exactExisting(src))return Promise.resolve();if(pending.has(src))return pending.get(src);const job=new Promise(resolve=>{const s=document.createElement('script');s.src=src;s.async=true;s.dataset.dccSupport=pathOf(src);s.onload=resolve;s.onerror=()=>{console.error('DCC: no se pudo cargar '+src);resolve()};(document.head||document.documentElement).appendChild(s)}).finally(()=>pending.delete(src));pending.set(src,job);return job}
function loadMany(list){return Promise.all(list.map(load))}

/* Una sola autoridad visual para la barra móvil del entrenador. */
const coachNav='./bottom-nav-light-premium-v1.js?v=20260916-approved4';
const profileCritical=[
  './dcc-app-core-v1.js?v=20260916-clean1',
  './coach-dashboard-schedule-v1.js?v=20260916-today1',
  './coach-client-profile-v2.js?v=20260916-runtime2',
  './coach-client-profile-light-v1.js?v=20260916-runtime2',
  './coach-client-profile-actions-v1.js?v=20260916-runtime2',
  './coach-followup-hardfix-v1.js?v=20260916-runtime2'
];

const core=[
  './auth-preview-redirect-guard-v1.js?v=20260916-runtime1','./auth-premium-v1.js?v=20260916-runtime1','./auth-session-guard-v2.js?v=20260916-runtime1','./auth-client-claim-v1.js?v=20260916-runtime1','./local-cache-authority-v1.js?v=20260916-runtime1','./data-authority-v1.js?v=20260916-runtime1','./server-actions-v1.js?v=20260916-runtime1','./client-server-source-v1.js?v=20260916-runtime1','./client-create-authority-v1.js?v=20260916-runtime1','./client-delete-atomic-v4.js?v=20260916-runtime1','./client-access-coach-v1.js?v=20260916-runtime1','./client-profile-edit-authority-v2.js?v=20260916-runtime1','./coach-client-critical-authority-v1.js?v=20260916-runtime1','./coach-client-final-consistency-v1.js?v=20260916-runtime1','./new-client-premium-v1.js?v=20260916-runtime1','./dcc-dynamic-greeting-v1.js?v=20260916-runtime1'
];

const groups={
  profile:['./client-current-fat-dedupe-v1.js?v=20260916-runtime1','./coach-client-delete-position-v1.js?v=20260916-runtime1','./client-metrics-modal-v1.js?v=20260916-runtime1','./body-fat-authority-v1.js?v=20260916-runtime1','./coach-weight-authority-v1.js?v=20260916-runtime1','./checkin-review-authority-v1.js?v=20260916-runtime1'],
  calendar:['./coach-calendar-v12.js?v=20260916-runtime1','./coach-calendar-sync-v14.js?v=20260916-runtime1','./coach-calendar-form-fix-v15.js?v=20260916-runtime1'],
  diet:['./coach-client-spacing-nutrition-v1.js?v=20260916-runtime1','./diet-editor-state-fix-v1.js?v=20260916-runtime1','./diet-legacy-compat-v1.js?v=20260916-runtime1','./diet-editor-save-exit-v1.js?v=20260916-runtime1','./diet-server-source-v1.js?v=20260916-runtime1','./diet-editor-save-visibility-v1.js?v=20260916-runtime1','./nutrition-avoid-reminder-v1.js?v=20260916-runtime1','./nutrition-single-day-valid-v1.js?v=20260916-runtime1','./diet-missing-day-confirm-v1.js?v=20260916-runtime1'],
  training:['./training-day-wizard-v1.js?v=20260916-clean1','./exercise-premium-pectoral-v1.js?v=20260916-runtime1','./exercise-guidance-v1.js?v=20260916-runtime1','./routine-authority-v1.js?v=20260916-runtime1','./training-progress-authority-v1.js?v=20260916-runtime1','./training-finish-route-fix-v1.js?v=20260916-runtime1','./training-inline-fix.js?v=20260916-runtime1','./training-home-actions-v1.js?v=20260916-runtime1','./training-interaction-fix-v1.js?v=20260916-runtime1','./workout-session-premium-v3.js?v=20260916-runtime1'],
  messages:['./messages-realtime-chat-guard-v1.js?v=20260916-runtime1']
};
const loadedGroups=new Set();
function loadGroup(name){if(!groups[name]||loadedGroups.has(name))return Promise.resolve();loadedGroups.add(name);return loadMany(groups[name]).then(()=>{document.dispatchEvent(new CustomEvent('dcc:feature-ready',{detail:{feature:name}}));if(name==='calendar'&&window.currentApp==='coach'&&window.currentScreen==='calendar'&&typeof window.dccRenderCoachCalendarV12==='function')window.dccRenderCoachCalendarV12()})}
function routeFeature(raw){const s=String(raw||'').toLowerCase();if(/calendar/.test(s))return'calendar';if(/diet|food|nutrition|aliment/.test(s))return'diet';if(/routine|training|workout|entren/.test(s))return'training';if(/message|chat|mensaje/.test(s))return'messages';if(/client|note|resumen|profile|checkin|check-in/.test(s))return'profile';return''}
function featureFromEvent(e){const d=e?.detail;return routeFeature(typeof d==='string'?d:(d?.screen||d?.route||d?.name||window.currentScreen||''))}
function warmFeature(name){if(name)loadGroup(name).catch(e=>console.error('DCC feature '+name+':',e))}
document.addEventListener('dcc:coach-screen',e=>warmFeature(featureFromEvent(e)));
document.addEventListener('dcc:client-screen',e=>warmFeature(featureFromEvent(e)));
document.addEventListener('pointerdown',e=>{const el=e.target?.closest?.('button,[onclick],[data-screen],[data-route]');if(!el)return;warmFeature(routeFeature((el.getAttribute('onclick')||'')+' '+(el.dataset?.screen||'')+' '+(el.dataset?.route||'')+' '+(el.textContent||'')))},{capture:true,passive:true});
function idle(fn,timeout=1800){if('requestIdleCallback' in window){requestIdleCallback(fn,{timeout});return}setTimeout(fn,400)}
(async()=>{
  await load(coachNav);
  await loadMany(profileCritical);
  window.__dccProfileCriticalReady=true;
  document.dispatchEvent(new CustomEvent('dcc:profile-critical-ready'));
  idle(()=>{loadMany(core).then(()=>{window.__dccSupportBootstrapReady=true;document.dispatchEvent(new CustomEvent('dcc:support-ready'))}).catch(e=>console.error('DCC core:',e))},1400);
  warmFeature(routeFeature(window.currentScreen||''));
})();
})();