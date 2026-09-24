/* DCC — editor de entrenamiento estable: músculo primero y sin saltos de scroll */
(function(){
  'use strict';
  const BUILD='20260924-training-editor-stability-v3';
  if(window.__dccTrainingEditorStability===BUILD)return;
  window.__dccTrainingEditorStability=BUILD;

  const MUSCLES=['Pectoral','Dorsal','Hombros','Bíceps','Tríceps','Cuádriceps','Femoral','Glúteos','Aductores','Gemelos','Trapecio','Antebrazos','Lumbar','Core'];
  let raf=0,savedY=null,preserveUntil=0,muscleDraft=[],muscleSex='male';
  const ANATOMY={male:'./assets/muscles/anatomy-male-final.svg?v=20260924-picker',female:'./assets/muscles/anatomy-female-premium-v1.webp?v=20260924-picker'};
  const main=()=>document.getElementById('coach-main');
  const cid=()=>String(window.selectedClient??'');
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  const days=()=>{const r=window.data?.routines?.[cid()];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]};
  const dayMuscles=d=>{
    const raw=Array.isArray(d?.muscles)?d.muscles:(d?.muscle??d?.group??'');
    const list=Array.isArray(raw)?raw:String(raw).split(/[·,]/);
    return [...new Set(list.map(x=>String(x||'').trim()).filter(x=>x&&!/^sin grupos/i.test(x)))];
  };
  const editing=()=>!!window.__dccTrainingEdit&&!!main()?.querySelector('.dcc-tr-days');

  function remember(ms=1300){
    if(!editing())return;
    const scroller=document.scrollingElement||document.documentElement;
    savedY=Math.max(0,window.scrollY||scroller.scrollTop||0);preserveUntil=Date.now()+ms;
  }
  function restore(){
    if(savedY===null||Date.now()>preserveUntil)return;
    const y=savedY;
    const put=()=>{if(Date.now()>preserveUntil)return;const scroller=document.scrollingElement||document.documentElement;const max=Math.max(0,scroller.scrollHeight-window.innerHeight);window.scrollTo({top:Math.min(y,max),left:0,behavior:'auto'})};
    requestAnimationFrame(()=>requestAnimationFrame(put));setTimeout(put,80);setTimeout(()=>{put();savedY=null;preserveUntil=0},240);
  }

  function ensurePickerCss(){
    if(document.getElementById('dcc-training-stable-picker-css'))return;
    const s=document.createElement('style');s.id='dcc-training-stable-picker-css';s.textContent=`
      .dcc-stable-muscle-modal{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:flex-end;justify-content:center;padding:12px;background:rgba(38,31,21,.28);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}
      .dcc-stable-muscle-card{width:min(680px,100%);max-height:78vh;overflow:auto;padding:18px;border:1px solid rgba(183,123,19,.34);border-radius:24px 24px 16px 16px;background:linear-gradient(160deg,#fffdf8,#f7eedf);box-shadow:0 -18px 48px rgba(78,58,28,.18);color:#17191d}
      .dcc-stable-muscle-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.dcc-stable-muscle-head h3{margin:0;font-size:20px}.dcc-stable-muscle-close{width:38px;height:38px;border:1px solid rgba(183,123,19,.3);border-radius:50%;background:#fff8e8;font-size:22px;color:#8d5b08}
      .dcc-stable-muscle-sub{margin:5px 0 12px;color:#737b86;font-size:12px}.dcc-stable-sex{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}.dcc-stable-sex button{padding:10px;border:1px solid rgba(183,123,19,.25);border-radius:13px;background:#fffdf8;font-weight:850;color:#626975}.dcc-stable-sex button.on{border-color:#d9aa4a;background:#fff5d8;color:#8d5b08}.dcc-stable-anatomy{height:210px;margin-bottom:13px;border:1px solid rgba(183,123,19,.18);border-radius:18px;background:#fbf5e9;overflow:hidden}.dcc-stable-anatomy img{width:100%;height:100%;object-fit:contain;display:block}.dcc-stable-muscle-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.dcc-stable-muscle-chip{padding:11px 10px;border:1px solid rgba(183,123,19,.28);border-radius:13px;background:#fffdf8;color:#4e5560;font-weight:750;text-align:left}.dcc-stable-muscle-chip.on{border-color:#d9aa4a;background:linear-gradient(135deg,#fff4cf,#f5d77f);color:#17130a}.dcc-stable-muscle-save{width:100%;margin-top:16px;padding:13px;border:1px solid #d9aa4a;border-radius:14px;background:linear-gradient(135deg,#f5cf66,#e5ad36);color:#17130a;font-weight:900;font-size:15px}
    `;(document.head||document.documentElement).appendChild(s);
  }
  function closePicker(){document.getElementById('dcc-stable-muscle-modal')?.remove()}
  function openMusclePicker(di){
    const d=days()[di];if(!d)return;
    remember();ensurePickerCss();closePicker();muscleDraft=dayMuscles(d);
    const modal=document.createElement('div');modal.id='dcc-stable-muscle-modal';modal.className='dcc-stable-muscle-modal';
    const card=document.createElement('div');card.className='dcc-stable-muscle-card';
    card.innerHTML=`<div class="dcc-stable-muscle-head"><h3>Elegir músculos · Día ${di+1}</h3><button type="button" class="dcc-stable-muscle-close">×</button></div><p class="dcc-stable-muscle-sub">Selecciona Hombre o Mujer y los grupos musculares del día.</p><div class="dcc-stable-sex"><button type="button" data-sex="male" class="on">Hombre</button><button type="button" data-sex="female">Mujer</button></div><div class="dcc-stable-anatomy"><img src="${ANATOMY.male}" alt="Anatomía masculina"></div><div class="dcc-stable-muscle-grid"></div><button type="button" class="dcc-stable-muscle-save">Guardar músculos</button>`;
    const anatomy=card.querySelector('.dcc-stable-anatomy img');
    card.querySelectorAll('.dcc-stable-sex button').forEach(b=>b.addEventListener('click',()=>{muscleSex=b.dataset.sex;card.querySelectorAll('.dcc-stable-sex button').forEach(x=>x.classList.toggle('on',x===b));anatomy.src=ANATOMY[muscleSex];anatomy.alt=muscleSex==='female'?'Anatomía femenina':'Anatomía masculina'}));
    const grid=card.querySelector('.dcc-stable-muscle-grid');
    MUSCLES.forEach(m=>{const b=document.createElement('button');b.type='button';b.className='dcc-stable-muscle-chip'+(muscleDraft.includes(m)?' on':'');b.textContent=m;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();muscleDraft=muscleDraft.includes(m)?muscleDraft.filter(x=>x!==m):[...muscleDraft,m];b.classList.toggle('on')});grid.appendChild(b)});
    card.querySelector('.dcc-stable-muscle-close').addEventListener('click',closePicker);
    card.querySelector('.dcc-stable-muscle-save').addEventListener('click',()=>{
      const day=days()[di];if(!day)return;
      const clean=[...new Set(muscleDraft)];day.muscles=clean;day.muscle=clean.length?clean.join(' · '):'Sin grupos musculares';
      try{window.saveData?.()}catch(e){console.error(e)}
      window.__dccTrainingOpen=di;closePicker();
      try{window.dccClientAdmin?.(cid(),'training')}finally{restore()}
    });
    modal.appendChild(card);modal.addEventListener('click',e=>{if(e.target===modal)closePicker()});document.body.appendChild(modal);
  }

  function makeAction(old,id,di,wantsMuscle){
    const b=old.cloneNode(true);b.type='button';b.textContent=wantsMuscle?'＋ Añadir músculo':'＋ Añadir ejercicio';b.removeAttribute('onclick');
    b.dataset.dccStableAction=wantsMuscle?'muscle':'exercise';b.dataset.dccDay=String(di);b.dataset.dccClient=id;
    b.onclick=e=>{e.preventDefault();e.stopPropagation();remember();if(wantsMuscle)openMusclePicker(di);else if(typeof window.dccOpenExerciseModal==='function')window.dccOpenExerciseModal(id,di)};
    return b;
  }
  function correctActions(){
    if(!editing())return;const ds=days(),id=cid();
    main()?.querySelectorAll('.dcc-tr-days>.dcc-tr-day').forEach((card,di)=>{
      const d=ds[di];if(!d)return;const wantsMuscle=dayMuscles(d).length===0,mode=wantsMuscle?'muscle':'exercise';
      const candidates=[...card.querySelectorAll('button')].filter(b=>{const t=norm(b.textContent);return t.includes('añadir músculo')||t.includes('añadir musculo')||t.includes('añadir ejercicio')});
      if(!candidates.length)return;let primary=candidates[0];
      if(primary.dataset.dccStableAction!==mode||primary.dataset.dccDay!==String(di)||primary.dataset.dccClient!==id){const fixed=makeAction(primary,id,di,wantsMuscle);primary.replaceWith(fixed);primary=fixed}
      candidates.slice(1).forEach(b=>b.remove());
    });
  }
  function wrap(name){const fn=window[name];if(typeof fn!=='function'||fn.__dccNoScrollJump)return;const wrapped=function(){remember();const y=savedY,out=fn.apply(this,arguments);if(y!==null){savedY=y;preserveUntil=Date.now()+1300;restore()}return out};wrapped.__dccNoScrollJump=true;wrapped.__dccOriginal=fn;window[name]=wrapped}
  function installWrappers(){['dccTrainingWizardDay','dccSetTrainingDayCount','dccSaveRoutineMuscles','dccChooseRoutineExercise','dccAddManualRoutineExercise','dccRemoveRoutineExercise','dccRemoveExercise','dccAddExercise'].forEach(wrap)}
  document.addEventListener('click',e=>{if(!editing())return;const b=e.target?.closest?.('button');if(!b||b.closest('#coach-nav,.dcc-ca-tabs')||b.closest('.dcc-stable-muscle-modal'))return;remember()},true);
  function apply(){installWrappers();correctActions();restore()}
  function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}
  function start(){apply();const root=main()||document.body;new MutationObserver(schedule).observe(root,{childList:true,subtree:true});let tries=0;const t=setInterval(()=>{apply();if(++tries>80)clearInterval(t)},150)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
