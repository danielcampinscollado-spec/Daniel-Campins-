/* DCC — Production Stability V1
   Capa de arranque segura. No toca datos ni lógica de negocio. */
(function(){
  'use strict';
  if(window.__dccProductionStabilityV1)return;
  window.__dccProductionStabilityV1=true;

  const THEME_KEY='dcc:theme:v1';
  const html=document.documentElement;

  function ensureInitialTheme(){
    try{
      const stored=localStorage.getItem(THEME_KEY);
      if(!stored){
        localStorage.setItem(THEME_KEY,'light-premium');
        html.classList.add('dcc-theme-light-premium');
      }else{
        html.classList.toggle('dcc-theme-light-premium',stored==='light-premium');
      }
    }catch(_){
      html.classList.add('dcc-theme-light-premium');
    }
  }

  function installPrepaint(){
    if(document.getElementById('dcc-production-stability-v1-css'))return;
    const s=document.createElement('style');
    s.id='dcc-production-stability-v1-css';
    s.textContent=`
      html.dcc-theme-light-premium,
      html.dcc-theme-light-premium body,
      html.dcc-theme-light-premium .app{
        background:#f5efe4!important;
        color:#17191d!important;
      }
      html.dcc-theme-light-premium #client-main,
      html.dcc-theme-light-premium #coach-main{
        background-color:#f5efe4!important;
      }
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  function loadTrainingDayWizard(){
    if(window.__dccTrainingDayWizardV1||document.querySelector('script[data-dcc-training-day-wizard]'))return;
    const s=document.createElement('script');
    s.src='./training-day-wizard-v1.js?v=20260912-1703';
    s.async=false;
    s.dataset.dccTrainingDayWizard='1';
    (document.head||document.documentElement).appendChild(s);
  }

  function loadClientDeleteAtomic(){
    if(window.__dccClientDeleteAtomicV5||document.querySelector('script[data-dcc-client-delete-atomic-v5]'))return;
    const s=document.createElement('script');
    s.src='./client-delete-atomic-v4.js?v=20260912-2142';
    s.async=false;
    s.dataset.dccClientDeleteAtomicV5='1';
    (document.head||document.documentElement).appendChild(s);
  }

  function loadClientProfileEditor(){
    if(window.__dccClientProfileEditorV1||document.querySelector('script[data-dcc-client-profile-editor]'))return;
    const s=document.createElement('script');
    s.src='./client-profile-editor-v1.js?v=20260912-2142';
    s.async=false;
    s.dataset.dccClientProfileEditor='1';
    (document.head||document.documentElement).appendChild(s);
  }

  function loadClientSummaryCleanup(){
    if(window.__dccClientSummaryCleanupV1||document.querySelector('script[data-dcc-client-summary-cleanup]'))return;
    const s=document.createElement('script');
    s.src='./client-summary-cleanup-v1.js?v=20260912-2144';
    s.async=false;
    s.dataset.dccClientSummaryCleanup='1';
    (document.head||document.documentElement).appendChild(s);
  }

  function reportDuplicateExactScripts(){
    try{
      const seen=new Set();
      const duplicates=[];
      [...document.scripts].forEach(s=>{
        const src=s.src||'';
        if(!src)return;
        if(seen.has(src))duplicates.push(src);
        else seen.add(src);
      });
      if(duplicates.length)console.warn('DCC stability: scripts duplicados exactos detectados',duplicates);
    }catch(_){ }
  }

  function loadRuntimeFixes(){
    loadTrainingDayWizard();
    loadClientDeleteAtomic();
    loadClientProfileEditor();
    loadClientSummaryCleanup();
  }

  ensureInitialTheme();
  installPrepaint();
  loadRuntimeFixes();
  document.addEventListener('DOMContentLoaded',()=>{
    ensureInitialTheme();
    installPrepaint();
    loadRuntimeFixes();
    reportDuplicateExactScripts();
  },{once:true});
  window.addEventListener('pageshow',()=>{
    ensureInitialTheme();
    installPrepaint();
    loadRuntimeFixes();
  });
})();
