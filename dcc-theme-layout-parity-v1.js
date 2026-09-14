/* DCC — paridad estructural entre apariencia clara y oscura */
(function(){
  'use strict';
  const BUILD='20260914-theme-layout-parity-v1';
  if(window.__dccThemeLayoutParity===BUILD)return;
  window.__dccThemeLayoutParity=BUILD;

  const ID='dcc-theme-layout-parity-css';
  function install(){
    document.getElementById(ID)?.remove();
    const s=document.createElement('style');
    s.id=ID;
    s.textContent=`
      /* La geometría es común a ambos temas. Solo cambian colores/superficies. */
      #coach-main,#client-main{box-sizing:border-box}
      #coach-main .dcc-ca-wrap{width:100%;max-width:900px;margin-left:auto!important;margin-right:auto!important}
      #coach-main.dcc-premium-clients .dcc-cl,
      #coach-main.dcc-final-clients .dcc-fcl{max-width:820px!important;margin-left:auto!important;margin-right:auto!important}

      /* Ficha del cliente: misma composición compacta en light y dark */
      #coach-main.dcc-ca .dcc-ca-head{margin:10px 2px 10px!important}
      #coach-main.dcc-ca .dcc-ca-head h1{margin:0!important;line-height:1.03!important;letter-spacing:-1px!important}
      #coach-main.dcc-ca .dcc-ca-goal{margin-top:4px!important;line-height:1.2!important}
      #coach-main.dcc-ca .dcc-ca-metrics{gap:8px!important}
      #coach-main.dcc-ca .dcc-ca-tabs{margin:12px 0 11px!important}
      #coach-main.dcc-ca .dcc-v5-plan{margin:8px 0 10px!important}
      #coach-main.dcc-ca .dcc-plan-compact-alert{min-height:50px!important;padding:8px 11px!important}

      /* Editores: mismas dimensiones y espaciado en ambos temas */
      #coach-main .dcc-n2-editorbar,
      #coach-main .dcc-tr-head{scroll-margin-top:12px}
      #coach-main .dcc-diet-switch{margin-top:10px!important;margin-bottom:12px!important}
      #coach-main .dcc-diet-meals,
      #coach-main .dcc-tr-days{gap:8px!important}

      /* Navegación: misma caja y posición en ambas apariencias */
      #coach-nav,#client-nav{box-sizing:border-box!important}
      #coach-nav button,#client-nav button{box-sizing:border-box!important}

      @media(max-width:700px){
        #coach-main{padding-left:14px!important;padding-right:14px!important;padding-bottom:112px!important}
        #client-main{padding-bottom:112px!important}
        #coach-main.dcc-ca .dcc-ca-head{margin-top:8px!important;margin-bottom:10px!important}
        #coach-main.dcc-ca .dcc-ca-head h1{font-size:31px!important}
        #coach .side,#client .side{left:10px!important;right:10px!important;bottom:10px!important;width:auto!important;height:68px!important;border-radius:22px!important}
      }
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  function sync(){
    install();
    document.documentElement.classList.add('dcc-theme-layout-parity');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});
  else sync();
  window.addEventListener('dcc:themechange',sync);
  window.addEventListener('pageshow',sync);
})();
