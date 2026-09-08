/* DCC — ajustes inline de entrenamiento dentro de la ficha premium */
(function(){
  const state={previousOpen:false,guard:false};
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

  function library(){return Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[]}
  function exName(ex){return ex?.name??ex?.nombre??ex?.exercise??ex?.exerciseName??'Ejercicio'}
  function exMuscle(ex){return ex?.muscle??ex?.grupo??ex?.group??''}
  function exSets(ex){return ex?.sets??ex?.series??ex?.setCount??''}
  function exReps(ex){return ex?.reps??ex?.repetitions??ex?.repeticiones??ex?.repRange??''}

  function libraryExercise(ex){
    const lib=library();
    const id=String(ex?.id??ex?.exerciseId??ex?.exercise_id??'');
    const name=String(exName(ex)||'').trim().toLowerCase();
    return lib.find(x=>id&&String(x.id)===id)||lib.find(x=>String(x.name||'').trim().toLowerCase()===name)||null;
  }

  function approvedImage(ex){
    const hit=libraryExercise(ex);
    return hit?.image||hit?.imageStart||'';
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
      .dcc-tr-history-panel{margin-top:10px;border:1px solid #2b343c;border-radius:16px;background:linear-gradient(145deg,#0d1317,#080c0f);overflow:hidden}
      .dcc-tr-history-head{width:100%;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;padding:13px 14px;border:0;background:transparent;color:#f5f3ef;text-align:left}
      .dcc-tr-history-head b{display:block;font-size:13px}.dcc-tr-history-head small{display:block;margin-top:3px;color:#8f98a3;font-size:9px}
      .dcc-tr-history-body{display:grid;gap:7px;padding:10px;border-top:1px solid #ffffff0d}
      .dcc-tr-history-day{padding:10px;border:1px solid #222c33;border-radius:11px;background:#0a0f13}
      .dcc-tr-history-day>b{display:block;font-size:11px}.dcc-tr-history-day>small{display:block;margin-top:2px;color:#8f98a3;font-size:9px}
      .dcc-tr-history-ex{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:7px 0;border-top:1px solid #ffffff0c;font-size:9px}
      .dcc-tr-history-ex:first-of-type{margin-top:7px}.dcc-tr-history-ex span:last-child{color:#d7b056;text-align:right}
    `;
    document.head.appendChild(s);
  }

  function replaceExerciseImages(id){
    const days=routineDays(id);
    document.querySelectorAll('.dcc-tr-days > .dcc-tr-day').forEach((dayEl,di)=>{
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
          const first=row.firstElementChild;
          if(first&&!first.classList.contains('dcc-tr-ex-name')&&!first.classList.contains('dcc-tr-spec'))first.remove();
          row.classList.add('dcc-no-img');
        }
      });
    });
  }

  function historyHtml(id){
    const previous=previousDays(id);
    return `<section class="dcc-tr-history-panel" data-dcc-history="1"><button class="dcc-tr-history-head" onclick="dccTogglePreviousRoutineInline('${esc(id)}')"><span><b>↶ &nbsp; Rutina anterior</b><small>${previous.length?'Ver la última rutina guardada':'Todavía no hay una rutina anterior guardada'}</small></span><span class="dcc-tr-arrow">${state.previousOpen?'⌃':'›'}</span></button>${state.previousOpen&&previous.length?`<div class="dcc-tr-history-body">${previous.map((d,i)=>{const exs=Array.isArray(d?.exercises)?d.exercises:[],m=d?.muscle??d?.muscles??d?.group??d?.name??'Sin grupos musculares';return `<div class="dcc-tr-history-day"><b>Día ${i+1}</b><small>${esc(Array.isArray(m)?m.join(' · '):m)}</small>${exs.map(ex=>`<div class="dcc-tr-history-ex"><span>${esc(exName(ex))}</span><span>${esc(exSets(ex)||'—')} series · ${esc(exReps(ex)||'—')} reps</span></div>`).join('')}</div>`}).join('')}</div>`:''}</section>`;
  }

  function insertHistory(id){
    /* Quitamos el botón/placeholder antiguo para que solo exista un histórico real. */
    document.querySelectorAll('button.dcc-tr-history').forEach(el=>el.remove());
    document.querySelector('[data-dcc-history="1"]')?.remove();
    if(window.__dccTrainingEdit)return;
    const newBtn=document.querySelector('.dcc-tr-new');
    if(!newBtn)return;
    newBtn.insertAdjacentHTML('beforebegin',historyHtml(id));
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
    state.guard=false;
  }

  window.dccTogglePreviousRoutineInline=function(id){
    state.previousOpen=!state.previousOpen;
    decorate();
  };

  function archiveBackupIfChanged(id){
    const raw=window.__dccTrainingBackup;
    if(raw===undefined)return;
    try{
      const backup=JSON.parse(raw);
      const oldDays=Array.isArray(backup)?backup:Array.isArray(backup?.routine)?backup.routine:[];
      const current=routineDays(id);
      if(oldDays.length&&JSON.stringify(oldDays)!==JSON.stringify(current)){
        if(!window.data.previousRoutines)window.data.previousRoutines={};
        window.data.previousRoutines[id]={routine:clone(oldDays),savedAt:new Date().toISOString()};
        persist();
      }
    }catch(e){console.warn('No se pudo archivar la rutina anterior',e)}
  }

  function installOverrides(){
    if(typeof window.dccClientAdmin!=='function'||typeof window.dccModifyRoutine!=='function')return false;

    /* dccModifyRoutine del cliente premium ya edita inline. No lo sustituimos. */

    if(typeof window.dccSaveRoutine==='function'&&!window.dccSaveRoutine.__dccHistory){
      const baseSave=window.dccSaveRoutine;
      const wrappedSave=async function(id){
        id=String(id);
        archiveBackupIfChanged(id);
        return await baseSave(id);
      };
      wrappedSave.__dccHistory=true;
      window.dccSaveRoutine=wrappedSave;
    }

    if(typeof window.dccCreateRoutine==='function'&&!window.dccCreateRoutine.__dccInlineCreate){
      const inlineCreate=function(id){
        id=String(id);
        const current=routineDays(id);
        if(current.length&&!confirm('La rutina actual se guardará como rutina anterior. ¿Crear una nueva?'))return;
        if(!window.data.previousRoutines)window.data.previousRoutines={};
        if(current.length)window.data.previousRoutines[id]={routine:clone(current),savedAt:new Date().toISOString()};
        setRoutineDays(id,[{muscle:'Sin grupos musculares',exercises:[]}]);
        window.__dccTrainingBackup=JSON.stringify(window.data.routines[id]);
        window.__dccTrainingEdit=true;
        window.__dccTrainingOpen=0;
        state.previousOpen=false;
        persist();
        window.dccClientAdmin(id,'training');
      };
      inlineCreate.__dccInlineCreate=true;
      window.dccCreateRoutine=inlineCreate;
    }
    return true;
  }

  function boot(){
    if(!installOverrides())setTimeout(boot,120);
    decorate();
  }

  const observer=new MutationObserver(()=>setTimeout(()=>{installOverrides();decorate()},0));
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{
      const root=document.getElementById('coach-main');
      if(root)observer.observe(root,{childList:true,subtree:true});
      boot();
    });
  }else{
    const root=document.getElementById('coach-main');
    if(root)observer.observe(root,{childList:true,subtree:true});
    boot();
  }
})();