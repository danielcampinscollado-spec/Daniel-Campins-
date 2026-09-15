/* DCC coach premium loader v39 — carga única; navegación en coach-premium-core-v9. */
(function(){
'use strict';
if(window.__dccCoachPremiumLoaderV39)return;window.__dccCoachPremiumLoaderV39=true;
function add(src,key,done){if(document.querySelector('script[data-dcc-loader="'+key+'"]')){done?.();return}const x=document.createElement('script');x.src=src;x.async=false;x.dataset.dccLoader=key;if(done)x.onload=done;(document.head||document.documentElement).appendChild(x)}
if(window.showCoach?.__dccPremiumV9){add('./coach-ui-v11.js?v=20260910-1932','coachUi')}else add('./coach-premium-core-v9.js?v=20260915-router-v39','coachCore',()=>add('./coach-ui-v11.js?v=20260910-1932','coachUi'));
})();

/* DCC fast client entry v17 — pinta navegación e inicio antes de sincronizar Supabase */
(function(){
  'use strict';
  if(window.__dccFastClientEntryV17)return;
  window.__dccFastClientEntryV17=true;

  const originalOpenApp=window.openApp;
  if(typeof originalOpenApp!=='function')return;

  function safeCurrentClientExists(){
    try{
      return Array.isArray(data?.clients) && data.clients.some(c=>c?.id===currentClientId);
    }catch(e){
      return false;
    }
  }

  function refreshClientHomeIfStillOpen(){
    try{
      if(currentApp==='client' && currentScreen==='home' && safeCurrentClientExists()){
        showClient('home');
      }
    }catch(e){
      console.error('DCC client refresh:',e);
    }
  }

  window.openApp=function(app){
    if(app!=='client'){
      return originalOpenApp.apply(this,arguments);
    }

    try{
      currentApp='client';

      const login=document.getElementById('login');
      const clientApp=document.getElementById('client');
      const coachApp=document.getElementById('coach');

      if(login)login.style.display='none';
      if(clientApp)clientApp.style.display='block';
      if(coachApp)coachApp.style.display='none';

      if(typeof buildClientNav==='function')buildClientNav();

      if(safeCurrentClientExists() && typeof showClient==='function'){
        showClient('home');
      }

      const startBackgroundSync=()=>{
        try{
          if(typeof setupMessageRealtime==='function')setupMessageRealtime();
        }catch(e){
          console.error('DCC realtime client:',e);
        }

        const jobs=[];
        const loaders=[
          window.loadDietsFromSupabase,
          window.loadClientsFromSupabase,
          window.loadRoutinesFromSupabase,
          window.loadWorkoutHistoryFromSupabase,
          window.loadWeightsFromSupabase,
          window.loadNotificationStateFromSupabase,
          window.loadMessagesFromSupabase,
          window.loadCheckinsFromSupabase
        ];

        loaders.forEach(fn=>{
          if(typeof fn==='function')jobs.push(Promise.resolve().then(()=>fn()));
        });

        Promise.allSettled(jobs).then(refreshClientHomeIfStillOpen);
      };

      requestAnimationFrame(()=>setTimeout(startBackgroundSync,0));
      return Promise.resolve();
    }catch(e){
      console.error('DCC fast client entry:',e);
      return originalOpenApp.apply(this,arguments);
    }
  };

  window.openApp.__dccFastClientEntryV17=true;
  window.openApp.__original=originalOpenApp;
})();
