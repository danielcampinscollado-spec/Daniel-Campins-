/* DCC definitive dashboard loader v9 visual — compact premium coach panel */
(function(){
  'use strict';

  const GOLD='#d9aa4a';
  const GOLD2='#f0c96b';
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};

  function icon(name){
    const icons={
      panel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
      clients:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6"/></svg>',
      calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
      check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M8 11l2 2 5-5M8 17h7"/></svg>',
      msg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-4-.9L4 20l1.4-3.4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/></svg>',
      dumbbell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8v8M3.5 9.5v5M18 8v8M20.5 9.5v5M6 12h12"/></svg>',
      renew:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 7v5h-5"/><path d="M5 17v-5h5"/><path d="M18.2 11A7 7 0 0 0 6.4 7.1L5 9M5.8 13A7 7 0 0 0 17.6 16.9L19 15"/></svg>',
      diet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 12h5M10 16h5"/></svg>',
      clipboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V3h6v2M9 10h6M9 14h6M9 18h4"/></svg>',
      alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/></svg>'
    };
    return icons[name]||'';
  }

  function injectCss(){
    document.getElementById('dcc-premium-v6')?.remove();
    let s=document.getElementById('dcc-coach-panel-v9-css');
    if(s) s.remove();
    s=document.createElement('style');
    s.id='dcc-coach-panel-v9-css';
    s.textContent=`
      #coach-main.dcc-p9-dashboard,#coach-main.dcc-premium-clients{
        background:
          radial-gradient(ellipse at 88% 2%,rgba(217,170,74,.075),transparent 25%),
          linear-gradient(180deg,#07090c 0%,#040608 100%)!important;
        color:#f6f3ed!important;
        padding:10px 12px 90px!important;
      }
      .dcc-p9,.dcc-cl{width:100%;max-width:980px;margin:0 auto}.dcc-p9 *,.dcc-cl *{box-sizing:border-box}

      .dcc-p9-hero{
        position:relative;overflow:hidden;min-height:146px;padding:18px 20px 17px;
        border:1px solid rgba(240,201,107,.60);border-radius:22px;
        background:
          radial-gradient(circle at 89% 12%,rgba(240,201,107,.14),transparent 27%),
          linear-gradient(132deg,#11161b 0%,#090d11 63%,#151007 100%);
        box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 15px 34px rgba(0,0,0,.28)
      }
      .dcc-p9-hero:before{content:'';position:absolute;right:-48px;top:-100px;width:270px;height:270px;border:1px solid rgba(240,201,107,.20);border-radius:50%;pointer-events:none}
      .dcc-p9-hero:after{content:'';position:absolute;right:-45px;top:44px;width:270px;height:1px;transform:rotate(-29deg);background:linear-gradient(90deg,transparent,rgba(240,201,107,.52),transparent);pointer-events:none}
      .dcc-p9-hero-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;position:relative;z-index:2}
      .dcc-p9-kicker{color:${GOLD2};font-size:9.5px;font-weight:900;letter-spacing:3px;text-transform:uppercase}
      .dcc-p9-mark{width:43px;height:43px;display:grid;place-items:center;flex:none;border:1px solid rgba(240,201,107,.52);border-radius:50%;background:radial-gradient(circle at 50% 30%,rgba(240,201,107,.13),rgba(9,12,15,.94));color:${GOLD2};box-shadow:0 0 20px rgba(217,170,74,.10)}
      .dcc-p9-mark svg{width:23px;height:23px}
      .dcc-p9-title{position:relative;z-index:2;margin:23px 0 0;max-width:76%;font-size:29px;line-height:.98;font-weight:840;letter-spacing:-.85px;color:#f8f6f1}
      .dcc-p9-title span{display:block;margin-top:5px;color:${GOLD2}}
      .dcc-p9-title:after{content:'';display:block;width:45px;height:2px;margin-top:12px;border-radius:99px;background:linear-gradient(90deg,${GOLD2},rgba(217,170,74,.22))}
      .dcc-p9-caption{position:relative;z-index:2;margin-top:10px;color:#9ba3ad;font-size:10.5px;line-height:1.35}
      .dcc-p9-motto{position:absolute;right:20px;bottom:17px;z-index:2;text-align:right;color:#8d929a;font-size:6.3px;line-height:1.55;letter-spacing:2.05px;text-transform:uppercase}

      .dcc-p9-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:9px}
      .dcc-p9-stat{min-height:72px;display:grid;grid-template-columns:36px minmax(0,1fr) 16px;align-items:center;gap:9px;padding:10px 11px;border:1px solid rgba(217,170,74,.38);border-radius:17px;background:radial-gradient(circle at 94% 0,rgba(217,170,74,.055),transparent 36%),linear-gradient(145deg,#10151a,#080c0f);color:#f6f4ef;text-align:left;box-shadow:inset 0 1px 0 rgba(255,255,255,.025);-webkit-tap-highlight-color:transparent}
      .dcc-p9-stat-ico{width:34px;height:34px;display:grid;place-items:center;color:${GOLD2}}
      .dcc-p9-stat-ico svg{width:27px;height:27px}.dcc-p9-stat-copy{min-width:0}.dcc-p9-stat strong{display:block;font-size:23px;line-height:1;font-weight:810;letter-spacing:-.4px}.dcc-p9-stat span{display:block;margin-top:6px;color:#9ca4af;font-size:7px;line-height:1.2;letter-spacing:1px;text-transform:uppercase}.dcc-p9-stat-arrow{color:${GOLD2};font-size:19px;line-height:1}

      .dcc-p9-accordion{margin-top:9px;border:1px solid rgba(240,201,107,.52);border-radius:20px;background:radial-gradient(circle at 96% 0,rgba(240,201,107,.075),transparent 31%),linear-gradient(145deg,#10151a,#080b0e);box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 12px 28px rgba(0,0,0,.18);overflow:hidden}
      .dcc-p9-accordion-head{width:100%;display:grid;grid-template-columns:38px minmax(0,1fr) auto 24px;align-items:center;gap:10px;padding:12px 13px;border:0;background:transparent;color:#f5f2ec;text-align:left;-webkit-tap-highlight-color:transparent}
      .dcc-p9-head-ico{width:36px;height:36px;display:grid;place-items:center;color:${GOLD2};border:1px solid rgba(217,170,74,.32);border-radius:11px;background:rgba(217,170,74,.025)}.dcc-p9-head-ico svg{width:21px;height:21px}
      .dcc-p9-head-copy{min-width:0}.dcc-p9-head-title{display:flex;align-items:center;gap:8px;color:${GOLD2};font-size:9.5px;font-weight:900;letter-spacing:2.5px;text-transform:uppercase}.dcc-p9-count{min-width:22px;height:22px;padding:0 7px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(240,201,107,.55);border-radius:999px;background:linear-gradient(135deg,#f1ca68,#d9a43a);color:#17120a;font-size:9px;font-weight:900;letter-spacing:0}
      .dcc-p9-head-sub{margin-top:4px;color:#858e99;font-size:8.4px;line-height:1.25;letter-spacing:.55px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dcc-p9-caret{color:${GOLD2};font-size:24px;line-height:1;transform:rotate(0deg);transition:transform .18s ease}.dcc-p9-accordion.closed .dcc-p9-caret{transform:rotate(180deg)}
      .dcc-p9-body{padding:0 12px 10px;display:grid;gap:0}.dcc-p9-accordion.closed .dcc-p9-body{display:none}
      .dcc-p9-inner{border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow:hidden;background:rgba(6,9,12,.26)}
      .dcc-p9-row{width:100%;display:grid;grid-template-columns:38px minmax(0,1fr) auto 16px;align-items:center;gap:10px;padding:10px 11px;border:0;border-bottom:1px solid rgba(255,255,255,.075);background:transparent;color:#f5f2ec;text-align:left;-webkit-tap-highlight-color:transparent}.dcc-p9-row:last-child{border-bottom:0}.dcc-p9-row-icon{width:35px;height:35px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.34);border-radius:50%;background:radial-gradient(circle at 50% 30%,rgba(217,170,74,.09),rgba(10,12,14,.95));color:${GOLD2};font-size:18px}.dcc-p9-row-copy{min-width:0}.dcc-p9-row-copy b{display:block;font-size:12px;line-height:1.15;color:#f6f3ee}.dcc-p9-row-copy span{display:block;margin-top:4px;color:#929ba6;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dcc-p9-badge{padding:6px 9px;border:1px solid rgba(217,170,74,.36);border-radius:999px;background:rgba(217,170,74,.025);color:${GOLD2};font-size:7px;font-weight:850;white-space:nowrap}.dcc-p9-arrow{color:${GOLD2};font-size:18px}.dcc-p9-empty{display:flex;align-items:center;gap:9px;padding:10px 11px;color:#9ba3ad;font-size:10px}.dcc-p9-empty-i{width:32px;height:32px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.32);border-radius:50%;color:${GOLD2}}

      .dcc-cl{padding-top:14px}.dcc-cl-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin:6px 2px 20px}.dcc-cl-head h1{margin:0;font-size:34px;letter-spacing:-1.3px}.dcc-cl-head p{margin:6px 0 0;color:#939aa5;font-size:14px}.dcc-cl-new{border:1px solid #f0c96b;border-radius:15px;padding:12px 16px;background:linear-gradient(135deg,#f0c96b,#d9aa4a);color:#090909;font-weight:800;font-size:12px;white-space:nowrap}
      .dcc-cl-tools{display:grid;grid-template-columns:1fr;gap:9px}.dcc-cl-search{height:48px;display:flex;align-items:center;gap:10px;padding:0 15px;border:1px solid #333942;border-radius:15px;background:linear-gradient(145deg,#0e1318,#080b0e);color:#8f97a3}.dcc-cl-search input{width:100%;border:0;outline:0;background:none;color:#f5f5f5;font:inherit}.dcc-cl-filter{border:1px solid #333942;border-radius:15px;background:#0d1115;color:#a9b0ba;font-size:19px}
      .dcc-cl-subtools{display:flex;justify-content:space-between;align-items:center;margin:11px 0 14px}.dcc-cl-tabs{display:flex;border:1px solid #292f36;border-radius:22px;overflow:hidden;background:#090c0f}.dcc-cl-tab{padding:9px 18px;border:0;background:none;color:#9aa1ac;font-size:11px}.dcc-cl-tab.active{border:1px solid ${GOLD2};border-radius:21px;background:radial-gradient(circle at 50% 50%,#d9aa4a35,#15100a);color:${GOLD2};box-shadow:0 0 18px #d9aa4a28}.dcc-cl-sort{padding:9px 13px;border:1px solid #343941;border-radius:15px;background:#0a0d10;color:#e8e8e8;font-size:11px}
      .dcc-cl-card-ref{grid-template-columns:minmax(0,1fr) 24px!important;cursor:pointer!important;min-height:92px!important;padding:15px 17px!important}.dcc-cl-card-ref .dcc-cl-training,.dcc-cl-card-ref .dcc-cl-manage{display:none!important}.dcc-cl-ref-meta{display:flex;gap:14px;align-items:center;margin-top:8px;color:#8d96a1;font-size:10px;font-weight:650}.dcc-cl-active{display:none!important}.dcc-cl-chevron{display:flex!important;align-items:center!important;justify-content:flex-end!important;align-self:stretch!important;color:${GOLD2};font-size:26px;line-height:1}
      .dcc-cl-list{display:grid;gap:9px}.dcc-cl-card{display:grid;grid-template-columns:minmax(0,1fr) minmax(135px,.85fr) 112px;align-items:center;gap:13px;min-height:104px;padding:14px 15px;border:1px solid rgba(217,170,74,.58);border-radius:17px;background:radial-gradient(ellipse at 86% 35%,rgba(217,170,74,.08),transparent 23%),linear-gradient(120deg,#0c1014,#080b0e);box-shadow:0 10px 26px #0005}.dcc-cl-info{min-width:0}.dcc-cl-name{font-size:17px;font-weight:800;color:#f5f3ef}.dcc-cl-goal{margin-top:6px;color:${GOLD2};font-size:12px}.dcc-cl-weight{margin-top:4px;color:#a4abb5;font-size:12px}.dcc-cl-training{padding-left:14px;border-left:1px solid #343a42}.dcc-cl-tr-title{display:flex;align-items:center;gap:7px;color:#f1f1ef;font-size:10px}.dcc-cl-dumbbell{color:${GOLD2};font-size:18px}.dcc-cl-progress{display:flex;align-items:center;gap:8px;margin-top:8px}.dcc-cl-track{height:6px;flex:1;border-radius:8px;background:#2a3037;overflow:hidden}.dcc-cl-fill{height:100%;border-radius:8px;background:linear-gradient(90deg,#d9aa4a,#f0c96b)}.dcc-cl-pct{font-size:11px}.dcc-cl-manage{min-height:48px;border:1px solid ${GOLD2};border-radius:13px;background:linear-gradient(145deg,#18140c,#0a0b0c);color:${GOLD2};font-size:11px;font-weight:800;line-height:1.25}

      .dcc-client-card-authority{position:relative;display:flex;align-items:center;width:100%;height:64px;min-height:64px;padding:6px 10px;gap:9px;border:1px solid rgba(201,151,47,.30);border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.94),rgba(255,250,239,.82));box-shadow:0 6px 15px rgba(86,63,25,.06),inset 0 1px 0 rgba(255,255,255,.98);cursor:pointer;overflow:hidden;color:#111318}
      .dcc-client-card-authority:before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(#f6d66f,#d79a27)}
      .dcc-client-avatar-authority{width:42px;height:42px;flex:0 0 42px;display:grid;place-items:center;border:1px solid rgba(190,134,27,.30);border-radius:14px;background:linear-gradient(145deg,#fffaf0,#f8e7b7);color:#9c6810}.dcc-client-avatar-authority svg{width:23px;height:23px}
      .dcc-client-copy-authority{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.dcc-client-copy-authority strong{color:#111318!important;font-size:15.5px;font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dcc-client-copy-authority small{color:#858c98;font-size:9.8px;font-weight:600}
      .dcc-client-manage-authority{flex:0 0 auto;min-width:106px;height:36px;padding:0 7px 0 10px;display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1.3px solid #c9952f;border-radius:12px;background:rgba(255,252,245,.82);color:#714909;font-size:10.8px;font-weight:820}.dcc-client-manage-authority span{width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(145deg,#f8d978,#e5ad3d);color:#2f220b;font-size:16px}
      html:not(.dcc-theme-light-premium) body #coach .dcc-client-card-authority{background:linear-gradient(145deg,#10151a,#080b0e);color:#f5f3ef;border-color:rgba(217,170,74,.42)}html:not(.dcc-theme-light-premium) body #coach .dcc-client-copy-authority strong{color:#f5f3ef!important}html:not(.dcc-theme-light-premium) body #coach .dcc-client-copy-authority small{color:#8d96a1}

      /* Navegación entrenador: única autoridad visual móvil. */
      @media(max-width:900px){
        body #coach#coach > .side{position:fixed!important;left:18px!important;right:18px!important;bottom:12px!important;top:auto!important;width:auto!important;height:76px!important;min-height:76px!important;margin:0!important;padding:5px!important;border:1.5px solid rgba(214,160,48,.78)!important;border-radius:38px!important;background:#11110f!important;background-image:none!important;box-shadow:0 12px 30px rgba(0,0,0,.24)!important;overflow:hidden!important;z-index:9999!important;box-sizing:border-box!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
        body #coach#coach > .side>h2,body #coach#coach > .side>.out{display:none!important}
        body #coach#coach #coach-nav#coach-nav{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:2px!important;width:100%!important;height:100%!important;margin:0!important;padding:0!important;border:0!important;border-radius:33px!important;background:#11110f!important;background-image:none!important;box-shadow:none!important;overflow:hidden!important;box-sizing:border-box!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
        body #coach#coach #coach-nav#coach-nav button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:100%!important;height:100%!important;min-width:0!important;margin:0!important;padding:7px 3px!important;gap:4px!important;border:1px solid transparent!important;border-radius:31px!important;background:transparent!important;color:#d7aa4b!important;box-shadow:none!important;transition:none!important;transform:none!important}
        body #coach#coach #coach-nav#coach-nav button svg{width:24px!important;height:24px!important;flex:0 0 24px!important;color:currentColor!important;stroke:currentColor!important}
        body #coach#coach #coach-nav#coach-nav button span{margin:0!important;color:currentColor!important;font-size:11px!important;line-height:1!important;font-weight:600!important;white-space:nowrap!important}
        body #coach#coach #coach-nav#coach-nav button.active{border:1.5px solid rgba(205,146,27,.78)!important;background:linear-gradient(145deg,#ffe994 0%,#f6cf61 46%,#e2a72f 100%)!important;color:#17140d!important;box-shadow:0 5px 14px rgba(185,126,18,.20),inset 0 1px 0 rgba(255,255,255,.92)!important}
        html.dcc-theme-light-premium body #coach#coach > .side{background:#fffdf9!important;background-image:none!important;box-shadow:0 12px 30px rgba(103,76,29,.13),inset 0 1px 0 rgba(255,255,255,.98)!important}
        html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav{background:#fffdf9!important;background-image:none!important}
        html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active){background:transparent!important;color:#5f6268!important}
        html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active{color:#17140d!important}
      }

      @media(max-width:600px){
        .dcc-p9-title{font-size:27px}.dcc-p9-hero{min-height:142px;padding:16px}.dcc-p9-motto{right:16px;bottom:15px;font-size:5.8px}.dcc-p9-stat{min-height:67px;padding:9px 10px;grid-template-columns:32px minmax(0,1fr) 14px}.dcc-p9-stat-ico{width:31px;height:31px}.dcc-p9-stat-ico svg{width:24px;height:24px}.dcc-p9-stat strong{font-size:21px}.dcc-p9-stat span{font-size:6.4px}.dcc-p9-accordion-head{grid-template-columns:35px minmax(0,1fr) auto 20px;padding:11px 12px}.dcc-p9-head-ico{width:34px;height:34px}.dcc-p9-row{grid-template-columns:35px minmax(0,1fr) auto 14px;padding:9px 10px}.dcc-p9-row-icon{width:33px;height:33px}.dcc-p9-row-copy b{font-size:11.5px}.dcc-p9-row-copy span{font-size:8.5px}
        .dcc-cl-head h1{font-size:31px}.dcc-cl-head p{font-size:12px}.dcc-cl-new{padding:11px 13px}.dcc-cl-card{grid-template-columns:minmax(0,1fr) minmax(108px,.8fr) 88px;gap:9px;padding:12px 11px;min-height:94px}.dcc-cl-name{font-size:15px}.dcc-cl-goal,.dcc-cl-weight{font-size:10.5px}.dcc-cl-training{padding-left:9px}.dcc-cl-manage{font-size:9.5px;padding:5px}.dcc-cl-tab{padding:8px 13px}
      }
      @media(max-width:390px){
        .dcc-p9-hero{min-height:136px}.dcc-p9-title{font-size:25px;margin-top:20px}.dcc-p9-caption{font-size:9.7px}.dcc-p9-motto{display:none}.dcc-p9-stat{grid-template-columns:29px minmax(0,1fr) 12px;gap:7px}.dcc-p9-stat-ico svg{width:22px;height:22px}.dcc-p9-stat strong{font-size:20px}.dcc-p9-head-sub{font-size:7.6px}
      }
    `;
    document.head.appendChild(s);
  }

  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function latestWorkout(id){const d=getData(),h=d?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0]||null}
  function routineDays(id){const r=getData()?.routines?.[id];return Array.isArray(r)?r:(Array.isArray(r?.routine)?r.routine:[])}
  function routineComplete(id){const days=routineDays(id);return days.length>0&&days.every(day=>Array.isArray(day?.exercises)&&day.exercises.length>0)}
  function mealReady(meal){if(Array.isArray(meal?.options)&&meal.options.length)return meal.options.some(o=>Array.isArray(o?.foods)&&o.foods.length>0);return Array.isArray(meal?.foods)&&meal.foods.length>0}
  function dietDayComplete(day){return Array.isArray(day?.meals)&&day.meals.length>0&&day.meals.every(mealReady)}
  function dietComplete(id){const p=getData()?.diets?.[id];return !!p&&(dietDayComplete(p.training)||dietDayComplete(p.rest))}
  function pendingClient(c){return String(c?.status||'').trim().toLowerCase()==='pendiente'}
  function pendingCheck(c){const x=getData()?.checkins?.[c.id];return !!(x?.sentAt&&!x?.reviewed)}
  function trainingProgress(c){const d=getData(),r=d?.routines?.[c.id];if(!Array.isArray(r)||!r.length)return 0;const h=d?.workoutHistory?.[c.id]||[];if(!h.length)return 0;const recent=h.filter(x=>{const gap=daysSince(x.date);return gap!==null&&gap<=30}).length;return Math.min(100,Math.round(recent/Math.max(1,r.length*4)*100))}

  function statCard(iconName,value,label,action){
    return `<button type="button" class="dcc-p9-stat" ${action?`onclick="${action}"`:''}><span class="dcc-p9-stat-ico">${icon(iconName)}</span><span class="dcc-p9-stat-copy"><strong>${esc(value)}</strong><span>${esc(label)}</span></span><span class="dcc-p9-stat-arrow">›</span></button>`;
  }
  function taskRow(i){return `<button type="button" class="dcc-p9-row" onclick="${i.action}"><span class="dcc-p9-row-icon">${i.icon}</span><span class="dcc-p9-row-copy"><b>${esc(i.title)}</b><span>${esc(i.text)}</span></span><span class="dcc-p9-badge">${esc(i.badge)}</span><span class="dcc-p9-arrow">›</span></button>`}

  window.dccCoachTogglePanel=function(which){
    const el=document.getElementById(which==='attention'?'dccP9Attention':'dccP9Tasks');
    if(!el)return;
    const closed=el.classList.toggle('closed');
    if(which==='attention')window.__dccCoachAttentionOpen=!closed;else window.__dccCoachTasksOpen=!closed;
  };

  function renderDashboard(){
    injectCss();
    const main=document.getElementById('coach-main');if(!main)return;
    main.className='dcc-p9-dashboard';
    const d=getData(),cs=Array.isArray(d.clients)?d.clients:[],tasks=[],attention=[];
    cs.forEach(c=>{
      if(pendingCheck(c))tasks.push({icon:'✓',title:'REVISAR CHECK-IN',text:c.name,badge:'HOY',action:`reviewCheckin('${esc(c.id)}')`});
      if(!routineComplete(c.id))tasks.push({icon:'＋',title:'COMPLETAR RUTINA',text:c.name,badge:'PENDIENTE',action:`openClient('${esc(c.id)}')`});
      if(!dietComplete(c.id))tasks.push({icon:'＋',title:'COMPLETAR ALIMENTACIÓN',text:c.name,badge:'PENDIENTE',action:`openClient('${esc(c.id)}')`});
      if(pendingClient(c))tasks.push({icon:'＋',title:'REVISAR CLIENTE',text:c.name,badge:'PENDIENTE',action:`openClient('${esc(c.id)}')`});
      const gap=daysSince(latestWorkout(c.id)?.date);
      if(gap!==null&&gap>=7)attention.push({icon:'!',title:c.name,text:`${gap} DÍAS SIN REGISTRAR ENTRENAMIENTO`,badge:'SEGUIMIENTO',action:`openClient('${esc(c.id)}')`});
    });
    const hr=new Date().getHours(),g=hr<13?'BUENOS DÍAS':hr<20?'BUENAS TARDES':'BUENAS NOCHES';
    const tasksOpen=window.__dccCoachTasksOpen===true;
    const attentionOpen=window.__dccCoachAttentionOpen===true;
    main.innerHTML=`<div class="dcc-p9">
      <section class="dcc-p9-hero">
        <div class="dcc-p9-hero-top"><div class="dcc-p9-kicker">PANEL DE ENTRENADOR</div><div class="dcc-p9-mark">${icon('dumbbell')}</div></div>
        <h1 class="dcc-p9-title">${g},<span>DANIEL</span></h1>
        <div class="dcc-p9-caption">Clientes, seguimiento y próximas acciones.</div>
        <div class="dcc-p9-motto">DISCIPLINA<br>TRANSFORMA<br>VIDAS</div>
      </section>
      <div class="dcc-p9-stats">
        ${statCard('clients',cs.length,'CLIENTES',"showCoach('clients')")}
        ${statCard('check',cs.filter(pendingCheck).length,'CHECK-IN PENDIENTES',"showCoach('checkins')")}
        ${statCard('renew',0,'RUTINAS POR RENOVAR',"toast('Sin rutinas por renovar')")}
        ${statCard('diet',0,'DIETAS POR RENOVAR',"toast('Sin dietas por renovar')")}
      </div>
      <section id="dccP9Tasks" class="dcc-p9-accordion ${tasksOpen?'':'closed'}">
        <button type="button" class="dcc-p9-accordion-head" onclick="dccCoachTogglePanel('tasks')">
          <span class="dcc-p9-head-ico">${icon('clipboard')}</span>
          <span class="dcc-p9-head-copy"><span class="dcc-p9-head-title">TAREAS PENDIENTES <span class="dcc-p9-count">${tasks.length}</span></span><span class="dcc-p9-head-sub">ACCIONES QUE REQUIEREN TU ATENCIÓN</span></span>
          <span></span><span class="dcc-p9-caret">⌃</span>
        </button>
        <div class="dcc-p9-body"><div class="dcc-p9-inner">${tasks.length?tasks.slice(0,6).map(taskRow).join(''):`<div class="dcc-p9-empty"><span class="dcc-p9-empty-i">✓</span><span>Todo al día. No hay tareas pendientes.</span></div>`}</div></div>
      </section>
      <section id="dccP9Attention" class="dcc-p9-accordion ${attentionOpen?'':'closed'}">
        <button type="button" class="dcc-p9-accordion-head" onclick="dccCoachTogglePanel('attention')">
          <span class="dcc-p9-head-ico">${icon('alert')}</span>
          <span class="dcc-p9-head-copy"><span class="dcc-p9-head-title">REQUIEREN ATENCIÓN</span><span class="dcc-p9-head-sub">SEÑALES DE SEGUIMIENTO DETECTADAS AUTOMÁTICAMENTE</span></span>
          <span></span><span class="dcc-p9-caret">⌃</span>
        </button>
        <div class="dcc-p9-body"><div class="dcc-p9-inner">${attention.length?attention.slice(0,6).map(taskRow).join(''):`<div class="dcc-p9-empty"><span class="dcc-p9-empty-i">✓</span><span>Sin alertas de seguimiento.</span></div>`}</div></div>
      </section>
    </div>`;
  }

  function clientSince(c){
    const raw=c?.created_at||c?.createdAt||c?.start_date||c?.startDate;if(!raw)return'';const d=new Date(raw);if(!Number.isFinite(d.getTime()))return'';return `Desde ${d.toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})}`
  }
  function clientCard(c){
    const id=esc(c.id),name=esc(c.name||'Cliente'),since=esc(clientSince(c));
    return `<article class="dcc-client-card-authority" data-name="${name.toLowerCase()}" onclick="openClient('${id}')"><span class="dcc-client-avatar-authority">${icon('clients')}</span><span class="dcc-client-copy-authority"><strong>${name}</strong>${since?`<small>${since}</small>`:''}</span><button type="button" class="dcc-client-manage-authority" onclick="event.stopPropagation();openClient('${id}')">Gestionar<span>›</span></button></article>`;
  }
  function renderClients(){
    injectCss();const main=document.getElementById('coach-main');if(!main)return;main.className='dcc-premium-clients';const cs=getData()?.clients||[];
    main.innerHTML=`<div class="dcc-cl"><header class="dcc-cl-head"><div><h1>Clientes</h1><p>Gestiona y acompaña su progreso.</p></div><button class="dcc-cl-new" onclick="newClient()">＋ Nuevo cliente</button></header><div class="dcc-cl-tools"><label class="dcc-cl-search">⌕<input id="dccClientSearch" placeholder="Buscar cliente..." oninput="window.dccFilterClients()"></label></div><div class="dcc-cl-subtools"><span style="font-size:10px;font-weight:800;color:#8d96a1;letter-spacing:.7px">CLIENTES ACTIVOS</span><button class="dcc-cl-sort" onclick="window.dccSortClients()">↕ &nbsp; A-Z⌄</button></div><div class="dcc-cl-list" id="dccClientList">${cs.map(clientCard).join('')||'<div class="dcc-cl-empty">Todavía no hay clientes.</div>'}</div></div>`;
    window.__dccClientMode='all';window.__dccClientSort='az';
  }

  window.dccFilterClients=function(){const q=(document.getElementById('dccClientSearch')?.value||'').toLowerCase();document.querySelectorAll('.dcc-client-card-authority').forEach(x=>x.style.display=x.dataset.name.includes(q)?'flex':'none')};
  window.dccClientTab=function(m,b){window.__dccClientMode=m;document.querySelectorAll('.dcc-cl-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');window.dccFilterClients()};
  window.dccSortClients=function(){const l=document.getElementById('dccClientList');if(!l)return;window.__dccClientSort=window.__dccClientSort==='az'?'za':'az';[...l.querySelectorAll('.dcc-client-card-authority')].sort((a,b)=>window.__dccClientSort==='az'?a.dataset.name.localeCompare(b.dataset.name):b.dataset.name.localeCompare(a.dataset.name)).forEach(x=>l.appendChild(x))};

  function navHtml(){return `<button onclick="showCoach('dashboard')">${icon('panel')}<span>Panel</span></button><button onclick="showCoach('clients')">${icon('clients')}<span>Clientes</span></button><button onclick="showCoach('calendar')">${icon('calendar')}<span>Calendario</span></button>`}
  function enforceNav(){const n=document.getElementById('coach-nav');if(!n)return;const wanted=['Panel','Clientes','Calendario'],labels=[...n.querySelectorAll('button span')].map(x=>x.textContent.trim());if(labels.length!==3||wanted.some((x,i)=>labels[i]!==x))n.innerHTML=navHtml();n.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important')}
  function active(screen){const n=document.getElementById('coach-nav');if(!n)return;const map={dashboard:0,clients:1,calendar:2,checkins:1,messages:1};n.querySelectorAll('button').forEach(x=>x.classList.remove('active'));const i=map[screen];if(i!==undefined)n.querySelectorAll('button')[i]?.classList.add('active')}
  function syncRoute(screen){window.currentApp='coach';window.currentScreen=screen;window.__dccCoachRouteIntent=screen;try{currentApp='coach';currentScreen=screen}catch(_){}}
  function beforeRoute(screen){return document.dispatchEvent(new CustomEvent('dcc:coach-before-screen',{detail:{screen},cancelable:true}))}
  function afterRoute(screen){document.dispatchEvent(new CustomEvent('dcc:coach-screen',{detail:{screen}}))}

  function install(){
    injectCss();enforceNav();
    if(window.__dccCoachRouterV40)return;
    const base=window.showCoach;
    if(typeof base!=='function')return;
    const router=function(screen){
      if(!beforeRoute(screen))return;
      if(screen!=='dashboard'){
        window.__dccCoachTasksOpen=false;
        window.__dccCoachAttentionOpen=false;
      }
      syncRoute(screen);
      if(screen==='dashboard'){renderDashboard();enforceNav();active(screen);afterRoute(screen);return}
      if(screen==='clients'){renderClients();enforceNav();active(screen);afterRoute(screen);return}
      if(screen==='calendar'){
        if(typeof window.dccRenderCoachCalendarV12==='function')window.dccRenderCoachCalendarV12();
        else if(typeof window.dccRenderCoachCalendar==='function')window.dccRenderCoachCalendar();
        else base.call(this,screen);
        enforceNav();active(screen);afterRoute(screen);return;
      }
      if(screen==='checkins'&&typeof window.dccRenderCoachCheckins==='function'){window.dccRenderCoachCheckins();enforceNav();active(screen);afterRoute(screen);return}
      if(screen==='messages'&&typeof window.dccRenderCoachMessages==='function'){window.dccRenderCoachMessages();enforceNav();active(screen);afterRoute(screen);return}
      const main=document.getElementById('coach-main');if(main)main.classList.remove('dcc-p9-dashboard','dcc-premium-clients');
      const result=base.apply(this,arguments);enforceNav();active(screen);afterRoute(screen);return result;
    };
    router.__dccPremiumV9=true;router.__dccPremiumV6=true;router.__dccSingleRouterV40=true;router.__original=base;
    window.__dccCoachRouterV40=router;window.showCoach=router;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.addEventListener('pageshow',()=>{enforceNav();active(window.currentScreen||'dashboard')});
})();
