/* DCC — Evolución y adherencia del cliente v1 (solo lectura) */
(function(){
'use strict';
const BUILD='20261005-evolution-v1';
if(window.__dccClientEvolution===BUILD)return;
window.__dccClientEvolution=BUILD;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const db=()=>window.supabaseClient||null;
const selected=()=>String(window.selectedClient||'');
const clients=()=>{try{return (typeof data!=='undefined'?data:window.data)?.clients||[]}catch(e){return window.data?.clients||[]}};
const client=id=>clients().find(x=>String(x.id)===String(id))||{};
const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
const fmt=v=>v==null?'—':Number(v).toLocaleString('es-ES',{maximumFractionDigits:1});
const day=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?'—':d.toLocaleDateString('es-ES',{day:'2-digit',month:'short'})};
function css(){if(document.getElementById('dcc-evolution-v1-css'))return;const s=document.createElement('style');s.id='dcc-evolution-v1-css';s.textContent=`
.dcc-evo{padding:10px!important}.dcc-evo-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.dcc-evo-top h2{margin:0;font-size:14px}.dcc-evo-badge{padding:5px 8px;border:1px solid rgba(183,123,22,.22);border-radius:999px;font-size:8px;font-weight:900;color:#a56d10;background:rgba(217,170,74,.08)}.dcc-evo-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px}.dcc-evo-metric{padding:8px 9px;border:1px solid rgba(183,123,22,.14);border-radius:12px;background:rgba(255,255,255,.32)}.dcc-evo-metric small{display:block;color:#858b92;font-size:8px}.dcc-evo-metric b{display:block;margin-top:3px;font-size:14px}.dcc-evo-metric em{display:block;margin-top:2px;color:#858b92;font-size:8px;font-style:normal}.dcc-evo-chart{margin-top:8px;padding:8px;border:1px solid rgba(183,123,22,.12);border-radius:12px}.dcc-evo-charthead{display:flex;justify-content:space-between;font-size:8px;color:#858b92;margin-bottom:4px}.dcc-evo-chart svg{display:block;width:100%;height:54px;overflow:visible}.dcc-evo-line{fill:none;stroke:currentColor;stroke-width:2;vector-effect:non-scaling-stroke}.dcc-evo-dots{fill:currentColor}.dcc-evo-status{margin-top:7px;padding:8px 9px;border-radius:11px;background:rgba(217,170,74,.07);font-size:9px;line-height:1.35}.dcc-evo-foot{display:flex;justify-content:space-between;gap:8px;margin-top:6px;color:#858b92;font-size:8px}.dcc-evo-loading{padding:14px 0;color:#858b92;font-size:9px;text-align:center}
`;document.head.appendChild(s)}
function line(points,key){const vals=points.map(x=>num(x[key])).filter(v=>v!=null);if(vals.length<2)return'<div class="dcc-evo-loading">Aún no hay suficientes registros para mostrar tendencia.</div>';const min=Math.min(...vals),max=Math.max(...vals),span=max-min||1;const pts=points.map((x,i)=>{const v=num(x[key]);if(v==null)return null;const X=4+(i/(Math.max(points.length-1,1)))*92,Y=48-((v-min)/span)*40;return[X,Y]}).filter(Boolean);return `<svg viewBox="0 0 100 54" preserveAspectRatio="none" aria-label="Tendencia"><polyline class="dcc-evo-line" points="${pts.map(p=>p.join(',')).join(' ')}"/>${pts.map(p=>`<circle class="dcc-evo-dots" cx="${p[0]}" cy="${p[1]}" r="1.6"/>`).join('')}</svg>`}
function trend(first,last,suffix=''){if(first==null||last==null)return'—';const d=last-first;return `${d>0?'+':''}${fmt(d)}${suffix}`}
function statusText({workoutPct,checkins,lastWeight,firstWeight}){if(workoutPct!=null&&workoutPct<50)return'Atención: adherencia de entrenamiento baja en los últimos 28 días.';if(checkins.length&&checkins[0].reviewed===false)return'Check-in recibido y pendiente de revisión.';if(firstWeight!=null&&lastWeight!=null&&Math.abs(lastWeight-firstWeight)<0.3)return'Peso estable en los registros disponibles.';if(workoutPct!=null&&workoutPct>=80)return'Buena adherencia de entrenamiento en los últimos 28 días.';return'Seguimiento activo. La valoración mejora a medida que se acumulan registros.'}
async function load(id,host){const database=db();if(!database)return;const since=new Date(Date.now()-28*864e5).toISOString();try{const [w,b,wo,ci]=await Promise.all([
database.from('client_weights').select('weight,recorded_at').eq('client_id',id).order('recorded_at',{ascending:true}).limit(60),
database.from('client_body_fat_history').select('body_fat,recorded_at').eq('client_id',id).order('recorded_at',{ascending:true}).limit(60),
database.from('workout_history').select('id,workout_date').eq('client_id',id).gte('workout_date',since).order('workout_date',{ascending:false}),
database.from('client_checkin_history').select('id,weight,body_fat,sent_at,checkin_type,photos').eq('client_id',id).order('sent_at',{ascending:false}).limit(12)
]);if(!host.isConnected||selected()!==id)return;for(const r of [w,b,wo,ci])if(r.error)throw r.error;const weights=w.data||[], fats=b.data||[], workouts=wo.data||[], checkins=ci.data||[],cl=client(id);const firstWeight=num(weights[0]?.weight)??num(cl.initial_weight),lastWeight=num(weights.at(-1)?.weight)??num(cl.weight);const firstFat=num(fats[0]?.body_fat)??num(cl.initial_body_fat),lastFat=num(fats.at(-1)?.body_fat);const perWeek=Math.max(0,num(cl.preferred_training_days)||0),expected=perWeek?perWeek*4:null,workoutPct=expected?Math.min(100,Math.round(workouts.length/expected*100)):null;const graph=weights.map(x=>({value:x.weight,recorded_at:x.recorded_at}));host.innerHTML=`
<div class="dcc-evo-top"><div><h2>Evolución</h2><div class="dcc-v2-sub">Datos reales · últimos registros</div></div><span class="dcc-evo-badge">28 DÍAS</span></div>
<div class="dcc-evo-grid">
<div class="dcc-evo-metric"><small>Peso actual</small><b>${fmt(lastWeight)}${lastWeight!=null?' kg':''}</b><em>${trend(firstWeight,lastWeight,' kg')} desde inicio</em></div>
<div class="dcc-evo-metric"><small>Grasa corporal</small><b>${fmt(lastFat)}${lastFat!=null?' %':''}</b><em>${trend(firstFat,lastFat,' %')} desde inicio</em></div>
<div class="dcc-evo-metric"><small>Entrenamientos</small><b>${workouts.length}${expected!=null?'/'+expected:''}</b><em>${workoutPct!=null?workoutPct+' % adherencia':'Sin frecuencia definida'}</em></div>
<div class="dcc-evo-metric"><small>Check-ins registrados</small><b>${checkins.length}</b><em>${checkins[0]?.sent_at?'Último '+day(checkins[0].sent_at):'Sin registros'}</em></div>
</div>
<div class="dcc-evo-chart"><div class="dcc-evo-charthead"><span>Tendencia de peso</span><span>${weights.length} registros</span></div>${line(graph,'value')}</div>
<div class="dcc-evo-status">${esc(statusText({workoutPct,checkins,lastWeight,firstWeight}))}</div>
<div class="dcc-evo-foot"><span>Entrenos: últimos 28 días</span><span>Históricos: completos</span></div>`;
}catch(e){console.warn('DCC evolución:',e);host.innerHTML='<div class="dcc-evo-loading">No se pudo cargar la evolución.</div>'}}
function enhance(){css();const id=selected();if(!id)return;const root=document.querySelector('#coach-main.dcc-ca .dcc-profile-v2-summary');if(!root)return;let host=root.querySelector('.dcc-evo');if(host?.dataset.client===id)return;if(host)host.remove();host=document.createElement('section');host.className='dcc-v2-card dcc-evo';host.dataset.client=id;host.innerHTML='<div class="dcc-evo-loading">Cargando evolución…</div>';root.prepend(host);load(id,host)}
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});window.addEventListener('pageshow',schedule);document.addEventListener('DOMContentLoaded',schedule);schedule();
})();