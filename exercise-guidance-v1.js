/* DCC — biblioteca completa + consejo técnico visible para el cliente */
(function(){
  'use strict';
  if(window.__dccExerciseGuidanceV1)return;
  window.__dccExerciseGuidanceV1=true;

  const PECTORAL_URL='./entrenamientos/pectoral-definitivo.json?v=20260911-1';
  const GOLD='#e0ad4c';

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

  const norm=value=>String(value||'').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ').trim();

  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function fallbackAdvice(ex){
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

  function library(){return Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[]}

  function libraryHit(exercise){
    const list=library();
    const id=String(exercise?.id??exercise?.exerciseId??exercise?.exercise_id??'').trim();
    if(id){const hit=list.find(x=>String(x?.id??'')===id);if(hit)return hit;}
    const name=norm(exercise?.name??exercise?.nombre??exercise?.exercise??exercise?.exerciseName);
    return name?list.find(x=>norm(x?.name)===name)||null:null;
  }

  function adviceFor(exercise){
    if(!exercise)return fallbackAdvice({});
    const hit=libraryHit(exercise)||exercise;
    const id=String(hit?.id??exercise?.id??'');
    return String(exercise?.clientAdvice||hit?.clientAdvice||exact[id]||fallbackAdvice(hit)).trim();
  }
  window.dccExerciseAdvice=adviceFor;

  function applyAdviceToLibrary(){
    const list=library();
    if(!list.length)return false;
    list.forEach(ex=>{
      const advice=exact[String(ex?.id||'')]||fallbackAdvice(ex);
      ex.clientAdvice=advice;
      ex.coachTip=advice;
      ex.tips=[advice];
    });
    return true;
  }

  let pectoralPromise=null;
  async function installPectoral24(){
    const list=library();
    if(!list.length)return false;
    if(pectoralPromise)return pectoralPromise;
    pectoralPromise=(async()=>{
      try{
        const response=await fetch(PECTORAL_URL,{cache:'no-store'});
        if(!response.ok)throw new Error('HTTP '+response.status);
        const payload=await response.json();
        const records=Array.isArray(payload?.ejercicios)?payload.ejercicios:[];
        if(records.length!==24)throw new Error('Catálogo pectoral incompleto');

        const previous=new Map(list.filter(ex=>norm(ex?.muscle)==='pectoral').map(ex=>[String(ex.id),ex]));
        const keep=list.filter(ex=>norm(ex?.muscle)!=='pectoral');
        const pectoral=records.map(raw=>{
          const old=previous.get(String(raw.id))||{};
          let image=old.image||old.imageStart||'';
          if(raw.id==='pullover-mancuerna'&&!image)image='./pull-over.png';
          return {
            ...old,
            id:raw.id,
            name:raw.nombre,
            muscle:'Pectoral',
            secondaryMuscles:old.secondaryMuscles||[],
            equipment:raw.equipo||'',
            image,
            imageStart:image,
            imagePeak:image,
            videoOptional:old.videoOptional||'',
            aliases:old.aliases||[],
            description:raw.enfoque||'',
            instructions:old.instructions||[],
            difficulty:old.difficulty||'',
            category:raw.patron||'',
            variationGroup:old.variationGroup||'',
            isUnilateral:/unilateral|iso-lateral/i.test(String(raw.id)+' '+String(raw.nombre)),
            isBodyweight:raw.equipo==='Peso corporal',
            source:'DCC',
            clientAdvice:exact[raw.id]||fallbackAdvice(raw),
            coachTip:exact[raw.id]||fallbackAdvice(raw),
            tips:[exact[raw.id]||fallbackAdvice(raw)]
          };
        });

        list.length=0;
        [...keep,...pectoral].forEach(ex=>list.push(ex));
        applyAdviceToLibrary();
        window.dispatchEvent(new CustomEvent('dcc:exercise-guidance-ready',{detail:{group:'Pectoral',pectoral:24,total:list.length}}));
        return true;
      }catch(error){
        console.error('DCC — catálogo pectoral definitivo:',error);
        applyAdviceToLibrary();
        return false;
      }
    })();
    return pectoralPromise;
  }

  function routineDays(id){
    const raw=window.data?.routines?.[id];
    return Array.isArray(raw)?raw:Array.isArray(raw?.routine)?raw.routine:[];
  }

  function enrichRoutineExercise(ex){
    if(!ex)return false;
    const advice=adviceFor(ex);
    let changed=false;
    if(ex.clientAdvice!==advice){ex.clientAdvice=advice;changed=true;}
    if(!Array.isArray(ex.tips)||ex.tips[0]!==advice){ex.tips=[advice];changed=true;}
    const hit=libraryHit(ex);
    if(hit&& !ex.id){ex.id=hit.id;changed=true;}
    return changed;
  }

  function enrichAllRoutines(){
    const routines=window.data?.routines;
    if(!routines||typeof routines!=='object')return false;
    let changed=false;
    Object.keys(routines).forEach(id=>routineDays(id).forEach(day=>(day?.exercises||[]).forEach(ex=>{if(enrichRoutineExercise(ex))changed=true;})));
    if(changed){try{if(typeof window.saveData==='function')window.saveData();}catch(_){} }
    return changed;
  }

  function wrapAdders(){
    const choose=window.dccChooseRoutineExercise;
    if(typeof choose==='function'&&!choose.__dccAdviceV1){
      const wrapped=function(id,di,eid){
        const before=routineDays(id)[di]?.exercises?.length||0;
        const result=choose.apply(this,arguments);
        const arr=routineDays(id)[di]?.exercises||[];
        if(arr.length>before){enrichRoutineExercise(arr[arr.length-1]);try{if(typeof window.saveData==='function')window.saveData();}catch(_){} }
        return result;
      };
      wrapped.__dccAdviceV1=true;
      window.dccChooseRoutineExercise=wrapped;
    }

    const manual=window.dccAddManualRoutineExercise;
    if(typeof manual==='function'&&!manual.__dccAdviceV1){
      const wrapped=function(id,di){
        const before=routineDays(id)[di]?.exercises?.length||0;
        const result=manual.apply(this,arguments);
        const arr=routineDays(id)[di]?.exercises||[];
        if(arr.length>before){enrichRoutineExercise(arr[arr.length-1]);try{if(typeof window.saveData==='function')window.saveData();}catch(_){} }
        return result;
      };
      wrapped.__dccAdviceV1=true;
      window.dccAddManualRoutineExercise=wrapped;
    }

    const legacy=window.addExercise;
    if(typeof legacy==='function'&&!legacy.__dccAdviceV1){
      const wrapped=async function(id,di){
        const before=routineDays(id)[di]?.exercises?.length||0;
        const result=await legacy.apply(this,arguments);
        const arr=routineDays(id)[di]?.exercises||[];
        if(arr.length>before){
          enrichRoutineExercise(arr[arr.length-1]);
          try{if(typeof window.saveData==='function')window.saveData();}catch(_){}
          try{if(typeof window.saveRoutineToSupabase==='function')await window.saveRoutineToSupabase(id);}catch(error){console.warn('DCC — consejo ejercicio sync:',error)}
        }
        return result;
      };
      wrapped.__dccAdviceV1=true;
      window.addExercise=wrapped;
    }
  }

  function ensureCss(){
    if(document.getElementById('dcc-exercise-guidance-css'))return;
    const style=document.createElement('style');
    style.id='dcc-exercise-guidance-css';
    style.textContent=`
      #client-main .dcc-exercise-client-advice{margin-top:8px;padding:8px 10px;border-left:2px solid ${GOLD};border-radius:0 10px 10px 0;background:linear-gradient(90deg,rgba(224,173,76,.10),rgba(224,173,76,.025));color:#bfc5ce;font-size:10.5px;line-height:1.42}
      #client-main .dcc-exercise-client-advice b{display:block;margin-bottom:3px;color:${GOLD};font-size:8px;letter-spacing:1.6px;text-transform:uppercase}
      #client-main .dwa3-tip{border-color:rgba(224,173,76,.68)!important;background:radial-gradient(circle at 100% 0,rgba(224,173,76,.09),transparent 42%),linear-gradient(145deg,#15191f,#0a0e13 74%)!important}
      #client-main .dwa3-tip-body{color:#d2d6dc!important}
    `;
    document.head.appendChild(style);
  }

  function decorateClientAdvice(){
    ensureCss();

    document.querySelectorAll('#client-main .dct-exercise').forEach(card=>{
      const name=(card.querySelector('.dct-exercise-name')?.textContent||'').trim();
      if(!name)return;
      const advice=adviceFor({name});
      const copy=card.querySelector('.dct-exercise-copy')||card;
      let box=card.querySelector('.dcc-exercise-client-advice');
      if(!box){box=document.createElement('div');box.className='dcc-exercise-client-advice';copy.appendChild(box);}
      const signature=name+'|'+advice;
      if(box.dataset.sig!==signature){box.dataset.sig=signature;box.innerHTML=`<b>Consejo del ejercicio</b>${esc(advice)}`;}
    });

    const workout=window.activeWorkout;
    const body=document.querySelector('#client-main .dwa3-tip-body');
    const card=document.querySelector('#client-main .dwa3-tip');
    if(workout&&body&&card){
      const ex=workout.exercises?.[workout.currentExercise];
      if(ex){
        const advice=adviceFor(ex);
        if(body.textContent!==advice)body.textContent=advice;
        card.classList.add('open');
        card.querySelector('.dwa3-tip-toggle')?.setAttribute('aria-expanded','true');
        const head=card.querySelector('.head');
        if(head)head.textContent='CONSEJO DEL EJERCICIO';
      }
    }
  }

  let observer=null;
  function observe(){
    if(observer)return;
    observer=new MutationObserver(()=>decorateClientAdvice());
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }

  async function boot(){
    applyAdviceToLibrary();
    await installPectoral24();
    applyAdviceToLibrary();
    enrichAllRoutines();
    wrapAdders();
    decorateClientAdvice();
    observe();
    setTimeout(()=>{wrapAdders();enrichAllRoutines();decorateClientAdvice();},300);
    setTimeout(()=>{wrapAdders();enrichAllRoutines();decorateClientAdvice();},1200);
  }

  window.addEventListener('dcc:exercise-library-ready',()=>{pectoralPromise=null;boot();});
  window.addEventListener('dcc:premium-exercise-images-ready',()=>{applyAdviceToLibrary();decorateClientAdvice();});
  boot();
})();
