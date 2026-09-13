/* DCC — hace inequívoco el cierre del editor de alimentación en móvil */
(function(){
  'use strict';
  if(window.__dccDietEditorSaveVisibilityV1)return;
  window.__dccDietEditorSaveVisibilityV1=true;
  const id='dcc-diet-editor-save-visibility-v1-css';
  if(document.getElementById(id))return;
  const s=document.createElement('style');s.id=id;s.textContent=`
    #coach-main .dcc-n2-save-plan-final{z-index:80}
    @media(max-width:720px){
      #coach-main .dcc-n2-save-plan-final{
        position:fixed!important;
        left:50%!important;
        right:auto!important;
        bottom:104px!important;
        width:min(680px,calc(100vw - 28px))!important;
        margin:0!important;
        transform:translateX(-50%)!important;
        box-shadow:0 14px 34px rgba(73,48,7,.28),0 0 0 5px rgba(255,250,240,.78)!important;
      }
      #coach-main.dcc-ca:has(.dcc-n2-save-plan-final){padding-bottom:178px!important}
    }
  `;
  (document.head||document.documentElement).appendChild(s);
})();
