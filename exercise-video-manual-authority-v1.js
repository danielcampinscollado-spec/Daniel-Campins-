/* DCC — autoridad manual de vídeos de ejercicios */
(function(){'use strict';const BUILD='20261005-manual-video-authority1';if(window.__dccManualVideoAuthority===BUILD)return;window.__dccManualVideoAuthority=BUILD;
function clearLibraryVideos(){const lib=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];for(const ex of lib){if(!ex||typeof ex!=='object')continue;ex.videoUrl='';if('video_url'in ex)ex.video_url='';if('video'in ex)ex.video='';}return lib.length}
async function apply(){try{if(window.exerciseLibraryReady)await window.exerciseLibraryReady}catch(e){console.error('DCC videoteca:',e)}clearLibraryVideos()}
apply();document.addEventListener('DOMContentLoaded',apply,{once:true});window.addEventListener('pageshow',apply);
})();