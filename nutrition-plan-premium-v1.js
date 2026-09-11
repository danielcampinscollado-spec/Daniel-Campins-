/* DCC — Gestión premium de planes de alimentación */
(function(){
  'use strict';
  if(window.__dccNutritionPlanPremiumV1)return;
  window.__dccNutritionPlanPremiumV1=true;

  const GOLD='#e0ad4c', GOLD2='#f4cf69';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone=v=>JSON.parse(JSON.stringify(v??null));
  const fmtDate=v=>{const d=v?new Date(v):new Date();return Number.isNaN(d.getTime())?'—':d.toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})};
  let legacy=null;

  function installCss(){
    if(document.getElementById('dcc-nutrition-plan-premium-css'))return;
    const s=document.createElement('style');
    s.id='dcc-nutrition-plan-premium-css';
    s.textContent=`
    .dcc-np-shell{display:grid;gap:12px;margin-top:6px}.dcc-np-section-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:2px 3px 0}.dcc-np-section-head h2{margin:0;font-size:20px;letter-spacing:-.5px}.dcc-np-status{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border:1px solid rgba(75,212,154,.42);border-radius:999px;background:rgba(75,212,154,.08);color:#62dca7;font-size:10px;font-weight:850}.dcc-np-status::before{content:'';width:7px;height:7px;border-radius:50%;background:#62dca7;box-shadow:0 0 12px rgba(98,220,167,.55)}
    .dcc-np-card{position:relative;overflow:hidden;padding:16px;border:1px solid rgba(224,173,76,.42);border-radius:22px;background:radial-gradient(circle at 100% 0,rgba(224,173,76,.11),transparent 35%),linear-gradient(145deg,#12181d,#080c0f);box-shadow:0 18px 50px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.035)}.dcc-np-card::after{content:'';position:absolute;left:0;right:0;top:0;height:1px;background:linear-gradient(90deg,transparent,rgba(244,207,105,.7),transparent)}
    .dcc-np-planline{display:grid;grid-template-columns:44px 1fr auto;align-items:center;gap:12px}.dcc-np-icon{width:44px;height:44px;display:grid;place-items:center;border:1px solid rgba(244,207,105,.35);border-radius:14px;background:rgba(224,173,76,.08);color:${GOLD2};font-size:20px}.dcc-np-plantext b{display:block;font-size:15px}.dcc-np-plantext span{display:block;margin-top:4px;color:#8e98a3;font-size:10px}.dcc-np-chevron{color:${GOLD2};font-size:20px}.dcc-np-meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:13px}.dcc-np-meta div{padding:10px 11px;border:1px solid #252e35;border-radius:13px;background:#0a0f13}.dcc-np-meta small{display:block;color:#7f8994;font-size:9px}.dcc-np-meta b{display:block;margin-top:4px;font-size:11px}
    .dcc-np-actions{display:grid;gap:8px}.dcc-np-btn{width:100%;min-height:52px;display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:10px;padding:8px 12px;border-radius:15px;font-weight:850;text-align:left}.dcc-np-btn .ico{width:32px;height:32px;display:grid;place-items:center;border-radius:10px}.dcc-np-btn span small{display:block;margin-top:2px;font-size:9px;font-weight:600;opacity:.7}.dcc-np-btn.primary{border:1px solid ${GOLD2};background:linear-gradient(135deg,#f4d473,#dfa943);color:#0a0906;box-shadow:0 11px 28px rgba(224,173,76,.16)}.dcc-np-btn.primary .ico{background:rgba(0,0,0,.09)}.dcc-np-btn.secondary{border:1px solid #303a43;background:linear-gradient(145deg,#0e1418,#090d10);color:#f3f1ec}.dcc-np-btn.secondary .ico{border:1px solid #37424b;color:${GOLD2};background:#0a0e11}.dcc-np-btn .arr{font-size:18px;color:inherit}.dcc-np-btn:active{transform:scale(.99)}
    .dcc-np-history-title{margin:8px 3px 0;font-size:13px;color:#dcd8d0}.dcc-np-history{display:grid;gap:7px}.dcc-np-history-item{display:grid;grid-template-columns:38px 1fr auto;align-items:center;gap:10px;padding:12px;border:1px solid #28323a;border-radius:15px;background:#0a0f13;color:#f2f0eb;text-align:left}.dcc-np-history-item b{display:block;font-size:12px}.dcc-np-history-item small{display:block;margin-top:3px;color:#8f99a4;font-size:9px}.dcc-np-empty{padding:18px;border:1px dashed #35404a;border-radius:16px;color:#8f99a4;text-align:center;font-size:11px}
    .dcc-np-flow-head{display:flex;align-items:center;gap:10px;margin:2px 0 12px}.dcc-np-back{width:38px;height:38px;border:1px solid #34404a;border-radius:12px;background:#0a0f13;color:#eee}.dcc-np-flow-head h2{margin:0;font-size:19px}.dcc-np-flow-head p{margin:3px 0 0;color:#8f99a4;font-size:10px}.dcc-np-choice{width:100%;display:grid;grid-template-columns:46px 1fr auto;align-items:center;gap:12px;padding:15px;border:1px solid #303a43;border-radius:18px;background:linear-gradient(145deg,#10161a,#090d10);color:#f4f2ed;text-align:left;margin-bottom:8px}.dcc-np-choice.gold{border-color:rgba(224,173,76,.6);background:radial-gradient(circle at 100% 0,rgba(224,173,76,.12),transparent 38%),linear-gradient(145deg,#151813,#0a0d0e)}.dcc-np-choice .bigico{width:46px;height:46px;display:grid;place-items:center;border:1px solid #3a454f;border-radius:50%;font-size:21px;color:${GOLD2}}.dcc-np-choice b{display:block;font-size:14px}.dcc-np-choice small{display:block;margin-top:5px;color:#929ba6;font-size:10px;line-height:1.4}.dcc-np-note{margin-top:12px;padding:12px 13px;border:1px solid #28333c;border-radius:14px;background:#0a1014;color:#9ba4ae;font-size:10px;line-height:1.5}
    .dcc-np-editor-top{margin-bottom:10px}.dcc-np-editor-top .dcc-np-flow-head{margin-bottom:7px}.dcc-np-editor-badge{margin-left:48px;color:${GOLD2};font-size:10px;font-weight:800}
    @media(max-width:520px){.dcc-np-section-head h2{font-size:18px}.dcc-np-card{padding:14px}.dcc-np-meta{grid-template-columns:1fr 1fr}.dcc-np-btn{min-height:54px}.dcc-np-choice{padding:13px}.dcc-np-planline{grid-template-columns:40px 1fr auto}.dcc-np-icon{width:40px;height:40px}}
    `;
    document.head.appendChild(s);
  }

  function pane(){const w=document.querySelector('#coach-main .dcc-ca-wrap');return w?w.lastElementChild:null}
  function clientName(id){const c=(window.data?.clients||[]).find(x=>String(x.id)===String(id));return c?.name||'Cliente'}
  function currentPlan(id){return window.data?.diets?.[id]||null}
  function hasPlan(id){const p=currentPlan(id);return !!(p&&(['training','rest'].some(k=>Array.isArray(p?.[k]?.meals)&&p[k].meals.length)))}
  function planCounts(id){const p=currentPlan(id)||{},tm=p?.training?.meals?.length||0,rm=p?.rest?.meals?.length||0;return{tm,rm}}
  function historyKey(id){return 'dcc:diet-history:v1:'+id}
  function history(id){try{const a=JSON.parse(localStorage.getItem(historyKey(id))||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
  function setHistory(id,a){try{localStorage.setItem(historyKey(id),JSON.stringify(a.slice(0,20)))}catch(e){};window.data.dietHistory=window.data.dietHistory||{};window.data.dietHistory[id]=a.slice(0,20);if(typeof window.saveData==='function')window.saveData()}
  function archiveCurrent(id,label='Plan anterior'){
    if(!hasPlan(id))return;
    const a=history(id), now=new Date().toISOString();
    a.unshift({id:'diet-'+Date.now(),label,archivedAt:now,plan:clone(currentPlan(id))});
    setHistory(id,a);
  }
  async function persistType(id,t){
    try{
      const d=window.data?.diets?.[id]?.[t];if(!d||!window.supabaseClient)return;
      await window.supabaseClient.from('client_diets').upsert({client_id:id,diet_type:t,calories:d.calories||'',protein:d.protein||'',meals:d.meals||[],updated_at:new Date().toISOString()},{onConflict:'client_id,diet_type'});
    }catch(e){console.error('No se pudo guardar el nuevo plan:',e)}
  }
  async function persistPlan(id){if(typeof window.saveData==='function')window.saveData();await Promise.all(['training','rest'].map(t=>persistType(id,t)))}
  function defaultDay(){return{calories:'',protein:'',meals:[]}}

  function renderOverview(id){
    legacy(id,'food');installCss();
    const p=pane();if(!p)return;
    const exists=hasPlan(id), c=planCounts(id), h=history(id), now=fmtDate(new Date());
    p.innerHTML=`<div class="dcc-np-shell">
      <div class="dcc-np-section-head"><h2>Plan de alimentación</h2><span class="dcc-np-status">${exists?'Activo':'Sin configurar'}</span></div>
      <section class="dcc-np-card">
        <div class="dcc-np-planline"><span class="dcc-np-icon">▣</span><div class="dcc-np-plantext"><b>${exists?'Plan actual':'Todavía no hay un plan'}</b><span>${exists?'Día de entrenamiento + Día de descanso':'Crea el primer plan alimenticio del cliente'}</span></div><span class="dcc-np-chevron">›</span></div>
        <div class="dcc-np-meta"><div><small>Día de entrenamiento</small><b>${c.tm} ${c.tm===1?'comida':'comidas'}</b></div><div><small>Día de descanso</small><b>${c.rm} ${c.rm===1?'comida':'comidas'}</b></div></div>
      </section>
      <div class="dcc-np-actions">
        ${exists?`<button class="dcc-np-btn primary" onclick="dccNutritionEdit('${id}')"><span class="ico">✎</span><span>Editar plan actual<small>Modifica comidas, opciones y cantidades</small></span><span class="arr">›</span></button>`:''}
        <button class="dcc-np-btn ${exists?'secondary':'primary'}" onclick="dccNutritionNewMenu('${id}')"><span class="ico">＋</span><span>${exists?'Crear / renovar plan':'Crear plan de alimentación'}<small>${exists?'Empieza uno nuevo o usa el actual como base':'Configura entrenamiento y descanso'}</small></span><span class="arr">›</span></button>
        ${exists?`<button class="dcc-np-btn secondary" onclick="dccNutritionDuplicate('${id}')"><span class="ico">▣</span><span>Duplicar plan actual<small>Crea una copia editable sin perder la versión anterior</small></span><span class="arr">›</span></button>`:''}
      </div>
      <div class="dcc-np-history-title">Historial de planes</div>
      <div class="dcc-np-history">${h.length?h.slice(0,5).map((x,i)=>`<button class="dcc-np-history-item" onclick="dccNutritionHistoryView('${id}',${i})"><span class="dcc-np-icon" style="width:38px;height:38px;font-size:16px">↺</span><span><b>${esc(x.label||'Plan anterior')}</b><small>Archivado ${fmtDate(x.archivedAt)}</small></span><span class="dcc-np-chevron">›</span></button>`).join(''):`<div class="dcc-np-empty">Aquí aparecerán las dietas anteriores cuando renueves un plan.</div>`}</div>
    </div>`;
  }

  function renderNewMenu(id){
    legacy(id,'food');installCss();const p=pane();if(!p)return;
    p.innerHTML=`<div class="dcc-np-shell"><div class="dcc-np-flow-head"><button class="dcc-np-back" onclick="dccNutritionHome('${id}')">←</button><div><h2>Crear / renovar plan</h2><p>Elige cómo quieres preparar la nueva dieta de ${esc(clientName(id))}.</p></div></div>
      <button class="dcc-np-choice gold" onclick="dccNutritionCreateBlank('${id}')"><span class="bigico">＋</span><span><b>Crear desde cero</b><small>Empieza un plan completamente nuevo para el cliente.</small></span><span class="dcc-np-chevron">›</span></button>
      ${hasPlan(id)?`<button class="dcc-np-choice" onclick="dccNutritionRenewFromCurrent('${id}')"><span class="bigico">↻</span><span><b>Renovar usando el plan actual</b><small>Guarda el plan anterior en el historial y abre una copia para modificarla.</small></span><span class="dcc-np-chevron">›</span></button>`:''}
      <div class="dcc-np-note">Al renovar, el plan anterior se conserva en el historial. Así puedes revisar qué dieta llevaba antes el cliente y recuperar una versión si lo necesitas.</div></div>`;
  }

  function renderEditor(id){
    legacy(id,'food');installCss();const p=pane();if(!p)return;
    const top=document.createElement('div');top.className='dcc-np-editor-top';top.innerHTML=`<div class="dcc-np-flow-head"><button class="dcc-np-back" onclick="dccNutritionHome('${id}')">←</button><div><h2>Editar plan alimenticio</h2><p>Modifica el plan actual sin salir del cliente.</p></div></div><div class="dcc-np-editor-badge">Los cambios se guardan en el plan activo</div>`;p.prepend(top);
  }

  function renderHistoryItem(id,index){
    legacy(id,'food');installCss();const p=pane();if(!p)return;const h=history(id),x=h[index];if(!x){renderOverview(id);return}const tr=x.plan?.training?.meals?.length||0,rs=x.plan?.rest?.meals?.length||0;
    p.innerHTML=`<div class="dcc-np-shell"><div class="dcc-np-flow-head"><button class="dcc-np-back" onclick="dccNutritionHome('${id}')">←</button><div><h2>${esc(x.label||'Plan anterior')}</h2><p>Archivado ${fmtDate(x.archivedAt)}</p></div></div><section class="dcc-np-card"><div class="dcc-np-plantext"><b>Resumen del plan archivado</b><span>Esta versión ya no modifica el plan actual.</span></div><div class="dcc-np-meta"><div><small>Día de entrenamiento</small><b>${tr} ${tr===1?'comida':'comidas'}</b></div><div><small>Día de descanso</small><b>${rs} ${rs===1?'comida':'comidas'}</b></div></div></section><button class="dcc-np-btn primary" onclick="dccNutritionRestore('${id}',${index})"><span class="ico">↺</span><span>Recuperar este plan<small>El plan actual se archivará antes de restaurarlo</small></span><span class="arr">›</span></button></div>`;
  }

  window.dccNutritionHome=id=>renderOverview(id);
  window.dccNutritionEdit=id=>renderEditor(id);
  window.dccNutritionNewMenu=id=>renderNewMenu(id);
  window.dccNutritionDuplicate=async id=>{archiveCurrent(id,'Plan anterior · antes de duplicar');window.data.diets[id]=clone(currentPlan(id));await persistPlan(id);renderEditor(id)};
  window.dccNutritionCreateBlank=async id=>{if(hasPlan(id))archiveCurrent(id,'Plan anterior · antes de crear uno nuevo');window.data.diets=window.data.diets||{};window.data.diets[id]={training:defaultDay(),rest:defaultDay()};await persistPlan(id);renderEditor(id)};
  window.dccNutritionRenewFromCurrent=async id=>{const old=clone(currentPlan(id));archiveCurrent(id,'Plan anterior · renovación');window.data.diets[id]=old;await persistPlan(id);renderEditor(id)};
  window.dccNutritionHistoryView=(id,i)=>renderHistoryItem(id,i);
  window.dccNutritionRestore=async(id,i)=>{const h=history(id),x=h[i];if(!x)return;if(hasPlan(id))archiveCurrent(id,'Plan anterior · antes de restaurar');window.data.diets[id]=clone(x.plan);await persistPlan(id);if(typeof window.toast==='function')window.toast('Plan restaurado');renderOverview(id)};

  function install(){
    if(typeof window.dccClientAdmin!=='function'){setTimeout(install,120);return}
    if(window.dccClientAdmin.__dccNutritionPremium)return;
    legacy=window.dccClientAdmin;
    const wrapped=function(id,tab){if(tab==='food')return renderOverview(id);return legacy(id,tab)};
    wrapped.__dccNutritionPremium=true;wrapped.__legacy=legacy;window.dccClientAdmin=wrapped;
    installCss();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,180));else setTimeout(install,180);
  window.addEventListener('load',()=>setTimeout(install,250));
})();
