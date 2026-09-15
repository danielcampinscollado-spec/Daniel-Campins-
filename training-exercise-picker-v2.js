/* DCC — selector guiado de ejercicios: elegir -> configurar -> añadir */
(function(){
'use strict';
const BUILD='20260915-training-exercise-picker-v2';
if(window.__dccTrainingExercisePicker===BUILD)return;
window.__dccTrainingExercisePicker=BUILD;

const state={id:'',di:0,selected:new Map(),scrollY:0};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const muscleName=v=>{const n=norm(v);if(n==='pecho'||n==='pectoral')return'Pectoral';if(n==='triceps')return'Tríceps';if(n==='biceps')return'Bíceps';if(n==='espalda'||n==='dorsal'||n==='dorsales')return'Dorsal';if(n==='hombro'||n==='hombros'||n==='deltoide'||n==='deltoides')return'Hombros';if(n==='cuadriceps')return'Cuádriceps';if(n==='femoral'||n==='femorales'||n.includes('isquio'))return'Femoral';if(n==='gluteo'||n==='gluteos')return'Glúteos';if(n==='aductor'||n==='aductores')return'Aductores';if(n==='gemelo'||n==='gemelos'||n==='pantorrilla'||n==='pantorrillas')return'Gemelos';if(n==='trapecio'||n==='trapecios')return'Trapecio';if(n==='antebrazo'||n==='antebrazos')return'Antebrazos';if(n==='lumbar'||n==='lumbares')return'Lumbar';if(n==='core'||n==='abdomen'||n==='abdominales')return'Core';return String(v||'').trim()};
function days(id){const r=window.data?.routines?.[id];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]}
function muscles(day){const raw=Array.isArray(day?.muscles)?day.muscles:(day?.muscle??day?.group??'');return [...new Set((Array.isArray(raw)?raw:String(raw).split(/[·,]/)).map(muscleName).filter(x=>x&&!/^sin grupos/i.test(x)))]}
function library(){return Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[]}
function modalRoot(){return document.getElementById('dcc-ex-picker-v2')}
function close(){modalRoot()?.remove()}

function css(){if(document.getElementById('dcc-ex-picker-v2-css'))return;const s=document.createElement('style');s.id='dcc-ex-picker-v2-css';s.textContent=`
#dcc-ex-picker-v2{position:fixed;inset:0;z-index:100000;background:rgba(45,37,25,.28);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;padding:10px}
#dcc-ex-picker-v2 .ep-card{width:min(720px,100%);max-height:88dvh;overflow:auto;background:linear-gradient(160deg,#fffdf8,#f6ecdc);border:1px solid rgba(183,123,19,.34);border-radius:24px 24px 15px 15px;padding:16px;color:#17191d;box-shadow:0 -18px 55px rgba(70,52,25,.18)}
#dcc-ex-picker-v2 .ep-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;position:sticky;top:-16px;z-index:2;background:#fffaf1;padding:16px 0 10px;margin-top:-16px}#dcc-ex-picker-v2 h3{margin:0;font-size:20px}#dcc-ex-picker-v2 .ep-sub{margin:5px 0 0;color:#747b85;font-size:11px;line-height:1.4}#dcc-ex-picker-v2 .ep-close{width:36px;height:36px;flex:0 0 36px;border:1px solid rgba(183,123,19,.3);border-radius:50%;background:#fff7e5;font-size:21px;color:#8c5a08}
#dcc-ex-picker-v2 .ep-group{margin-top:14px}#dcc-ex-picker-v2 .ep-group-title{display:flex;justify-content:space-between;align-items:center;margin:0 2px 8px;font-size:13px;color:#8b5b0d}#dcc-ex-picker-v2 .ep-list{display:grid;gap:7px}#dcc-ex-picker-v2 .ep-choice{display:grid;grid-template-columns:28px minmax(0,1fr);gap:10px;align-items:center;width:100%;padding:12px;border:1px solid rgba(183,123,19,.20);border-radius:13px;background:#fffdf9;text-align:left;color:#17191d}#dcc-ex-picker-v2 .ep-choice.on{border-color:#d6a33a;background:#fff5d9;box-shadow:inset 0 0 0 1px rgba(214,163,58,.18)}#dcc-ex-picker-v2 .ep-check{width:24px;height:24px;border:1px solid #d5b36b;border-radius:8px;display:grid;place-items:center;color:#17130a;background:#fff}#dcc-ex-picker-v2 .ep-choice.on .ep-check{background:linear-gradient(135deg,#f6d36e,#dda73a);border-color:#d39d2f}#dcc-ex-picker-v2 .ep-choice b{display:block;font-size:12px}#dcc-ex-picker-v2 .ep-choice small{display:block;margin-top:3px;color:#7b828b;font-size:9px}
#dcc-ex-picker-v2 .ep-empty{padding:16px;border:1px dashed rgba(183,123,19,.3);border-radius:12px;color:#747b85;text-align:center;font-size:11px}#dcc-ex-picker-v2 .ep-next{width:100%;margin-top:15px;padding:13px;border:1px solid #d7a43c;border-radius:13px;background:linear-gradient(135deg,#f6d36e,#dda73a);font-weight:900;color:#17130a}#dcc-ex-picker-v2 .ep-next:disabled{opacity:.45}
#dcc-ex-picker-v2 .ep-config{display:grid;gap:10px;margin-top:12px}#dcc-ex-picker-v2 .ep-ex{padding:13px;border:1px solid rgba(183,123,19,.22);border-radius:15px;background:#fffdf9}#dcc-ex-picker-v2 .ep-ex-title{font-size:13px;font-weight:850;margin-bottom:10px}#dcc-ex-picker-v2 .ep-fields{display:grid;grid-template-columns:1fr 1fr;gap:9px}#dcc-ex-picker-v2 label{display:block;color:#6f7680;font-size:9px;font-weight:750}#dcc-ex-picker-v2 input{width:100%;margin-top:5px;padding:11px 12px;border:1px solid #dfcfad;border-radius:11px;background:#fff;color:#17191d;font-size:12px;outline:none}#dcc-ex-picker-v2 input:focus{border-color:#d5a23a;box-shadow:0 0 0 2px rgba(213,162,58,.12)}#dcc-ex-picker-v2 .ep-video{margin-top:9px}#dcc-ex-picker-v2 .ep-actions{display:grid;grid-template-columns:.75fr 1.25fr;gap:9px;margin-top:14px}#dcc-ex-picker-v2 .ep-back,#dcc-ex-picker-v2 .ep-save{padding:13px;border-radius:13px;font-weight:850}#dcc-ex-picker-v2 .ep-back{border:1px solid #ddcfb4;background:#fffdf9;color:#292929}#dcc-ex-picker-v2 .ep-save{border:1px solid #d7a43c;background:linear-gradient(135deg,#f6d36e,#dda73a);color:#17130a}
`;document.head.appendChild(s)}

function mount(html){close();css();const root=document.createElement('div');root.id='dcc-ex-picker-v2';root.innerHTML=html;root.addEventListener('click',e=>{if(e.target===root)close()});document.body.appendChild(root)}

async function openPicker(id,di){
  id=String(id||window.selectedClient||'');di=Number(di)||0;const day=days(id)[di];if(!day)return;
  state.id=id;state.di=di;state.selected.clear();state.scrollY=window.scrollY||0;
  try{if(window.exerciseLibraryReady)await window.exerciseLibraryReady}catch(e){console.error(e)}
  const ms=muscles(day);if(!ms.length){window.dccOpenMuscleModal?.(id,di);return}
  const existing=new Set((Array.isArray(day.exercises)?day.exercises:[]).map(x=>String(x?.id||'')));
  const sections=ms.map(m=>{const exs=library().filter(x=>muscleName(x?.muscle)===m&&!existing.has(String(x?.id||'')));return `<section class="ep-group"><div class="ep-group-title"><b>${esc(m)}</b><span>${exs.length} ejercicios</span></div><div class="ep-list">${exs.map(ex=>`<button type="button" class="ep-choice" data-eid="${esc(ex.id)}"><span class="ep-check"></span><span><b>${esc(ex.name)}</b><small>${esc(m)}</small></span></button>`).join('')||'<div class="ep-empty">No hay más ejercicios disponibles de este grupo.</div>'}</div></section>`}).join('');
  mount(`<div class="ep-card"><div class="ep-head"><div><h3>Elegir ejercicios · Día ${di+1}</h3><p class="ep-sub">Aquí aparecen todos los ejercicios de ${esc(ms.join(' y '))}. Puedes elegir varios.</p></div><button type="button" class="ep-close">×</button></div>${sections}<button type="button" class="ep-next" disabled>Continuar · configurar ejercicios</button></div>`);
  const root=modalRoot();root.querySelector('.ep-close').onclick=close;root.querySelectorAll('.ep-choice').forEach(b=>b.onclick=()=>{const eid=String(b.dataset.eid||'');const ex=library().find(x=>String(x.id)===eid);if(!ex)return;if(state.selected.has(eid)){state.selected.delete(eid);b.classList.remove('on');b.querySelector('.ep-check').textContent=''}else{state.selected.set(eid,ex);b.classList.add('on');b.querySelector('.ep-check').textContent='✓'}root.querySelector('.ep-next').disabled=!state.selected.size});root.querySelector('.ep-next').onclick=openConfig;
}

function openConfig(){
  const chosen=[...state.selected.values()];if(!chosen.length)return;
  mount(`<div class="ep-card"><div class="ep-head"><div><h3>Configurar ejercicios</h3><p class="ep-sub">Define series y repeticiones. El vídeo es opcional y puedes añadirlo debajo de cada ejercicio.</p></div><button type="button" class="ep-close">×</button></div><div class="ep-config">${chosen.map((ex,i)=>`<div class="ep-ex" data-i="${i}"><div class="ep-ex-title">${esc(ex.name)}</div><div class="ep-fields"><label>Series<input class="ep-sets" inputmode="numeric" placeholder="Ej. 4"></label><label>Repeticiones<input class="ep-reps" placeholder="Ej. 8-12"></label></div><label class="ep-video">Vídeo opcional<input class="ep-video-input" type="url" inputmode="url" placeholder="Pega aquí el enlace del vídeo si quieres"></label></div>`).join('')}</div><div class="ep-actions"><button type="button" class="ep-back">← Volver</button><button type="button" class="ep-save">Añadir ${chosen.length} ejercicio${chosen.length===1?'':'s'}</button></div></div>`);
  const root=modalRoot();root.querySelector('.ep-close').onclick=close;root.querySelector('.ep-back').onclick=()=>openPicker(state.id,state.di);root.querySelector('.ep-save').onclick=saveChosen;
}

function saveChosen(){
  const day=days(state.id)[state.di];if(!day)return close();day.exercises=Array.isArray(day.exercises)?day.exercises:[];const chosen=[...state.selected.values()];const cards=[...modalRoot().querySelectorAll('.ep-ex')];
  const additions=chosen.map((ex,i)=>{const card=cards[i];const sets=card.querySelector('.ep-sets').value.trim();const reps=card.querySelector('.ep-reps').value.trim();const video=card.querySelector('.ep-video-input').value.trim();return{id:ex.id,name:ex.name,muscle:muscleName(ex.muscle),sets:sets||'4',reps:reps||'10-12',videoOptional:video,video:video||''}});
  day.exercises.push(...additions);window.__dccTrainingOpen=state.di;close();
  if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(state.id,'training');
  requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:state.scrollY,left:0,behavior:'auto'})));
}

window.dccOpenExercisePickerV2=openPicker;
window.dccOpenExerciseModal=openPicker;

document.addEventListener('click',e=>{
  const b=e.target?.closest?.('#coach-main .dcc-tr-day button');if(!b)return;
  const text=norm(b.textContent);if(!text.includes('anadir ejercicio'))return;
  const card=b.closest('.dcc-tr-day');const cards=[...document.querySelectorAll('#coach-main .dcc-tr-days>.dcc-tr-day')];const di=cards.indexOf(card);if(di<0)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openPicker(String(window.selectedClient||''),di);
},true);
})();
