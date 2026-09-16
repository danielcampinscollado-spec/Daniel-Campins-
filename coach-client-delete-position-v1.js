/* DCC — posición compacta de Eliminar cliente junto al encabezado */
(function(){
'use strict';
const BUILD='20260916-delete-position-v2-compact';
if(window.__dccDeletePosition===BUILD)return;window.__dccDeletePosition=BUILD;
function css(){let s=document.getElementById('dcc-delete-position-v1-css');if(s)s.remove();s=document.createElement('style');s.id='dcc-delete-position-v1-css';s.textContent=`
#coach-main.dcc-ca .dcc-profile-delete-bottom{display:none!important}
#coach-main.dcc-ca .dcc-ca-profilebar{align-items:center!important}
#coach-main.dcc-ca .dcc-profile-delete-near-header{flex:none;align-self:center;width:auto!important;margin:0!important;padding:9px 12px!important;border:1px solid rgba(190,55,60,.38)!important;border-radius:13px!important;background:rgba(155,28,34,.055)!important;color:#c94249!important;font-size:10px!important;font-weight:850!important;white-space:nowrap!important;line-height:1.2!important}
html.dcc-theme-light-premium body #coach-main.dcc-ca .dcc-profile-delete-near-header{background:#fff7f5!important;color:#b9363e!important;border-color:rgba(185,54,62,.28)!important;box-shadow:0 4px 12px rgba(130,54,54,.03)!important}
@media(max-width:390px){#coach-main.dcc-ca .dcc-profile-delete-near-header{margin:0!important;padding:8px 9px!important;font-size:9px!important}}
`;document.head.appendChild(s)}
function install(){css();const main=document.getElementById('coach-main');if(!main?.classList.contains('dcc-ca'))return;const bar=main.querySelector('.dcc-ca-profilebar');if(!bar)return;let b=bar.querySelector('.dcc-profile-delete-near-header');if(!b){b=document.createElement('button');b.type='button';b.className='dcc-profile-delete-near-header';b.textContent='Eliminar cliente';b.addEventListener('click',()=>{const id=String(window.selectedClient||'');if(id&&typeof window.dccLegacyDelete==='function')window.dccLegacyDelete(id)});bar.appendChild(b)}}
let q=false;function refresh(){if(q)return;q=true;requestAnimationFrame(()=>{q=false;install()})}
refresh();document.addEventListener('dcc:coach-screen',refresh);document.addEventListener('dcc:profile-critical-ready',refresh);document.addEventListener('click',()=>setTimeout(refresh,0),true);window.addEventListener('pageshow',refresh);
})();
