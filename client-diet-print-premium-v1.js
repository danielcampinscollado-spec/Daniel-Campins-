/* DCC — Cliente Alimentación: aviso, notas y PDF premium */
(function(){
'use strict';
const BUILD='20260921-diet-print-premium-v2';
if(window.__dccDietPrintPremium===BUILD)return;
window.__dccDietPrintPremium=BUILD;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getData=()=>{try{return typeof data!=='undefined'?data:(window.data||{})}catch(_){return window.data||{}}};
const clientId=()=>String(window.currentClientId||'');
const type=()=>window.clientDietType==='rest'?'rest':'training';
const allPlan=()=>getData()?.diets?.[clientId()]||{};
const day=()=>allPlan()?.[type()]||{meals:[],notes:''};
const currentClient=()=> (getData()?.clients||[]).find(x=>String(x.id)===clientId())||{};
const coachName=()=>{try{return typeof window.dccCoachName==='function'?(window.dccCoachName()||'Entrenador'):'Entrenador'}catch(_){return'Entrenador'}};

function css(){
  if(document.getElementById('dcc-diet-info-print-css'))return;
  const s=document.createElement('style');
  s.id='dcc-diet-info-print-css';
  s.textContent=`
  #client-main .dcc-diet-info-stack{display:grid;gap:9px;margin:0 0 11px}
  #client-main .dcc-diet-accordion{margin:0!important;overflow:hidden!important;border:1px solid rgba(198,139,32,.30)!important;border-radius:18px!important;background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;box-shadow:0 9px 22px rgba(83,63,31,.055),inset 0 1px 0 #fff!important}
  #client-main .dcc-diet-accordion summary{min-height:58px;display:grid!important;grid-template-columns:35px minmax(0,1fr) 24px!important;align-items:center!important;gap:10px!important;padding:9px 12px!important;list-style:none!important;cursor:pointer!important;background:transparent!important}
  #client-main .dcc-diet-accordion summary::-webkit-details-marker{display:none!important}
  #client-main .dcc-diet-accordion-icon{width:32px;height:32px;display:grid;place-items:center;border:1px solid rgba(187,126,20,.30);border-radius:50%;background:#fff6df;color:#a66d0b}
  #client-main .dcc-diet-accordion-icon svg{width:18px;height:18px}
  #client-main .dcc-diet-accordion-title{color:#17191d;font-size:14px;font-weight:760;line-height:1.2;letter-spacing:-.15px}
  #client-main .dcc-diet-accordion-arrow{position:relative;width:24px;height:24px}
  #client-main .dcc-diet-accordion-arrow:after{content:'';position:absolute;left:50%;top:46%;width:7px;height:7px;border-right:1.8px solid #9c660a;border-bottom:1.8px solid #9c660a;transform:translate(-50%,-60%) rotate(45deg);transition:transform .2s ease}
  #client-main .dcc-diet-accordion[open] .dcc-diet-accordion-arrow:after{transform:translate(-50%,-30%) rotate(225deg)}
  #client-main .dcc-diet-accordion-body{margin:0 12px 12px 57px;padding:10px 11px;border-top:1px solid rgba(112,84,37,.10);border-radius:12px;background:rgba(249,244,234,.72);color:#657080;font-size:11px;line-height:1.52;white-space:pre-line}
  #client-main .diet-pdf-card.dcc-diet-pdf-bottom{margin:11px 0 0!important;cursor:pointer!important}
  #client-main .diet-pdf-card.dcc-diet-pdf-bottom .diet-pdf-text strong{font-size:14px!important}
  #client-main .diet-pdf-card.dcc-diet-pdf-bottom .diet-pdf-text span{font-size:9.5px!important}
  #client-main .diet-pdf-card.dcc-diet-pdf-bottom .diet-pdf-button{white-space:nowrap!important}
  @media(max-width:390px){
    #client-main .dcc-diet-accordion summary{min-height:54px;padding:8px 10px!important;grid-template-columns:31px minmax(0,1fr) 22px!important}
    #client-main .dcc-diet-accordion-icon{width:29px;height:29px}
    #client-main .dcc-diet-accordion-title{font-size:13px}
    #client-main .dcc-diet-accordion-body{margin:0 10px 10px 50px;padding:9px 10px;font-size:10px}
  }`;
  document.head.appendChild(s);
}

function notice(){
  const p=allPlan();
  const hasTraining=Array.isArray(p?.training?.meals)&&p.training.meals.length>0;
  const hasRest=Array.isArray(p?.rest?.meals)&&p.rest.meals.length>0;
  if(hasTraining&&hasRest){
    return 'Tienes 2 tipos de dieta: una para los días de entrenamiento y otra para los días de descanso. Usa el selector superior para cambiar entre ambas.';
  }
  return type()==='training'
    ? 'Esta alimentación corresponde a tus días de entrenamiento.'
    : 'Esta alimentación corresponde a tus días de descanso.';
}

const iconInfo=()=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 10.5v6"/><path d="M12 7.4h.01"/></svg>';
const iconNotes=()=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 4.5h14v12H9l-4 3z"/><path d="M8 8h8M8 11.5h6"/></svg>';

function accordion(title,body,kind){
  return `<details class="dcc-diet-accordion dcc-diet-${kind}">
    <summary><span class="dcc-diet-accordion-icon">${kind==='notice'?iconInfo():iconNotes()}</span><span class="dcc-diet-accordion-title">${esc(title)}</span><span class="dcc-diet-accordion-arrow" aria-hidden="true"></span></summary>
    <div class="dcc-diet-accordion-body">${esc(body)}</div>
  </details>`;
}

function enhance(){
  css();
  const main=document.getElementById('client-main');
  if(!main||!main.querySelector('.diet-switch'))return;
  const sw=main.querySelector('.diet-switch');
  const list=main.querySelector('.diet-list');
  if(!sw||!list)return;

  main.querySelector('.dcc-diet-info-stack')?.remove();
  const notes=String(day()?.notes||'').trim();
  const stack=document.createElement('div');
  stack.className='dcc-diet-info-stack';
  stack.innerHTML=accordion('Aviso sobre las dietas',notice(),'notice')+(notes?accordion('Notas del entrenador',notes,'notes'):'');
  sw.insertAdjacentElement('afterend',stack);

  const pdf=main.querySelector('.diet-pdf-card');
  if(pdf){
    pdf.classList.add('dcc-diet-pdf-bottom');
    list.insertAdjacentElement('afterend',pdf);
    const title=pdf.querySelector('.diet-pdf-text strong');
    const sub=pdf.querySelector('.diet-pdf-text span');
    const btn=pdf.querySelector('.diet-pdf-button');
    if(title)title.textContent='Imprimir / Descargar dieta';
    if(sub)sub.textContent='Genera un PDF limpio para guardar o imprimir.';
    if(btn){
      btn.type='button';
      const label=btn.querySelector('span');
      if(label)label.textContent='ABRIR PDF';
      btn.onclick=e=>{e.preventDefault();e.stopPropagation();window.dccPrintClientDiet?.()};
    }
    pdf.onclick=e=>{if(e.target.closest('button'))return;window.dccPrintClientDiet?.()};
  }
}

function optionsOf(meal){
  try{
    if(typeof ensureMealOptions==='function')return ensureMealOptions(meal)||[];
  }catch(_){}
  if(Array.isArray(meal?.options)&&meal.options.length)return meal.options;
  if(Array.isArray(meal?.foods))return[{name:'Opción 1',foods:meal.foods}];
  return[];
}

function mealHtml(meal,index){
  const opts=optionsOf(meal).filter(o=>Array.isArray(o?.foods)&&o.foods.length);
  const body=opts.length?opts.map((o,oi)=>{
    const optionTitle=opts.length>1?`<div class="pdf-option-title">${esc(o.name||('Opción '+(oi+1)))}</div>`:'';
    const foods=o.foods.map(f=>`<div class="pdf-food"><span>${esc(f?.[0]||'')}</span><b>${esc(f?.[1]||'')}</b></div>`).join('');
    return `<div class="pdf-option">${optionTitle}${foods}</div>`;
  }).join(''):'<div class="pdf-empty">Sin alimentos configurados.</div>';
  return `<section class="pdf-meal"><div class="pdf-meal-head"><span class="pdf-num">${String(index+1).padStart(2,'0')}</span><div><h2>${esc(meal?.name||('Comida '+(index+1)))}</h2></div></div><div class="pdf-meal-body">${body}</div></section>`;
}

window.dccPrintClientDiet=function(){
  const d=day();
  const meals=Array.isArray(d?.meals)?d.meals:[];
  const c=currentClient();
  const currentType=type();
  const notes=String(d?.notes||'').trim();
  const date=new Date().toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'numeric'});
  const title=currentType==='training'?'Dieta de entrenamiento':'Dieta de descanso';
  const p=allPlan();
  const hasBoth=!!(Array.isArray(p?.training?.meals)&&p.training.meals.length&&Array.isArray(p?.rest?.meals)&&p.rest.meals.length);

  const w=window.open('','_blank');
  if(!w){alert('El navegador ha bloqueado la ventana de impresión. Permite las ventanas emergentes e inténtalo de nuevo.');return false}

  const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · ${esc(c.name||'Cliente')}</title><style>
  @page{size:A4;margin:10mm}
  *{box-sizing:border-box}html,body{margin:0;background:#f4eee3;color:#1b1e24;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  body{padding:24px}.sheet{max-width:900px;margin:0 auto;background:#fffdf8;padding:34px;border:1px solid #ead9b8;box-shadow:0 20px 60px rgba(70,50,18,.10)}
  .brand{text-align:center;margin-bottom:19px}.brand-kicker{color:#a87318;font-size:9px;font-weight:900;letter-spacing:3px;text-transform:uppercase}.brand h1{margin:8px 0 3px;font-family:Georgia,"Times New Roman",serif;font-size:34px;line-height:1.05;font-weight:600}.brand p{margin:0;color:#6e7784;font-size:9px;letter-spacing:3px;text-transform:uppercase}
  .meta{display:grid;grid-template-columns:1.15fr 1.15fr .8fr;border:1px solid #ead9b8;border-radius:12px;overflow:hidden;margin:0 0 12px}.meta div{padding:11px 13px;border-right:1px solid #ead9b8}.meta div:last-child{border-right:0}.meta small{display:block;color:#808794;font-size:8px}.meta b{display:block;margin-top:3px;font-size:11px}
  .notice,.notes{margin:0 0 12px;padding:11px 13px;border:1px solid #e3be70;border-radius:11px;background:#fff5dc}.notice b,.notes b{display:block;color:#9a660a;font-size:10px}.notice span,.notes span{display:block;margin-top:4px;color:#4f5660;font-size:9px;line-height:1.45;white-space:pre-line}.notes{background:#fffdfa;border-color:#ead9b8}
  .meals{display:grid;gap:9px}.pdf-meal{display:grid;grid-template-columns:190px 1fr;border:1px solid #ead9b8;border-radius:12px;overflow:hidden;break-inside:avoid}.pdf-meal-head{display:flex;gap:10px;align-items:flex-start;padding:13px;background:#fffaf0;border-right:1px solid #ead9b8}.pdf-num{width:28px;height:28px;display:grid;place-items:center;flex:none;border-radius:50%;background:linear-gradient(135deg,#f0c75e,#c99027);color:#2d210c;font-size:9px;font-weight:900}.pdf-meal h2{margin:3px 0 0;font-family:Georgia,"Times New Roman",serif;font-size:18px;font-weight:600}.pdf-meal-body{padding:11px 14px}.pdf-option+.pdf-option{margin-top:9px;padding-top:8px;border-top:1px dashed #ead9b8}.pdf-option-title{margin-bottom:5px;color:#9a660a;font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:1.3px}.pdf-food{display:grid;grid-template-columns:1fr auto;gap:14px;padding:2.5px 0;font-size:9.5px;line-height:1.35}.pdf-food span:before{content:'•';margin-right:7px;color:#c48a1e}.pdf-food b{font-weight:650;color:#46505e}.pdf-empty{color:#8c929a;font-size:9px}
  .footer{margin-top:16px;padding-top:11px;border-top:1px solid #d7a94b;text-align:center}.footer b{display:block;color:#aa7418;font-size:8px;letter-spacing:3px;text-transform:uppercase}.footer span{display:block;margin-top:4px;color:#90959b;font-size:7.5px}
  .printbar{max-width:900px;margin:12px auto 0;display:flex;justify-content:center}.printbar button{min-height:44px;padding:0 18px;border:1px solid #c99027;border-radius:12px;background:linear-gradient(135deg,#f2d074,#d9a43b);color:#21190c;font-weight:850;cursor:pointer}
  @media print{body{padding:0;background:#fff}.sheet{max-width:none;border:0;box-shadow:none;padding:0}.printbar{display:none}.pdf-meal{grid-template-columns:165px 1fr}.brand h1{font-size:30px}}
  @media(max-width:720px){body{padding:10px}.sheet{padding:18px}.meta{grid-template-columns:1fr}.meta div{border-right:0;border-bottom:1px solid #ead9b8}.meta div:last-child{border-bottom:0}.pdf-meal{grid-template-columns:1fr}.pdf-meal-head{border-right:0;border-bottom:1px solid #ead9b8}}
  </style></head><body><main class="sheet">
  <header class="brand"><div class="brand-kicker">Daniel Campins · Entrenamiento personal</div><h1>${esc(title)}</h1><p>Plan de alimentación personalizado</p></header>
  <section class="meta"><div><small>Cliente</small><b>${esc(c.name||'Cliente')}</b></div><div><small>Entrenador</small><b>${esc(coachName())}</b></div><div><small>Fecha</small><b>${esc(date)}</b></div></section>
  ${hasBoth?`<section class="notice"><b>Existen 2 tipos de dieta: entrenamiento y descanso.</b><span>Este documento corresponde a la ${currentType==='training'?'dieta de entrenamiento, pensada para los días en los que realizas actividad física':'dieta de descanso, pensada para los días sin entrenamiento'}.</span></section>`:''}
  ${notes?`<section class="notes"><b>Notas del entrenador</b><span>${esc(notes)}</span></section>`:''}
  <div class="meals">${meals.map(mealHtml).join('')}</div>
  <footer class="footer"><b>Gracias por cuidarte</b><span>Documento generado para guardar o imprimir.</span></footer>
  </main><div class="printbar"><button type="button" onclick="window.print()">Imprimir / Guardar PDF</button></div>
  <script>setTimeout(function(){window.print()},450)<\/script></body></html>`;

  w.document.open();w.document.write(html);w.document.close();
  return true;
};

function install(){
  const fn=window.showClient;
  if(typeof fn==='function'&&!fn.__dccDietPrintPremium){
    const base=fn;
    const wrapped=function(screen){
      const result=base.apply(this,arguments);
      if(screen==='food')requestAnimationFrame(()=>requestAnimationFrame(enhance));
      return result;
    };
    wrapped.__dccDietPrintPremium=true;
    wrapped.__base=base;
    window.showClient=wrapped;
  }
  if(window.currentScreen==='food')requestAnimationFrame(enhance);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.addEventListener('pageshow',install);
setTimeout(install,120);
})();