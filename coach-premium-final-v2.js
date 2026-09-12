/* DCC legacy bridge — carga estable de entrenador */
(function(){
'use strict';
const BUILD='20260912-0954-clients-nav';window.__dccLegacyCoachBridge=BUILD;
function add(src,key){if([...document.scripts].some(s=>(s.src||'').includes(src.split('?')[0])))return;const x=document.createElement('script');x.src=src;x.async=false;x.dataset[key]=BUILD;(document.head||document.documentElement).appendChild(x)}
function load(){
 add('./coach-panel-state-v10.js?v=20260910-1918','dccPanelState');
 add('./coach-dashboard-light-fix.js?v=20260912-0941','dccDashboardLightFix');
 add('./coach-clients-light-fix-v1.js?v=20260912-0954','dccClientsLightFix');
 add('./coach-ui-v11.js?v=20260910-1932','dccCoachUi');
 add('./coach-premium-v8.js?v=20260910-1817','dccCoachPremium');
}
load();window.addEventListener('load',load,{once:true});window.addEventListener('pageshow',load);
})();
