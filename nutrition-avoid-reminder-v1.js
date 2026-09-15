/* DCC — elimina el encabezado redundante del editor de alimentación.
   El aviso de alimentos a evitar ya se muestra dentro del contenido del plan. */
(function(){
'use strict';
const BUILD='20260915-nutrition-avoid-reminder-v2-hide-duplicate';
if(window.__dccNutritionAvoidReminder===BUILD)return;
window.__dccNutritionAvoidReminder=BUILD;

function css(){
  if(document.getElementById('dcc-nutrition-avoid-reminder-v2-css'))return;
  const s=document.createElement('style');
  s.id='dcc-nutrition-avoid-reminder-v2-css';
  s.textContent=`
    #coach-main .dcc-n2-editorbar{display:none!important}
  `;
  (document.head||document.documentElement).appendChild(s);
}

css();
})();