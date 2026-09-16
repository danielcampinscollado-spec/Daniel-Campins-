/* DCC — bootstrap estable: carga funciones visuales; la navegación pertenece al core */
(function(){
'use strict';
const BUILD='20260916-client-quality-bootstrap-v58-inline-white-nav';
if(window.__dccAuditBootstrapStable===BUILD)return;window.__dccAuditBootstrapStable=BUILD;window.__dccAppQualityV5=true;
function load(src,key,onload){const old=document.querySelector('script[data-dcc-stable="'+key+'"]');if(old){if(onload){if(old.dataset.loaded==='1')onload();else old.addEventListener('load',onload,{once:true})}return}const s=document.createElement('script');s.src=src;s.async=false;s.dataset.dccStable=key;s.onload=()=>{s.dataset.loaded='1';onload?.()};s.onerror=()=>console.error('DCC: no se pudo cargar '+src);(document.head||document.documentElement).appendChild(s)}
load('./exercise-premium-pectoral-v1.js?v=20260911-1','exercise-premium');
load('./exercise-guidance-v1.js?v=20260911-1','exercise-guidance');
load('./auth-premium-v1.js?v=20260914-auth-google-rc1','secure-auth');
load('./clients-name-only-v1.js?v=20260916-10','clients-name-only');
load('./coach-dashboard-authority-v1.js?v=20260916-5','coach-dashboard-authority');
load('./coach-client-profile-v2.js?v=20260915-1','coach-client-profile-v2',()=>load('./coach-client-profile-light-v1.js?v=20260915-1','coach-client-profile-light-v1',()=>load('./coach-client-profile-actions-v1.js?v=20260915-3','coach-client-profile-actions-v1',()=>load('./coach-client-delete-position-v1.js?v=20260915-1','coach-client-delete-position-v1',()=>load('./coach-client-spacing-nutrition-v1.js?v=20260915-3','coach-client-spacing-nutrition-v1')))));
load('./nutrition-meal-setup-v1.js?v=20260915-2','nutrition-meal-setup',()=>load('./nutrition-meal-order-guard-v1.js?v=20260915-1','nutrition-meal-order-guard'));
load('./nutrition-avoid-reminder-v1.js?v=20260915-2','nutrition-avoid-reminder');
load('./nutrition-single-day-valid-v1.js?v=20260915-1','nutrition-single-day-valid');
load('./diet-missing-day-confirm-v1.js?v=20260915-1','diet-missing-day-confirm');
load('./training-inline-fix.js?v=20260915-restore1','training-inline-fix',()=>load('./training-coach-fixes-v1.js?v=20260915-restore1','training-coach-fixes',()=>load('./training-defaults-v1.js?v=20260915-restore1','training-defaults',()=>load('./training-day-wizard-v1.js?v=20260916-6','training-day-wizard',()=>load('./training-editor-stability-v1.js?v=20260915-2','training-editor-stability',()=>load('./training-exercise-picker-v2.js?v=20260915-3','training-exercise-picker-v2',()=>load('./training-draft-guard-v1.js?v=20260915-3','training-draft-guard',()=>load('./coach-editor-flow-v1.js?v=20260915-2','coach-editor-flow',()=>load('./training-interaction-fix-v1.js?v=20260915-2','training-interaction-fix',()=>load('./training-save-actions-position-v1.js?v=20260916-6','training-save-actions-position',()=>load('./training-home-actions-v1.js?v=20260916-3','training-home-actions')))))))))));
load('./bottom-nav-light-premium-v1.js?v=20260916-10','bottom-nav-light-premium');
load('./checkin-premium.js?v=20260915-router-v39','checkin-premium',()=>load('./messages-premium.js?v=20260915-router-v39','messages-premium'));
})();