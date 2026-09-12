/* DCC — compatibilidad legacy. La presentación canónica vive en dcc-runtime-core-v1.js. */
(function(){
  'use strict';
  window.__dccRuntimeVisualStabilityV3=true;
  [
    'dcc-runtime-visual-stability-v3-css',
    'dcc-light-premium-final-polish-v1-css',
    'dcc-light-premium-final-polish-v2-css'
  ].forEach(id=>document.getElementById(id)?.remove());
})();
