/* DCC — Inicio cliente premium v2 + tarjeta entrenamiento compartida */
(function(){
'use strict';
const BUILD='20260921-client-home-premium-v2-nextfix';
if(window.__dccClientHomePremium===BUILD)return;
window.__dccClientHomePremium=BUILD;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const d=()=>{try{return typeof data!=='undefined'?data:(window.data||{})}catch(_){return window.data||{}}};
const id=()=>String(window.currentClientId||'');
const client=()=> (d().clients||[]).find(c=>String(c.id)===id())||{};
const routine=()=>{const r=d().routines?.[id()];return Array.isArray(r)?r:[]};
const dayTitle=day=>{
  const list=Array.isArray(day?.muscleGroups)?day.muscleGroups.map(x=>String(x||'').trim()).filter(Boolean):[];
  return list.length?list.join(' · '):(String(day?.muscle||'Entrenamiento').replace(/^Sin grupos musculares$/i,'Entrenamiento'));
};
const fmt=n=>Number(n).toFixed(1).replace('.',',');

function css(){
  if(document.getElementById('dcc-home-premium-v2-css'))return;
  const s=document.createElement('style');s.id='dcc-home-premium-v2-css';
  s.textContent=`
  #client-main .dcc-home2{max-width:820px;margin:0 auto;padding:0 0 116px;color:#17191d}
  #client-main .dcc-home2-head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding:5px 3px 12px}
  #client-main .dcc-home2-kicker,#client-main .dcc-home2-label{color:#a66d0d;font-size:10px;font-weight:900;letter-spacing:3px;text-transform:uppercase}
  #client-main .dcc-home2-head h1{margin:8px 0 8px;font-family:Georgia,"Times New Roman",serif;font-size:32px;line-height:1;font-weight:520;letter-spacing:-.9px}
  #client-main .dcc-home2-line{width:42px;height:2px;border-radius:5px;background:#d6a13a}
  #client-main .dcc-home2-motto{max-width:150px;padding-top:9px;color:#7c8490;font-size:8px;line-height:1.55;font-weight:700;letter-spacing:2.6px;text-transform:uppercase}

  #client-main .dcc-home2-checkin{display:grid;grid-template-columns:46px minmax(0,1fr) 18px;gap:12px;align-items:center;margin:0 0 11px;padding:13px 14px;border:1px solid rgba(189,130,26,.26);border-radius:18px;background:linear-gradient(145deg,#fffefa,#faf5eb);box-shadow:0 8px 22px rgba(80,58,25,.045)}
  #client-main .dcc-home2-checkin-icon,#client-main .dcc-home2-task-icon,#client-main .dcc-home2-progress-icon{width:46px;height:46px;display:grid;place-items:center;border:1px solid rgba(190,132,28,.22);border-radius:14px;background:#fff7e5;color:#ac7410}
  #client-main .dcc-home2-checkin-icon svg,#client-main .dcc-home2-task-icon svg,#client-main .dcc-home2-progress-icon svg{width:24px;height:24px}
  #client-main .dcc-home2-checkin h3{margin:3px 0 3px;font-family:Georgia,"Times New Roman",serif;font-size:22px;font-weight:520;line-height:1}
  #client-main .dcc-home2-checkin p{margin:0;color:#687181;font-size:13px;line-height:1.35}
  #client-main .dcc-home2-checkin small{display:block;margin-top:7px;padding-top:7px;border-top:1px solid rgba(110,81,32,.10);color:#a16e15;font-size:8px;font-weight:850;letter-spacing:2px;text-transform:uppercase}
  #client-main .dcc-home2-arrow{color:#b27a15;font-size:25px;line-height:1}

  #client-main .dcc-home2-card{margin:0 0 11px;overflow:hidden;border:1px solid rgba(189,130,26,.24);border-radius:18px;background:#fffdf8;box-shadow:0 8px 22px rgba(80,58,25,.04)}
  #client-main .dcc-home2-card-head{min-height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;border-bottom:1px solid rgba(126,93,37,.10)}
  #client-main .dcc-home2-count{width:31px;height:31px;display:grid;place-items:center;border:1px solid rgba(190,132,28,.24);border-radius:50%;background:#fff7e2;color:#96620b;font-size:13px;font-weight:900}
  #client-main .dcc-home2-task{display:grid;grid-template-columns:46px minmax(0,1fr) 18px;gap:12px;align-items:center;padding:12px 14px;border-bottom:1px solid rgba(126,93,37,.09);cursor:pointer}
  #client-main .dcc-home2-task:last-child{border-bottom:0}
  #client-main .dcc-home2-task h3{margin:0 0 3px;font-family:Georgia,"Times New Roman",serif;font-size:17px;font-weight:520}
  #client-main .dcc-home2-task p{margin:0;color:#7a828e;font-size:11px;line-height:1.35}

  #client-main .dcc-home2-progress{display:grid;grid-template-columns:46px minmax(0,1fr) 18px;gap:12px;align-items:center;margin:0 0 11px;padding:14px;border:1px solid rgba(189,130,26,.24);border-radius:18px;background:#fffdf8;cursor:pointer}
  #client-main .dcc-home2-progress h3{margin:5px 0 4px;font-family:Georgia,"Times New Roman",serif;font-size:21px;font-weight:520}
  #client-main .dcc-home2-progress p{margin:0;color:#727b88;font-size:11px;line-height:1.45}

  #client-main .dcc-home2-week{margin:0 0 11px;padding:13px;border:1px solid rgba(189,130,26,.24);border-radius:18px;background:#fffdf8}
  #client-main .dcc-home2-week-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
  #client-main .dcc-home2-week-link{color:#a66d0d;font-size:8px;font-weight:850;letter-spacing:2px;text-transform:uppercase}
  #client-main .dcc-home2-days{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px}
  #client-main .dcc-home2-day{min-height:88px;padding:10px 8px;border:1px solid rgba(177,127,38,.18);border-radius:14px;background:#fbf8f2;text-align:center}
  #client-main .dcc-home2-day b{display:block;font-size:13px}.dcc-home2-day span{display:block;margin-top:6px;color:#737b86;font-size:10px;line-height:1.25}
  #client-main .dcc-home2-day em{display:block;margin-top:7px;color:#99835c;font-size:9px;font-style:normal}
  #client-main .dcc-home2-day.done{background:#f2f7e9;border-color:#cfe0b5}.dcc-home2-day.done em{color:#4c8a37;font-weight:800}
  #client-main .dcc-home2-day.next{background:#fffaf0;border-color:#c89125;box-shadow:inset 0 0 0 1px rgba(200,145,37,.12)}

  #client-main .dcc-next-hero{position:relative;min-height:158px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:12px;padding:18px 18px;overflow:hidden;border:1px solid rgba(183,123,19,.40);border-radius:20px;background:#1b1914;box-shadow:0 12px 30px rgba(55,39,13,.12);color:#fff}
  #client-main .dcc-next-hero:before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,17,14,.94) 0%,rgba(18,17,14,.72) 45%,rgba(18,17,14,.15) 100%),url('./assets/training-reference-disk-user.webp?v=20260920-userdisk1') center right/cover no-repeat}
  #client-main .dcc-next-hero>*{position:relative;z-index:1}
  #client-main .dcc-next-hero .eyebrow{color:#e7bb55;font-size:9px;font-weight:900;letter-spacing:2.7px;text-transform:uppercase}
  #client-main .dcc-next-hero h2{margin:8px 0 5px;color:#fff;font-family:Georgia,"Times New Roman",serif;font-size:29px;line-height:1;font-weight:520}
  #client-main .dcc-next-hero .day{color:#f1eee7;font-size:13px}.dcc-next-hero .status{margin-top:8px;color:#ddd7ca;font-size:11px}
  #client-main .dcc-next-hero .hero-btn{min-width:126px;min-height:48px;padding:0 15px;border:1px solid #e0ac40;border-radius:15px;background:linear-gradient(135deg,#f4d06d,#dda63c);color:#21180a;font-size:12px;font-weight:900}
  #client-main .dcc-next-hero .hero-btn[disabled]{opacity:.58;filter:grayscale(.15)}
  #client-main .dcc-next-hero .hero-secondary{min-height:44px;padding:0 13px;border:1px solid rgba(241,199,103,.55);border-radius:14px;background:rgba(15,18,23,.86);color:#fff;font-size:11px;font-weight:850}
  #client-main .dcc-next-hero-actions{display:flex;flex-direction:column;gap:8px;align-items:stretch}

  #client-main .dct3-routine.dcc-training-hero{min-height:165px!important;padding:18px!important;border-radius:20px!important;background:#1b1914!important;color:#fff!important}
  #client-main .dct3-routine.dcc-training-hero:before{content:'';position:absolute!important;inset:0!important;z-index:0!important;background:linear-gradient(90deg,rgba(18,17,14,.94) 0%,rgba(18,17,14,.68) 47%,rgba(18,17,14,.12) 100%),url('./assets/training-reference-disk-user.webp?v=20260920-userdisk1') center right/cover no-repeat!important}
  #client-main .dct3-routine.dcc-training-hero>*{position:relative!important;z-index:1!important}
  #client-main .dct3-routine.dcc-training-hero .dct3-plate,#client-main .dct3-routine.dcc-training-hero .dct3-plate-fade{display:none!important}
  #client-main .dct3-routine.dcc-training-hero .dct3-label{color:#e7bb55!important}
  #client-main .dct3-routine.dcc-training-hero h3{max-width:62%;margin:8px 0 5px!important;color:#fff!important;font-family:Georgia,"Times New Roman",serif!important;font-size:28px!important;font-weight:520!important}
  #client-main .dct3-routine.dcc-training-hero .dct3-meta{color:#e4ded2!important;font-size:11px!important}
  #client-main .dct3-routine.dcc-training-hero .dct3-actions{margin-top:14px!important;justify-content:flex-start!important}
  #client-main .dct3-routine.dcc-training-hero .dct3-start{background:linear-gradient(135deg,#f4d06d,#dda63c)!important;color:#21180a!important;border-color:#e0ac40!important}
  #client-main .dct3-routine.dcc-training-hero .dct3-view{background:rgba(13,17,23,.86)!important;color:#fff!important;border-color:rgba(241,199,103,.40)!important}
  #client-main .dct3-routine.dcc-training-hero .dct3-list{margin-top:13px!important;background:#fffdf8!important;color:#17191d!important;border-radius:14px!important}

  @media(max-width:430px){
    #client-main .dcc-home2-head{gap:12px}.dcc-home2-motto{max-width:118px!important;font-size:7px!important}
    #client-main .dcc-home2-head h1{font-size:30px}
    #client-main .dcc-next-hero{min-height:148px;grid-template-columns:1fr;padding:16px}
    #client-main .dcc-next-hero h2{font-size:25px}.dcc-next-hero-actions{flex-direction:row!important}
    #client-main .dcc-next-hero .hero-btn,#client-main .dcc-next-hero .hero-secondary{flex:1;min-width:0}
    #client-main .dct3-routine.dcc-training-hero h3{max-width:75%;font-size:25px!important}
  }`;
  document.head.appendChild(s);
}

function lastCheckinSummary(){
  const arr=(d().checkinHistory?.[id()]||[]).slice().sort((a,b)=>new Date(a.sentAt||0)-new Date(b.sentAt||0));
  if(!arr.length)return null;

  const latest=arr[arr.length-1];
  const prev=arr.length>1?arr[arr.length-2]:null;
  const c=client();

  const latestW=Number.isFinite(Number(latest.weight))?Number(latest.weight):null;
  const latestF=Number.isFinite(Number(latest.bodyFat))?Number(latest.bodyFat):null;
  const baseW=prev&&Number.isFinite(Number(prev.weight))?Number(prev.weight):(Number.isFinite(Number(c.initial))?Number(c.initial):null);
  const baseF=prev&&Number.isFinite(Number(prev.bodyFat))?Number(prev.bodyFat):(Number.isFinite(Number(c.bodyFatInitial))?Number(c.bodyFatInitial):null);

  const dw=latestW!=null&&baseW!=null?latestW-baseW:null;
  const df=latestF!=null&&baseF!=null?latestF-baseF:null;

  const improved=[];
  const worsened=[];
  if(dw!=null&&Math.abs(dw)>=0.05)(dw<0?improved:worsened).push(`${fmt(Math.abs(dw))} kg`);
  if(df!=null&&Math.abs(df)>=0.05)(df<0?improved:worsened).push(`${fmt(Math.abs(df))} % de grasa`);

  if(improved.length&&worsened.length){
    return {title:'Seguimos avanzando',text:`Has mejorado ${improved.join(' y ')}, aunque ha subido ${worsened.join(' y ')}.`,foot:'AJUSTA Y SIGUE, CADA SEMANA CUENTA'};
  }
  if(improved.length){
    return {title:'¡Enhorabuena!',text:`Has bajado ${improved.join(' y ')}.`,foot:'SIGUE ASÍ, VAS POR BUEN CAMINO'};
  }
  if(worsened.length){
    return {title:'Toca apretar un poco más',text:`Has subido ${worsened.join(' y ')} desde el último check-in.`,foot:'CONSTANCIA HOY, RESULTADOS MAÑANA'};
  }
  return {title:'Te mantienes estable',text:'No hay cambios relevantes respecto al último registro.',foot:'SIGUE CUMPLIENDO EL PLAN'};
}

function nextState(){
  const r=routine();
  if(!r.length)return {index:0,day:null,access:{allowed:false,code:'no-routine'},title:''};
  const index=typeof window.dccGetTrainingNextDayIndex==='function'?window.dccGetTrainingNextDayIndex(id(),r.length):0;
  const day=r[index]||r[0];
  const access=typeof window.dccGetTrainingAccessState==='function'?window.dccGetTrainingAccessState(id(),index):{allowed:true,code:'ready'};
  return {index,day,access,title:dayTitle(day)};
}

function accessText(access){
  if(access?.code==='today-complete')return 'Disponible mañana';
  if(access?.code==='week-complete')return 'Disponible el próximo lunes';
  if(access?.code==='already-completed')return 'Completado esta semana';
  if(access?.code==='sequence-required')return 'Sigue el orden de tu plan';
  return access?.allowed?'Disponible hoy':'Próximamente';
}

function icon(type){
  if(type==='check')return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>';
  if(type==='chart')return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 18v-5M11 18V9M16 18V5"/></svg>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 10v4M7 8v8M17 8v8M20 10v4M7 12h10M4 12H2M22 12h-2"/></svg>';
}

function renderHome(){
  css();
  const main=document.getElementById('client-main');
  if(!main||!id())return;

  const c=client();
  const r=routine();
  const next=nextState();
  const checkinSummary=lastCheckinSummary();
  const currentWeek=typeof getCurrentWeekKey==='function'?getCurrentWeekKey():'';
  const checkin=d().checkins?.[id()]||{};
  const weekStart=currentWeek?new Date(currentWeek+'T00:00:00'):null;
  const sentThisWeek=!!(checkin.sentAt&&weekStart&&new Date(checkin.sentAt)>=weekStart);

  const tasks=[];
  if(next.day)tasks.push({
    type:'training',title:'Siguiente entrenamiento',
    text:`Día ${next.index+1} · ${next.title} · ${accessText(next.access)}`,
    action:"showClient('training')"
  });
  if(!sentThisWeek)tasks.push({type:'check',title:'Check-in semanal pendiente',text:'Completa el seguimiento de esta semana',action:"showClient('checkin')"});

  const ns=d().notificationState?.[id()]||{};
  const diet=d().diets?.[id()]||{};
  const dietUpdated=diet?.training?.updated_at||diet?.rest?.updated_at||null;
  if(dietUpdated&&(!ns.dietSeenAt||new Date(dietUpdated)>new Date(ns.dietSeenAt))){
    tasks.push({type:'check',title:'Nueva alimentación',text:'Tu entrenador ha actualizado tu alimentación',action:"showClient('food')"});
  }

  const days=r.map((day,i)=>{
    const done=typeof window.isTrainingDayCompleted==='function'?window.isTrainingDayCompleted(id(),i):false;
    const isNext=i===next.index;
    const state=done?'Completado':(isNext?(next.access.code==='today-complete'?'Mañana':next.access.allowed?'Hoy':'Próximo'):'Pendiente');
    return `<div class="dcc-home2-day ${done?'done':''} ${isNext?'next':''}"><b>Día ${i+1}</b><span>${esc(dayTitle(day))}</span><em>${done?'✓ ':''}${esc(state)}</em></div>`;
  }).join('');

  const taskRows=tasks.slice(0,4).map(t=>`<div class="dcc-home2-task" onclick="${t.action}"><div class="dcc-home2-task-icon">${icon(t.type)}</div><div><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div><div class="dcc-home2-arrow">›</div></div>`).join('');

  const hero=next.day?`<section class="dcc-next-hero"><div><div class="eyebrow">TU PRÓXIMO ENTRENAMIENTO</div><h2>${esc(next.title)}</h2><div class="day">Día ${next.index+1}</div><div class="status">${esc(accessText(next.access))}</div></div><div class="dcc-next-hero-actions"><button type="button" class="hero-btn" onclick="showClient('training')">Ver rutina&nbsp; →</button></div></section>`:'';

  main.innerHTML=`
  <div class="dcc-home2">
    <header class="dcc-home2-head"><div><div class="dcc-home2-kicker">BIENVENIDO</div><h1>${esc(c.name||'Cliente')}</h1><div class="dcc-home2-line"></div></div><div class="dcc-home2-motto">DISCIPLINA HOY,<br>RESULTADOS SIEMPRE</div></header>
    ${checkinSummary?`<section class="dcc-home2-checkin" onclick="showClient('progress')"><div class="dcc-home2-checkin-icon">${icon('chart')}</div><div><div class="dcc-home2-label">TU ÚLTIMO CHECK-IN</div><h3>${esc(checkinSummary.title)}</h3><p>${esc(checkinSummary.text)}</p><small>${esc(checkinSummary.foot)}</small></div><div class="dcc-home2-arrow">›</div></section>`:''}
    <section class="dcc-home2-card"><div class="dcc-home2-card-head"><div class="dcc-home2-label">TAREAS PENDIENTES</div><div class="dcc-home2-count">${tasks.length}</div></div>${taskRows||'<div class="dcc-home2-task"><div></div><div><h3>Todo al día</h3><p>No tienes tareas pendientes ahora mismo.</p></div><div></div></div>'}</section>
    <section class="dcc-home2-progress" onclick="showClient('progress')"><div class="dcc-home2-progress-icon">${icon('chart')}</div><div><div class="dcc-home2-label">TU PROGRESO</div><h3>Sigue dando lo mejor de ti</h3><p>Cada entrenamiento, cada comida y cada hábito te acerca a tu mejor versión.</p></div><div class="dcc-home2-arrow">›</div></section>
    ${r.length?`<section class="dcc-home2-week"><div class="dcc-home2-week-head"><div class="dcc-home2-label">TU PLAN DE ESTA SEMANA</div><div class="dcc-home2-week-link" onclick="showClient('training')">VER PLAN SEMANAL ›</div></div><div class="dcc-home2-days">${days}</div></section>`:''}
    ${hero}
  </div>`;
}

function enhanceTraining(){
  css();
  const main=document.getElementById('client-main');
  const card=main?.querySelector('.dct3-routine');
  if(!card)return;
  card.classList.add('dcc-training-hero');
  const label=card.querySelector('.dct3-label');
  const title=card.querySelector('h3');
  const meta=card.querySelector('.dct3-meta');
  const r=routine();
  const i=Number(window.trainingDayTab)||0;
  const day=r[i]||null;
  const access=typeof window.dccGetTrainingAccessState==='function'?window.dccGetTrainingAccessState(id(),i):{allowed:true,code:'ready'};
  if(label)label.textContent='TU PRÓXIMO ENTRENAMIENTO';
  if(title&&day)title.textContent=dayTitle(day);
  if(meta)meta.textContent=`Día ${i+1} · ${accessText(access)}`;
}

function install(){
  css();
  const current=window.showClient;
  if(typeof current!=='function'||current.__dccHomePremiumV2)return false;
  const wrapped=function(screen){
    const previous=window.currentScreen;
    if(screen==='training'&&previous!=='training'&&!window.__dccManualTrainingDaySelection){
      const r=routine();
      if(r.length&&typeof window.dccGetTrainingNextDayIndex==='function'){
        window.trainingDayTab=window.dccGetTrainingNextDayIndex(id(),r.length);
      }
    }
    window.__dccManualTrainingDaySelection=false;
    const result=current.apply(this,arguments);
    if(screen==='home')requestAnimationFrame(renderHome);
    if(screen==='training')requestAnimationFrame(()=>requestAnimationFrame(enhanceTraining));
    return result;
  };
  wrapped.__dccHomePremiumV2=true;
  wrapped.__base=current;
  window.showClient=wrapped;

  if(window.currentScreen==='home')requestAnimationFrame(renderHome);
  if(window.currentScreen==='training')requestAnimationFrame(enhanceTraining);
  return true;
}

if(!install()){
  document.addEventListener('DOMContentLoaded',install,{once:true});
  setTimeout(install,180);
}
window.addEventListener('pageshow',()=>setTimeout(install,20));
})();