/* DCC premium loader v11 — direct client controls, no patch chain */
(function(){
  'use strict';

  function load(src,done){
    var s=document.createElement('script');
    s.src=src;
    s.onload=done||null;
    s.onerror=function(){console.error('No se pudo cargar',src)};
    document.head.appendChild(s);
  }

  const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();
  let sortMode='az';

  function addCss(){
    if(document.getElementById('dcc-v11-controls-css')) return;
    const st=document.createElement('style');
    st.id='dcc-v11-controls-css';
    st.textContent=`
      #coach-main.dcc-premium-clients .dcc-cl-subtools{position:relative!important;z-index:999!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;pointer-events:auto!important;overflow:visible!important}
      #coach-main.dcc-premium-clients .dcc-v11-left{display:flex!important;align-items:center!important;gap:7px!important;flex:1!important;min-width:0!important;position:relative!important;z-index:1000!important;pointer-events:auto!important}
      #coach-main.dcc-premium-clients .dcc-v11-all,#coach-main.dcc-premium-clients .dcc-v11-pending,#coach-main.dcc-premium-clients .dcc-v11-sort{position:relative!important;z-index:1001!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-appearance:none!important;appearance:none!important;opacity:1!important;filter:none!important;cursor:pointer!important}
      #coach-main.dcc-premium-clients .dcc-v11-all,#coach-main.dcc-premium-clients .dcc-v11-pending{height:43px!important;border-radius:999px!important;white-space:nowrap!important;font-size:10.5px!important;font-weight:800!important}
      #coach-main.dcc-premium-clients .dcc-v11-all{padding:0 15px!important;border:1px solid #f0c96b!important;background:radial-gradient(circle,#d9aa4a32,#15100a)!important;color:#f0c96b!important;box-shadow:0 0 16px #d9aa4a22!important}
      #coach-main.dcc-premium-clients .dcc-v11-pending{padding:0 15px!important;border:1px solid rgba(217,170,74,.55)!important;background:linear-gradient(145deg,#11151a,#090c0f)!important;color:#e7e9ec!important}
      #coach-main.dcc-premium-clients .dcc-v11-pending span:last-child{color:#f0c96b!important;font-size:18px!important;line-height:1!important;margin-left:5px!important}
      #coach-main.dcc-premium-clients .dcc-v11-sort{height:48px!important;min-width:90px!important;padding:0 12px!important;border:1px solid rgba(240,201,107,.8)!important;border-radius:16px!important;background:linear-gradient(145deg,#17140e,#090c0e)!important;color:#f0c96b!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 22px rgba(0,0,0,.25)!important}
      #coach-main.dcc-premium-clients .dcc-v11-sort small{font-size:7px!important;letter-spacing:1.4px!important;color:#858d98!important;font-weight:900!important;line-height:1!important}
      #coach-main.dcc-premium-clients .dcc-v11-sort strong{font-size:13px!important;color:#f0c96b!important;font-weight:900!important;line-height:1.1!important}
      #coach-main.dcc-premium-clients .dcc-v11-all:active,#coach-main.dcc-premium-clients .dcc-v11-pending:active,#coach-main.dcc-premium-clients .dcc-v11-sort:active{transform:scale(.96)!important}
      @media(max-width:600px){#coach-main.dcc-premium-clients .dcc-v11-all{padding:0 11px!important}#coach-main.dcc-premium-clients .dcc-v11-pending{padding:0 10px!important;font-size:9.7px!important}#coach-main.dcc-premium-clients .dcc-v11-sort{min-width:80px!important;padding:0 9px!important}}
    `;
    document.head.appendChild(st);
  }

  function cards(){
    return [...document.querySelectorAll('#dccClientList .dcc-cl-card')];
  }

  function sortCards(){
    const list=document.getElementById('dccClientList');
    if(!list) return;
    cards().sort((a,b)=>{
      const an=norm(a.dataset.name||a.querySelector('.dcc-cl-name')?.textContent||'');
      const bn=norm(b.dataset.name||b.querySelector('.dcc-cl-name')?.textContent||'');
      return sortMode==='az' ? an.localeCompare(bn,'es',{sensitivity:'base'}) : bn.localeCompare(an,'es',{sensitivity:'base'});
    }).forEach(card=>list.appendChild(card));
    const state=document.getElementById('dccV11SortState');
    if(state) state.textContent=sortMode==='az'?'A—Z':'Z—A';
  }

  function goCheckins(){
    const nav=[...document.querySelectorAll('#coach-nav button')];
    const btn=nav.find(b=>norm(b.textContent).includes('check-in')||norm(b.textContent).includes('checkin'));
    if(btn){ btn.click(); return; }
    if(typeof window.showCoach==='function') window.showCoach('checkins');
  }

  function replaceControls(){
    const main=document.getElementById('coach-main');
    if(!main || !main.classList.contains('dcc-premium-clients')) return;
    const tools=main.querySelector('.dcc-cl-subtools');
    const list=document.getElementById('dccClientList');
    if(!tools || !list) return;

    addCss();

    if(!tools.querySelector('#dccV11Sort')){
      tools.innerHTML=`<div class="dcc-v11-left"><button id="dccV11All" type="button" class="dcc-v11-all">Todos</button><button id="dccV11Pending" type="button" class="dcc-v11-pending"><span>Pendientes por revisar</span><span>›</span></button></div><button id="dccV11Sort" type="button" class="dcc-v11-sort"><small>ORDEN</small><strong id="dccV11SortState">A—Z</strong></button>`;

      const all=document.getElementById('dccV11All');
      const pending=document.getElementById('dccV11Pending');
      const sort=document.getElementById('dccV11Sort');

      all.onclick=function(){
        const input=document.getElementById('dccClientSearch');
        if(input){ input.value=''; input.dispatchEvent(new Event('input',{bubbles:true})); }
      };

      pending.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        goCheckins();
      };

      sort.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        sortMode=sortMode==='az'?'za':'az';
        sortCards();
      };

      pending.ontouchend=function(e){
        e.preventDefault();
        goCheckins();
      };

      sort.ontouchend=function(e){
        e.preventDefault();
        sortMode=sortMode==='az'?'za':'az';
        sortCards();
      };
    }

    // La primera vez que aparece Clientes dejamos el listado realmente A-Z.
    if(tools.dataset.dccV11Initial!=='1'){
      tools.dataset.dccV11Initial='1';
      sortMode='az';
      sortCards();
    }
  }

  function watch(){
    replaceControls();
  }

  load('./coach-premium-v8.js?v=11',function(){
    addCss();
    setTimeout(watch,0);
    setTimeout(watch,80);
    setTimeout(watch,250);
    setInterval(watch,350);
  });
})();
