/* DCC — Pectoral premium aprobado, mappings exactos */
(function(){
  'use strict';
  if(window.__dccPremiumPectoralV1)return;
  window.__dccPremiumPectoralV1=true;

  const images={
    'press-banca-barra':'./entrenamientos/ilustraciones/premium-press-banca-barra.svg?v=20260911-2',
    'press-banca-mancuernas':'./entrenamientos/ilustraciones/premium-press-banca-mancuernas.svg?v=20260911-2',
    'press-inclinado-barra':'./entrenamientos/ilustraciones/premium-press-inclinado-barra.svg?v=20260911-2',
    'press-inclinado-mancuernas':'./entrenamientos/ilustraciones/premium-press-inclinado-mancuernas.svg?v=20260911-2',
    'press-convergente-maquina':'./entrenamientos/ilustraciones/premium-press-convergente-maquina.svg?v=20260911-2',
    'aperturas-pec-deck':'./entrenamientos/ilustraciones/premium-aperturas-pec-deck.svg?v=20260911-2',
    'flexiones':'./entrenamientos/ilustraciones/premium-flexiones.svg?v=20260911-2',
    'pullover-mancuerna':'./entrenamientos/ilustraciones/pullover-mancuerna.webp?v=20260911-1'
  };

  function apply(){
    const list=window.exerciseLibraryFull;
    if(!Array.isArray(list)||!list.length)return false;
    let changed=0;
    list.forEach(ex=>{
      const image=images[ex?.id];
      if(!image)return;
      ex.image=image;
      ex.imageStart=image;
      ex.imagePeak=image;
      ex.dccPremiumApproved=true;
      changed++;
    });
    if(changed)window.dispatchEvent(new CustomEvent('dcc:premium-exercise-images-ready',{detail:{group:'Pectoral',count:changed}}));
    return changed>0;
  }

  window.addEventListener('dcc:exercise-library-ready',apply);
  window.addEventListener('dcc:exercise-guidance-ready',apply);
  apply();
  setTimeout(apply,250);
  setTimeout(apply,1000);
})();
