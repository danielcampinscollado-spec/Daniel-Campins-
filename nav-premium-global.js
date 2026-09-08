/* DCC — navegación inferior premium unificada: entrenador + cliente */
(function(){
  function install(){
    const old=document.getElementById('dcc-nav-premium-global-css');
    if(old)old.remove();

    const s=document.createElement('style');
    s.id='dcc-nav-premium-global-css';
    s.textContent=`
      @media (max-width:700px){
        html body #coach .side,
        html body #client .side{
          position:fixed!important;
          left:14px!important;
          right:14px!important;
          bottom:10px!important;
          top:auto!important;
          width:auto!important;
          height:60px!important;
          padding:4px!important;
          overflow:visible!important;
          border:1px solid #2b343d!important;
          border-radius:21px!important;
          background:
            radial-gradient(circle at 20% 0,rgba(217,170,74,.045),transparent 32%),
            linear-gradient(145deg,rgba(17,22,28,.985),rgba(8,12,16,.985))!important;
          box-shadow:0 14px 38px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.03)!important;
          backdrop-filter:blur(16px)!important;
          -webkit-backdrop-filter:blur(16px)!important;
          z-index:10000!important;
        }

        html body #coach .side>h2,
        html body #client .side>h2,
        html body #coach .side>.out,
        html body #client .side>.out{
          display:none!important;
        }

        html body #coach #coach-nav,
        html body #client #client-nav{
          position:static!important;
          inset:auto!important;
          width:100%!important;
          height:100%!important;
          margin:0!important;
          padding:0!important;
          border:0!important;
          background:transparent!important;
          box-shadow:none!important;
          gap:3px!important;
          align-items:stretch!important;
        }

        html body #coach #coach-nav{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important}
        html body #client #client-nav{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important}

        html body #coach #coach-nav button,
        html body #client #client-nav button{
          position:relative!important;
          display:flex!important;
          flex-direction:column!important;
          align-items:center!important;
          justify-content:center!important;
          min-width:0!important;
          width:100%!important;
          height:100%!important;
          min-height:0!important;
          margin:0!important;
          padding:4px 1px!important;
          overflow:visible!important;
          border:1px solid transparent!important;
          border-radius:15px!important;
          background:transparent!important;
          color:#838d98!important;
          box-shadow:none!important;
          transform:none!important;
          transition:color .18s ease,border-color .18s ease,background .18s ease,box-shadow .18s ease!important;
        }

        html body #coach #coach-nav button::before,
        html body #client #client-nav button::before{
          display:none!important;
          content:none!important;
        }

        html body #coach #coach-nav button svg,
        html body #client #client-nav button svg{
          width:21px!important;
          height:21px!important;
          min-width:21px!important;
          min-height:21px!important;
          margin:0 auto!important;
          color:currentColor!important;
          stroke:currentColor!important;
          filter:none!important;
          transition:filter .18s ease!important;
        }

        html body #coach #coach-nav button span,
        html body #client #client-nav button span{
          display:block!important;
          width:100%!important;
          margin-top:2px!important;
          color:currentColor!important;
          font-size:7px!important;
          line-height:1!important;
          letter-spacing:-.12px!important;
          white-space:nowrap!important;
          overflow:hidden!important;
          text-overflow:ellipsis!important;
        }

        /* Estado activo: recuadro físico y claramente visible. */
        html body #coach #coach-nav button.active,
        html body #client #client-nav button.active{
          border-color:#e4b54d!important;
          outline:1px solid rgba(240,201,107,.40)!important;
          outline-offset:-2px!important;
          background:
            radial-gradient(circle at 50% 12%,rgba(240,201,107,.28),transparent 52%),
            linear-gradient(145deg,#2a210f 0%,#17130c 58%,#0d0f12 100%)!important;
          color:#f0c96b!important;
          box-shadow:
            inset 0 0 0 1px rgba(255,218,124,.10),
            inset 0 1px 0 rgba(255,255,255,.06),
            0 0 20px rgba(217,170,74,.24),
            0 6px 15px rgba(0,0,0,.30)!important;
        }

        html body #coach #coach-nav button.active::after,
        html body #client #client-nav button.active::after{
          content:''!important;
          display:block!important;
          position:absolute!important;
          inset:2px!important;
          border:1px solid rgba(240,201,107,.34)!important;
          border-radius:12px!important;
          pointer-events:none!important;
          box-shadow:inset 0 0 12px rgba(217,170,74,.08)!important;
        }

        html body #coach #coach-nav button.active svg,
        html body #client #client-nav button.active svg{
          color:#f0c96b!important;
          stroke:#f0c96b!important;
          filter:drop-shadow(0 0 6px rgba(240,201,107,.38))!important;
        }

        html body #coach #coach-nav button.active span,
        html body #client #client-nav button.active span{
          color:#f0c96b!important;
          font-weight:800!important;
        }

        html body #coach #coach-nav button:active,
        html body #client #client-nav button:active{
          transform:scale(.97)!important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  install();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',()=>setTimeout(install,80));
  /* Los módulos visuales se cargan async; reinsertamos este estilo al final. */
  setTimeout(install,500);
  setTimeout(install,1400);
  setTimeout(install,2600);
})();
