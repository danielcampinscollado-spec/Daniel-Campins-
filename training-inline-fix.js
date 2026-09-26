/* DCC — editor inline premium de rutina: músculos + ejercicios */
(function(){
  'use strict';
  if(window.__dccTrainingInlineOptimizedV2)return;
  window.__dccTrainingInlineOptimizedV2=true;

  const state={previousOpen:false,guard:false,muscleDraft:[],anatomyDraft:'male',exerciseTab:'',raf:0};
  const clone=v=>JSON.parse(JSON.stringify(v));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const MUSCLES=['Pectoral','Dorsal','Hombros','Bíceps','Tríceps','Cuádriceps','Femoral','Glúteos','Aductores','Gemelos','Trapecio','Antebrazos','Lumbar','Core'];

  function routineDays(id){const r=window.data?.routines?.[id];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]}
  function setRoutineDays(id,days){if(!window.data.routines)window.data.routines={};const r=window.data.routines[id];if(Array.isArray(r))window.data.routines[id]=days;else if(r&&typeof r==='object'&&Array.isArray(r.routine))r.routine=days;else window.data.routines[id]=days}
  function previousDays(id){const p=window.data?.previousRoutines?.[id];return Array.isArray(p)?p:Array.isArray(p?.routine)?p.routine:[]}
  function library(){try{if(typeof exerciseLibraryFull!=='undefined'&&Array.isArray(exerciseLibraryFull))return exerciseLibraryFull}catch(_){}return Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[]}
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
    const raw=(Array.isArray(day?.muscleGroups)&&day.muscleGroups.length)?day.muscleGroups:(day?.muscles??day?.muscle??day?.group??'');
    const input=Array.isArray(raw)?raw:String(raw).split(/[·,]/);
    return [...new Set(input.flatMap(expandMuscle).filter(x=>x&&!/^sin grupos/i.test(x)))];
  }
  function writeMuscles(day,ms){const clean=[...new Set(ms.flatMap(expandMuscle).filter(Boolean))];day.muscleGroups=clean;day.muscles=clean;day.muscle=clean.length?clean.join(' · '):'Sin grupos musculares'}
  function persist(){try{if(typeof window.saveData==='function')window.saveData()}catch(e){console.error(e)}}

  function ensureCss(){
    if(document.getElementById('dcc-training-inline-fix-css'))return;
    const s=document.createElement('style');s.id='dcc-training-inline-fix-css';s.textContent=`
      .dcc-tr-ex.dcc-no-img{grid-template-columns:minmax(0,1fr) auto!important;padding-left:12px!important}.dcc-tr-ex.dcc-no-img>div:first-child:empty{display:none!important}
      .dcc-tr-inline-trigger{width:100%;margin:7px 0 0;padding:10px;border:1px dashed rgba(183,123,19,.42);border-radius:11px;background:#fffaf1;color:#9a6408;font-size:10px;font-weight:900}
      .dcc-tr-actions{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;align-items:stretch!important;position:static!important;inset:auto!important;margin-top:18px!important;margin-bottom:118px!important;transform:none!important}.dcc-tr-actions>.dcc-tr-edit,.dcc-tr-actions>.dcc-tr-new,.dcc-tr-actions>.dcc-tr-history-panel{min-width:0!important;width:100%!important;box-sizing:border-box!important;margin:0!important}.dcc-tr-history-panel{margin:0!important;border:1px solid rgba(183,123,19,.25);border-radius:14px;background:#fffdf8;overflow:hidden;min-height:42px!important}.dcc-tr-actions .dcc-tr-history-panel{height:100%!important}.dcc-tr-actions .dcc-tr-history-head{height:100%!important;min-height:42px!important;padding:10px 12px!important}.dcc-tr-history-head{width:100%;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;padding:13px 14px;border:0;background:transparent;color:#17191d;text-align:left}.dcc-tr-history-head b{display:block;font-size:13px}.dcc-tr-history-head small{display:block;margin-top:3px;color:#7b828c;font-size:9px}.dcc-tr-history-body{display:grid;gap:7px;padding:10px;border-top:1px solid rgba(183,123,19,.14)}.dcc-tr-history-day{padding:10px;border:1px solid rgba(183,123,19,.18);border-radius:11px;background:#fffaf1}.dcc-tr-history-ex{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:7px 0;border-top:1px solid rgba(183,123,19,.12);font-size:9px}.dcc-tr-history-ex span:last-child{color:#9a6408;text-align:right}
      .dcc-tr-modal{position:fixed;inset:0;z-index:99999;background:rgba(55,45,30,.22);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;padding:12px}.dcc-tr-modal-card{width:min(680px,100%);max-height:82vh;overflow:auto;border:1px solid rgba(183,123,19,.34);border-radius:22px 22px 14px 14px;background:linear-gradient(160deg,#fffdf8 0%,#f7eedf 100%);color:#17191d;box-shadow:0 -18px 48px rgba(78,58,28,.16);padding:14px}.dcc-tr-modal-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.dcc-tr-modal-head h3{margin:0;font-size:18px}.dcc-tr-modal-close{width:34px;height:34px;border:1px solid rgba(183,123,19,.34);border-radius:50%;background:#fff8e8;color:#8d5b08;font-size:18px}.dcc-tr-modal-sub{color:#737b86;font-size:10px;margin:-4px 0 10px}.dcc-tr-chiprow{display:flex;gap:6px;flex-wrap:wrap}.dcc-tr-chip{border:1px solid rgba(183,123,19,.28);border-radius:999px;background:#fffdf8;color:#4e5560;padding:8px 10px;font-size:10px;font-weight:750}.dcc-tr-chip.on{border-color:#d9aa4a;background:linear-gradient(135deg,#f7d97f,#e7b13f);color:#1a150b}.dcc-tr-config{display:grid;gap:12px}.dcc-tr-config-copy{padding:12px;border:1px solid rgba(183,123,19,.18);border-radius:14px;background:#fffaf1}.dcc-tr-config-copy b{display:block;font-size:13px}.dcc-tr-config-copy small{display:block;margin-top:4px;color:#7b828c;font-size:9px}.dcc-tr-safe{display:inline-flex;margin-top:8px;padding:5px 8px;border:1px solid rgba(183,123,19,.22);border-radius:999px;color:#9a6408;font-size:8px;font-weight:900}.dcc-tr-anatomy-title{margin:0;font-size:13px}.dcc-tr-anatomy-sub{margin:3px 0 0;color:#7b828c;font-size:9px}.dcc-tr-anatomy-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.dcc-tr-anatomy{position:relative;padding:11px;border:1px solid rgba(183,123,19,.22);border-radius:13px;background:#fffdf8;text-align:left;color:#17191d}.dcc-tr-anatomy.on{border-color:#d9aa4a;box-shadow:0 0 0 1px rgba(217,170,74,.18)}.dcc-tr-anatomy b,.dcc-tr-anatomy small{display:block}.dcc-tr-anatomy small{margin-top:2px;color:#7b828c;font-size:8px}.dcc-tr-anatomy-check{position:absolute;right:9px;top:9px;color:#b77b13;font-weight:900}.dcc-tr-muscle-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}.dcc-tr-muscle-card{min-height:82px;padding:5px 3px;border:1px solid rgba(183,123,19,.18);border-radius:10px;background:#fffdf8;color:#17191d;font-size:7.5px;font-weight:800;line-height:1.1}.dcc-tr-muscle-card.on{border-color:#d9aa4a;background:#fff8e8;box-shadow:0 0 0 1px rgba(217,170,74,.12)}.dcc-tr-muscle-visual{height:56px;margin:0 auto 3px;border-radius:7px;background-repeat:no-repeat;background-position:center;background-size:contain;display:block;transform:none;transform-origin:center}.dcc-tr-count{font-size:9px;color:#7b828c}.dcc-tr-modal-save{display:block;width:min(250px,78%);margin:10px auto 0;padding:8px 12px;min-height:38px;border:1px solid rgba(183,123,19,.32);border-radius:11px;background:#fffaf1;color:#8f6215;font-size:9px!important;line-height:1.1!important;font-weight:850!important;letter-spacing:.01em}.dcc-tr-tabs{display:flex;gap:6px;overflow:auto;padding-bottom:8px}.dcc-tr-tabx{flex:none;border:1px solid rgba(183,123,19,.28);border-radius:999px;background:#fffdf8;color:#626a75;padding:7px 10px;font-size:9px}.dcc-tr-tabx.on{border-color:#d9aa4a;color:#1a150b;background:linear-gradient(135deg,#f7d97f,#e7b13f)}.dcc-tr-ex-list{display:grid;gap:7px}.dcc-tr-choice{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:9px;width:100%;padding:12px 14px;border:1px solid rgba(183,123,19,.22);border-radius:12px;background:#fffdf8;color:#17191d;text-align:left}.dcc-tr-choice b{display:block;font-size:10px}.dcc-tr-choice small{display:block;margin-top:3px;color:#7a828c;font-size:8px}.dcc-tr-choice strong{color:#b77b13;font-size:20px}.dcc-tr-manual{width:100%;margin-top:9px;padding:9px;border:1px dashed rgba(183,123,19,.42);border-radius:11px;background:#fffaf1;color:#9a6408;font-size:9px;font-weight:850}
    #dcc-training-modal .dcc-tr-modal-save{font-size:11px!important;line-height:1.1!important;font-weight:850!important;letter-spacing:0!important}
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
    const id=String(window.selectedClient??'');if(!id||!document.querySelector('#coach-main .dcc-tr-days'))return;
    state.guard=true;
    try{
      ensureCss();stripExerciseImages();document.querySelectorAll('button.dcc-tr-history').forEach(x=>x.remove());
      const existingHistory=document.querySelector('[data-dcc-history="1"]');
      if(!window.__dccTrainingEdit){
        if(!existingHistory){const actions=document.querySelector('#coach-main .dcc-tr-actions');if(actions)actions.insertAdjacentHTML('beforeend',historyHtml(id));}
      }else{
        if(existingHistory)existingHistory.remove();
        const days=routineDays(id);
        document.querySelectorAll('.dcc-tr-days>.dcc-tr-day').forEach((de,di)=>{
          de.querySelector('.dcc-tr-add')?.remove();
          if(de.querySelector('.dcc-tr-inline-trigger'))return;
          const box=de.querySelector('.dcc-tr-exercises'),d=days[di];if(!box||!d)return;
          const ms=dayMuscles(d);
          box.insertAdjacentHTML('beforeend',ms.length?`<button class="dcc-tr-inline-trigger" onclick="openTrainingExercises('${esc(id)}',${di})">＋ Añadir ejercicio</button>`:`<button class="dcc-tr-inline-trigger" onclick="dccOpenMuscleModal('${esc(id)}',${di})">＋ Añadir grupos musculares</button>`);
        });
        document.querySelector('.dcc-tr-new')?.remove();
      }
    }finally{state.guard=false;}
  }

  function scheduleDecorate(){if(state.raf)return;state.raf=requestAnimationFrame(()=>{state.raf=0;install();decorate();});}
  function modal(html,preserveScroll=false){const old=document.getElementById('dcc-tr-modal');const card=old?.querySelector('.dcc-tr-modal-card');const top=preserveScroll&&card?card.scrollTop:0;old?.remove();const el=document.createElement('div');el.id='dcc-tr-modal';el.className='dcc-tr-modal';el.innerHTML=html;el.addEventListener('click',e=>{if(e.target===el)el.remove()});document.body.appendChild(el);if(preserveScroll){const next=el.querySelector('.dcc-tr-modal-card');if(next){next.scrollTop=top;requestAnimationFrame(()=>{next.scrollTop=top})}}}
  window.dccCloseTrainingModal=()=>document.getElementById('dcc-tr-modal')?.remove();
  const VISUAL_MUSCLES=['Pectoral','Dorsal','Hombros','Trapecio','Bíceps','Tríceps','Antebrazos','Core','Cuádriceps','Femoral','Glúteos','Gemelos'];
  const MALE_VISUAL={Pectoral:'client-pectoral-premium-v5.webp',Dorsal:'client-dorsal-premium-v5.webp',Hombros:'client-hombros-premium-v5.webp',Trapecio:'client-trapecio-premium-v7.webp','Bíceps':'client-biceps-premium-v5.webp','Tríceps':'client-triceps-premium-v5.webp',Antebrazos:'client-antebrazos-premium-v7.webp',Core:'client-core-premium-v5.webp','Cuádriceps':'client-cuadriceps-premium-v5.webp',Femoral:'client-femoral-premium-v5.webp','Glúteos':'client-gluteos-premium-v5.webp',Gemelos:'client-gemelos-premium-v5.webp'};
  const FEMALE_VISUAL={Pectoral:'client-pectoral-female-premium-v2.svg',Dorsal:'client-dorsal-female-premium-v4.svg',Hombros:'client-hombros-female-premium-v4.svg',Trapecio:'client-trapecio-female-premium-v4.svg','Bíceps':'client-biceps-female-premium-v4.svg','Tríceps':'client-triceps-female-premium-v4.svg',Antebrazos:'client-antebrazos-female-premium-v4.svg',Core:'client-core-female-premium-v4.svg','Cuádriceps':'client-cuadriceps-female-premium-v4.svg',Femoral:'client-femoral-female-premium-v4.svg','Glúteos':'client-gluteos-female-premium-v4.svg',Gemelos:'client-gemelos-female-premium-v4.svg'};
  function muscleVisual(m){const female=state.anatomyDraft==='female',map=female?FEMALE_VISUAL:MALE_VISUAL,file=map[m]||(female?'anatomy-female-final.svg':'anatomy-male-final.svg');return `background-image:url('./assets/muscles/${file}');background-size:contain;background-position:center center;background-repeat:no-repeat`}
  function clientSex(id){const cl=(window.data?.clients||[]).find(x=>String(x.id)===String(id));return cl?.sex==='female'?'female':'male'}
  function muscleModalHtml(id,di){return `<div class="dcc-tr-modal-card"><div class="dcc-tr-modal-head"><div><h3>Día ${di+1}</h3><small>Selecciona los grupos musculares</small></div><button class="dcc-tr-modal-close" onclick="dccCloseTrainingModal()">×</button></div><div class="dcc-tr-config"><div class="dcc-tr-config-copy"><b>Elige de 1 a 3 grupos musculares para tu entrenamiento</b><small class="dcc-tr-count">Seleccionados: ${state.muscleDraft.length} de 3</small><span class="dcc-tr-safe">SESIÓN SEGURA · ENTRENADOR</span></div><div class="dcc-tr-muscle-grid">${VISUAL_MUSCLES.map(m=>`<button class="dcc-tr-muscle-card ${state.muscleDraft.includes(m)?'on':''}" onclick="dccDraftMuscle(this,'${esc(m)}','${esc(id)}',${di})"><span class="dcc-tr-muscle-visual" style="${muscleVisual(m)}"></span><span>${esc(m)}</span></button>`).join('')}</div><button class="dcc-tr-modal-save" ${state.muscleDraft.length?'':'disabled'} onclick="dccSaveRoutineMuscles('${esc(id)}',${di})">Confirmar selección</button></div></div>`}
  window.dccOpenMuscleModal=(id,di)=>{const d=routineDays(id)[di];if(!d)return;state.muscleDraft=dayMuscles(d).slice(0,3);state.anatomyDraft=clientSex(id);modal(muscleModalHtml(id,di))};
  window.dccDraftMuscle=(btn,m,id,di)=>{if(state.muscleDraft.includes(m))state.muscleDraft=state.muscleDraft.filter(x=>x!==m);else if(state.muscleDraft.length<3)state.muscleDraft=[...state.muscleDraft,m];modal(muscleModalHtml(id,di),true)};
  window.dccSaveRoutineMuscles=(id,di)=>{const d=routineDays(id)[di];if(!d||!state.muscleDraft.length)return;window.dccMarkTrainingDraftDirty?.(id);d.anatomy=state.anatomyDraft;writeMuscles(d,state.muscleDraft);window.__dccTrainingOpen=di;dccCloseTrainingModal();window.dccClientAdmin(id,'training')};

  function exercisePickerHtml(id,di,active){const d=routineDays(id)[di],groups=dayMuscles(d),lib=library(),group=groups.includes(active)?active:groups[0],items=lib.filter(ex=>normMuscle(ex?.muscle)===group||((ex?.secondaryMuscles||[]).map(normMuscle).includes(group)));return `<div class="dcc-tr-modal-card"><div class="dcc-tr-modal-head"><div><h3>Añadir ejercicios</h3><small>Día ${di+1} · ${esc(groups.join(' · '))}</small></div><button class="dcc-tr-modal-close" onclick="dccCloseTrainingModal()">×</button></div><div class="dcc-tr-tabs">${groups.map(g=>`<button class="dcc-tr-tabx ${g===group?'on':''}" onclick="dccOpenPremiumExercisePicker('${esc(id)}',${di},'${esc(g)}')">${esc(g)}</button>`).join('')}</div><div class="dcc-tr-ex-list">${items.map((ex,ix)=>`<button class="dcc-tr-choice" onclick="dccAddPremiumRoutineExercise('${esc(id)}',${di},'${esc(group)}',${ix})"><span><b>${esc(exName(ex))}</b><small>${esc(normMuscle(ex?.muscle)||group)}</small></span><strong>＋</strong></button>`).join('')||'<div class="dcc-tr-config-copy"><b>No hay ejercicios disponibles para este grupo.</b></div>'}</div><button class="dcc-tr-manual" onclick="dccAddPremiumManualExercise('${esc(id)}',${di},'${esc(group)}')">＋ Añadir ejercicio manual</button></div>`}
  window.dccOpenPremiumExercisePicker=(id,di,group)=>{const d=routineDays(id)[di],groups=dayMuscles(d);if(!d||!groups.length){window.dccOpenMuscleModal?.(id,di);return}ensureCss();modal(exercisePickerHtml(id,di,group||groups[0]))};
  window.openTrainingExercises=(id,di)=>window.dccOpenPremiumExercisePicker(String(id),Number(di));
  window.dccAddPremiumRoutineExercise=(id,di,group,ix)=>{const d=routineDays(id)[di],items=library().filter(ex=>normMuscle(ex?.muscle)===group||((ex?.secondaryMuscles||[]).map(normMuscle).includes(group))),ex=items[ix];if(!d||!ex)return;d.exercises=Array.isArray(d.exercises)?d.exercises:[];d.exercises.push({libraryId:ex.id??null,name:exName(ex),muscle:normMuscle(ex?.muscle)||group,image:ex.image||'',sets:'',reps:'',restBetweenSets:0,restBetweenExercises:0,videoUrl:''});window.dccMarkTrainingDraftDirty?.(id);window.__dccTrainingOpen=di;dccCloseTrainingModal();window.dccClientAdmin?.(id,'training')};
  window.dccAddPremiumManualExercise=(id,di,group)=>{const name=prompt('Nombre del ejercicio:');if(!name?.trim())return;const d=routineDays(id)[di];if(!d)return;d.exercises=Array.isArray(d.exercises)?d.exercises:[];d.exercises.push({id:'custom-'+Date.now(),name:name.trim(),muscle:group,sets:'',reps:'',restBetweenSets:0,restBetweenExercises:0,videoUrl:'',custom:true});window.dccMarkTrainingDraftDirty?.(id);window.__dccTrainingOpen=di;dccCloseTrainingModal();window.dccClientAdmin?.(id,'training')};

  window.dccTogglePreviousRoutineInline=id=>{state.previousOpen=!state.previousOpen;document.querySelector('[data-dcc-history="1"]')?.remove();decorate()};

  function install(){return typeof window.dccClientAdmin==='function'}
  function boot(){if(!install())setTimeout(boot,120);decorate()}
  const observer=new MutationObserver(scheduleDecorate);
  function start(){const r=document.getElementById('coach-main');if(r)observer.observe(r,{childList:true,subtree:true});boot()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();