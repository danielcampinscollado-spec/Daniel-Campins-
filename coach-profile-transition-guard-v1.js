/* DCC — evita el destello de la ficha antigua antes de la ficha premium */
(function(){
'use strict';
const BUILD='20260916-profile-transition-guard-v2-slowload';
if(window.__dccProfileTransitionGuard===BUILD)return;
window.__dccProfileTransitionGuard=BUILD;

const STYLE_ID='dcc-profile-transition-guard-css';
if(!document.getElementById(STYLE_ID)){
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    body.dcc-client-profile-transition #coach-main.dcc-ca .dcc-ca-wrap{visibility:hidden!important;opacity:0!important}
    body.dcc-client-profile-transition #coach-main.dcc-ca::before{content:'Cargando cliente…';display:block;max-width:900px;margin:18px auto;padding:16px 18px;border:1px solid rgba(177,119,18,.22);border-radius:18px;background:#fffaf1;color:#8d5b08;font-size:12px;font-weight:800;box-shadow:0 8px 22px rgba(78,58,28,.05)}
    #coach-main.dcc-ca .dcc-profile-v2-notes.dcc-notes-transition{visibility:hidden!important;opacity:0!important}
    #coach-main.dcc-ca .dcc-profile-v2-notes{transition:opacity .08s ease}
  `;
  (document.head||document.documentElement).appendChild(s);
}

let profileTimer=null;
let notesTimer=null;

function releaseProfile(){
  document.body?.classList.remove('dcc-client-profile-transition');
  if(profileTimer){clearTimeout(profileTimer);profileTimer=null}
}
function armFallback(){
  if(profileTimer)clearTimeout(profileTimer);
  profileTimer=setTimeout(()=>{
    const main=document.getElementById('coach-main');
    const premium=main?.querySelector('.dcc-profile-v2-summary,.dcc-profile-v2-notes');
    if(premium)releaseProfile();
    else {
      document.body?.classList.remove('dcc-client-profile-transition');
      profileTimer=null;
    }
  },8000);
}
function guardProfile(main){
  if(!main?.classList.contains('dcc-ca')){releaseProfile();return}
  const wrap=main.querySelector('.dcc-ca-wrap');
  if(!wrap)return;
  const premium=main.querySelector('.dcc-profile-v2-summary,.dcc-profile-v2-notes');
  if(premium){releaseProfile();return}
  document.body?.classList.add('dcc-client-profile-transition');
  if(!profileTimer)armFallback();
}
function guardNotes(main){
  const notes=main?.querySelector('.dcc-profile-v2-notes');
  if(!notes)return;
  if(notes.dataset.dccTransitionGuard==='ready')return;
  if(notes.dataset.dccTransitionGuard!=='started'){
    notes.dataset.dccTransitionGuard='started';
    notes.classList.add('dcc-notes-transition');
    if(notesTimer)clearTimeout(notesTimer);
    notesTimer=setTimeout(()=>{
      notes.classList.remove('dcc-notes-transition');
      notes.dataset.dccTransitionGuard='ready';
    },1200);
  }
  const title=(notes.querySelector('.dcc-v2-card:first-child h2')?.textContent||'').trim();
  if(title==='Configuración actual'||title==='Modificar seguimiento'||title==='Configuración de seguimiento'){
    notes.classList.remove('dcc-notes-transition');
    notes.dataset.dccTransitionGuard='ready';
    if(notesTimer){clearTimeout(notesTimer);notesTimer=null}
  }
}
function scan(){
  const main=document.getElementById('coach-main');
  if(!main){releaseProfile();return}
  guardProfile(main);
  guardNotes(main);
}

document.addEventListener('click',e=>{
  const t=e.target.closest('button,a');
  if(!t)return;
  const txt=(t.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
  if(txt.includes('gestionar cliente')){
    document.body?.classList.add('dcc-client-profile-transition');
    armFallback();
  }
},true);

document.addEventListener('dcc:followup-ready',()=>{
  const notes=document.querySelector('#coach-main.dcc-ca .dcc-profile-v2-notes');
  if(!notes)return;
  notes.classList.remove('dcc-notes-transition');
  notes.dataset.dccTransitionGuard='ready';
  if(notesTimer){clearTimeout(notesTimer);notesTimer=null}
});

const obs=new MutationObserver(scan);
if(document.body){obs.observe(document.body,{childList:true,subtree:true});scan()}
else document.addEventListener('DOMContentLoaded',()=>{obs.observe(document.body,{childList:true,subtree:true});scan()},{once:true});
window.addEventListener('pageshow',scan);
})();