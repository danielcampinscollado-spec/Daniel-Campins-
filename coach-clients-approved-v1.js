/* DCC — Clientes entrenador: layout compacto aprobado 2026-09-19.
   Capa de presentación. No modifica datos, permisos ni sincronización. */
(function(){
'use strict';
if(window.__dccCoachClientsApprovedV1)return;
window.__dccCoachClientsApprovedV1=true;

const STYLE_ID='dcc-coach-clients-approved-v1';
function esc2(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function fmtDate(c){
  const raw=c?.created_at||c?.createdAt||c?.created||c?.date_created||'';
  if(!raw)return '';
  const d=new Date(raw); if(Number.isNaN(d.getTime()))return '';
  return 'Desde '+new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short',year:'numeric'}).format(d).replace('.','');
}
function iconUsers(){
 return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6"/><path d="M14 15c3-.2 5 1.3 5.5 4.5"/></svg>';
}
function iconSearch(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>';}
function installStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
html.dcc-theme-light-premium #coach-main.dcc-approved-clients{padding-top:18px!important}
.dcc-ac{max-width:820px;margin:0 auto;color:#17191d}
.dcc-ac-topline{display:flex;justify-content:flex-end;margin-bottom:6px}
.dcc-ac-secure{display:inline-flex;align-items:center;min-height:34px;padding:0 14px;border:1px solid rgba(183,123,19,.28);border-radius:999px;color:#9b670e;font-size:10px;font-weight:850;letter-spacing:1.8px;text-transform:uppercase;background:rgba(255,253,248,.72)}
.dcc-ac-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:16px}
.dcc-ac-title h1{margin:0!important;font-size:36px!important;line-height:1!important;letter-spacing:-1.2px!important;color:#111318!important}
.dcc-ac-title p{margin:8px 0 0!important;font-size:15px!important;color:#707784!important}
.dcc-ac-sort{height:44px;padding:0 14px;border:1px solid rgba(183,123,19,.30);border-radius:15px;background:#fffdf8;color:#17191d;font-weight:750;font-size:14px;display:flex;align-items:center;gap:9px;white-space:nowrap}
.dcc-ac-sort svg{width:18px;height:18px}.dcc-ac-sort .chev{font-size:15px;color:#8d5b08}
.dcc-ac-new{width:100%;height:62px;border:1px solid #e0ad41;border-radius:20px;background:linear-gradient(135deg,#f8db83,#e9b63e);color:#17130a;font-size:20px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:12px;box-shadow:0 8px 20px rgba(185,125,20,.12);margin-bottom:10px}
.dcc-ac-new .plus{font-size:34px;line-height:1;font-weight:400}
.dcc-ac-search{height:54px;display:flex;align-items:center;gap:12px;padding:0 16px;border:1px solid rgba(183,123,19,.28);border-radius:18px;background:#fffefa;margin-bottom:10px;box-shadow:0 5px 16px rgba(78,58,28,.035)}
.dcc-ac-search svg{width:23px;height:23px;color:#747b87;flex:0 0 23px}
html.dcc-theme-light-premium #coach-main .dcc-ac-search input{width:100%;height:100%;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;outline:0!important;font-size:16px!important;color:#17191d!important}
.dcc-ac-list{display:flex;flex-direction:column;gap:9px}
.dcc-ac-client{min-height:72px;padding:10px 12px;display:grid;grid-template-columns:54px minmax(0,1fr) auto;align-items:center;gap:12px;border:1px solid rgba(183,123,19,.24);border-radius:18px;background:linear-gradient(145deg,#fffefa,#fbf5eb);box-shadow:0 6px 18px rgba(78,58,28,.045)}
.dcc-ac-avatar{width:48px;height:48px;border:1px solid rgba(183,123,19,.24);border-radius:15px;background:#fff5dc;color:#9b670e;display:flex;align-items:center;justify-content:center}.dcc-ac-avatar svg{width:28px;height:28px}
.dcc-ac-copy{min-width:0}.dcc-ac-name{font-size:17px;font-weight:800;line-height:1.1;color:#111318;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dcc-ac-date{margin-top:5px;font-size:13px;color:#777e89}
.dcc-ac-manage{min-width:116px;height:44px;padding:0 14px;border:1.5px solid #bd841a;border-radius:15px;background:#fffdf8;color:#79500a;font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:9px}.dcc-ac-manage .arrow{font-size:24px;line-height:1}
.dcc-ac-empty{padding:28px 18px;text-align:center;border:1px solid rgba(183,123,19,.22);border-radius:18px;background:#fffdf8;color:#777e89}
@media(max-width:600px){
 html.dcc-theme-light-premium #coach-main.dcc-approved-clients{padding:16px 14px 112px!important}
 .dcc-ac-topline{margin-bottom:8px}.dcc-ac-secure{font-size:9px;letter-spacing:1.5px;min-height:32px;padding:0 12px}
 .dcc-ac-head{align-items:flex-end;margin-bottom:14px}.dcc-ac-title h1{font-size:31px!important}.dcc-ac-title p{font-size:14px!important;max-width:210px}
 .dcc-ac-sort{height:42px;padding:0 12px;font-size:13px;border-radius:14px}.dcc-ac-sort svg{width:17px;height:17px}
 .dcc-ac-new{height:58px;border-radius:18px;font-size:18px;margin-bottom:9px}
 .dcc-ac-search{height:52px;border-radius:17px;margin-bottom:9px}
 .dcc-ac-list{gap:8px}.dcc-ac-client{min-height:70px;padding:9px 10px;grid-template-columns:50px minmax(0,1fr) 108px;gap:10px;border-radius:17px}
 .dcc-ac-avatar{width:46px;height:46px;border-radius:14px}.dcc-ac-name{font-size:16px}.dcc-ac-date{font-size:12px}
 .dcc-ac-manage{min-width:108px;height:42px;padding:0 10px;font-size:13px;border-radius:14px}
}
@media(max-width:380px){.dcc-ac-title p{max-width:170px}.dcc-ac-sort{padding:0 9px;font-size:12px}.dcc-ac-client{grid-template-columns:46px minmax(0,1fr) 98px}.dcc-ac-manage{min-width:98px;font-size:12px}}
`;
 (document.head||document.documentElement).appendChild(s);
}
let asc=true,query='';
function render(){
 const main=document.getElementById('coach-main'); if(!main)return;
 main.className='dcc-approved-clients';
 let clients=Array.isArray(window.data?.clients)?[...window.data.clients]:[];
 clients.sort((a,b)=>String(a?.name||'').localeCompare(String(b?.name||''),'es',{sensitivity:'base'})*(asc?1:-1));
 const visible=clients.filter(c=>String(c?.name||'').toLowerCase().includes(query));
 main.innerHTML=`<div class="dcc-ac">
   <div class="dcc-ac-head">
     <div class="dcc-ac-title"><h1>Clientes</h1><p>Gestiona y acompaña su progreso.</p></div>
     <button class="dcc-ac-sort" type="button" id="dcc-ac-sort" aria-label="Cambiar orden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h12M4 18h8"/></svg><span>Orden ${asc?'A–Z':'Z–A'}</span><span class="chev">⌄</span></button>
   </div>
   <button class="dcc-ac-new" type="button" id="dcc-ac-new"><span class="plus">＋</span><span>Nuevo cliente</span></button>
   <label class="dcc-ac-search">${iconSearch()}<input id="dcc-ac-q" type="search" autocomplete="off" placeholder="Buscar cliente..." value="${esc2(query)}"></label>
   <div class="dcc-ac-list">${visible.length?visible.map(c=>{const d=fmtDate(c);return `<div class="dcc-ac-client" data-name="${esc2(c.name)}"><div class="dcc-ac-avatar">${iconUsers()}</div><div class="dcc-ac-copy"><div class="dcc-ac-name">${esc2(c.name)}</div>${d?`<div class="dcc-ac-date">${esc2(d)}</div>`:''}</div><button class="dcc-ac-manage" type="button" data-client-id="${esc2(c.id)}">Gestionar <span class="arrow">›</span></button></div>`}).join(''):'<div class="dcc-ac-empty">No hay clientes que coincidan con la búsqueda.</div>'}</div>
 </div>`;
 main.querySelector('#dcc-ac-new')?.addEventListener('click',()=>window.newClient?.());
 main.querySelector('#dcc-ac-sort')?.addEventListener('click',()=>{asc=!asc;render();});
 const q=main.querySelector('#dcc-ac-q');q?.addEventListener('input',e=>{query=e.target.value.toLowerCase();render();requestAnimationFrame(()=>{const n=document.getElementById('dcc-ac-q');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);}});});
 main.querySelectorAll('[data-client-id]').forEach(b=>b.addEventListener('click',()=>window.openClient?.(b.dataset.clientId)));
}
function wrap(){
 const original=window.showCoach;if(typeof original!=='function'||original.__dccApprovedClients)return false;
 function wrapped(screen){
   if(screen==='clients'){window.currentScreen='clients';window.__dccCoachRouteIntent='clients';render();const nav=document.getElementById('coach-nav');nav?.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.textContent.trim()==='Clientes'));document.dispatchEvent(new CustomEvent('dcc:coach-screen',{detail:{screen:'clients'}}));return;}
   return original.apply(this,arguments);
 }
 wrapped.__dccApprovedClients=true;wrapped.__original=original;window.showCoach=wrapped;return true;
}
installStyle();
if(!wrap()){
 document.addEventListener('dcc:profile-critical-ready',wrap);
 document.addEventListener('dcc:support-ready',wrap);
 document.addEventListener('DOMContentLoaded',()=>{installStyle();wrap();},{once:true});
}
})();