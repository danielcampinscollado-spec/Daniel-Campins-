/* DCC — Clientes v10: filtro pendientes + orden alfabético, sin depender de wrappers anteriores */
(function(){
  'use strict';

  const STYLE_ID='dcc-clients-controls-v10';
  let mode='all';
  let sortMode='az';
  let scheduled=false;

  const norm=v=>String(v??'')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLocaleLowerCase('es')
    .trim();

  function addCss(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #coach-main.dcc-premium-clients .dcc-cl-subtools{
        display:flex!important;align-items:center!important;justify-content:space-between!important;
        gap:10px!important;margin:12px 0 14px!important;position:relative!important;z-index:60!important;
        pointer-events:auto!important;
      }
      #coach-main.dcc-premium-clients .dcc-cl-tabs,
      #coach-main.dcc-premium-clients .dcc-client-hotfix-left,
      #coach-main.dcc-premium-clients .dcc-v9-left{
        display:flex!important;align-items:center!important;min-width:0!important;flex:1!important;
        border:0!important;background:transparent!important;overflow:visible!important;gap:7px!important;
        pointer-events:auto!important;position:relative!important;z-index:61!important;
      }
      #coach-main.dcc-premium-clients .dcc-v10-all,
      #coach-main.dcc-premium-clients .dcc-v10-pending,
      #coach-main.dcc-premium-clients .dcc-v10-sort{
        -webkit-appearance:none!important;appearance:none!important;pointer-events:auto!important;
        touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;
        cursor:pointer!important;position:relative!important;z-index:62!important;
        opacity:1!important;filter:none!important;user-select:none!important;
      }
      #coach-main.dcc-premium-clients .dcc-v10-all,
      #coach-main.dcc-premium-clients .dcc-v10-pending{
        height:43px!important;border-radius:999px!important;padding:0 15px!important;
        border:1px solid rgba(217,170,74,.48)!important;
        background:linear-gradient(145deg,#101419,#090c0f)!important;
        color:#aeb5be!important;font-size:10.5px!important;font-weight:800!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;white-space:nowrap!important;
      }
      #coach-main.dcc-premium-clients .dcc-v10-all.is-active,
      #coach-main.dcc-premium-clients .dcc-v10-pending.is-active{
        border-color:#f0c96b!important;color:#f0c96b!important;
        background:radial-gradient(circle at 50% 50%,rgba(217,170,74,.22),#15100a 72%)!important;
        box-shadow:0 0 18px rgba(217,170,74,.18),inset 0 1px 0 rgba(255,255,255,.04)!important;
      }
      #coach-main.dcc-premium-clients .dcc-v10-sort{
        height:48px!important;min-width:92px!important;flex:none!important;padding:0 13px!important;
        border:1px solid rgba(240,201,107,.72)!important;border-radius:16px!important;
        background:linear-gradient(145deg,#15130e,#090c0e)!important;
        color:#f0c96b!important;display:flex!important;flex-direction:column!important;
        align-items:center!important;justify-content:center!important;gap:2px!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 22px rgba(0,0,0,.24)!important;
      }
      #coach-main.dcc-premium-clients .dcc-v10-sort svg{display:none!important}
      #coach-main.dcc-premium-clients .dcc-v10-sort small{
        display:block!important;font-size:7px!important;line-height:1!important;letter-spacing:1.35px!important;
        color:#858d98!important;font-weight:900!important;
      }
      #coach-main.dcc-premium-clients .dcc-v10-sort strong{
        display:block!important;font-size:12.5px!important;line-height:1.15!important;letter-spacing:.5px!important;
        color:#f0c96b!important;font-weight:900!important;
      }
      #coach-main.dcc-premium-clients .dcc-v10-all:active,
      #coach-main.dcc-premium-clients .dcc-v10-pending:active,
      #coach-main.dcc-premium-clients .dcc-v10-sort:active{transform:scale(.96)!important}
      #coach-main.dcc-premium-clients .dcc-v10-empty{
        padding:28px 16px!important;border:1px solid rgba(217,170,74,.3)!important;border-radius:17px!important;
        background:linear-gradient(145deg,#101419,#090c0f)!important;text-align:center!important;
        color:#929aa5!important;font-size:12px!important;
      }
      #coach-main.dcc-premium-clients .dcc-v10-empty b{display:block;color:#f0c96b;font-size:14px;margin-bottom:5px}
      @media(max-width:600px){
        #coach-main.dcc-premium-clients .dcc-v10-all{padding:0 12px!important}
        #coach-main.dcc-premium-clients .dcc-v10-pending{padding:0 11px!important;font-size:9.7px!important}
        #coach-main.dcc-premium-clients .dcc-v10-sort{min-width:80px!important;padding:0 10px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function cards(){
    return [...document.querySelectorAll('#dccClientList .dcc-cl-card')];
  }

  function cardName(card){
    return card.dataset.name || card.querySelector('.dcc-cl-name')?.textContent || '';
  }

  function clientForCard(card){
    const name=norm(cardName(card));
    const list=window.data?.clients || [];
    return list.find(c=>norm(c?.name)===name) || null;
  }

  function isPending(client){
    if(!client) return false;
    const x=window.data?.checkins?.[client.id];
    if(!x) return client?.status==='Pendiente';
    if(x.reviewed===true) return false;
    return !!(x.sentAt || x.updatedAt || x.diet || x.training || x.comment || client?.status==='Pendiente');
  }

  function searchQuery(){
    return norm(document.getElementById('dccClientSearch')?.value || '');
  }

  function emptyBox(){
    const list=document.getElementById('dccClientList');
    if(!list) return null;
    let box=document.getElementById('dccV10Empty');
    if(!box){
      box=document.createElement('div');
      box.id='dccV10Empty';
      box.className='dcc-v10-empty';
      box.style.display='none';
      list.insertAdjacentElement('afterend',box);
    }
    return box;
  }

  function applyFilter(){
    const q=searchQuery();
    const list=cards();
    let visible=0;

    list.forEach(card=>{
      const matchesName=!q || norm(cardName(card)).includes(q);
      const matchesMode=mode!=='pending' || isPending(clientForCard(card));
      const show=matchesName && matchesMode;
      card.classList.toggle('dcc-hidden',!show);
      card.style.setProperty('display',show?'':'none',show?'':'important');
      if(show) visible++;
    });

    const oldEmpty=document.getElementById('dccClientEmptyFilter');
    if(oldEmpty) oldEmpty.classList.remove('show');

    const box=emptyBox();
    if(box){
      if(visible===0 && list.length){
        box.innerHTML=mode==='pending'
          ? '<b>Todo revisado</b><span>No hay clientes pendientes por revisar.</span>'
          : '<b>Sin resultados</b><span>No hay clientes con ese nombre.</span>';
        box.style.display='block';
      }else{
        box.style.display='none';
      }
    }
  }

  function applySort(){
    const list=document.getElementById('dccClientList');
    if(!list) return;
    cards().sort((a,b)=>{
      const an=norm(cardName(a));
      const bn=norm(cardName(b));
      return sortMode==='az' ? an.localeCompare(bn,'es') : bn.localeCompare(an,'es');
    }).forEach(card=>list.appendChild(card));
    document.querySelectorAll('[data-dcc-v10-sort-state]').forEach(x=>x.textContent=sortMode==='az'?'A—Z':'Z—A');
    applyFilter();
  }

  function candidates(){
    return {
      all:[...document.querySelectorAll('.dcc-cl-tab,.dcc-client-all-v8,.dcc-v9-all,.dcc-v10-all')].filter(b=>norm(b.textContent).startsWith('todos')),
      pending:[...document.querySelectorAll('.dcc-cl-pending,.dcc-client-pending-v8,.dcc-v9-pending,.dcc-v10-pending')],
      sort:[...document.querySelectorAll('.dcc-cl-order,.dcc-client-sort-v8,.dcc-v9-sort,.dcc-v10-sort')]
    };
  }

  function prepareButton(btn,type){
    if(!btn) return;
    btn.disabled=false;
    btn.removeAttribute('disabled');
    btn.removeAttribute('aria-disabled');
    btn.style.pointerEvents='auto';
    btn.style.touchAction='manipulation';
    btn.onclick=null;

    if(type==='all'){
      btn.classList.add('dcc-v10-all');
      btn.classList.toggle('is-active',mode==='all');
      if(btn.dataset.dccV10!=='all'){
        btn.textContent='Todos';
        btn.dataset.dccV10='all';
      }
    }

    if(type==='pending'){
      btn.classList.add('dcc-v10-pending');
      btn.classList.toggle('is-active',mode==='pending');
      if(btn.dataset.dccV10!=='pending'){
        btn.textContent='Pendientes por revisar';
        btn.dataset.dccV10='pending';
      }
    }

    if(type==='sort'){
      btn.classList.add('dcc-v10-sort');
      if(btn.dataset.dccV10!=='sort'){
        btn.innerHTML='<small>ORDEN</small><strong data-dcc-v10-sort-state>'+(sortMode==='az'?'A—Z':'Z—A')+'</strong>';
        btn.dataset.dccV10='sort';
      }
    }
  }

  function enhance(){
    scheduled=false;
    const main=document.getElementById('coach-main');
    if(!main || !main.classList.contains('dcc-premium-clients')) return;
    if(!document.getElementById('dccClientList')) return;

    addCss();
    const c=candidates();
    c.all.forEach(b=>prepareButton(b,'all'));
    c.pending.forEach(b=>prepareButton(b,'pending'));
    c.sort.forEach(b=>prepareButton(b,'sort'));

    const search=document.getElementById('dccClientSearch');
    if(search && search.dataset.dccV10Search!=='1'){
      search.dataset.dccV10Search='1';
      search.addEventListener('input',applyFilter);
      search.addEventListener('search',applyFilter);
      search.addEventListener('keyup',applyFilter);
    }

    applySort();
  }

  function scheduleEnhance(){
    if(scheduled) return;
    scheduled=true;
    setTimeout(enhance,0);
  }

  document.addEventListener('click',function(e){
    const btn=e.target.closest('button');
    if(!btn) return;
    const isAll=btn.classList.contains('dcc-v10-all') || btn.classList.contains('dcc-client-all-v8') || btn.classList.contains('dcc-v9-all') || (btn.classList.contains('dcc-cl-tab') && norm(btn.textContent).startsWith('todos'));
    const isPending=btn.classList.contains('dcc-v10-pending') || btn.classList.contains('dcc-cl-pending') || btn.classList.contains('dcc-client-pending-v8') || btn.classList.contains('dcc-v9-pending');
    const isSort=btn.classList.contains('dcc-v10-sort') || btn.classList.contains('dcc-cl-order') || btn.classList.contains('dcc-client-sort-v8') || btn.classList.contains('dcc-v9-sort');
    if(!isAll && !isPending && !isSort) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if(isAll){
      mode='all';
      candidates().all.forEach(b=>b.classList.add('is-active'));
      candidates().pending.forEach(b=>b.classList.remove('is-active'));
      applyFilter();
      return;
    }

    if(isPending){
      mode='pending';
      candidates().all.forEach(b=>b.classList.remove('is-active'));
      candidates().pending.forEach(b=>b.classList.add('is-active'));
      applyFilter();
      return;
    }

    sortMode=sortMode==='az'?'za':'az';
    applySort();
  },true);

  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.type==='childList' && (m.addedNodes.length || m.removedNodes.length))) scheduleEnhance();
  });

  function install(){
    addCss();
    const main=document.getElementById('coach-main');
    if(main) observer.observe(main,{childList:true,subtree:true});
    scheduleEnhance();
    setTimeout(scheduleEnhance,100);
    setTimeout(scheduleEnhance,350);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
  window.addEventListener('load',()=>setTimeout(scheduleEnhance,50));
})();
