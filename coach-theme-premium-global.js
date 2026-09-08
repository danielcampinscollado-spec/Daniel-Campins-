/* DCC — tema premium global del panel de entrenador */
(function(){
  const ID='dcc-coach-theme-premium-global';

  function install(){
    let s=document.getElementById(ID);
    if(s) s.remove();
    s=document.createElement('style');
    s.id=ID;
    s.textContent=`
      /* =====================================================
         BASE GLOBAL — MISMO FONDO EN TODO EL PANEL ENTRENADOR
      ====================================================== */
      html body #coach{
        --dcc-gold:#d9aa4a;
        --dcc-gold2:#f0c96b;
        --dcc-border:rgba(217,170,74,.60);
        --dcc-border-soft:rgba(217,170,74,.28);
        --dcc-surface:radial-gradient(circle at 88% 7%,rgba(240,201,107,.095),transparent 31%),linear-gradient(145deg,#11171c 0%,#090d10 58%,#06090b 100%);
        --dcc-surface-inner:radial-gradient(circle at 92% 8%,rgba(240,201,107,.055),transparent 34%),linear-gradient(145deg,#0e1418 0%,#080c0f 72%);
        background:radial-gradient(ellipse at 88% 4%,rgba(218,164,58,.095),transparent 24%),radial-gradient(ellipse at 8% 88%,rgba(217,170,74,.04),transparent 28%),linear-gradient(145deg,#080b0e 0%,#050709 48%,#020405 100%)!important;
      }

      html body #coach #coach-main{
        min-height:100dvh!important;
        color:#f6f3ed!important;
        background:radial-gradient(ellipse at 88% 4%,rgba(218,164,58,.095),transparent 24%),radial-gradient(ellipse at 8% 88%,rgba(217,170,74,.04),transparent 28%),linear-gradient(145deg,#080b0e 0%,#050709 48%,#020405 100%)!important;
      }

      /* =====================================================
         TARJETAS PRINCIPALES — MISMO BORDE + DEGRADADO
      ====================================================== */
      html body #coach #coach-main .dcc-fcl-card,
      html body #coach #coach-main .dcc-ci-card,
      html body #coach #coach-main .dcc-msg-card,
      html body #coach #coach-main.dcc-ca .dcc-ca-metric,
      html body #coach #coach-main.dcc-ca .dcc-ca-card,
      html body #coach #coach-main.dcc-ca .dcc-p5-metric,
      html body #coach #coach-main.dcc-ca .dcc-p5-section,
      html body #coach #coach-main .card,
      html body #coach #coach-main .metrics{
        border-color:var(--dcc-border)!important;
        background:var(--dcc-surface)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.03),0 12px 30px rgba(0,0,0,.20)!important;
      }

      /* Mantener el acabado especial del Panel, pero con el mismo lenguaje visual */
      html body #coach #coach-main .dcc-fd-hero,
      html body #coach #coach-main .dcc-fd-stats,
      html body #coach #coach-main .dcc-fd-card,
      html body #coach #coach-main .dcc-fd-banner{
        border-color:var(--dcc-border)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.03),0 12px 30px rgba(0,0,0,.20)!important;
      }

      /* =====================================================
         SUPERFICIES INTERIORES — DORADO MÁS SUAVE
      ====================================================== */
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
        border-color:var(--dcc-border-soft)!important;
        background:var(--dcc-surface-inner)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.02)!important;
      }

      /* El ejercicio/día abierto conserva una lectura más marcada */
      html body #coach #coach-main .dcc-tr-day.open{
        border-color:rgba(240,201,107,.78)!important;
        box-shadow:0 0 0 1px rgba(217,170,74,.08),0 10px 28px rgba(0,0,0,.18)!important;
      }

      /* =====================================================
         CONTROLES / SELECTORES — MISMA FAMILIA, SIN SOBRECARGAR
      ====================================================== */
      html body #coach #coach-main .dcc-fcl-search,
      html body #coach #coach-main .dcc-fcl-tabs,
      html body #coach #coach-main .dcc-fcl-sort,
      html body #coach #coach-main .dcc-ci-tabs,
      html body #coach #coach-main .dcc-msg-search,
      html body #coach #coach-main .dcc-ca-tabs,
      html body #coach #coach-main .dcc-diet-switch,
      html body #coach #coach-main .dcc-chat-composer{
        border-color:rgba(217,170,74,.30)!important;
        background:radial-gradient(circle at 88% 0,rgba(217,170,74,.045),transparent 35%),linear-gradient(145deg,#0e1418,#080c0f)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.02)!important;
      }

      /* =====================================================
         CHECK-IN — LISTA Y REVISIÓN
      ====================================================== */
      html body #coach #coach-main .dcc-ci-review{
        border-color:rgba(240,201,107,.92)!important;
        background:radial-gradient(circle at 95% 0,rgba(240,201,107,.13),transparent 30%),radial-gradient(circle at 5% 35%,rgba(217,170,74,.05),transparent 30%),linear-gradient(150deg,#151b20,#080c0f 70%)!important;
        box-shadow:0 28px 80px rgba(0,0,0,.72),0 0 30px rgba(217,170,74,.10),inset 0 1px 0 rgba(255,255,255,.035)!important;
      }

      /* =====================================================
         MENSAJES — LISTA + CHAT
      ====================================================== */
      html body #coach #coach-main .dcc-chat-row.mine .dcc-chat-bubble{
        border-color:rgba(240,201,107,.72)!important;
        background:radial-gradient(circle at 100% 0,rgba(240,201,107,.15),transparent 42%),linear-gradient(145deg,#211a0f,#100e0a)!important;
      }
      html body #coach #coach-main .dcc-chat-row:not(.mine) .dcc-chat-bubble{
        border-color:rgba(217,170,74,.24)!important;
      }

      /* =====================================================
         BOTONES SECUNDARIOS ANTIGUOS — EVITAR BLANCOS/GRISES
      ====================================================== */
      html body #coach #coach-main .ghost{
        border-color:rgba(217,170,74,.40)!important;
        background:linear-gradient(145deg,#12171b,#090c0f)!important;
        color:#e8e4dc!important;
      }

      /* =====================================================
         VACÍOS / PLACEHOLDERS — TAMBIÉN EN SINTONÍA
      ====================================================== */
      html body #coach #coach-main .dcc-fcl-empty,
      html body #coach #coach-main .dcc-ci-empty,
      html body #coach #coach-main .dcc-msg-empty,
      html body #coach #coach-main .dcc-chat-none,
      html body #coach #coach-main .empty{
        border-color:rgba(217,170,74,.28)!important;
        background:var(--dcc-surface-inner)!important;
        color:#939ca7!important;
      }

      /* =====================================================
         SOMBRAS / RADIOS HOMOGÉNEOS EN PANTALLAS PREMIUM
      ====================================================== */
      html body #coach #coach-main .dcc-ci-card,
      html body #coach #coach-main .dcc-msg-card,
      html body #coach #coach-main .dcc-fcl-card{
        border-radius:18px!important;
      }

      html body #coach #coach-main.dcc-ca .dcc-ca-card,
      html body #coach #coach-main.dcc-ca .dcc-p5-section{
        border-radius:20px!important;
      }

      /* La barra inferior ya tiene su propio acabado premium: no se modifica aquí. */
    `;
    document.head.appendChild(s);
  }

  install();
  /* Los módulos se cargan async; reinsertamos la misma hoja al final sin observers ni rerenders. */
  setTimeout(install,500);
  setTimeout(install,1400);
})();
