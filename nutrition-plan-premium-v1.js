/* HOTFIX TEMPORAL
   Desactiva el nuevo flujo de alimentación premium para restaurar inmediatamente
   la gestión de clientes. La versión corregida se reactivará después de validar
   que no interfiere con openClient/dccClientAdmin.
*/
(function(){
  'use strict';
  window.__dccNutritionPlanPremiumV1Disabled = true;
})();
