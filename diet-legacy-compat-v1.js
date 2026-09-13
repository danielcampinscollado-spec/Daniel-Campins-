/* DCC — compatibilidad segura entre dietas premium por opciones y lecturas legacy */
(function(){
  'use strict';
  const BUILD='20260913-diet-legacy-compat-v1';
  if(window.__dccDietLegacyCompat===BUILD)return;
  window.__dccDietLegacyCompat=BUILD;

  function appData(){try{return data||window.data||{}}catch(_){return window.data||{}}}

  function exposeFoods(meal){
    if(!meal||typeof meal!=='object')return;
    if(Array.isArray(meal.foods))return;
    if(!Array.isArray(meal.options))return;

    try{
      Object.defineProperty(meal,'foods',{
        configurable:true,
        enumerable:false,
        get(){
          return (Array.isArray(meal.options)?meal.options:[])
            .flatMap(option=>Array.isArray(option?.foods)?option.foods:[]);
        },
        set(value){
          Object.defineProperty(meal,'foods',{
            configurable:true,
            enumerable:true,
            writable:true,
            value:Array.isArray(value)?value:[]
          });
        }
      });
    }catch(error){console.warn('DCC diet compat meal:',error)}
  }

  function patch(){
    const diets=appData().diets||{};
    Object.values(diets).forEach(plan=>{
      ['training','rest'].forEach(type=>{
        const meals=plan?.[type]?.meals;
        if(Array.isArray(meals))meals.forEach(exposeFoods);
      });
    });
  }

  function install(){
    const base=window.showClient;
    if(typeof base!=='function')return false;
    if(base.__dccDietLegacyCompat===BUILD)return true;

    const wrapped=function(){
      patch();
      return base.apply(this,arguments);
    };
    wrapped.__dccDietLegacyCompat=BUILD;
    wrapped.__base=base;
    window.showClient=wrapped;
    patch();
    return true;
  }

  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('pageshow',()=>{patch();install()});
})();
