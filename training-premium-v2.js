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

  const exerciseImage = (exercise, muscle) => {
    const n = normalize(exercise?.name);
    if(/press banca|press de banca|bench press/.test(n)) return 'press-banca.png';
    if(/press inclinado|incline press/.test(n)) return 'press-inclinado.png';
    if(/pull over|pullover/.test(n)) return 'pull-over.png';
    if(/remo|row/.test(n)) return 'remo.png';
    if(/sentadilla|squat/.test(n)) return 'sentadilla.png';
    return muscle?.image || '';
  };

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
      <button type="button" class="dct-day ${index===selectedDayIndex?'active':''}" onclick="window.trainingDayTab=${index};showClient('training');">
        <span>DÍA</span><strong>${index+1}</strong>
      </button>
    `).join('');

    const rows = exercises.map((exercise,index)=>{
      const muscle = inferExerciseMuscle(exercise, dayMuscles);
      const image = exerciseImage(exercise, muscle);
      const sets = exercise?.sets ? `${escHtml(exercise.sets)} series` : '';
      const reps = exercise?.reps ? `${escHtml(exercise.reps)} repeticiones` : '';

      return `
        <div class="dct-exercise ${index>=4?'dct-extra':''}">
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

    const viewAll = exercises.length > 4 ? `
      <button type="button" class="dct-view-all" onclick="
        const section=this.closest('.dct-exercise-section');
        const list=section.querySelector('.dct-exercise-list');
        const open=list.classList.toggle('expanded');
        this.classList.toggle('expanded',open);
        this.querySelector('.dct-view-label').textContent=open?'Ver menos':'Ver todos';
      ">
        <span class="dct-view-label">Ver todos</span><span class="dct-view-chevron">⌄</span>
      </button>
    ` : '';

    const tip = typeof getTodayCoachTip === 'function'
      ? getTodayCoachTip(id)
      : 'La constancia convierte el esfuerzo en resultados.';

    main.innerHTML = `
      <style id="dcc-training-premium-v2">
        #client-main .dct-wrap{width:100%;max-width:820px;margin:0 auto;padding:4px 0 112px;color:#f7f5f0}
        #client-main .dct-eyebrow{margin:0 0 14px;color:#e0ad4c;font-size:11px;font-weight:850;letter-spacing:3px;text-transform:uppercase}
        #client-main .dct-days{display:grid;grid-template-columns:repeat(${Math.max(1,Math.min(routine.length,7))},minmax(0,1fr));gap:6px;margin:0 0 14px}
        #client-main .dct-day{height:58px;min-width:0;padding:0;border:1px solid rgba(255,255,255,.11);border-radius:14px;background:linear-gradient(145deg,#14181f,#0c1015);color:#858d99;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
        #client-main .dct-day span{font-size:8px;font-weight:850;letter-spacing:1.35px}
        #client-main .dct-day strong{font-size:19px;line-height:1;font-weight:760}
        #client-main .dct-day.active{border-color:#e3b447;background:radial-gradient(circle at 50% 0,rgba(240,201,107,.16),transparent 60%),linear-gradient(145deg,#241d10,#15130e);color:#f0c96b;box-shadow:0 0 18px rgba(217,170,74,.13),inset 0 1px 0 rgba(255,255,255,.04)}
        #client-main .dct-card{position:relative;margin:0 0 12px;border:1px solid rgba(217,170,74,.72);border-radius:20px;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.11),transparent 40%),linear-gradient(145deg,#171b21,#0b0f14 72%);box-shadow:0 14px 34px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.035);overflow:hidden}
        #client-main .dct-muscles{min-height:142px;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(132px,.85fr);align-items:center;gap:10px;padding:18px 18px 16px}
        #client-main .dct-muscles:after{content:"";position:absolute;width:190px;height:190px;right:-90px;top:-95px;border:1px solid rgba(217,170,74,.14);border-radius:50%;pointer-events:none}
        #client-main .dct-card-label{margin:0 0 9px;color:#e0ad4c;font-size:9px;font-weight:850;letter-spacing:2.5px;text-transform:uppercase}
        #client-main .dct-muscle-title{margin:0;color:#f8f7f3;font-size:24px;font-weight:780;line-height:1.08;letter-spacing:-.55px}
        #client-main .dct-muscle-line{width:34px;height:2px;margin:12px 0 10px;border-radius:99px;background:#e0ad4c}
        #client-main .dct-muscle-sub{margin:0;color:#98a0ac;font-size:12px;line-height:1.45}
        #client-main .dct-muscle-visuals{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:flex-end;gap:5px;min-width:0}
        #client-main .dct-muscle-visual{width:50%;max-width:102px;aspect-ratio:.78;display:flex;align-items:flex-end;justify-content:center;overflow:hidden;border-radius:13px;background:linear-gradient(145deg,rgba(255,255,255,.02),rgba(217,170,74,.025))}
        #client-main .dct-muscle-visual img{width:100%;height:100%;object-fit:contain;object-position:center bottom;display:block;filter:drop-shadow(0 8px 14px rgba(0,0,0,.32))}
        #client-main .dct-tip{min-height:78px;display:grid;grid-template-columns:42px minmax(0,1fr);align-items:center;gap:12px;padding:14px 16px}
        #client-main .dct-tip-icon{width:42px;height:42px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.36);border-radius:12px;background:rgba(217,170,74,.07);color:#f0c96b;font-size:20px}
        #client-main .dct-tip-text{margin:0;color:#c1c7d0;font-size:12px;line-height:1.45}
        #client-main .dct-exercise-section{margin-top:17px}
        #client-main .dct-exercise-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 2px 8px}
        #client-main .dct-exercise-head-left{color:#aeb5bf;font-size:9px;font-weight:850;letter-spacing:2.4px;text-transform:uppercase}
        #client-main .dct-exercise-head-right{display:flex;align-items:center;gap:10px;color:#8f97a3;font-size:10px}
        #client-main .dct-view-all{min-height:34px;padding:0 12px;border:1px solid rgba(217,170,74,.70);border-radius:999px;background:rgba(217,170,74,.045);color:#f0c96b;font-size:10px;font-weight:800;display:flex;align-items:center;gap:7px}
        #client-main .dct-view-chevron{font-size:15px;line-height:1;transition:transform .2s ease}
        #client-main .dct-view-all.expanded .dct-view-chevron{transform:rotate(180deg)}
        #client-main .dct-exercise-list:not(.expanded) .dct-extra{display:none}
        #client-main .dct-exercise-list{display:grid;gap:8px}
        #client-main .dct-exercise{min-height:88px;display:grid;grid-template-columns:66px minmax(0,1fr);align-items:center;gap:13px;padding:10px 12px;border:1px solid rgba(217,170,74,.70);border-radius:18px;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.085),transparent 38%),linear-gradient(145deg,#15191f,#0b0f14 74%);box-shadow:0 10px 25px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.025)}
        #client-main .dct-exercise-visual{width:66px;height:66px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid rgba(217,170,74,.25);border-radius:14px;background:rgba(217,170,74,.025)}
        #client-main .dct-exercise-visual img{width:100%;height:100%;object-fit:contain;display:block}
        #client-main .dct-exercise-copy{min-width:0}
        #client-main .dct-exercise-name{margin:0 0 7px;color:#f8f7f3;font-size:16px;font-weight:750;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        #client-main .dct-muscle-badge{display:inline-flex;align-items:center;min-height:24px;padding:0 11px;margin:0 0 7px;border:1px solid rgba(224,173,76,.82);border-radius:999px;color:#f0c96b;background:rgba(217,170,74,.035);font-size:8.5px;font-weight:850;letter-spacing:1.4px}
        #client-main .dct-exercise-meta{display:flex;align-items:center;gap:7px;color:#98a0ac;font-size:11px;line-height:1.25}
        #client-main .dct-exercise-meta span{color:#d9aa4a}
        #client-main .dct-start{width:100%;min-height:58px;margin-top:13px;padding:12px 16px;border:1px solid #f2cb6a;border-radius:17px;background:linear-gradient(135deg,#f0c45d,#dda93e 62%,#edc25b);color:#15110a;font-size:16px;font-weight:850;box-shadow:0 10px 28px rgba(217,170,74,.18),inset 0 1px 0 rgba(255,255,255,.30)}
        #client-main .dct-start span{margin-left:10px;font-size:23px;vertical-align:-2px}
        #client-main .dct-empty{padding:22px 16px;text-align:center;color:#9098a4;font-size:13px;line-height:1.45;border:1px solid rgba(217,170,74,.28);border-radius:18px;background:linear-gradient(145deg,#14181e,#0c1015)}
        @media(max-width:390px){#client-main .dct-days{gap:4px}#client-main .dct-day{height:54px;border-radius:12px}#client-main .dct-day span{font-size:7px;letter-spacing:1px}#client-main .dct-day strong{font-size:17px}#client-main .dct-muscles{min-height:130px;grid-template-columns:minmax(0,1.1fr) minmax(118px,.9fr);padding:15px}#client-main .dct-muscle-title{font-size:21px}#client-main .dct-muscle-sub{font-size:11px}#client-main .dct-exercise{grid-template-columns:58px minmax(0,1fr);gap:11px;min-height:80px;padding:9px 10px}#client-main .dct-exercise-visual{width:58px;height:58px}#client-main .dct-exercise-name{font-size:14px}#client-main .dct-exercise-meta{font-size:10px}}
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
              <p class="dct-muscle-sub">Enfoca tu esfuerzo y cuida la técnica en cada repetición.</p>
            </div>
            <div class="dct-muscle-visuals">${muscleVisuals}</div>
          </section>

          <section class="dct-card dct-tip">
            <div class="dct-tip-icon">✦</div>
            <div>
              <div class="dct-card-label" style="margin-bottom:5px">CONSEJO DE HOY</div>
              <p class="dct-tip-text">${escHtml(tip)}</p>
            </div>
          </section>

          <section class="dct-exercise-section">
            <div class="dct-exercise-head">
              <div class="dct-exercise-head-left">EJERCICIOS</div>
              <div class="dct-exercise-head-right">
                <span>${exercises.length} ${exercises.length===1?'ejercicio':'ejercicios'}</span>${viewAll}
              </div>
            </div>

            ${exercises.length ? `
              <div class="dct-exercise-list">${rows}</div>
              <button type="button" class="dct-start" onclick="startWorkout(${selectedDayIndex})">Empezar entrenamiento <span>→</span></button>
            ` : '<div class="dct-empty">Todavía no tienes una rutina de entrenamiento programada.</div>'}
          </section>
        ` : '<div class="dct-empty">Todavía no tienes una rutina de entrenamiento programada.</div>'}
      </div>
    `;
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
