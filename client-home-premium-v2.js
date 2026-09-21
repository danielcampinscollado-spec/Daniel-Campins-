/* DCC — Inicio cliente premium v2 + tarjeta entrenamiento compartida */
(function(){
'use strict';
const BUILD='20260921-client-home-premium-v7-week-grid-hero';
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
const shortDayTitle=day=>{
  const parts=dayTitle(day).split(' · ').map(x=>x.trim()).filter(Boolean);
  const short=p=>{
    const clean=String(p||'').trim();
    if(clean.length<=5)return clean;
    return clean.slice(0,3)+(clean.length>3?'.':'');
  };
  return parts.slice(0,2).map(short).join(' · ');
};
const fmt=n=>Number(n).toFixed(1).replace('.',',');

function css(){
  const old=document.getElementById('dcc-home-premium-v2-css');
  if(old)old.remove();
  const s=document.createElement('style');
  s.id='dcc-home-premium-v2-css';
  s.textContent=`
  html.dcc-theme-light-premium body #client #client-main .dcc-home2,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2 *{box-sizing:border-box!important}

  html.dcc-theme-light-premium body #client #client-main .dcc-home2{
    width:100%!important;max-width:none!important;margin:0!important;padding:12px 0 116px!important;color:#17191d!important
  }

  /* HEADER */
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-top{
    display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
    gap:10px!important;align-items:start!important;margin:0 0 10px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-top.no-checkin{grid-template-columns:1fr!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-head{
    display:block!important;padding:2px 4px 0!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-kicker,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-label{
    color:#a66d0d!important;font-size:8.6px!important;line-height:1!important;font-weight:900!important;
    letter-spacing:2.8px!important;text-transform:uppercase!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-head h1{
    margin:8px 0 10px!important;color:#17191d!important;font-family:Georgia,"Times New Roman",serif!important;
    font-size:32px!important;line-height:.98!important;font-weight:500!important;letter-spacing:-1px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-line{
    width:42px!important;height:2px!important;border-radius:999px!important;background:#d3a03a!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-motto{
    margin-top:11px!important;color:#7f8793!important;font-size:6.8px!important;line-height:1.5!important;
    font-weight:700!important;letter-spacing:2.2px!important;text-transform:uppercase!important
  }

  /* CHECK-IN */
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin{
    display:grid!important;grid-template-columns:38px minmax(0,1fr) 12px!important;gap:8px!important;
    align-items:center!important;padding:10px!important;border:1px solid rgba(189,130,26,.22)!important;
    border-radius:17px!important;background:linear-gradient(145deg,#fffefa,#fbf6ed)!important;
    box-shadow:0 6px 16px rgba(80,58,25,.03)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin-icon,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-icon,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress-icon{
    width:38px!important;height:38px!important;display:grid!important;place-items:center!important;
    border:1px solid rgba(190,132,28,.20)!important;border-radius:12px!important;background:#fff8e8!important;color:#aa720f!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin-icon svg,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-icon svg,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress-icon svg{width:19px!important;height:19px!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin-copy,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-copy,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress-copy{
    min-width:0!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin h3{
    margin:4px 0 2px!important;color:#17191d!important;font-family:Georgia,"Times New Roman",serif!important;
    font-size:17px!important;line-height:1.03!important;font-weight:500!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin p{
    margin:0!important;color:#687181!important;font-size:9.6px!important;line-height:1.3!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin small{
    display:block!important;width:100%!important;margin-top:5px!important;padding-top:5px!important;
    border-top:1px solid rgba(110,81,32,.09)!important;color:#a16e15!important;font-size:6.4px!important;
    line-height:1.15!important;font-weight:850!important;letter-spacing:1.4px!important;text-transform:uppercase!important
  }

  /* TASKS */
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-card,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-week{
    width:100%!important;margin:0 0 10px!important;border:1px solid rgba(189,130,26,.22)!important;
    border-radius:18px!important;background:#fffdf8!important;box-shadow:0 6px 16px rgba(80,58,25,.03)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-card{overflow:hidden!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-card-head{
    min-height:43px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;
    padding:0 13px!important;border-bottom:1px solid rgba(126,93,37,.08)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-count{
    width:27px!important;height:27px!important;display:grid!important;place-items:center!important;
    border:1px solid rgba(190,132,28,.20)!important;border-radius:50%!important;background:#fff7e2!important;
    color:#96620b!important;font-size:11px!important;font-weight:900!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task{
    display:grid!important;grid-template-columns:38px minmax(0,1fr) 12px!important;gap:10px!important;
    align-items:center!important;min-height:69px!important;padding:10px 12px!important;border-bottom:1px solid rgba(126,93,37,.08)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task:last-child{border-bottom:0!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-copy .main{
    display:block!important;color:#17191d!important;font-family:Georgia,"Times New Roman",serif!important;
    font-size:16px!important;line-height:1.05!important;font-weight:500!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-copy .sub{
    display:block!important;margin-top:3px!important;color:#667083!important;font-size:9.8px!important;line-height:1.2!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-copy .status{
    display:block!important;margin-top:2px!important;color:#a18a63!important;font-size:8.7px!important;line-height:1.15!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-arrow{
    color:#b27a15!important;font-size:21px!important;line-height:1!important
  }

  /* PROGRESS */
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress{
    display:grid!important;grid-template-columns:38px minmax(0,1fr) 12px!important;gap:10px!important;
    align-items:center!important;min-height:80px!important;padding:10px 12px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress h3{
    margin:5px 0 3px!important;color:#17191d!important;font-family:Georgia,"Times New Roman",serif!important;
    font-size:17.5px!important;line-height:1.03!important;font-weight:500!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress p{
    margin:0!important;color:#707989!important;font-size:9.2px!important;line-height:1.3!important
  }

  /* WEEK: compact but readable, supports up to 7 days */
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-week{
    padding:11px 10px 12px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-week-head{
    display:flex!important;align-items:center!important;justify-content:space-between!important;
    gap:10px!important;margin-bottom:9px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-week-link{
    color:#a66d0d!important;font-size:7px!important;font-weight:850!important;letter-spacing:1.45px!important;
    text-transform:uppercase!important;white-space:nowrap!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-days{
    display:grid!important;gap:7px!important;width:100%!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-days[data-count="1"]{grid-template-columns:1fr!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-days[data-count="2"]{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-days[data-count="3"]{grid-template-columns:repeat(3,minmax(0,1fr))!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-days[data-count="4"],
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-days[data-count="5"],
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-days[data-count="6"],
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-days[data-count="7"]{
    grid-template-columns:repeat(4,minmax(0,1fr))!important
  }

  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day{
    min-width:0!important;min-height:74px!important;padding:9px 6px 8px!important;
    border:1px solid rgba(177,127,38,.17)!important;border-radius:13px!important;
    background:#fbf8f2!important;text-align:center!important;overflow:hidden!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day b{
    display:block!important;color:#17191d!important;font-size:11.5px!important;line-height:1!important;font-weight:850!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day .mini{display:none!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day .muscle{
    display:block!important;min-height:21px!important;margin-top:6px!important;color:#737b86!important;
    font-size:7.5px!important;line-height:1.15!important;overflow:hidden!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day .mini-muscle{display:none!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day em{
    display:inline-flex!important;align-items:center!important;justify-content:center!important;
    min-width:22px!important;height:20px!important;margin:6px auto 0!important;padding:0 6px!important;
    border-radius:999px!important;background:#f1ece2!important;color:#91794d!important;
    font-size:8px!important;line-height:1!important;font-style:normal!important;font-weight:850!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day.done{
    background:#f2f7e9!important;border-color:#c9ddb2!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day.done em{
    background:#77b858!important;color:#fff!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day.next{
    background:#fff9ed!important;border-color:#c89125!important;
    box-shadow:inset 0 0 0 1px rgba(200,145,37,.08)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day.next em{
    background:#f0c95e!important;color:#3c2a08!important
  }

  @media(max-width:430px){
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-days[data-count="4"],
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-days[data-count="5"],
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-days[data-count="6"],
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-days[data-count="7"]{
      grid-template-columns:repeat(4,minmax(0,1fr))!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-day{min-height:70px!important;padding:8px 4px 7px!important}
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-day b{font-size:10.5px!important}
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-day .full{display:none!important}
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-day .mini{display:inline!important}
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-day .full-muscle{display:none!important}
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-day .mini-muscle{
      display:block!important;font-size:6.8px!important;line-height:1.1!important
    }
  }

  /* TOP PREMIUM NEXT WORKOUT */
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero{
    position:relative!important;min-height:112px!important;display:grid!important;
    grid-template-columns:minmax(0,1fr) 112px!important;align-items:center!important;gap:10px!important;
    padding:13px 14px!important;overflow:hidden!important;
    border:1px solid rgba(183,123,19,.34)!important;border-radius:19px!important;
    background:#15130f!important;box-shadow:0 10px 24px rgba(49,34,11,.10)!important;color:#fff!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero:before{
    content:''!important;position:absolute!important;inset:0!important;z-index:0!important;
    background:url('./assets/training-reference-disk-user.webp?v=20260920-userdisk1') right center/cover no-repeat!important;
    filter:brightness(1.12) contrast(1.05) saturate(1.05)!important;transform:scale(1.01)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero:after{
    content:''!important;position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;
    background:
      radial-gradient(circle at 80% 42%,rgba(240,194,91,.13),transparent 28%),
      linear-gradient(90deg,rgba(15,13,9,.97) 0%,rgba(15,13,9,.87) 32%,rgba(15,13,9,.56) 52%,rgba(15,13,9,.18) 72%,rgba(15,13,9,0) 100%)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero>*{position:relative!important;z-index:2!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-next-copy{
    min-width:0!important;align-self:center!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-eyebrow{
    margin:0 0 7px!important;color:#e6b950!important;font-size:7.4px!important;
    line-height:1!important;font-weight:900!important;letter-spacing:2.15px!important;text-transform:uppercase!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-title{
    margin:0 0 7px!important;color:#fff!important;font-family:Georgia,"Times New Roman",serif!important;
    font-size:22px!important;line-height:1!important;font-weight:500!important;letter-spacing:-.3px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-meta{
    color:#ebe5dc!important;font-size:9.8px!important;line-height:1.15!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero-actions{
    display:flex!important;align-items:center!important;justify-content:stretch!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero .hero-btn{
    width:100%!important;min-width:0!important;min-height:42px!important;padding:0 9px!important;
    border:1px solid #e2ae41!important;border-radius:14px!important;
    background:linear-gradient(135deg,#f7d46f 0%,#e9b94d 48%,#d99b2c 100%)!important;
    color:#20170a!important;font-size:9.8px!important;font-weight:900!important;white-space:nowrap!important;
    box-shadow:0 8px 18px rgba(213,153,40,.18),inset 0 1px 0 rgba(255,255,255,.58)!important
  }

  /* TRAINING: compact premium card, without touching the bottom nav */
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero{
    position:relative!important;min-height:124px!important;height:auto!important;margin-bottom:10px!important;
    padding:13px 14px!important;overflow:hidden!important;
    border:1px solid rgba(183,123,19,.34)!important;border-radius:19px!important;
    background:#15130f!important;box-shadow:0 10px 24px rgba(49,34,11,.10)!important;color:#fff!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero:before{
    content:''!important;position:absolute!important;inset:0!important;z-index:0!important;
    background:url('./assets/training-reference-disk-user.webp?v=20260920-userdisk1') right center/cover no-repeat!important;
    filter:brightness(1.10) contrast(1.04) saturate(1.04)!important;transform:scale(1.01)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero:after{
    content:''!important;position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;
    background:
      radial-gradient(circle at 80% 42%,rgba(240,194,91,.12),transparent 29%),
      linear-gradient(90deg,rgba(15,13,9,.97) 0%,rgba(15,13,9,.88) 33%,rgba(15,13,9,.58) 54%,rgba(15,13,9,.16) 76%,rgba(15,13,9,0) 100%)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero>*{position:relative!important;z-index:2!important}
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-plate,
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-plate-fade{display:none!important}
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-label{
    margin:0 0 7px!important;color:#e6b950!important;font-size:7.4px!important;line-height:1!important;
    font-weight:900!important;letter-spacing:2.1px!important;text-transform:uppercase!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero h3{
    max-width:72%!important;margin:0 0 6px!important;color:#fff!important;
    font-family:Georgia,"Times New Roman",serif!important;font-size:22px!important;line-height:1!important;
    font-weight:500!important;letter-spacing:-.3px!important;white-space:normal!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-meta{
    margin:0!important;color:#ebe5dc!important;background:transparent!important;border:0!important;padding:0!important;
    font-size:9.8px!important;line-height:1.15!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-actions{
    display:grid!important;grid-template-columns:minmax(0,1.45fr) minmax(112px,.9fr)!important;
    gap:8px!important;width:100%!important;max-width:none!important;margin-top:12px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-start,
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-view{
    min-height:40px!important;height:40px!important;padding:0 10px!important;border-radius:13px!important;
    font-size:10px!important;font-weight:850!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-start:disabled{
    background:linear-gradient(145deg,#fffdf9,#f2eadc)!important;color:#847d72!important;border-color:#e6d7ba!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-view{
    background:linear-gradient(145deg,#171c24,#0d1117)!important;color:#fff!important;border-color:rgba(255,255,255,.12)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-list{
    margin-top:11px!important;padding-top:10px!important;background:#fffdf8!important;color:#17191d!important;border-radius:13px!important
  }

  @media(max-width:430px){
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-top{
      grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-head h1{font-size:31px!important}

  }
  `;
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
    text:`Día ${next.index+1} · ${next.title}`,
    subtext:accessText(next.access),
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
    const shortState=done?'✓':(isNext?(next.access.code==='today-complete'?'Mañ.':next.access.allowed?'Hoy':'Sig.'):'•');
    return `<div class="dcc-home2-day ${done?'done':''} ${isNext?'next':''}" title="${esc(dayTitle(day))}"><b><span class="full">Día ${i+1}</span><span class="mini">D${i+1}</span></b><span class="muscle full-muscle">${esc(dayTitle(day))}</span><span class="muscle mini-muscle">${esc(shortDayTitle(day))}</span><em title="${esc(state)}">${shortState}</em></div>`;
  }).join('');

  const taskRows=tasks.slice(0,4).map(t=>`<div class="dcc-home2-task" onclick="${t.action}"><div class="dcc-home2-task-icon">${icon(t.type)}</div><div class="dcc-home2-task-copy"><span class="main">${esc(t.title)}</span><span class="sub">${esc(t.text)}</span>${t.subtext?`<span class="status">${esc(t.subtext)}</span>`:''}</div><div class="dcc-home2-arrow">›</div></div>`).join('');

  const hero=next.day?`<section class="dcc-next-hero"><div class="dcc-next-copy"><div class="dcc-next-eyebrow">TU PRÓXIMO ENTRENAMIENTO</div><h2 class="dcc-next-title">${esc(next.title)}</h2><div class="dcc-next-meta">Día ${next.index+1} · ${esc(accessText(next.access))}</div></div><div class="dcc-next-hero-actions"><button type="button" class="hero-btn" onclick="showClient('training')">Ver rutina&nbsp; →</button></div></section>`:'';

  main.innerHTML=`
  <div class="dcc-home2">
    <div class="dcc-home2-top ${checkinSummary?'':'no-checkin'}">
      <header class="dcc-home2-head"><div><div class="dcc-home2-kicker">BIENVENIDO</div><h1>${esc(c.name||'Cliente')}</h1><div class="dcc-home2-line"></div><div class="dcc-home2-motto">DISCIPLINA HOY,<br>RESULTADOS SIEMPRE</div></div></header>
      ${checkinSummary?`<section class="dcc-home2-checkin" onclick="showClient('progress')"><div class="dcc-home2-checkin-icon">${icon('chart')}</div><div class="dcc-home2-checkin-copy"><div class="dcc-home2-label">TU ÚLTIMO CHECK-IN</div><h3>${esc(checkinSummary.title)}</h3><p>${esc(checkinSummary.text)}</p><small>${esc(checkinSummary.foot)}</small></div><div class="dcc-home2-arrow">›</div></section>`:''}
    </div>
    <section class="dcc-home2-card"><div class="dcc-home2-card-head"><div class="dcc-home2-label">TAREAS PENDIENTES</div><div class="dcc-home2-count">${tasks.length}</div></div>${taskRows||'<div class="dcc-home2-task"><div></div><div><h3>Todo al día</h3><p>No tienes tareas pendientes ahora mismo.</p></div><div></div></div>'}</section>
    <section class="dcc-home2-progress" onclick="showClient('progress')"><div class="dcc-home2-progress-icon">${icon('chart')}</div><div class="dcc-home2-progress-copy"><div class="dcc-home2-label">TU PROGRESO</div><h3>Sigue dando lo mejor de ti</h3><p>Cada entrenamiento, cada comida y cada hábito te acerca a tu mejor versión.</p></div><div class="dcc-home2-arrow">›</div></section>
    ${r.length?`<section class="dcc-home2-week"><div class="dcc-home2-week-head"><div class="dcc-home2-label">TU PLAN DE ESTA SEMANA</div><div class="dcc-home2-week-link" onclick="showClient('training')">VER PLAN SEMANAL ›</div></div><div class="dcc-home2-days" data-count="${Math.min(r.length,7)}">${days}</div></section>`:''}
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
  const next=nextState();
  const access=typeof window.dccGetTrainingAccessState==='function'
    ?window.dccGetTrainingAccessState(id(),i)
    :{allowed:true,code:'ready'};

  if(label){
    label.textContent=access?.code==='already-completed'
      ?'ENTRENAMIENTO COMPLETADO'
      :(i===next.index?'TU PRÓXIMO ENTRENAMIENTO':'ENTRENAMIENTO');
  }
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