/* DCC — Panel entrenador premium aprobado */
(function(){
  const GOLD="#d9aa4a";
  const GOLD2="#f0c96b";

  function escText(value){
    return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  function injectStyles(){
    if(document.getElementById("dcc-coach-premium-styles-v3")) return;
    const style=document.createElement("style");
    style.id="dcc-coach-premium-styles-v3";
    style.textContent=`
      #coach-main.dcc-premium-dashboard{padding:6px 12px 88px!important;background:#07090c!important;}
      .dcc-pd{max-width:980px;margin:0 auto;color:#f6f3ed;}
      .dcc-pd *{box-sizing:border-box;}

      .dcc-pd-hero{position:relative;overflow:hidden;min-height:194px;padding:14px 14px 12px;border:0;border-radius:0;background:
        radial-gradient(ellipse at 79% 37%,rgba(225,173,68,.19),transparent 29%),
        radial-gradient(ellipse at 73% 52%,rgba(255,255,255,.045),transparent 25%),
        linear-gradient(108deg,#030405 0%,#080a0c 58%,#020303 100%);}
      .dcc-pd-hero:after{content:"";position:absolute;right:-12px;top:4px;width:46%;height:185px;pointer-events:none;background:
        radial-gradient(ellipse at 55% 42%,rgba(232,180,73,.22),transparent 21%),
        radial-gradient(ellipse at 58% 64%,rgba(232,180,73,.08),transparent 29%);filter:blur(1px);}
      .dcc-pd-brand{display:flex;align-items:center;gap:10px;position:relative;z-index:2;}
      .dcc-pd-brand img{width:50px;height:auto;filter:drop-shadow(0 3px 15px rgba(217,170,74,.16));}
      .dcc-pd-brand-name{font-size:10px;letter-spacing:3.4px;color:${GOLD2};font-weight:750;}
      .dcc-pd-brand-sub{margin-top:4px;font-size:7px;letter-spacing:2.8px;color:#7e858f;}
      .dcc-pd-title{position:relative;z-index:2;max-width:62%;margin:35px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:33px;line-height:1;font-weight:500;letter-spacing:-.8px;color:#f8f5ef;}
      .dcc-pd-title span{display:block;margin-top:3px;color:${GOLD2};font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Arial,sans-serif;font-weight:800;letter-spacing:-1px;}
      .dcc-pd-title:after{content:"";display:block;width:44px;height:2px;margin-top:13px;background:linear-gradient(90deg,${GOLD2},${GOLD});}

      .dcc-pd-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:5px 0 10px;border:1px solid rgba(217,170,74,.43);border-radius:16px;overflow:hidden;background:linear-gradient(145deg,#10151a,#080b0e);}
      .dcc-pd-stat{min-height:68px;padding:9px 7px;border-right:1px solid rgba(255,255,255,.12);background:transparent;}
      .dcc-pd-stat:last-child{border-right:0;}
      .dcc-pd-stat strong{display:block;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Arial,sans-serif;font-size:20px;line-height:1;font-weight:750;color:#f6f4ef;}
      .dcc-pd-stat span{display:block;margin-top:7px;color:#d0d3d8;font-size:6.8px;line-height:1.3;letter-spacing:.55px;text-transform:uppercase;}

      .dcc-pd-section{margin-top:10px;padding:12px 14px;border:1px solid rgba(217,170,74,.43);border-radius:17px;background:linear-gradient(145deg,#11151a,#090c0f);box-shadow:0 13px 34px rgba(0,0,0,.23);}
      .dcc-pd-section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:4px;}
      .dcc-pd-section-kicker{color:${GOLD2};font-size:10px;font-weight:800;letter-spacing:2.8px;text-transform:uppercase;}
      .dcc-pd-section-sub{margin-top:3px;color:#aeb4bc;font-size:10.5px;line-height:1.35;text-transform:uppercase;}
      .dcc-pd-row{width:100%;display:flex;align-items:center;gap:10px;padding:10px 0;border:0;border-top:1px solid rgba(255,255,255,.075);background:transparent;color:#f5f2ec;text-align:left;}
      .dcc-pd-row:first-of-type{margin-top:7px;}
      .dcc-pd-icon{width:38px;height:38px;flex:0 0 38px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(217,170,74,.2);border-radius:11px;background:rgba(217,170,74,.07);color:${GOLD2};font-size:16px;}
      .dcc-pd-copy{flex:1;min-width:0;}
      .dcc-pd-copy b{display:block;color:#f5f2ec;font-size:12.5px;font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .dcc-pd-copy span{display:block;margin-top:3px;color:#9097a1;font-size:10.3px;line-height:1.35;white-space:normal;}
      .dcc-pd-badge{flex:none;padding:6px 8px;border-radius:9px;font-size:8px;font-weight:800;letter-spacing:.9px;text-transform:uppercase;background:rgba(217,170,74,.08);color:${GOLD2};border:1px solid rgba(217,170,74,.16);}
      .dcc-pd-attention .dcc-pd-badge{background:rgba(224,90,90,.08);color:#f08f82;border-color:rgba(224,90,90,.22);}
      .dcc-pd-arrow{flex:none;color:${GOLD2};font-size:19px;}

      .dcc-pd-empty-ok{text-align:center;padding:7px 0 3px;}
      .dcc-pd-empty-ok .dcc-ok-icon{width:30px;height:30px;margin:2px auto 6px;border:1px solid rgba(217,170,74,.7);border-radius:50%;display:flex;align-items:center;justify-content:center;color:${GOLD2};font-size:16px;}
      .dcc-pd-empty-ok b{display:block;color:#f5f2ec;font-size:11.5px;font-weight:700;}
      .dcc-pd-empty-ok span{display:block;margin-top:3px;color:#858c96;font-size:9.5px;}
      .dcc-pd-empty{padding:7px 0 2px;color:#8a929d;font-size:10px;line-height:1.5;}

      .dcc-pd-banner{position:relative;overflow:hidden;display:flex;align-items:center;gap:12px;min-height:70px;margin-top:10px;padding:10px 14px;border:1px solid rgba(240,201,107,.76);border-radius:17px;background:
        radial-gradient(ellipse at 90% 45%,rgba(232,178,66,.34),transparent 17%),
        radial-gradient(ellipse at 73% 70%,rgba(180,122,28,.23),transparent 24%),
        radial-gradient(ellipse at 16% 46%,rgba(216,158,45,.20),transparent 22%),
        linear-gradient(100deg,#171006 0%,#090a0b 38%,#171006 100%);box-shadow:inset 0 0 32px rgba(211,153,41,.11),0 12px 32px rgba(0,0,0,.27);}
      .dcc-pd-banner:before{content:"";position:absolute;inset:-35%;background:repeating-radial-gradient(ellipse at 72% 50%,rgba(235,187,82,.08) 0 3%,transparent 4% 9%);filter:blur(7px);transform:rotate(-8deg);pointer-events:none;}
      .dcc-pd-trophy{position:relative;z-index:2;flex:none;color:${GOLD2};font-size:22px;text-shadow:0 0 16px rgba(240,201,107,.35);}
      .dcc-pd-banner-copy{position:relative;z-index:2;min-width:0;}
      .dcc-pd-banner small{display:block;color:${GOLD2};font-size:7.3px;font-weight:800;letter-spacing:2.3px;text-transform:uppercase;}
      .dcc-pd-banner strong{display:block;margin-top:4px;color:#faf7ef;font-family:Georgia,'Times New Roman',serif;font-size:15px;font-weight:500;letter-spacing:.2px;}

      #coach .side{height:62px!important;left:14px!important;right:14px!important;bottom:10px!important;border-radius:21px!important;padding:0 7px!important;}
      #coach-nav{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:0!important;height:100%!important;}
      #coach-nav button{height:100%!important;padding:5px 2px!important;font-size:8px!important;}
      #coach-nav button svg{width:21px!important;height:21px!important;}
      #coach-nav button span{font-size:7.3px!important;margin-top:2px!important;}

      @media(min-width:701px){
        #coach-main.dcc-premium-dashboard{padding:18px 30px 105px!important;}
        .dcc-pd-hero{min-height:220px;padding:18px 22px;}
        .dcc-pd-title{font-size:42px;}
        .dcc-pd-stat{min-height:76px;padding:12px 13px;}
      }
    `;
    document.head.appendChild(style);
  }

  function daysSince(date){
    if(!date) return null;
    const d=new Date(date);
    if(!Number.isFinite(d.getTime())) return null;
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

      const gap=daysSince(latestWorkout(c.id)?.date);
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
      <span class="dcc-pd-badge">${escText(item.badge)}</span>
      <span class="dcc-pd-arrow">›</span>
    </button>`;
  }

  function renderDashboard(){
    injectStyles();
    const main=document.getElementById("coach-main");
    if(!main) return;
    main.classList.add("dcc-premium-dashboard");

    const clients=data?.clients||[];
    const pending=clients.filter(c=>data?.checkins?.[c.id]?.sentAt&&!data?.checkins?.[c.id]?.reviewed).length;
    const {tasks,attention}=dashboardItems();
    const hour=new Date().getHours();
    const greeting=hour<13?"BUENOS DÍAS":hour<20?"BUENAS TARDES":"BUENAS NOCHES";

    main.innerHTML=`<div class="dcc-pd">
      <section class="dcc-pd-hero">
        <div class="dcc-pd-brand">
          <img src="./dc-stride-logo.svg.svg" alt="DC">
          <div><div class="dcc-pd-brand-name">DANIEL CAMPINS</div><div class="dcc-pd-brand-sub">TRAINING PLATFORM</div></div>
        </div>
        <h1 class="dcc-pd-title">${greeting},<span>DANIEL</span></h1>
      </section>

      <div class="dcc-pd-strip">
        <div class="dcc-pd-stat"><strong>${clients.length}</strong><span>CLIENTES</span></div>
        <div class="dcc-pd-stat"><strong>${pending}</strong><span>CHECK-IN PENDIENTES</span></div>
        <div class="dcc-pd-stat"><strong>0</strong><span>RUTINAS POR RENOVAR</span></div>
        <div class="dcc-pd-stat"><strong>0</strong><span>DIETAS POR RENOVAR</span></div>
      </div>

      <section class="dcc-pd-section ${tasks.length?"":"dcc-empty"}">
        <div class="dcc-pd-section-head"><div><div class="dcc-pd-section-kicker">TAREAS PENDIENTES</div><div class="dcc-pd-section-sub">ACCIONES QUE REQUIEREN TU ATENCIÓN</div></div></div>
        ${tasks.length?tasks.map(i=>row(i,false)).join(""):`<div class="dcc-pd-empty-ok"><div class="dcc-ok-icon">✓</div><b>TODO AL DÍA</b><span>NO TIENES TAREAS PENDIENTES EN ESTE MOMENTO.</span></div>`}
      </section>

      <section class="dcc-pd-section dcc-pd-attention">
        <div class="dcc-pd-section-head"><div><div class="dcc-pd-section-kicker">REQUIEREN ATENCIÓN</div><div class="dcc-pd-section-sub">SEÑALES DE SEGUIMIENTO DETECTADAS AUTOMÁTICAMENTE</div></div></div>
        ${attention.length?attention.map(i=>row(i,true)).join(""):`<div class="dcc-pd-empty">NO HAY CLIENTES QUE REQUIERAN SEGUIMIENTO ESPECIAL AHORA MISMO.</div>`}
      </section>

      <section class="dcc-pd-banner"><span class="dcc-pd-trophy">♛</span><div class="dcc-pd-banner-copy"><small>CADA CLIENTE ES UN PROCESO.</small><strong>TÚ MARCAS LA DIFERENCIA.</strong></div></section>
    </div>`;
  }

  function svg(icon){
    const icons={
      panel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
      clients:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6"/><path d="M14 15c3-.2 5 1.3 5.5 4.5"/></svg>',
      calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
      check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6M8 11l2 2 5-5M8 17h7"/></svg>',
      msg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-4-.9L4 20l1.4-3.4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/></svg>'
    };
    return icons[icon]||"";
  }

  function installNav(){
    const nav=document.getElementById("coach-nav");
    if(!nav) return;

    const expected=["Panel","Clientes","Calendario","Check-in","Mensajes"];
    const current=[...nav.querySelectorAll("button span")].map(x=>x.textContent.trim());
    if(current.length!==5 || expected.some((x,i)=>current[i]!==x)){
      nav.innerHTML=`
        <button onclick="showCoach('dashboard')">${svg("panel")}<span>Panel</span></button>
        <button onclick="showCoach('clients')">${svg("clients")}<span>Clientes</span></button>
        <button onclick="toast('Calendario próximamente')">${svg("calendar")}<span>Calendario</span></button>
        <button onclick="showCoach('checkins')">${svg("check")}<span>Check-in</span></button>
        <button onclick="showCoach('messages')">${svg("msg")}<span>Mensajes</span></button>`;
    }
    nav.style.setProperty("grid-template-columns","repeat(5,minmax(0,1fr))","important");
  }

  function activateCoachNav(screen){
    const nav=document.getElementById("coach-nav");
    if(!nav) return;
    const map={dashboard:0,clients:1,checkins:3,messages:4};
    nav.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
    const i=map[screen];
    if(i!==undefined) nav.querySelectorAll("button")[i]?.classList.add("active");
  }

  function guardCoachNav(){
    const nav=document.getElementById("coach-nav");
    if(!nav||nav.__dccGuardV3) return;
    nav.__dccGuardV3=true;
    new MutationObserver(()=>installNav()).observe(nav,{childList:true,subtree:true});
    if(typeof window.buildCoachNav==="function"&&!window.buildCoachNav.__dccPremiumV3){
      const originalBuild=window.buildCoachNav;
      const wrappedBuild=function(){const r=originalBuild.apply(this,arguments);installNav();return r;};
      wrappedBuild.__dccPremiumV3=true;
      window.buildCoachNav=wrappedBuild;
    }
  }

  function install(){
    injectStyles();
    installNav();
    guardCoachNav();

    const original=window.showCoach;
    if(typeof original!=="function"||original.__dccPremiumV3) return;

    const wrapped=function(screen){
      if(screen==="dashboard"){
        window.currentScreen=screen;
        renderDashboard();
        activateCoachNav(screen);
        return;
      }
      const main=document.getElementById("coach-main");
      if(main) main.classList.remove("dcc-premium-dashboard");
      const result=original.apply(this,arguments);
      installNav();
      activateCoachNav(screen);
      return result;
    };
    wrapped.__dccPremiumV3=true;
    wrapped.__original=original;
    window.showCoach=wrapped;
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>setTimeout(install,0));
  else setTimeout(install,0);
  window.addEventListener("load",()=>setTimeout(install,50));
})();
