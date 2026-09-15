/* DCC — editor de entrenamiento estable: músculo primero y sin saltos de scroll */
(function(){
  'use strict';
  const BUILD='20260915-training-editor-stability-v1';
  if(window.__dccTrainingEditorStability===BUILD)return;
  window.__dccTrainingEditorStability=BUILD;

  let raf=0, savedY=null, preserveUntil=0;
  const main=()=>document.getElementById('coach-main');
  const cid=()=>String(window.selectedClient??'');
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  const days=()=>{const r=window.data?.routines?.[cid()];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]};
  const dayMuscles=d=>{
    const raw=Array.isArray(d?.muscles)?d.muscles:(d?.muscle??d?.group??'');
    const list=Array.isArray(raw)?raw:String(raw).split(/[·,]/);
    return list.map(x=>String(x||'').trim()).filter(x=>x&&!/^sin grupos/i.test(x));
  };
  const editing=()=>!!window.__dccTrainingEdit&&!!main()?.querySelector('.dcc-tr-days');

  function remember(ms=1100){
    if(!editing())return;
    const scroller=document.scrollingElement||document.documentElement;
    savedY=Math.max(0,window.scrollY||scroller.scrollTop||0);
    preserveUntil=Date.now()+ms;
  }
  function restore(){
    if(savedY===null||Date.now()>preserveUntil)return;
    const y=savedY;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(Date.now()>preserveUntil)return;
      const scroller=document.scrollingElement||document.documentElement;
      const max=Math.max(0,scroller.scrollHeight-window.innerHeight);
      window.scrollTo({top:Math.min(y,max),left:0,behavior:'auto'});
    }));
    setTimeout(()=>{
      if(Date.now()>preserveUntil)return;
      const scroller=document.scrollingElement||document.documentElement;
      const max=Math.max(0,scroller.scrollHeight-window.innerHeight);
      window.scrollTo({top:Math.min(y,max),left:0,behavior:'auto'});
      savedY=null;preserveUntil=0;
    },180);
  }

  function makeAction(old,id,di,wantsMuscle){
    const b=old.cloneNode(true);
    b.textContent=wantsMuscle?'＋ Añadir músculo':'＋ Añadir ejercicio';
    b.removeAttribute('onclick');
    b.onclick=e=>{
      e.preventDefault();e.stopPropagation();remember();
      if(wantsMuscle)window.dccOpenMuscleModal?.(id,di);
      else window.dccOpenExerciseModal?.(id,di);
    };
    return b;
  }

  function correctActions(){
    if(!editing())return;
    const ds=days(),id=cid();
    main()?.querySelectorAll('.dcc-tr-days>.dcc-tr-day').forEach((card,di)=>{
      const d=ds[di];if(!d)return;
      const wantsMuscle=dayMuscles(d).length===0;
      const candidates=[...card.querySelectorAll('button')].filter(b=>{
        const t=norm(b.textContent);
        return t.includes('añadir músculo')||t.includes('añadir musculo')||t.includes('añadir ejercicio');
      });
      if(!candidates.length)return;
      const primary=candidates[0];
      const expected=wantsMuscle?'añadir músculo':'añadir ejercicio';
      if(!norm(primary.textContent).includes(expected))primary.replaceWith(makeAction(primary,id,di,wantsMuscle));
      candidates.slice(1).forEach(b=>b.remove());
    });
  }

  function wrap(name){
    const fn=window[name];
    if(typeof fn!=='function'||fn.__dccNoScrollJump)return;
    const wrapped=function(){
      remember();
      const y=savedY;
      const out=fn.apply(this,arguments);
      if(y!==null){savedY=y;preserveUntil=Date.now()+1100;restore();}
      return out;
    };
    wrapped.__dccNoScrollJump=true;wrapped.__dccOriginal=fn;window[name]=wrapped;
  }
  function installWrappers(){
    ['dccTrainingWizardDay','dccSetTrainingDayCount','dccSaveRoutineMuscles','dccChooseRoutineExercise','dccAddManualRoutineExercise','dccRemoveRoutineExercise','dccRemoveExercise','dccAddExercise'].forEach(wrap);
  }

  document.addEventListener('click',e=>{
    if(!editing())return;
    const b=e.target?.closest?.('button');if(!b)return;
    if(b.closest('#coach-nav,.dcc-ca-tabs'))return;
    remember();
  },true);

  function apply(){installWrappers();correctActions();restore();}
  function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}
  function start(){
    apply();
    const root=main()||document.body;
    new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
    let tries=0;const t=setInterval(()=>{apply();if(++tries>60)clearInterval(t)},150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
