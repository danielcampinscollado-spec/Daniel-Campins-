/* DCC — editor de entrenamiento estable: selector anatómico light premium móvil */
(function(){
  'use strict';
  const BUILD='20260917-training-editor-stability-v4-light-separated-anatomy';
  if(window.__dccTrainingEditorStability===BUILD)return;
  window.__dccTrainingEditorStability=BUILD;

  const MUSCLES=['Pectoral','Dorsal','Hombros','Trapecio','Bíceps','Tríceps','Antebrazos','Core','Cuádriceps','Femoral','Glúteos','Gemelos'];
  const LABEL={Femoral:'Isquiotibiales'};
  const POS={
    Pectoral:'0% 0%',Dorsal:'33.333% 0%',Hombros:'66.667% 0%',Trapecio:'100% 0%',
    'Bíceps':'0% 50%','Tríceps':'33.333% 50%',Antebrazos:'66.667% 50%',Core:'100% 50%',
    'Cuádriceps':'0% 100%',Femoral:'33.333% 100%','Glúteos':'66.667% 100%',Gemelos:'100% 100%'
  };
  const SPRITE={male:'./assets/muscles/premium-light-male.svg',female:'./assets/muscles/premium-light-female.svg'};
  const NEUTRAL={male:'./assets/muscles/premium-light-male-neutral.svg',female:'./assets/muscles/premium-light-female-neutral.svg'};
  let raf=0,savedY=null,preserveUntil=0,muscleDraft=[],anatomy=localStorage.getItem('dcc:training-anatomy:v1')||'';
  const main=()=>document.getElementById('coach-main');
  const cid=()=>String(window.selectedClient??'');
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  const days=()=>{const r=window.data?.routines?.[cid()];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]};
  const dayMuscles=d=>{const raw=Array.isArray(d?.muscles)?d.muscles:(d?.muscle??d?.group??'');const list=Array.isArray(raw)?raw:String(raw).split(/[·,]/);return [...new Set(list.map(x=>String(x||'').trim()).filter(x=>x&&!/^sin grupos/i.test(x)))];};
  const editing=()=>!!window.__dccTrainingEdit&&!!main()?.querySelector('.dcc-tr-days');

  function remember(ms=1300){if(!editing())return;const scroller=document.scrollingElement||document.documentElement;savedY=Math.max(0,window.scrollY||scroller.scrollTop||0);preserveUntil=Date.now()+ms;}
  function restore(){if(savedY===null||Date.now()>preserveUntil)return;const y=savedY;const put=()=>{if(Date.now()>preserveUntil)return;const scroller=document.scrollingElement||document.documentElement;const max=Math.max(0,scroller.scrollHeight-window.innerHeight);window.scrollTo({top:Math.min(y,max),left:0,behavior:'auto'})};requestAnimationFrame(()=>requestAnimationFrame(put));setTimeout(put,80);setTimeout(()=>{put();savedY=null;preserveUntil=0},240);}

  function ensurePickerCss(){
    if(document.getElementById('dcc-training-stable-picker-css'))return;
    const s=document.createElement('style');s.id='dcc-training-stable-picker-css';s.textContent=`
      .dcc-stable-muscle-modal{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:flex-end;justify-content:center;padding:6px;background:rgba(86,67,34,.12);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}
      .dcc-stable-muscle-card{width:min(520px,100%);max-height:91dvh;overflow:auto;padding:12px 10px calc(12px + env(safe-area-inset-bottom));border:1px solid rgba(190,139,47,.28);border-radius:22px 22px 14px 14px;background:#f8f1e6!important;box-shadow:0 -14px 40px rgba(92,68,27,.14);color:#17191d}
      .dcc-stable-muscle-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.dcc-stable-muscle-head h3{margin:0;font-size:17px}.dcc-stable-muscle-close{width:32px;height:32px;border:1px solid rgba(183,123,19,.28);border-radius:50%;background:#fffaf2;color:#8d5b08;font-size:19px}
      .dcc-stable-muscle-sub{margin:3px 0 8px;color:#737b86;font-size:10px}
      .dcc-anatomy-panel{padding:9px;border:1px solid rgba(190,139,47,.22);border-radius:16px;background:#fffaf2!important}
      .dcc-anatomy-title{margin:0 0 7px;font-size:13px;font-weight:900;color:#17191d}.dcc-anatomy-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
      .dcc-anatomy-choice{position:relative;height:78px;display:grid;grid-template-columns:62px 1fr;align-items:center;gap:6px;padding:5px;border:1px solid rgba(183,123,19,.22);border-radius:13px;background:#f9f2e7!important;color:#17191d;text-align:left;overflow:hidden}
      .dcc-anatomy-choice.on{border-color:#c88d22;background:#fff4d8!important;box-shadow:0 0 0 1px rgba(200,141,34,.16)}
      .dcc-anatomy-figure{height:68px;border-radius:9px;background:#f4eadb center/cover no-repeat;overflow:hidden}.dcc-anatomy-choice b{font-size:12px}.dcc-anatomy-choice small{display:block;margin-top:2px;color:#858992;font-size:8.5px;line-height:1.15}
      .dcc-anatomy-check{position:absolute;right:6px;top:6px;width:18px;height:18px;border:1px solid #b77b13;border-radius:50%;display:grid;place-items:center;background:#fffaf2;color:#fff;font-size:10px}.dcc-anatomy-choice.on .dcc-anatomy-check{background:#c88d22}
      .dcc-muscle-section{display:none;margin-top:9px;padding:9px;border:1px solid rgba(190,139,47,.22);border-radius:16px;background:#f4eadc!important}.dcc-muscle-section.ready{display:block}
      .dcc-muscle-top{display:flex;align-items:center;justify-content:space-between;gap:6px;margin:0 0 7px}.dcc-muscle-top b{font-size:12px;line-height:1.15}.dcc-muscle-count{flex:none;padding:4px 7px;border:1px solid rgba(183,123,19,.22);border-radius:999px;background:#fff4d8;color:#8d5b08;font-size:8.5px;font-weight:800}
      .dcc-stable-muscle-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.dcc-stable-muscle-chip{position:relative;min-width:0;height:94px;padding:2px 3px 5px;border:1px solid rgba(183,123,19,.20);border-radius:11px;background:#fbf5eb!important;color:#17191d;font-weight:850;overflow:hidden}.dcc-stable-muscle-chip.on{border-color:#c78c22;background:#fff1cf!important;box-shadow:0 0 0 1px rgba(199,140,34,.16)}
      .dcc-muscle-img{display:block;width:100%;height:70px;margin:0 0 1px;border-radius:8px;background-color:#f6eddf;background-repeat:no-repeat;background-size:400% 300%;filter:saturate(.88) contrast(1.02)}.dcc-muscle-name{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:9px;line-height:15px}
      .dcc-muscle-order{position:absolute;right:4px;top:4px;width:17px;height:17px;border:1px solid #b77b13;border-radius:50%;background:#fffaf2;color:#8d5b08;font-size:8px;display:grid;place-items:center}.dcc-stable-muscle-chip.on .dcc-muscle-order{background:#c88d22;color:#fff}
      .dcc-stable-muscle-save{width:100%;margin-top:8px;padding:11px;border:1px solid #d9aa4a;border-radius:12px;background:linear-gradient(135deg,#f5cf66,#e5ad36);color:#17130a;font-weight:900;font-size:13px}.dcc-stable-muscle-save:disabled{opacity:.42}
      @media(max-width:370px){.dcc-stable-muscle-card{padding-left:8px;padding-right:8px}.dcc-anatomy-choice{grid-template-columns:52px 1fr;height:72px}.dcc-anatomy-figure{height:62px}.dcc-stable-muscle-chip{height:88px}.dcc-muscle-img{height:64px}.dcc-muscle-name{font-size:8.5px}}
    `;(document.head||document.documentElement).appendChild(s);
  }
  function closePicker(){document.getElementById('dcc-stable-muscle-modal')?.remove()}
  function renderMuscles(card){
    const section=card.querySelector('.dcc-muscle-section'),grid=card.querySelector('.dcc-stable-muscle-grid'),count=card.querySelector('.dcc-muscle-count'),save=card.querySelector('.dcc-stable-muscle-save');
    section.classList.toggle('ready',!!anatomy);count.textContent=`Seleccionados: ${muscleDraft.length} de 3`;save.disabled=!anatomy||!muscleDraft.length;grid.innerHTML='';
    if(!anatomy)return;
    MUSCLES.forEach(m=>{const selected=muscleDraft.includes(m),order=selected?muscleDraft.indexOf(m)+1:'';const b=document.createElement('button');b.type='button';b.className='dcc-stable-muscle-chip'+(selected?' on':'');b.innerHTML=`<span class="dcc-muscle-img" style="background-image:url('${SPRITE[anatomy]}');background-position:${POS[m]}" aria-hidden="true"></span><span class="dcc-muscle-name">${LABEL[m]||m}</span><span class="dcc-muscle-order">${order}</span>`;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(selected)muscleDraft=muscleDraft.filter(x=>x!==m);else if(muscleDraft.length<3)muscleDraft=[...muscleDraft,m];renderMuscles(card)});grid.appendChild(b)});
  }
  function openMusclePicker(di){
    const d=days()[di];if(!d)return;remember();ensurePickerCss();closePicker();muscleDraft=dayMuscles(d).slice(0,3);
    const modal=document.createElement('div');modal.id='dcc-stable-muscle-modal';modal.className='dcc-stable-muscle-modal';const card=document.createElement('div');card.className='dcc-stable-muscle-card';
    card.innerHTML=`<div class="dcc-stable-muscle-head"><h3>Día ${di+1} · Configuración</h3><button type="button" class="dcc-stable-muscle-close">×</button></div><p class="dcc-stable-muscle-sub">La elección solo afecta a las ilustraciones.</p><div class="dcc-anatomy-panel"><div class="dcc-anatomy-title">¿Qué anatomía quieres utilizar?</div><div class="dcc-anatomy-grid"><button type="button" class="dcc-anatomy-choice ${anatomy==='male'?'on':''}" data-sex="male"><span class="dcc-anatomy-figure" style="background-image:url('${NEUTRAL.male}')"></span><span><b>Hombre</b><small>Ilustración masculina</small></span><span class="dcc-anatomy-check">${anatomy==='male'?'✓':''}</span></button><button type="button" class="dcc-anatomy-choice ${anatomy==='female'?'on':''}" data-sex="female"><span class="dcc-anatomy-figure" style="background-image:url('${NEUTRAL.female}')"></span><span><b>Mujer</b><small>Ilustración femenina</small></span><span class="dcc-anatomy-check">${anatomy==='female'?'✓':''}</span></button></div></div><section class="dcc-muscle-section"><div class="dcc-muscle-top"><b>Elige de 1 a 3 grupos musculares</b><span class="dcc-muscle-count"></span></div><div class="dcc-stable-muscle-grid"></div><button type="button" class="dcc-stable-muscle-save">Añadir ejercicios</button></section>`;
    card.querySelectorAll('.dcc-anatomy-choice').forEach(btn=>btn.addEventListener('click',()=>{anatomy=btn.dataset.sex;try{localStorage.setItem('dcc:training-anatomy:v1',anatomy)}catch(_){}card.querySelectorAll('.dcc-anatomy-choice').forEach(x=>{x.classList.toggle('on',x.dataset.sex===anatomy);x.querySelector('.dcc-anatomy-check').textContent=x.dataset.sex===anatomy?'✓':''});renderMuscles(card)}));
    card.querySelector('.dcc-stable-muscle-close').addEventListener('click',closePicker);card.querySelector('.dcc-stable-muscle-save').addEventListener('click',()=>{const day=days()[di];if(!day)return;const clean=[...new Set(muscleDraft)].slice(0,3);day.muscles=clean;day.muscle=clean.length?clean.join(' · '):'Sin grupos musculares';day.anatomyIllustration=anatomy;try{window.saveData?.()}catch(e){console.error(e)}window.__dccTrainingOpen=di;closePicker();try{window.dccClientAdmin?.(cid(),'training')}finally{restore()}if(clean.length&&typeof window.dccOpenExerciseModal==='function')setTimeout(()=>window.dccOpenExerciseModal(cid(),di),80)});
    modal.appendChild(card);modal.addEventListener('click',e=>{if(e.target===modal)closePicker()});document.body.appendChild(modal);renderMuscles(card);
  }

  function makeAction(old,id,di,wantsMuscle){const b=old.cloneNode(true);b.type='button';b.textContent=wantsMuscle?'＋ Añadir grupos musculares':'＋ Añadir ejercicio';b.removeAttribute('onclick');b.dataset.dccStableAction=wantsMuscle?'muscle':'exercise';b.dataset.dccDay=String(di);b.dataset.dccClient=id;b.onclick=e=>{e.preventDefault();e.stopPropagation();remember();if(wantsMuscle)openMusclePicker(di);else if(typeof window.dccOpenExerciseModal==='function')window.dccOpenExerciseModal(id,di)};return b;}
  function correctActions(){if(!editing())return;const ds=days(),id=cid();main()?.querySelectorAll('.dcc-tr-days>.dcc-tr-day').forEach((card,di)=>{const d=ds[di];if(!d)return;const wantsMuscle=dayMuscles(d).length===0,mode=wantsMuscle?'muscle':'exercise';const candidates=[...card.querySelectorAll('button')].filter(b=>{const t=norm(b.textContent);return t.includes('añadir músculo')||t.includes('añadir musculo')||t.includes('añadir grupos musculares')||t.includes('añadir ejercicio')});if(!candidates.length)return;let primary=candidates[0];if(primary.dataset.dccStableAction!==mode||primary.dataset.dccDay!==String(di)||primary.dataset.dccClient!==id){const fixed=makeAction(primary,id,di,wantsMuscle);primary.replaceWith(fixed);primary=fixed}candidates.slice(1).forEach(b=>b.remove())});}
  function wrap(name){const fn=window[name];if(typeof fn!=='function'||fn.__dccNoScrollJump)return;const wrapped=function(){remember();const y=savedY,out=fn.apply(this,arguments);if(y!==null){savedY=y;preserveUntil=Date.now()+1300;restore()}return out};wrapped.__dccNoScrollJump=true;wrapped.__dccOriginal=fn;window[name]=wrapped}
  function installWrappers(){['dccTrainingWizardDay','dccSetTrainingDayCount','dccSaveRoutineMuscles','dccChooseRoutineExercise','dccAddManualRoutineExercise','dccRemoveRoutineExercise','dccRemoveExercise','dccAddExercise'].forEach(wrap)}
  document.addEventListener('click',e=>{if(!editing())return;const b=e.target?.closest?.('button');if(!b||b.closest('#coach-nav,.dcc-ca-tabs')||b.closest('.dcc-stable-muscle-modal'))return;remember()},true);
  function apply(){installWrappers();correctActions();restore()}function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}function start(){apply();const root=main()||document.body;new MutationObserver(schedule).observe(root,{childList:true,subtree:true});let tries=0;const t=setInterval(()=>{apply();if(++tries>80)clearInterval(t)},150)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
