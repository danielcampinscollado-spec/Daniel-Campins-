/* DCC — Mantener abierta la comida al cambiar de opción */
(function(){
  'use strict';
  if(window.__dccNutritionOptionStateV3Loaded) return;
  window.__dccNutritionOptionStateV3Loaded=true;

  let pending=null;

  function rememberOpenMeal(button){
    const main=document.getElementById('client-main');
    if(!main) return;
    const card=button.closest('.meal-card');
    if(!card) return;
    const cards=[...main.querySelectorAll('.diet-list .meal-card')];
    const index=cards.indexOf(card);
    if(index<0) return;

    pending={
      index,
      originalCard:card,
      scrollY:window.scrollY,
      expires:Date.now()+1800
    };
  }

  function tryRestore(){
    if(!pending) return;
    if(Date.now()>pending.expires){
      pending=null;
      return;
    }

    const main=document.getElementById('client-main');
    if(!main || !main.querySelector('.diet-switch')) return;

    const cards=[...main.querySelectorAll('.diet-list .meal-card')];
    const card=cards[pending.index];
    if(!card || card===pending.originalCard) return;

    card.open=true;
    const arrow=card.querySelector('.meal-arrow');
    if(arrow) arrow.textContent='⌃';

    const y=pending.scrollY;
    pending=null;
    requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:'auto'}));
  }

  document.addEventListener('pointerdown',event=>{
    const button=event.target.closest('#client-main .meal-card .diet-option');
    if(button) rememberOpenMeal(button);
  },true);

  document.addEventListener('click',event=>{
    const button=event.target.closest('#client-main .meal-card .diet-option');
    if(button && !pending) rememberOpenMeal(button);
  },true);

  function start(){
    const main=document.getElementById('client-main');
    if(!main){setTimeout(start,100);return;}

    const observer=new MutationObserver(()=>{
      if(!pending) return;
      requestAnimationFrame(tryRestore);
    });
    observer.observe(main,{childList:true,subtree:true});
  }

  start();
})();
