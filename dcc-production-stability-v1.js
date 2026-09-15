/* DCC — Production Stability V3
   Arranque seguro sin observers que reescriban el detalle del cliente. */
(function(){
  'use strict';
  if(window.__dccProductionStabilityV3)return;
  window.__dccProductionStabilityV3=true;
  window.__dccProductionStabilityV2=true;
  window.__dccProductionStabilityV1=true;

  const THEME_KEY='dcc:theme:v1';
  const html=document.documentElement;

  function ensureInitialTheme(){
    try{
      const stored=localStorage.getItem(THEME_KEY);
      if(!stored){localStorage.setItem(THEME_KEY,'light-premium');html.classList.add('dcc-theme-light-premium')}
      else html.classList.toggle('dcc-theme-light-premium',stored==='light-premium');
    }catch(_){html.classList.add('dcc-theme-light-premium')}
  }

  function installPrepaint(){
    if(document.getElementById('dcc-production-stability-v1-css'))return;
    const s=document.createElement('style');s.id='dcc-production-stability-v1-css';s.textContent=`
      html.dcc-theme-light-premium,html.dcc-theme-light-premium body,html.dcc-theme-light-premium .app{background:#f5efe4!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main,html.dcc-theme-light-premium #coach-main{background-color:#f5efe4!important}
    `;(document.head||document.documentElement).appendChild(s);
  }

  function load(src,key,guard){
    if((guard&&window[guard])||document.querySelector('script[data-dcc-stability="'+key+'"]'))return;
    const s=document.createElement('script');s.src=src;s.async=false;s.dataset.dccStability=key;(document.head||document.documentElement).appendChild(s);
  }

  function loadRuntimeFixes(){
    load('./auth-premium-v1.js?v=20260914-google-rc1','secure-auth','__dccSecureAuthV1');
    load('./training-day-wizard-v1.js?v=20260912-1703','training-day-wizard','__dccTrainingDayWizardV1');
    load('./client-delete-atomic-v4.js?v=20260912-2201','client-delete-atomic','__dccClientDeleteAtomicV6');
    /* El editor actual solo abre/guarda el formulario. La colocación de botones la
       controla client-edit-visibility-v1 para evitar dos autoridades simultáneas. */
    load('./client-profile-editor-v1.js?v=20260915-stable3','client-profile-editor','__dccClientProfileEditorV2');
    /* client-summary-cleanup-v1 se retira: su MutationObserver eliminaba tarjetas
       después de cada render y provocaba saltos visibles entre pestañas. */
  }

  function reportDuplicateExactScripts(){
    try{const seen=new Set(),duplicates=[];[...document.scripts].forEach(s=>{const src=s.src||'';if(!src)return;if(seen.has(src))duplicates.push(src);else seen.add(src)});if(duplicates.length)console.warn('DCC stability: scripts duplicados exactos detectados',duplicates)}catch(_){}
  }

  ensureInitialTheme();installPrepaint();loadRuntimeFixes();
  document.addEventListener('DOMContentLoaded',()=>{ensureInitialTheme();installPrepaint();loadRuntimeFixes();reportDuplicateExactScripts()},{once:true});
  window.addEventListener('pageshow',()=>{ensureInitialTheme();installPrepaint();loadRuntimeFixes()});
})();
