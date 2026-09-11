/* DCC — consejo técnico estable v2
   El consejo NO se muestra en listados ni descripciones.
   Solo aparece durante la sesión activa del ejercicio.
*/
(function(){
  'use strict';
  if(window.__dccExerciseGuidanceStableV2)return;
  window.__dccExerciseGuidanceStableV2=true;

  const exact={
    'press-banca-barra':'Mantén los pies firmes, retrae las escápulas y baja la barra con control hasta el pecho sin perder la posición de los hombros.',
    'press-banca-mancuernas':'Mantén las escápulas estables, las muñecas neutras y baja las mancuernas de forma controlada sin abrir en exceso los codos.',
    'press-inclinado-barra':'Ajusta el banco a una inclinación moderada, mantén el pecho alto y lleva la barra hacia la parte superior del pectoral con control.',
    'press-inclinado-mancuernas':'Apoya bien la espalda, controla la bajada y empuja siguiendo una trayectoria ligeramente hacia dentro sin chocar las mancuernas.',
    'press-declinado-barra':'Fija bien los pies, mantén la cabeza en la parte baja del banco y lleva la barra hacia la zona inferior del pecho sin perder tensión.',
    'press-declinado-mancuernas':'Asegura los pies en el banco declinado, mantén las muñecas neutras y controla las mancuernas sobre la zona inferior del pecho.',
    'press-pecho-maquina':'Ajusta el asiento para que las empuñaduras queden a la altura del pecho y mantén la espalda apoyada durante todo el recorrido.',
    'press-inclinado-maquina':'Ajusta el asiento para que el empuje salga desde el pectoral superior; espalda y cabeza siempre apoyadas y movimiento sin rebotes.',
    'press-declinado-maquina':'Mantén el pecho estable y empuja desde una posición baja hacia delante, evitando despegar la espalda del respaldo.',
    'press-convergente-maquina':'Sigue la trayectoria convergente de la máquina sin forzar las muñecas y aprieta el pectoral al final sin bloquear los codos.',
    'press-pecho-iso-lateral':'Empuja ambos brazos de forma equilibrada y evita que un lado adelante al otro; mantén hombros bajos y espalda apoyada.',
    'press-inclinado-iso-lateral':'Controla cada brazo de forma independiente y mantén la misma trayectoria en ambos lados para trabajar el pectoral superior de forma simétrica.',
    'press-banca-multipower':'Coloca el banco de forma que la barra descienda al centro del pecho y mantén escápulas y pies firmes durante todo el recorrido guiado.',
    'press-inclinado-multipower':'Alinea el banco con la barra para que baje a la parte alta del pecho y evita elevar los hombros al empujar.',
    'aperturas-pec-deck':'Mantén una ligera flexión de codos y la espalda pegada al respaldo; junta los brazos con el pectoral sin lanzar los hombros hacia delante.',
    'aperturas-mancuernas-plano':'Abre los brazos en un arco amplio con codos ligeramente flexionados y detén la bajada cuando pierdas tensión o estabilidad en el hombro.',
    'aperturas-inclinadas-mancuernas':'Mantén el banco inclinado, codos suaves y una trayectoria en arco; busca estiramiento del pectoral superior sin forzar el hombro.',
    'cruces-polea-media':'Coloca las poleas a la altura del pecho, mantén una ligera flexión de codos y cierra horizontalmente delante del esternón sin balancearte.',
    'cruces-polea-alta':'Parte con las poleas altas y lleva las manos hacia delante y abajo con control, manteniendo el pecho alto y el torso estable.',
    'cruces-polea-baja':'Parte con las poleas bajas y lleva las manos hacia delante y arriba sin encoger los hombros, manteniendo tensión continua en el pectoral superior.',
    'aperturas-polea-banco':'Centra el banco entre las poleas, mantén los codos ligeramente flexionados y cierra los brazos en arco sin perder la posición de los hombros.',
    'flexiones':'Mantén el cuerpo alineado, el core activo y baja el pecho de forma controlada sin elevar la cadera ni abrir demasiado los codos.',
    'fondos-paralelas-pectoral':'Inclina ligeramente el torso hacia delante, baja de forma controlada y evita encoger los hombros para mantener el énfasis en el pectoral.',
    'pullover-mancuerna':'Mantén una ligera flexión de codos y mueve la mancuerna en un arco controlado por detrás de la cabeza; no bajes más allá de donde puedas mantener espalda y hombros estables.'
  };

  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function fallback(ex){
    const n=norm([ex?.name,ex?.muscle,ex?.equipment,ex?.category].filter(Boolean).join(' '));
    if(/press.*pecho|press banca|press inclinado|press declinado/.test(n))return 'Mantén escápulas y pies estables, controla la bajada y empuja sin perder la posición de los hombros.';
    if(/apertura|cruce|pec deck/.test(n))return 'Mantén una ligera flexión de codos, controla el estiramiento y conserva tensión continua durante todo el recorrido.';
    if(/pullover/.test(n))return 'Mantén los codos ligeramente flexionados y realiza el arco con control, evitando compensar con la zona lumbar.';
    if(/remo/.test(n))return 'Mantén el torso estable, lleva los codos hacia atrás y evita usar impulso para completar la repetición.';
    if(/jalon|dominada/.test(n))return 'Mantén el pecho alto, inicia el movimiento con la espalda y evita tirar solo con los brazos.';
    if(/curl/.test(n))return 'Mantén los codos estables y controla especialmente la fase de bajada sin balancear el torso.';
    if(/triceps|extension|patada/.test(n))return 'Mantén los codos estables y completa la extensión con control, evitando usar impulso.';
    if(/sentadilla|prensa|cuadriceps/.test(n))return 'Mantén los apoyos firmes, controla la bajada y conserva la alineación de rodillas y cadera durante todo el recorrido.';
    if(/femoral|isquio|peso muerto rumano/.test(n))return 'Mantén la espalda neutra y controla la cadera para conservar la tensión en la cadena posterior.';
    if(/hip thrust|glute|abduccion/.test(n))return 'Controla la pelvis y termina el movimiento con el glúteo, sin hiperextender la zona lumbar.';
    if(/gemelo|pantorrilla/.test(n))return 'Completa el recorrido de tobillo con control, evitando rebotes y manteniendo una pausa breve arriba.';
    if(/hombro|elevacion lateral|pajaro|face pull/.test(n))return 'Mantén los hombros estables y controla el recorrido sin usar balanceo ni elevar los trapecios en exceso.';
    if(/abdominal|core|plancha|crunch/.test(n))return 'Mantén el abdomen activo y controla la respiración, evitando compensar con la zona lumbar.';
    return 'Prioriza una técnica limpia, un recorrido controlado y la misma calidad de ejecución en todas las repeticiones.';
  }

  function libraryHit(ex){
    const list=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];
    const id=String(ex?.id??ex?.exerciseId??ex?.exercise_id??'').trim();
    if(id){const hit=list.find(x=>String(x?.id??'')===id);if(hit)return hit;}
    const name=norm(ex?.name??ex?.nombre??ex?.exercise??ex?.exerciseName);
    return name?list.find(x=>norm(x?.name)===name)||null:null;
  }

  function adviceFor(ex){
    const hit=libraryHit(ex)||ex||{};
    const id=String(ex?.id??hit?.id??'');
    return String(ex?.clientAdvice||hit?.clientAdvice||exact[id]||fallback(hit)).trim();
  }
  window.dccExerciseAdvice=adviceFor;

  function enrichLibrary(){
    const list=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];
    list.forEach(ex=>{
      const advice=exact[String(ex?.id||'')]||fallback(ex);
      ex.clientAdvice=advice;
      ex.coachTip=advice;
      ex.tips=[advice];
    });
  }

  function removeListAdvice(){
    document.querySelectorAll('.dcc-exercise-client-advice').forEach(el=>el.remove());
  }

  function ensureStyle(){
    if(document.getElementById('dcc-active-exercise-advice-style'))return;
    const style=document.createElement('style');
    style.id='dcc-active-exercise-advice-style';
    style.textContent=`
      #client-main .dcc-active-exercise-advice{margin:0 0 12px;padding:13px 14px;border:1px solid rgba(224,173,76,.48);border-radius:16px;background:linear-gradient(145deg,rgba(217,170,74,.08),rgba(10,14,18,.97));box-shadow:0 10px 24px rgba(0,0,0,.18)}
      #client-main .dcc-active-exercise-advice b{display:block;margin-bottom:5px;color:#e0ad4c;font-size:9px;font-weight:900;letter-spacing:1.8px;text-transform:uppercase}
      #client-main .dcc-active-exercise-advice p{margin:0;color:#e7e4dd;font-size:11.5px;line-height:1.48}
    `;
    document.head.appendChild(style);
  }

  function renderActiveAdvice(){
    removeListAdvice();
    ensureStyle();
    const main=document.getElementById('client-main');
    if(!main)return;
    const workout=window.activeWorkout;
    if(!workout){main.querySelectorAll('.dcc-active-exercise-advice').forEach(x=>x.remove());return;}
    const ex=workout.exercises?.[Number(workout.currentExercise)||0];
    if(!ex)return;
    const advice=adviceFor(ex);
    let box=main.querySelector('.dcc-active-exercise-advice');
    if(!box){box=document.createElement('section');box.className='dcc-active-exercise-advice';}
    const sig=`${workout.currentExercise}|${norm(ex?.name)}|${advice}`;
    if(box.dataset.sig!==sig){box.dataset.sig=sig;box.innerHTML=`<b>Consejo del ejercicio</b><p>${esc(advice)}</p>`;}

    /* Preferimos colocarlo justo antes del bloque donde el cliente registra la serie. */
    const input=main.querySelector('#workout-kg');
    const anchor=input?.closest('.card')||main.querySelector('.card');
    if(anchor&&box.parentNode!==anchor.parentNode)anchor.parentNode.insertBefore(box,anchor);
    else if(anchor&&box.nextSibling!==anchor)anchor.parentNode.insertBefore(box,anchor);
    else if(!anchor&&!box.isConnected)main.prepend(box);
  }

  let queued=false;
  function schedule(){
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;renderActiveAdvice();});
  }

  function boot(){
    enrichLibrary();
    removeListAdvice();
    renderActiveAdvice();
    const main=document.getElementById('client-main');
    if(main&&!main.__dccExerciseAdviceObserver){
      const observer=new MutationObserver(schedule);
      observer.observe(main,{childList:true,subtree:true});
      main.__dccExerciseAdviceObserver=observer;
    }
  }

  window.addEventListener('dcc:exercise-library-ready',()=>{enrichLibrary();schedule();});
  document.addEventListener('DOMContentLoaded',boot);
  boot();
  setTimeout(boot,300);
  setTimeout(boot,1200);
})();
