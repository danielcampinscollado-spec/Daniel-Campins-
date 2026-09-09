from pathlib import Path

p = Path('index.html')
s = p.read_text()

home_pos = s.index('if(screen==="home"){')
start_marker = '  /* =====================================================\n     HTML\n  ====================================================== */'
start = s.index(start_marker, home_pos)
end = s.index('  main.innerHTML = html;', start)

new_section = r'''  /* =====================================================
     HTML — INICIO CLIENTE PREMIUM
  ====================================================== */

  html = `

  <style id="dcc-client-home-reference">
    #client-main .dch-wrap{width:100%;max-width:820px;margin:0 auto;padding:0 0 22px;box-sizing:border-box;color:#f7f5f0}
    #client-main .dch-logo-row{position:relative;min-height:92px;display:flex;align-items:center;justify-content:center;margin:-10px 0 8px}
    #client-main .dch-logo-row img{display:block;width:122px;height:auto;max-height:86px;object-fit:contain}
    #client-main .dch-profile{position:absolute;right:2px;top:16px;width:44px;height:44px;display:grid;place-items:center;padding:0;border:1px solid rgba(217,170,74,.62);border-radius:50%;background:linear-gradient(145deg,#14171c,#090b0e);color:#f0c96b;box-shadow:0 0 18px rgba(217,170,74,.08)}
    #client-main .dch-profile svg{width:22px;height:22px}
    #client-main .dch-welcome{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin:0 0 18px;padding:0 2px}
    #client-main .dch-eyebrow{margin:0 0 6px;color:#e0ad4c;font-size:11px;font-weight:800;letter-spacing:2.8px}
    #client-main .dch-name{margin:0!important;color:#f8f7f3!important;font-size:36px!important;line-height:1!important;font-weight:760!important;letter-spacing:-1.25px!important;white-space:nowrap}
    #client-main .dch-motto{max-width:116px;padding-bottom:2px;color:#777f8a;font-size:8px;line-height:1.55;letter-spacing:2.6px;text-align:right;text-transform:uppercase}
    #client-main .dch-stats{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin:0 0 12px!important;background:none!important;box-shadow:none!important;border:0!important;border-radius:0!important}
    #client-main .dch-stat{position:relative;min-height:112px;display:grid;grid-template-columns:46px minmax(0,1fr) 16px;align-items:center;gap:10px;padding:13px 11px;box-sizing:border-box;border:1px solid rgba(217,170,74,.55)!important;border-radius:20px!important;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.10),transparent 38%),linear-gradient(145deg,#171b21 0%,#0e1217 58%,#090c10 100%)!important;box-shadow:0 13px 30px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.035)!important;overflow:hidden;cursor:pointer}
    #client-main .dch-iconbox{width:46px;height:46px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.48);border-radius:13px;background:linear-gradient(145deg,rgba(217,170,74,.11),rgba(217,170,74,.025));color:#f0c96b;box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 0 18px rgba(217,170,74,.06)}
    #client-main .dch-iconbox svg{width:25px;height:25px}
    #client-main .dch-percent{font-size:25px;font-weight:800;line-height:1;color:#f0c96b}
    #client-main .dch-stat-label{margin-bottom:6px;color:#aab1bb;font-size:9px;line-height:1.2;letter-spacing:2px;text-transform:uppercase;white-space:nowrap}
    #client-main .dch-stat-value{color:#f8f7f3;font-size:28px;line-height:1;font-weight:780;letter-spacing:-1px;white-space:nowrap}
    #client-main .dch-stat-value span{color:#aab1bb;font-size:15px;font-weight:520;letter-spacing:0}
    #client-main .dch-chevron{color:#838c98;font-size:30px;line-height:1;font-weight:250}
    #client-main .dch-card{position:relative;width:100%;box-sizing:border-box;margin:0 0 12px;border:1px solid rgba(217,170,74,.55)!important;border-radius:20px!important;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.10),transparent 38%),linear-gradient(145deg,#171b21 0%,#0e1217 58%,#090c10 100%)!important;box-shadow:0 13px 30px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.035)!important;overflow:hidden}
    #client-main .dch-task-row{width:100%;min-height:92px;display:grid;grid-template-columns:50px minmax(0,1fr) 28px;align-items:center;gap:12px;padding:14px 15px;border:0;border-top:1px solid rgba(255,255,255,.075);background:transparent!important;color:#f7f5f0;text-align:left}
    #client-main .dch-task-row:first-of-type{border-top:0}
    #client-main .dch-task-label,#client-main .dch-progress-label,#client-main .dch-next-label{margin:0 0 6px;color:#e0ad4c;font-size:9px;font-weight:800;line-height:1.1;letter-spacing:2.3px;text-transform:uppercase}
    #client-main .dch-task-title{color:#f8f7f3;font-size:17px;font-weight:720;line-height:1.18}
    #client-main .dch-arrow{color:#e0ad4c;font-size:28px;line-height:1;text-align:right}
    #client-main .dch-progress{min-height:112px;display:grid;grid-template-columns:50px minmax(0,1fr) 20px;align-items:center;gap:12px;padding:15px;cursor:pointer}
    #client-main .dch-progress-label{color:#42c89a}
    #client-main .dch-progress-title{margin:0;color:#f8f7f3;font-size:18px;font-weight:740;line-height:1.15}
    #client-main .dch-progress-sub{margin:6px 0 0;color:#8f97a3;font-size:11px;line-height:1.35}
    #client-main .dch-next{min-height:124px;padding:16px;background-image:linear-gradient(90deg,#0b0f13 0%,rgba(11,15,19,.98) 34%,rgba(11,15,19,.76) 54%,rgba(11,15,19,.23) 76%,rgba(11,15,19,.02) 100%),url('./assets/next-workout-plate.jpg')!important;background-size:cover!important;background-position:center right!important;background-repeat:no-repeat!important}
    #client-main .dch-next-content{position:relative;z-index:2;min-height:90px;display:grid;grid-template-columns:50px minmax(0,1fr);gap:12px;align-items:center;padding-right:130px}
    #client-main .dch-next-name{color:#f8f7f3;font-size:20px;font-weight:770;line-height:1.1;letter-spacing:-.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #client-main .dch-next-day{margin-top:5px;color:#a0a7b1;font-size:12px}
    #client-main .dch-routine-btn{position:absolute;right:14px;bottom:14px;z-index:3;min-width:118px;min-height:44px;padding:9px 13px;border:1px solid #e0ad4c!important;border-radius:14px!important;background:rgba(10,12,13,.70)!important;color:#f0c96b!important;font-size:13px;font-weight:800;box-shadow:0 0 18px rgba(217,170,74,.12)}
    #client-main .dch-slogan{display:flex;align-items:center;justify-content:center;gap:14px;min-height:42px;margin:0 0 3px;color:#e0ad4c;font-size:8px;font-weight:750;line-height:1.45;letter-spacing:2.5px;text-align:center;text-transform:uppercase}
    #client-main .dch-slogan:before,#client-main .dch-slogan:after{content:"";width:42px;height:1px;background:linear-gradient(90deg,transparent,#e0ad4c)}
    #client-main .dch-slogan:after{background:linear-gradient(90deg,#e0ad4c,transparent)}
    @media(max-width:390px){#client-main .dch-logo-row{min-height:82px;margin-top:-12px}#client-main .dch-logo-row img{width:108px;max-height:78px}#client-main .dch-profile{width:40px;height:40px;top:15px}#client-main .dch-name{font-size:31px!important}#client-main .dch-motto{font-size:7px;letter-spacing:2px;max-width:94px}#client-main .dch-stats{gap:8px!important}#client-main .dch-stat{min-height:104px;grid-template-columns:42px minmax(0,1fr) 12px;gap:8px;padding:11px 8px}#client-main .dch-iconbox{width:42px;height:42px}#client-main .dch-stat-value{font-size:25px}#client-main .dch-stat-value span{font-size:13px}#client-main .dch-stat-label{font-size:8px;letter-spacing:1.5px}#client-main .dch-next-content{padding-right:112px}#client-main .dch-routine-btn{min-width:104px;font-size:12px;padding:8px 10px}#client-main .dch-next-name{font-size:18px}}
  </style>

  <div class="dch-wrap">
    <div class="dch-logo-row">
      <img src="./dc-stride-logo.svg.svg" alt="DC Stride">
      <button class="dch-profile" type="button" onclick="showClient('profile')" aria-label="Perfil"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6"/></svg></button>
    </div>

    <div class="dch-welcome"><div><div class="dch-eyebrow">BIENVENIDO</div><h1 class="dch-name">${esc(c.name)}</h1></div><div class="dch-motto">DISCIPLINA<br>HOY,<br>RESULTADOS<br>SIEMPRE</div></div>

    <section class="dch-stats">
      <div class="dch-stat" onclick="showClient('progress')"><div class="dch-iconbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5" y="6" width="14" height="13" rx="3"/><path d="M9 9.5c1.9-1.5 4.1-1.5 6 0"/><path d="M12 9.5v3"/></svg></div><div><div class="dch-stat-label">PESO ACTUAL</div><div class="dch-stat-value">${currentWeight > 0 ? money(currentWeight) : "—"}<span> kg</span></div></div><div class="dch-chevron">›</div></div>
      <div class="dch-stat" onclick="showClient('progress')"><div class="dch-iconbox"><div class="dch-percent">%</div></div><div><div class="dch-stat-label">% DE GRASA ACTUAL</div><div class="dch-stat-value">${currentBodyFat !== null && Number.isFinite(currentBodyFat) ? money(currentBodyFat) : "—"}${currentBodyFat !== null && Number.isFinite(currentBodyFat) ? '<span> %</span>' : ''}</div></div><div class="dch-chevron">›</div></div>
    </section>

    <section class="dch-card">
      ${tasks.length ? tasks.map(task => `<button type="button" class="dch-task-row" onclick="${task.action}"><span class="dch-iconbox">${task.action.includes("training") ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10M4 12H2M22 12h-2"/></svg>` : task.action.includes("food") ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 3v7M4.5 3v5.5A2.5 2.5 0 0 0 7 11a2.5 2.5 0 0 0 2.5-2.5V3M7 11v10M16 3v18M16 3c3 1.5 3 5 0 7"/></svg>` : task.action.includes("checkin") ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="m8 12 2.5 2.5L16 9"/></svg>` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-4-.9L4 20l1.4-3.4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/></svg>`}</span><span><span class="dch-task-label">TAREAS PENDIENTES</span><span class="dch-task-title">${task.title}</span></span><span class="dch-arrow">→</span></button>`).join("") : `<div class="dch-task-row" style="border-top:0"><span class="dch-iconbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m7 12 3 3 7-7"/></svg></span><span><span class="dch-task-label">TAREAS PENDIENTES</span><span class="dch-task-title">Todo al día</span></span><span></span></div>`}
    </section>

    <section class="dch-card dch-progress" onclick="showClient('progress')"><div class="dch-iconbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 18v-5M11 18V9M16 18V5"/></svg></div><div><div class="dch-progress-label">PROGRESO DE FUERZA</div>${strengthRows.length ? `<div class="dch-progress-title">Has mejorado en ${strengthRows.length} ${strengthRows.length === 1 ? "ejercicio" : "ejercicios"}</div><div class="dch-progress-sub">Tu rendimiento está avanzando. Consulta el detalle en Progreso.</div>` : `<div class="dch-progress-title">Sigue dándolo todo</div><div class="dch-progress-sub">Todavía no hay mejoras registradas. Cada entrenamiento te acerca a tu mejor versión.</div>`}</div><div class="dch-chevron">›</div></section>

    ${nextWorkout ? `<section class="dch-card dch-next"><div class="dch-next-content"><div class="dch-iconbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M4 9h16"/><circle cx="12" cy="14" r="2"/></svg></div><div><div class="dch-next-label">TU PRÓXIMO ENTRENAMIENTO</div><div class="dch-next-name">${esc(nextWorkout.muscle || "Entrenamiento")}</div><div class="dch-next-day">Día ${weeklyWorkouts + 1}</div></div></div><button type="button" class="dch-routine-btn" onclick="showClient('training')">Ver rutina&nbsp; →</button></section>` : ''}

    <div class="dch-slogan"><span>UNA VERSIÓN MÁS FUERTE<br>DE TI, CADA DÍA</span></div>
  </div>
  `;

'''

s = s[:start] + new_section + s[end:]
p.write_text(s)
