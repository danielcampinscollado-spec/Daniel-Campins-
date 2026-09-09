/* DCC — controles de clientes v9: navegación + orden alfabético fiables */
(function(){
  'use strict';

  const STYLE_ID='dcc-clients-controls-v9';
  const norm=v=>String(v??'')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLocaleLowerCase('es')
    .trim();

  function css(){
    document.getElementById(STYLE_ID)?.remove();
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #coach-main.dcc-premium-clients .dcc-cl-subtools{
        display:flex!important;align-items:center!important;justify-content:space-between!important;
        gap:8px!important;margin:12px 0 14px!important;position:relative!important;z-index:30!important;
        pointer-events:auto!important;
      }
      .dcc-v9-left{display:flex;align-items:center;gap:6px;min-width:0;flex:1;position:relative;z-index:31;pointer-events:auto}
      .dcc-v9-all,.dcc-v9-pending,.dcc-v9-sort{
        -webkit-appearance:none!important;appearance:none!important;pointer-events:auto!important;
        touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;cursor:pointer!important;
        position:relative!important;z-index:32!important;opacity:1!important;filter:none!important;
      }
      .dcc-v9-all,.dcc-v9-pending{height:43px;border-radius:999px;white-space:nowrap;font-size:10.2px;font-weight:800}
      .dcc-v9-all{padding:0 14px;border:1px solid #f0c96b;background:radial-gradient(circle,#d9aa4a32,#15100a);color:#f0c96b}
      .dcc-v9-pending{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 13px;border:1px solid rgba(217,170,74,.52);background:linear-gradient(145deg,#11151a,#090c0f);color:#e1e4e8}
      .dcc-v9-pending .arrow{font-size:18px;color:#f0c96b;line-height:1}
      .dcc-v9-sort{height:48px;min-width:76px;flex:none;padding:0 10px;border:1px solid rgba(240,201,107,.78);border-radius:15px;background:linear-gradient(145deg,#1a160e,#0a0c0e);color:#f0c96b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px}
      .dcc-v9-sort small{font-size:6.8px;letter-spacing:1.1px;color:#8e96a0;font-weight:900}
      .dcc-v9-sort strong{font-size:12px;letter-spacing:.4px;color:#f0c96b;font-weight:900}
      .dcc-v9-all:active,.dcc-v9-pending:active,.dcc-v9-sort:active{transform:scale(.96)!important}
      @media(max-width:600px){.dcc-v9-all{padding:0 10px}.dcc-v9-pending{padding:0 10px;font-size:9.4px}.dcc-v9-sort{min-width:70px;padding:0 8px}}
    `;
    document.head.appendChild(s);
  }

  function cards(){
    return [...document.querySelectorAll('#dccClientList .dcc-cl-card')];
  }

  function currentSearch(){
    return norm(document.getElementById('dccClientSearch')?.value || '');
  }

  function filter(){
    const q=currentSearch();
    let visible=0;
    const list=cards();
    list.forEach(card=>{
      const name=norm(card.dataset.name || card.querySelector('.dcc-cl-name')?.textContent || '');
      const show=!q || name.includes(q);
      card.classList.toggle('dcc-hidden',!show);
      card.style.display=show?'':'none';
      if(show) visible++;
    });
    const empty=document.getElementById('dccClientEmptyFilter');
    if(empty) empty.classList.toggle('show',list.length>0 && visible===0);
  }

  function sortNow(){
    const list=document.getElementById('dccClientList');
    if(!list) return;
    const mode=window.__dccClientSortV9==='za'?'za':'az';
    cards().sort((a,b)=>{
      const an=norm(a.dataset.name || a.querySelector('.dcc-cl-name')?.textContent || '');
      const bn=norm(b.dataset.name || b.querySelector('.dcc-cl-name')?.textContent || '');
      return mode==='za' ? bn.localeCompare(an,'es') : an.localeCompare(bn,'es');
    }).forEach(card=>list.appendChild(card));
    const state=document.getElementById('dccSortStateV9');
    if(state) state.textContent=mode==='za'?'Z—A':'A—Z';
    filter();
  }

  window.dccClientsV9Pending=function(){
    if(typeof window.showCoach==='function') window.showCoach('checkins');
  };

  window.dccClientsV9Sort=function(){
    window.__dccClientSortV9=window.__dccClientSortV9==='za'?'az':'za';
    sortNow();
  };

  window.dccClientsV9All=function(){
    const input=document.getElementById('dccClientSearch');
    if(input){input.value='';input.focus({preventScroll:true});}
    filter();
  };

  function enhance(){
    const main=document.getElementById('coach-main');
    if(!main || !main.classList.contains('dcc-premium-clients')) return;
    if(!document.getElementById('dccClientList')) return;

    css();

    const search=document.getElementById('dccClientSearch');
    if(search && !search.dataset.v9Bound){
      search.dataset.v9Bound='1';
      search.oninput=filter;
      search.onsearch=filter;
      search.onkeyup=filter;
    }

    const tools=main.querySelector('.dcc-cl-subtools');
    if(tools && !tools.querySelector('#dccSortV9')){
      tools.innerHTML=`
        <div class="dcc-v9-left">
          <button type="button" class="dcc-v9-all" onclick="window.dccClientsV9All()">Todos</button>
          <button type="button" class="dcc-v9-pending" onclick="window.dccClientsV9Pending()"><span>Pendientes por revisar</span><span class="arrow">›</span></button>
        </div>
        <button type="button" class="dcc-v9-sort" id="dccSortV9" onclick="window.dccClientsV9Sort()" aria-label="Cambiar orden alfabético">
          <small>ORDEN</small><strong id="dccSortStateV9">A—Z</strong>
        </button>`;
    }

    if(window.__dccClientSortV9!=='za') window.__dccClientSortV9='az';
    sortNow();
  }

  function install(){
    if(window.__dccClientsV9Installed) return;
    window.__dccClientsV9Installed=true;

    const previous=window.showCoach;
    if(typeof previous==='function'){
      const wrapped=function(screen){
        const result=previous.apply(this,arguments);
        if(screen==='clients'){
          setTimeout(enhance,35);
          setTimeout(enhance,90);
        }
        return result;
      };
      wrapped.__original=previous.__original||previous;
      wrapped.__dccClientsV9=true;
      window.showCoach=wrapped;
    }

    const main=document.getElementById('coach-main');
    if(main){
      const observer=new MutationObserver(()=>{
        if(window.currentScreen==='clients') setTimeout(enhance,0);
      });
      observer.observe(main,{childList:true,subtree:true});
      window.__dccClientsV9Observer=observer;
    }

    if(window.currentScreen==='clients'){
      setTimeout(enhance,0);
      setTimeout(enhance,80);
    }
  }

  setTimeout(install,180);
  window.addEventListener('load',()=>setTimeout(install,220));
})();
