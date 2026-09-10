/* DCC — Unifica las métricas de Progreso con el resto de pestañas */
(function(){
  const FORCE_ICON="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f2c85f' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='14' width='3' height='6' rx='.8'/%3E%3Crect x='10.5' y='9.5' width='3' height='10.5' rx='.8'/%3E%3Crect x='17' y='5' width='3' height='15' rx='.8'/%3E%3C/svg%3E";

  function installCss(){
    if(document.getElementById('dcc-progress-metrics-unify-css')) return;
    const s=document.createElement('style');
    s.id='dcc-progress-metrics-unify-css';
    s.textContent=`
      html body #coach-main.dcc-ca .dcc-ca-metrics{align-items:stretch!important}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric{height:auto!important}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric.dcc-progress-force-card::before{
        background-image:url("${FORCE_ICON}")!important;
      }
    `;
    document.head.appendChild(s);
  }

  function normalizeProgressMetrics(){
    const root=document.querySelector('#coach-main.dcc-ca .dcc-ca-wrap');
    if(!root) return;
    const active=[...root.querySelectorAll('.dcc-ca-tab')].find(b=>b.classList.contains('active'));
    if(!active || !/progreso/i.test(active.textContent||'')) return;
    const metrics=root.querySelector('.dcc-ca-metrics');
    if(!metrics) return;
    const cards=[...metrics.children];
    if(cards.length<3) return;

    cards.forEach((card,index)=>{
      if(!card.classList.contains('dcc-p5-metric')) return;
      const copy=card.querySelector('.dcc-p5-copy');
      const label=copy?.querySelector('small')?.textContent||'';
      const value=copy?.querySelector('b')?.textContent||'—';
      const trend=copy?.querySelector('.dcc-ca-trend');
      card.className='dcc-ca-metric';
      if(index===2) card.classList.add('dcc-progress-force-card');
      card.innerHTML=`<small>${label}</small><b>${value}</b>${trend?trend.outerHTML:''}`;
    });
  }

  function wrapCurrent(){
    const current=window.dccClientAdmin;
    if(typeof current!=='function' || current.__dccMetricsUnified) return;
    const wrapped=function(id,tab){
      current(id,tab);
      if(tab==='progress') normalizeProgressMetrics();
    };
    wrapped.__dccMetricsUnified=true;
    wrapped.__base=current;
    window.dccClientAdmin=wrapped;
  }

  installCss();
  let tries=0;
  (function ensure(){
    wrapCurrent();
    if(++tries<80) setTimeout(ensure,100);
  })();

  /* Mantener abierta la comida del cliente al cambiar Opción 1/2/3. */
  if(!document.querySelector('script[data-dcc-nutrition-option-state]')){
    const nutritionState=document.createElement('script');
    nutritionState.src='./client-nutrition-option-state-v3.js?v=20260910-1';
    nutritionState.dataset.dccNutritionOptionState='1';
    nutritionState.async=false;
    document.head.appendChild(nutritionState);
  }
})();
