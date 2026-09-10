/* DCC — Mensajes: entrada estable sin vibraciones */
(function(){
  'use strict';

  const topNow=()=>{
    try{window.scrollTo({top:0,left:0,behavior:'auto'});}catch(_){window.scrollTo(0,0);}
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
  };

  let topFrame=0;
  function stabilizeInitialEntry(){
    if(topFrame)return;
    topFrame=requestAnimationFrame(()=>{
      topFrame=0;
      topNow();
    });
  }

  const isMessagesAction=button=>{
    if(!button)return false;
    const action=button.getAttribute('onclick')||'';
    const text=(button.textContent||'').trim();
    return /show(?:Client|Coach)\s*\(\s*['"]messages['"]\s*\)/i.test(action)||/mensajes/i.test(text);
  };

  /* Una sola corrección de posición al entrar en Mensajes. Nada de reintentos
     posteriores: en iPhone esos scrollTo repetidos provocaban el efecto de vibración. */
  document.addEventListener('click',event=>{
    const button=event.target.closest('#client-nav button,#coach-nav button');
    if(!isMessagesAction(button))return;
    stabilizeInitialEntry();
  },true);

  function wrap(name){
    const current=window[name];
    if(typeof current!=='function'||current.__dccMessagesPositionStableV5)return;

    const wrapped=function(screen){
      const result=current.apply(this,arguments);
      if(screen==='messages')stabilizeInitialEntry();
      return result;
    };

    wrapped.__dccMessagesPositionStableV5=true;
    wrapped.__base=current;
    window[name]=wrapped;
  }

  function install(){
    wrap('showClient');
    wrap('showCoach');
  }

  install();
  setTimeout(install,250);
  setTimeout(install,800);

  /* Importante: no se fuerza el scroll de la ventana al abrir una conversación.
     El propio chat gestiona su contenido y así la transición de cliente queda fija. */
})();
