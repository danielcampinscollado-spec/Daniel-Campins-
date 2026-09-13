/* DCC — hotfix visual seguro para gestión de cliente.
   Se carga después de nutrition-plan-premium-v2.js y client-admin-premium.js.
   No modifica datos ni lógica visual fuera de estos ajustes. */
(function(){
  'use strict';

  window.__dccNutritionPlanPremiumV1Disabled=true;
  if(window.__dccCoachClientVisualHotfixV1)return;
  window.__dccCoachClientVisualHotfixV1=true;

  const STYLE_ID='dcc-coach-client-visual-hotfix-v1';
  let persistenceFixesLoaded=false;

  function installCss(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-card .dcc-n2-plan{
        grid-template-columns:minmax(0,1fr)!important;
        gap:0!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-card .dcc-n2-plan>.dcc-n2-ico{
        display:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix{
        background:linear-gradient(145deg,#fffefa 0%,#f8f0e3 100%)!important;
        color:#17191d!important;
        border:1px solid rgba(183,123,19,.27)!important;
        box-shadow:0 8px 20px rgba(78,58,28,.06),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix *{
        color:#5f6874!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix b,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix strong{
        color:#17191d!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix button{
        background:#fff1c8!important;
        color:#99650b!important;
        border:1px solid rgba(183,123,19,.26)!important;
        box-shadow:none!important;
      }
    `;
    (document.head||document.documentElement).appendChild(style);
  }

  function markRoutineHistory(){
    const main=document.getElementById('coach-main');
    if(!main||!main.classList.contains('dcc-ca'))return;
    const nodes=[...main.querySelectorAll('button,section,article,div')];
    nodes.forEach(el=>{
      if(el.classList.contains('dcc-ca-wrap'))return;
      const text=String(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(!text.includes('rutina anterior'))return;
      if(text.length>180)return;
      const rect=el.getBoundingClientRect();
      if(rect.width<180||rect.height<42)return;
      el.classList.add('dcc-light-routine-history-fix');
    });
  }

  function loadOnce(src,key){
    if(document.querySelector(`script[data-${key}]`))return;
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.dataset[key]='1';
    (document.head||document.documentElement).appendChild(s);
  }

  function loadPersistenceFixes(){
    if(persistenceFixesLoaded)return;
    persistenceFixesLoaded=true;
    loadOnce('./local-cache-authority-v1.js?v=20260912-2358','dccLocalCacheAuthorityDirect');
    loadOnce('./data-authority-v1.js?v=20260912-2328','dccDataAuthorityDirect');
    loadOnce('./auth-premium-v1.js?v=20260912-2255','dccSecureAuthDirect');
    loadOnce('./auth-session-guard-v2.js?v=20260912-2342','dccAuthSessionGuardDirect');
    loadOnce('./client-server-source-v1.js?v=20260912-2255','dccClientServerSourceDirect');
    loadOnce('./client-delete-atomic-v4.js?v=20260912-2255','dccClientDeleteAtomicDirect');
    loadOnce('./client-create-authority-v1.js?v=20260913-0835','dccClientCreateAuthorityV1');
    loadOnce('./server-actions-v1.js?v=20260912-2355','dccServerActionsDirect');
    loadOnce('./routine-authority-v1.js?v=20260912-2355','dccRoutineAuthorityDirect');
    loadOnce('./training-progress-authority-v1.js?v=20260912-2350','dccTrainingProgressAuthorityDirect');
    loadOnce('./training-finish-route-fix-v1.js?v=20260913-0805','dccTrainingFinishRouteFixV1');
    loadOnce('./client-metrics-modal-v1.js?v=20260913-0755','dccClientMetricsModalV1');
    loadOnce('./body-fat-authority-v1.js?v=20260913-0820','dccBodyFatAuthorityV1');
    loadOnce('./coach-weight-authority-v1.js?v=20260913-0825','dccCoachWeightAuthorityV1');
    loadOnce('./checkin-review-authority-v1.js?v=20260913-0840','dccCheckinReviewAuthorityV1');
    loadOnce('./diet-editor-state-fix-v1.js?v=20260913-0800','dccDietEditorStateFixV1');
    loadOnce('./diet-legacy-compat-v1.js?v=20260913-0815','dccDietLegacyCompatV1');
    loadOnce('./messages-realtime-chat-guard-v1.js?v=20260913-0810','dccMessagesRealtimeChatGuardV1');
  }

  let queued=false;
  function refresh(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      installCss();
      markRoutineHistory();
      loadPersistenceFixes();
    });
  }

  function bindCoachRefresh(){
    const main=document.getElementById('coach-main');
    if(!main||main.__dccClientVisualHotfixBound)return;
    main.__dccClientVisualHotfixBound=true;
    const refreshClientAdmin=()=>{
      if(main.classList.contains('dcc-ca'))requestAnimationFrame(refresh);
    };
    main.addEventListener('click',refreshClientAdmin,{passive:true});
    main.addEventListener('change',refreshClientAdmin,{passive:true});
  }

  installCss();
  markRoutineHistory();
  loadPersistenceFixes();
  bindCoachRefresh();
  document.addEventListener('DOMContentLoaded',()=>{refresh();bindCoachRefresh()},{once:true});
  window.addEventListener('load',()=>{refresh();bindCoachRefresh()},{once:true});
  window.addEventListener('pageshow',refresh);
})();
