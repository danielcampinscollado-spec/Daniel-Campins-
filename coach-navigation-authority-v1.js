/* DCC — compatibilidad de navegación. La única autoridad es coach-premium-core-v9. */
(function(){
'use strict';
window.__dccCoachNavigationAuthority='20260915-retired-single-router';
window.dccOpenCoachPrimary=i=>{const routes=['dashboard','clients','calendar','checkins','messages'];const s=routes[i];if(s&&typeof window.showCoach==='function')window.showCoach(s)};
window.dccOpenCoachCalendar=()=>window.showCoach?.('calendar');
window.dccOpenCoachCheckins=()=>window.showCoach?.('checkins');
window.dccOpenCoachMessages=()=>window.showCoach?.('messages');
})();
