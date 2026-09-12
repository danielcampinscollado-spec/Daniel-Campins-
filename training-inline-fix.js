/* DCC — editor inline premium de rutina: músculos + ejercicios */
(function(){
  'use strict';
  if(window.__dccTrainingInlineOptimizedV2)return;
  window.__dccTrainingInlineOptimizedV2=true;

  const state={previousOpen:false,guard:false,muscleDraft:[],exerciseTab:'',raf:0};
  const clone=v=>JSON.parse(JSON.stringify(v));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const MUSCLES=['Pectoral','Dorsal','Hombros','Bíceps','Tríceps','Cuádriceps','Femoral','Glúteos','Aductores','Gemelos','Trapecio','Antebrazos','Lumbar','Core'];

  function routineDays(id){const r=window.data?.routines?.[id];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]}
  function setRoutineDays(id,days){if(!window.data.routines)window.data.routines={};const r=window.data.routines[id];if(Array.isArray(r))window.data.routines[id]=days;else if(r&&typeof r==='object'&&Array.isArray(r.routine))r.routine=days;else window.data.routines[id]=days}
  function previousDays(id){const p=window.data?.previousRoutines?.[id];return Array.isArray(p)?p:Array.isArray(p?.routine)?p.routine:[]}
  function library(){return Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[]}
  function exName(ex){return ex?.name??ex?.nombre??ex?.exercise??ex?.exerciseName??'Ejercicio'}
  function exSets(ex){return ex?.sets??ex?.series??ex?.setCount??''}
  function exReps(ex){return ex?.reps??ex?.repetitions??ex?.repeticiones??ex?.repRange??''}
  function normMuscle(value){
    const raw=String(value||'').trim();
    const n=raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(n==='pecho'||n==='pectoral')return'Pectoral';
    if(n==='hombro'||n==='hombros'||n==='deltoide'||n==='deltoides')return'Hombros';
    if(n==='triceps')return'Tríceps';
    if(n==='biceps')return'Bíceps';
    if(n==='dorsal'||n==='dorsales'||n==='espalda')return'Dorsal';
    if(n==='cuadriceps')return'Cuádriceps';
    if(n==='femoral'||n==='femorales'||n==='isquio'||n==='isquios'||n==='isquiotibial'||n==='isquiotibiales')return'Femoral';
    if(n==='gluteo'||n==='gluteos')return'Glúteos';
    if(n==='aductor'||n==='aductores')return'Aductores';
    if(n==='gemelo'||n==='gemelos'||n==='pantorrilla'||n==='pantorrillas')return'Gemelos';
    if(n==='trapecio'||n==='trapecios')return'Trapecio';
    if(n==='antebrazo'||n==='antebrazos')return'Antebrazos';
    if(n==='lumbar'||n==='lumbares')return'Lumbar';
    if(n==='core'||n==='abdomen'||n==='abdominales')return'Core';
    if(n==='pierna'||n==='piernas')return'Pierna';
    if(n==='brazo'||n==='brazos')return'Brazo';
    return raw;
  }
  function expandMuscle(value){
    const m=normMuscle(value);
    if(m==='Pierna')return['Cuádriceps','Femoral','Glúteos','Aductores','Gemelos'];
    if(m==='Brazo')return['Bíceps','Tríceps','Antebrazos'];
    return m?[m]:[];
  }
  function dayMuscles(day){
    const raw=day?.muscles??day?.muscle??day?.group??'';
    const input=Array.isArray(raw)?raw:String(raw).split(/[·,]/);
    return [...new Set(input.flatMap(expandMuscle).filter(x=>x&&!/^sin grupos/i.test(x)))];
  }
  function writeMuscles(day,ms){const clean=[...new Set(ms.flatMap(expandMuscle).filter(Boolean))];day.muscles=clean;day.muscle=clean.length?clean.join(' · '):'Sin grupos musculares'}
  function persist(){try{if(typeof window.saveData==='function')window.saveData()}catch(e){console.error(e)}}

  function ensureCss(){
    if(document.getElementById('dcc-training-inline-fix-css'))return;
    const s=document.createElement('style');s.id='dcc-training-inline-fix-css';s.textContent=`
      .dcc-tr-ex.dcc-no-img{grid-template-columns:minmax(0,1fr) auto!important;padding-left:12px!important}.dcc-tr-ex.dcc-no-img>div:first-child:empty{display:none!important}
      .dcc-tr-inline-trigger{width:100%;margin:7px 0 0;padding:10px;border:1px dashed rgba(183,123,19,.42);border-radius:11px;background:#fffaf1;color:#9a6408;font-size:10px;font-weight:900}
      .dcc-tr-history-panel{margin-top:10px;border:1px solid rgba(183,123,19,.25);border-radius:16px;background:#fffdf8;overflow:hidden}.dcc-tr-history-head{width:100%;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;padding:13px 14px;border:0;background:transparent;color:#17191d;text-align:left}.dcc-tr-history-head b{display:block;font-size:13px}.dcc-tr-history-head small{display:block;margin-top:3px;color:#7b828c;font-size:9px}.dcc-tr-history-body{display:grid;gap:7px;padding:10px;border-top:1px solid rgba(183,123,19,.14)}.dcc-tr-history-day{padding:10px;border:1px solid rgba(183,123,19,.18);border-radius:11px;background:#fffaf1}.dcc-tr-history-ex{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:7px 0;border-top:1px solid rgba(183,123,19,.12);font-size:9px}.dcc-tr-history-ex span:last-child{color:#9a6408;text-align:right}
      .dcc-tr-modal{position:fixed;inset:0;z-index:99999;background:rgba(55,45,30,.22);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;padding:12px}.dcc-tr-modal-card{width:min(680px,100%);max-height:82vh;overflow:auto;border:1px solid rgba(183,123,19,.34);border-radius:22px 22px 14px 14px;background:linear-gradient(160deg,#fffdf8 0%,#f7eedf 100%);color:#17191d;box-shadow:0 -18px 48px rgba(78,58,28,.16);padding:14px}.dcc-tr-modal-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.dcc-tr-modal-head h3{margin:0;font-size:18px}.dcc-tr-modal-close{width:34px;height:34px;border:1px solid rgba(183,123,19,.34);border-radius:50%;background:#fff8e8;color:#8d5b08;font-size:18px}.dcc-tr-modal-sub{color:#737b86;font-size:10px;margin:-4px 0 10px}.dcc-tr-chiprow{display:flex;gap:6px;flex-wrap:wrap}.dcc-tr-chip{border:1px solid rgba(183,123,19,.28);border-radius:999px;background:#fffdf8;color:#4e5560;padding:8px 10px;font-size:10px;font-weight:750}.dcc-tr-chip.on{border-color:#d9aa4a;background:linear-gradient(135deg,#f7d97f,#e7b13f);color:#1a150b}.dcc-tr-modal-save{width:100%;margin-top:12px;padding:11px;border:1px solid #e2b044;border-radius:12px;background:linear-gradient(135deg,#f3cf69,#d9a63d);color:#090806;font-weight:900}.dcc-tr-tabs{display:flex;gap:6px;overflow:auto;padding-bottom:8px}.dcc-tr-tabx{flex:none;border:1px solid rgba(183,123,19,.28);border-radius:999px;background:#fffdf8;color:#626a75;padding:7px 10px;font-size:9px}.dcc-tr-tabx.on{border-color:#d9aa4a;color:#1a150b;background:linear-gradient(135deg,#f7d97f,#e7b13f)}.dcc-tr-ex-list{display:grid;gap:7px}.dcc-tr-choice{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:9px;width:100%;padding:12px 14px;border:1px solid rgba(183,123,19,.22);border-radius:12px;background:#fffdf8;color:#17191d;text-align:left}.dcc-tr-choice b{display:block;font-size:10px}.dcc-tr-choice small{display:block;margin-top:3px;color:#7a828c;font-size:8px}.dcc-tr-choice strong{color:#b77b13;font-size:20px}.dcc-tr-manual{width:100%;margin-top:9px;padding:9px;border:1px dashed rgba(183,123,19,.42);border-radius:11px;background:#fffaf1;color:#9a6408;font-size:9px;font-weight:850}
    `;(document.head||document.documentElement).appendChild(s)
  }

  function stripExerciseImages(){
    document.querySelectorAll('#coach-main .dcc-tr-ex').forEach(row=>{
      row.querySelectorAll(':scope>img').forEach(img=>img.remove());
      const first=row.firstElementChild;if(first&&first.tagName==='DIV'&&!first.className)first.remove();
      row.classList.add('dcc-no-img');
    });
  }
  function historyHtml(id){const p=previousDays(id);return `<section class="dcc-tr-history-panel" data-dcc-history="1"><button class="dcc-tr-history-head" onclick="dccTogglePreviousRoutineInline('${esc(id)}')"><span><b>↶ &nbsp; Rutina anterior</b><small>${p.length?'Ver la última rutina guardada':'Todavía no hay una rutina anterior guardada'}</small></span><span class="dcc-tr-arrow">${state.previousOpen?'⌃':'›'}</span></button>${state.previousOpen&&p.length?`<div class="dcc-tr-history-body">${p.map((d,i)=>`<div class="dcc-tr-history-day"><b>Día ${i+1}</b><small>${esc(dayMuscles(d).join(' · ')||'Sin grupos musculares')}</small>${(d.exercises||[]).map(ex=>`<div class="dcc-tr-history-ex"><span>${esc(exName(ex))}</span><span>${esc(exSets(ex)||'—')} series · ${esc(exReps(ex)||'—')} reps</span></div>`).join('')}</div>`).join('')}</div>`:''}</section>`}

  function decorate(){
    if(state.guard)return;
    const active=[...document.querySelectorAll('.dcc-ca-tab.active')].some(b=>/Entrenamiento/i.test(b.textContent||''));if(!active)return;
    const id=String(window.selectedClient??'');if(!id||!document.querySelector('.dcc-tr-head'))return;
    state.guard=true;
    try{
      ensureCss();stripExerciseImages();document.querySelectorAll('button.dcc-tr-history').forEach(x=>x.remove());
      const existingHistory=document.querySelector('[data-dcc-history="1"]');
      if(!window.__dccTrainingEdit){
        if(!existingHistory){const n=document.querySelector('.dcc-tr-new');if(n)n.insertAdjacentHTML('beforebegin',historyHtml(id));}
      }else{
        if(existingHistory)existingHistory.remove();
        const days=routineDays(id);
        document.querySelectorAll('.dcc-tr-days>.dcc-tr-day').forEach((de,di)=>{
          de.querySelector('.dcc-tr-add')?.remove();
          if(de.querySelector('.dcc-tr-inline-trigger'))return;
          const box=de.querySelector('.dcc-tr-exercises'),d=days[di];if(!box||!d)return;
          const ms=dayMuscles(d);
          box.insertAdjacentHTML('beforeend',ms.length?`<button class="dcc-tr-inline-trigger" onclick="dccOpenExerciseModal('${esc(id)}',${di})">＋ Añadir ejercicio</button>`:`<button class="dcc-tr-inline-trigger" onclick="dccOpenMuscleModal('${esc(id)}',${di})">＋ Añadir músculo</button>`);
        });
        document.querySelector('.dcc-tr-new')?.remove();
      }
    }finally{state.guard=false;}
  }

  function scheduleDecorate(){if(state.raf)return;state.raf=requestAnimationFrame(()=>{state.raf=0;install();decorate();});}
  function modal(html){document.getElementById('dcc-tr-modal')?.remove();const el=document.createElement('div');el.id='dcc-tr-modal';el.className='dcc-tr-modal';el.innerHTML=html;el.addEventListener('click',e=>{if(e.target===el)el.remove()});document.body.appendChild(el)}
  window.dccCloseTrainingModal=()=>document.getElementById('dcc-tr-modal')?.remove();
  window.dccOpenMuscleModal=(id,di)=>{const d=routineDays(id)[di];if(!d)return;state.muscleDraft=dayMuscles(d);modal(`<div class="dcc-tr-modal-card"><div class="dcc-tr-modal-head"><h3>Elegir músculos · Día ${di+1}</h3><button class="dcc-tr-modal-close" onclick="dccCloseTrainingModal()">×</button></div><p class="dcc-tr-modal-sub">Selecciona uno o varios grupos musculares.</p><div class="dcc-tr-chiprow">${MUSCLES.map(m=>`<button class="dcc-tr-chip ${state.muscleDraft.includes(m)?'on':''}" onclick="dccDraftMuscle(this,'${esc(m)}')">${esc(m)}</button>`).join('')}</div><button class="dcc-tr-modal-save" onclick="dccSaveRoutineMuscles('${esc(id)}',${di})">Guardar músculos</button></div>`)};
  window.dccDraftMuscle=(btn,m)=>{state.muscleDraft=state.muscleDraft.includes(m)?state.muscleDraft.filter(x=>x!==m):[...state.muscleDraft,m];btn.classList.toggle('on')};
  window.dccSaveRoutineMuscles=(id,di)=>{const d=routineDays(id)[di];if(!d)return;writeMuscles(d,state.muscleDraft);window.__dccTrainingOpen=di;dccCloseTrainingModal();window.dccClientAdmin(id,'training')};

  function exerciseModalHtml(id,di){
    const d=routineDays(id)[di],ms=dayMuscles(d);if(!ms.length)return'';
    if(!ms.includes(state.exerciseTab))state.exerciseTab=ms[0]||'';
    const filtered=library().filter(x=>normMuscle(x.muscle)===state.exerciseTab);
    return `<div class="dcc-tr-modal-card"><div class="dcc-tr-modal-head"><h3>Añadir ejercicio · Día ${di+1}</h3><button class="dcc-tr-modal-close" onclick="dccCloseTrainingModal()">×</button></div><p class="dcc-tr-modal-sub">Elige el grupo muscular del día y después el ejercicio.</p><div class="dcc-tr-tabs">${ms.map(m=>`<button class="dcc-tr-tabx ${state.exerciseTab===m?'on':''}" onclick="dccSetExerciseTab('${esc(id)}',${di},'${esc(m)}')">${esc(m)}</button>`).join('')}</div><div class="dcc-tr-ex-list">${filtered.map(ex=>`<button class="dcc-tr-choice" onclick="dccChooseRoutineExercise('${esc(id)}',${di},'${esc(ex.id)}')"><span><b>${esc(ex.name)}</b><small>${esc(normMuscle(ex.muscle))}</small></span><strong>＋</strong></button>`).join('')||'<div class="dcc-diet-empty">No hay ejercicios disponibles en esta categoría.</div>'}</div><button class="dcc-tr-manual" onclick="dccAddManualRoutineExercise('${esc(id)}',${di})">＋ Añadir ejercicio manual</button></div>`;
  }
  window.dccOpenExerciseModal=async(id,di)=>{
    try{if(window.exerciseLibraryReady)await window.exerciseLibraryReady;}catch(error){console.error('DCC — biblioteca de ejercicios:',error)}
    const ms=dayMuscles(routineDays(id)[di]);
    state.exerciseTab=ms[0]||'';
    const html=exerciseModalHtml(id,di);if(!html)return window.dccOpenMuscleModal(id,di);modal(html)
  };
  window.dccSetExerciseTab=(id,di,m)=>{state.exerciseTab=normMuscle(m);modal(exerciseModalHtml(id,di))};
  window.dccChooseRoutineExercise=(id,di,eid)=>{const d=routineDays(id)[di],hit=library().find(x=>String(x.id)===String(eid));if(!d||!hit)return;d.exercises=Array.isArray(d.exercises)?d.exercises:[];d.exercises.push({id:hit.id,name:hit.name,muscle:normMuscle(hit.muscle),sets:'4',reps:'10-12'});window.__dccTrainingOpen=di;dccCloseTrainingModal();window.dccClientAdmin(id,'training')};
  window.dccAddManualRoutineExercise=(id,di)=>{const d=routineDays(id)[di],ms=dayMuscles(d);if(!d||!ms.length)return;const name=prompt('Nombre del ejercicio','');if(!name)return;const muscle=ms.length===1?ms[0]:(prompt('Grupo muscular ('+ms.join(' / ')+')',ms[0])||ms[0]);d.exercises=d.exercises||[];d.exercises.push({name,muscle:normMuscle(muscle),sets:'4',reps:'10-12',manual:true});window.__dccTrainingOpen=di;dccCloseTrainingModal();window.dccClientAdmin(id,'training')};
  window.dccTogglePreviousRoutineInline=id=>{state.previousOpen=!state.previousOpen;document.querySelector('[data-dcc-history="1"]')?.remove();decorate()};

  function archive(id){const raw=window.__dccTrainingBackup;if(raw===undefined)return;try{const b=JSON.parse(raw),old=Array.isArray(b)?b:Array.isArray(b?.routine)?b.routine:[],cur=routineDays(id);if(old.length&&JSON.stringify(old)!==JSON.stringify(cur)){if(!window.data.previousRoutines)window.data.previousRoutines={};window.data.previousRoutines[id]={routine:clone(old),savedAt:new Date().toISOString()};persist()}}catch(e){console.warn(e)}}
  function install(){
    if(typeof window.dccClientAdmin!=='function')return false;
    if(typeof window.dccSaveRoutine==='function'&&!window.dccSaveRoutine.__dccHistory){const base=window.dccSaveRoutine;window.dccSaveRoutine=async id=>{id=String(id);archive(id);const result=await base(id);window.__dccTrainingEdit=false;window.__dccTrainingBackup=undefined;state.previousOpen=false;try{window.dccClientAdmin(id,'training')}catch(_){ }return result};window.dccSaveRoutine.__dccHistory=true}
    if(typeof window.dccCreateRoutine==='function'&&!window.dccCreateRoutine.__dccInlineCreate){window.dccCreateRoutine=id=>{id=String(id);const cur=routineDays(id);if(cur.length&&!confirm('La rutina actual se guardará como rutina anterior. ¿Crear una nueva?'))return;if(!window.data.previousRoutines)window.data.previousRoutines={};if(cur.length)window.data.previousRoutines[id]={routine:clone(cur),savedAt:new Date().toISOString()};setRoutineDays(id,[{muscle:'Sin grupos musculares',muscles:[],exercises:[]}]);window.__dccTrainingBackup=JSON.stringify(window.data.routines[id]);window.__dccTrainingEdit=true;window.__dccTrainingOpen=0;state.previousOpen=false;persist();window.dccClientAdmin(id,'training')};window.dccCreateRoutine.__dccInlineCreate=true}
    return true;
  }
  function boot(){if(!install())setTimeout(boot,120);decorate()}
  const observer=new MutationObserver(scheduleDecorate);
  function start(){const r=document.getElementById('coach-main');if(r)observer.observe(r,{childList:true,subtree:true});boot()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();