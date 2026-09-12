/* DCC — localStorage no es una base de datos v1 */
(function(){
  'use strict';
  const BUILD='20260912-local-cache-authority-v1';
  if(window.__dccLocalCacheAuthority===BUILD)return;
  window.__dccLocalCacheAuthority=BUILD;

  const STORAGE_KEY='danielCampinsApp';
  const SERVER_CACHE_PREFIXES=['dcc:diet-history:v2:'];

  function neutralSnapshot(){
    return {
      clients:[],
      diets:{},
      routines:{},
      previousRoutines:{},
      routineUpdatedAt:{},
      weights:{},
      workoutHistory:{},
      checkins:{},
      messages:{},
      notificationState:{},
      completedTrainingDays:{}
    };
  }

  function purgeServerCaches(){
    try{
      const keys=[];
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);
        if(key&&SERVER_CACHE_PREFIXES.some(prefix=>key.startsWith(prefix)))keys.push(key);
      }
      keys.forEach(key=>localStorage.removeItem(key));
    }catch(error){
      console.warn('DCC server cache purge:',error);
    }
  }

  function writeNeutralSnapshot(){
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify(neutralSnapshot()));
      return true;
    }catch(error){
      console.warn('DCC neutral local cache:',error);
      return false;
    }
  }

  function install(){
    const current=window.saveData;
    if(typeof current==='function'&&current.__dccLocalCacheAuthority===BUILD)return true;

    const safeSave=function(){
      return writeNeutralSnapshot();
    };
    safeSave.__dccLocalCacheAuthority=BUILD;
    safeSave.__base=current;

    try{window.saveData=safeSave}catch(error){
      console.warn('DCC local cache authority install:',error);
      return false;
    }
    return true;
  }

  /* Elimina inmediatamente cualquier snapshot antiguo de entidades de servidor. */
  purgeServerCaches();
  writeNeutralSnapshot();
  install();

  document.addEventListener('DOMContentLoaded',()=>{
    purgeServerCaches();
    writeNeutralSnapshot();
    install();
  },{once:true});

  window.addEventListener('pageshow',()=>{
    purgeServerCaches();
    writeNeutralSnapshot();
    install();
  });
})();
