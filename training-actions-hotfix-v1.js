/* DCC — Hotfix acciones entrenamiento cliente */
(function(){
  'use strict';
  if(window.__dccTrainingActionsHotfixV1) return;
  window.__dccTrainingActionsHotfixV1 = true;

  function selectedDayIndex(){
    const n = Number(window.trainingDayTab);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }

  function startSelectedWorkout(){
    const index = selectedDayIndex();
    if(typeof window.startWorkout === 'function'){
      window.startWorkout(index);
      return true;
    }
    try{
      const fn = window.eval('(typeof startWorkout === "function") ? startWorkout : null');
      if(typeof fn === 'function'){
        fn(index);
        return true;
      }
    }catch(e){
      console.error('DCC startWorkout fallback error', e);
    }
    console.error('DCC: startWorkout no está disponible');
    if(typeof window.toast === 'function') window.toast('No se pudo iniciar el entrenamiento. Recarga la app.');
    return false;
  }

  function toggleExercises(button){
    const card = button.closest('.dct-routine-card');
    if(!card) return;
    const open = card.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    const label = button.querySelector('.dct-view-label');
    if(label) label.textContent = open ? 'Ocultar ejercicios' : 'Ver ejercicios';
  }

  document.addEventListener('click', function(event){
    const start = event.target.closest && event.target.closest('.dct-start');
    if(start){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      startSelectedWorkout();
      return;
    }

    const view = event.target.closest && event.target.closest('.dct-view-exercises');
    if(view){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      toggleExercises(view);
    }
  }, true);
})();
