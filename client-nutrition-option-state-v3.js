/* DCC — Cambio de opciones de alimentación sin rerender */
(function(){
  'use strict';
  if(window.__dccNutritionOptionStateV3Loaded) return;
  window.__dccNutritionOptionStateV3Loaded=true;

  function getAppData(){
    try{
      if(typeof data!=='undefined') return data;
    }catch(_){ }
    return window.data||null;
  }

  function getClientId(){
    try{
      if(typeof currentClientId!=='undefined') return currentClientId;
    }catch(_){ }
    return window.currentClientId||null;
  }

  function getMealOptions(meal){
    try{
      if(typeof ensureMealOptions==='function') return ensureMealOptions(meal);
    }catch(_){ }
    if(Array.isArray(meal?.options)) return meal.options;
    return [{name:'Opción 1',foods:Array.isArray(meal?.foods)?meal.foods:[]}];
  }

  function renderFoods(content,foods){
    if(!content) return;

    [...content.children].forEach(child=>{
      if(!child.classList.contains('diet-options')) child.remove();
    });

    if(Array.isArray(foods) && foods.length){
      foods.forEach(food=>{
        const row=document.createElement('div');
        row.className='food-row';

        const name=document.createElement('span');
        name.textContent=String(food?.[0]??'');

        const amount=document.createElement('b');
        amount.textContent=String(food?.[1]??'');

        row.append(name,amount);
        content.appendChild(row);
      });
    }else{
      const empty=document.createElement('div');
      empty.className='empty compact-empty';
      empty.textContent='Esta comida todavía no tiene alimentos.';
      content.appendChild(empty);
    }
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest('#client-main .meal-card .diet-option');
    if(!button) return;

    /* Cortar el onclick inline antiguo para evitar showClient('food') y el parpadeo. */
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const main=document.getElementById('client-main');
    const card=button.closest('.meal-card');
    if(!main || !card) return;

    const cards=[...main.querySelectorAll('.diet-list .meal-card')];
    const mealIndex=cards.indexOf(card);
    if(mealIndex<0) return;

    const buttons=[...card.querySelectorAll('.diet-option')];
    const optionIndex=buttons.indexOf(button);
    if(optionIndex<0) return;

    if(!window.clientDietOptionIndex) window.clientDietOptionIndex={};
    window.clientDietOptionIndex[mealIndex]=optionIndex;

    buttons.forEach((item,index)=>item.classList.toggle('active',index===optionIndex));

    const appData=getAppData();
    const clientId=getClientId();
    const dietType=window.clientDietType||'training';
    const meal=appData?.diets?.[clientId]?.[dietType]?.meals?.[mealIndex];
    if(!meal) return;

    const validOptions=getMealOptions(meal).filter(option=>Array.isArray(option?.foods)&&option.foods.length);
    const activeOption=validOptions[optionIndex]||validOptions[0];

    card.open=true;
    const arrow=card.querySelector('.meal-arrow');
    if(arrow) arrow.textContent='⌃';

    renderFoods(card.querySelector('.meal-content'),activeOption?.foods||[]);
  },true);
})();
