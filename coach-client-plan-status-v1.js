/* DCC bootstrap de soporte — carga determinista, sin renderizadores competidores. */
(function(){
'use strict';
const BUILD='20260916-support-bootstrap-audit-v5';
if(window.__dccSupportBootstrap===BUILD)return;
window.__dccSupportBootstrap=BUILD;

function pathOf(src){return src.replace(/^\.\//,'').split('?')[0]}
function existing(path){return [...document.scripts].find(s=>{try{return new URL(s.src,location.href).pathname.endsWith('/'+path)}catch(_){return false}})}
function load(src){
  const path=pathOf(src);
  if(existing(path))return Promise.resolve();
  return new Promise(resolve=>{
    const s=document.createElement('script');s.src=src;s.async=false;s.dataset.dccSupport=path;
    s.onload=resolve;s.onerror=()=>{console.error('DCC: no se pudo cargar '+src);resolve()};
    (document.head||document.documentElement).appendChild(s);
  });
}

const modules=[
  './coach-calendar-v12.js?v=20260916-audit3',
  './coach-calendar-form-fix-v15.js?v=20260916-audit1',
  './exercise-premium-pectoral-v1.js?v=20260916-audit1',
  './exercise-guidance-v1.js?v=20260916-audit1',
  './auth-preview-redirect-guard-v1.js?v=20260916-audit1',
  './auth-premium-v1.js?v=20260916-audit1',
  './auth-session-guard-v2.js?v=20260916-audit1',
  './auth-client-claim-v1.js?v=20260916-audit1',
  './local-cache-authority-v1.js?v=20260916-audit1',
  './data-authority-v1.js?v=20260916-audit1',
  './server-actions-v1.js?v=20260916-audit1',
  './client-server-source-v1.js?v=20260916-audit1',
  './client-create-authority-v1.js?v=20260916-audit1',
  './client-delete-persist-v1.js?v=20260916-audit1',
  './client-delete-atomic-v4.js?v=20260916-audit1',
  './client-access-coach-v1.js?v=20260916-audit1',
  './client-profile-edit-authority-v2.js?v=20260916-audit1',
  './coach-client-critical-authority-v1.js?v=20260916-audit1',
  './client-current-fat-dedupe-v1.js?v=20260916-audit1',
  './coach-client-final-consistency-v1.js?v=20260916-audit1',
  './routine-authority-v1.js?v=20260916-audit1',
  './training-progress-authority-v1.js?v=20260916-audit1',
  './training-finish-route-fix-v1.js?v=20260916-audit1',
  './client-metrics-modal-v1.js?v=20260916-audit1',
  './body-fat-authority-v1.js?v=20260916-audit1',
  './coach-weight-authority-v1.js?v=20260916-audit1',
  './checkin-review-authority-v1.js?v=20260916-audit1',
  './diet-editor-state-fix-v1.js?v=20260916-audit1',
  './diet-legacy-compat-v1.js?v=20260916-audit1',
  './diet-editor-save-exit-v1.js?v=20260916-audit1',
  './diet-server-source-v1.js?v=20260916-audit1',
  './diet-editor-save-visibility-v1.js?v=20260916-audit1',
  './messages-realtime-chat-guard-v1.js?v=20260916-audit1',
  './rc-coach-stability-v1.js?v=20260916-audit1',
  './dcc-production-stability-v1.js?v=20260916-audit1',
  './dcc-dynamic-greeting-v1.js?v=20260916-audit1',
  './new-client-premium-v1.js?v=20260916-audit1',
  './coach-client-profile-v2.js?v=20260916-audit1',
  './coach-client-profile-light-v1.js?v=20260916-audit1',
  './coach-client-profile-actions-v1.js?v=20260916-audit1',
  './coach-client-delete-position-v1.js?v=20260916-audit1',
  './coach-client-spacing-nutrition-v1.js?v=20260916-audit1',
  './nutrition-avoid-reminder-v1.js?v=20260916-audit1',
  './nutrition-single-day-valid-v1.js?v=20260916-audit1',
  './diet-missing-day-confirm-v1.js?v=20260916-audit1',
  './training-inline-fix.js?v=20260916-audit1',
  './training-home-actions-v1.js?v=20260916-audit1',
  './training-interaction-fix-v1.js?v=20260916-audit1',
  './workout-session-premium-v3.js?v=20260916-audit2'
];

(async()=>{
  for(const src of modules)await load(src);
  window.__dccSupportBootstrapReady=true;
  document.dispatchEvent(new CustomEvent('dcc:support-ready'));
  if(window.currentApp==='coach'&&window.currentScreen==='calendar'&&typeof window.dccRenderCoachCalendarV12==='function')window.dccRenderCoachCalendarV12();
})();
})();