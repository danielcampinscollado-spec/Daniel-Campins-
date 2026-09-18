/* DCC — selector compacto de ejercicios + superseries + REST-pause.
   v3: flujo LIGHT, selección primero y configuración completa al final.
*/
(function(){
  'use strict';

  const BUILD='20260918-training-methods-v3';
  if(window.__dccTrainingMethods===BUILD)return;
  window.__dccTrainingMethods=BUILD;

  const pickerMode={};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const notify=message=>{try{if(typeof window.toast==='function')window.toast(message);else if(typeof toast==='function')toast(message);}catch(_){}};

  function routineDays(id){
    let raw;
    try{raw=data?.routines?.[id]}catch(_){raw=window.data?.routines?.[id]}
    return Array.isArray(raw)?raw:Array.isArray(raw?.routine)?raw.routine:[];
  }
  function dayRef(id,di){return routineDays(id)?.[Number(di)]||null;}
  function library(){return Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];}
  function save(){try{if(typeof window.saveData==='function')window.saveData();else if(typeof saveData==='function')saveData();}catch(_){}}
  function key(id,di){return String(id)+'|'+String(di);}
  function mode(id,di){return pickerMode[key(id,di)]||'normal';}
  function setMode(id,di,value){pickerMode[key(id,di)]=value;}

  function selectedLibraryExercises(day){
    const lib=library();
    const ids=Array.isArray(day?.selectedExerciseIds)?day.selectedExerciseIds:[];
    return ids.map(id=>lib.find(ex=>String(ex?.id)===String(id))).filter(Boolean);
  }

  function parsePickerContext(){
    const root=document.getElementById('coach-main');
    if(!root)return null;
    const button=[...root.querySelectorAll('button')].find(btn=>(btn.getAttribute('onclick')||'').includes('addManualTrainingExercise'));
    if(!button)return null;
    const match=(button.getAttribute('onclick')||'').match(/addManualTrainingExercise\('([^']+)',\s*(\d+)\)/);
    if(!match)return null;
    return {id:match[1],di:Number(match[2]),button,root};
  }

  function installStyle(){
    if(document.getElementById('dcc-training-methods-style'))return;
    const style=document.createElement('style');
    style.id='dcc-training-methods-style';
    style.textContent=`
      #coach-main .dcc-mode-wrap{margin:2px 0 10px}
      #coach-main .dcc-mode-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
      #coach-main .dcc-mode-tab{min-height:42px;padding:7px 5px;border:1px solid rgba(183,123,19,.18);border-radius:11px;background:#fffdf9;color:#5f6670;font-size:10px;font-weight:850;line-height:1.15}
      #coach-main .dcc-mode-tab.is-active{border-color:#d9aa4a;background:rgba(217,170,74,.14);color:#8c5a08}
      #coach-main .dcc-mode-hint{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:7px;padding:8px 10px;border:1px solid rgba(183,123,19,.14);border-radius:11px;background:#fffdf9;color:#6f747c;font-size:10px;line-height:1.3}
      #coach-main .dcc-mode-hint b{color:#8c5a08}
      #coach-main .dcc-mode-add{flex:0 0 auto;min-height:34px;padding:7px 10px;border:1px solid #d9aa4a;border-radius:9px;background:linear-gradient(135deg,#f3cf69,#d9a63d);color:#17120a;font-size:10px;font-weight:900}
      #coach-main .dcc-mode-add:disabled{border-color:#ddd4c5;background:#eee8dc;color:#999184}
      #coach-main .dcc-method-badge{display:inline-flex;align-items:center;margin:0 0 7px;padding:4px 7px;border-radius:999px;background:rgba(217,170,74,.13);color:#9a650c;font-size:9px;font-weight:850}
      #coach-main .dcc-method-config{margin:8px 0;padding:11px;border:1px solid rgba(217,170,74,.40);border-radius:14px;background:rgba(217,170,74,.055);color:#17191d}
      #coach-main .dcc-method-config-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
      #coach-main .dcc-method-config-head b{font-size:13px}.dcc-method-config-head span{font-size:9px;color:#9a650c;font-weight:850}
      #coach-main .dcc-method-names{margin-top:5px;color:#6f747c;font-size:10px;line-height:1.35}
      #coach-main .dcc-method-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:9px}
      #coach-main .dcc-method-fields.three{grid-template-columns:repeat(3,minmax(0,1fr))}
      #coach-main .dcc-method-fields label{font-size:10px;font-weight:800;color:#4f5660}
      #coach-main .dcc-method-fields input{width:100%;min-height:38px;margin-top:4px;box-sizing:border-box;font-size:12px}
      #coach-main .dcc-method-note{margin-top:7px;color:#7a818a;font-size:9px;line-height:1.35}
      #coach-main .dcc-rest-global-top{margin-top:0!important;margin-bottom:10px!important}
      #coach-main .dcc-rest-global-top .dcc-method-global-note{margin-top:7px;color:#8d6a26;font-size:9px;line-height:1.35}
      #client-main .dcc-method-session{margin:0 0 10px;padding:10px 12px;border:1px solid rgba(217,170,74,.45);border-radius:14px;background:rgba(217,170,74,.08)}
      #client-main .dcc-method-session b{display:block;color:#d9aa4a;font-size:11px;letter-spacing:.04em}
      #client-main .dcc-method-session span{display:block;margin-top:4px;color:#9da5af;font-size:10px;line-height:1.35}
      @media(max-width:430px){#coach-main .dcc-method-fields.three{grid-template-columns:1fr 1fr}#coach-main .dcc-method-fields.three label:first-child{grid-column:1/-1}}
    `;
    document.head.appendChild(style);
  }

  function modeLabel(value){return value==='superset'?'Superserie':value==='restpause'?'REST-pause':'Individual';}
  function renderModeBar(id,di,day){
    const current=mode(id,di);
    const count=Array.isArray(day.selectedExerciseIds)?day.selectedExerciseIds.length:0;
    const special=current==='superset'||current==='restpause';
    const ready=current==='superset'?(count>=2&&count<=4):current==='restpause'?count===1:false;
    const hint=current==='superset'
      ? 'Selecciona <b>2–4 ejercicios</b>. Se harán seguidos y configurarás vueltas y descanso al final.'
      : current==='restpause'
        ? 'Selecciona <b>1 ejercicio</b>. Las repeticiones por bloque y pausas se configuran al final.'
        : 'Selecciona los <b>ejercicios individuales</b> que quieras añadir al día.';
    return `
      <div class="dcc-mode-tabs">
        <button type="button" class="dcc-mode-tab ${current==='normal'?'is-active':''}" data-mode="normal">Ejercicio<br>individual</button>
        <button type="button" class="dcc-mode-tab ${current==='superset'?'is-active':''}" data-mode="superset">Superserie</button>
        <button type="button" class="dcc-mode-tab ${current==='restpause'?'is-active':''}" data-mode="restpause">REST-pause</button>
      </div>
      <div class="dcc-mode-hint">
        <span>${hint}</span>
        ${special?`<button type="button" class="dcc-mode-add" data-add-special ${ready?'':'disabled'}>${ready?'Añadir '+modeLabel(current):current==='superset'?'Elige 2–4':'Elige 1'}</button>`:''}
      </div>`;
  }

  function decoratePicker(){
    installStyle();
    const ctx=parsePickerContext();
    if(!ctx)return;
    const day=dayRef(ctx.id,ctx.di);if(!day)return;
    ctx.root.querySelector('.dcc-mode-wrap')?.remove();
    const wrap=document.createElement('div');wrap.className='dcc-mode-wrap';wrap.innerHTML=renderModeBar(ctx.id,ctx.di,day);
    const top=ctx.root.querySelector('.top');
    if(top&&top.nextSibling)top.parentNode.insertBefore(wrap,top.nextSibling);else ctx.root.insertBefore(wrap,ctx.root.firstChild);
    wrap.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{
      day.selectedExerciseIds=[];setMode(ctx.id,ctx.di,btn.dataset.mode);save();window.openTrainingExercises?.(ctx.id,ctx.di,true);
    }));
    wrap.querySelector('[data-add-special]')?.addEventListener('click',()=>{
      if(mode(ctx.id,ctx.di)==='superset')createSuperset(ctx.id,ctx.di);else createRestPause(ctx.id,ctx.di);
    });
  }

  function hasDuplicate(day,selected){
    const existingIds=new Set((day.exercises||[]).map(ex=>String(ex?.libraryId||ex?.id||'')).filter(Boolean));
    return selected.find(ex=>existingIds.has(String(ex.id)))||null;
  }

  function finishSpecialSelection(id,di,day,message){
    day.trainingSetupStarted=true;day.selectedExerciseIds=[];save();notify(message);
    setMode(id,di,'normal');
    window.openTrainingExercises?.(id,di,true);
  }

  function createSuperset(id,di){
    const day=dayRef(id,di);if(!day)return;
    const selected=selectedLibraryExercises(day);
    if(selected.length<2||selected.length>4){notify('Selecciona de 2 a 4 ejercicios para la superserie');return;}
    if(!Array.isArray(day.exercises))day.exercises=[];
    if(hasDuplicate(day,selected)){notify('Uno de esos ejercicios ya está añadido');return;}
    const supersetId='superset-'+Date.now();
    selected.forEach((ex,index)=>day.exercises.push({
      libraryId:ex.id,name:ex.name,muscle:ex.muscle,image:'',sets:'3',reps:'',restBetweenSets:0,restBetweenExercises:0,videoUrl:'',
      supersetId,supersetOrder:index+1,supersetSize:selected.length,supersetRounds:3,supersetRest:null
    }));
    finishSpecialSelection(id,di,day,'Superserie añadida · puedes seguir añadiendo ejercicios');
  }

  function createRestPause(id,di){
    const day=dayRef(id,di);if(!day)return;
    const selected=selectedLibraryExercises(day);
    if(selected.length!==1){notify('Selecciona 1 ejercicio para REST-pause');return;}
    if(!Array.isArray(day.exercises))day.exercises=[];
    if(hasDuplicate(day,selected)){notify('Ese ejercicio ya está añadido');return;}
    const ex=selected[0];
    const finalRest=Math.max(0,parseInt(day.restBetweenExercisesGlobal)||90);
    day.exercises.push({
      libraryId:ex.id,name:ex.name,muscle:ex.muscle,image:'',sets:'4',reps:'12/10/8/6',restBetweenSets:7,restBetweenExercises:finalRest,videoUrl:'',
      restPause:true,restPauseReps:'12/10/8/6',restPauseBlocks:4,restPauseSeconds:7,restPauseFinalRest:finalRest
    });
    finishSpecialSelection(id,di,day,'REST-pause añadido · puedes seguir añadiendo ejercicios');
  }

  function methodGroups(day){
    const supersetIds=[...new Set((day?.exercises||[]).map(ex=>ex?.supersetId).filter(Boolean))];
    const supersets=supersetIds.map((id,index)=>{
      const items=(day.exercises||[]).filter(ex=>ex.supersetId===id);
      const fallback=Math.max(0,parseInt(day.restBetweenSetsGlobal)||0);
      return {id,index:index+1,items,rounds:Math.max(1,parseInt(items[0]?.supersetRounds)||parseInt(items[0]?.sets)||3),rest:items[0]?.supersetRest==null?fallback:Math.max(0,parseInt(items[0].supersetRest)||0)n,   });
    const restPauses=(day?.exercises||[]).map((ex,index)=>({ex,index})).filter(x=>x.ex?.restPause).map((x,index)=>{
      const reps=String(x.ex.restPauseReps||x.ex.reps||'12/10/8/6');
      const blocks=reps.split(/[\/\-–,\s]+/).filter(Boolean).length||4;
      return {index:index+1,exerciseIndex:x.index,ex:x.ex,reps,blocks,seconds:Math.max(1,parseInt(x.ex.restPauseSeconds)||7),finalRest:x.ex.restPauseFinalRest==null?Math.max(0,parseInt(day.restBetweenExercisesGlobal)||90):Math.max(0,parseInt(x.ex.restPauseFinalRest)||0)n;
    });
    return {supersets,restPausesn, }

  function updateSuperset(id,di,supersetId,keyName,value){
    const day=dayRef(id,di);if(!day)return;
    const n=keyName==='rounds'?Math.max(1,parseInt(value)||1):Math.max(0,parseInt(value)||0);
    (day.exercises||[]).forEach(ex=>{if(ex.supersetId!==supersetId)return;if(keyName==='rounds'){ex.supersetRounds=n;ex.sets=String(n);}else{ex.supersetRest=n;ex.restBetweenSets=0;ex.restBetweenExercises=n;}});save();
  }

  function updateRestPause(id,di,exerciseIndex,keyName,value){
    const day=dayRef(id,di);const ex=day?.exercises?.[exerciseIndex];if(!ex)return;
    if(keyName==='reps'){
      const reps=String(value||'').trim()||'12/10/8/6';const blocks=reps.split(/[\/\-–,\s]+/).filter(Boolean).length||4;
      ex.restPauseReps=reps;ex.reps=reps;ex.restPauseBl);
    fis=blocks;ex.sets=String(blocks);
    }else if(keyName==='seconds'){
      const n=Math.max(1,parseInt(value)||1);ex.restPauseSeconds=n;ex.restBetweenSets=n;
    }else{
      const n=Math.max(0,parseInt(value)||0);ex.restPauseFinalRest=n;ex.restBetweenExercises=n;
    }save();
  }

  function decorateConfiguration(id,di){
    installStyle();
    const day=dayRef(id,di),root=document.getElementById('coach-main');if(!day||!root)return;
    root.querySelectorAll('.dcc-method-config,.dcc-method-badge').forEach(el=>el.remove());
    const cards=[...root.querySelectorAll('.card')];
    const globalRestCard=cards.find(card=>/Tiempos de descanso \(globales\)/i.test(card.textContent||''));
    const exerciseContainer=globalRestCard?.previousElementSibling;
    if(globalRestCard&&exerciseContainer){globalRestCard.classList.add('dcc-rest-global-top');exerciseContainer.parentNode.insertBefore(globalRestCard,exerciseContainer);}
    if(globalRestCard&&!globalRestCard.querySelector('.dcc-method-global-note')){
      const note=document.createElement('div');note.className='dcc-method-global-note';note.textContent='Estos tiempos se usan en ejercicios normales. Superserie y REST-pause pueden tener descansos propios.';globalRestCard.appendChild(note);
    }
    const groups=methodGroups(day);
    const currentCards=()=>[...root.querySelectorAll('.card')].filter(c=>c!==globalRestCard);

    groups.supersets.forEach(group=>{
      const groupCards=group.items.map(ex=>currentCards().find(card=>(card.textContent||'').includes(ex.name||'')&&card.querySelector('input'))).filter(Boolean);
      groupCards.forEach((card,i)=>{const badge=document.createElement('div');badge.className='dcc-method-badge';badge.textContent='Superserie · '+(i+1)+'/'+group.items.length;card.insertBefore(badge,card.firstChild);});
      const first=groupCards[0];if(!first)return;
      const box=document.createElement('div');box.className='dcc-method-config';box.innerHTML=`
        <div class="dcc-method-config-head"><b>Superserie · ${group.items.length} ejercicios</b><span>sin descanso entre ellos</span></div>
        <div class="dcc-method-names">${group.items.map(ex=>esc(ex.name||'Ejercicio')).join(' → ')}</div>
        <div class="dcc-method-fields"><label>Vueltas<input data-rounds type="number" min="1" inputmode="numeric" value="${esc(group.rounds)}"></label><label>Descanso tras la vuelta<input data-rest type="number" min="0" inputmode="numeric" value="${esc(group.rest)}"></label></div>
        <div class="dcc-method-note">Los ejercicios se realizan seguidos. Al terminar la vuelta comienza este descanso.</div>`;
      first.parentNode.insertBefore(box,first);
      box.querySelector('[data-rounds]')?.addEventListener('input',e=>updateSuperset(id,di,group.id,'rounds',e.target.value));
      box.querySelector('[data-rest]')?.addEventListener('input',e=>updateSuperset(id,di,group.id,'rest',e.target.value));
    });

    groups.restPauses.forEach(group=>{
      const card=currentCards().find(c=>(c.textContent||'').includes(group.ex.name||'')&&c.querySelector('input'));if(!card)return;
      const badge=document.createElement('div');badge.className='dcc-method-badge';badge.textContent='REST-pause';card.insertBefore(badge,card.firstChild);
      const box=document.createElement('div');box.className='dcc-method-config';box.innerHTML=`
        <div class="dcc-method-config-head"><b>REST-pause</b><span>${esc(group.ex.name||'Ejercicio')}</span></div>
        <div class="dcc-method-fields three">
          <label>Repeticiones<input data-reps type="text" inputmode="text" value="${esc(group.reps)}" placeholder="12/10/8/6"></label>
          <label>Pausa entre bloques<input data-seconds type="number" min="1" inputmode="numeric" value="${esc(group.seconds)}"></label>
          <label>Descanso al terminar<input data-final-rest type="number" min="0" inputmode="numeric" value="${esc(group.finalRest)}"></label>
        </div>
        <div class="dcc-method-note">Ejemplo: 12/10/8/6 con 7 s entre bloques. Puedes cambiar tanto las repeticiones como los dos descansos.</div>`;
      card.parentNode.insertBefore(box,card);
      box.querySelector('[data-reps]')?.addEventListener('change',e=>updateRestPause(id,di,group.exerciseIndex,'reps',e.target.value));
      box.querySelector('[data-seconds]')?.addEventListener('input',e=>updateRestPause(id,di,group.exerciseIndex,'seconds',e.target.value));
      box.querySelector('[data-final-rest]')?.addEventListener('input',e=>updateRestPause(id,di,group.exerciseIndex,'finalRest',e.target.value));
    });
  }

  const nativeOpenTrainingExercises=typeof window.openTrainingExercises==='function'?window.openTrainingExercises:null;
  if(nativeOpenTrainingExercises){window.openTrainingExercises=async function(){const result=await nativeOpenTrainingExercises.apply(this,arguments);requestAnimationFrame(decoratePicker);return result;};}

  const nativeToggleTrainingExercise=typeof window.toggleTrainingExercise==='function'?window.toggleTrainingExercise:null;
  if(nativeToggleTrainingExercise){
    window.toggleTrainingExercise=function(id,di,exerciseId){
      const day=dayRef(id,di);const current=mode(id,di);const selected=Array.isArray(day?.selectedExerciseIds)?day.selectedExerciseIds:[];const already=selected.includes(exerciseId);
      if(!already&&current==='superset'&&selected.length>=4){notify('La superserie admite hasta 4 ejercicios');return;}
      if(!already&&current==='restpause'&&selected.length>=1){notify('REST-pause utiliza 1 ejercicio');return;}
      const result=nativeToggleTrainingExercise.apply(this,arguments);requestAnimationFrame(decoratePicker);return result;
    };
  }

  const nativeContinueSelection=typeof window.continueTrainingExerciseSelection==='function'?window.continueTrainingExerciseSelection:null;
  if(nativeContinueSelection){
    window.continueTrainingExerciseSelection=function(id,di){
      const current=mode(id,di);const day=dayRef(id,di);
      if(current==='superset'&&day?.selectedExerciseIds?.length){notify('Pulsa “Añadir Superserie” antes de continuar');return;}
      if(current==='restpause'&&day?.selectedExerciseIds?.length){notify('Pulsa “Añadir REST-pause” antes de continuar');return;}
      return nativeContinueSelection.apply(this,arguments);
    };
  }

  const nativeRenderConfiguration=typeof window.renderTrainingExerciseConfiguration==='function'?window.renderTrainingExerciseConfiguration:null;
  if(nativeRenderConfiguration){window.renderTrainingExerciseConfiguration=function(id,di){const result=nativeRenderConfiguration.apply(this,arguments);requestAnimationFrame(()=>decorateConfiguration(id,di));return result;};}

  function supersetWorkoutContext(){
    const workout=window.activeWorkout;if(!workout)return null;
    const ex=workout.exercises?.[Number(workout.currentExercise)||0];if(!ex?.supersetId)return null;
    if(!workout.supersetRoundById)workout.supersetRoundById={n,   const groupIndices=(workout.exercises||[]).map((item,index)=>item?.supersetId===ex.supersetId?index:-1).filter(index=>index>=0).sort((a,b)=>(parseInt(workout.exercises[a]?.supersetOrder)||a)-(parseInt(workout.exercises[b]?.supersetOrder)||b));
    const position=Math.max(0,groupIndices.indexOf(workout.currentExercise));
    const rounds=Math.max(1,parseInt(ex.supersetRounds)||parseInt(ex.sets)||1);
    const round=Math.max(1,parseInt(workout.supersetRoundById[ex.supersetId])||1);
    const rest=Math.max(0,parseInt(ex.supersetRest)||parseInt(workout.exercises[groupIndices[0]]?.supersetRest)||0);
    return {workout,ex,groupIndices,position,rounds,round,restn, }

  function restPauseWorkoutContext(){
    const workout=window.activeWorkout;if(!workout)return null;
    const ex=workout.exercises?.[Number(workout.currentExercise)||0];if(!ex?.restPause)return null;
    const reps=String(ex.restPauseReps||ex.reps||'12/10/8/6');
    const targets=reps.split(/[\/\-–,\s]+/).filter(Boolean);
    const blocks=Math.max(2,targets.length||parseInt(ex.restPauseBlocks)||4);
    const seconds=Math.max(1,parseInt(ex.restPauseSeconds)||7);
    const finalRest=Math.max(0,parseInt(ex.restPauseFinalRest)||parseInt(ex.restBetweenExercises)||0);
    return {workout,ex,reps,targets,blocks,seconds,finalRestn, }

  function decorateWorkoutSession(){
    const root=document.getElementById('client-main');if(!root)return;
    root.querySelector('.dcc-method-session')?.remove();
    const superset=supersetWorkoutContext(),restPause=restPauseWorkoutContext(),ctx=superset||restPause;if(!ctx)return;
    const top=root.querySelector('.top');if(!top)return;
    const banner=document.createElement('div');banner.className='dcc-method-session';
    if(superset){banner.innerHTML='<b>SUPERSERIE · VUELTA '+superset.round+' DE '+superset.rounds+'</b><span>Ejercicio '+(superset.ex.supersetOrder||superset.position+1)+' de '+(superset.ex.supersetSize||superset.groupIndices.length)+' · sin descanso entre ejercicios · '+superset.rest+' s al completar la vuelta</span>';}
    else{
      const completed=Array.isArray(restPause.workout.sets)?restPause.workout.sets.length:0;
      const target=restPause.targets[Math.min(completed,restPause.targets.length-1)]||'';
      banner.innerHTML='<b>REST-PAUSE · '+restPause.reps+' REP</b><span>Bl)que '+Math.min(completed+1,restPause.blocks)+' de '+restPause.blocks+(target?' · objetivo '+target+' rep':'')+' · '+restPause.seconds+' s entre bloques · '+restPause.finalRest+' s al terminar</span>';
    }
    top.parentNode.insertBefore(banner,top);
  }

  const nativeRenderWorkoutSession=typeof window.renderWorkoutSession==='function'?window.renderWorkoutSession:null;
  if(nativeRenderWorkoutSession){
    window.renderWorkoutSession=function(){
      const superset=supersetWorkoutContext(),restPause=restPauseWorkoutContext();
      if(superset){
        const ex=superset.ex,originalSets=ex.sets,originalRestSets=ex.restBetweenSets,originalRestExercises=ex.restBetweenExercises;
        ex.sets=1;ex.restBetweenSets=0;ex.restBetweenExercises=0;
        let result;try{result=nativeRenderWorkoutSession.apply(this,arguments);}finally{ex.sets=originalSets;ex.restBetweenSets=originalRestSets;ex.restBetweenExercises=originalRestExercises;}
        requestAnimationFrame(decorateWorkoutSession);return result;
      }
      if(restPause){restPause.ex.sets=String(restPause.bl);
    fis);restPause.ex.reps=restPause.reps;restPause.ex.restBetweenSets=restPause.seconds;restPause.ex.restBetweenExercises=restPause.finalRest;}
      const result=nativeRenderWorkoutSession.apply(this,arguments);requestAnimationFrame(decorateWorkoutSession);return result;
    };
  }

  function recordSupersetSet(ctx,sets){
    const workout=ctx.workout,ex=ctx.ex;if(!Array.isArray(workout.completedExercises))workout.completedExercises=[];
    const existing=workout.completedExercises.find(item=>item?.supersetId===ex.supersetId&&((ex.libraryId&&item.libraryId===ex.libraryId)||(!ex.libraryId&&item.name===ex.name)));
    const copy=JSON.parse(JSON.stringify(sets||[]));if(existing){existing.sets.push(...copy);return;}
    workout.completedExercises.push({libraryId:ex.libraryId||'',name:ex.name||'Ejercicio',plannedSets:ctx.rounds,plannedReps:ex.reps||'',supersetId:ex.supersetId,supersetOrder:ex.supersetOrder||ctx.position+1,sets:copy});
  }

  const nativeSaveWorkoutSet=typeof window.saveWorkoutSet==='function'?window.saveWorkoutSet:null;
  if(nativeSaveWorkoutSet){
    window.saveWorkoutSet=function(){
      const ctx=supersetWorkoutContext();if(!ctx)return nativeSaveWorkoutSet.apply(this,arguments);
      const workout=ctx.workout;if(workout.restUntil&&workout.restUntil>Date.now()){notify('Espera a que termine el descanso');return;}
      if(Array.isArray(workout.sets)&&workout.sets.length>=1){notify('Esta parte de la superserie ya está completada');return;}
      const kgInput=document.getElementById('workout-kg'),repsInput=document.getElementById('workout-reps');if(!kgInput||!repsInput)return;
      const kg=kgInput.value.trim(),reps=repsInput.value.trim();if(!kg||!reps){notify('Introduce peso y repeticiones');return;}
      const kgValue=parseFloat(kg.replace(',','.')),repsValue=parseInt(reps);if(!Number.isFinite(kgValue)||!Number.isFinite(repsValue)||kgValue<0||repsValue<=0){notify('Introduce valores válidos');return;}
      if(!Array.isArray(workout.sets))workout.sets=[];workout.sets.push({kg:kgValue,reps:repsValue});window.nextWorkoutExercise?.();
    };
  }

  const nativeNextWorkoutExercise=typeof window.nextWorkoutExercise==='function'?window.nextWorkoutExercise:null;
  if(nativeNextWorkoutExercise){
    window.nextWorkoutExercise=function(){
      const ctx=supersetWorkoutContext();if(!ctx)return nativeNextWorkoutExercise.apply(this,arguments);
      const workout=ctx.workout;if(!workout.sets||!workout.sets.length){notify('Registra al menos una serie');return;}
      recordSupersetSet(ctx,workout.sets);workout.sets=[];
      if(ctx.position<ctx.groupIndices.length-1){workout.currentExercise=ctx.groupIndices[ctx.position+1];workout.restUntil=null;workout.restMode=null;window.renderWorkoutSession?.();notify('Siguiente ejercicio · sin descanso');return;}
      if(ctx.round<ctx.rounds){
        workout.supersetRoundById[ctx.ex.supersetId]=ctx.round+1;workout.currentExercise=ctx.groupIndices[0];
        if(ctx.rest>0){workout.restUntil=Date.now()+(ctx.rest*1000);workout.restMode='exercise';window.renderWorkoutSession?.();window.startRestTimer?.();notify('Vuelta '+ctx.round+' completada · Descanso '+ctx.rest+' s');return;}
        workout.restUntil=null;workout.restMode=null;window.renderWorkoutSession?.();notify('Empieza la vuelta '+(ctx.round+1));return;
      }
      workout.supersetRoundById[ctx.ex.supersetId]=ctx.rounds;workout.currentExercise=Math.max(...ctx.groupIndices)+1;
      if(workout.currentExercise>=workout.exercises.length){window.finishWorkout?.();return;}
      if(ctx.rest>0){workout.restUntil=Date.now()+(ctx.rest*1000);workout.restMode='exercise';window.renderWorkoutSession?.();window.startRestTimer?.();notify('Superserie completada · Descanso '+ctx.rest+' s');return;}
      workout.restUntil=null;workout.restMode=null;window.renderWorkoutSession?.();notify('Superserie completada');
    n, }

  installStyle();requestAnimationFrame(decoratePicker);
})();
