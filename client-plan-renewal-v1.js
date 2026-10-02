/* DCC — ciclo de renovación y vencimiento del plan */
(function(){
'use strict';
function db(){try{return window.supabaseClient||supabaseClient}catch(_){return null}}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toastSafe(v){try{(window.toast||toast)(v)}catch(_){}}
async function state(){const d=db();if(!d)return null;const r=await d.rpc('dcc_get_my_plan_access');if(r.error)throw r.error;return r.data}
function modal(st,expired){
 const end=st?.plan_end_date?new Date(st.plan_end_date+'T12:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}):'';
 const box=document.getElementById('modal-content'),wrap=document.getElementById('modal');if(!box||!wrap)return;
 box.innerHTML='<div style="padding:8px 2px;text-align:center"><div style="width:48px;height:48px;margin:0 auto 12px;border-radius:50%;display:grid;place-items:center;background:#f7ecd8;color:#a66d0d;font-size:22px">◇</div><h2 style="margin:0 0 8px;color:#17191d">'+(expired?'Tu plan ha finalizado':'Tu plan finaliza mañana')+'</h2><p style="margin:0 auto 18px;max-width:360px;color:#707782;line-height:1.5">'+(expired?'Tu acceso al contenido del plan está pausado. Puedes solicitar continuar y tu entrenador recibirá el aviso.':'Tu plan finaliza el '+esc(end)+'. ¿Quieres continuar con DCC Fitness?')+'</p><div style="display:grid;gap:9px"><button class="btn" type="button" onclick="dccRenewalAnswer(\'yes\')">Sí, quiero continuar</button>'+(expired?'':'<button class="ghost" type="button" onclick="dccRenewalAnswer(\'no\')">No quiero continuar</button>')+'</div></div>';
 wrap.style.display='grid';
}
window.dccRenewalAnswer=async function(answer){
 const d=db();if(!d)return;
 try{const r=await d.rpc('dcc_set_my_renewal_response',{p_response:answer});if(r.error)throw r.error;document.getElementById('modal').style.display='none';toastSafe(answer==='yes'?'Tu entrenador ha recibido tu solicitud de continuidad':'Respuesta guardada. Tu plan seguirá activo hasta su fecha de finalización.');}
 catch(e){console.error('DCC renewal answer',e);toastSafe('No se pudo guardar tu respuesta')}
};
window.dccCheckPlanRenewal=async function(){
 try{const st=await state();if(!st)return true;
  if(st.access_suspended){modal(st,true);return false}
  if(st.renewal_prompt_due){modal(st,false)}
  return true;
 }catch(e){console.warn('DCC plan renewal state',e);return true}
};
const install=()=>{
 const base=window.openApp;if(typeof base!=='function'||base.__dccRenewal)return;
 const fn=async function(app){const out=await base.apply(this,arguments);if(app==='client')setTimeout(()=>window.dccCheckPlanRenewal(),80);return out};
 fn.__dccRenewal=true;window.openApp=fn;
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();