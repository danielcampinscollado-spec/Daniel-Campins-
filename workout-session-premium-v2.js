(function(){
  'use strict';

  const esc = value => String(value ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');

  const norm = value => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ')
    .trim();

  const fmt = value => {
    if(value === '' || value === null || value === undefined) return '—';
    const number = Number(value);
    if(Number.isFinite(number)) return String(number).replace('.',',');
    return String(value);
  };

  const formatDuration = totalSeconds => {
    const safe = Math.max(0,Math.floor(Number(totalSeconds)||0));
    const hours = Math.floor(safe/3600);
    const minutes = Math.floor((safe%3600)/60);
    const seconds = safe%60;
    return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  };

  const formatRest = totalSeconds => {
    const safe = Math.max(0,Math.floor(Number(totalSeconds)||0));
    const minutes = Math.floor(safe/60);
    const seconds = safe%60;
    return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  };

  const icon = name => {
    const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    if(name==='back') return `<svg ${common}><path d="m15 18-6-6 6-6"/></svg>`;
    if(name==='play') return `<svg ${common}><path d="m9 7 8 5-8 5V7Z"/></svg>`;
    if(name==='chart') return `<svg ${common}><path d="M5 19V10M12 19V5M19 19v-7"/></svg>`;
    if(name==='trophy') return `<svg ${common}><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 12v4M9 20h6M10 16h4"/></svg>`;
    if(name==='target') return `<svg ${common}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12 18 6M17 6h2v2"/></svg>`;
    if(name==='bulb') return `<svg ${common}><path d="M9 18h6M10 21h4"/><path d="M8.5 14.5A6 6 0 1 1 15.5 14.5C14.6 15.2 14 16.2 14 17h-4c0-.8-.6-1.8-1.5-2.5Z"/></svg>`;
    if(name==='dumbbell') return `<svg ${common}><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/></svg>`;
    if(name==='check') return `<svg ${common}><path d="m5 12 4 4L19 6"/></svg>`;
    if(name==='clock') return `<svg ${common}><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>`;
    if(name==='timer') return `<svg ${common}><circle cx="12" cy="13" r="7"/><path d="M12 10v4l2 1M9 3h6M12 3v3"/></svg>`;
    if(name==='exit') return `<svg ${common}><path d="M10 6 4 12l6 6M4 12h11"/><path d="M14 5h5v14h-5"/></svg>`;
    return '';
  };

  function exerciseImage(exercise){
    const clean = value => String(value || '').replace(/^\.\/+/,'');
    const direct = exercise?.image || exercise?.imageStart || exercise?.illustration || exercise?.ilustracion || '';
    if(direct) return clean(direct);

    const library = Array.isArray(window.exerciseLibraryFull) ? window.exerciseLibraryFull : [];
    const id = String(exercise?.id ?? exercise?.exerciseId ?? exercise?.exercise_id ?? '').trim();
    const name = norm(exercise?.name ?? exercise?.nombre ?? exercise?.exercise ?? exercise?.exerciseName);

    let hit = id ? library.find(item => String(item?.id ?? '') === id) : null;
    if(!hit && name) hit = library.find(item => norm(item?.name) === name) || null;

    if(!hit && name){
      const aliases = [
        [/fondos.*maquina.*asistida|fondos.*asistida/, 'fondos-maquina-asistida'],
        [/press.*banca.*barra|press de banca con barra/, 'press-banca-barra'],
        [/aperturas.*cable|aperturas.*polea/, 'aperturas-polea-banco'],
        [/patada.*triceps.*cable|patada.*triceps.*polea/, 'extension-triceps-unilateral'],
        [/press.*inclinado.*barra/, 'press-inclinado-barra'],
        [/press.*inclinado.*mancuernas/, 'press-inclinado-mancuernas']
      ];
      for(const [regex,libraryId] of aliases){
        if(regex.test(name)){
          hit = library.find(item => String(item?.id ?? '') === libraryId) || null;
          if(hit) break;
        }
      }
    }

    return clean(hit?.image || hit?.imageStart || '');
  }

  function previousExerciseRecord(clientId, exercise){
    const history = Array.isArray(window.data?.workoutHistory?.[clientId])
      ? window.data.workoutHistory[clientId]
      : [];
    const target = norm(exercise?.name);

    for(let i=history.length-1;i>=0;i--){
      const workout = history[i] || {};
      const found = (workout.exercises || []).find(item => norm(item?.name) === target);
      if(found){
        return {
          workout,
          exercise:found,
          sets:Array.isArray(found.sets) ? found.sets : []
        };
      }
    }
    return null;
  }

  function bestSet(sets){
    return (sets || []).reduce((best,set)=>{
      const kg = Number(set?.kg) || 0;
      const reps = Number(set?.reps) || 0;
      const score = kg * reps;
      if(!best || score > best.score || (score === best.score && kg > best.kg)){
        return {kg,reps,score};
      }
      return best;
    },null);
  }

  function previousDate(record){
    const raw = record?.workout?.date || record?.workout?.workout_date || record?.workout?.created_at || '';
    if(!raw) return '';
    const d = new Date(raw);
    if(Number.isNaN(d.getTime())) return '';
    try{
      return d.toLocaleDateString('es-ES',{day:'numeric',month:'short'}).replace('.','');
    }catch(_){
      return '';
    }
  }

  function exerciseTip(exercise){
    const n = norm(exercise?.name);
    if(/fondos|press banca|press de banca|press inclinado/.test(n)) return 'Controla la bajada y mantén el pecho estable.';
    if(/apertura|cruce|pec deck/.test(n)) return 'Mantén tensión continua y evita perder el control al abrir.';
    if(/triceps|extension|patada/.test(n)) return 'Mantén los codos estables y completa la extensión sin balancearte.';
    if(/remo/.test(n)) return 'Lleva los codos atrás y evita tirar con el impulso del torso.';
    if(/jalon|dominada/.test(n)) return 'Inicia el movimiento con la espalda y mantén el pecho alto.';
    if(/curl/.test(n)) return 'Controla la bajada y evita adelantar los codos.';
    if(/sentadilla|prensa/.test(n)) return 'Mantén el apoyo estable y controla toda la fase de bajada.';
    if(/femoral|peso muerto rumano/.test(n)) return 'Mantén la tensión en la cadena posterior y evita perder la posición lumbar.';
    if(/hip thrust|glute/.test(n)) return 'Bloquea arriba con control sin hiperextender la zona lumbar.';
    return 'Prioriza una ejecución limpia y repite cada serie con el mismo control.';
  }

  function inputPrefill(previousSets, index, field){
    const value = previousSets?.[index]?.[field];
    return value === undefined || value === null ? '' : String(value);
  }

  function renderSeriesSteps(plannedSets, completedSets){
    if(!plannedSets) return '';
    return Array.from({length:plannedSets},(_,index)=>{
      const number = index+1;
      const done = index < completedSets;
      const active = index === completedSets;
      return `
        <div class="dwa-step ${done?'done':''} ${active?'active':''}">
          <div class="dwa-step-box">${done ? icon('check') : number}</div>
          <span>${done ? 'Completada' : active ? 'Actual' : 'Pendiente'}</span>
        </div>
      `;
    }).join('');
  }

  function renderSavedToday(sets){
    if(!sets?.length) return '';
    return `
      <div class="dwa-today">
        <div class="dwa-today-label">Series guardadas hoy</div>
        <div class="dwa-today-values">
          ${sets.map((set,index)=>`<span><b>S${index+1}</b> ${fmt(set.kg)} kg × ${fmt(set.reps)}</span>`).join('')}
        </div>
      </div>
    `;
  }

  function renderLastSession(record){
    if(!record){
      return `
        <section class="dwa-card dwa-last dwa-last-empty">
          <div class="dwa-section-head">
            <div class="dwa-head-icon">${icon('chart')}</div>
            <div><div class="dwa-label">ÚLTIMA SESIÓN</div><strong>Tu primer registro empieza hoy</strong></div>
          </div>
          <p>Cuando vuelvas a este ejercicio verás aquí exactamente el peso y las repeticiones que hiciste.</p>
        </section>
      `;
    }

    const best = bestSet(record.sets);
    return `
      <section class="dwa-card dwa-last">
        <div class="dwa-last-title">
          <div class="dwa-section-head">
            <div class="dwa-head-icon">${icon('chart')}</div>
            <div class="dwa-label">ÚLTIMA SESIÓN</div>
          </div>
          <span>${esc(previousDate(record))}</span>
        </div>

        <div class="dwa-last-grid">
          <div class="dwa-last-sets">
            ${record.sets.map((set,index)=>`
              <div class="dwa-last-row"><span>Serie ${index+1}</span><b>${fmt(set.kg)} kg × ${fmt(set.reps)}</b></div>
            `).join('') || '<div class="dwa-last-row"><span>Sin series registradas</span></div>'}
          </div>
          <div class="dwa-best">
            <div class="dwa-best-line"><div class="dwa-mini-icon">${icon('trophy')}</div><div><span>Mejor serie</span><strong>${best ? `${fmt(best.kg)} kg × ${fmt(best.reps)}` : '—'}</strong></div></div>
            <div class="dwa-best-line"><div class="dwa-mini-icon">${icon('target')}</div><div><span>Objetivo de hoy</span><strong>${best ? 'Igualar o superar' : 'Crear referencia'}</strong></div></div>
          </div>
        </div>
      </section>
    `;
  }

  function renderRest(workout,exercise){
    const active = !!(workout.restUntil && workout.restUntil>Date.now());
    const configured = Math.max(0,parseInt(exercise?.restBetweenSets)||0);
    const remaining = active
      ? Math.max(0,Math.ceil((Number(workout.restUntil)-Date.now())/1000))
      : configured;

    return `
      <section class="dwa-card dwa-rest ${active?'active':'idle'}">
        <div class="dwa-rest-icon">${icon('timer')}</div>
        <div class="dwa-rest-copy">
          <span>DESCANSO</span>
          ${active
            ? `<strong id="rest-timer">${formatRest(remaining)}</strong><small>Los últimos 10 segundos sonarán uno a uno.</small>`
            : `<strong>${configured ? formatRest(configured) : '—:—'}</strong><small>${configured ? 'Se activará al guardar la serie.' : 'Sin descanso programado.'}</small>`
          }
        </div>
        <button type="button" class="dwa-rest-skip" ${active?'':'disabled'} onclick="skipRest()">Saltar</button>
      </section>
    `;
  }

  function renderCurrentCard(workout, exercise, previous, plannedSets, completedSets, setsFinished){
    const previousSets = previous?.sets || [];
    const currentIndex = Math.min(completedSets,Math.max(0,plannedSets-1));
    const previousSet = previousSets[currentIndex] || null;
    const restActive = workout.restUntil && workout.restUntil > Date.now();

    if(setsFinished){
      return `
        <section class="dwa-card dwa-current dwa-complete">
          <div class="dwa-current-head">
            <div class="dwa-section-head"><div class="dwa-head-icon">${icon('dumbbell')}</div><div class="dwa-label">EJERCICIO COMPLETADO</div></div>
            <strong>${completedSets}/${plannedSets}</strong>
          </div>
          <div class="dwa-steps">${renderSeriesSteps(plannedSets,completedSets)}</div>
          ${renderSavedToday(workout.sets)}
          <button type="button" class="dwa-primary" onclick="nextWorkoutExercise()">
            ${workout.currentExercise < workout.exercises.length-1 ? 'Siguiente ejercicio' : 'Finalizar entrenamiento'}
            <span>→</span>
          </button>
        </section>
      `;
    }

    return `
      <section class="dwa-card dwa-current">
        <div class="dwa-current-head">
          <div class="dwa-section-head"><div class="dwa-head-icon">${icon('dumbbell')}</div><div class="dwa-label">SERIE ACTUAL</div></div>
          <strong>${completedSets}/${plannedSets || '—'}</strong>
        </div>

        <div class="dwa-steps">${renderSeriesSteps(plannedSets,completedSets)}</div>

        ${restActive ? `
          ${renderSavedToday(workout.sets)}
          <div class="dwa-rest-inline"><span>Serie ${completedSets} guardada</span><strong>Descansa antes de continuar</strong></div>
        ` : `
          <div class="dwa-fields">
            <label class="dwa-field">
              <span>Peso (kg)</span>
              <div class="dwa-input-wrap"><input id="workout-kg" type="number" inputmode="decimal" step="0.5" autocomplete="off" value="${esc(inputPrefill(previousSets,currentIndex,'kg'))}" placeholder="0"><b>kg</b></div>
              <small>${previousSet ? `Anterior: ${fmt(previousSet.kg)} kg` : 'Sin registro anterior'}</small>
            </label>
            <label class="dwa-field">
              <span>Repeticiones</span>
              <div class="dwa-input-wrap"><input id="workout-reps" type="number" inputmode="numeric" autocomplete="off" value="${esc(inputPrefill(previousSets,currentIndex,'reps'))}" placeholder="0"><b>reps</b></div>
              <small>${previousSet ? `Anterior: ${fmt(previousSet.reps)} reps` : 'Sin registro anterior'}</small>
            </label>
          </div>

          ${renderSavedToday(workout.sets)}

          <button type="button" class="dwa-primary" onclick="saveWorkoutSet()">
            ${icon('check')} Guardar serie y continuar <span>→</span>
          </button>
        `}
      </section>
    `;
  }

  function startElapsedTimer(workout){
    clearInterval(window.dccWorkoutElapsedInterval);

    const update = ()=>{
      if(!window.activeWorkout){
        clearInterval(window.dccWorkoutElapsedInterval);
        return;
      }
      const el = document.getElementById('workout-elapsed');
      if(!el) return;
      const startedAt = Number(workout.startedAt)||Date.now();
      el.textContent = formatDuration((Date.now()-startedAt)/1000);
    };

    update();
    window.dccWorkoutElapsedInterval = setInterval(update,1000);
  }

  function renderPremiumWorkout(){
    const workout = window.activeWorkout;
    if(!workout) return;
    if(!Array.isArray(workout.completedExercises)) workout.completedExercises=[];
    if(!Array.isArray(workout.sets)) workout.sets=[];

    const main = document.getElementById('client-main');
    if(!main) return;

    const exercise = workout.exercises?.[workout.currentExercise];
    if(!exercise){
      if(typeof window.finishWorkout === 'function') window.finishWorkout();
      return;
    }

    document.body.classList.add('dcc-workout-mode');

    const totalExercises = workout.exercises.length;
    const currentNumber = workout.currentExercise + 1;
    const plannedSets = Math.max(0,parseInt(exercise.sets)||0);
    const completedSets = workout.sets.length;
    const setsFinished = plannedSets > 0 && completedSets >= plannedSets;
    const previous = previousExerciseRecord(workout.clientId,exercise);
    const image = exerciseImage(exercise);
    const muscle = exercise.muscle || exercise.group || exercise.grupo || '';
    const tip = exerciseTip(exercise);

    const techniqueAction = exercise.videoUrl
      ? `window.open('${esc(exercise.videoUrl)}','_blank','noopener')`
      : `window.dccWorkoutTechniqueUnavailable()`;

    main.innerHTML = `
      <style id="dcc-workout-premium-v3">
        body.dcc-workout-mode #client-main{padding-bottom:28px!important}
        #client-main .dwa{width:100%;max-width:820px;margin:0 auto;padding:2px 0 30px;color:#f7f5f0}
        #client-main .dwa *{box-sizing:border-box}
        #client-main .dwa button,#client-main .dwa input{font:inherit}
        #client-main .dwa-top{display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:18px;align-items:start;margin-bottom:16px}
        #client-main .dwa-top-copy{min-width:0}
        #client-main .dwa-side{display:flex;flex-direction:column;align-items:stretch;gap:11px;padding:3px 8px 0 0;min-width:0}
        #client-main .dwa-kicker{display:flex;align-items:center;gap:11px;margin-bottom:13px}
        #client-main .dwa-back{width:44px;height:44px;display:grid;place-items:center;padding:0;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:linear-gradient(145deg,#151a20,#0b0f14);color:#f1f3f5}
        #client-main .dwa-back svg{width:22px;height:22px}
        #client-main .dwa-kicker-copy span{display:block;color:#e5b34b;font-size:10px;font-weight:850;letter-spacing:3px;text-transform:uppercase}
        #client-main .dwa-kicker-copy small{display:block;margin-top:3px;color:#89919d;font-size:11px}
        #client-main .dwa-title{margin:0!important;color:#faf9f5!important;font-size:31px!important;line-height:1.02!important;font-weight:790!important;letter-spacing:-1.05px!important}
        #client-main .dwa-badges{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
        #client-main .dwa-badge{min-height:30px;display:inline-flex;align-items:center;padding:0 11px;border:1px solid rgba(255,255,255,.13);border-radius:999px;background:linear-gradient(145deg,#131820,#0b0f14);color:#aab1bc;font-size:10px;font-weight:720}
        #client-main .dwa-badge.gold{border-color:rgba(224,173,76,.72);background:rgba(217,170,74,.06);color:#f0c96b;font-size:9px;font-weight:850;letter-spacing:1.45px;text-transform:uppercase}
        #client-main .dwa-tech{min-height:48px;display:inline-flex;align-items:center;gap:10px;margin-top:13px;padding:0 15px;border:1px solid rgba(224,173,76,.70);border-radius:14px;background:linear-gradient(145deg,#11161c,#0a0e13);color:#f3f3ef;font-size:12px;font-weight:760}
        #client-main .dwa-tech svg{width:19px;height:19px;color:#f0c96b}
        #client-main .dwa-elapsed{min-height:56px;display:grid;grid-template-columns:31px minmax(0,1fr);align-items:center;gap:8px;padding:9px 11px;border:1px solid rgba(224,173,76,.72);border-radius:16px;background:radial-gradient(circle at 0 0,rgba(217,170,74,.09),transparent 55%),linear-gradient(145deg,#14191f,#090d12);box-shadow:0 10px 24px rgba(0,0,0,.23)}
        #client-main .dwa-elapsed-icon{width:31px;height:31px;display:grid;place-items:center;border-radius:10px;background:rgba(217,170,74,.07);color:#f0c96b}
        #client-main .dwa-elapsed-icon svg{width:18px;height:18px}
        #client-main .dwa-elapsed strong{display:block;color:#f6f4ef;font-size:15px;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:.2px}
        #client-main .dwa-elapsed span{display:block;margin-top:4px;color:#89919d;font-size:8px;line-height:1.15}
        #client-main .dwa-media{width:100%;aspect-ratio:1/.9;border:1px solid rgba(224,173,76,.72);border-radius:19px;background:radial-gradient(circle at 70% 18%,rgba(217,170,74,.10),transparent 34%),linear-gradient(145deg,#12171d,#080b0f);overflow:hidden;box-shadow:0 14px 34px rgba(0,0,0,.30)}
        #client-main .dwa-media img{width:100%;height:100%;object-fit:contain;display:block;padding:6px}
        #client-main .dwa-top.no-image .dwa-media{display:grid;place-items:center;min-height:126px;color:#59616c}
        #client-main .dwa-media-placeholder{width:40px;height:40px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.09);border-radius:12px;color:#77818d;font-size:18px}
        #client-main .dwa-card{position:relative;margin:0 0 12px;padding:18px;border:1px solid rgba(217,170,74,.70);border-radius:21px;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.10),transparent 38%),linear-gradient(145deg,#171b21 0%,#0d1116 64%,#090c10 100%);box-shadow:0 14px 34px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.035);overflow:hidden}
        #client-main .dwa-section-head{display:flex;align-items:center;gap:10px;min-width:0}
        #client-main .dwa-head-icon{width:38px;height:38px;display:grid;place-items:center;flex:none;border:1px solid rgba(217,170,74,.35);border-radius:11px;background:rgba(217,170,74,.07);color:#f0c96b}
        #client-main .dwa-head-icon svg{width:20px;height:20px}
        #client-main .dwa-label{color:#e0ad4c;font-size:9px;font-weight:850;letter-spacing:2.5px;text-transform:uppercase}
        #client-main .dwa-last-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:13px}
        #client-main .dwa-last-title>span{color:#8f97a3;font-size:10px}
        #client-main .dwa-last-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(170px,.8fr);border:1px solid rgba(255,255,255,.07);border-radius:15px;background:rgba(5,8,11,.24);overflow:hidden}
        #client-main .dwa-last-sets{padding:12px 14px}
        #client-main .dwa-last-row{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:29px;color:#aab1bb;font-size:11px}
        #client-main .dwa-last-row b{color:#f2f2ef;font-size:11px;font-weight:680}
        #client-main .dwa-best{display:grid;align-content:center;gap:15px;padding:14px;border-left:1px solid rgba(255,255,255,.07);background:linear-gradient(145deg,rgba(217,170,74,.035),rgba(255,255,255,.008))}
        #client-main .dwa-best-line{display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;gap:9px}
        #client-main .dwa-mini-icon{width:34px;height:34px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.32);border-radius:10px;background:rgba(217,170,74,.06);color:#f0c96b}
        #client-main .dwa-mini-icon svg{width:18px;height:18px}
        #client-main .dwa-best-line span{display:block;color:#e0ad4c;font-size:9px}
        #client-main .dwa-best-line strong{display:block;margin-top:3px;color:#f7f5f0;font-size:16px;line-height:1.05}
        #client-main .dwa-last-empty p{margin:13px 0 0;color:#929aa5;font-size:12px;line-height:1.45}
        #client-main .dwa-tip{display:grid;grid-template-columns:42px minmax(0,1fr);align-items:center;gap:12px;min-height:76px;padding:14px 16px}
        #client-main .dwa-tip p{margin:5px 0 0;color:#b7bec8;font-size:12px;line-height:1.4}
        #client-main .dwa-current{padding:18px}
        #client-main .dwa-current-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
        #client-main .dwa-current-head>strong{color:#e0ad4c;font-size:27px;font-weight:820;letter-spacing:-.7px}
        #client-main .dwa-steps{display:grid;grid-template-columns:repeat(${Math.max(1,plannedSets)},minmax(0,1fr));gap:7px;margin-bottom:17px}
        #client-main .dwa-step{text-align:center;min-width:0}
        #client-main .dwa-step-box{height:44px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);border-radius:13px;background:linear-gradient(145deg,#12171d,#0a0e13);color:#818a96;font-size:17px;font-weight:760}
        #client-main .dwa-step-box svg{width:20px;height:20px}
        #client-main .dwa-step span{display:block;margin-top:5px;color:#737c88;font-size:8px}
        #client-main .dwa-step.done .dwa-step-box{border-color:rgba(217,170,74,.45);background:rgba(217,170,74,.06);color:#f0c96b}
        #client-main .dwa-step.done span{color:#b99a55}
        #client-main .dwa-step.active .dwa-step-box{border-color:#e5b64d;background:radial-gradient(circle at 50% 20%,rgba(240,201,107,.25),transparent 58%),linear-gradient(145deg,#2a210f,#15120b);color:#f0c96b;box-shadow:0 0 22px rgba(217,170,74,.19),inset 0 1px 0 rgba(255,255,255,.06)}
        #client-main .dwa-step.active span{color:#f0c96b}
        #client-main .dwa-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
        #client-main .dwa-field{display:block;margin:0!important}
        #client-main .dwa-field>span{display:block;margin-bottom:7px;color:#f0f1ee;font-size:12px;font-weight:730}
        #client-main .dwa-input-wrap{height:58px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;border:1px solid rgba(143,154,170,.42);border-radius:14px;background:#11161e;overflow:hidden;transition:.2s}
        #client-main .dwa-input-wrap:focus-within{border-color:#e0ad4c;box-shadow:0 0 0 3px rgba(217,170,74,.08)}
        #client-main .dwa-input-wrap input{width:100%!important;height:100%;padding:0 14px!important;border:0!important;outline:0!important;background:transparent!important;box-shadow:none!important;color:#faf9f5!important;font-size:21px!important;font-weight:780!important}
        #client-main .dwa-input-wrap b{padding:0 13px;color:#8e97a3;font-size:11px;font-weight:500}
        #client-main .dwa-field small{display:block;margin-top:6px;color:#858e99;font-size:9px}
        #client-main .dwa-today{margin-top:12px;padding:11px 12px;border:1px solid rgba(255,255,255,.07);border-radius:13px;background:rgba(255,255,255,.018)}
        #client-main .dwa-today-label{margin-bottom:7px;color:#8f97a3;font-size:8px;font-weight:780;letter-spacing:1.2px;text-transform:uppercase}
        #client-main .dwa-today-values{display:flex;flex-wrap:wrap;gap:7px}
        #client-main .dwa-today-values span{padding:5px 8px;border-radius:999px;background:rgba(217,170,74,.055);color:#b9c0c9;font-size:9px}
        #client-main .dwa-today-values b{color:#f0c96b;margin-right:4px}
        #client-main .dwa-primary{width:100%;min-height:58px;display:flex;align-items:center;justify-content:center;gap:10px;margin-top:14px;padding:12px 18px;border:1px solid #f4cd69;border-radius:17px;background:linear-gradient(135deg,#f0c45d,#dfa93d 58%,#f1c960);color:#15110a;font-size:15px;font-weight:850;box-shadow:0 11px 28px rgba(217,170,74,.20),inset 0 1px 0 rgba(255,255,255,.34)}
        #client-main .dwa-primary svg{width:20px;height:20px}
        #client-main .dwa-primary span{font-size:22px;line-height:1}
        #client-main .dwa-rest-inline{margin-top:12px;padding:13px;border:1px solid rgba(217,170,74,.20);border-radius:13px;background:rgba(217,170,74,.045);text-align:center}
        #client-main .dwa-rest-inline span{display:block;color:#a98b49;font-size:9px;text-transform:uppercase;letter-spacing:1.2px}
        #client-main .dwa-rest-inline strong{display:block;margin-top:4px;color:#f6f4ef;font-size:12px}
        #client-main .dwa-rest{display:grid;grid-template-columns:52px minmax(0,1fr) auto;align-items:center;gap:12px;padding:13px 15px}
        #client-main .dwa-rest-icon{width:52px;height:52px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.30);border-radius:15px;background:rgba(217,170,74,.055);color:#f0c96b}
        #client-main .dwa-rest-icon svg{width:25px;height:25px}
        #client-main .dwa-rest-copy span{display:block;color:#e0ad4c;font-size:8px;font-weight:850;letter-spacing:2px}
        #client-main .dwa-rest-copy strong{display:block;margin-top:3px;color:#f0c96b;font-size:24px;line-height:1;font-variant-numeric:tabular-nums}
        #client-main .dwa-rest-copy small{display:block;margin-top:4px;color:#848d98;font-size:9px}
        #client-main .dwa-rest-skip{min-height:42px;padding:0 14px;border:1px solid rgba(255,255,255,.13);border-radius:13px;background:rgba(255,255,255,.025);color:#c2c7ce;font-size:10px;font-weight:720}
        #client-main .dwa-rest.idle{border-color:rgba(255,255,255,.13);background:linear-gradient(145deg,#12171d,#0a0e13)}
        #client-main .dwa-rest.idle .dwa-rest-icon{border-color:rgba(255,255,255,.11);background:rgba(255,255,255,.025);color:#8e97a2}
        #client-main .dwa-rest.idle .dwa-rest-copy strong{color:#7c8591}
        #client-main .dwa-rest-skip:disabled{opacity:.38;cursor:default}
        #client-main .dwa-exit{width:100%;min-height:52px;display:flex;align-items:center;justify-content:center;gap:10px;padding:0 16px;border:1px solid rgba(255,255,255,.14);border-radius:17px;background:linear-gradient(145deg,#12171d,#0a0e13);color:#e7e8e8;font-size:12px;font-weight:700}
        #client-main .dwa-exit svg{width:19px;height:19px;color:#b9c0c8}
        @media(max-width:600px){
          #client-main .dwa{padding-top:0}
          #client-main .dwa-top{grid-template-columns:minmax(0,1fr) 140px;gap:10px}
          #client-main .dwa-side{padding-right:4px;gap:9px}
          #client-main .dwa-title{font-size:27px!important;max-width:100%}
          #client-main .dwa-kicker{margin-bottom:10px}
          #client-main .dwa-back{width:40px;height:40px;border-radius:13px}
          #client-main .dwa-kicker-copy span{font-size:9px;letter-spacing:2.5px}
          #client-main .dwa-kicker-copy small{font-size:10px}
          #client-main .dwa-badges{gap:5px;margin-top:10px}
          #client-main .dwa-badge{min-height:27px;padding:0 9px;font-size:9px}
          #client-main .dwa-badge.gold{font-size:8px}
          #client-main .dwa-tech{min-height:42px;margin-top:10px;padding:0 12px;font-size:11px}
          #client-main .dwa-elapsed{min-height:50px;grid-template-columns:27px minmax(0,1fr);gap:6px;padding:8px 9px;border-radius:14px}
          #client-main .dwa-elapsed-icon{width:27px;height:27px;border-radius:9px}
          #client-main .dwa-elapsed strong{font-size:13px}
          #client-main .dwa-elapsed span{font-size:7px}
          #client-main .dwa-media{border-radius:16px}
          #client-main .dwa-card{padding:14px;border-radius:18px}
          #client-main .dwa-last-grid{grid-template-columns:1fr}
          #client-main .dwa-best{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;border-left:0;border-top:1px solid rgba(255,255,255,.07);padding:11px 12px}
          #client-main .dwa-best-line{grid-template-columns:30px minmax(0,1fr);gap:7px}
          #client-main .dwa-mini-icon{width:30px;height:30px}
          #client-main .dwa-best-line strong{font-size:13px}
          #client-main .dwa-steps{gap:5px;margin-bottom:14px}
          #client-main .dwa-step-box{height:39px;border-radius:11px;font-size:15px}
          #client-main .dwa-step span{font-size:7px}
          #client-main .dwa-fields{gap:8px}
          #client-main .dwa-input-wrap{height:54px;border-radius:12px}
          #client-main .dwa-input-wrap input{padding:0 10px!important;font-size:19px!important}
          #client-main .dwa-input-wrap b{padding:0 9px;font-size:9px}
          #client-main .dwa-field>span{font-size:11px}
          #client-main .dwa-primary{min-height:54px;font-size:13px;border-radius:15px}
          #client-main .dwa-rest{grid-template-columns:46px minmax(0,1fr) auto;gap:9px;padding:12px}
          #client-main .dwa-rest-icon{width:46px;height:46px}
          #client-main .dwa-rest-copy strong{font-size:21px}
        }
        @media(max-width:390px){
          #client-main .dwa-top{grid-template-columns:minmax(0,1fr) 126px}
          #client-main .dwa-title{font-size:24px!important}
          #client-main .dwa-elapsed strong{font-size:12px}
          #client-main .dwa-last-row{font-size:10px}
          #client-main .dwa-last-row b{font-size:10px}
          #client-main .dwa-current-head>strong{font-size:24px}
          #client-main .dwa-field>span{font-size:10px}
          #client-main .dwa-rest-copy small{display:none}
        }
      </style>

      <div class="dwa">
        <section class="dwa-top ${image?'':'no-image'}">
          <div class="dwa-top-copy">
            <div class="dwa-kicker">
              <button type="button" class="dwa-back" onclick="cancelWorkout()" aria-label="Volver">${icon('back')}</button>
              <div class="dwa-kicker-copy"><span>ENTRENAMIENTO</span><small>Ejercicio ${currentNumber} de ${totalExercises}</small></div>
            </div>

            <h1 class="dwa-title">${esc(exercise.name || 'Ejercicio')}</h1>
            <div class="dwa-badges">
              ${muscle ? `<span class="dwa-badge gold">${esc(muscle)}</span>` : ''}
              ${plannedSets ? `<span class="dwa-badge">${plannedSets} series</span>` : ''}
              ${exercise.reps ? `<span class="dwa-badge">${esc(exercise.reps)} reps</span>` : ''}
            </div>
            <button type="button" class="dwa-tech" onclick="${techniqueAction}">${icon('play')} Ver técnica</button>
          </div>

          <div class="dwa-side">
            <div class="dwa-elapsed">
              <div class="dwa-elapsed-icon">${icon('clock')}</div>
              <div><strong id="workout-elapsed">00:00:00</strong><span>Tiempo de entrenamiento</span></div>
            </div>
            <div class="dwa-media">
              ${image ? `<img src="./${esc(image)}" alt="${esc(exercise.name || '')}">` : '<div class="dwa-media-placeholder">◇</div>'}
            </div>
          </div>
        </section>

        ${renderLastSession(previous)}

        <section class="dwa-card dwa-tip">
          <div class="dwa-head-icon">${icon('bulb')}</div>
          <div><div class="dwa-label">CONSEJO DEL EJERCICIO</div><p>${esc(tip)}</p></div>
        </section>

        ${renderCurrentCard(workout,exercise,previous,plannedSets,completedSets,setsFinished)}

        ${renderRest(workout,exercise)}

        <button type="button" class="dwa-exit" onclick="cancelWorkout()">${icon('exit')} Salir del entrenamiento</button>
      </div>
    `;

    startElapsedTimer(workout);
  }

  window.dccWorkoutTechniqueUnavailable = function(){
    if(typeof window.toast === 'function') window.toast('La técnica de este ejercicio estará disponible en la biblioteca.');
  };

  window.renderWorkoutSession = renderPremiumWorkout;

  const previousShowClient = window.showClient;
  if(typeof previousShowClient === 'function'){
    window.showClient = function(){
      const result = previousShowClient.apply(this,arguments);
      if(!window.activeWorkout){
        document.body.classList.remove('dcc-workout-mode');
        clearInterval(window.dccWorkoutElapsedInterval);
      }
      return result;
    };
  }
})();