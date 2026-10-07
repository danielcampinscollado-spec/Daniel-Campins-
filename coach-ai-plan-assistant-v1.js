/* DCC — asistente IA de planes para entrenador */
(function(){
'use strict';
const BUILD='20261001-ai-plan-assistant-v1';
if(window.__dccAIPlanAssistant===BUILD)return;
window.__dccAIPlanAssistant=BUILD;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=v=>JSON.parse(JSON.stringify(v??null));
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
function appData(){try{return data||{}}catch(_){return window.data||{}}}
function client(id){return(appData().clients||[]).find(x=>String(x.id)===String(id))||null}
function notify(msg){try{if(typeof toast==='function')return toast(msg)}catch(_){}try{return window.toast?.(msg)}catch(_){}}
function css(){
  if(document.getElementById('dcc-ai-plan-css'))return;
  const s=document.createElement('style');s.id='dcc-ai-plan-css';s.textContent=`
  .dcc-ai-plan-launch{width:100%;height:42px;min-height:42px;margin:7px 0 0;padding:0 12px;border:1px solid rgba(183,123,19,.32);border-radius:13px;background:linear-gradient(145deg,#fffdf8,#f7eedf);color:#8d5b08;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 7px 18px rgba(83,63,31,.05)}
  .dcc-ai-plan-launch:active{transform:scale(.99)}
  .dcc-ai-plan-launch .spark{font-size:15px}
  .dcc-ai-overlay{position:fixed;inset:0;z-index:100000;background:rgba(56,44,25,.30);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);display:flex;align-items:flex-end;justify-content:center;padding:12px}
  .dcc-ai-card{width:min(620px,100%);max-height:88vh;overflow:auto;border:1px solid rgba(183,123,19,.34);border-radius:23px 23px 15px 15px;background:linear-gradient(160deg,#fffefa,#f5ecdd);color:#17191d;box-shadow:0 -22px 60px rgba(67,48,20,.18);padding:15px}
  .dcc-ai-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.dcc-ai-kicker{display:inline-flex;padding:5px 8px;border:1px solid rgba(183,123,19,.28);border-radius:999px;background:#fff8e7;color:#9a650b;font-size:8px;font-weight:900;letter-spacing:1.1px}
  .dcc-ai-head h2{margin:7px 0 0;font-size:21px;letter-spacing:-.4px}.dcc-ai-head p{margin:4px 0 0;color:#747b85;font-size:10px;line-height:1.4}
  .dcc-ai-close{width:34px;height:34px;border:1px solid rgba(183,123,19,.27);border-radius:50%;background:#fffaf1;color:#8d5b08;font-size:18px}
  .dcc-ai-context{margin-top:12px;padding:9px 10px;border:1px solid rgba(183,123,19,.18);border-radius:12px;background:#fffaf1;color:#746650;font-size:9px;line-height:1.4}
  .dcc-ai-label{display:block;margin:13px 2px 6px;font-size:10px;font-weight:900;color:#5d5549}.dcc-ai-input{box-sizing:border-box;width:100%;min-height:125px;resize:vertical;border:1px solid rgba(183,123,19,.28);border-radius:14px;background:#fff;color:#17191d;padding:12px;font:500 13px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif;outline:none}.dcc-ai-input:focus{border-color:#d9aa4a;box-shadow:0 0 0 3px rgba(217,170,74,.12)}
  .dcc-ai-chips{display:flex;gap:6px;overflow-x:auto;padding:8px 0 2px}.dcc-ai-chip{flex:none;border:1px solid rgba(183,123,19,.22);border-radius:999px;background:#fffdf8;color:#735219;padding:7px 9px;font-size:9px;font-weight:800}
  .dcc-ai-actions{display:grid;grid-template-columns:1fr 1.5fr;gap:8px;margin-top:13px}.dcc-ai-actions button{height:44px;border-radius:13px;font-size:11px;font-weight:900}.dcc-ai-cancel{border:1px solid rgba(183,123,19,.23);background:#fffdf8;color:#5b544a}.dcc-ai-generate{border:1px solid #d7a33d;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17120a}
  .dcc-ai-generate[disabled]{opacity:.58;cursor:wait}.dcc-ai-status{display:none;margin-top:10px;padding:10px;border:1px solid rgba(183,123,19,.18);border-radius:12px;background:#fff8e8;color:#795714;font-size:10px;line-height:1.4}.dcc-ai-status.on{display:block}
  .dcc-ai-note{margin-top:9px;color:#7b828c;font-size:8.5px;line-height:1.45;text-align:center}
  @media(max-width:390px){.dcc-ai-card{padding:13px}.dcc-ai-head h2{font-size:19px}.dcc-ai-input{min-height:115px}.dcc-ai-actions{grid-template-columns:1fr 1.35fr}}
  `;document.head.appendChild(s);
}
function selectedId(){return String(window.selectedClient??window.currentClientId??'')}
function launchButton(kind,id){
  const b=document.createElement('button');b.type='button';b.className='dcc-ai-plan-launch';b.dataset.dccAiPlan=kind;
  b.innerHTML='<span class="spark">✦</span><span>'+(kind==='routine'?'Crear rutina con IA':'Crear dieta con IA')+'</span>';
  b.addEventListener('click',()=>window.dccAIPlanOpen(kind,id));return b;
}
function inject(){
  css();
  if(window.currentApp!=='coach')return;
  const id=selectedId();if(!id)return;
  const pane=document.getElementById('dcc-coach-client-pane');if(!pane)return;
  const training=pane.querySelector('.dcc-tr-overview-actions');
  if(training&&!pane.querySelector('[data-dcc-ai-plan="routine"]'))training.insertAdjacentElement('afterend',launchButton('routine',id));
  const nutrition=pane.querySelector('.dcc-n2-actions')||(!window.__dccDietEditing?pane.querySelector('.dcc-ca-summary-actions'):null);
  if(nutrition&&!pane.querySelector('[data-dcc-ai-plan="diet"]'))nutrition.insertAdjacentElement('afterend',launchButton('diet',id));
  if(window.__dccDietEditing&&String(window.__dccAIDietDraftClient||'')===id&&!pane.querySelector('[data-dcc-ai-discard="diet"]')){
    const b=document.createElement('button');b.type='button';b.className='dcc-ai-plan-launch';b.dataset.dccAiDiscard='diet';b.textContent='Descartar borrador IA';b.addEventListener('click',()=>window.dccAIDiscardDietDraft(id));pane.prepend(b);
  }
}
function placeholders(kind){
  return kind==='routine'
    ?['4 días, hipertrofia, prioridad pecho y espalda, sesiones de 60 min.','Rutina de 3 días para ganar fuerza e hipertrofia, sin sentadilla libre.','5 días, prioridad glúteo y tren inferior, incluye alguna superserie.']
    :['Déficit moderado, 5 comidas, alimentos sencillos y 2 opciones por comida.','Plan de mantenimiento, 4 comidas, fácil de preparar y con día de descanso.','5 comidas, alto en proteína, variedad y cantidades en gramos.'];
}
function defaultPlaceholder(kind){
  return kind==='routine'
    ?'Ej.: 4 días, hipertrofia, prioridad pecho y espalda, sesiones de 60 minutos, evita sentadilla libre y usa superseries solo en brazos.'
    :'Ej.: déficit moderado, 5 comidas, 2 alternativas por comida, alimentos sencillos, no quiero pescado por la noche.';
}
function contextText(kind,id){
  const c=client(id)||{},parts=[];
  if(c.goal)parts.push('Objetivo: '+c.goal);
  if(kind==='routine'&&c.preferred_training_days)parts.push('Días indicados: '+c.preferred_training_days);
  if(kind==='routine'&&c.training_experience)parts.push('Experiencia: '+c.training_experience);
  if(c.current_injury&&c.injury_details)parts.push('Lesión registrada');
  if(kind==='diet'&&(c.food_allergy||c.foods_to_avoid||c.foodsToAvoid))parts.push('Restricciones alimentarias registradas');
  return parts.length?parts.join(' · '):'La IA utilizará los datos disponibles del cuestionario del cliente.';
}
window.dccAIPlanClose=function(){document.getElementById('dcc-ai-plan-overlay')?.remove()};
window.dccAIPlanFill=function(text){const el=document.getElementById('dcc-ai-instructions');if(el){el.value=text;el.focus()}};
window.dccAIPlanOpen=function(kind,id){
  if(kind!=='routine'&&kind!=='diet')return;
  id=String(id||selectedId());if(!id)return;
  window.dccAIPlanClose();css();
  const overlay=document.createElement('div');overlay.id='dcc-ai-plan-overlay';overlay.className='dcc-ai-overlay';
  const title=kind==='routine'?'Crear rutina con IA':'Crear dieta con IA';
  overlay.innerHTML=`<div class="dcc-ai-card" role="dialog" aria-modal="true"><div class="dcc-ai-head"><div><span class="dcc-ai-kicker">IA · DCC FITNESS</span><h2>${title}</h2><p>Describe lo que quieres. Recibirás un borrador editable, nunca se enviará automáticamente.</p></div><button class="dcc-ai-close" type="button" onclick="dccAIPlanClose()">×</button></div><div class="dcc-ai-context">${esc(contextText(kind,id))}</div><label class="dcc-ai-label" for="dcc-ai-instructions">¿Qué quieres preparar?</label><textarea id="dcc-ai-instructions" class="dcc-ai-input" maxlength="1400" placeholder="${esc(defaultPlaceholder(kind))}"></textarea><div class="dcc-ai-chips">${placeholders(kind).map(x=>`<button type="button" class="dcc-ai-chip" data-ai-chip="${esc(x)}">${esc(x)}</button>`).join('')}</div><div id="dcc-ai-status" class="dcc-ai-status"></div><div class="dcc-ai-actions"><button type="button" class="dcc-ai-cancel" onclick="dccAIPlanClose()">Cancelar</button><button id="dcc-ai-generate" type="button" class="dcc-ai-generate">✦ Generar borrador</button></div><div class="dcc-ai-note">Revisa siempre el plan antes de guardarlo o enviarlo al cliente.</div></div>`;
  overlay.addEventListener('click',e=>{if(e.target===overlay)window.dccAIPlanClose()});
  overlay.querySelectorAll('[data-ai-chip]').forEach(b=>b.addEventListener('click',()=>window.dccAIPlanFill(b.dataset.aiChip||'')));
  overlay.querySelector('#dcc-ai-generate').addEventListener('click',()=>generate(kind,id));
  document.body.appendChild(overlay);
  setTimeout(()=>document.getElementById('dcc-ai-instructions')?.focus(),60);
};
function catalog(){
  let lib=[];try{lib=Array.isArray(exerciseLibraryFull)?exerciseLibraryFull:[]}catch(_){lib=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[]}
  return lib.map(x=>({id:String(x?.id??''),name:String(x?.name??x?.nombre??''),muscle:String(x?.muscle??x?.group??''),equipment:String(x?.equipment??'')})).filter(x=>x.id&&x.name);
}
function libraryHit(name,muscle){
  let lib=[];try{lib=Array.isArray(exerciseLibraryFull)?exerciseLibraryFull:[]}catch(_){lib=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[]}
  const n=norm(name),m=norm(muscle);
  return lib.find(x=>norm(x?.name??x?.nombre)===n)||lib.find(x=>n&&norm(x?.name??x?.nombre).includes(n)&&(!m||norm(x?.muscle).includes(m)))||null;
}
function mapRoutine(result){
  return (result?.routine||[]).map((d,di)=>({
    day:di+1,
    name:String(d?.title||'Día '+(di+1)),
    muscleGroups:Array.isArray(d?.muscles)?d.muscles:[],
    muscles:Array.isArray(d?.muscles)?d.muscles:[],
    muscle:Array.isArray(d?.muscles)&&d.muscles.length?d.muscles.join(' · '):String(d?.title||'Día '+(di+1)),
    exercises:(d?.exercises||[]).map((x,ei)=>{
      const lib=(()=>{try{return Array.isArray(exerciseLibraryFull)?exerciseLibraryFull:[]}catch(_){return Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[]}})();
      const stableId=String(x?.library_id??x?.libraryId??'').trim();
      const hit=(stableId?lib.find(item=>String(item?.id??'')===stableId):null)||libraryHit(x?.name,x?.muscle);
      const method=String(x?.method||'normal');
      const ex={
        libraryId:hit?.id??stableId??null,
        name:String(hit?.name??hit?.nombre??x?.name??'Ejercicio'),
        muscle:String(hit?.muscle??x?.muscle??''),
        image:String(hit?.image??hit?.imageStart??''),
        sets:String(Math.max(1,Number(x?.sets)||1)),
        reps:String(x?.reps||''),
        restBetweenSets:Math.max(0,Number(x?.rest_between_sets)||0),
        restBetweenExercises:Math.max(0,Number(x?.rest_between_exercises)||0)
      };
      if(method==='superset'){
        const group=String(x?.method_group||'A').replace(/[^a-z0-9_-]/gi,'').slice(0,18)||'A';
        ex.supersetId='ai-'+di+'-'+group;
        ex.supersetRounds=ex.sets;
        ex.supersetRest=ex.restBetweenExercises;
        ex.restBetweenSets=0;
      }else if(method==='rest_pause'){
        ex.restPause=true;
        ex.restPauseReps=String(x?.rest_pause_sequence||x?.reps||'');
        ex.restPauseSeconds=Math.max(1,Number(x?.rest_pause_seconds)||7);
        ex.restPauseFinalRest=ex.restBetweenExercises;
      }
      return ex;
    })
  }));
}
function mapDiet(result){
  const block=x=>({
    calories:String(x?.calories||''),
    protein:String(x?.protein||''),
    meals:(x?.meals||[]).map(m=>({
      name:String(m?.name||'Comida'),
      options:(m?.options||[]).map((o,oi)=>({
        name:String(o?.name||'Opción '+(oi+1)),
        foods:(o?.foods||[]).map(f=>[String(f?.name||''),String(f?.quantity||'')]).filter(f=>f[0]&&f[1])
      }))
    }))
  });
  return{training:block(result?.diet?.training||{}),rest:block(result?.diet?.rest||{})};
}
function applyRoutine(id,draft){
  const d=appData();d.routines=d.routines||{};
  window.__dccTrainingBackup=JSON.stringify(d.routines[id]??null);
  d.routines[id]=mapRoutine(draft);
  window.__dccTrainingEdit=true;window.__dccTrainingOpen=0;
  try{window.dccMarkTrainingDraftDirty?.(id)}catch(_){}
  if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'training');
  notify('Borrador de rutina generado. Revísalo antes de guardar.');
}
function applyDiet(id,draft){
  const d=appData();d.diets=d.diets||{};
  window.__dccAIDietBackup=JSON.stringify(d.diets[id]??null);
  window.__dccAIDietDraftClient=String(id);
  d.diets[id]=mapDiet(draft);
  window.__dccDietType='training';window.__dccDietEditing=true;window.__dccDietOpenMeal=null;
  if(typeof window.dccNutritionV2Edit==='function')window.dccNutritionV2Edit(id);
  else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
  notify('Borrador de dieta generado. Revísalo antes de enviar.');
}
window.dccAIDiscardDietDraft=function(id){
  id=String(id||selectedId());if(!id||String(window.__dccAIDietDraftClient||'')!==id)return;
  const d=appData();d.diets=d.diets||{};
  try{
    const previous=JSON.parse(window.__dccAIDietBackup);
    if(previous===null)delete d.diets[id];else d.diets[id]=previous;
  }catch(_){}
  delete window.__dccAIDietBackup;delete window.__dccAIDietDraftClient;
  window.__dccDietEditing=false;window.__dccDietOpenMeal=null;
  if(typeof window.dccNutritionV2Home==='function')window.dccNutritionV2Home(id);
  else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
  notify('Borrador IA descartado.');
};
async function generate(kind,id){
  const input=document.getElementById('dcc-ai-instructions'),button=document.getElementById('dcc-ai-generate'),status=document.getElementById('dcc-ai-status');
  const instructions=String(input?.value||'').trim();
  if(instructions.length<3){status.textContent='Escribe primero cómo quieres el plan.';status.classList.add('on');input?.focus();return}
  button.disabled=true;button.textContent='Generando…';status.textContent='Preparando el borrador con los datos del cliente…';status.classList.add('on');
  try{
    if(!window.supabaseClient)throw new Error('No hay conexión segura con Supabase');
    const {data:s,error}=await window.supabaseClient.auth.getSession();if(error)throw error;
    const token=s?.session?.access_token;if(!token)throw new Error('La sesión del entrenador ha caducado');
    const body={kind,clientId:String(id),instructions};if(kind==='routine')body.exerciseCatalog=catalog();
    const response=await fetch('/api/ai-plan',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(body)});
    const payload=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(payload?.error||'No se pudo generar el borrador');
    window.dccAIPlanClose();
    if(kind==='routine')applyRoutine(id,payload.draft);else applyDiet(id,payload.draft);
  }catch(error){
    console.error('DCC AI assistant:',error);
    status.textContent=error?.message||'No se pudo generar el borrador. Inténtalo de nuevo.';
    status.classList.add('on');
    button.disabled=false;button.textContent='✦ Generar borrador';
  }
}
let raf=0;function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;inject()})}
const observer=new MutationObserver(schedule);
function start(){css();observer.observe(document.documentElement,{childList:true,subtree:true});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();