/* DCC — cuestionario inicial de cliente. Autoridad de onboarding. */
(function(){
'use strict';if(window.__dccInitialQuestionnaireV1)return;window.__dccInitialQuestionnaireV1=true;
const db=()=>window.supabaseClient||null;
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const num=id=>{const n=parseFloat(String(document.getElementById(id)?.value||'').replace(',','.'));return Number.isFinite(n)?n:null};
function css(){if(document.getElementById('dcc-initial-questionnaire-v1-css'))return;const s=document.createElement('style');s.id='dcc-initial-questionnaire-v1-css';s.textContent=`
#client-main .dcc-iq{max-width:680px;margin:0 auto;padding:8px 0 110px;color:#17191d}
.dcc-iq-head{margin:4px 0 20px}.dcc-iq-kicker{font-size:10px;font-weight:900;letter-spacing:2px;color:#a87417}.dcc-iq h1{font-size:30px;line-height:1.05;margin:7px 0}.dcc-iq-intro{color:#747b86;font-size:14px;line-height:1.45;margin:0}
.dcc-iq-card{background:rgba(255,255,255,.72);border:1px solid rgba(191,143,52,.25);border-radius:22px;padding:18px;box-shadow:0 12px 32px rgba(45,35,18,.05)}
.dcc-iq label{display:block;margin:0 0 13px;font-size:12px;font-weight:800}.dcc-iq input,.dcc-iq select{width:100%;height:48px;margin-top:7px;border:1px solid rgba(191,143,52,.3);border-radius:14px;background:#fffdf8;padding:0 13px;font:inherit;color:#17191d;box-sizing:border-box}
.dcc-iq-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.dcc-iq button{width:100%;height:52px;border:0;border-radius:15px;background:linear-gradient(135deg,#f5d36f,#e8ad30);font-size:14px;font-weight:900;color:#17191d;margin-top:5px}
@media(max-width:520px){.dcc-iq-row{grid-template-columns:1fr}.dcc-iq h1{font-size:27px}}
`;document.head.appendChild(s)}
window.dccOpenInitialQuestionnaire=function(c){css();const main=document.getElementById('client-main');if(!main)return;document.querySelector('#client .side')?.style.setProperty('display','none','important');main.innerHTML=`
<div class="dcc-iq"><div class="dcc-iq-head"><div class="dcc-iq-kicker">PRIMER ACCESO</div><h1>Completa tu perfil</h1><p class="dcc-iq-intro">Hola, ${esc(c?.name||'')}. Necesitamos estos datos iniciales para que tu entrenador pueda preparar tu planificación.</p></div>
<form class="dcc-iq-card" id="dcc-iq-form">
<div class="dcc-iq-row"><label>Edad<input id="dcc-iq-age" inputmode="numeric" placeholder="Ej. 28" required></label><label>Altura (cm)<input id="dcc-iq-height" inputmode="decimal" placeholder="Ej. 178" required></label></div>
<div class="dcc-iq-row"><label>Peso actual (kg)<input id="dcc-iq-weight" inputmode="decimal" placeholder="Ej. 75,5" required></label><label>Grasa corporal (%)<input id="dcc-iq-fat" inputmode="decimal" placeholder="Ej. 18,5" required></label></div>
<label>Objetivo<select id="dcc-iq-goal" required><option value="">Selecciona tu objetivo</option><option>Pérdida de grasa</option><option>Recomposición corporal</option><option>Ganancia muscular</option><option>Mantenimiento</option><option>Mejorar rendimiento</option></select></label>
<label>Alimentos que prefieres evitar<input id="dcc-iq-foods" placeholder="Opcional"></label>
<button type="submit">Guardar y continuar</button></form></div>`;
document.getElementById('dcc-iq-form')?.addEventListener('submit',submit)};
async function submit(e){e.preventDefault();const age=num('dcc-iq-age'),height=num('dcc-iq-height'),weight=num('dcc-iq-weight'),fat=num('dcc-iq-fat'),goal=document.getElementById('dcc-iq-goal')?.value||'',foods=document.getElementById('dcc-iq-foods')?.value.trim()||'';
if(age<10||age>100)return toast?.('Introduce una edad válida');if(height<100||height>250)return toast?.('Introduce una altura válida');if(weight<=0||weight>=500)return toast?.('Introduce un peso válido');if(fat<=0||fat>=70)return toast?.('Introduce un porcentaje de grasa válido');if(!goal)return toast?.('Selecciona tu objetivo');
const btn=e.currentTarget.querySelector('button');btn.disabled=true;btn.textContent='Guardando…';
try{const {data:ok,error}=await db().rpc('dcc_submit_initial_questionnaire',{p_weight:weight,p_body_fat:fat,p_age:age,p_height_cm:height,p_goal:goal,p_foods_to_avoid:foods});if(error||ok!==true)throw error||new Error('No confirmado');document.querySelector('#client .side')?.style.removeProperty('display');window.__dccOpenAppPromise=null;await window.openApp('client')}catch(err){console.error('DCC cuestionario inicial:',err);toast?.('No se pudo guardar el cuestionario');btn.disabled=false;btn.textContent='Guardar y continuar'}}
})();