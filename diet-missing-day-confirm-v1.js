/* DCC — confirmación al guardar una dieta incompleta */
(function(){
'use strict';
if(window.__dccDietMissingDayConfirmV1)return;
window.__dccDietMissingDayConfirmV1=true;

function mealCount(id,type){
  const meals=window.data?.diets?.[String(id)]?.[type]?.meals;
  return Array.isArray(meals)?meals.length:0;
}

function onSaveClick(e){
  const button=e.target.closest?.('.dcc-n2-save-plan-final');
  if(!button)return;
  const id=window.selectedClient;
  if(id===undefined||id===null||id==='')return;

  const training=mealCount(id,'training');
  const rest=mealCount(id,'rest');
  let message='';

  if(training>0&&rest===0){
    message='Todavía falta añadir el día de descanso.\n\n¿Seguro que quieres guardar la dieta solo con el día de entrenamiento?';
  }else if(rest>0&&training===0){
    message='Todavía falta añadir el día de entrenamiento.\n\n¿Seguro que quieres guardar la dieta solo con el día de descanso?';
  }else if(training===0&&rest===0){
    message='La dieta todavía no tiene comidas ni para el día de entrenamiento ni para el día de descanso.\n\n¿Seguro que quieres guardarla así?';
  }

  if(message&&!window.confirm(message)){
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}

document.addEventListener('click',onSaveClick,true);
})();
