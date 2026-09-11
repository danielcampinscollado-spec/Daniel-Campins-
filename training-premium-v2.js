(function(){
  'use strict';

  const originalShowClient = window.showClient;
  if(typeof originalShowClient !== 'function') return;

  const escHtml = value => String(value ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');

  const normalize = value => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ')
    .trim();

  const MUSCLES = [
    {label:'Pectoral', image:'pecho.png', aliases:['pecho','pectoral','pectorales','chest']},
    {label:'Tríceps', image:'triceps.png', aliases:['triceps']},
    {label:'Espalda', image:'espalda.png', aliases:['espalda','dorsal','dorsales','back','lat']},
    {label:'Hombros', image:'hombros.png', aliases:['hombro','hombros','deltoide','deltoides']},
    {label:'Bíceps', image:'biceps.png', aliases:['biceps','braquial']},
    {label:'Cuádriceps', image:'cuadriceps.png', aliases:['cuadriceps','quad','quads']},
    {label:'Isquios', image:'isquios-femoral.png', aliases:['isquio','isquios','femoral','femorales','hamstring']},
    {label:'Glúteos', image:'gluteos.png', aliases:['gluteo','gluteos','glute']},
    {label:'Gemelos', image:'gemelos.png', aliases:['gemelo','gemelos','pantorrilla','pantorrillas','calf','calves']},
    {label:'Core', image:'core-abdomen.png', aliases:['core','abdomen','abdominal','abdominales','abs']},
    {label:'Lumbar', image:'lumbar-cuello.png', aliases:['lumbar','lumbares','cuello','espalda baja']}
  ];

  const muscleFromText = value => {
    const n = normalize(value);
    return MUSCLES.find(item => item.aliases.some(alias => n.includes(normalize(alias)))) || null;
  };

  const getDayMuscles = day => {
    const values = Array.isArray(day?.muscleGroups) && day.muscleGroups.length
      ? day.muscleGroups
      : String(day?.muscle || '').split(/[·+,&/]/).map(x=>x.trim()).filter(Boolean);

    const result = [];
    values.forEach(value => {
      const found = muscleFromText(value);
      if(found && !result.some(x => x.label === found.label)) result.push(found);
    });

    if(!result.length && day?.muscle){
      const found = muscleFromText(day.muscle);
      if(found) result.push(found);
    }

    return result.slice(0,3);
  };

  const inferExerciseMuscle = (exercise, dayMuscles) => {
    if(exercise?.muscle){
      const direct = muscleFromText(exercise.muscle);
      if(direct) return direct;
    }

    const n = normalize(exercise?.name);
    const tests = [
      [/triceps|fondos|extension de triceps|extension triceps|press frances|rompecraneos|patada/, 'Tríceps'],
      [/press banca|press de banca|press inclinado|apertura|aperturas|cruce|peck deck|contractora|press pecho/, 'Pectoral'],
      [/curl|biceps/, 'Bíceps'],
      [/remo|jalon|dominada|dorsal|espalda/, 'Espalda'],
      [/elevacion lateral|elevaciones laterales|press militar|hombro|deltoide/, 'Hombros'],
      [/sentadilla|prensa|extension de cuadriceps|cuadriceps/, 'Cuádriceps'],
      [/femoral|isquio|peso muerto rumano/, 'Isquios'],
      [/hip thrust|gluteo|gluteos/, 'Glúteos'],
      [/gemelo|pantorrilla/, 'Gemelos'],
      [/abdominal|abdomen|core|plancha/, 'Core']
    ];

    for(const [regex,label] of tests){
      if(regex.test(n)) return MUSCLES.find(item => item.label === label) || null;
    }

    return dayMuscles[0] || null;
  };

  const exerciseImage = exercise => {
    const cleanPath = value => String(value || '').replace(/^\.\/+/,'');
    const direct = exercise?.image || exercise?.imageStart || exercise?.illustration || exercise?.ilustracion || '';
    if(direct) return cleanPath(direct);

    const library = Array.isArray(window.exerciseLibraryFull) ? window.exerciseLibraryFull : [];
    const id = String(exercise?.id ?? exercise?.exerciseId ?? exercise?.exercise_id ?? '').trim();
    const n = normalize(exercise?.name ?? exercise?.nombre ?? exercise?.exercise ?? exercise?.exerciseName);

    let hit = id ? library.find(item => String(item?.id ?? '') === id) : null;
    if(!hit && n) hit = library.find(item => normalize(item?.name) === n) || null;

    if(!hit && n){
      const legacyAliases = [
        [/fondos.*maquina.*asistida|fondos.*asistida/, 'fondos-maquina-asistida'],
        [/press.*banca.*barra|press de banca con barra/, 'press-banca-barra'],
        [/aperturas.*cable|aperturas.*polea/, 'aperturas-polea-banco'],
        [/patada.*triceps.*cable|patada.*triceps.*polea/, 'extension-triceps-unilateral'],
        [/press.*inclinado.*barra/, 'press-inclinado-barra'],
        [/press.*inclinado.*mancuernas/, 'press-inclinado-mancuernas']
      ];
      for(const [regex,libraryId] of legacyAliases){
        if(regex.test(n)){
          hit = library.find(item => String(item?.id ?? '') === libraryId) || null;
          if(hit) break;
        }
      }
    }

    const libraryImage = hit?.image || hit?.imageStart || '';
    if(libraryImage) return cleanPath(libraryImage);

    if(/press banca|press de banca|bench press/.test(n)) return 'press-banca.png';
    if(/press inclinado|incline press/.test(n)) return 'press-inclinado.png';
    if(/pull over|pullover/.test(n)) return 'pull-over.png';
    if(/remo|row/.test(n)) return 'remo.png';
    if(/sentadilla|squat/.test(n)) return 'sentadilla.png';

    return '';
  };

  const allSame = values => values.length > 0 && values.every(value => value === values[0]);

  function renderPremiumTraining(){
    const main = document.getElementById('client-main');
    if(!main) return;

    const id = typeof currentClientId !== 'undefined' ? currentClientId : null;
    if(!id || typeof data === 'undefined') return;

    const routine = Array.isArray(data.routines?.[id]) ? data.routines[id] : [];

    if(typeof window.trainingDayTab !== 'number' || window.trainingDayTab < 0 || window.trainingDayTab >= routine.length){
      window.trainingDayTab = 0;
    }

    const selectedDayIndex = window.trainingDayTab;
    const selectedDay = routine[selectedDayIndex] || null;
    const exercises = Array.isArray(selectedDay?.exercises) ? selectedDay.exercises : [];
    const dayMuscles = getDayMuscles(selectedDay);
    const muscleTitle = dayMuscles.length
      ? dayMuscles.map(item => item.label).join(' · ')
      : (selectedDay?.muscle || 'Entrenamiento');

    const muscleVisuals = dayMuscles.slice(0,2).map(item => `
      <div class="dct-muscle-visual">
        <img src="./${escHtml(item.image)}" alt="${escHtml(item.label)}">
      </div>
    `).join('');

    const dayTabs = routine.slice(0,7).map((day,index)=>`
      <button type="button" class="dct-day ${index===selectedDayIndex?'active':''}" data-day-index="${index}">
        <span>DÍA</span><strong>${index+1}</strong>
      </button>
    `).join('');

    const rows = exercises.map(exercise=>{
      const muscle = inferExerciseMuscle(exercise, dayMuscles);
      const image = exerciseImage(exercise);
      const sets = exercise?.sets ? `${escHtml(exercise.sets)} series` : '';
      const reps = exercise?.reps ? `${escHtml(exercise.reps)} repeticiones` : '';

      return `
        <div class="dct-exercise ${image?'':'dct-no-exercise-image'}">
          <div class="dct-exercise-visual">
            ${image ? `<img src="./${escHtml(image)}" alt="">` : ''}
          </div>
          <div class="dct-exercise-copy">
            <div class="dct-exercise-name">${escHtml(exercise?.name || 'Ejercicio')}</div>
            ${muscle ? `<span class="dct-muscle-badge">${escHtml(muscle.label.toUpperCase())}</span>` : ''}
            <div class="dct-exercise-meta">
              ${sets}${sets && reps ? '<span>•</span>' : ''}${reps}
            </div>
          </div>
        </div>
      `;
    }).join('');

    const setValues = exercises.map(ex => String(ex?.sets ?? '').trim()).filter(Boolean);
    const repValues = exercises.map(ex => String(ex?.reps ?? '').trim()).filter(Boolean);
    const summaryParts = [`${exercises.length} ${exercises.length===1?'ejercicio':'ejercicios'}`];
    if(exercises.length && setValues.length===exercises.length && allSame(setValues)) summaryParts.push(`${escHtml(setValues[0])} series c/u`);
    if(exercises.length && repValues.length===exercises.length && allSame(repValues)) summaryParts.push(`${escHtml(repValues[0])} repeticiones`);
    const routineSummary = summaryParts.join(' <span>•</span> ');

    const tip = typeof getTodayCoachTip === 'function'
      ? getTodayCoachTip(id)
      : 'La constancia convierte el esfuerzo en resultados.';

    main.innerHTML = `
      <style id="dcc-training-premium-v2">
        #client-main .dct-wrap{width:100%;max-width:820px;margin:0 auto;padding:3px 0 112px;color:#f7f5f0}
        #client-main .dct-eyebrow{margin:0 0 12px;color:#e0ad4c;font-size:11px;font-weight:850;letter-spacing:3px;text-transform:uppercase}
        #client-main .dct-days{display:grid;grid-template-columns:repeat(${Math.max(1,Math.min(routine.length,7))},minmax(0,1fr));gap:5px;margin:0 0 12px}
        #client-main .dct-day{height:54px;min-width:0;padding:0;border:1px solid rgba(255,255,255,.11);border-radius:14px;background:linear-gradient(145deg,#14181f,#0c1015);color:#858d99;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
        #client-main .dct-day span{font-size:7.5px;font-weight:850;letter-spacing:1.25px}
        #client-main .dct-day strong{font-size:18px;line-height:1;font-weight:760}
        #client-main .dct-day.active{border-color:#e3b447;background:radial-gradient(circle at 50% 0,rgba(240,201,107,.16),transparent 60%),linear-gradient(145deg,#241d10,#15130e);color:#f0c96b;box-shadow:0 0 17px rgba(217,170,74,.12),inset 0 1px 0 rgba(255,255,255,.04)}

        #client-main .dct-card{position:relative;margin:0 0 10px;border:1px solid rgba(217,170,74,.70);border-radius:19px;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.095),transparent 40%),linear-gradient(145deg,#171b21,#0b0f14 72%);box-shadow:0 12px 28px rgba(0,0,0,.23),inset 0 1px 0 rgba(255,255,255,.03);overflow:hidden}
        #client-main .dct-card-label{margin:0 0 7px;color:#e0ad4c;font-size:9px;font-weight:850;letter-spacing:2.5px;text-transform:uppercase}

        #client-main .dct-muscles{min-height:112px;display:grid;grid-template-columns:minmax(0,1fr) minmax(150px,.95fr);align-items:center;gap:12px;padding:13px 15px}
        #client-main .dct-muscles:after{content:"";position:absolute;width:160px;height:160px;right:-76px;top:-82px;border:1px solid rgba(217,170,74,.12);border-radius:50%;pointer-events:none}
        #client-main .dct-muscle-title{margin:0;color:#f8f7f3;font-size:22px;font-weight:780;line-height:1.08;letter-spacing:-.45px}
        #client-main .dct-muscle-line{width:30px;height:2px;margin:10px 0 0;border-radius:99px;background:#e0ad4c}
        #client-main .dct-muscle-visuals{position:relative;z-index:1;display:flex;align-items:center;justify-content:flex-end;gap:4px;min-width:0}
        #client-main .dct-muscle-visual{width:50%;max-width:92px;height:86px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden;border:1px solid rgba(217,170,74,.13);border-radius:13px;background:linear-gradient(145deg,rgba(255,255,255,.018),rgba(217,170,74,.018))}
        #client-main .dct-muscle-visual img{width:100%;height:100%;object-fit:contain;object-position:center bottom;display:block;filter:drop-shadow(0 7px 12px rgba(0,0,0,.28))}

        #client-main .dct-tip{min-height:68px;display:grid;grid-template-columns:38px minmax(0,1fr);align-items:center;gap:11px;padding:11px 14px}
        #client-main .dct-tip-icon{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.34);border-radius:11px;background:rgba(217,170,74,.065);color:#f0c96b;font-size:18px}
        #client-main .dct-tip-text{margin:0;color:#c1c7d0;font-size:11.5px;line-height:1.42}

        #client-main .dct-routine-card{margin-top:12px;padding:14px;border:1px solid rgba(217,170,74,.76);border-radius:20px;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.085),transparent 40%),linear-gradient(145deg,#15191f,#0a0e13 74%);box-shadow:0 13px 30px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.03)}
        #client-main .dct-routine-kicker{margin:0 0 11px;color:#e0ad4c;font-size:9px;font-weight:850;letter-spacing:2.5px;text-transform:uppercase}
        #client-main .dct-routine-summary{display:grid;grid-template-columns:52px minmax(0,1fr);align-items:center;gap:12px}
        #client-main .dct-routine-icon{width:52px;height:52px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.30);border-radius:14px;background:rgba(217,170,74,.05);color:#f0c96b}
        #client-main .dct-routine-icon svg{width:28px;height:28px}
        #client-main .dct-routine-title{margin:0;color:#f8f7f3;font-size:19px;font-weight:780;line-height:1.08;letter-spacing:-.3px}
        #client-main .dct-routine-meta{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin-top:7px;color:#969faa;font-size:11px;line-height:1.3}
        #client-main .dct-routine-meta span{color:#d9aa4a}
        #client-main .dct-routine-actions{position:relative;z-index:5;display:grid;grid-template-columns:minmax(0,1.55fr) minmax(128px,.9fr);gap:9px;margin-top:13px;pointer-events:auto}
        #client-main .dct-start{position:relative;z-index:6;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent;min-height:52px;padding:10px 13px;border:1px solid #f3cf6c;border-radius:15px;background:linear-gradient(135deg,#f0c45d,#dda93e 62%,#edc25b);color:#15110a;font-size:14px;font-weight:850;box-shadow:0 9px 24px rgba(217,170,74,.17),inset 0 1px 0 rgba(255,255,255,.28);display:flex;align-items:center;justify-content:center;gap:9px}
        #client-main .dct-start svg{width:18px;height:18px;fill:currentColor}
        #client-main .dct-view-exercises{position:relative;z-index:6;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent;min-height:52px;padding:10px 12px;border:1px solid rgba(224,173,76,.88);border-radius:15px;background:rgba(9,12,16,.68);color:#f7f5f0;font-size:13px;font-weight:760;display:flex;align-items:center;justify-content:center;gap:8px}
        #client-main .dct-view-chevron{width:9px;height:9px;border-right:2px solid #e0ad4c;border-bottom:2px solid #e0ad4c;transform:rotate(45deg) translateY(-2px);transition:transform .2s ease}
        #client-main .dct-routine-card.open .dct-view-chevron{transform:rotate(225deg) translate(-1px,-1px)}
        #client-main .dct-exercise-list{display:none;gap:8px;margin-top:13px;padding-top:13px;border-top:1px solid rgba(255,255,255,.07)}
        #client-main .dct-routine-card.open .dct-exercise-list{display:grid}

        #client-main .dct-exercise{min-height:80px;display:grid;grid-template-columns:58px minmax(0,1fr);align-items:center;gap:11px;padding:9px 10px;border:1px solid rgba(217,170,74,.42);border-radius:16px;background:linear-gradient(145deg,#12171d,#0a0e12 76%);box-shadow:0 7px 18px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.02)}
        #client-main .dct-exercise.dct-no-exercise-image{grid-template-columns:minmax(0,1fr)}
        #client-main .dct-exercise.dct-no-exercise-image .dct-exercise-visual{display:none}
        #client-main .dct-exercise-visual{width:58px;height:58px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid rgba(217,170,74,.22);border-radius:13px;background:rgba(217,170,74,.02)}
        #client-main .dct-exercise-visual img{width:100%;height:100%;object-fit:contain;display:block}
        #client-main .dct-exercise-copy{min-width:0}
        #client-main .dct-exercise-name{margin:0 0 6px;color:#f8f7f3;font-size:14px;font-weight:750;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        #client-main .dct-muscle-badge{display:inline-flex;align-items:center;min-height:21px;padding:0 9px;margin:0 0 6px;border:1px solid rgba(224,173,76,.72);border-radius:999px;color:#f0c96b;background:rgba(217,170,74,.025);font-size:7.5px;font-weight:850;letter-spacing:1.25px}
        #client-main .dct-exercise-meta{display:flex;align-items:center;gap:6px;color:#98a0ac;font-size:10px;line-height:1.25}
        #client-main .dct-exercise-meta span{color:#d9aa4a}
        #client-main .dct-empty{padding:20px 14px;text-align:center;color:#9098a4;font-size:12px;line-height:1.45;border:1px solid rgba(217,170,74,.28);border-radius:17px;background:linear-gradient(145deg,#14181e,#0c1015)}

        @media(max-width:390px){
          #client-main .dct-days{gap:4px}
          #client-main .dct-day{height:51px;border-radius:12px}
          #client-main .dct-day span{font-size:7px;letter-spacing:1px}
          #client-main .dct-day strong{font-size:17px}
          #client-main .dct-muscles{min-height:104px;grid-template-columns:minmax(0,1fr) minmax(132px,.92fr);gap:8px;padding:12px 13px}
          #client-main .dct-muscle-title{font-size:19px}
          #client-main .dct-muscle-visual{height:78px;border-radius:11px}
          #client-main .dct-tip{min-height:64px;padding:10px 12px}
          #client-main .dct-routine-card{padding:12px}
          #client-main .dct-routine-summary{grid-template-columns:46px minmax(0,1fr);gap:10px}
          #client-main .dct-routine-icon{width:46px;height:46px;border-radius:12px}
          #client-main .dct-routine-icon svg{width:25px;height:25px}
          #client-main .dct-routine-title{font-size:17px}
          #client-main .dct-routine-meta{font-size:10px}
          #client-main .dct-routine-actions{grid-template-columns:minmax(0,1.5fr) minmax(116px,.9fr);gap:7px}
          #client-main .dct-start,#client-main .dct-view-exercises{min-height:48px;font-size:12px}
          #client-main .dct-exercise{grid-template-columns:54px minmax(0,1fr);min-height:74px;gap:9px;padding:8px 9px}
          #client-main .dct-exercise.dct-no-exercise-image{grid-template-columns:minmax(0,1fr)}
          #client-main .dct-exercise-visual{width:54px;height:54px}
          #client-main .dct-exercise-name{font-size:13px}
          #client-main .dct-exercise-meta{font-size:9.5px}
        }
      </style>

      <div class="dct-wrap">
        <div class="dct-eyebrow">ENTRENAMIENTO</div>
        <div class="dct-days">${dayTabs}</div>

        ${selectedDay ? `
          <section class="dct-card dct-muscles">
            <div>
              <div class="dct-card-label">MÚSCULOS DE HOY</div>
              <h2 class="dct-muscle-title">${escHtml(muscleTitle)}</h2>
              <div class="dct-muscle-line"></div>
            </div>
            <div class="dct-muscle-visuals">${muscleVisuals}</div>
          </section>

          <section class="dct-card dct-tip">
            <div class="dct-tip-icon">✦</div>
            <div>
              <div class="dct-card-label" style="margin-bottom:4px">CONSEJO DE HOY</div>
              <p class="dct-tip-text">${escHtml(tip)}</p>
            </div>
          </section>

          ${exercises.length ? `
            <section class="dct-routine-card">
              <div class="dct-routine-kicker">EJERCICIOS</div>
              <div class="dct-routine-summary">
                <div class="dct-routine-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10M4 12H2M22 12h-2"/>
                  </svg>
                </div>
                <div>
                  <h3 class="dct-routine-title">${escHtml(muscleTitle)}</h3>
                  <div class="dct-routine-meta">${routineSummary}</div>
                </div>
              </div>

              <div class="dct-routine-actions">
                <button type="button" class="dct-start" data-day-index="${selectedDayIndex}">
                  <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5-10-6.5Z"/></svg>
                  <span>Empezar entrenamiento</span>
                </button>
                <button type="button" class="dct-view-exercises" aria-expanded="false">
                  <span class="dct-view-label">Ver ejercicios</span>
                  <span class="dct-view-chevron" aria-hidden="true"></span>
                </button>
              </div>

              <div class="dct-exercise-list">${rows}</div>
            </section>
          ` : '<div class="dct-empty">Todavía no tienes una rutina de entrenamiento programada.</div>'}
        ` : '<div class="dct-empty">Todavía no tienes una rutina de entrenamiento programada.</div>'}
      </div>
    `;

    main.querySelectorAll('.dct-day[data-day-index]').forEach(button => {
      button.addEventListener('click', function(event){
        event.preventDefault();
        const next = Number(this.dataset.dayIndex);
        if(Number.isFinite(next)){
          window.trainingDayTab = next;
          window.showClient('training');
        }
      });
    });

    const viewButton = main.querySelector('.dct-view-exercises');
    if(viewButton){
      viewButton.addEventListener('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        const card = this.closest('.dct-routine-card');
        if(!card) return;
        const open = card.classList.toggle('open');
        this.setAttribute('aria-expanded', String(open));
        const label = this.querySelector('.dct-view-label');
        if(label) label.textContent = open ? 'Ocultar ejercicios' : 'Ver ejercicios';
      });
    }

    const startButton = main.querySelector('.dct-start');
    if(startButton){
      startButton.addEventListener('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        const next = Number(this.dataset.dayIndex);
        const dayIndex = Number.isFinite(next) ? next : selectedDayIndex;
        let fn = null;
        if(typeof window.startWorkout === 'function') fn = window.startWorkout;
        if(!fn){
          try{ fn = (typeof startWorkout === 'function') ? startWorkout : null; }
          catch(_){ fn = null; }
        }
        if(typeof fn === 'function'){
          fn(dayIndex);
        }else{
          console.error('DCC: startWorkout no disponible desde training-premium-v2');
          if(typeof window.toast === 'function') window.toast('No se pudo iniciar el entrenamiento.');
        }
      });
    }
  }

  window.showClient = function(screen){
    const result = originalShowClient.apply(this, arguments);
    if(screen === 'training'){
      try{
        renderPremiumTraining();
      }catch(error){
        console.error('Error renderizando entrenamiento premium:', error);
      }
    }
    return result;
  };
})();