/* DCC — bootstrap estable: carga funciones visuales; la navegación pertenece al core */
(function(){
'use strict';
const BUILD='20260915-client-quality-bootstrap-v25-delete-position';
if(window.__dccAuditBootstrapStable===BUILD)return;window.__dccAuditBootstrapStable=BUILD;window.__dccAppQualityV5=true;
function load(src,key,onload){const old=document.querySelector('script[data-dcc-stable="'+key+'"]');if(old){if(onload){if(old.dataset.loaded==='1')onload();else old.addEventListener('load',onload,{once:true})}return}const s=document.createElement('script');s.src=src;s.async=false;s.dataset.dccStable=key;s.onload=()=>{s.dataset.loaded='1';onload?.()};s.onerror=()=>console.error('DCC: no se pudo cargar '+src);(document.head||document.documentElement).appendChild(s)}
load('./exercise-premium-pectoral-v1.js?v=20260911-1','exercise-premium');
load('./exercise-guidance-v1.js?v=20260911-1','exercise-guidance');
load('./auth-premium-v1.js?v=20260914-auth-google-rc1','secure-auth');
load('./clients-name-only-v1.js?v=20260915-4','clients-name-only');
load('./coach-client-profile-v2.js?v=20260915-1','coach-client-profile-v2',()=>load('./coach-client-profile-light-v1.js?v=20260915-1','coach-client-profile-light-v1',()=>load('./coach-client-profile-actions-v1.js?v=20260915-3','coach-client-profile-actions-v1',()=>load('./coach-client-delete-position-v1.js?v=20260915-1','coach-client-delete-position-v1'))));
load('./nutrition-meal-setup-v1.js?v=20260915-2','nutrition-meal-setup',()=>load('./nutrition-meal-order-guard-v1.js?v=20260915-1','nutrition-meal-order-guard'));
load('./nutrition-avoid-reminder-v1.js?v=20260915-2','nutrition-avoid-reminder');
load('./nutrition-single-day-valid-v1.js?v=20260915-1','nutrition-single-day-valid');
load('./diet-missing-day-confirm-v1.js?v=20260915-1','diet-missing-day-confirm');
load('./coach-bottom-nav-fix-v1.js?v=20260915-1','coach-bottom-nav-fix');
load('./checkin-premium.js?v=20260915-router-v39','checkin-premium',()=>load('./messages-premium.js?v=20260915-router-v39','messages-premium'));
})();