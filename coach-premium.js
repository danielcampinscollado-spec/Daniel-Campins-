/* DCC — Panel entrenador premium */
(function(){
  const GOLD="#d9aa4a";
  const GOLD2="#f0c96b";

  function injectStyles(){
    if(document.getElementById("dcc-coach-premium-styles")) return;
    const style=document.createElement("style");
    style.id="dcc-coach-premium-styles";
    style.textContent=`
      #coach-main.dcc-premium-dashboard{padding-top:18px!important;padding-bottom:105px!important;}
      .dcc-pd{max-width:980px;margin:0 auto;color:#f6f3ed;}
      .dcc-pd *{box-sizing:border-box;}
      .dcc-pd-hero{position:relative;overflow:hidden;min-height:250px;padding:22px 22px 28px;border:1px solid rgba(255,255,255,.09);border-radius:28px;background:radial-gradient(circle at 78% 22%,rgba(217,170,74,.16),transparent 30%),radial-gradient(circle at 86% 52%,rgba(255,255,255,.05),transparent 28%),linear-gradient(145deg,#11151b 0%,#090b0f 55%,#050608 100%);box-shadow:0 22px 65px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.03);}
      .dcc-pd-hero:after{content:"";position:absolute;right:-28px;top:22px;width:210px;height:250px;opacity:.5;background:radial-gradient(ellipse at 50% 25%,rgba(240,201,107,.35),transparent 20%),radial-gradient(ellipse at 55% 48%,rgba(255,255,255,.08),transparent 27%),linear-gradient(150deg,transparent 34%,rgba(217,170,74,.12) 35%,transparent 60%);filter:blur(.2px);pointer-events:none;}
      .dcc-pd-brand{display:flex;align-items:center;gap:12px;position:relative;z-index:1;}
      .dcc-pd-brand img{width:70px;height:auto;filter:drop-shadow(0 4px 18px rgba(217,170,74,.14));}
      .dcc-pd-brand-name{font-size:12px;letter-spacing:4.8px;color:${GOLD2};font-weight:700;}
      .dcc-pd-brand-sub{margin-top:5px;font-size:9px;letter-spacing:4px;color:#7e858f;}
      .dcc-pd-eyebrow{margin-top:34px;color:${GOLD2};font-size:11px;font-weight:750;letter-spacing:4px;text-transform:uppercase;position:relative;z-index:1;}
      .dcc-pd-title{margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:46px;line-height:.98;font-weight:500;letter-spacing:-1.4px;position:relative;z-index:1;}
      .dcc-pd-title span{display:block;color:${GOLD2};}
      .dcc-pd-hero-note{position:absolute;right:24px;bottom:28px;z-index:2;width:180px;font-size:10px;line-height:1.8;letter-spacing:2px;text-transform:uppercase;color:#e7e3db;}
      .dcc-pd-hero-note b{color:${GOLD2};font-weight:700;}
      .dcc-pd-hero-line{width:48px;height:2px;margin-top:13px;background:linear-gradient(90deg,${GOLD},${GOLD2});}
      .dcc-pd-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:14px 0 16px;}
      .dcc-pd-stat{min-height:72px;padding:13px 14px;border:1px solid rgba(255,255,255,.09);border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.014));}
      .dcc-pd-stat strong{display:block;font-size:23px;font-family:Georgia,'Times New Roman',serif;font-weight:500;color:#f5f2ec;}
      .dcc-pd-stat span{display:block;margin-top:4px;font-size:9px;letter-spacing:1.6px;text-transform:uppercase;color:#8e949e;}
      .dcc-pd-section{margin-top:16px;padding:19px;border:1px solid rgba(255,255,255,.1);border-radius:22px;background:linear-gradient(145deg,#12161d,#090c10);box-shadow:0 18px 45px rgba(0,0,0,.24);}
      .dcc-pd-section-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:9px;}
      .dcc-pd-section-kicker{color:${GOLD2};font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;}
      .dcc-pd-section-sub{margin-top:5px;color:#7f8792;font-size:12px;}
      .dcc-pd-row{width:100%;display:flex;align-items:center;gap:12px;padding:13px 0;border:0;border-top:1px solid rgba(255,255,255,.075);background:transparent;color:#f5f2ec;text-align:left;}
      .dcc-pd-row:first-of-type{margin-top:8px;}
      .dcc-pd-icon{width:40px;height:40px;flex:0 0 40px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(217,170,74,.15);border-radius:12px;background:rgba(217,170,74,.07);color:${GOLD2};font-size:17px;}
      .dcc-pd-copy{flex:1;min-width:0;}
      .dcc-pd-copy b{display:block;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .dcc-pd-copy span{display:block;margin-top:4px;color:#858c96;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n      .dcc-pd-attention .dcc-pd-copy span{white-space:normal;overflow:visible;text-overflow:clip;line-height:1.35;padding-right:4px;}\n      .dcc-pd-section.dcc-empty{padding-top:17px;padding-bottom:17px;}\n      .dcc-pd-section.dcc-empty .dcc-pd-section-head{margin-bottom:2px;}\n      .dcc-pd-section.dcc-empty .dcc-pd-empty{padding:10px 0 0;}
      .dcc-pd-badge{flex:none;padding:7px 9px;border-radius:9px;font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase;background:rgba(217,170,74,.08);color:${GOLD2};border:1px solid rgba(217,170,74,.14);}
      .dcc-pd-arrow{flex:none;color:${GOLD2};font-size:20px;padding-left:2px;}
      .dcc-pd-empty{padding:18px 0 4px;color:#8a929d;font-size:12px;line-height:1.55;}
      .dcc-pd-banner{position:relative;overflow:hidden;margin-top:16px;padding:22px;border:1px solid rgba(217,170,74,.35);border-radius:22px;background:radial-gradient(circle at 88% 30%,rgba(217,170,74,.2),transparent 28%),linear-gradient(135deg,#30240f 0%,#15120c 28%,#0d0e11 72%);box-shadow:0 18px 45px rgba(0,0,0,.27);}
      .dcc-pd-banner:after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 0 48%,rgba(240,201,107,.08) 49% 51%,transparent 52%);pointer-events:none;}
      .dcc-pd-banner small{position:relative;z-index:1;color:${GOLD2};font-size:9px;font-weight:800;letter-spacing:3px;text-transform:uppercase;}
      .dcc-pd-banner strong{position:relative;z-index:1;display:block;margin-top:8px;font-family:Georgia,'Times New Roman',serif;font-size:21px;font-weight:500;letter-spacing:.2px;color:#faf7ef;}
      .dcc-pd-attention .dcc-pd-badge{background:rgba(224,90,90,.08);color:#f08f82;border-color:rgba(224,90,90,.18);}
      @media(max-width:700px){
        #coach-main.dcc-premium-dashboard{padding:14px 14px 104px!important;}
        .dcc-pd-hero{min-height:278px;padding:19px 18px 24px;border-radius:24px;}
        .dcc-pd-brand img{width:58px;}.dcc-pd-brand-name{font-size:10px;letter-spacing:3.6px}.dcc-pd-brand-sub{font-size:7px;letter-spacing:3px}
        .dcc-pd-eyebrow{margin-top:30px;font-size:9px;letter-spacing:3px}.dcc-pd-title{font-size:40px;max-width:66%;}
        .dcc-pd-hero-note{right:18px;bottom:24px;width:125px;font-size:8px;letter-spacing:1.6px;line-height:1.8;}
        .dcc-pd-strip{gap:7px}.dcc-pd-stat{min-height:65px;padding:11px}.dcc-pd-stat strong{font-size:20px}.dcc-pd-stat span{font-size:7.5px;letter-spacing:1.1px}
        .dcc-pd-section{padding:17px 16px;border-radius:20px}.dcc-pd-row{gap:10px}.dcc-pd-icon{width:38px;height:38px;flex-basis:38px}.dcc-pd-copy b{font-size:12.5px}.dcc-pd-copy span{font-size:10.5px}.dcc-pd-attention .dcc-pd-row{align-items:flex-start}.dcc-pd-attention .dcc-pd-badge{margin-top:2px;padding:6px 7px;font-size:8px}.dcc-pd-attention .dcc-pd-arrow{margin-top:5px}
        #coach .side{height:76px!important;}#coach-nav{grid-template-columns:repeat(4,minmax(0,1fr))!important;}#coach-nav button{font-size:10px!important;}#coach-nav button svg{width:24px!important;height:24px!important;}
      }
    `;
    document.head.appendChild(style);
    const finalStyle=document.createElement("style");
    finalStyle.id="dcc-approved-dashboard-final";
    finalStyle.textContent=`
      .dcc-pd-hero{min-height:225px;border:0;border-radius:0;padding:18px 22px 20px;background:radial-gradient(ellipse at 73% 35%,rgba(221,170,70,.16),transparent 30%),linear-gradient(110deg,#050607 0%,#090b0d 58%,#030405 100%);box-shadow:none}
      .dcc-pd-hero:after{right:0;top:-12px;width:48%;height:245px;opacity:.85;background:radial-gradient(ellipse at 55% 45%,rgba(213,164,74,.23),transparent 28%),radial-gradient(ellipse at 58% 60%,rgba(255,255,255,.07),transparent 33%);filter:none}
      .dcc-pd-brand{z-index:3}.dcc-pd-title{margin-top:46px;font-size:48px;max-width:55%;z-index:3}.dcc-pd-title:after{content:"";display:block;width:52px;height:2px;margin-top:16px;background:linear-gradient(90deg,${GOLD2},${GOLD})}
      .dcc-pd-strip{grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:8px 0 12px;border:1px solid rgba(217,170,74,.38);border-radius:18px;overflow:hidden;background:linear-gradient(145deg,#10151a,#080b0e)}
      .dcc-pd-stat{border:0;border-right:1px solid rgba(255,255,255,.12);border-radius:0;min-height:82px;padding:15px 12px;background:transparent}.dcc-pd-stat:last-child{border-right:0}.dcc-pd-stat strong{font-family:Arial,sans-serif;font-size:25px;font-weight:700}.dcc-pd-stat span{font-size:8px;line-height:1.35;letter-spacing:.8px;color:#d4d6d9}
      .dcc-pd-section{margin-top:12px;padding:15px 18px;border-color:rgba(217,170,74,.42);border-radius:18px;background:linear-gradient(145deg,#101418,#080b0d)}
      .dcc-pd-section-kicker{font-size:11px}.dcc-pd-section-sub{color:#b6bac0}.dcc-pd-row{padding:10px 0}.dcc-pd-empty{padding:9px 0 2px}
      .dcc-pd-banner{display:flex;align-items:center;gap:18px;margin-top:12px;padding:18px 22px;border-color:rgba(240,201,107,.72);border-radius:18px;background:radial-gradient(ellipse at 86% 45%,rgba(232,178,66,.35),transparent 18%),radial-gradient(ellipse at 72% 70%,rgba(178,121,28,.25),transparent 24%),radial-gradient(ellipse at 18% 50%,rgba(216,158,45,.25),transparent 22%),linear-gradient(100deg,#171006,#090a0b 38%,#171006 100%);box-shadow:inset 0 0 35px rgba(211,153,41,.12),0 14px 40px rgba(0,0,0,.3)}
      .dcc-pd-banner:before{content:"";position:absolute;inset:-40%;background:repeating-radial-gradient(ellipse at 70% 50%,rgba(235,187,82,.08) 0 3%,transparent 4% 9%);filter:blur(7px);transform:rotate(-8deg);pointer-events:none}.dcc-pd-trophy{position:relative;z-index:2;font-size:30px;color:${GOLD2};text-shadow:0 0 18px rgba(240,201,107,.35)}.dcc-pd-banner>div{position:relative;z-index:2}.dcc-pd-banner strong{font-size:20px}
      #coach .side{height:78px!important}#coach-nav{grid-template-columns:repeat(5,minmax(0,1fr))!important}#coach-nav button{font-size:9px!important}
      @media(max-width:700px){#coach-main.dcc-premium-dashboard{padding:10px 14px 102px!important}.dcc-pd-hero{min-height:220px;padding:15px 12px 18px}.dcc-pd-brand img{width:52px}.dcc-pd-title{margin-top:45px;font-size:38px;max-width:62%}.dcc-pd-strip{margin-top:6px}.dcc-pd-stat{min-height:76px;padding:12px 7px}.dcc-pd-stat strong{font-size:21px}.dcc-pd-stat span{font-size:6.8px;letter-spacing:.35px}.dcc-pd-section{padding:14px}.dcc-pd-banner{padding:16px}.dcc-pd-banner strong{font-size:17px}#coach-nav button span{font-size:8px!important}}
    `;
    document.head.appendChild(finalStyle);

  }

  function escText(value){
    return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  function daysSince(date){
    if(!date) return null;
    const d=new Date(date); if(!Number.isFinite(d.getTime())) return null;
    return Math.floor((Date.now()-d.getTime())/86400000);
  }

  function latestWorkout(clientId){
    const h=data?.workoutHistory?.[clientId]||[];
    if(!h.length) return null;
    return h.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  }

  function hasRoutine(id){
    const r=data?.routines?.[id];
    return Array.isArray(r)&&r.length>0;
  }

  function hasDiet(id){
    const d=data?.diets?.[id];
    const types=[d?.training,d?.rest].filter(Boolean);
    return types.some(type=>(type.meals||[]).some(meal=>{
      if(Array.isArray(meal.foods)&&meal.foods.length) return true;
      if(Array.isArray(meal.options)) return meal.options.some(o=>Array.isArray(o.foods)&&o.foods.length);
      return false;
    }));
  }

  function unreadMessage(clientId){
    const msgs=data?.messages?.[clientId]||[];
    if(!msgs.length) return false;
    const last=msgs[msgs.length-1];
    if(!Array.isArray(last)||last[0]==="Daniel") return false;
    const seen=data?.notificationState?.[clientId]?.coachMessageSeenAt;
    if(!seen||!last[2]) return true;
    return new Date(last[2])>new Date(seen);
  }

  function dashboardItems(){
    const clients=data?.clients||[];
    const tasks=[];
    const attention=[];

    clients.forEach(c=>{
      const check=data?.checkins?.[c.id];
      if(check?.sentAt&&!check?.reviewed){
        tasks.push({icon:"✓",title:"REVISAR CHECK-IN",text:c.name,badge:"HOY",action:`reviewCheckin('${c.id}')`});
      }
      if(unreadMessage(c.id)){
        tasks.push({icon:"✉",title:"RESPONDER MENSAJE",text:c.name,badge:"HOY",action:`openMessages('${c.id}')`});
      }
      if(!hasRoutine(c.id)){
        tasks.push({icon:"⌁",title:"ASIGNAR RUTINA",text:c.name,badge:"PENDIENTE",action:`openClient('${c.id}')`});
      }
      if(!hasDiet(c.id)){
        tasks.push({icon:"◫",title:"CONFIGURAR ALIMENTACIÓN",text:c.name,badge:"PENDIENTE",action:`openClient('${c.id}')`});
      }

      const last=latestWorkout(c.id);
      const gap=daysSince(last?.date);
      if(gap!==null&&gap>=7){
        attention.push({icon:"!",title:c.name,text:`${gap} DÍAS SIN REGISTRAR ENTRENAMIENTO`,badge:"SEGUIMIENTO",action:`openClient('${c.id}')`});
      }
      if(!hasRoutine(c.id)) attention.push({icon:"⌁",title:c.name,text:"SIN RUTINA ACTIVA",badge:"PLAN",action:`openClient('${c.id}')`});
      if(!hasDiet(c.id)) attention.push({icon:"◫",title:c.name,text:"SIN PLAN DE ALIMENTACIÓN",badge:"PLAN",action:`openClient('${c.id}')`});
    });
    return {tasks:tasks.slice(0,6),attention:attention.slice(0,6)};
  }

  function row(item,attention=false){
    return `<button type="button" class="dcc-pd-row ${attention?"dcc-pd-attention":""}" onclick="${item.action}">
      <span class="dcc-pd-icon">${item.icon}</span>
      <span class="dcc-pd-copy"><b>${escText(item.title)}</b><span>${escText(item.text)}</span></span>
      <span class="dcc-pd-badge">${escText(item.badge)}</span><span class="dcc-pd-arrow">›</span>
    </button>`;
  }

  function renderDashboard(){
    injectStyles();
    const main=document.getElementById("coach-main");
    if(!main) return;
    main.classList.add("dcc-premium-dashboard");
    const clients=data?.clients||[];
    const pending=clients.filter(c=>data?.checkins?.[c.id]?.sentAt&&!data?.checkins?.[c.id]?.reviewed).length;
    const unread=clients.filter(c=>unreadMessage(c.id)).length;
    const {tasks,attention}=dashboardItems();
    const hour=new Date().getHours();
    const greeting=hour<13?"BUENOS DÍAS":hour<20?"BUENAS TARDES":"BUENAS NOCHES";

    main.innerHTML=`<div class="dcc-pd">
      <section class="dcc-pd-hero">
        <div class="dcc-pd-brand"><img src="./dc-stride-logo.svg.svg" alt="DC"><div><div class="dcc-pd-brand-name">DANIEL CAMPINS</div><div class="dcc-pd-brand-sub">TRAINING PLATFORM</div></div></div>
        <h1 class="dcc-pd-title">${greeting},<span>DANIEL</span></h1>
      </section>

      <div class="dcc-pd-strip">
        <div class="dcc-pd-stat"><strong>${clients.length}</strong><span>CLIENTES</span></div>
        <div class="dcc-pd-stat"><strong>${pending}</strong><span>CHECK-IN PENDIENTE</span></div>
        <div class="dcc-pd-stat"><strong>0</strong><span>RUTINAS POR RENOVAR</span></div>
        <div class="dcc-pd-stat"><strong>0</strong><span>DIETAS POR RENOVAR</span></div>
      </div>

      <section class="dcc-pd-section">
        <div class="dcc-pd-section-head"><div><div class="dcc-pd-section-kicker">TAREAS PENDIENTES</div><div class="dcc-pd-section-sub">ACCIONES QUE REQUIEREN TU ATENCIÓN</div></div></div>
        ${tasks.length?tasks.map(i=>row(i,false)).join(""):`<div class="dcc-pd-empty">NO TIENES TAREAS PENDIENTES. TODO ESTÁ AL DÍA.</div>`}
      </section>

      <section class="dcc-pd-section dcc-pd-attention">
        <div class="dcc-pd-section-head"><div><div class="dcc-pd-section-kicker">REQUIEREN ATENCIÓN</div><div class="dcc-pd-section-sub">SEÑALES DE SEGUIMIENTO DETECTADAS AUTOMÁTICAMENTE</div></div></div>
        ${attention.length?attention.map(i=>row(i,true)).join(""):`<div class="dcc-pd-empty">NO HAY CLIENTES QUE REQUIERAN SEGUIMIENTO ESPECIAL AHORA MISMO.</div>`}
      </section>

      <section class="dcc-pd-banner"><span class="dcc-pd-trophy">♛</span><div><small>CADA CLIENTE ES UN PROCESO.</small><strong>TÚ MARCAS LA DIFERENCIA.</strong></div></section>
    </div>`;
  }

  function activateCoachNav(screen){
    const nav=document.getElementById("coach-nav"); if(!nav) return;
    const map={dashboard:0,clients:1,checkins:3,messages:4};
    nav.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
    const i=map[screen]; if(i!==undefined) nav.querySelectorAll("button")[i]?.classList.add("active");
  }

  function svg(icon){
    const map={
      panel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
      clients:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6"/><path d="M14 15c3-.2 5 1.3 5.5 4.5"/></svg>',
      calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
      check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6M8 11l2 2 5-5M8 17h7"/></svg>',
      msg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-4-.9L4 20l1.4-3.4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/></svg>'
    }; return map[icon];
  }

  function installNav(){
    const nav=document.getElementById("coach-nav"); if(!nav) return;
    const expected=["Panel","Clientes","Check-in","Mensajes"];
    const current=[...nav.querySelectorAll("button span")].map(x=>x.textContent.trim());
    if(current.length!==4 || expected.some((x,i)=>current[i]!==x)){
      nav.innerHTML=`
        <button onclick="showCoach('dashboard')">${svg("panel")}<span>Panel</span></button>
        <button onclick="showCoach('clients')">${svg("clients")}<span>Clientes</span></button>
        <button onclick="showCoach('checkins')">${svg("check")}<span>Check-in</span></button>
        <button onclick="showCoach('messages')">${svg("msg")}<span>Mensajes</span></button>`;
    }
    nav.style.setProperty("grid-template-columns","repeat(4,minmax(0,1fr))","important");
  }

  function guardCoachNav(){
    const nav=document.getElementById("coach-nav"); if(!nav||nav.__dccGuard) return;
    nav.__dccGuard=true;
    new MutationObserver(()=>installNav()).observe(nav,{childList:true,subtree:true});
    if(typeof window.buildCoachNav==="function"&&!window.buildCoachNav.__dccPremium){
      const originalBuild=window.buildCoachNav;
      const wrappedBuild=function(){ const r=originalBuild.apply(this,arguments); installNav(); return r; };
      wrappedBuild.__dccPremium=true;
      window.buildCoachNav=wrappedBuild;
    }
  }

  function install(){
    injectStyles();
    installNav();
    guardCoachNav();
    const original=window.showCoach;
    if(typeof original!=="function"||original.__dccPremium) return;
    const wrapped=function(screen){
      if(screen==="dashboard"){
        window.currentScreen=screen;
        renderDashboard();
        activateCoachNav(screen);
        return;
      }
      const main=document.getElementById("coach-main"); if(main) main.classList.remove("dcc-premium-dashboard");
      const result=original.apply(this,arguments);
      activateCoachNav(screen);
      return result;
    };
    wrapped.__dccPremium=true;
    wrapped.__original=original;
    window.showCoach=wrapped;
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>setTimeout(install,0));
  else setTimeout(install,0);
  window.addEventListener("load",()=>setTimeout(install,50));
})();
