/* DCC — recordatorio de alimentos a evitar dentro del editor de dieta */
(function(){
'use strict';
const BUILD='20260915-nutrition-avoid-reminder-v1';
if(window.__dccNutritionAvoidReminder===BUILD)return;
window.__dccNutritionAvoidReminder=BUILD;

function css(){
  if(document.getElementById('dcc-nutrition-avoid-reminder-v1-css'))return;
  const s=document.createElement('style');
  s.id='dcc-nutrition-avoid-reminder-v1-css';
  s.textContent=`
    #coach-main .dcc-n2-editorbar.dcc-avoid-reminder{padding:14px 15px!important}
    #coach-main .dcc-n2-editorbar.dcc-avoid-reminder .dcc-n2-backrow{align-items:center!important}
    #coach-main .dcc-n2-editorbar.dcc-avoid-reminder .dcc-avoid-copy{min-width:0;flex:1}
    #coach-main .dcc-n2-editorbar.dcc-avoid-reminder h2{margin:0!important;font-size:18px!important;line-height:1.15!important}
    #coach-main .dcc-n2-editorbar.dcc-avoid-reminder p{margin:5px 0 0!important;font-size:11px!important;line-height:1.4!important;color:#a7adb5!important}
    #coach-main .dcc-n2-editorbar.dcc-avoid-reminder .dcc-avoid-value{color:#f1cb69!important;font-weight:850!important}
    html.dcc-theme-light-premium body #coach-main .dcc-n2-editorbar.dcc-avoid-reminder{background:linear-gradient(145deg,#fffefa,#f8f0e3)!important;border-color:rgba(183,123,19,.26)!important}
    html.dcc-theme-light-premium body #coach-main .dcc-n2-editorbar.dcc-avoid-reminder h2{color:#17191d!important}
    html.dcc-theme-light-premium body #coach-main .dcc-n2-editorbar.dcc-avoid-reminder p{color:#737b85!important}
    html.dcc-theme-light-premium body #coach-main .dcc-n2-editorbar.dcc-avoid-reminder .dcc-avoid-value{color:#a96d0d!important}
  `;
  (document.head||document.documentElement).appendChild(s);
}

function idFromBar(bar){
  const back=bar.querySelector('.dcc-n2-back');
  const code=back?.getAttribute('onclick')||'';
  const m=code.match(/dccNutritionV2Home\(['\"]([^'\"]+)['\"]\)/);
  if(m)return String(m[1]);
  return String(window.selectedClient||'');
}

function clientById(id){
  return (window.data?.clients||[]).find(c=>String(c?.id)===String(id))||null;
}

function avoidText(id){
  const c=clientById(id);
  const value=c?.foods_to_avoid??c?.foodsToAvoid??'';
  return String(value||'').trim();
}

function apply(){
  css();
  document.querySelectorAll('#coach-main .dcc-n2-editorbar').forEach(bar=>{
    const id=idFromBar(bar);
    const avoid=avoidText(id);
    const row=bar.querySelector('.dcc-n2-backrow');
    if(!row)return;
    let copy=row.querySelector('.dcc-avoid-copy');
    if(!copy){
      const old=[...row.children].find(el=>el!==row.querySelector('.dcc-n2-back'));
      copy=document.createElement('div');
      copy.className='dcc-avoid-copy';
      if(old)old.replaceWith(copy);else row.appendChild(copy);
    }
    copy.innerHTML=`<h2>Alimentos a evitar</h2><p>${avoid?`No incluir en el plan: <span class="dcc-avoid-value"></span>`:'No hay alimentos indicados para este cliente.'}</p>`;
    if(avoid){
      const value=copy.querySelector('.dcc-avoid-value');
      if(value)value.textContent=avoid;
    }
    bar.classList.add('dcc-avoid-reminder');
  });
}

let queued=false;
function refresh(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;apply()});
}

css();refresh();
new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',()=>setTimeout(refresh,0),true);
window.addEventListener('pageshow',refresh);
})();