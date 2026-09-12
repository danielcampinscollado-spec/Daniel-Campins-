/* DCC — correcciones focalizadas del editor de entrenamiento del entrenador */
(function(){
  'use strict';
  if(window.__dccTrainingCoachFixesV1)return;
  window.__dccTrainingCoachFixesV1=true;

  const STYLE_ID='dcc-training-coach-fixes-v1-css';
  const canon=value=>{
    const raw=String(value||'').trim();
    const n=raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(n==='pecho'||n==='pectoral')return'Pectoral';
    if(n==='hombro'||n==='hombros'||n==='deltoide'||n==='deltoides')return'Hombros';
    if(n==='triceps')return'Tríceps';
    if(n==='biceps')return'Bíceps';
    if(n==='dorsal'||n==='dorsales'||n==='espalda')return'Espalda';
    if(n==='cuadriceps')return'Cuádriceps';
    if(n==='gluteo'||n==='gluteos')return'Glúteos';
    return raw;
  };
  const routineDays=id=>{
    const r=window.data?.routines?.[id];
    return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[];
  };

  function installCss(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* El entrenador no necesita ilustraciones por ejercicio. */
      #dcc-tr-modal .dcc-tr-choice{grid-template-columns:minmax(0,1fr) auto!important;padding:12px 14px!important}
      #dcc-tr-modal .dcc-tr-choice img,#dcc-tr-modal .dcc-tr-choice .noimg{display:none!important}
      #coach-main .dcc-tr-ex{grid-template-columns:minmax(0,1fr) auto!important;padding:10px 12px!important}
      #coach-main .dcc-tr-ex>img,#coach-main .dcc-tr-ex>div:first-child:empty{display:none!important}

      /* Controles funcionales de descanso y vídeo dentro de edición de rutina. */
      #coach-main .dcc-training-extra-fields{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px}
      #coach-main .dcc-training-extra-fields .dcc-tr-field.video{grid-column:1/-1}
      #coach-main .dcc-training-extra-fields input{width:100%;min-height:38px;border:1px solid rgba(183,123,19,.28)!important;border-radius:10px;background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;padding:8px 10px;font-size:12px}
      #coach-main .dcc-training-extra-fields label{display:block;margin:0 0 4px;color:#6f7782!important;font-size:9px;font-weight:700}
      #coach-main .dcc-training-rest-summary{margin-top:6px;color:#8d5b08!important;font-size:9px;line-height:1.35}
      @media(max-width:520px){#coach-main .dcc-training-extra-fields{grid-template-columns:1fr 1fr}}
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  function normalizeDayForLibrary(id,di){
    const day=routineDays(id)?.[di];
    if(!day)return;
    const raw=day.muscles??day.muscle??day.group??'';
    const list=(Array.isArray(raw)?raw:String(raw).split(/[·,]/)).map(canon).filter(Boolean);
    const clean=[...new Set(list)];
    if(!clean.length)return;
    day.muscles=clean;
    day.muscle=clean.join(' · ');
  }

  function wrapExerciseModal(){
    const open=window.dccOpenExerciseModal;
    if(typeof open==='function'&&!open.__dccCanonicalMuscles){
      const wrapped=function(id,di){normalizeDayForLibrary(String(id),Number(di));return open.apply(this,arguments)};
      wrapped.__dccCanonicalMuscles=true;
      wrapped.__dccOriginal=open;
      window.dccOpenExerciseModal=wrapped;
    }
  }

  function addExtraFields(){
    const id=String(window.selectedClient??'');
    if(!id)return;
    const days=routineDays(id);
    document.querySelectorAll('#coach-main .dcc-tr-days>.dcc-tr-day').forEach((dayEl,di)=>{
      const exs=days?.[di]?.exercises||[];
      dayEl.querySelectorAll('.dcc-tr-ex').forEach((row,ei)=>{
        const ex=exs[ei];
        if(!ex)return;

        row.querySelectorAll(':scope>img').forEach(img=>img.remove());
        const first=row.firstElementChild;
        if(first&&first.tagName==='DIV'&&!first.className)first.remove();

        let summary=row.querySelector('.dcc-training-rest-summary');
        if(!summary){
          summary=document.createElement('div');
          summary.className='dcc-training-rest-summary';
          row.querySelector('.dcc-tr-ex-name')?.appendChild(summary);
        }
        const setRest=Math.max(0,parseInt(ex.restBetweenSets)||0);
        const exerciseRest=Math.max(0,parseInt(ex.restBetweenExercises)||0);
        summary.textContent=`Descanso entre series: ${setRest}s · entre ejercicios: ${exerciseRest}s`;

        const editRow=row.querySelector('.dcc-tr-editrow');
        if(!editRow||row.querySelector('.dcc-training-extra-fields'))return;
        const extra=document.createElement('div');
        extra.className='dcc-training-extra-fields';
        extra.innerHTML=`
          <div class="dcc-tr-field"><label>Descanso entre series (s)</label><input type="number" min="0" inputmode="numeric" value="${setRest}"></div>
          <div class="dcc-tr-field"><label>Descanso entre ejercicios (s)</label><input type="number" min="0" inputmode="numeric" value="${exerciseRest}"></div>
          <div class="dcc-tr-field video"><label>Vídeo de técnica (opcional)</label><input type="url" value="${String(ex.videoUrl||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" placeholder="https://..."></div>`;
        const inputs=extra.querySelectorAll('input');
        inputs[0].addEventListener('input',()=>{ex.restBetweenSets=Math.max(0,parseInt(inputs[0].value)||0);summary.textContent=`Descanso entre series: ${ex.restBetweenSets}s · entre ejercicios: ${Math.max(0,parseInt(ex.restBetweenExercises)||0)}s`;});
        inputs[1].addEventListener('input',()=>{ex.restBetweenExercises=Math.max(0,parseInt(inputs[1].value)||0);summary.textContent=`Descanso entre series: ${Math.max(0,parseInt(ex.restBetweenSets)||0)}s · entre ejercicios: ${ex.restBetweenExercises}s`;});
        inputs[2].addEventListener('input',()=>{ex.videoUrl=inputs[2].value.trim();});
        editRow.insertAdjacentElement('afterend',extra);
      });
    });
  }

  function ensure(){installCss();wrapExerciseModal();addExtraFields();}
  ensure();
  document.addEventListener('DOMContentLoaded',ensure,{once:true});
  window.addEventListener('load',ensure,{once:true});
  window.addEventListener('pageshow',ensure);
  const root=document.getElementById('coach-main')||document.body;
  new MutationObserver(()=>requestAnimationFrame(ensure)).observe(root,{childList:true,subtree:true});
  let tries=0;const timer=setInterval(()=>{ensure();if(++tries>40)clearInterval(timer)},150);
})();