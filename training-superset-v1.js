/* DCC — superseries 2–4 + REST-pause.
   v2: sin MutationObserver para no interferir con la selección de ejercicios.
*/
(function(){
  'use strict';

  const BUILD='20260918-superset-restpause-v2';
  if(window.__dccTrainingMethods===BUILD)return;
  window.__dccTrainingMethods=BUILD;

  const drafts={};

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  const notify=message=>{
    try{
      if(typeof window.toast==='function')window.toast(message);
      else if(typeof toast==='function')toast(message);
    }catch(_){}
  };

  function routineDays(id){
    let raw;
    try{raw=data?.routines?.[id]}catch(_){raw=window.data?.routines?.[id]}
    return Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.routine)
        ? raw.routine
        : [];
  }

  function dayRef(id,di){
    return routineDays(id)?.[Number(di)]||null;
  }

  function library(){
    return Array.isArray(window.exerciseLibraryFull)
      ? window.exerciseLibraryFull
      : [];
  }

  function save(){
    try{
      if(typeof window.saveData==='function')window.saveData();
      else if(typeof saveData==='function')saveData();
    }catch(_){}
  }

  function draftKey(id,di){
    return String(id)+'|'+String(di);
  }

  function getDraft(id,di){
    const key=draftKey(id,di);
    if(!drafts[key]){
      drafts[key]={
        supersetRounds:3,
        supersetRest:90,
        restPauseBlocks:3,
        restPauseSeconds:20
      };
    }
    return drafts[key];
  }

  function clearDraft(id,di){
    delete drafts[draftKey(id,di)];
  }

  function selectedLibraryExercises(day){
    const lib=library();
    const ids=Array.isArray(day?.selectedExerciseIds)
      ? day.selectedExerciseIds
      : [];

    return ids
      .map(id=>lib.find(ex=>String(ex?.id)===String(id)))
      .filter(Boolean);
  }

  function parsePickerContext(){
    const root=document.getElementById('coach-main');
    if(!root)return null;

    const button=[...root.querySelectorAll('button')]
      .find(btn=>(btn.getAttribute('onclick')||'').includes('addManualTrainingExercise'));

    if(!button)return null;

    const match=(button.getAttribute('onclick')||'')
      .match(/addManualTrainingExercise\('([^']+)',\s*(\d+)\)/);

    if(!match)return null;

    return {
      id:match[1],
      di:Number(match[2]),
      button
    };
  }

  function installStyle(){
    if(document.getElementById('dcc-training-methods-style'))return;

    const style=document.createElement('style');
    style.id='dcc-training-methods-style';
    style.textContent=`
      #coach-main .dcc-methods-wrap{margin-top:12px;display:grid;gap:9px}
      #coach-main .dcc-method-card{
        padding:13px;border:1px solid rgba(190,137,30,.48);
        border-radius:15px;background:#fff9e9;color:#17191d
      }
      #coach-main .dcc-method-head{
        display:flex;align-items:flex-start;justify-content:space-between;gap:10px
      }
      #coach-main .dcc-method-head b{
        display:block;color:#7f5409;font-size:15px;font-weight:900
      }
      #coach-main .dcc-method-head span{
        color:#9a650c;font-size:9px;font-weight:850;white-space:nowrap
      }
      #coach-main .dcc-method-copy{
        margin:7px 0;color:#6f747c;font-size:10px;line-height:1.4
      }
      #coach-main .dcc-method-selected{
        margin:0 0 9px;padding:8px 9px;border-radius:10px;background:rgba(217,170,74,.10);
        color:#7b5a1c;font-size:9px;font-weight:750;line-height:1.35
      }
      #coach-main .dcc-method-grid{
        display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:9px
      }
      #coach-main .dcc-method-grid label{
        color:#5f6670;font-size:10px;font-weight:800
      }
      #coach-main .dcc-method-grid input{
        width:100%;min-height:40px;margin-top:4px;box-sizing:border-box
      }
      #coach-main .dcc-method-grid small{
        display:block;margin-top:2px;color:#8a9098;font-size:8px
      }
      #coach-main .dcc-method-action{
        width:100%;min-height:46px;border:1px solid #c58b1d;border-radius:12px;
        background:linear-gradient(135deg,#f3cf69,#d9a63d);color:#17120a;
        font-size:12px;font-weight:900
      }
      #coach-main .dcc-method-action:disabled{
        border-color:#d8d0c3;background:#eee8dc;color:#989084
      }
      #coach-main .dcc-method-config{
        margin-top:12px;padding:14px;border:1px solid rgba(217,170,74,.62);
        border-radius:17px;background:rgba(217,170,74,.06)
      }
      #coach-main .dcc-method-config-head{
        display:flex;align-items:center;justify-content:space-between;gap:10px
      }
      #coach-main .dcc-method-config-head b{font-size:14px}
      #coach-main .dcc-method-config-head span{
        color:#9a650c;font-size:9px;font-weight:800
      }
      #coach-main .dcc-method-config-names{
        margin-top:6px;color:#6f747c;font-size:10px;line-height:1.4
      }
      #coach-main .dcc-method-config-grid{
        display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:11px
      }
      #coach-main .dcc-method-config-grid label{font-size:11px;font-weight:800}
      #coach-main .dcc-method-config-grid input{
        width:100%;min-height:42px;margin-top:5px;box-sizing:border-box
      }
      #coach-main .dcc-method-config-note{
        margin-top:8px;color:#7a818a;font-size:9px;line-height:1.4
      }
      #coach-main .dcc-method-badge{
        display:inline-flex;align-items:center;margin:0 0 8px;padding:4px 7px;
        border-radius:999px;background:rgba(217,170,74,.14);color:#9a650c;
        font-size:9px;font-weight:850
      }
      #client-main .dcc-method-session{
        margin:0 0 10px;padding:10px 12px;border:1px solid rgba(217,170,74,.45);
        border-radius:14px;background:rgba(217,170,74,.08)
      }
      #client-main .dcc-method-session b{
        display:block;color:#d9aa4a;font-size:11px;letter-spacing:.04em
      }
      #client-main .dcc-method-session span{
        display:block;margin-top:4px;color:#9da5af;font-size:10px;line-height:1.35
      }
    `;
    document.head.appendChild(style);
  }

  function renderMethodControls(id,di,day){
    const draft=getDraft(id,di);
    const selected=selectedLibraryExercises(day);
    const count=selected.length;
    const supersetReady=count>=2&&count<=4;
    const restPauseReady=count===1;
    const names=selected.map(ex=>esc(ex.name||'Ejercicio')).join(' + ');

    return `
      <div class="dcc-method-card">
        <div class="dcc-method-head">
          <b>⚡ Superserie</b>
          <span>2–4 ejercicios</span>
        </div>

        <p class="dcc-method-copy">
          Ejercicios seguidos sin descanso. El descanso empieza al terminar la vuelta completa.
        </p>

        ${names?`<div class="dcc-method-selected">${names}</div>`:''}

        <div class="dcc-method-grid">
          <label>
            Vueltas
            <input data-superset-rounds type="number" min="1" inputmode="numeric" value="${esc(draft.supersetRounds)}">
          </label>

          <label>
            Descanso al terminar
            <input data-superset-rest type="number" min="0" inputmode="numeric" value="${esc(draft.supersetRest)}">
            <small>segundos</small>
          </label>
        </div>

        <button type="button" class="dcc-method-action" data-create-superset ${supersetReady?'':'disabled'}>
          ${supersetReady?`⚡ Añadir como superserie (${count})`:'Selecciona de 2 a 4 ejercicios'}
        </button>
      </div>

      <div class="dcc-method-card">
        <div class="dcc-method-head">
          <b>⏱ REST-pause</b>
          <span>1 ejercicio</span>
        </div>

        <p class="dcc-method-copy">
          Una serie principal seguida de mini-series del mismo ejercicio con pausas muy cortas.
        </p>

        <div class="dcc-method-grid">
          <label>
            Bloques totales
            <input data-restpause-blocks type="number" min="2" inputmode="numeric" value="${esc(draft.restPauseBlocks)}">
          </label>

          <label>
            Pausa corta
            <input data-restpause-seconds type="number" min="5" inputmode="numeric" value="${esc(draft.restPauseSeconds)}">
            <small>segundos</small>
          </label>
        </div>

        <button type="button" class="dcc-method-action" data-create-restpause ${restPauseReady?'':'disabled'}>
          ${restPauseReady?'⏱ Añadir como REST-pause':'Selecciona 1 ejercicio'}
        </button>
      </div>
    `;
  }

  function decoratePicker(){
    installStyle();

    const ctx=parsePickerContext();
    if(!ctx)return;

    const day=dayRef(ctx.id,ctx.di);
    if(!day)return;

    document.getElementById('dcc-methods-wrap')?.remove();

    const wrap=document.createElement('div');
    wrap.id='dcc-methods-wrap';
    wrap.className='dcc-methods-wrap';
    wrap.innerHTML=renderMethodControls(ctx.id,ctx.di,day);

    ctx.button.parentNode.insertBefore(wrap,ctx.button);

    const draft=getDraft(ctx.id,ctx.di);

    const supersetRounds=wrap.querySelector('[data-superset-rounds]');
    const supersetRest=wrap.querySelector('[data-superset-rest]');
    const restPauseBlocks=wrap.querySelector('[data-restpause-blocks]');
    const restPauseSeconds=wrap.querySelector('[data-restpause-seconds]');

    supersetRounds?.addEventListener('input',()=>{
      draft.supersetRounds=Math.max(1,parseInt(supersetRounds.value)||1);
    });

    supersetRest?.addEventListener('input',()=>{
      draft.supersetRest=Math.max(0,parseInt(supersetRest.value)||0);
    });

    restPauseBlocks?.addEventListener('input',()=>{
      draft.restPauseBlocks=Math.max(2,parseInt(restPauseBlocks.value)||2);
    });

    restPauseSeconds?.addEventListener('input',()=>{
      draft.restPauseSeconds=Math.max(5,parseInt(restPauseSeconds.value)||5);
    });

    wrap.querySelector('[data-create-superset]')?.addEventListener('click',()=>{
      createSuperset(ctx.id,ctx.di);
    });

    wrap.querySelector('[data-create-restpause]')?.addEventListener('click',()=>{
      createRestPause(ctx.id,ctx.di);
    });
  }

  function hasDuplicate(day,selected){
    const existingIds=new Set(
      (day.exercises||[])
        .map(ex=>String(ex?.libraryId||ex?.id||''))
        .filter(Boolean)
    );

    return selected.find(ex=>existingIds.has(String(ex.id)))||null;
  }

  function finishSpecialSelection(id,di,day,message){
    day.trainingSetupStep='exerciseConfiguration';
    day.trainingSetupStarted=true;
    day.selectedExerciseIds=[];

    clearDraft(id,di);
    save();
    notify(message);

    const ret=window.__dccExercisePickerReturnClientAdmin;

    if(
      ret &&
      String(ret.id)===String(id) &&
      Number(ret.dayIndex)===Number(di) &&
      typeof window.dccClientAdmin==='function'
    ){
      delete window.__dccExercisePickerReturnClientAdmin;
      window.__dccTrainingEdit=true;
      window.__dccTrainingOpen=Number(di);
      window.dccClientAdmin(id,'training');
      return;
    }

    if(typeof window.renderTrainingExerciseConfiguration==='function'){
      window.renderTrainingExerciseConfiguration(id,di);
    }
  }

  function createSuperset(id,di){
    const day=dayRef(id,di);
    if(!day)return;

    const selected=selectedLibraryExercises(day);

    if(selected.length<2||selected.length>4){
      notify('Una superserie debe tener de 2 a 4 ejercicios');
      return;
    }

    if(!Array.isArray(day.exercises))day.exercises=[];

    const duplicate=hasDuplicate(day,selected);
    if(duplicate){
      notify('Uno de los ejercicios ya está añadido a la rutina');
      return;
    }

    const draft=getDraft(id,di);
    const rounds=Math.max(1,parseInt(draft.supersetRounds)||3);
    const rest=Math.max(0,parseInt(draft.supersetRest)||0);
    const supersetId='superset-'+Date.now();

    selected.forEach((ex,index)=>{
      day.exercises.push({
        libraryId:ex.id,
        name:ex.name,
        muscle:ex.muscle,
        image:'',
        sets:String(rounds),
        reps:'',
        restBetweenSets:0,
        restBetweenExercises:0,
        videoUrl:'',
        supersetId,
        supersetOrder:index+1,
        supersetSize:selected.length,
        supersetRounds:rounds,
        supersetRest:rest
      });
    });

    finishSpecialSelection(id,di,day,'Superserie añadida');
  }

  function createRestPause(id,di){
    const day=dayRef(id,di);
    if(!day)return;

    const selected=selectedLibraryExercises(day);

    if(selected.length!==1){
      notify('Selecciona un solo ejercicio para REST-pause');
      return;
    }

    if(!Array.isArray(day.exercises))day.exercises=[];

    const duplicate=hasDuplicate(day,selected);
    if(duplicate){
      notify('Ese ejercicio ya está añadido a la rutina');
      return;
    }

    const draft=getDraft(id,di);
    const blocks=Math.max(2,parseInt(draft.restPauseBlocks)||3);
    const seconds=Math.max(5,parseInt(draft.restPauseSeconds)||20);
    const ex=selected[0];

    day.exercises.push({
      libraryId:ex.id,
      name:ex.name,
      muscle:ex.muscle,
      image:'',
      sets:String(blocks),
      reps:'',
      restBetweenSets:seconds,
      restBetweenExercises:0,
      videoUrl:'',
      restPause:true,
      restPauseBlocks:blocks,
      restPauseSeconds:seconds
    });

    finishSpecialSelection(id,di,day,'REST-pause añadido');
  }

  function methodGroups(day){
    const supersetIds=[
      ...new Set(
        (day?.exercises||[])
          .map(ex=>ex?.supersetId)
          .filter(Boolean)
      )
    ];

    const supersets=supersetIds.map((id,index)=>{
      const items=(day.exercises||[]).filter(ex=>ex.supersetId===id);
      return {
        type:'superset',
        id,
        index:index+1,
        items,
        rounds:Math.max(1,parseInt(items[0]?.supersetRounds)||parseInt(items[0]?.sets)||3),
        rest:Math.max(0,parseInt(items[0]?.supersetRest)||0)
      };
    });

    const restPauses=(day?.exercises||[])
      .map((ex,index)=>({ex,index}))
      .filter(item=>item.ex?.restPause)
      .map((item,index)=>({
        type:'restpause',
        id:'restpause-'+item.index,
        index:index+1,
        exerciseIndex:item.index,
        ex:item.ex,
        blocks:Math.max(2,parseInt(item.ex.restPauseBlocks)||parseInt(item.ex.sets)||3),
        seconds:Math.max(5,parseInt(item.ex.restPauseSeconds)||20)
      }));

    return {supersets,restPauses};
  }

  function updateSuperset(id,di,supersetId,key,value){
    const day=dayRef(id,di);
    if(!day)return;

    const n=key==='rounds'
      ? Math.max(1,parseInt(value)||1)
      : Math.max(0,parseInt(value)||0);

    (day.exercises||[]).forEach(ex=>{
      if(ex.supersetId!==supersetId)return;

      if(key==='rounds'){
        ex.supersetRounds=n;
        ex.sets=String(n);
      }else{
        ex.supersetRest=n;
        ex.restBetweenSets=0;
        ex.restBetweenExercises=0;
      }
    });

    save();
  }

  function updateRestPause(id,di,exerciseIndex,key,value){
    const day=dayRef(id,di);
    const ex=day?.exercises?.[exerciseIndex];
    if(!ex)return;

    if(key==='blocks'){
      const blocks=Math.max(2,parseInt(value)||2);
      ex.restPauseBlocks=blocks;
      ex.sets=String(blocks);
    }else{
      const seconds=Math.max(5,parseInt(value)||5);
      ex.restPauseSeconds=seconds;
      ex.restBetweenSets=seconds;
    }

    save();
  }

  function decorateConfiguration(id,di){
    installStyle();

    const day=dayRef(id,di);
    const root=document.getElementById('coach-main');
    if(!day||!root)return;

    root.querySelectorAll('.dcc-method-config').forEach(el=>el.remove());
    root.querySelectorAll('.dcc-method-badge').forEach(el=>el.remove());

    const groups=methodGroups(day);
    if(!groups.supersets.length&&!groups.restPauses.length)return;

    const cards=[...root.querySelectorAll('.card')];

    const globalRestCard=cards.find(card=>
      /Tiempos de descanso \(globales\)/i.test(card.textContent||'')
    );

    groups.supersets.forEach(group=>{
      group.items.forEach(ex=>{
        const exerciseCard=cards.find(card=>
          card!==globalRestCard &&
          (card.textContent||'').includes(ex.name||'') &&
          card.querySelector('input')
        );

        if(exerciseCard&&!exerciseCard.querySelector('.dcc-method-badge')){
          const badge=document.createElement('div');
          badge.className='dcc-method-badge';
          badge.textContent=
            '⚡ Superserie '+group.index+
            ' · '+(ex.supersetOrder||1)+' de '+(ex.supersetSize||group.items.length);
          exerciseCard.insertBefore(badge,exerciseCard.firstChild);
        }
      });

      if(!globalRestCard)return;

      const box=document.createElement('div');
      box.className='dcc-method-config';
      box.innerHTML=`
        <div class="dcc-method-config-head">
          <b>⚡ Superserie ${group.index}</b>
          <span>${group.items.length} ejercicios</span>
        </div>

        <div class="dcc-method-config-names">
          ${group.items.map(ex=>esc(ex.name||'Ejercicio')).join(' → ')}
        </div>

        <div class="dcc-method-config-grid">
          <label>
            Vueltas
            <input data-rounds type="number" min="1" inputmode="numeric" value="${esc(group.rounds)}">
          </label>

          <label>
            Descanso al terminar
            <input data-rest type="number" min="0" inputmode="numeric" value="${esc(group.rest)}">
            <small>segundos</small>
          </label>
        </div>

        <div class="dcc-method-config-note">
          Sin descanso entre ejercicios. El cronómetro empieza al completar cada vuelta.
        </div>
      `;

      globalRestCard.parentNode.insertBefore(box,globalRestCard);

      box.querySelector('[data-rounds]')?.addEventListener('input',event=>{
        updateSuperset(id,di,group.id,'rounds',event.target.value);
      });

      box.querySelector('[data-rest]')?.addEventListener('input',event=>{
        updateSuperset(id,di,group.id,'rest',event.target.value);
      });
    });

    groups.restPauses.forEach(group=>{
      const exerciseCard=cards.find(card=>
        card!==globalRestCard &&
        (card.textContent||'').includes(group.ex.name||'') &&
        card.querySelector('input')
      );

      if(exerciseCard&&!exerciseCard.querySelector('.dcc-method-badge')){
        const badge=document.createElement('div');
        badge.className='dcc-method-badge';
        badge.textContent='⏱ REST-pause';
        exerciseCard.insertBefore(badge,exerciseCard.firstChild);
      }

      if(!globalRestCard)return;

      const box=document.createElement('div');
      box.className='dcc-method-config';
      box.innerHTML=`
        <div class="dcc-method-config-head">
          <b>⏱ REST-pause</b>
          <span>1 ejercicio</span>
        </div>

        <div class="dcc-method-config-names">
          ${esc(group.ex.name||'Ejercicio')}
        </div>

        <div class="dcc-method-config-grid">
          <label>
            Bloques totales
            <input data-blocks type="number" min="2" inputmode="numeric" value="${esc(group.blocks)}">
          </label>

          <label>
            Pausa corta
            <input data-seconds type="number" min="5" inputmode="numeric" value="${esc(group.seconds)}">
            <small>segundos</small>
          </label>
        </div>

        <div class="dcc-method-config-note">
          Primer bloque + mini-series con pausas cortas del mismo ejercicio.
        </div>
      `;

      globalRestCard.parentNode.insertBefore(box,globalRestCard);

      box.querySelector('[data-blocks]')?.addEventListener('input',event=>{
        updateRestPause(id,di,group.exerciseIndex,'blocks',event.target.value);
      });

      box.querySelector('[data-seconds]')?.addEventListener('input',event=>{
        updateRestPause(id,di,group.exerciseIndex,'seconds',event.target.value);
      });
    });

    if(globalRestCard&&!globalRestCard.querySelector('.dcc-method-global-note')){
      const note=document.createElement('div');
      note.className='dcc-method-global-note';
      note.style.cssText='margin-top:8px;color:#8d6a26;font-size:9px;line-height:1.35';
      note.textContent='Superseries y REST-pause usan sus propios tiempos de descanso.';
      globalRestCard.appendChild(note);
    }
  }

  const nativeOpenTrainingExercises=
    typeof window.openTrainingExercises==='function'
      ? window.openTrainingExercises
      : null;

  if(nativeOpenTrainingExercises){
    window.openTrainingExercises=async function(){
      const result=await nativeOpenTrainingExercises.apply(this,arguments);
      requestAnimationFrame(decoratePicker);
      return result;
    };
  }

  const nativeToggleTrainingExercise=
    typeof window.toggleTrainingExercise==='function'
      ? window.toggleTrainingExercise
      : null;

  if(nativeToggleTrainingExercise){
    window.toggleTrainingExercise=function(){
      const result=nativeToggleTrainingExercise.apply(this,arguments);
      requestAnimationFrame(decoratePicker);
      return result;
    };
  }

  const nativeRenderConfiguration=
    typeof window.renderTrainingExerciseConfiguration==='function'
      ? window.renderTrainingExerciseConfiguration
      : null;

  if(nativeRenderConfiguration){
    window.renderTrainingExerciseConfiguration=function(id,di){
      const result=nativeRenderConfiguration.apply(this,arguments);
      requestAnimationFrame(()=>decorateConfiguration(id,di));
      return result;
    };
  }

  function supersetWorkoutContext(){
    const workout=window.activeWorkout;
    if(!workout)return null;

    const ex=workout.exercises?.[Number(workout.currentExercise)||0];
    if(!ex?.supersetId)return null;

    if(!workout.supersetRoundById){
      workout.supersetRoundById={};
    }

    const groupIndices=(workout.exercises||[])
      .map((item,index)=>item?.supersetId===ex.supersetId?index:-1)
      .filter(index=>index>=0)
      .sort((a,b)=>{
        const ao=parseInt(workout.exercises[a]?.supersetOrder)||a;
        const bo=parseInt(workout.exercises[b]?.supersetOrder)||b;
        return ao-bo;
      });

    const position=Math.max(0,groupIndices.indexOf(workout.currentExercise));
    const rounds=Math.max(1,parseInt(ex.supersetRounds)||parseInt(ex.sets)||1);
    const round=Math.max(1,parseInt(workout.supersetRoundById[ex.supersetId])||1);
    const rest=Math.max(
      0,
      parseInt(ex.supersetRest)||
      parseInt(workout.exercises[groupIndices[0]]?.supersetRest)||
      0
    );

    return {workout,ex,groupIndices,position,rounds,round,rest};
  }

  function restPauseWorkoutContext(){
    const workout=window.activeWorkout;
    if(!workout)return null;

    const ex=workout.exercises?.[Number(workout.currentExercise)||0];
    if(!ex?.restPause)return null;

    const blocks=Math.max(2,parseInt(ex.restPauseBlocks)||parseInt(ex.sets)||3);
    const seconds=Math.max(5,parseInt(ex.restPauseSeconds)||20);

    return {workout,ex,blocks,seconds};
  }

  function decorateWorkoutSession(){
    const root=document.getElementById('client-main');
    if(!root)return;

    root.querySelector('.dcc-method-session')?.remove();

    const superset=supersetWorkoutContext();
    const restPause=restPauseWorkoutContext();
    const ctx=superset||restPause;
    if(!ctx)return;

    const top=root.querySelector('.top');
    if(!top)return;

    const banner=document.createElement('div');
    banner.className='dcc-method-session';

    if(superset){
      banner.innerHTML=
        '<b>⚡ SUPERSERIE · VUELTA '+superset.round+' DE '+superset.rounds+'</b>'+
        '<span>Ejercicio '+(superset.ex.supersetOrder||superset.position+1)+' de '+
        (superset.ex.supersetSize||superset.groupIndices.length)+
        ' · sin descanso entre ejercicios · '+superset.rest+' s al completar la vuelta</span>';
    }else{
      const completed=Array.isArray(restPause.workout.sets)
        ? restPause.workout.sets.length
        : 0;

      banner.innerHTML=
        '<b>⏱ REST-PAUSE</b>'+
        '<span>Bloque '+Math.min(completed+1,restPause.blocks)+' de '+restPause.blocks+
        ' · '+restPause.seconds+' s de pausa corta entre bloques</span>';
    }

    top.parentNode.insertBefore(banner,top);
  }

  const nativeRenderWorkoutSession=
    typeof window.renderWorkoutSession==='function'
      ? window.renderWorkoutSession
      : null;

  if(nativeRenderWorkoutSession){
    window.renderWorkoutSession=function(){
      const superset=supersetWorkoutContext();
      const restPause=restPauseWorkoutContext();

      if(superset){
        const ex=superset.ex;
        const originalSets=ex.sets;
        const originalRestSets=ex.restBetweenSets;
        const originalRestExercises=ex.restBetweenExercises;

        ex.sets=1;
        ex.restBetweenSets=0;
        ex.restBetweenExercises=0;

        let result;
        try{
          result=nativeRenderWorkoutSession.apply(this,arguments);
        }finally{
          ex.sets=originalSets;
          ex.restBetweenSets=originalRestSets;
          ex.restBetweenExercises=originalRestExercises;
        }

        requestAnimationFrame(decorateWorkoutSession);
        return result;
      }

      if(restPause){
        restPause.ex.sets=String(restPause.blocks);
        restPause.ex.restBetweenSets=restPause.seconds;
        requestAnimationFrame(decorateWorkoutSession);
      }

      const result=nativeRenderWorkoutSession.apply(this,arguments);
      requestAnimationFrame(decorateWorkoutSession);
      return result;
    };
  }

  function recordSupersetSet(ctx,sets){
    const workout=ctx.workout;
    const ex=ctx.ex;

    if(!Array.isArray(workout.completedExercises)){
      workout.completedExercises=[];
    }

    const existing=workout.completedExercises.find(item=>
      item?.supersetId===ex.supersetId &&
      (
        (ex.libraryId&&item.libraryId===ex.libraryId) ||
        (!ex.libraryId&&item.name===ex.name)
      )
    );

    const copy=JSON.parse(JSON.stringify(sets||[]));

    if(existing){
      existing.sets.push(...copy);
      return;
    }

    workout.completedExercises.push({
      libraryId:ex.libraryId||'',
      name:ex.name||'Ejercicio',
      plannedSets:ctx.rounds,
      plannedReps:ex.reps||'',
      supersetId:ex.supersetId,
      supersetOrder:ex.supersetOrder||ctx.position+1,
      sets:copy
    });
  }

  const nativeSaveWorkoutSet=
    typeof window.saveWorkoutSet==='function'
      ? window.saveWorkoutSet
      : null;

  if(nativeSaveWorkoutSet){
    window.saveWorkoutSet=function(){
      const ctx=supersetWorkoutContext();
      if(!ctx)return nativeSaveWorkoutSet.apply(this,arguments);

      const workout=ctx.workout;

      if(workout.restUntil&&workout.restUntil>Date.now()){
        notify('Espera a que termine el descanso');
        return;
      }

      if(Array.isArray(workout.sets)&&workout.sets.length>=1){
        notify('Esta parte de la superserie ya está completada');
        return;
      }

      const kgInput=document.getElementById('workout-kg');
      const repsInput=document.getElementById('workout-reps');

      if(!kgInput||!repsInput)return;

      const kg=kgInput.value.trim();
      const reps=repsInput.value.trim();

      if(!kg||!reps){
        notify('Introduce peso y repeticiones');
        return;
      }

      const kgValue=parseFloat(kg.replace(',','.'));
      const repsValue=parseInt(reps);

      if(
        !Number.isFinite(kgValue)||
        !Number.isFinite(repsValue)||
        kgValue<0||
        repsValue<=0
      ){
        notify('Introduce valores válidos');
        return;
      }

      if(!Array.isArray(workout.sets))workout.sets=[];

      workout.sets.push({kg:kgValue,reps:repsValue});
      window.nextWorkoutExercise?.();
    };
  }

  const nativeNextWorkoutExercise=
    typeof window.nextWorkoutExercise==='function'
      ? window.nextWorkoutExercise
      : null;

  if(nativeNextWorkoutExercise){
    window.nextWorkoutExercise=function(){
      const ctx=supersetWorkoutContext();
      if(!ctx)return nativeNextWorkoutExercise.apply(this,arguments);

      const workout=ctx.workout;

      if(!workout.sets||!workout.sets.length){
        notify('Registra al menos una serie');
        return;
      }

      recordSupersetSet(ctx,workout.sets);
      workout.sets=[];

      if(ctx.position<ctx.groupIndices.length-1){
        workout.currentExercise=ctx.groupIndices[ctx.position+1];
        workout.restUntil=null;
        workout.restMode=null;

        window.renderWorkoutSession?.();
        notify('Siguiente ejercicio · sin descanso');
        return;
      }

      if(ctx.round<ctx.rounds){
        workout.supersetRoundById[ctx.ex.supersetId]=ctx.round+1;
        workout.currentExercise=ctx.groupIndices[0];

        if(ctx.rest>0){
          workout.restUntil=Date.now()+(ctx.rest*1000);
          workout.restMode='exercise';

          window.renderWorkoutSession?.();
          window.startRestTimer?.();

          notify('Vuelta '+ctx.round+' completada · Descanso '+ctx.rest+' s');
          return;
        }

        workout.restUntil=null;
        workout.restMode=null;
        window.renderWorkoutSession?.();
        notify('Empieza la vuelta '+(ctx.round+1));
        return;
      }

      workout.supersetRoundById[ctx.ex.supersetId]=ctx.rounds;
      workout.currentExercise=Math.max(...ctx.groupIndices)+1;

      if(workout.currentExercise>=workout.exercises.length){
        window.finishWorkout?.();
        return;
      }

      if(ctx.rest>0){
        workout.restUntil=Date.now()+(ctx.rest*1000);
        workout.restMode='exercise';

        window.renderWorkoutSession?.();
        window.startRestTimer?.();

        notify('Superserie completada · Descanso '+ctx.rest+' s');
        return;
      }

      workout.restUntil=null;
      workout.restMode=null;
      window.renderWorkoutSession?.();
      notify('Superserie completada');
    };
  }

  installStyle();
  requestAnimationFrame(decoratePicker);
})();