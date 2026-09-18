/* DCC — superseries de 2–3 ejercicios.
   Capa aislada sobre la versión estable del selector de ejercicios.
*/
(function(){
  'use strict';

  const BUILD='20260918-training-superset-v1';
  if(window.__dccTrainingSuperset===BUILD)return;
  window.__dccTrainingSuperset=BUILD;

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

  function getDraft(id,di){
    const key=String(id)+'|'+String(di);
    if(!drafts[key])drafts[key]={rounds:3,rest:90};
    return drafts[key];
  }

  function clearDraft(id,di){
    delete drafts[String(id)+'|'+String(di)];
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
    const button=[...document.querySelectorAll('#coach-main button')]
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

  function pickerCardHtml(id,di,day){
    const draft=getDraft(id,di);
    const selected=selectedLibraryExercises(day);
    const count=selected.length;
    const ready=count>=2&&count<=3;
    const names=selected.map(ex=>esc(ex.name||'Ejercicio')).join(' + ');

    return `
      <div class="dcc-superset-picker-head">
        <div>
          <b>⚡ Superserie</b>
          <span>2–3 ejercicios seguidos</span>
        </div>
        <strong>${count} seleccionados</strong>
      </div>

      <p class="dcc-superset-picker-copy">
        Haz todos los ejercicios sin descanso entre ellos. El descanso empieza al terminar la vuelta completa.
      </p>

      ${names?`<div class="dcc-superset-picker-selected">${names}</div>`:''}

      <div class="dcc-superset-picker-grid">
        <label>
          Vueltas
          <input data-superset-rounds type="number" min="1" inputmode="numeric" value="${esc(draft.rounds)}">
        </label>

        <label>
          Descanso al terminar
          <input data-superset-rest type="number" min="0" inputmode="numeric" value="${esc(draft.rest)}">
          <small>segundos</small>
        </label>
      </div>

      <button
        type="button"
        class="dcc-superset-create"
        ${ready?'':'disabled'}
      >
        ${ready?`⚡ Añadir como superserie (${count})`:'Selecciona 2 o 3 ejercicios'}
      </button>
    `;
  }

  function installStyle(){
    if(document.getElementById('dcc-superset-style'))return;

    const style=document.createElement('style');
    style.id='dcc-superset-style';
    style.textContent=`
      #coach-main .dcc-superset-picker{
        margin-top:12px;padding:13px;border:1px solid rgba(190,137,30,.48);
        border-radius:15px;background:#fff9e9;color:#17191d
      }
      #coach-main .dcc-superset-picker-head{
        display:flex;align-items:center;justify-content:space-between;gap:10px
      }
      #coach-main .dcc-superset-picker-head b{
        display:block;color:#7f5409;font-size:15px;font-weight:900
      }
      #coach-main .dcc-superset-picker-head span{
        display:block;margin-top:2px;color:#777f89;font-size:9px
      }
      #coach-main .dcc-superset-picker-head strong{
        color:#9a650c;font-size:10px;white-space:nowrap
      }
      #coach-main .dcc-superset-picker-copy{
        margin:8px 0;color:#6f747c;font-size:11px;line-height:1.4
      }
      #coach-main .dcc-superset-picker-selected{
        margin:0 0 9px;padding:8px 9px;border-radius:10px;background:rgba(217,170,74,.10);
        color:#7b5a1c;font-size:10px;font-weight:750;line-height:1.35
      }
      #coach-main .dcc-superset-picker-grid{
        display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:9px
      }
      #coach-main .dcc-superset-picker-grid label{
        color:#5f6670;font-size:10px;font-weight:800
      }
      #coach-main .dcc-superset-picker-grid input{
        width:100%;min-height:40px;margin-top:4px;box-sizing:border-box
      }
      #coach-main .dcc-superset-picker-grid small{
        display:block;margin-top:2px;color:#8a9098;font-size:8px
      }
      #coach-main .dcc-superset-create{
        width:100%;min-height:46px;border:1px solid #c58b1d;border-radius:12px;
        background:linear-gradient(135deg,#f3cf69,#d9a63d);color:#17120a;
        font-size:13px;font-weight:900
      }
      #coach-main .dcc-superset-create:disabled{
        border-color:#d8d0c3;background:#eee8dc;color:#989084
      }
      #coach-main .dcc-superset-config{
        margin-top:12px;padding:14px;border:1px solid rgba(217,170,74,.62);
        border-radius:17px;background:rgba(217,170,74,.06)
      }
      #coach-main .dcc-superset-config-head{
        display:flex;align-items:center;justify-content:space-between;gap:10px
      }
      #coach-main .dcc-superset-config-head b{font-size:14px}
      #coach-main .dcc-superset-config-head span{
        color:#9a650c;font-size:9px;font-weight:800
      }
      #coach-main .dcc-superset-config-names{
        margin-top:6px;color:#6f747c;font-size:10px;line-height:1.4
      }
      #coach-main .dcc-superset-config-grid{
        display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:11px
      }
      #coach-main .dcc-superset-config-grid label{
        font-size:11px;font-weight:800
      }
      #coach-main .dcc-superset-config-grid input{
        width:100%;min-height:42px;margin-top:5px;box-sizing:border-box
      }
      #coach-main .dcc-superset-config-note{
        margin-top:8px;color:#7a818a;font-size:9px;line-height:1.4
      }
      #coach-main .dcc-superset-ex-badge{
        display:inline-flex;align-items:center;margin:0 0 8px;padding:4px 7px;
        border-radius:999px;background:rgba(217,170,74,.14);color:#9a650c;
        font-size:9px;font-weight:850
      }
      #client-main .dcc-superset-session{
        margin:0 0 10px;padding:10px 12px;border:1px solid rgba(217,170,74,.45);
        border-radius:14px;background:rgba(217,170,74,.08)
      }
      #client-main .dcc-superset-session b{
        display:block;color:#d9aa4a;font-size:11px;letter-spacing:.04em
      }
      #client-main .dcc-superset-session span{
        display:block;margin-top:4px;color:#9da5af;font-size:10px;line-height:1.35
      }
    `;
    document.head.appendChild(style);
  }

  function decoratePicker(){
    installStyle();

    const ctx=parsePickerContext();
    if(!ctx)return;

    const day=dayRef(ctx.id,ctx.di);
    if(!day)return;

    document.getElementById('dcc-superset-picker')?.remove();

    const card=document.createElement('div');
    card.id='dcc-superset-picker';
    card.className='dcc-superset-picker';
    card.innerHTML=pickerCardHtml(ctx.id,ctx.di,day);

    ctx.button.parentNode.insertBefore(card,ctx.button);

    const draft=getDraft(ctx.id,ctx.di);

    const rounds=card.querySelector('[data-superset-rounds]');
    const rest=card.querySelector('[data-superset-rest]');
    const create=card.querySelector('.dcc-superset-create');

    rounds?.addEventListener('input',()=>{
      draft.rounds=Math.max(1,parseInt(rounds.value)||1);
    });

    rest?.addEventListener('input',()=>{
      draft.rest=Math.max(0,parseInt(rest.value)||0);
    });

    create?.addEventListener('click',()=>{
      window.dccCreateSelectedSuperset?.(ctx.id,ctx.di);
    });
  }

  window.dccCreateSelectedSuperset=function(id,di){
    const day=dayRef(id,di);
    if(!day)return;

    const selected=selectedLibraryExercises(day);

    if(selected.length<2||selected.length>3){
      notify('Una superserie debe tener 2 o 3 ejercicios');
      return;
    }

    if(!Array.isArray(day.exercises))day.exercises=[];

    const existingIds=new Set(
      day.exercises
        .map(ex=>String(ex?.libraryId||ex?.id||''))
        .filter(Boolean)
    );

    const duplicate=selected.find(ex=>existingIds.has(String(ex.id)));
    if(duplicate){
      notify('Uno de los ejercicios ya está añadido a la rutina');
      return;
    }

    const draft=getDraft(id,di);
    const rounds=Math.max(1,parseInt(draft.rounds)||3);
    const rest=Math.max(0,parseInt(draft.rest)||0);
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

    day.trainingSetupStep='exerciseConfiguration';
    day.trainingSetupStarted=true;
    day.selectedExerciseIds=[];

    clearDraft(id,di);
    save();

    notify('Superserie añadida');

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
  };

  function supersetGroups(day){
    const ids=[
      ...new Set(
        (day?.exercises||[])
          .map(ex=>ex?.supersetId)
          .filter(Boolean)
      )
    ];

    return ids.map((id,index)=>{
      const items=(day.exercises||[]).filter(ex=>ex.supersetId===id);
      return {
        id,
        index:index+1,
        items,
        rounds:Math.max(
          1,
          parseInt(items[0]?.supersetRounds)||
          parseInt(items[0]?.sets)||
          3
        ),
        rest:Math.max(
          0,
          parseInt(items[0]?.supersetRest)||
          0
        )
      };
    });
  }

  function setSupersetRounds(id,di,supersetId,value){
    const day=dayRef(id,di);
    if(!day)return;

    const rounds=Math.max(1,parseInt(value)||1);

    (day.exercises||[]).forEach(ex=>{
      if(ex.supersetId===supersetId){
        ex.supersetRounds=rounds;
        ex.sets=String(rounds);
      }
    });

    save();
  }

  function setSupersetRest(id,di,supersetId,value){
    const day=dayRef(id,di);
    if(!day)return;

    const rest=Math.max(0,parseInt(value)||0);

    (day.exercises||[]).forEach(ex=>{
      if(ex.supersetId===supersetId){
        ex.supersetRest=rest;
        ex.restBetweenSets=0;
        ex.restBetweenExercises=0;
      }
    });

    save();
  }

  function decorateConfiguration(id,di){
    installStyle();

    const day=dayRef(id,di);
    const root=document.getElementById('coach-main');
    if(!day||!root)return;

    root.querySelectorAll('.dcc-superset-config').forEach(el=>el.remove());
    root.querySelectorAll('.dcc-superset-ex-badge').forEach(el=>el.remove());

    const groups=supersetGroups(day);
    if(!groups.length)return;

    const cards=[...root.querySelectorAll('.card')];

    const globalRestCard=cards.find(card=>
      /Tiempos de descanso \(globales\)/i.test(card.textContent||'')
    );

    groups.forEach(group=>{
      group.items.forEach(ex=>{
        const exerciseCard=cards.find(card=>
          card!==globalRestCard &&
          (card.textContent||'').includes(ex.name||'') &&
          card.querySelector('input')
        );

        if(exerciseCard&&!exerciseCard.querySelector('.dcc-superset-ex-badge')){
          const badge=document.createElement('div');
          badge.className='dcc-superset-ex-badge';
          badge.textContent=
            '⚡ Superserie '+group.index+
            ' · '+(ex.supersetOrder||1)+' de '+(ex.supersetSize||group.items.length);
          exerciseCard.insertBefore(badge,exerciseCard.firstChild);
        }
      });

      if(!globalRestCard)return;

      const box=document.createElement('div');
      box.className='dcc-superset-config';
      box.innerHTML=`
        <div class="dcc-superset-config-head">
          <b>⚡ Superserie ${group.index}</b>
          <span>${group.items.length} ejercicios</span>
        </div>

        <div class="dcc-superset-config-names">
          ${group.items.map(ex=>esc(ex.name||'Ejercicio')).join(' → ')}
        </div>

        <div class="dcc-superset-config-grid">
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

        <div class="dcc-superset-config-note">
          Los ejercicios se hacen seguidos. No hay descanso entre ellos; el cronómetro empieza al completar cada vuelta.
        </div>
      `;

      globalRestCard.parentNode.insertBefore(box,globalRestCard);

      box.querySelector('[data-rounds]')?.addEventListener('input',event=>{
        setSupersetRounds(id,di,group.id,event.target.value);
      });

      box.querySelector('[data-rest]')?.addEventListener('input',event=>{
        setSupersetRest(id,di,group.id,event.target.value);
      });
    });

    if(globalRestCard&&!globalRestCard.querySelector('.dcc-superset-global-note')){
      const note=document.createElement('div');
      note.className='dcc-superset-global-note';
      note.style.cssText='margin-top:8px;color:#8d6a26;font-size:9px;line-height:1.35';
      note.textContent='Las superseries usan el descanso configurado en su propio bloque.';
      globalRestCard.appendChild(note);
    }
  }

  const nativeOpenTrainingExercises=
    typeof window.openTrainingExercises==='function'
      ? window.openTrainingExercises
      : null;

  if(nativeOpenTrainingExercises){
    window.openTrainingExercises=async function(id,di){
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

  function workoutContext(){
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
    const rounds=Math.max(
      1,
      parseInt(ex.supersetRounds)||
      parseInt(ex.sets)||
      1
    );

    const round=Math.max(
      1,
      parseInt(workout.supersetRoundById[ex.supersetId])||
      1
    );

    const rest=Math.max(
      0,
      parseInt(ex.supersetRest)||
      parseInt(workout.exercises[groupIndices[0]]?.supersetRest)||
      0
    );

    return {
      workout,
      ex,
      groupIndices,
      position,
      rounds,
      round,
      rest
    };
  }

  function decorateWorkoutSession(ctx,originalSets){
    const root=document.getElementById('client-main');
    if(!root)return;

    root.querySelector('.dcc-superset-session')?.remove();

    const top=root.querySelector('.top');
    if(top){
      const banner=document.createElement('div');
      banner.className='dcc-superset-session';
      banner.innerHTML=
        '<b>⚡ SUPERSERIE · VUELTA '+ctx.round+' DE '+ctx.rounds+'</b>'+
        '<span>Ejercicio '+(ctx.ex.supersetOrder||ctx.position+1)+' de '+
        (ctx.ex.supersetSize||ctx.groupIndices.length)+
        ' · sin descanso entre ejercicios · '+ctx.rest+' s al completar la vuelta</span>';

      top.parentNode.insertBefore(banner,top);

      const muted=top.querySelectorAll('p.muted');
      if(muted[0]){
        muted[0].textContent=
          'Superserie · vuelta '+ctx.round+' de '+ctx.rounds;
      }
      if(muted[1]){
        muted[1].textContent=
          String(originalSets||ctx.rounds)+' vueltas'+
          (ctx.ex.reps?' · '+ctx.ex.reps+' repeticiones':'')+
          ' · sin descanso';
      }
    }

    [...root.querySelectorAll('small.muted')].forEach(el=>{
      if((el.textContent||'').trim()==='SERIES'){
        el.textContent='SUPERSERIE';
        const h2=el.parentElement?.querySelector('h2');
        if(h2)h2.textContent='Vuelta '+ctx.round+' de '+ctx.rounds;
      }
    });
  }

  const nativeRenderWorkoutSession=
    typeof window.renderWorkoutSession==='function'
      ? window.renderWorkoutSession
      : null;

  if(nativeRenderWorkoutSession){
    window.renderWorkoutSession=function(){
      const ctx=workoutContext();

      if(!ctx){
        return nativeRenderWorkoutSession.apply(this,arguments);
      }

      const originalSets=ctx.ex.sets;
      const originalRestSets=ctx.ex.restBetweenSets;
      const originalRestExercises=ctx.ex.restBetweenExercises;

      ctx.ex.sets=1;
      ctx.ex.restBetweenSets=0;
      ctx.ex.restBetweenExercises=0;

      let result;

      try{
        result=nativeRenderWorkoutSession.apply(this,arguments);
      }finally{
        ctx.ex.sets=originalSets;
        ctx.ex.restBetweenSets=originalRestSets;
        ctx.ex.restBetweenExercises=originalRestExercises;
      }

      requestAnimationFrame(()=>{
        const fresh=workoutContext();
        if(fresh)decorateWorkoutSession(fresh,originalSets);
      });

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
      const ctx=workoutContext();
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

      workout.sets.push({
        kg:kgValue,
        reps:repsValue
      });

      window.nextWorkoutExercise?.();
    };
  }

  const nativeNextWorkoutExercise=
    typeof window.nextWorkoutExercise==='function'
      ? window.nextWorkoutExercise
      : null;

  if(nativeNextWorkoutExercise){
    window.nextWorkoutExercise=function(){
      const ctx=workoutContext();
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

          notify(
            'Vuelta '+ctx.round+
            ' completada · Descanso '+ctx.rest+' s'
          );
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

  function scheduleDecorate(){
    requestAnimationFrame(()=>{
      decoratePicker();

      const root=document.getElementById('coach-main');
      if(!root)return;

      const saveButton=[...root.querySelectorAll('button')]
        .find(btn=>/Guardar rutina/i.test(btn.textContent||''));

      if(saveButton){
        const onclick=saveButton.getAttribute('onclick')||'';
        const match=onclick.match(/saveConfiguredTraining\('([^']+)',\s*(\d+)\)/);
        if(match)decorateConfiguration(match[1],Number(match[2]));
      }
    });
  }

  installStyle();

  const coachMain=document.getElementById('coach-main');
  if(coachMain){
    const observer=new MutationObserver(scheduleDecorate);
    observer.observe(coachMain,{childList:true,subtree:true});
  }

  document.addEventListener('DOMContentLoaded',scheduleDecorate,{once:true});
  window.addEventListener('pageshow',scheduleDecorate);
  scheduleDecorate();
})();