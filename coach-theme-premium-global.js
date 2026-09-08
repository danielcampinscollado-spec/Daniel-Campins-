/* DCC — sistema visual premium global del panel de entrenador */
(function(){
  const ID='dcc-coach-theme-premium-global';

  function install(){
    let s=document.getElementById(ID);
    if(s) s.remove();
    s=document.createElement('style');
    s.id=ID;
    s.textContent=`
      html body #coach{
        --dcc-gold:#d9aa4a;
        --dcc-gold2:#f0c96b;
        --dcc-border:rgba(240,201,107,.66);
        --dcc-border-soft:rgba(217,170,74,.30);
        --dcc-bg:
          radial-gradient(ellipse at 88% 3%,rgba(217,170,74,.11),transparent 25%),
          radial-gradient(ellipse at 7% 84%,rgba(217,170,74,.045),transparent 30%),
          linear-gradient(150deg,#080b0e 0%,#050709 50%,#020405 100%);
        --dcc-card:
          radial-gradient(circle at 92% 5%,rgba(240,201,107,.11),transparent 32%),
          linear-gradient(145deg,#12181d 0%,#0a0e11 60%,#070a0c 100%);
        --dcc-inner:
          radial-gradient(circle at 92% 5%,rgba(240,201,107,.055),transparent 34%),
          linear-gradient(145deg,#0f1519 0%,#090d10 72%);
        background:var(--dcc-bg)!important;
      }

      html body #coach #coach-main{
        min-height:100dvh!important;
        color:#f6f3ed!important;
        background:var(--dcc-bg)!important;
      }

      html body #coach #coach-main.dcc-final-dashboard,
      html body #coach #coach-main.dcc-final-clients,
      html body #coach #coach-main.dcc-premium-checkins,
      html body #coach #coach-main.dcc-premium-messages,
      html body #coach #coach-main.dcc-premium-chat,
      html body #coach #coach-main.dcc-ca{
        background:var(--dcc-bg)!important;
      }

      html body #coach #coach-main .dcc-fd-hero,
      html body #coach #coach-main .dcc-fd-stats,
      html body #coach #coach-main .dcc-fd-card,
      html body #coach #coach-main .dcc-fd-banner,
      html body #coach #coach-main .dcc-fcl-card,
      html body #coach #coach-main .dcc-ci-card,
      html body #coach #coach-main .dcc-msg-card,
      html body #coach #coach-main.dcc-ca .dcc-ca-metric,
      html body #coach #coach-main.dcc-ca .dcc-ca-card,
      html body #coach #coach-main.dcc-ca .dcc-p5-metric,
      html body #coach #coach-main.dcc-ca .dcc-p5-section,
      html body #coach #coach-main .card,
      html body #coach #coach-main .metrics{
        border:1px solid var(--dcc-border)!important;
        background:var(--dcc-card)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 12px 30px rgba(0,0,0,.22),0 0 0 1px rgba(217,170,74,.025)!important;
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
      html body #coach #coach-main .item,
      html body #coach #coach-main .client-row{
        border:1px solid var(--dcc-border-soft)!important;
        background:var(--dcc-inner)!important;
        color:#f4f1ec!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.02)!important;
      }

      html body #coach #coach-main .dcc-tr-day.open{
        border-color:rgba(240,201,107,.82)!important;
        background:var(--dcc-card)!important;
        box-shadow:0 0 0 1px rgba(217,170,74,.08),0 12px 28px rgba(0,0,0,.20)!important;
      }

      html body #coach #coach-main .dcc-fcl-search,
      html body #coach #coach-main .dcc-fcl-tabs,
      html body #coach #coach-main .dcc-fcl-sort,
      html body #coach #coach-main .dcc-ci-tabs,
      html body #coach #coach-main .dcc-msg-search,
      html body #coach #coach-main .dcc-ca-tabs,
      html body #coach #coach-main .dcc-diet-switch,
      html body #coach #coach-main .dcc-chat-composer,
      html body #coach #coach-main input,
      html body #coach #coach-main textarea,
      html body #coach #coach-main select{
        border-color:rgba(217,170,74,.32)!important;
        background:radial-gradient(circle at 88% 0,rgba(217,170,74,.045),transparent 35%),linear-gradient(145deg,#0e1418,#080c0f)!important;
        color:#f4f1ec!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.02)!important;
      }

      /* Los buscadores premium ya tienen su propio contenedor. El input interior no puede crear un segundo recuadro. */
      html body #coach #coach-main .dcc-fcl-search{
        height:48px!important;
        min-height:48px!important;
        padding:0 14px!important;
        border:1px solid rgba(217,170,74,.40)!important;
        border-radius:15px!important;
        display:flex!important;
        align-items:center!important;
      }
      html body #coach #coach-main .dcc-fcl-search input,
      html body #coach #coach-main .dcc-msg-search input{
        width:100%!important;
        height:100%!important;
        min-height:0!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:0!important;
        outline:0!important;
        background:transparent!important;
        box-shadow:none!important;
        color:#f4f1ed!important;
        font-size:12px!important;
      }
      html body #coach #coach-main .dcc-fcl-search input::placeholder,
      html body #coach #coach-main .dcc-msg-search input::placeholder{color:#77808a!important;opacity:1!important}

      html body #coach #coach-main .ghost,
      html body #coach #coach-main .dcc-ca-back,
      html body #coach #coach-main .dcc-tr-edit,
      html body #coach #coach-main .dcc-chat-back{
        border-color:rgba(217,170,74,.48)!important;
        background:linear-gradient(145deg,#14191d,#090c0f)!important;
        color:#ece7dc!important;
      }

      html body #coach #coach-main .btn,
      html body #coach #coach-main .dcc-fcl-new,
      html body #coach #coach-main .dcc-diet-add-food,
      html body #coach #coach-main .dcc-diet-add-meal,
      html body #coach #coach-main .dcc-tr-new,
      html body #coach #coach-main .dcc-tr-save,
      html body #coach #coach-main .dcc-ci-mark,
      html body #coach #coach-main .dcc-chat-send{
        border-color:#f0c96b!important;
        background:linear-gradient(135deg,#f3d16e,#d8a23a)!important;
        color:#0b0905!important;
        box-shadow:0 7px 20px rgba(217,170,74,.14)!important;
      }

      html body #coach .dcc-ci-review,
      html body .dcc-ci-review{
        border:1px solid rgba(240,201,107,.92)!important;
        background:radial-gradient(circle at 95% 0,rgba(240,201,107,.14),transparent 30%),radial-gradient(circle at 5% 35%,rgba(217,170,74,.05),transparent 30%),linear-gradient(150deg,#151b20,#080c0f 70%)!important;
        color:#f6f3ed!important;
        box-shadow:0 28px 80px rgba(0,0,0,.72),0 0 30px rgba(217,170,74,.10),inset 0 1px 0 rgba(255,255,255,.035)!important;
      }

      html body #coach #coach-main .dcc-chat-row.mine .dcc-chat-bubble{
        border-color:rgba(240,201,107,.72)!important;
        background:radial-gradient(circle at 100% 0,rgba(240,201,107,.15),transparent 42%),linear-gradient(145deg,#211a0f,#100e0a)!important;
      }
      html body #coach #coach-main .dcc-chat-row:not(.mine) .dcc-chat-bubble{border-color:rgba(217,170,74,.27)!important}

      html body #coach #coach-main .dcc-fcl-empty,
      html body #coach #coach-main .dcc-ci-empty,
      html body #coach #coach-main .dcc-msg-empty,
      html body #coach #coach-main .dcc-chat-none,
      html body #coach #coach-main .empty{
        border:1px solid rgba(217,170,74,.30)!important;
        background:var(--dcc-inner)!important;
        color:#939ca7!important;
      }

      html body #coach #coach-main .dcc-fcl-card,
      html body #coach #coach-main .dcc-ci-card,
      html body #coach #coach-main .dcc-msg-card{border-radius:18px!important}
      html body #coach #coach-main.dcc-ca .dcc-ca-card,
      html body #coach #coach-main.dcc-ca .dcc-p5-section{border-radius:20px!important}
    `;
    document.head.appendChild(s);
  }

  install();
  [250,700,1500,2600].forEach(ms=>setTimeout(install,ms));
})();
