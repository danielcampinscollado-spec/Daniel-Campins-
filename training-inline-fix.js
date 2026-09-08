/* DCC — edición inline de rutina dentro de la ficha premium del cliente */
(function(){
  const state={editing:null,previousOpen:false,guard:false};
  const clone=v=>JSON.parse(JSON.stringify(v));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function routineDays(id){
    const r=window.data?.routines?.[id];
    return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[];
  }

  function setRoutineDays(id,days){
    if(!window.data.routines)window.data.routines={};
    const current=window.data.routines[id];
    if(Array.isArray(current))window.data.routines[id]=days;
    else if(current&&typeof current==='object'&&Array.isArray(current.routine))current.routine=days;
    else window.data.routines[id]=days;
  }

  function previousDays(id){
    const p=window.data?.previousRoutines?.[id];
    if(Array.isArray(p))return p;
    if(Array.isArray(p?.routine))return p.routine;
    return [];
  }

  function library(){
    return Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];
  }

  function exName(ex){return ex?.name??ex?.nombre??ex?.exercise??ex?.exerciseName??'Ejercicio'}
  function exMuscle(ex){return ex?.muscle??ex?.grupo??ex?.group??''}
  function exSets(ex){return ex?.sets??ex?.series??ex?.setCount??''}
  function exReps(ex){return ex?.reps??ex?.repetitions??ex?.repeticiones??ex?.repRange??''}

  function approvedLibraryExercise(ex){
    const lib=library();
    const id=String(ex?.id??ex?.exerciseId??ex?.exercise_id??'');
    const name=String(exName(ex)||'').trim().toLowerCase();
    return lib.find(x=>id&&String(x.id)===id)||lib.find(x=>String(x.name||'').trim().toLowerCase()===name)||null;
  }

  function approvedImage(ex){
    const hit=approvedLibraryExercise(ex);
    return hit?.image||hit?.imageStart||'';
  }

  function normalizeMuscles(day){
    const muscles=[];
    (Array.isArray(day?.exercises)?day.exercises:[]).forEach(ex=>{
      const m=exMuscle(ex);
      if(m&&!muscles.includes(m))muscles.push(m);
    });
    if(muscles.length)day.muscle=muscles.join(' · ');
    else day.muscle='Sin grupos musculares';
  }

  function persist(){
    try{if(typeof window.saveData==='function')window.saveData()}catch(e){console.error(e)}
  }

  function ensureCss(){
    if(document.getElementById('dcc-training-inline-fix-css'))return;
    const s=document.createElement('style');
    s.id='dcc-training-inline-fix-css';
    s.textContent=`
      .dcc-tr-ex.dcc-no-img{grid-template-columns:minmax(0,1fr) auto!important;padding-left:12px!important}
      .dcc-tr-edit-tools{display:grid;grid-template-columns:52px 72px 34px;gap:5px;align-items:end;text-align:left}
      .dcc-tr-edit-tools label{margin:0;color:#8f98a3;font-size:8px;font-weight:700}
      .dcc-tr-edit-tools input{margin-top:3px;width:100%;height:30px;padding:4px 6px;border:1px solid #3d4650;border-radius:8px;background:#070b0e;color:#f3f1ec;text-align:center;font-size:10px;box-shadow:none}
      .dcc-tr-remove-ex{height:30px;border:1px solid #5b2a2e;border-radius:8px;background:#14090b;color:#ff6269;font-size:15px}
      .dcc-tr-inline-add{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;padding:3px 0 1px}
      .dcc-tr-inline-add select{height:37px;padding:0 10px;border:1px solid #35404a;border-radius:10px;background:#090e12;color:#eee;font-size:10px}
      .dcc-tr-inline-add button,.dcc-tr-add-day{border:1px solid #b88931;border-radius:10px;background:#171208;color:#f2c85f;font-size:10px;font-weight:850;padding:0 12px}
      .dcc-tr-add-day{width:100%;min-height:39px;margin-top:8px}
      .dcc-tr-history{margin-top:10px;border:1px solid #2b343c;border-radius:16px;background:linear-gradient(145deg,#0d1317,#080c0f);overflow:hidden}
      .dcc-tr-history-head{width:100%;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;padding:13px 14px;border:0;background:transparent;color:#f5f3ef;text-align:left}
      .dcc-tr-history-head b{display:block;font-size:13px}.dcc-tr-history-head small{display:block;margin-top:3px;color:#8f98a3;font-size:9px}
      .dcc-tr-history-body{display:grid;gap:7px;padding:0 10px 10px;border-top:1px solid #ffffff0d}
      .dcc-tr-history-day{padding:10px;border:1px solid #222c33;border-radius:11px;background:#0a0f13}
      .dcc-tr-history-day>b{display:block;font-size:11px}.dcc-tr-history-day>small{display:block;margin-top:2px;color:#8f98a3;font-size:9px}
      .dcc-tr-history-ex{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:7px 0;border-top:1px solid #ffffff0c;font-size:9px}.dcc-tr-history-ex:first-of-type{margin-top:7px}.dcc-tr-history-ex span:last-child{color:#d7b056;text-align:right}
      .dcc-tr-head.dcc-editing .dcc-tr-edit{background:linear-gradient(135deg,#f3cf69,#d9a63d);color:#0b0a07;border-color:#f3cf69}
      @media(max-width:520px){.dcc-tr-edit-tools{grid-template-columns:44px 62px 31px}.dcc-tr-edit-tools input{font-size:9px;padding:3px}.dcc-tr-inline-add{grid-template-columns:minmax(0,1fr) 72px}.dcc-tr-inline-add button{padding:0 8px}.dcc-tr-ex.dcc-edit-row{grid-template-columns:48px minmax(0,1fr) 142px!important}}
    `;
    document.head.appendChild(s);
  }

  function replaceExerciseImages(id){
    const days=routineDays(id);
    document.querySelectorAll('.dcc-tr-day').forEach((dayEl,di)=>{
      const day=days[di];
      if(!day)return;
      const exs=Array.isArray(day.exercises)?day.exercises:[];
      dayEl.querySelectorAll('.dcc-tr-ex').forEach((row,ei)=>{
        const ex=exs[ei];
        if(!ex)return;
        const src=approvedImage(ex);
        let img=row.querySelector('img');
        if(src){
          row.classList.remove('dcc-no-img');
          if(!img){img=document.createElement('img');row.insertBefore(img,row.firstChild)}
          if(img.getAttribute('src')!==src)img.setAttribute('src',src);
        }else{
          if(img)img.remove();
          const blank=row.firstElementChild;
          if(blank&&!blank.classList.contains('dcc-tr-ex-name')&&!blank.classList.contains('dcc-tr-spec'))blank.remove();
          row.classList.add('dcc-no-img');
        }
      });
    });
  }

  function historyHtml(id){
    const previous=previousDays(id);
    return `<section class="dcc-tr-history" data-dcc-history="1"><button class="dcc-tr-history-head" onclick="dccTogglePreviousRoutineInline('${esc(id)}')"><span><b>Rutina anterior</b><small>${previous.length?'Ver la última rutina guardada':'Todavía no hay una rutina anterior guardada'}</small></span><span class="dcc-tr-arrow">${state.previousOpen?'⌃':'›'}</span></button>${state.previousOpen&&previous.length?`<div class="dcc-tr-history-body">${previous.map((d,i)=>{const exs=Array.isArray(d?.exercises)?d.exercises:[],m=d?.muscle??d?.muscles??d?.group??d?.name??'Sin grupos musculares';return `<div class="dcc-tr-history-day"><b>Día ${i+1}</b><small>${esc(Array.isArray(m)?m.join(' · '):m)}</small>${exs.map(ex=>`<div class="dcc-tr-history-ex"><span>${esc(exName(ex))}</span><span>${esc(exSets(ex)||'—')} series · ${esc(exReps(ex)||'—')} reps</span></div>`).join('')}</div>`}).join('')}</div>`:''}</section>`;
  }

  function insertHistory(id){
    const pane=document.querySelector('.dcc-tr-days');
    const newBtn=document.querySelector('.dcc-tr-new');
    if(!pane||!newBtn)return;
    document.querySelector('[data-dcc-history="1"]')?.remove();
    newBtn.insertAdjacentHTML('beforebegin',historyHtml(id));
  }

  function addEditControls(id){
    const days=routineDays(id);
    const head=document.querySelector('.dcc-tr-head');
    if(head)head.classList.add('dcc-editing');
    const editButton=document.querySelector('.dcc-tr-edit');
    if(editButton)editButton.innerHTML='✓ &nbsp; Guardar cambios';

    document.querySelectorAll('.dcc-tr-day').forEach((dayEl,di)=>{
      const day=days[di];
      if(!day)return;
      const exs=Array.isArray(day.exercises)?day.exercises:[];
      dayEl.querySelectorAll('.dcc-tr-ex').forEach((row,ei)=>{
        const ex=exs[ei];
        if(!ex)return;
        row.classList.add('dcc-edit-row');
        const spec=row.querySelector('.dcc-tr-spec');
        if(!spec)return;
        spec.innerHTML=`<div class="dcc-tr-edit-tools"><label>Series<input inputmode="numeric" value="${esc(exSets(ex))}" onchange="dccEditRoutineField('${esc(id)}',${di},${ei},'sets',this.value)"></label><label>Reps<input value="${esc(exReps(ex))}" onchange="dccEditRoutineField('${esc(id)}',${di},${ei},'reps',this.value)"></label><button class="dcc-tr-remove-ex" onclick="dccRemoveRoutineExercise('${esc(id)}',${di},${ei})">×</button></div>`;
      });

      const box=dayEl.querySelector('.dcc-tr-exercises');
      if(box&&!box.querySelector('.dcc-tr-inline-add')){
        const options=library().map(ex=>`<option value="${esc(ex.id)}">${esc(ex.name||ex.id)}</option>`).join('');
        box.insertAdjacentHTML('beforeend',`<div class="dcc-tr-inline-add"><select id="dcc-tr-select-${di}"><option value="">Seleccionar ejercicio…</option>${options}</select><button onclick="dccAddRoutineExercise('${esc(id)}',${di})">Añadir</button></div>`);
      }
    });

    const dayList=document.querySelector('.dcc-tr-days');
    if(dayList&&!document.querySelector('.dcc-tr-add-day'))dayList.insertAdjacentHTML('afterend',`<button class="dcc-tr-add-day" onclick="dccAddRoutineDay('${esc(id)}')">＋ Añadir día</button>`);
  }

  function decorate(){
    if(state.guard)return;
    const active=[...document.querySelectorAll('.dcc-ca-tab.active')].some(b=>/Entrenamiento/i.test(b.textContent||''));
    if(!active)return;
    const id=String(window.selectedClient??'');
    if(!id||!document.querySelector('.dcc-tr-head'))return;
    state.guard=true;
    ensureCss();
    replaceExerciseImages(id);
    insertHistory(id);
    if(String(state.editing)===id)addEditControls(id);
    state.guard=false;
  }

  window.dccEditRoutineField=function(id,di,ei,key,value){
    const days=routineDays(id),ex=days?.[di]?.exercises?.[ei];
    if(!ex)return;
    if(key==='sets')ex.sets=String(value).trim();
    if(key==='reps')ex.reps=String(value).trim();
  };

  window.dccRemoveRoutineExercise=function(id,di,ei){
    if(!confirm('¿Eliminar este ejercicio de la rutina?'))return;
    const days=routineDays(id),day=days?.[di];
    if(!day||!Array.isArray(day.exercises))return;
    day.exercises.splice(ei,1);normalizeMuscles(day);
    if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'training');
  };

  window.dccAddRoutineExercise=function(id,di){
    const select=document.getElementById('dcc-tr-select-'+di),exerciseId=select?.value;
    if(!exerciseId)return;
    const hit=library().find(x=>String(x.id)===String(exerciseId));
    const days=routineDays(id),day=days?.[di];
    if(!hit||!day)return;
    day.exercises=Array.isArray(day.exercises)?day.exercises:[];
    day.exercises.push({id:hit.id,name:hit.name,muscle:hit.muscle||'',sets:'3',reps:'10-12'});
    normalizeMuscles(day);
    window.__dccTrainingOpen=di;
    if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'training');
  };

  window.dccAddRoutineDay=function(id){
    const days=routineDays(id);
    days.push({muscle:'Sin grupos musculares',exercises:[]});
    setRoutineDays(id,days);
    window.__dccTrainingOpen=days.length-1;
    if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'training');
  };

  window.dccTogglePreviousRoutineInline=function(id){
    state.previousOpen=!state.previousOpen;decorate();
  };

  function installOverrides(){
    if(typeof window.dccClientAdmin!=='function'||typeof window.dccModifyRoutine!=='function')return false;
    if(window.dccModifyRoutine.__dccInline)return true;

    const inlineModify=function(id){
      id=String(id);
      if(String(state.editing)===id){
        persist();
        state.editing=null;
        if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'training');
        return;
      }
      state.editing=id;
      decorate();
    };
    inlineModify.__dccInline=true;
    window.dccModifyRoutine=inlineModify;

    const inlineCreate=function(id){
      id=String(id);
      const current=routineDays(id);
      if(current.length&&!confirm('La rutina actual se guardará como rutina anterior. ¿Crear una nueva?'))return;
      if(!window.data.previousRoutines)window.data.previousRoutines={};
      if(current.length)window.data.previousRoutines[id]={routine:clone(current),savedAt:new Date().toISOString()};
      setRoutineDays(id,[{muscle:'Sin grupos musculares',exercises:[]}]);
      state.editing=id;state.previousOpen=false;window.__dccTrainingOpen=0;
      persist();
      if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'training');
    };
    inlineCreate.__dccInline=true;
    window.dccCreateRoutine=inlineCreate;
    return true;
  }

  function boot(){
    if(!installOverrides())setTimeout(boot,120);
    decorate();
  }

  const observer=new MutationObserver(()=>setTimeout(()=>{installOverrides();decorate()},0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{const root=document.getElementById('coach-main');if(root)observer.observe(root,{childList:true,subtree:true});boot()});
  else{const root=document.getElementById('coach-main');if(root)observer.observe(root,{childList:true,subtree:true});boot()}
})();
