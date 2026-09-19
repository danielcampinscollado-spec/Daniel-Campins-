/* DCC — selector compacto de ejercicios + superseries + REST-pause.
   v3: flujo LIGHT, selección primero y configuración completa al final.
*/
(function(){
  'use strict';

  const BUILD='20260919-training-methods-v10-grouped-compact';
  if(window.__dccTrainingMethods===BUILD)return;
  window.__dccTrainingMethods=BUILD;

  const pickerMode={};
  const pickerDraftSelections={};
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
  function ensureRoutineBackup(id){
    if(window.__dccRoutineUnsavedBackupSet)return;
    window.__dccRoutineUnsavedBackup=JSON.stringify(window.data?.routines?.[id]??null);
    window.__dccRoutineUnsavedBackupSet=true;
    window.__dccRoutineUnsavedClient=String(id??window.selectedClient??'');
  }
  function markRoutineDirty(id){
    ensureRoutineBackup(id);
    window.__dccRoutineUnsavedClient=String(id??window.selectedClient??'');
    window.__dccRoutineDraftDirty=true;
  }
  function clearRoutineDirty(){
    window.__dccRoutineDraftDirty=false;
    window.__dccRoutineUnsavedBackup=undefined;
    window.__dccRoutineUnsavedBackupSet=false;
    window.__dccRoutineUnsavedClient='';
  }
  function discardRoutineDraft(){
    const id=window.__dccRoutineUnsavedClient;
    if(id&&window.__dccRoutineUnsavedBackupSet){
      const old=JSON.parse(window.__dccRoutineUnsavedBackup);
      if(!window.data.routines)window.data.routines={};
      if(old===null)delete window.data.routines[id];else window.data.routines[id]=old;
      save();
    }
    clearRoutineDirty();
  }
  function confirmRoutineExit(){
    if(!window.__dccRoutineDraftDirty||window.__dccRoutineNavBypass)return true;
    const leave=window.confirm('Tienes cambios sin guardar en la rutina. Si sales ahora, perderás esos cambios. ¿Salir sin guardar?');
    if(!leave)return false;
    discardRoutineDraft();
    return true;
  }
  function key(id,di){return String(id)+'|'+String(di);}
  function mode(id,di){return pickerMode[key(id,di)]||'normal';}
  function setMode(id,di,value){pickerMode[key(id,di)]=value;}
  function draftSelections(id,di){
    const k=key(id,di);
    if(!pickerDraftSelections[k])pickerDraftSelections[k]={superset:[],restpause:[]};
    return pickerDraftSelections[k];
  }
  function rememberCurrentDraft(id,di,day){
    const current=mode(id,di);
    if(current!=='superset'&&current!=='restpause')return;
    draftSelections(id,di)[current]=Array.isArray(day?.selectedExerciseIds)?[...day.selectedExerciseIds]:[];
  }
  function restoreModeDraft(id,di,day,nextMode){
    day.selectedExerciseIds=nextMode==='normal'?[]:[...(draftSelections(id,di)[nextMode]||[])];
  }
  function existingExercise(day,exerciseId){
    return (day?.exercises||[]).find(ex=>String(ex?.libraryId||ex?.id||'')===String(exerciseId))||null;
  }
  function absorbNormalSelection(day){
    if(!Array.isArray(day?.selectedExerciseIds)||!day.selectedExerciseIds.length)return false;
    if(!Array.isArray(day.exercises))day.exercises=[];
    let changed=false;
    day.selectedExerciseIds.forEach(exerciseId=>{
      if(existingExercise(day,exerciseId))return;
      const ex=library().find(item=>String(item?.id)===String(exerciseId));
      if(!ex)return;
      day.exercises.push({libraryId:ex.id,name:ex.name,muscle:ex.muscle,image:ex.image||'',sets:'',reps:'',restBetweenSets:0,restBetweenExercises:0,videoUrl:''});
      changed=true;
    });
    day.selectedExerciseIds=[];
    return changed;
  }
  function exerciseKind(ex){
    if(!ex)return '';
    if(ex.supersetId)return 'superserie';
    if(ex.restPause)return 'REST-pause';
    return 'ejercicio normal';
  }

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
      #coach-main.dcc-picker-active{padding-bottom:104px!important}
      #coach-main .dcc-mode-wrap{margin:2px 0 8px}
      #coach-main .dcc-mode-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
      #coach-main .dcc-mode-tab{min-height:42px;padding:7px 5px;border:1px solid rgba(183,123,19,.18);border-radius:11px;background:#fffdf9;color:#5f6670;font-size:10px;font-weight:850;line-height:1.15}
      #coach-main .dcc-mode-tab.is-active{border-color:#d9aa4a;background:rgba(217,170,74,.14);color:#8c5a08}
      #coach-main .dcc-mode-hint{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:7px;padding:8px 10px;border:1px solid rgba(183,123,19,.14);border-radius:11px;background:#fffdf9;color:#6f747c;font-size:10px;line-height:1.3}
      #coach-main .dcc-mode-hint b{color:#8c5a08}
      #coach-main .dcc-mode-add{flex:0 0 auto;min-height:34px;padding:7px 10px;border:1px solid #d9aa4a;border-radius:9px;background:linear-gradient(135deg,#f3cf69,#d9a63d);color:#17120a;font-size:10px;font-weight:900}
      #coach-main .dcc-mode-add:disabled{border-color:#ddd4c5;background:#eee8dc;color:#999184}
      #coach-main .dcc-picker-manual-top{width:100%!important;margin:0 0 9px!important;min-height:46px!important;border-radius:12px!important;font-size:12px!important}
      #coach-main .dcc-existing-label{display:block;margin-top:3px;color:#9a650c;font-size:9px;font-weight:750;line-height:1.2}
      #coach-main .dcc-native-continue-hidden{display:none!important}
      .dcc-picker-savebar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(78px + env(safe-area-inset-bottom));z-index:9996;width:min(720px,calc(100% - 24px));box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 10px;border:1px solid rgba(217,170,74,.48);border-radius:16px;background:rgba(255,253,249,.97);box-shadow:0 8px 26px rgba(61,42,12,.14);backdrop-filter:blur(12px)}
      .dcc-picker-savebar-count{min-width:0;color:#6f747c;font-size:10px;line-height:1.25}
      .dcc-picker-savebar-count b{display:block;color:#17191d;font-size:12px}
      .dcc-picker-savebar-count strong{color:#a66b08}
      .dcc-picker-savebar button{flex:0 0 auto;min-height:42px;padding:0 18px;border:1px solid #c58b1d;border-radius:12px;background:linear-gradient(135deg,#f3cf69,#d9a63d);color:#17120a;font-size:12px;font-weight:900}
      #coach-main.dcc-config-active{padding-bottom:92px!important}
      #coach-main .dcc-exercise-card{padding:7px 9px!important;border-radius:11px!important;margin:0!important}
      #coach-main .dcc-exercise-card>div:first-child{grid-template-columns:minmax(0,1fr) auto!important;gap:6px!important;margin-bottom:3px!important}
      #coach-main .dcc-exercise-card>div:first-child>div:first-child>div:first-child{font-size:15px!important;line-height:1.15!important}
      #coach-main .dcc-exercise-card>div:first-child>div:first-child>.muted{margin-top:2px!important;font-size:10px!important}
      #coach-main .dcc-exercise-card>div:nth-child(2){gap:8px!important}
      #coach-main .dcc-exercise-card>div:nth-child(2) label{font-size:11px!important}
      #coach-main .dcc-exercise-card>div:nth-child(3){grid-template-columns:minmax(0,1fr) 86px!important;gap:6px!important;margin-top:4px!important}
      #coach-main .dcc-exercise-card input{min-height:32px!important;margin-top:2px!important;font-size:12px!important}
      #coach-main .dcc-exercise-card input[type="url"]{min-height:36px!important;font-size:11px!important}
      #coach-main .dcc-exercise-card [data-dcc-delete]{width:34px!important;height:32px!important;min-width:34px!important;padding:0!important;border-radius:9px!important;border:1px solid rgba(190,48,55,.48)!important;color:#c9343d!important;font-size:12px!important;font-weight:900!important;background:rgba(190,48,55,.035)!important}
      #coach-main .dcc-exercise-card [data-dcc-video]{min-height:36px!important;font-size:11px!important}
      #coach-main .dcc-config-save{position:static!important;width:100%!important;min-height:44px!important;margin-top:12px!important;border-radius:12px!important;font-size:13px!important;box-shadow:none!important}
      #coach-main .dcc-method-badge{display:inline-flex;align-items:center;margin:0 0 6px;padding:3px 7px;border-radius:999px;background:rgba(217,170,74,.13);color:#9a650c;font-size:9px;font-weight:850}
      #coach-main .dcc-method-config{margin:5px 0;padding:8px;border:1px solid rgba(217,170,74,.40);border-radius:12px;background:rgba(217,170,74,.055);color:#17191d}
      #coach-main .dcc-method-config-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
      #coach-main .dcc-method-config-head b{font-size:13px}.dcc-method-config-head span{font-size:9px;color:#9a650c;font-weight:850}
      #coach-main .dcc-method-names{margin-top:5px;color:#6f747c;font-size:10px;line-height:1.35}
      #coach-main .dcc-method-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:6px}
      #coach-main .dcc-method-fields.three{grid-template-columns:repeat(3,minmax(0,1fr))}
      #coach-main .dcc-method-fields label{font-size:10px;font-weight:800;color:#4f5660}
      #coach-main .dcc-method-fields input{width:100%;min-height:32px;margin-top:2px;box-sizing:border-box;font-size:12px}
      #coach-main .dcc-method-note{margin-top:4px;color:#7a818a;font-size:9px;line-height:1.35}
      #coach-main .dcc-method-video{display:grid;grid-template-columns:minmax(0,1fr) 82px 38px;gap:6px;margin-top:6px}
      #coach-main .dcc-method-video input{min-width:0;height:42px;border:1px solid rgba(183,123,19,.24);border-radius:12px;background:#fffdf9;padding:0 12px;font:inherit;color:#171717}
      #coach-main .dcc-method-video button{height:38px;align-self:center;border:1px solid #d9aa4a;border-radius:9px;background:transparent;color:#a06d12;font-size:10px;font-weight:850}#coach-main .dcc-method-video [data-delete-rest]{width:38px;border-color:rgba(190,48,55,.48);background:rgba(190,48,55,.035);color:#c9343d;font-size:12px;font-weight:900}
      #coach-main .dcc-rest-global-top{margin-top:0!important;margin-bottom:8px!important;padding:10px!important;border-radius:13px!important}
      #coach-main .dcc-rest-global-top label{font-size:11px!important}
      #coach-main .dcc-rest-global-top input{min-height:36px!important;margin-top:4px!important;font-size:12px!important}
      #coach-main .dcc-rest-global-top .muted{font-size:10px!important}
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
      ? 'Selecciona <b>2–4 ejercicios</b> para la superserie. Lo que ya hayas añadido a la rutina se conserva.'
      : current==='restpause'
        ? 'Selecciona <b>1 ejercicio</b> para REST-pause. Lo que ya hayas añadido a la rutina se conserva.'
        : 'Añade ejercicios normales. Para crear una <b>superserie</b> o un <b>REST-pause</b>, pulsa arriba; lo ya añadido no se pierde.';
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

  function removePickerSavebar(){
    document.querySelector('.dcc-picker-savebar')?.remove();
    document.getElementById('coach-main')?.classList.remove('dcc-picker-active');
  }

  function decorateExistingRows(ctx,day){
    const current=mode(ctx.id,ctx.di);
    [...ctx.root.querySelectorAll('button')].forEach(row=>{
      const onclick=row.getAttribute('onclick')||'';
      const match=onclick.match(/toggleTrainingExercise\(\s*'[^']+'\s*,\s*\d+\s*,\s*'([^']+)'/);
      if(!match)return;
      const exerciseId=match[1].replace(/\\'/g,"'");
      const existing=existingExercise(day,exerciseId);
      if(!existing)return;
      const textBlock=row.firstElementChild;
      if(textBlock&&!textBlock.querySelector('.dcc-existing-label')){
        const label=document.createElement('span');
        label.className='dcc-existing-label';
        label.textContent='Ya añadido · '+exerciseKind(existing);
        textBlock.appendChild(label);
      }
      const marker=row.lastElementChild;
      if(marker){
        marker.textContent='✓';
        marker.style.background='#d9aa4a';
        marker.style.borderColor='#d9aa4a';
        marker.style.color='#111';
      }
      row.style.borderColor='rgba(217,170,74,.48)';
      row.style.background='rgba(217,170,74,.07)';
      if(current!=='normal')row.setAttribute('aria-label','Ejercicio ya añadido a la rutina');
    });
  }

  function renderPickerSavebar(ctx,day){
    document.querySelector('.dcc-picker-savebar')?.remove();
    ctx.root.classList.add('dcc-picker-active');
    const total=(day.exercises||[]).length;
    const bar=document.createElement('div');
    bar.className='dcc-picker-savebar';
    bar.innerHTML=`
      <div class="dcc-picker-savebar-count">
        <b><strong>${total}</strong> ${total===1?'ejercicio añadido':'ejercicios añadidos'}</b>
        Normal, superserie y REST-pause pueden combinarse.
      </div>
      <button type="button" data-picker-save>Seleccionar series y repeticiones</button>
    `;
    bar.querySelector('[data-picker-save]')?.addEventListener('click',()=>window.continueTrainingExerciseSelection?.(ctx.id,ctx.di));
    document.body.appendChild(bar);
  }

  function decoratePicker(){
    installStyle();
    const ctx=parsePickerContext();
    if(!ctx)return;
    const day=dayRef(ctx.id,ctx.di);if(!day)return;

    if(mode(ctx.id,ctx.di)==='normal'&&absorbNormalSelection(day))save();

    ctx.root.querySelector('.dcc-mode-wrap')?.remove();
    const wrap=document.createElement('div');wrap.className='dcc-mode-wrap';wrap.innerHTML=renderModeBar(ctx.id,ctx.di,day);
    const top=ctx.root.querySelector('.top');
    if(top&&top.nextSibling)top.parentNode.insertBefore(wrap,top.nextSibling);else ctx.root.insertBefore(wrap,ctx.root.firstChild);

    ctx.button.classList.add('dcc-picker-manual-top');
    wrap.parentNode.insertBefore(ctx.button,wrap.nextSibling);

    const summaryCard=[...ctx.root.querySelectorAll('.card')].find(card=>/ejercicios disponibles/i.test(card.textContent||'')&&/seleccionados/i.test(card.textContent||''));
    summaryCard?.remove();

    const nativeContinue=[...ctx.root.querySelectorAll('button')].find(btn=>(btn.getAttribute('onclick')||'').includes('continueTrainingExerciseSelection'));
    nativeContinue?.classList.add('dcc-native-continue-hidden');

    wrap.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{
      const next=btn.dataset.mode;
      const current=mode(ctx.id,ctx.di);
      rememberCurrentDraft(ctx.id,ctx.di,day);
      if((current==='superset'||current==='restpause')&&day.selectedExerciseIds?.length){
        const selectedCount=day.selectedExerciseIds.length;
        const valid=current==='superset'?(selectedCount>=2&&selectedCount<=4):selectedCount===1;
        if(valid&&!commitSpecialDraft(ctx.id,ctx.di,day,current,false))return;
      }
      setMode(ctx.id,ctx.di,next);
      restoreModeDraft(ctx.id,ctx.di,day,next);
      save();
      window.openTrainingExercises?.(ctx.id,ctx.di,true);
    }));

    wrap.querySelector('[data-add-special]')?.addEventListener('click',()=>{
      if(mode(ctx.id,ctx.di)==='superset')createSuperset(ctx.id,ctx.di);else createRestPause(ctx.id,ctx.di);
    });

    decorateExistingRows(ctx,day);
    renderPickerSavebar(ctx,day);
  }

  function hasDuplicate(day,selected){
    const existingIds=new Set((day.exercises||[]).map(ex=>String(ex?.libraryId||ex?.id||'')).filter(Boolean));
    return selected.find(ex=>existingIds.has(String(ex.id)))||null;
  }

  function commitSpecialDraft(id,di,day,current,showSuccess=false){
    const selected=selectedLibraryExercises(day);
    if(current==='superset'){
      if(!selected.length)return true;
      if(selected.length<2||selected.length>4){notify('La superserie necesita entre 2 y 4 ejercicios');return false;}
      if(!Array.isArray(day.exercises))day.exercises=[];
      if(hasDuplicate(day,selected)){notify('Uno de esos ejercicios ya está añadido a la rutina');return false;}
      ensureRoutineBackup(id);
      const supersetId='superset-'+Date.now();
      selected.forEach((ex,index)=>day.exercises.push({
        libraryId:ex.id,name:ex.name,muscle:ex.muscle,image:'',sets:'',reps:'',restBetweenSets:0,restBetweenExercises:0,videoUrl:'',
        supersetId,supersetOrder:index+1,supersetSize:selected.length,supersetRounds:'',supersetRest:null
      }));
      day.selectedExerciseIds=[];
      draftSelections(id,di).superset=[];
      day.trainingSetupStarted=true;
      markRoutineDirty(id);
      save();
      if(showSuccess)notify('Superserie añadida');
      return true;
    }
    if(current==='restpause'){
      if(!selected.length)return true;
      if(selected.length!==1){notify('REST-pause necesita 1 ejercicio');return false;}
      if(!Array.isArray(day.exercises))day.exercises=[];
      if(hasDuplicate(day,selected)){notify('Ese ejercicio ya está añadido a la rutina');return false;}
      ensureRoutineBackup(id);
      const ex=selected[0];
      day.exercises.push({
        libraryId:ex.id,name:ex.name,muscle:ex.muscle,image:'',sets:'',reps:'',restBetweenSets:0,restBetweenExercises:0,videoUrl:'',
        restPause:true,restPauseReps:'',restPauseBlocks:0,restPauseSeconds:null,restPauseFinalRest:null
      });
      day.selectedExerciseIds=[];
      draftSelections(id,di).restpause=[];
      day.trainingSetupStarted=true;
      markRoutineDirty(id);
      save();
      if(showSuccess)notify('REST-pause añadido');
      return true;
    }
    return true;
  }

  function createSuperset(id,di){
    const day=dayRef(id,di);if(!day)return;
    if(commitSpecialDraft(id,di,day,'superset',true))window.openTrainingExercises?.(id,di,true);
  }

  function createRestPause(id,di){
    const day=dayRef(id,di);if(!day)return;
    if(commitSpecialDraft(id,di,day,'restpause',true))window.openTrainingExercises?.(id,di,true);
  }

  function methodGroups(day){
    const supersetIds=[...new Set((day?.exercises||[]).map(ex=>ex?.supersetId).filter(Boolean))];
    const supersets=supersetIds.map((id,index)=>{
      const items=(day.exercises||[]).filter(ex=>ex.supersetId===id);
      const rounds=String(items[0]?.supersetRounds??items[0]?.sets??'').trim();const rest=items[0]?.supersetRest==null?'':String(items[0].supersetRest).trim();return {id,index:index+1,items,rounds,rest};
    });
    const restPauses=(day?.exercises||[]).map((ex,index)=>({ex,index})).filter(x=>x.ex?.restPause).map((x,index)=>{
      const reps=String(x.ex.restPauseReps||x.ex.reps||'').trim();
      const blocks=reps?reps.split(/[\/\-–,\s]+/).filter(Boolean).length:0;
      return {index:index+1,exerciseIndex:x.index,ex:x.ex,reps,blocks,seconds:x.ex.restPauseSeconds==null?'':String(x.ex.restPauseSeconds),finalRest:x.ex.restPauseFinalRest==null?'':String(x.ex.restPauseFinalRest)};
    });
    return {supersets,restPauses};
  }

  function updateSuperset(id,di,supersetId,keyName,value){
    const day=dayRef(id,di);if(!day)return;
    const raw=String(value??'').trim(),n=keyName==='rounds'?(raw?Math.max(1,parseInt(raw)||1):''):Math.max(0,parseInt(raw)||0);
    markRoutineDirty(id);
    (day.exercises||[]).forEach(ex=>{if(ex.supersetId!==supersetId)return;if(keyName==='rounds'){ex.supersetRounds=n;ex.sets=n===''?'':String(n);}else{ex.supersetRest=n;ex.restBetweenSets=0;ex.restBetweenExercises=n;}});save();
  }

  function updateRestPause(id,di,exerciseIndex,keyName,value){
    const day=dayRef(id,di);const ex=day?.exercises?.[exerciseIndex];if(!ex)return;
    markRoutineDirty(id);
    if(keyName==='reps'){
      const reps=String(value||'').trim();const blocks=reps?reps.split(/[\/\-–,\s]+/).filter(Boolean).length:0;
      ex.restPauseReps=reps;ex.reps=reps;ex.restPauseBlocks=blocks;ex.sets=blocks?String(blocks):'';
    }else if(keyName==='seconds'){
      const raw=String(value??'').trim(),n=raw?Math.max(1,parseInt(raw)||1):null;ex.restPauseSeconds=n;ex.restBetweenSets=n??0;
    }else{
      const raw=String(value??'').trim(),n=raw?Math.max(0,parseInt(raw)||0):null;ex.restPauseFinalRest=n;ex.restBetweenExercises=n??0;
    }save();
  }

  function decorateConfiguration(id,di){
    installStyle();
    const day=dayRef(id,di),root=document.getElementById('coach-main');if(!day||!root)return;
    if(day.trainingSetupStep!=='complete'){
      let normalized=false;
      (day.exercises||[]).forEach(ex=>{
        if(ex?.supersetId&&String(ex.reps||'').trim()===''&&String(ex.sets||'')==='3'&&String(ex.supersetRounds||'')==='3'){ex.sets='';ex.supersetRounds='';normalized=true;}
        if(ex?.restPause&&String(ex.sets||'')==='4'&&String(ex.reps||'')==='12/10/8/6'&&String(ex.restPauseReps||'')==='12/10/8/6'){ex.sets='';ex.reps='';ex.restPauseReps='';ex.restPauseBlocks=0;normalized=true;}
        if(ex?.restPause&&!String(ex.restPauseReps||ex.reps||'').trim()&&Number(ex.restPauseSeconds)===7&&Number(ex.restPauseFinalRest)===90){ex.restPauseSeconds=null;ex.restPauseFinalRest=null;ex.restBetweenSets=0;ex.restBetweenExercises=0;normalized=true;}
      });
      if(normalized)save();
    }
    root.classList.add('dcc-config-active');
    root.querySelectorAll('.dcc-method-config,.dcc-method-badge').forEach(el=>el.remove());root.querySelectorAll('.dcc-exercise-card').forEach(el=>el.style.display='');
    const cards=[...root.querySelectorAll('.card')];
    const globalRestCard=cards.find(card=>/Tiempos de descanso \(globales\)/i.test(card.textContent||''));
    const exerciseContainer=globalRestCard?.previousElementSibling;
    if(globalRestCard&&exerciseContainer){globalRestCard.classList.add('dcc-rest-global-top');exerciseContainer.parentNode.insertBefore(globalRestCard,exerciseContainer);}
    if(globalRestCard&&!globalRestCard.querySelector('.dcc-method-global-note')){
      const note=document.createElement('div');note.className='dcc-method-global-note';note.textContent='Estos tiempos se usan en ejercicios normales. Superserie y REST-pause pueden tener descansos propios.';globalRestCard.appendChild(note);
    }
    const groups=methodGroups(day);
    const currentCards=()=>[...root.querySelectorAll('.card')].filter(c=>c!==globalRestCard);

    day.exercises.forEach(ex=>{
      const card=currentCards().find(c=>(c.textContent||'').includes(ex.name||'')&&c.querySelector('input'));
      if(!card)return;
      card.classList.add('dcc-exercise-card');
      const deleteBtn=[...card.querySelectorAll('button')].find(btn=>(btn.getAttribute('onclick')||'').includes('removeTrainingExercise'));
      if(deleteBtn){deleteBtn.textContent='[x]';deleteBtn.dataset.dccDelete='1';}
      const videoBtn=[...card.querySelectorAll('button')].find(btn=>(btn.textContent||'').includes('Ver vídeo'));
      if(videoBtn){videoBtn.textContent='Ver vídeo';videoBtn.dataset.dccVideo='1';}
      const urlInput=card.querySelector('input[type="url"]');
      if(urlInput)urlInput.placeholder='Enlace del vídeo (opcional)';
    });
    const saveButton=[...root.querySelectorAll('button')].find(btn=>(btn.getAttribute('onclick')||'').includes('saveConfiguredTraining'));
    if(saveButton){saveButton.textContent='Guardar rutina';saveButton.classList.add('dcc-config-save');}
    root.querySelectorAll('input').forEach(input=>{
      if(input.dataset.dccDirtyBound)return;
      input.dataset.dccDirtyBound='1';
      input.addEventListener('input',()=>markRoutineDirty(id));
    });

    groups.supersets.forEach(group=>{
      const groupCards=group.items.map(ex=>currentCards().find(card=>(card.textContent||'').includes(ex.name||'')&&card.querySelector('input'))).filter(Boolean);
      groupCards.forEach((card,i)=>{const badge=document.createElement('div');badge.className='dcc-method-badge';badge.textContent='Superserie · '+(i+1)+'/'+group.items.length;card.insertBefore(badge,card.firstChild);});
      groupCards.forEach(card=>{
        const labels=[...card.querySelectorAll('label')];
        const seriesLabel=labels.find(label=>/^Series$/i.test((label.childNodes[0]?.textContent||label.textContent||'').trim()));
        if(seriesLabel){seriesLabel.style.display='none';const fields=seriesLabel.parentElement;if(fields)fields.style.gridTemplateColumns='1fr';}
      });
      const first=groupCards[0];if(!first)return;
      const box=document.createElement('div');box.className='dcc-method-config';box.innerHTML=`
        <div class="dcc-method-config-head"><b>Superserie · ${group.items.length} ejercicios</b><span>sin descanso entre ellos</span></div>
        <div class="dcc-method-names">${group.items.map(ex=>esc(ex.name||'Ejercicio')).join(' → ')}</div>
        <div class="dcc-method-fields"><label>Series de superserie<input data-rounds type="number" min="1" inputmode="numeric" value="${esc(group.rounds)}" placeholder="Ej. 3"></label><label>Descanso tras cada serie<input data-rest type="number" min="0" inputmode="numeric" value="${esc(group.rest)}" placeholder="Ej. 90"></label></div>
        <div class="dcc-method-note">Ejemplo: 3 series. En cada serie haces todos los ejercicios seguidos, sin descanso entre ellos; después descansas el tiempo indicado.</div>`;
      first.parentNode.insertBefore(box,first);
      box.classList.add('dcc-superset-group');
      groupCards.forEach(card=>box.appendChild(card));
      box.querySelector('[data-rounds]')?.addEventListener('input',e=>updateSuperset(id,di,group.id,'rounds',e.target.value));
      box.querySelector('[data-rest]')?.addEventListener('input',e=>updateSuperset(id,di,group.id,'rest',e.target.value));
    });

    groups.restPauses.forEach(group=>{
      const card=currentCards().find(c=>(c.textContent||'').includes(group.ex.name||'')&&c.querySelector('input'));if(!card)return;
      const box=document.createElement('div');box.className='dcc-method-config dcc-restpause-single';box.innerHTML=`
        <div class="dcc-method-config-head"><b>REST-pause</b><span>${esc(group.ex.name||'Ejercicio')}</span></div>
        <div class="dcc-method-fields three">
          <label>Repeticiones<input data-reps type="text" inputmode="text" value="${esc(group.reps)}" placeholder="Ej. 12/10/8/6"></label>
          <label>Pausa entre bloques<input data-seconds type="number" min="1" inputmode="numeric" value="${esc(group.seconds)}" placeholder="Ej. 7"></label>
          <label>Descanso al terminar<input data-final-rest type="number" min="0" inputmode="numeric" value="${esc(group.finalRest)}" placeholder="Ej. 90"></label>
        </div>
        <div class="dcc-method-video"><input data-video type="url" value="${esc(group.ex.videoUrl||'')}" placeholder="Enlace del vídeo (opcional)"><button type="button" data-open-video>Ver vídeo</button><button type="button" data-delete-rest>[x]</button></div>
        <div class="dcc-method-note">Ejemplo: 12/10/8/6 con 7 s entre bloques. Los valores son solo ejemplos: tú decides repeticiones y descansos.</div>`;
      card.parentNode.insertBefore(box,card);
      card.style.display='none';
      box.querySelector('[data-reps]')?.addEventListener('input',e=>updateRestPause(id,di,group.exerciseIndex,'reps',e.target.value));
      box.querySelector('[data-seconds]')?.addEventListener('input',e=>updateRestPause(id,di,group.exerciseIndex,'seconds',e.target.value));
      box.querySelector('[data-final-rest]')?.addEventListener('input',e=>updateRestPause(id,di,group.exerciseIndex,'finalRest',e.target.value));
      box.querySelector('[data-video]')?.addEventListener('input',e=>{markRoutineDirty(id);group.ex.videoUrl=e.target.value;save();});
      box.querySelector('[data-open-video]')?.addEventListener('click',()=>{const url=String(group.ex.videoUrl||'').trim();if(url)window.open(url,'_blank','noopener');else notify('Añade primero el enlace del vídeo');});
      box.querySelector('[data-delete-rest]')?.addEventListener('click',()=>window.removeTrainingExercise?.(id,di,group.exerciseIndex));
    });
  }

  const nativeOpenTrainingExercises=typeof window.openTrainingExercises==='function'?window.openTrainingExercises:null;
  if(nativeOpenTrainingExercises){window.openTrainingExercises=async function(){const result=await nativeOpenTrainingExercises.apply(this,arguments);requestAnimationFrame(decoratePicker);return result;};}

  const nativeToggleTrainingExercise=typeof window.toggleTrainingExercise==='function'?window.toggleTrainingExercise:null;
  if(nativeToggleTrainingExercise){
    window.toggleTrainingExercise=function(id,di,exerciseId){
      const day=dayRef(id,di);if(!day)return;
      const current=mode(id,di);
      if(current==='normal'){
        ensureRoutineBackup(id);
        if(!Array.isArray(day.exercises))day.exercises=[];
        const index=day.exercises.findIndex(ex=>String(ex?.libraryId||ex?.id||'')===String(exerciseId));
        if(index>=0){
          const existing=day.exercises[index];
          if(existing.supersetId||existing.restPause){notify('Ese ejercicio ya está añadido como '+exerciseKind(existing));return;}
          day.exercises.splice(index,1);
        }else{
          const ex=library().find(item=>String(item?.id)===String(exerciseId));
          if(!ex)return;
          day.exercises.push({libraryId:ex.id,name:ex.name,muscle:ex.muscle,image:ex.image||'',sets:'',reps:'',restBetweenSets:0,restBetweenExercises:0,videoUrl:''});
        }
        day.trainingSetupStarted=true;
        day.selectedExerciseIds=[];
        window.__dccRoutineDraftDirty=true;
        window.__dccRoutineUnsavedClient=String(id);
        save();
        window.openTrainingExercises?.(id,di,true);
        return;
      }

      const existing=existingExercise(day,exerciseId);
      if(existing){notify('Ese ejercicio ya está añadido como '+exerciseKind(existing));return;}

      const selected=Array.isArray(day.selectedExerciseIds)?day.selectedExerciseIds:[];
      const already=selected.includes(exerciseId);
      if(!already&&current==='superset'&&selected.length>=4){notify('La superserie admite hasta 4 ejercicios');return;}
      if(!already&&current==='restpause'&&selected.length>=1){notify('REST-pause utiliza 1 ejercicio');return;}
      const result=nativeToggleTrainingExercise.apply(this,arguments);
      rememberCurrentDraft(id,di,day);
      requestAnimationFrame(decoratePicker);
      return result;
    };
  }

  const nativeContinueSelection=typeof window.continueTrainingExerciseSelection==='function'?window.continueTrainingExerciseSelection:null;
  if(nativeContinueSelection){
    window.continueTrainingExerciseSelection=function(id,di){
      const current=mode(id,di);const day=dayRef(id,di);
      if(!day)return;
      if(current==='normal'&&absorbNormalSelection(day))save();
      if((current==='superset'||current==='restpause')&&day.selectedExerciseIds?.length){
        if(!commitSpecialDraft(id,di,day,current,false))return;
      }
      if(!Array.isArray(day.exercises)||!day.exercises.length){notify('Añade al menos un ejercicio');return;}
      removePickerSavebar();
      return nativeContinueSelection.apply(this,arguments);
    };
  }

  const nativeRenderConfiguration=typeof window.renderTrainingExerciseConfiguration==='function'?window.renderTrainingExerciseConfiguration:null;
  if(nativeRenderConfiguration){window.renderTrainingExerciseConfiguration=function(id,di){removePickerSavebar();const result=nativeRenderConfiguration.apply(this,arguments);requestAnimationFrame(()=>{decorateConfiguration(id,di);window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0;const root=document.getElementById('coach-main');if(root)root.scrollTop=0;});return result;};}

  const nativeBackFromTrainingExercises=typeof window.backFromTrainingExercises==='function'?window.backFromTrainingExercises:null;
  if(nativeBackFromTrainingExercises){
    window.backFromTrainingExercises=function(){
      if(!confirmRoutineExit())return;
      removePickerSavebar();
      return nativeBackFromTrainingExercises.apply(this,arguments);
    };
  }

  const nativeToggleTrainingMuscle=typeof window.toggleTrainingMuscle==='function'?window.toggleTrainingMuscle:null;
  if(nativeToggleTrainingMuscle){
    window.toggleTrainingMuscle=function(id){
      markRoutineDirty(id);
      return nativeToggleTrainingMuscle.apply(this,arguments);
    };
  }

  const nativeAddManualTrainingExercise=typeof window.addManualTrainingExercise==='function'?window.addManualTrainingExercise:null;
  if(nativeAddManualTrainingExercise){
    window.addManualTrainingExercise=function(id,di){
      const before=dayRef(id,di)?.exercises?.length||0;
      ensureRoutineBackup(id);
      const result=nativeAddManualTrainingExercise.apply(this,arguments);
      const after=dayRef(id,di)?.exercises?.length||0;
      if(after!==before)markRoutineDirty(id);
      return result;
    };
  }

  const nativeRemoveTrainingExercise=typeof window.removeTrainingExercise==='function'?window.removeTrainingExercise:null;
  if(nativeRemoveTrainingExercise){
    window.removeTrainingExercise=function(id,di){
      const before=dayRef(id,di)?.exercises?.length||0;
      ensureRoutineBackup(id);
      const result=nativeRemoveTrainingExercise.apply(this,arguments);
      const after=dayRef(id,di)?.exercises?.length||0;
      if(after!==before)markRoutineDirty(id);
      return result;
    };
  }

  const nativeSaveConfiguredTraining=typeof window.saveConfiguredTraining==='function'?window.saveConfiguredTraining:null;
  if(nativeSaveConfiguredTraining){
    window.saveConfiguredTraining=async function(){
      window.__dccRoutineNavBypass=true;
      try{
        const result=await nativeSaveConfiguredTraining.apply(this,arguments);
        const day=dayRef(arguments[0],arguments[1]);
        if(day?.trainingSetupStep==='complete')clearRoutineDirty();
        return result;
      }finally{window.__dccRoutineNavBypass=false;}
    };
  }

  const nativeShowCoach=typeof window.showCoach==='function'?window.showCoach:null;
  if(nativeShowCoach){
    window.showCoach=function(){
      if(window.__dccRoutineDraftDirty&&!window.__dccRoutineNavBypass&&!confirmRoutineExit())return;
      return nativeShowCoach.apply(this,arguments);
    };
  }

  const nativeOpenClientTabGuard=typeof window.dccOpenClientTab==='function'?window.dccOpenClientTab:null;
  if(nativeOpenClientTabGuard){
    window.dccOpenClientTab=function(id,tab){
      if(window.__dccRoutineDraftDirty&&tab!=='training'&&!window.__dccRoutineNavBypass&&!confirmRoutineExit())return;
      return nativeOpenClientTabGuard.apply(this,arguments);
    };
  }

  function supersetWorkoutContext(){
    const workout=window.activeWorkout;if(!workout)return null;
    const ex=workout.exercises?.[Number(workout.currentExercise)||0];if(!ex?.supersetId)return null;
    if(!workout.supersetRoundById)workout.supersetRoundById={};
    const groupIndices=(workout.exercises||[]).map((item,index)=>item?.supersetId===ex.supersetId?index:-1).filter(index=>index>=0).sort((a,b)=>(parseInt(workout.exercises[a]?.supersetOrder)||a)-(parseInt(workout.exercises[b]?.supersetOrder)||b));
    const position=Math.max(0,groupIndices.indexOf(workout.currentExercise));
    const rounds=Math.max(1,parseInt(ex.supersetRounds)||parseInt(ex.sets)||1);
    const round=Math.max(1,parseInt(workout.supersetRoundById[ex.supersetId])||1);
    const rest=Math.max(0,parseInt(ex.supersetRest)||parseInt(workout.exercises[groupIndices[0]]?.supersetRest)||0);
    return {workout,ex,groupIndices,position,rounds,round,rest};
  }

  function restPauseWorkoutContext(){
    const workout=window.activeWorkout;if(!workout)return null;
    const ex=workout.exercises?.[Number(workout.currentExercise)||0];if(!ex?.restPause)return null;
    const reps=String(ex.restPauseReps||ex.reps||'12/10/8/6');
    const targets=reps.split(/[\/\-–,\s]+/).filter(Boolean);
    const blocks=Math.max(2,targets.length||parseInt(ex.restPauseBlocks)||4);
    const seconds=Math.max(1,parseInt(ex.restPauseSeconds)||7);
    const finalRest=Math.max(0,parseInt(ex.restPauseFinalRest)||parseInt(ex.restBetweenExercises)||0);
    return {workout,ex,reps,targets,blocks,seconds,finalRest};
  }

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
      banner.innerHTML='<b>REST-PAUSE · '+restPause.reps+' REP</b><span>Bloque '+Math.min(completed+1,restPause.blocks)+' de '+restPause.blocks+(target?' · objetivo '+target+' rep':'')+' · '+restPause.seconds+' s entre bloques · '+restPause.finalRest+' s al terminar</span>';
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
      if(restPause){restPause.ex.sets=String(restPause.blocks);restPause.ex.reps=restPause.reps;restPause.ex.restBetweenSets=restPause.seconds;restPause.ex.restBetweenExercises=restPause.finalRest;}
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
    };
  }

  installStyle();requestAnimationFrame(decoratePicker);
})();
