/* DCC — Inicio cliente premium v2 + tarjeta entrenamiento compartida */
(function(){
'use strict';
const BUILD='20260921-client-home-premium-v4-prototype-tight';
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
  const old=document.getElementById('dcc-home-premium-v2-css');
  if(old)old.remove();
  const s=document.createElement('style');s.id='dcc-home-premium-v2-css';
  s.textContent=`
  html.dcc-theme-light-premium body #client #client-main .dcc-home2{
    max-width:820px!important;margin:0 auto!important;
    padding:18px 0 116px!important;color:#17191d!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-head{
    display:flex!important;justify-content:space-between!important;align-items:flex-start!important;
    gap:18px!important;padding:0 2px 14px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-kicker,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-label{
    color:#a66d0d!important;font-size:10px!important;font-weight:900!important;
    letter-spacing:3px!important;text-transform:uppercase!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-head h1{
    margin:8px 0 10px!important;color:#17191d!important;
    font-family:Georgia,"Times New Roman",serif!important;font-size:34px!important;
    line-height:1!important;font-weight:500!important;letter-spacing:-1px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-line{
    width:42px!important;height:2px!important;border-radius:5px!important;background:#d6a13a!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-motto{
    max-width:220px!important;padding-top:16px!important;color:#7c8490!important;
    font-size:8px!important;line-height:1.6!important;font-weight:700!important;
    letter-spacing:2.5px!important;text-transform:uppercase!important
  }

  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin{
    display:grid!important;grid-template-columns:46px minmax(0,1fr) 18px!important;gap:12px!important;
    align-items:center!important;margin:0 0 11px!important;padding:13px 14px!important;
    border:1px solid rgba(189,130,26,.26)!important;border-radius:18px!important;
    background:linear-gradient(145deg,#fffefa,#faf5eb)!important;
    box-shadow:0 8px 22px rgba(80,58,25,.045)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin-icon,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-icon,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress-icon{
    width:46px!important;height:46px!important;display:grid!important;place-items:center!important;
    border:1px solid rgba(190,132,28,.22)!important;border-radius:14px!important;
    background:#fff7e5!important;color:#ac7410!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin-icon svg,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-icon svg,
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress-icon svg{width:24px!important;height:24px!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin h3{
    margin:4px 0 3px!important;color:#17191d!important;
    font-family:Georgia,"Times New Roman",serif!important;font-size:21px!important;
    line-height:1.05!important;font-weight:500!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin p{
    margin:0!important;color:#687181!important;font-size:12px!important;line-height:1.4!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-checkin small{
    display:block!important;margin-top:7px!important;padding-top:7px!important;
    border-top:1px solid rgba(110,81,32,.10)!important;color:#a16e15!important;
    font-size:8px!important;font-weight:850!important;letter-spacing:2px!important;text-transform:uppercase!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-arrow{color:#b27a15!important;font-size:25px!important;line-height:1!important}

  html.dcc-theme-light-premium body #client #client-main .dcc-home2-card{
    margin:0 0 11px!important;overflow:hidden!important;border:1px solid rgba(189,130,26,.24)!important;
    border-radius:18px!important;background:#fffdf8!important;box-shadow:0 8px 22px rgba(80,58,25,.04)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-card-head{
    min-height:50px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;
    padding:0 14px!important;border-bottom:1px solid rgba(126,93,37,.10)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-count{
    width:31px!important;height:31px!important;display:grid!important;place-items:center!important;
    border:1px solid rgba(190,132,28,.24)!important;border-radius:50%!important;
    background:#fff7e2!important;color:#96620b!important;font-size:13px!important;font-weight:900!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task{
    display:grid!important;grid-template-columns:46px minmax(0,1fr) 18px!important;gap:12px!important;
    align-items:center!important;min-height:88px!important;padding:12px 14px!important;
    border-bottom:1px solid rgba(126,93,37,.09)!important;cursor:pointer!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task:last-child{border-bottom:0!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task h3{
    margin:0 0 4px!important;color:#17191d!important;
    font-family:Georgia,"Times New Roman",serif!important;font-size:19px!important;
    line-height:1.05!important;font-weight:500!important;letter-spacing:-.2px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task p{
    margin:0!important;color:#737c8b!important;font-size:11.5px!important;line-height:1.35!important
  }

  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress{
    display:grid!important;grid-template-columns:46px minmax(0,1fr) 18px!important;gap:12px!important;
    align-items:center!important;min-height:112px!important;margin:0 0 11px!important;padding:14px!important;
    border:1px solid rgba(189,130,26,.24)!important;border-radius:18px!important;background:#fffdf8!important;
    box-shadow:0 8px 22px rgba(80,58,25,.035)!important;cursor:pointer!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress h3{
    margin:5px 0 4px!important;color:#17191d!important;
    font-family:Georgia,"Times New Roman",serif!important;font-size:22px!important;
    line-height:1.05!important;font-weight:500!important;letter-spacing:-.25px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress p{
    margin:0!important;color:#707989!important;font-size:11.5px!important;line-height:1.45!important
  }

  html.dcc-theme-light-premium body #client #client-main .dcc-home2-week{
    margin:0 0 11px!important;padding:13px!important;border:1px solid rgba(189,130,26,.24)!important;
    border-radius:18px!important;background:#fffdf8!important;box-shadow:0 8px 22px rgba(80,58,25,.03)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-week-head{
    display:flex!important;align-items:center!important;justify-content:space-between!important;margin-bottom:10px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-week-link{
    color:#a66d0d!important;font-size:8px!important;font-weight:850!important;letter-spacing:2px!important;text-transform:uppercase!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-days{
    display:grid!important;grid-template-columns:repeat(auto-fit,minmax(120px,1fr))!important;gap:8px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day{
    min-height:98px!important;padding:11px 8px!important;border:1px solid rgba(177,127,38,.18)!important;
    border-radius:14px!important;background:#fbf8f2!important;text-align:center!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day b{
    display:block!important;color:#17191d!important;font-size:14px!important;font-weight:800!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day span{
    display:block!important;margin-top:6px!important;color:#737b86!important;font-size:10.5px!important;line-height:1.25!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day em{
    display:block!important;margin-top:8px!important;color:#99835c!important;font-size:9.5px!important;font-style:normal!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day.done{background:#f2f7e9!important;border-color:#cfe0b5!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day.done em{color:#4c8a37!important;font-weight:800!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day.next{
    background:#fffaf0!important;border-color:#c89125!important;box-shadow:inset 0 0 0 1px rgba(200,145,37,.12)!important
  }

  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero{
    position:relative!important;min-height:142px!important;display:grid!important;
    grid-template-columns:minmax(0,1fr) 122px!important;align-items:end!important;gap:12px!important;
    padding:16px 16px!important;overflow:hidden!important;border:1px solid rgba(183,123,19,.40)!important;
    border-radius:19px!important;background:#17150f!important;box-shadow:0 10px 24px rgba(55,39,13,.10)!important;color:#fff!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero:before{
    content:''!important;position:absolute!important;inset:0!important;
    background:linear-gradient(90deg,rgba(18,17,14,.94) 0%,rgba(18,17,14,.76) 44%,rgba(18,17,14,.12) 100%),
    url('./assets/training-reference-disk-user.webp?v=20260920-userdisk1') center right/cover no-repeat!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero>*{position:relative!important;z-index:1!important}
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero .dcc-next-eyebrow{
    color:#e7bb55!important;font-size:8.5px!important;font-weight:900!important;letter-spacing:2.6px!important;text-transform:uppercase!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero .dcc-next-title{
    margin:8px 0 5px!important;color:#fff!important;
    font-family:Georgia,"Times New Roman",serif!important;font-size:27px!important;
    line-height:1!important;font-weight:500!important;letter-spacing:-.35px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-dayline{
    color:#f1eee7!important;font-size:12.5px!important;line-height:1.2!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-status{
    margin-top:7px!important;color:#ddd7ca!important;background:transparent!important;border:0!important;
    padding:0!important;font-size:10.5px!important;line-height:1.2!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero-actions{
    display:flex!important;flex-direction:column!important;gap:8px!important;align-items:stretch!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero .hero-btn{
    width:100%!important;min-width:0!important;min-height:44px!important;padding:0 12px!important;
    border:1px solid #e0ac40!important;border-radius:14px!important;
    background:linear-gradient(135deg,#f4d06d,#dda63c)!important;color:#21180a!important;
    font-size:11px!important;font-weight:900!important;white-space:nowrap!important
  }

  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero{
    min-height:0!important;height:auto!important;margin-bottom:10px!important;padding:14px 16px!important;
    border-radius:19px!important;background:#17150f!important;color:#fff!important;overflow:hidden!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero:before{
    content:''!important;position:absolute!important;inset:0!important;z-index:0!important;
    background:linear-gradient(90deg,rgba(18,17,14,.95) 0%,rgba(18,17,14,.77) 45%,rgba(18,17,14,.11) 100%),
    url('./assets/training-reference-disk-user.webp?v=20260920-userdisk1') center right/cover no-repeat!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero>*{position:relative!important;z-index:1!important}
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-plate,
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-plate-fade{display:none!important}
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-label{
    margin-bottom:6px!important;color:#e7bb55!important;font-size:8.5px!important;letter-spacing:2.5px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero h3{
    max-width:70%!important;margin:0!important;color:#fff!important;
    font-family:Georgia,"Times New Roman",serif!important;font-size:22px!important;
    line-height:1.05!important;font-weight:500!important;letter-spacing:-.25px!important;white-space:normal!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-meta{
    margin-top:6px!important;color:#eee9df!important;background:transparent!important;
    border:0!important;padding:0!important;font-size:10.5px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-actions{
    display:grid!important;grid-template-columns:minmax(0,1.55fr) minmax(116px,.95fr)!important;
    gap:8px!important;width:100%!important;max-width:none!important;margin-top:13px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-start,
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-view{
    min-height:42px!important;height:42px!important;padding:0 10px!important;border-radius:13px!important;
    font-size:10.5px!important;font-weight:850!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-start:disabled{
    background:linear-gradient(145deg,#fffdf9,#f3ece0)!important;color:#847d72!important;border-color:#e7d8bc!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-view{
    background:linear-gradient(145deg,#1a1e26,#0d1117)!important;color:#fff!important;border-color:rgba(255,255,255,.12)!important
  }
  html.dcc-theme-light-premium body #client #client-main .dct3-routine.dcc-training-hero .dct3-list{
    margin-top:11px!important;padding-top:10px!important;background:#fffdf8!important;color:#17191d!important;border-radius:13px!important
  }

  /* Ajuste exacto al prototipo aprobado */
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-top{
    display:grid!important;
    grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr)!important;
    gap:14px!important;
    align-items:start!important;
    margin-bottom:12px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-top.no-checkin{
    grid-template-columns:1fr!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-top .dcc-home2-head{
    margin:0!important;padding:5px 2px 0!important;min-height:132px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-top .dcc-home2-checkin{
    height:100%!important;min-height:132px!important;margin:0!important;padding:12px 13px!important;
    grid-template-columns:44px minmax(0,1fr) 16px!important;gap:10px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-top .dcc-home2-checkin h3{
    font-size:19px!important;margin:4px 0 2px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-top .dcc-home2-checkin p{
    font-size:11px!important;line-height:1.35!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-top .dcc-home2-checkin small{
    font-size:7px!important;letter-spacing:1.7px!important;margin-top:6px!important;padding-top:6px!important
  }

  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-copy .main{
    display:block!important;color:#17191d!important;
    font-family:Georgia,"Times New Roman",serif!important;
    font-size:18px!important;line-height:1.08!important;font-weight:500!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-copy .sub{
    display:block!important;margin-top:4px!important;color:#737c8b!important;
    font-size:11.5px!important;line-height:1.3!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-copy .status{
    display:block!important;margin-top:3px!important;color:#8c8477!important;
    font-size:10px!important;line-height:1.2!important
  }

  html.dcc-theme-light-premium body #client #client-main .dcc-home2-card{
    border-radius:19px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-card-head{
    min-height:51px!important;padding:0 15px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-task{
    min-height:91px!important;padding:13px 15px!important
  }

  html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress{
    min-height:118px!important;padding:15px!important
  }

  html.dcc-theme-light-premium body #client #client-main .dcc-home2-week{
    padding:14px!important;border-radius:19px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-week-head{
    margin-bottom:11px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-days{
    grid-template-columns:repeat(auto-fit,minmax(132px,1fr))!important;gap:9px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-home2-day{
    min-height:101px!important;padding:12px 9px!important
  }

  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero{
    min-height:150px!important;
    grid-template-columns:minmax(0,1fr) 128px!important;
    align-items:end!important;
    padding:17px 18px!important;
    border-radius:20px!important;
    margin-bottom:8px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero .dcc-next-title{
    font-size:29px!important;margin:8px 0 6px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-dayline{
    font-size:13px!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-motivation{
    display:block!important;margin-top:8px!important;color:#e3ded4!important;
    font-size:10.5px!important;line-height:1.25!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-status{
    display:none!important
  }
  html.dcc-theme-light-premium body #client #client-main .dcc-next-hero .hero-btn{
    min-height:46px!important;font-size:11.5px!important
  }

  @media(max-width:430px){
    html.dcc-theme-light-premium body #client #client-main .dcc-home2{
      padding-top:12px!important;
      padding-bottom:190px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-top{
      grid-template-columns:minmax(0,.94fr) minmax(0,1.06fr)!important;
      gap:8px!important;margin-bottom:10px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-top.no-checkin{
      grid-template-columns:1fr!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-top .dcc-home2-head{
      min-height:116px!important;padding:4px 2px 0!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-head h1{
      font-size:29px!important;letter-spacing:-.8px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-motto{
      max-width:104px!important;font-size:6.7px!important;letter-spacing:2px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-top .dcc-home2-checkin{
      min-height:116px!important;padding:10px!important;
      grid-template-columns:38px minmax(0,1fr) 14px!important;gap:8px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-top .dcc-home2-checkin-icon{
      width:38px!important;height:38px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-top .dcc-home2-checkin h3{
      font-size:16.5px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-top .dcc-home2-checkin p{
      font-size:9.7px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-top .dcc-home2-checkin small{
      font-size:6.4px!important;letter-spacing:1.35px!important
    }

    html.dcc-theme-light-premium body #client #client-main .dcc-home2-card-head{min-height:48px!important}
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-task{
      min-height:84px!important;
      grid-template-columns:43px minmax(0,1fr) 16px!important;
      gap:10px!important;padding:11px 13px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-icon{
      width:43px!important;height:43px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-copy .main{
      font-size:16.5px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-copy .sub{
      font-size:10px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-task-copy .status{
      font-size:9px!important
    }

    html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress{
      min-height:106px!important;padding:13px!important;
      grid-template-columns:43px minmax(0,1fr) 16px!important;gap:10px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress-icon{
      width:43px!important;height:43px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress h3{
      font-size:19px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-progress p{
      font-size:10px!important
    }

    html.dcc-theme-light-premium body #client #client-main .dcc-home2-days{
      grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-home2-day{
      min-height:94px!important
    }

    html.dcc-theme-light-premium body #client #client-main .dcc-next-hero{
      min-height:140px!important;
      grid-template-columns:minmax(0,1fr) 118px!important;
      padding:15px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-next-hero .dcc-next-title{
      font-size:25px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-next-motivation{
      font-size:9.7px!important
    }
    html.dcc-theme-light-premium body #client #client-main .dcc-next-hero .hero-btn{
      min-height:44px!important;font-size:10.5px!important
    }
  }
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

  const taskRows=tasks.slice(0,4).map(t=>{
    if(t.type==='training'){
      const parts=String(t.text||'').split(' · ');
      const dayText=parts.slice(0,3).join(' · ');
      const stateText=parts.slice(3).join(' · ');
      return `<div class="dcc-home2-task" onclick="${t.action}"><div class="dcc-home2-task-icon">${icon(t.type)}</div><div class="dcc-home2-task-copy"><span class="main">${esc(t.title)}</span><span class="sub">${esc(dayText)}</span><span class="status">${esc(stateText)}</span></div><div class="dcc-home2-arrow">›</div></div>`;
    }
    return `<div class="dcc-home2-task" onclick="${t.action}"><div class="dcc-home2-task-icon">${icon(t.type)}</div><div class="dcc-home2-task-copy"><span class="main">${esc(t.title)}</span><span class="sub">${esc(t.text)}</span></div><div class="dcc-home2-arrow">›</div></div>`;
  }).join('');

  const hero=next.day?`<section class="dcc-next-hero"><div><div class="dcc-next-eyebrow">TU PRÓXIMO ENTRENAMIENTO</div><h2 class="dcc-next-title">${esc(next.title)}</h2><div class="dcc-next-dayline">Día ${next.index+1}</div><div class="dcc-next-motivation">Fortalece hoy tu mejor versión</div><div class="dcc-next-status">${esc(accessText(next.access))}</div></div><div class="dcc-next-hero-actions"><button type="button" class="hero-btn" onclick="showClient('training')">Ver rutina&nbsp; →</button></div></section>`:'';

  main.innerHTML=`
  <div class="dcc-home2">
    <div class="dcc-home2-top ${checkinSummary?'':'no-checkin'}">
      <header class="dcc-home2-head"><div><div class="dcc-home2-kicker">BIENVENIDO</div><h1>${esc(c.name||'Cliente')}</h1><div class="dcc-home2-line"></div><div class="dcc-home2-motto">DISCIPLINA HOY,<br>RESULTADOS SIEMPRE</div></div></header>
      ${checkinSummary?`<section class="dcc-home2-checkin" onclick="showClient('progress')"><div class="dcc-home2-checkin-icon">${icon('chart')}</div><div><div class="dcc-home2-label">TU ÚLTIMO CHECK-IN</div><h3>${esc(checkinSummary.title)}</h3><p>${esc(checkinSummary.text)}</p><small>${esc(checkinSummary.foot)}</small></div><div class="dcc-home2-arrow">›</div></section>`:''}
    </div>
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
  if(label){
    label.textContent='TU PRÓXIMO ENTRENAMIENTO';
    label.style.setProperty('color','#e7bb55','important');
  }
  if(title&&day){
    title.textContent=dayTitle(day);
    title.style.setProperty('color','#ffffff','important');
    title.style.setProperty('font-family','Georgia, "Times New Roman", serif','important');
    title.style.setProperty('font-size','22px','important');
    title.style.setProperty('line-height','1.05','important');
    title.style.setProperty('font-weight','500','important');
    title.style.setProperty('white-space','normal','important');
  }
  if(meta){
    meta.textContent=`Día ${i+1} · ${accessText(access)}`;
    meta.style.setProperty('color','#eee9df','important');
    meta.style.setProperty('background','transparent','important');
    meta.style.setProperty('padding','0','important');
  }
  card.style.setProperty('min-height','0','important');
  card.style.setProperty('padding','14px 16px','important');
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