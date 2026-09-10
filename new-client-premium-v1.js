/* DCC — Nuevo cliente premium v1 */
(function(){
  'use strict';
  if(window.__dccNewClientPremiumV1)return;
  window.__dccNewClientPremiumV1=true;

  const GOLD='#d9aa4a';
  const GOLD2='#f0c96b';

  function appData(){
    try{return data||{}}catch(e){return window.data||{}}
  }
  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}
    return window.supabaseClient||null;
  }
  function notify(text){
    try{if(typeof toast==='function')return toast(text)}catch(e){}
    if(typeof window.toast==='function')window.toast(text);
  }
  function icon(type){
    const icons={
      user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7.5" r="3.2"/><path d="M5.5 20c.5-4.2 2.8-6.2 6.5-6.2s6 2 6.5 6.2"/></svg>',
      weight:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 7h12l2 13H4L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/><path d="M12 11v3"/></svg>',
      age:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
      height:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 18 18 5l2 2L7 20 5 18Z"/><path d="m14 7 3 3M11 10l2 2M8 13l3 3"/></svg>',
      fat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="2.2"/><circle cx="17" cy="17" r="2.2"/><path d="M18.5 5.5 5.5 18.5"/></svg>',
      goal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12 20 4M17 4h3v3"/></svg>'
    };
    return icons[type]||'';
  }

  function injectCss(){
    if(document.getElementById('dcc-new-client-premium-v1-css'))return;
    const style=document.createElement('style');
    style.id='dcc-new-client-premium-v1-css';
    style.textContent=`
      #modal.dcc-new-client-overlay{background:rgba(0,0,0,.76)!important;backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);padding:18px!important}
      #modal.dcc-new-client-overlay .modal-box{
        width:min(100%,620px)!important;max-width:620px!important;max-height:calc(100dvh - 170px)!important;overflow:auto!important;
        padding:22px!important;border:1px solid rgba(240,201,107,.82)!important;border-radius:26px!important;
        background:radial-gradient(circle at 92% 1%,rgba(240,201,107,.10),transparent 27%),linear-gradient(145deg,#11171d 0%,#090d11 62%,#080a0d 100%)!important;
        color:#f7f4ee!important;box-shadow:0 28px 80px rgba(0,0,0,.52),0 0 34px rgba(217,170,74,.09),inset 0 1px 0 rgba(255,255,255,.035)!important;
        scrollbar-width:none
      }
      #modal.dcc-new-client-overlay .modal-box::-webkit-scrollbar{display:none}
      #dcc-new-client-premium{width:100%;box-sizing:border-box}
      #dcc-new-client-premium *{box-sizing:border-box}
      #dcc-new-client-premium .dcc-nc-head{display:grid;grid-template-columns:minmax(0,1fr) 48px;align-items:start;gap:14px;margin-bottom:23px}
      #dcc-new-client-premium .dcc-nc-title{margin:0;background:linear-gradient(92deg,#fff7dc 0%,#f0c96b 58%,#d9aa4a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:30px;line-height:1.02;font-weight:850;letter-spacing:-.7px}
      #dcc-new-client-premium .dcc-nc-sub{margin:9px 0 0;color:#858e99;font-size:8.5px;font-weight:750;letter-spacing:2.7px;text-transform:uppercase}
      #dcc-new-client-premium .dcc-nc-close{width:46px;height:46px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.58);border-radius:14px;background:#0b0f13;color:#f6f4ef;font-size:24px;line-height:1}
      #dcc-new-client-premium .dcc-nc-field{display:block;margin:0 0 15px}
      #dcc-new-client-premium .dcc-nc-label{display:flex;align-items:center;gap:9px;margin:0 0 8px;color:#f1f0ed;font-size:13px;font-weight:760}
      #dcc-new-client-premium .dcc-nc-label svg{width:20px;height:20px;flex:0 0 20px;color:${GOLD2}}
      #dcc-new-client-premium .dcc-nc-input,#dcc-new-client-premium .dcc-nc-select{
        width:100%;height:51px;margin:0!important;padding:0 14px!important;border:1px solid rgba(163,174,186,.42)!important;border-radius:14px!important;
        outline:0!important;background:linear-gradient(145deg,#11171d,#0b1015)!important;color:#f5f2ec!important;-webkit-text-fill-color:#f5f2ec!important;
        font:600 14px/1.2 inherit!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important
      }
      #dcc-new-client-premium .dcc-nc-input::placeholder{color:#6f7782!important;-webkit-text-fill-color:#6f7782!important;opacity:1}
      #dcc-new-client-premium .dcc-nc-input:focus,#dcc-new-client-premium .dcc-nc-select:focus{border-color:${GOLD2}!important;box-shadow:0 0 0 3px rgba(217,170,74,.10)!important}
      #dcc-new-client-premium .dcc-nc-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      #dcc-new-client-premium .dcc-nc-select{-webkit-appearance:none;appearance:none;padding-right:42px!important;cursor:pointer}
      #dcc-new-client-premium .dcc-nc-select-wrap{position:relative}
      #dcc-new-client-premium .dcc-nc-select-wrap:after{content:'⌄';position:absolute;right:15px;top:50%;transform:translateY(-57%);pointer-events:none;color:#9ca5af;font-size:21px}
      #dcc-new-client-premium .dcc-nc-create{width:100%;min-height:55px;margin-top:4px;padding:0 18px;border:1px solid #f4cf6b;border-radius:16px;background:linear-gradient(135deg,#d9a83d 0%,#f4d679 52%,#dfad42 100%);color:#14110a;font-size:16px;font-weight:900;box-shadow:0 12px 30px rgba(217,170,74,.18),inset 0 1px 0 rgba(255,255,255,.4)}
      #dcc-new-client-premium .dcc-nc-create span{margin-left:10px;font-size:23px;vertical-align:-1px}
      #dcc-new-client-premium .dcc-nc-create:disabled{opacity:.62;cursor:wait}
      @media(max-width:390px){
        #modal.dcc-new-client-overlay{padding:12px!important}
        #modal.dcc-new-client-overlay .modal-box{padding:18px!important;max-height:calc(100dvh - 154px)!important;border-radius:23px!important}
        #dcc-new-client-premium .dcc-nc-title{font-size:27px}
        #dcc-new-client-premium .dcc-nc-sub{font-size:7.6px;letter-spacing:2.1px}
        #dcc-new-client-premium .dcc-nc-row{gap:9px}
        #dcc-new-client-premium .dcc-nc-label{font-size:12px}
        #dcc-new-client-premium .dcc-nc-input,#dcc-new-client-premium .dcc-nc-select{height:48px;font-size:13px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function cleanupModal(){
    document.getElementById('modal')?.classList.remove('dcc-new-client-overlay');
  }

  const baseClose=window.closeModal;
  if(typeof baseClose==='function'&&!baseClose.__dccNewClientCleanup){
    const wrapped=function(){cleanupModal();return baseClose.apply(this,arguments)};
    wrapped.__dccNewClientCleanup=true;
    wrapped.__base=baseClose;
    window.closeModal=wrapped;
  }

  window.newClient=function(){
    injectCss();
    if(typeof openModal!=='function'&&typeof window.openModal!=='function')return;
    const show=typeof openModal==='function'?openModal:window.openModal;
    show(`
      <div id="dcc-new-client-premium">
        <div class="dcc-nc-head">
          <div>
            <h2 class="dcc-nc-title">Nuevo cliente</h2>
            <p class="dcc-nc-sub">Añade un nuevo cliente a tu equipo</p>
          </div>
          <button type="button" class="dcc-nc-close" onclick="closeModal()" aria-label="Cerrar">×</button>
        </div>

        <label class="dcc-nc-field">
          <span class="dcc-nc-label">${icon('user')}<span>Nombre y apellidos</span></span>
          <input class="dcc-nc-input" id="new-name" autocomplete="name" placeholder="Nombre y apellidos">
        </label>

        <label class="dcc-nc-field">
          <span class="dcc-nc-label">${icon('weight')}<span>Peso actual</span></span>
          <input class="dcc-nc-input" id="new-weight" inputmode="decimal" placeholder="Ej. 75,5 kg">
        </label>

        <div class="dcc-nc-row">
          <label class="dcc-nc-field">
            <span class="dcc-nc-label">${icon('age')}<span>Edad</span></span>
            <input class="dcc-nc-input" id="new-age" inputmode="numeric" placeholder="Ej. 28">
          </label>
          <label class="dcc-nc-field">
            <span class="dcc-nc-label">${icon('height')}<span>Altura</span></span>
            <input class="dcc-nc-input" id="new-height" inputmode="decimal" placeholder="Ej. 178 cm">
          </label>
        </div>

        <label class="dcc-nc-field">
          <span class="dcc-nc-label">${icon('fat')}<span>% de grasa inicial</span></span>
          <input class="dcc-nc-input" id="new-body-fat" inputmode="decimal" placeholder="Ej. 18,5">
        </label>

        <label class="dcc-nc-field">
          <span class="dcc-nc-label">${icon('goal')}<span>Objetivo</span></span>
          <span class="dcc-nc-select-wrap">
            <select class="dcc-nc-select" id="new-goal">
              <option value="" selected disabled>Selecciona un objetivo</option>
              <option value="Pérdida de grasa">Pérdida de grasa</option>
              <option value="Recomposición corporal">Recomposición corporal</option>
              <option value="Ganancia muscular">Ganancia muscular</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Mejorar rendimiento">Mejorar rendimiento</option>
            </select>
          </span>
        </label>

        <button type="button" id="dcc-create-client-btn" class="dcc-nc-create" onclick="createClient()">Crear cliente <span>→</span></button>
      </div>
    `);
    document.getElementById('modal')?.classList.add('dcc-new-client-overlay');
    setTimeout(()=>document.getElementById('new-name')?.focus(),80);
  };

  window.createClient=async function(){
    const name=document.getElementById('new-name')?.value.trim()||'';
    const weightText=document.getElementById('new-weight')?.value.trim()||'';
    const ageText=document.getElementById('new-age')?.value.trim()||'';
    const heightText=document.getElementById('new-height')?.value.trim()||'';
    const bodyFatText=document.getElementById('new-body-fat')?.value.trim()||'';
    const goal=document.getElementById('new-goal')?.value.trim()||'';

    if(!name||!weightText||!ageText||!heightText||!bodyFatText||!goal){notify('Completa todos los campos');return}

    const weight=parseFloat(weightText.replace(',','.'));
    const age=parseInt(ageText,10);
    const height=parseFloat(heightText.replace(',','.'));
    const bodyFat=parseFloat(bodyFatText.replace(',','.'));

    if(!Number.isFinite(weight)||weight<=0||weight>=500){notify('Introduce un peso válido');return}
    if(!Number.isInteger(age)||age<10||age>100){notify('Introduce una edad válida');return}
    if(!Number.isFinite(height)||height<100||height>250){notify('Introduce una altura válida');return}
    if(!Number.isFinite(bodyFat)||bodyFat<=0||bodyFat>=70){notify('Introduce un % de grasa válido');return}

    const db=database();
    if(!db){notify('No se pudo conectar con la base de datos');return}

    const button=document.getElementById('dcc-create-client-btn');
    if(button){button.disabled=true;button.innerHTML='Creando cliente…'}

    const id='client_'+Date.now();
    try{
      const {error}=await db.from('clients').insert({
        id,
        name,
        goal,
        weight,
        initial_weight:weight,
        initial_body_fat:bodyFat,
        age,
        height_cm:height,
        plan:'',
        status:'Pendiente'
      });
      if(error)throw error;

      const d=appData();
      d.clients=Array.isArray(d.clients)?d.clients:[];
      d.clients.push({id,name,goal,weight,initial:weight,bodyFatInitial:bodyFat,age,heightCm:height,plan:'',status:'Pendiente'});
      d.weights=d.weights||{};d.weights[id]=[weight];
      d.checkins=d.checkins||{};d.checkins[id]={weight:(typeof money==='function'?money(weight):String(weight))+' kg',bodyFat,diet:'Pendiente',training:'Pendiente',comment:'Pendiente de revisión.',reviewed:false};
      d.diets=d.diets||{};d.diets[id]={training:{calories:'',protein:'',meals:[]},rest:{calories:'',protein:'',meals:[]}};
      d.routines=d.routines||{};d.routines[id]=[];
      d.messages=d.messages||{};d.messages[id]=[];

      try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(e){}
      cleanupModal();
      try{if(typeof closeModal==='function')closeModal();else window.closeModal?.()}catch(e){}
      try{if(typeof showCoach==='function')showCoach('clients');else window.showCoach?.('clients')}catch(e){}
      notify('Cliente creado correctamente');
    }catch(e){
      console.error('DCC creando cliente:',e);
      notify('No se pudo guardar el cliente');
      if(button){button.disabled=false;button.innerHTML='Crear cliente <span>→</span>'}
    }
  };

  /* Mantener edad y altura sincronizadas desde Supabase sin añadir espera. */
  const baseLoad=window.loadClientsFromSupabase;
  if(typeof baseLoad==='function'&&!baseLoad.__dccAgeHeightV1){
    const wrapped=async function(){
      const db=database();
      const extra=db?db.from('clients').select('id,age,height_cm'):Promise.resolve({data:[],error:null});
      const result=await baseLoad.apply(this,arguments);
      try{
        const {data:rows,error}=await extra;
        if(!error){
          const d=appData();
          (rows||[]).forEach(row=>{
            const c=(d.clients||[]).find(x=>String(x.id)===String(row.id));
            if(c){c.age=row.age!=null?Number(row.age):null;c.heightCm=row.height_cm!=null?Number(row.height_cm):null}
          });
          try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(e){}
        }
      }catch(e){console.warn('DCC edad/altura clientes:',e)}
      return result;
    };
    wrapped.__dccAgeHeightV1=true;
    wrapped.__base=baseLoad;
    window.loadClientsFromSupabase=wrapped;
  }
})();
