/* DCC — navegación inferior premium unificada + acabado visual global entrenador */
(function(){
  function install(){
    if(document.getElementById('dcc-nav-premium-global-css')) return;

    const s=document.createElement('style');
    s.id='dcc-nav-premium-global-css';
    s.textContent=`
      /* =========================================================
         TEMA PREMIUM GLOBAL — PANEL DE ENTRENADOR
         Se instala una sola vez para evitar saltos visuales.
      ========================================================= */
      html body #coach,
      html body #coach #coach-main{
        background:
          radial-gradient(ellipse at 88% 3%,rgba(219,167,59,.12),transparent 24%),
          radial-gradient(ellipse at 8% 86%,rgba(217,170,74,.055),transparent 30%),
          linear-gradient(145deg,#080b0e 0%,#050709 48%,#020405 100%)!important;
        color:#f6f3ed!important;
      }

      html body #coach #coach-main .dcc-fcl-card,
      html body #coach #coach-main .dcc-ci-card,
      html body #coach #coach-main .dcc-msg-card,
      html body #coach #coach-main .dcc-ca-card,
      html body #coach #coach-main .dcc-p5-section,
      html body #coach #coach-main .dcc-p5-metric,
      html body #coach #coach-main .dcc-ca-metric,
      html body #coach #coach-main .card{
        border:1px solid rgba(224,173,76,.72)!important;
        background:
          radial-gradient(circle at 92% 8%,rgba(240,201,107,.105),transparent 30%),
          radial-gradient(circle at 8% 92%,rgba(217,170,74,.035),transparent 28%),
          linear-gradient(145deg,#11171c 0%,#0a0f13 58%,#070a0d 100%)!important;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.035),
          0 12px 30px rgba(0,0,0,.22)!important;
      }

      html body #coach #coach-main .dcc-fcl-card{
        border-color:rgba(240,201,107,.82)!important;
        background:
          radial-gradient(circle at 88% 15%,rgba(240,201,107,.12),transparent 31%),
          linear-gradient(135deg,#10161a 0%,#090d10 62%,#171107 100%)!important;
      }

      html body #coach #coach-main .dcc-ci-card,
      html body #coach #coach-main .dcc-msg-card{
        border-color:rgba(224,173,76,.66)!important;
        background:
          radial-gradient(circle at 92% 12%,rgba(240,201,107,.11),transparent 31%),
          linear-gradient(140deg,#10161b 0%,#090d10 60%,#130f08 100%)!important;
      }

      html body #coach #coach-main .dcc-fcl-search,
      html body #coach #coach-main .dcc-fcl-tabs,
      html body #coach #coach-main .dcc-fcl-sort,
      html body #coach #coach-main .dcc-ci-tabs,
      html body #coach #coach-main .dcc-msg-search,
      html body #coach #coach-main .dcc-ca-tabs,
      html body #coach #coach-main .dcc-diet-switch,
      html body #coach #coach-main .dcc-chat-composer{
        border:1px solid rgba(217,170,74,.32)!important;
        background:
          radial-gradient(circle at 90% 0%,rgba(217,170,74,.055),transparent 34%),
          linear-gradient(145deg,#0e1418,#080c0f)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.02)!important;
      }

      html body #coach #coach-main .dcc-ca-activity-item,
      html body #coach #coach-main .dcc-diet-meal,
      html body #coach #coach-main .dcc-diet-food,
      html body #coach #coach-main .dcc-tr-day,
      html body #coach #coach-main .dcc-tr-ex,
      html body #coach #coach-main .dcc-tr-history,
      html body #coach #coach-main .dcc-p5-card,
      html body #coach #coach-main .dcc-ci-review-row,
      html body #coach #coach-main .dcc-chat-bubble,
      html body #coach #coach-main .exercise,
      html body #coach #coach-main .food,
      html body #coach #coach-main .metric,
      html body #coach #coach-main .item{
        border-color:rgba(217,170,74,.30)!important;
        background:
          radial-gradient(circle at 90% 5%,rgba(217,170,74,.05),transparent 34%),
          linear-gradient(145deg,#0e1418,#080c0f)!important;
      }

      html body #coach #coach-main .dcc-fd-hero,
      html body #coach #coach-main .dcc-fd-stats,
      html body #coach #coach-main .dcc-fd-card,
      html body #coach #coach-main .dcc-fd-banner{
        border-color:rgba(224,173,76,.70)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 12px 30px rgba(0,0,0,.22)!important;
      }

      html body .dcc-ci-review{
        border-color:rgba(240,201,107,.94)!important;
        background:
          radial-gradient(circle at 94% 0%,rgba(240,201,107,.15),transparent 31%),
          linear-gradient(150deg,#151b20,#080c0f 70%)!important;
      }

      html body #coach #coach-main .dcc-chat-row.mine .dcc-chat-bubble{
        border-color:rgba(240,201,107,.76)!important;
        background:
          radial-gradient(circle at 100% 0%,rgba(240,201,107,.16),transparent 42%),
          linear-gradient(145deg,#211a0f,#100e0a)!important;
      }

      html body #coach #coach-main .ghost,
      html body #coach #coach-main .empty,
      html body #coach #coach-main .dcc-fcl-empty,
      html body #coach #coach-main .dcc-ci-empty,
      html body #coach #coach-main .dcc-msg-empty,
      html body #coach #coach-main .dcc-chat-none{
        border-color:rgba(217,170,74,.30)!important;
        background:linear-gradient(145deg,#0e1418,#080c0f)!important;
        color:#949ca7!important;
      }

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
})();
