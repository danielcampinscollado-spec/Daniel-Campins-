/* DCC — Puente estable para iniciar sesión de entrenamiento desde módulos externos */
(function(){
  'use strict';

  window.startWorkout = function(dayIndex){
    try{
      const routine = data.routines?.[currentClientId] || [];
      const index = Number(dayIndex);
      const day = routine[index];

      if(!day){
        if(typeof toast === 'function') toast('No se encontró el entrenamiento');
        return;
      }

      const exercises = (Array.isArray(day.exercises) ? day.exercises : []).map(ex=>({
        ...ex,
        restBetweenSets:
          day.restBetweenSetsGlobal !== undefined
            ? Math.max(0,parseInt(day.restBetweenSetsGlobal)||0)
            : Math.max(0,parseInt(ex.restBetweenSets)||0),
        restBetweenExercises:
          day.restBetweenExercisesGlobal !== undefined
            ? Math.max(0,parseInt(day.restBetweenExercisesGlobal)||0)
            : Math.max(0,parseInt(ex.restBetweenExercises)||0)
      }));

      if(!exercises.length){
        if(typeof toast === 'function') toast('Este entrenamiento no tiene ejercicios');
        return;
      }

      window.activeWorkout = {
        clientId:currentClientId,
        dayIndex:index,
        dayName:day.muscle || 'Entrenamiento',
        exercises:JSON.parse(JSON.stringify(exercises)),
        startedAt:Date.now(),
        currentExercise:0,
        sets:[],
        completedExercises:[]
      };

      if(typeof renderWorkoutSession === 'function'){
        renderWorkoutSession();
        return;
      }

      console.error('DCC: renderWorkoutSession no disponible');
      if(typeof toast === 'function') toast('No se pudo abrir el entrenamiento');
    }catch(error){
      console.error('DCC: error iniciando entrenamiento',error);
      try{
        if(typeof toast === 'function') toast('No se pudo iniciar el entrenamiento');
      }catch(_){ }
    }
  };
})();
