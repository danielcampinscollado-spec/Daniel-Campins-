(function(){
  'use strict';

  const esc=value=>String(value??'')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');

  const norm=value=>String(value||'').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ').trim();

  const fmt=value=>{
    if(value===''||value===null||value===undefined)return '—';
    const n=Number(value);
    return Number.isFinite(n)?String(n).replace('.',','):String(value);
  };

  const formatElapsed=seconds=>{
    const safe=Math.max(0,Math.floor(Number(seconds)||0));
    const h=Math.floor(safe/3600),m=Math.floor((safe%3600)/60),s=safe%60;
    if(h>0)return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  const formatRest=seconds=>{
    const safe=Math.max(0,Math.floor(Number(seconds)||0));
    return `${String(Math.floor(safe/60)).padStart(2,'0')}:${String(safe%60).padStart(2,'0')}`;
  };

  const icon=name=>{
    const c='viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    if(name==='back')return `<svg ${c}><path d="m15 18-6-6 6-6"/></svg>`;
    if(name==='play')return `<svg ${c}><path d="m9 7 8 5-8 5V7Z"/></svg>`;
    if(name==='chart')return `<svg ${c}><path d="M5 19V10M12 19V5M19 19v-7"/></svg>`;
    if(name==='trophy')return `<svg ${c}><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 12v4M9 20h6M10 16h4"/></svg>`;
    if(name==='bulb')return `<svg ${c}><path d="M9 18h6M10 21h4"/><path d="M8.5 14.5A6 6 0 1 1 15.5 14.5C14.6 15.2 14 16.2 14 17h-4c0-.8-.6-1.8-1.5-2.5Z"/></svg>`;
    if(name==='dumbbell')return `<svg ${c}><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/></svg>`;
    if(name==='check')return `<svg ${c}><path d="m5 12 4 4L19 6"/></svg>`;
    if(name==='clock')return `<svg ${c}><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>`;
    if(name==='timer')return `<svg ${c}><circle cx="12" cy="13" r="7"/><path d="M12 10v4l2 1M9 3h6M12 3v3"/></svg>`;
    if(name==='exit')return `<svg ${c}><path d="M10 6 4 12l6 6M4 12h11"/><path d="M14 5h5v14h-5"/></svg>`;
    return '';
  };

  function exerciseImage(exercise){
    const clean=value=>String(value||'').replace(/^\.\/+/,'');
    const direct=exercise?.image||exercise?.imageStart||exercise?.illustration||exercise?.ilustracion||'';
    if(direct)return clean(direct);
    const library=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];
    const id=String(exercise?.id??exercise?.exerciseId??exercise?.exercise_id??'').trim();
    const name=norm(exercise?.name??exercise?.nombre??exercise?.exercise??exercise?.exerciseName);
    let hit=id?library.find(x=>String(x?.id??'')===id):null;
    if(!hit&&name)hit=library.find(x=>norm(x?.name)===name)||null;
    if(!hit&&name){
      const aliases=[
        [/fondos.*maquina.*asistida|fondos.*asistida/,'fondos-maquina-asistida'],
        [/press.*banca.*barra|press de banca con barra/,'press-banca-barra'],
        [/aperturas.*cable|aperturas.*polea/,'aperturas-polea-banco'],
        [/patada.*triceps.*cable|patada.*triceps.*polea/,'extension-triceps-unilateral'],
        [/press.*inclinado.*barra/,'press-inclinado-barra'],
        [/press.*inclinado.*mancuernas/,'press-inclinado-mancuernas']
      ];
      for(const [re,libraryId] of aliases){
        if(re.test(name)){hit=library.find(x=>String(x?.id??'')===libraryId)||null;if(hit)break;}
      }
    }
    return clean(hit?.image||hit?.imageStart||'');
  }

  function historyStats(clientId,exercise){
    const history=Array.isArray(window.data?.workoutHistory?.[clientId])?window.data.workoutHistory[clientId]:[];
    const target=norm(exercise?.name);
    let latest=null,best=null;
    for(let i=0;i<history.length;i++){
      const workout=history[i]||{};
      const found=(workout.exercises||[]).find(item=>norm(item?.name)===target);
      if(!found)continue;
      const sets=Array.isArray(found.sets)?found.sets:[];
      latest={workout,exercise:found,sets};
      sets.forEach(set=>{
        const kg=Number(set?.kg)||0,reps=Number(set?.reps)||0;
        if(!best||kg>best.kg||(kg===best.kg&&reps>best.reps))best={kg,reps};
      });
    }
    const latestBest=latest?.sets?.reduce((bestSet,set)=>{
      const kg=Number(set?.kg)||0,reps=Number(set?.reps)||0;
      if(!bestSet||kg>bestSet.kg||(kg===bestSet.kg&&reps>bestSet.reps))return {kg,reps};
      return bestSet;
    },null)||null;
    return {latest,best,latestBest};
  }

  function exerciseTip(exercise){
    const n=norm(exercise?.name);
    if(/fondos|press banca|press de banca|press inclinado/.test(n))return 'Controla la bajada y mantén el pecho estable.';
    if(/apertura|cruce|pec deck/.test(n))return 'Mantén tensión continua y evita perder el control al abrir.';
    if(/triceps|extension|patada/.test(n))return 'Mantén los codos estables y completa la extensión sin balancearte.';
    if(/remo/.test(n))return 'Lleva los codos atrás y evita tirar con el impulso del torso.';
    if(/jalon|dominada/.test(n))return 'Inicia el movimiento con la espalda y mantén el pecho alto.';
    if(/curl/.test(n))return 'Controla la bajada y evita adelantar los codos.';
    if(/sentadilla|prensa/.test(n))return 'Mantén el apoyo estable y controla toda la fase de bajada.';
    if(/femoral|peso muerto rumano/.test(n))return 'Mantén la tensión en la cadena posterior y evita perder la posición lumbar.';
    if(/hip thrust|glute/.test(n))return 'Bloquea arriba con control sin hiperextender la zona lumbar.';
    return 'Prioriza una ejecución limpia y repite cada serie con el mismo control.';
  }

  function renderSeriesSteps(planned,completed){
    if(!planned)return '';
    return Array.from({length:planned},(_,i)=>{
      const done=i<completed,active=i===completed;
      return `<div class="dwa3-step ${done?'done':''} ${active?'active':''}">${done?icon('check'):i+1}</div>`;
    }).join('');
  }

  function renderHistory(stats){
    if(!stats.latest){
      return `<section class="dwa3-card dwa3-history first"><div class="dwa3-history-icon">${icon('chart')}</div><div><span>PRIMER REGISTRO</span><strong>Tu referencia empieza hoy</strong></div></section>`;
    }
    return `<section class="dwa3-card dwa3-history">
      <div class="dwa3-history-block"><div class="dwa3-history-icon">${icon('chart')}</div><div><span>ÚLTIMA VEZ</span><strong>${stats.latestBest?`${fmt(stats.latestBest.kg)} kg · ${fmt(stats.latestBest.reps)} reps`:'Sin datos'}</strong></div></div>
      <div class="dwa3-history-divider"></div>
      <div class="dwa3-history-block"><div class="dwa3-history-icon">${icon('trophy')}</div><div><span>MEJOR MARCA</span><strong>${stats.best?`${fmt(stats.best.kg)} kg · ${fmt(stats.best.reps)} reps`:'—'}</strong></div></div>
    </section>`;
  }

  function renderSavedToday(sets){
    if(!sets?.length)return '';
    return `<div class="dwa3-today">${sets.map((set,i)=>`<span><b>S${i+1}</b> ${fmt(set.kg)} kg × ${fmt(set.reps)}</span>`).join('')}</div>`;
  }

  function renderRest(workout,exercise){
    const active=!!(workout.restUntil&&workout.restUntil>Date.now());
    if(!active)return '';
    const remaining=Math.max(0,Math.ceil((Number(workout.restUntil)-Date.now())/1000));
    return `<section class="dwa3-card dwa3-rest"><div class="dwa3-rest-icon">${icon('timer')}</div><div><span>DESCANSO</span><strong id="rest-timer">${formatRest(remaining)}</strong><small>Recupera antes de la siguiente serie.</small></div><button type="button" onclick="skipRest()">Saltar</button></section>`;
  }

  function renderCurrent(workout,exercise,stats,planned,completed,finished){
    const currentIndex=Math.min(completed,Math.max(0,planned-1));
    const previousSet=stats.latest?.sets?.[currentIndex]||null;
    const restActive=!!(workout.restUntil&&workout.restUntil>Date.now());

    if(finished){
      return `<section class="dwa3-card dwa3-current"><div class="dwa3-current-head"><div class="dwa3-section-title">${icon('dumbbell')}<span>EJERCICIO COMPLETADO</span></div><small>${completed} de ${planned}</small></div>${renderSavedToday(workout.sets)}<button class="dwa3-primary" type="button" onclick="nextWorkoutExercise()">${workout.currentExercise<workout.exercises.length-1?'Siguiente ejercicio':'Finalizar entrenamiento'} <b>→</b></button></section>`;
    }

    return `<section class="dwa3-card dwa3-current">
      <div class="dwa3-current-head"><div class="dwa3-section-title">${icon('dumbbell')}<span>SERIE ACTUAL</span></div><small>Serie ${Math.min(completed+1,planned||1)} de ${planned||'—'}</small></div>
      <div class="dwa3-steps">${renderSeriesSteps(planned,completed)}</div>
      ${restActive?`${renderSavedToday(workout.sets)}<div class="dwa3-rest-note">Serie ${completed} guardada · descansa antes de continuar</div>`:`
        <div class="dwa3-fields">
          <label><b>Peso (kg)</b><div class="dwa3-input"><input id="workout-kg" type="number" inputmode="decimal" step="0.5" autocomplete="off" value="" placeholder="0" onfocus="this.select()"><span>kg</span></div><small>${previousSet?`Última vez: ${fmt(previousSet.kg)} kg`:'Sin registro anterior'}</small></label>
          <label><b>Repeticiones</b><div class="dwa3-input"><input id="workout-reps" type="number" inputmode="numeric" autocomplete="off" value="" placeholder="0" onfocus="this.select()"><span>reps</span></div><small>${previousSet?`Última vez: ${fmt(previousSet.reps)} repeticiones`:'Sin registro anterior'}</small></label>
        </div>
        ${renderSavedToday(workout.sets)}
        <button class="dwa3-primary" type="button" onclick="saveWorkoutSet()">${completed+1<planned?'Siguiente serie':'Completar serie'} <b>→</b></button>`}
    </section>`;
  }

  function startElapsedTimer(workout){
    clearInterval(window.dccWorkoutElapsedInterval);
    const update=()=>{
      if(!window.activeWorkout){clearInterval(window.dccWorkoutElapsedInterval);return;}
      const el=document.getElementById('workout-elapsed');
      if(!el)return;
      el.textContent=formatElapsed((Date.now()-(Number(workout.startedAt)||Date.now()))/1000);
    };
    update();
    window.dccWorkoutElapsedInterval=setInterval(update,1000);
  }

  window.dccToggleWorkoutTips=function(){
    window.__dccWorkoutTipOpen=!window.__dccWorkoutTipOpen;
    const card=document.querySelector('.dwa3-tip');
    if(!card)return;
    card.classList.toggle('open',!!window.__dccWorkoutTipOpen);
    const btn=card.querySelector('.dwa3-tip-toggle');
    if(btn)btn.setAttribute('aria-expanded',String(!!window.__dccWorkoutTipOpen));
  };

  function renderPremiumWorkout(){
    const workout=window.activeWorkout;
    if(!workout)return;
    if(!Array.isArray(workout.completedExercises))workout.completedExercises=[];
    if(!Array.isArray(workout.sets))workout.sets=[];
    const main=document.getElementById('client-main');
    if(!main)return;
    const exercise=workout.exercises?.[workout.currentExercise];
    if(!exercise){if(typeof window.finishWorkout==='function')window.finishWorkout();return;}

    document.body.classList.add('dcc-workout-mode');
    const total=workout.exercises.length,current=workout.currentExercise+1;
    const planned=Math.max(0,parseInt(exercise.sets)||0),completed=workout.sets.length;
    const finished=planned>0&&completed>=planned;
    const stats=historyStats(workout.clientId,exercise);
    const image=exerciseImage(exercise);
    const muscle=exercise.muscle||exercise.group||exercise.grupo||'';
    const tip=exerciseTip(exercise);
    const tipKey=`${workout.currentExercise}:${norm(exercise.name)}`;
    if(window.__dccWorkoutTipKey!==tipKey){window.__dccWorkoutTipKey=tipKey;window.__dccWorkoutTipOpen=false;}
    const techniqueAction=exercise.videoUrl?`window.open('${esc(exercise.videoUrl)}','_blank','noopener')`:`window.dccWorkoutTechniqueUnavailable()`;

    main.innerHTML=`
      <style id="dcc-workout-premium-v3">
        body.dcc-workout-mode #client-main{padding-bottom:28px!important}
        #client-main .dwa3{width:100%;max-width:820px;margin:0 auto;padding:2px 0 30px;color:#f7f5f0}
        #client-main .dwa3 *{box-sizing:border-box}
        #client-main .dwa3 button,#client-main .dwa3 input{font:inherit}
        #client-main .dwa3-top{display:grid;grid-template-columns:minmax(0,1fr) 122px;grid-template-areas:"copy media" "actions actions";gap:10px 13px;align-items:start;margin-bottom:11px}
        #client-main .dwa3-copy{grid-area:copy;min-width:0}
        #client-main .dwa3-media{grid-area:media;width:122px;height:112px;border:1px solid rgba(224,173,76,.72);border-radius:17px;background:radial-gradient(circle at 70% 18%,rgba(217,170,74,.08),transparent 36%),linear-gradient(145deg,#12171d,#080b0f);overflow:hidden;display:grid;place-items:center}
        #client-main .dwa3-media img{width:100%;height:100%;object-fit:contain;padding:5px;display:block}
        #client-main .dwa3-media-placeholder{color:#68717c;font-size:28px}
        #client-main .dwa3-kicker{display:flex;align-items:center;gap:10px;margin-bottom:11px}
        #client-main .dwa3-back{width:41px;height:41px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.14);border-radius:13px;background:linear-gradient(145deg,#151a20,#0b0f14);color:#f1f3f5}
        #client-main .dwa3-back svg{width:21px;height:21px}
        #client-main .dwa3-kicker span{display:block;color:#e5b34b;font-size:9px;font-weight:850;letter-spacing:2.7px;text-transform:uppercase}
        #client-main .dwa3-kicker small{display:block;margin-top:3px;color:#89919d;font-size:9.5px}
        #client-main .dwa3-title{margin:0!important;color:#faf9f5!important;font-size:23px!important;line-height:1.06!important;font-weight:780!important;letter-spacing:-.55px!important}
        #client-main .dwa3-badges{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
        #client-main .dwa3-badge{min-height:27px;display:inline-flex;align-items:center;padding:0 9px;border:1px solid rgba(255,255,255,.13);border-radius:999px;background:linear-gradient(145deg,#131820,#0b0f14);color:#aab1bc;font-size:9px;font-weight:720}
        #client-main .dwa3-badge.gold{border-color:rgba(224,173,76,.72);background:rgba(217,170,74,.055);color:#f0c96b;font-size:8px;font-weight:850;letter-spacing:1.3px;text-transform:uppercase}
        #client-main .dwa3-actions{grid-area:actions;display:grid;grid-template-columns:minmax(0,1fr) 128px;gap:9px}
        #client-main .dwa3-tech,#client-main .dwa3-elapsed{min-height:45px;border:1px solid rgba(224,173,76,.70);border-radius:14px;background:linear-gradient(145deg,#11161c,#0a0e13)}
        #client-main .dwa3-tech{display:flex;align-items:center;justify-content:center;gap:9px;color:#f4f3ef;font-size:11px;font-weight:760}
        #client-main .dwa3-tech svg{width:18px;height:18px;color:#f0c96b}
        #client-main .dwa3-elapsed{display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:7px;padding:7px 10px;color:#f0c96b}
        #client-main .dwa3-elapsed-icon{width:28px;height:28px;display:grid;place-items:center;border-radius:9px;background:rgba(217,170,74,.07)}
        #client-main .dwa3-elapsed-icon svg{width:17px;height:17px}
        #client-main .dwa3-elapsed strong{color:#f6f4ef;font-size:13px;font-variant-numeric:tabular-nums;white-space:nowrap}
        #client-main .dwa3-card{position:relative;margin:0 0 10px;border:1px solid rgba(217,170,74,.68);border-radius:19px;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.085),transparent 38%),linear-gradient(145deg,#171b21,#0d1116 65%,#090c10);box-shadow:0 12px 28px rgba(0,0,0,.23),inset 0 1px 0 rgba(255,255,255,.03)}
        #client-main .dwa3-history{min-height:82px;padding:12px 14px;display:grid;grid-template-columns:minmax(0,1fr) 1px minmax(0,1fr);gap:13px;align-items:center}
        #client-main .dwa3-history.first{grid-template-columns:42px minmax(0,1fr)}
        #client-main .dwa3-history-block{display:grid;grid-template-columns:38px minmax(0,1fr);gap:10px;align-items:center;min-width:0}
        #client-main .dwa3-history-icon{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.34);border-radius:11px;background:rgba(217,170,74,.065);color:#f0c96b}
        #client-main .dwa3-history-icon svg{width:20px;height:20px}
        #client-main .dwa3-history span{display:block;color:#e0ad4c;font-size:8px;font-weight:850;letter-spacing:2px}
        #client-main .dwa3-history strong{display:block;margin-top:4px;color:#f6f4ef;font-size:13px;line-height:1.15}
        #client-main .dwa3-history-divider{height:50px;background:rgba(255,255,255,.12)}
        #client-main .dwa3-tip{overflow:hidden}
        #client-main .dwa3-tip-toggle{width:100%;min-height:62px;padding:11px 14px;display:grid;grid-template-columns:38px minmax(0,1fr) 14px;align-items:center;gap:11px;border:0;background:transparent;color:#f0c96b;text-align:left}
        #client-main .dwa3-tip-toggle .head{color:#e0ad4c;font-size:9px;font-weight:850;letter-spacing:2.3px;text-transform:uppercase}
        #client-main .dwa3-tip-chevron{width:9px;height:9px;border-right:2px solid #e0ad4c;border-bottom:2px solid #e0ad4c;transform:rotate(45deg) translateY(-2px);transition:transform .2s ease}
        #client-main .dwa3-tip.open .dwa3-tip-chevron{transform:rotate(225deg) translate(-1px,-1px)}
        #client-main .dwa3-tip-body{display:none;padding:0 15px 13px 63px;color:#b7bec8;font-size:11px;line-height:1.45}
        #client-main .dwa3-tip.open .dwa3-tip-body{display:block}
        #client-main .dwa3-current{padding:14px}
        #client-main .dwa3-current-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
        #client-main .dwa3-section-title{display:flex;align-items:center;gap:9px;color:#e0ad4c;font-size:9px;font-weight:850;letter-spacing:2.3px}
        #client-main .dwa3-section-title svg{width:19px;height:19px}
        #client-main .dwa3-current-head small{color:#9aa2ad;font-size:10px}
        #client-main .dwa3-steps{display:grid;grid-template-columns:repeat(${Math.max(1,planned)},minmax(0,1fr));gap:7px;margin-bottom:14px}
        #client-main .dwa3-step{height:42px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:linear-gradient(145deg,#12171d,#0a0e13);color:#838c98;font-size:16px;font-weight:760}
        #client-main .dwa3-step svg{width:18px;height:18px}
        #client-main .dwa3-step.done{border-color:rgba(217,170,74,.42);color:#e6bd5c;background:rgba(217,170,74,.045)}
        #client-main .dwa3-step.active{border-color:#e5b64d;background:radial-gradient(circle at 50% 20%,rgba(240,201,107,.23),transparent 58%),linear-gradient(145deg,#2a210f,#15120b);color:#f0c96b;box-shadow:0 0 18px rgba(217,170,74,.16)}
        #client-main .dwa3-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        #client-main .dwa3-fields label{display:block;margin:0!important}
        #client-main .dwa3-fields label>b{display:block;margin-bottom:6px;color:#f0f1ee;font-size:11px}
        #client-main .dwa3-input{height:54px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;border:1px solid rgba(143,154,170,.42);border-radius:13px;background:#11161e;overflow:hidden}
        #client-main .dwa3-input:focus-within{border-color:#e0ad4c;box-shadow:0 0 0 3px rgba(217,170,74,.07)}
        #client-main .dwa3-input input{width:100%!important;height:100%;padding:0 12px!important;border:0!important;outline:0!important;background:transparent!important;box-shadow:none!important;color:#faf9f5!important;font-size:20px!important;font-weight:780!important}
        #client-main .dwa3-input input::placeholder{color:#77818d;opacity:1}
        #client-main .dwa3-input span{padding:0 11px;color:#8e97a3;font-size:10px}
        #client-main .dwa3-fields label>small{display:block;margin-top:6px;color:#858e99;font-size:8.5px}
        #client-main .dwa3-today{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
        #client-main .dwa3-today span{padding:5px 8px;border-radius:999px;background:rgba(217,170,74,.05);color:#aeb6c0;font-size:8px}
        #client-main .dwa3-today b{color:#f0c96b;margin-right:3px}
        #client-main .dwa3-primary{width:100%;min-height:54px;margin-top:13px;border:1px solid #f4cd69;border-radius:15px;background:linear-gradient(135deg,#f0c45d,#dfa93d 58%,#f1c960);color:#15110a;font-size:14px;font-weight:850;box-shadow:0 10px 24px rgba(217,170,74,.18),inset 0 1px 0 rgba(255,255,255,.32)}
        #client-main .dwa3-primary b{margin-left:8px;font-size:20px}
        #client-main .dwa3-rest-note{margin-top:10px;padding:11px;border:1px solid rgba(217,170,74,.20);border-radius:12px;background:rgba(217,170,74,.04);text-align:center;color:#d3b35f;font-size:10px}
        #client-main .dwa3-rest{min-height:70px;padding:10px 13px;display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:10px}
        #client-main .dwa3-rest-icon{width:42px;height:42px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.30);border-radius:12px;background:rgba(217,170,74,.055);color:#f0c96b}
        #client-main .dwa3-rest-icon svg{width:22px;height:22px}
        #client-main .dwa3-rest span{display:block;color:#e0ad4c;font-size:8px;font-weight:850;letter-spacing:1.8px}
        #client-main .dwa3-rest strong{display:block;margin-top:2px;color:#f0c96b;font-size:20px;font-variant-numeric:tabular-nums}
        #client-main .dwa3-rest small{display:block;margin-top:2px;color:#858e99;font-size:8px}
        #client-main .dwa3-rest button{min-height:38px;padding:0 12px;border:1px solid rgba(255,255,255,.13);border-radius:11px;background:rgba(255,255,255,.025);color:#c2c7ce;font-size:9px}
        #client-main .dwa3-exit{width:100%;min-height:48px;display:flex;align-items:center;justify-content:center;gap:9px;padding:0 15px;border:1px solid rgba(255,255,255,.14);border-radius:15px;background:linear-gradient(145deg,#12171d,#0a0e13);color:#dfe2e5;font-size:11px;font-weight:680}
        #client-main .dwa3-exit svg{width:18px;height:18px;color:#aeb6bf}
        @media(max-width:390px){
          #client-main .dwa3-top{grid-template-columns:minmax(0,1fr) 108px;gap:9px 10px}
          #client-main .dwa3-media{width:108px;height:100px;border-radius:15px}
          #client-main .dwa3-title{font-size:20px!important}
          #client-main .dwa3-kicker{margin-bottom:9px}
          #client-main .dwa3-back{width:38px;height:38px}
          #client-main .dwa3-actions{grid-template-columns:minmax(0,1fr) 116px;gap:7px}
          #client-main .dwa3-tech,#client-main .dwa3-elapsed{min-height:42px}
          #client-main .dwa3-history{padding:10px 11px;gap:9px}
          #client-main .dwa3-history-block{grid-template-columns:34px minmax(0,1fr);gap:7px}
          #client-main .dwa3-history-icon{width:34px;height:34px}
          #client-main .dwa3-history strong{font-size:11.5px}
          #client-main .dwa3-tip-toggle{min-height:58px;padding:10px 12px;grid-template-columns:34px minmax(0,1fr) 12px}
          #client-main .dwa3-tip-body{padding-left:57px}
          #client-main .dwa3-current{padding:12px}
          #client-main .dwa3-step{height:39px;font-size:15px}
          #client-main .dwa3-fields{gap:8px}
          #client-main .dwa3-input{height:51px}
          #client-main .dwa3-input input{font-size:18px!important;padding:0 10px!important}
          #client-main .dwa3-primary{min-height:51px;font-size:13px}
        }
      </style>

      <div class="dwa3">
        <section class="dwa3-top">
          <div class="dwa3-copy">
            <div class="dwa3-kicker"><button type="button" class="dwa3-back" onclick="cancelWorkout()" aria-label="Volver">${icon('back')}</button><div><span>ENTRENAMIENTO</span><small>Ejercicio ${current} de ${total}</small></div></div>
            <h1 class="dwa3-title">${esc(exercise.name||'Ejercicio')}</h1>
            <div class="dwa3-badges">${muscle?`<span class="dwa3-badge gold">${esc(muscle)}</span>`:''}${planned?`<span class="dwa3-badge">${planned} series</span>`:''}${exercise.reps?`<span class="dwa3-badge">${esc(exercise.reps)} reps</span>`:''}</div>
          </div>
          <div class="dwa3-media">${image?`<img src="./${esc(image)}" alt="${esc(exercise.name||'')}">`:'<div class="dwa3-media-placeholder">◇</div>'}</div>
          <div class="dwa3-actions"><button type="button" class="dwa3-tech" onclick="${techniqueAction}">${icon('play')} Ver técnica</button><div class="dwa3-elapsed"><div class="dwa3-elapsed-icon">${icon('clock')}</div><strong id="workout-elapsed">00:00</strong></div></div>
        </section>

        ${renderHistory(stats)}

        <section class="dwa3-card dwa3-tip ${window.__dccWorkoutTipOpen?'open':''}"><button type="button" class="dwa3-tip-toggle" aria-expanded="${window.__dccWorkoutTipOpen?'true':'false'}" onclick="dccToggleWorkoutTips()"><div class="dwa3-history-icon">${icon('bulb')}</div><div class="head">CONSEJOS DEL EJERCICIO</div><span class="dwa3-tip-chevron"></span></button><div class="dwa3-tip-body">${esc(tip)}</div></section>

        ${renderCurrent(workout,exercise,stats,planned,completed,finished)}
        ${renderRest(workout,exercise)}
        <button type="button" class="dwa3-exit" onclick="cancelWorkout()">${icon('exit')} Salir del entrenamiento</button>
      </div>`;

    startElapsedTimer(workout);
  }

  window.dccWorkoutTechniqueUnavailable=function(){
    if(typeof window.toast==='function')window.toast('La técnica de este ejercicio estará disponible en la biblioteca.');
  };

  window.renderWorkoutSession=renderPremiumWorkout;

  const previousShowClient=window.showClient;
  if(typeof previousShowClient==='function'){
    window.showClient=function(){
      const result=previousShowClient.apply(this,arguments);
      if(!window.activeWorkout){document.body.classList.remove('dcc-workout-mode');clearInterval(window.dccWorkoutElapsedInterval);}
      return result;
    };
  }
})();