/* DCC — localStorage no es una base de datos v1 */
(function(){
  'use strict';
  const BUILD='20260912-local-cache-authority-v1';
  if(window.__dccLocalCacheAuthority===BUILD)return;
  window.__dccLocalCacheAuthority=BUILD;

  const STORAGE_KEY='danielCampinsApp';

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
  writeNeutralSnapshot();
  install();

  document.addEventListener('DOMContentLoaded',()=>{
    writeNeutralSnapshot();
    install();
  },{once:true});

  window.addEventListener('pageshow',()=>{
    writeNeutralSnapshot();
    install();
  });
})();
