/* DCC — Clientes Light Premium aislado v3 */
(function(){
'use strict';
const ID='dcc-coach-clients-light-fix-v3';
function inject(){
 document.getElementById(ID)?.remove();
 const s=document.createElement('style');s.id=ID;s.textContent=`
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients{background:radial-gradient(circle at 88% 0,rgba(214,163,61,.07),transparent 24%),linear-gradient(180deg,#fffaf2,#f6efe4 62%,#f2eadf)!important;color:#17191d!important;padding:18px 18px 116px!important}
#coach-main.dcc-premium-clients .dcc-cl{max-width:760px!important;margin:0 auto!important}
#coach-main.dcc-premium-clients .dcc-cl-head{margin:0 2px 20px!important;gap:16px!important;align-items:flex-start!important}
#coach-main.dcc-premium-clients .dcc-cl-head h1{margin:0!important;color:#17191d!important;font-size:30px!important;line-height:1!important;letter-spacing:-1px!important}
#coach-main.dcc-premium-clients .dcc-cl-head p{margin:8px 0 0!important;color:#747b86!important;font-size:13px!important;line-height:1.35!important;max-width:230px!important}
#coach-main.dcc-premium-clients .dcc-cl-new{min-height:46px!important;padding:0 17px!important;border-radius:16px!important;border:1px solid #dfa92f!important;background:linear-gradient(135deg,#f8dc82,#eab641)!important;color:#17120a!important;box-shadow:0 8px 20px rgba(176,119,18,.13),inset 0 1px 0 rgba(255,255,255,.7)!important;font-size:12px!important;font-weight:850!important}
#coach-main.dcc-premium-clients .dcc-u-search,#coach-main.dcc-premium-clients .dcc-cl-search{height:54px!important;min-height:54px!important;padding:0 18px!important;border:1px solid rgba(176,119,18,.25)!important;border-radius:18px!important;background:#fffefa!important;box-shadow:0 6px 18px rgba(75,55,26,.045)!important;color:#9a650b!important}
#coach-main.dcc-premium-clients .dcc-u-search>svg{color:#9a650b!important}
#coach-main.dcc-premium-clients .dcc-u-search>input,#coach-main.dcc-premium-clients #dccClientSearch{background:transparent!important;color:#1b1d21!important;-webkit-text-fill-color:#1b1d21!important;font-size:14px!important;font-weight:650!important}
#coach-main.dcc-premium-clients .dcc-u-search>input::placeholder,#coach-main.dcc-premium-clients #dccClientSearch::placeholder{color:#7d8490!important;-webkit-text-fill-color:#7d8490!important;opacity:1!important}
#coach-main.dcc-premium-clients .dcc-cl-subtools{margin:11px 0 15px!important;align-items:center!important}
#coach-main.dcc-premium-clients .dcc-cl-tabs{background:#fffefa!important;border:1px solid rgba(176,119,18,.22)!important;border-radius:999px!important;box-shadow:none!important;overflow:hidden!important}
#coach-main.dcc-premium-clients .dcc-cl-tab{min-height:39px!important;padding:0 17px!important;border:0!important;border-radius:999px!important;background:transparent!important;color:#7a818c!important;font-size:11px!important}
#coach-main.dcc-premium-clients .dcc-cl-tab.active{background:linear-gradient(135deg,#fae39a,#edc052)!important;color:#20180c!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.72)!important;font-weight:800!important}
#coach-main.dcc-premium-clients .dcc-cl-sort{min-height:40px!important;background:#fffefa!important;color:#25282d!important;border:1px solid rgba(176,119,18,.22)!important;border-radius:999px!important;box-shadow:none!important}
#coach-main.dcc-premium-clients .dcc-cl-list{gap:11px!important}
#coach-main.dcc-premium-clients .dcc-cl-card{min-height:108px!important;padding:15px 14px 15px 16px!important;background:linear-gradient(145deg,#fffefa,#fbf6ee)!important;border:1px solid rgba(190,132,28,.25)!important;border-radius:19px!important;color:#17191d!important;box-shadow:0 5px 16px rgba(70,52,27,.035),inset 0 1px 0 rgba(255,255,255,.95)!important}
#coach-main.dcc-premium-clients .dcc-cl-name{color:#17191d!important;font-size:17px!important;line-height:1.05!important;letter-spacing:-.3px!important}
#coach-main.dcc-premium-clients .dcc-cl-goal{margin-top:7px!important;color:#99650f!important;font-size:11.5px!important}
#coach-main.dcc-premium-clients .dcc-cl-weight{margin-top:5px!important;color:#747b86!important;font-size:11.5px!important}
#coach-main.dcc-premium-clients .dcc-cl-side{border-left:1px solid rgba(35,39,45,.24)!important;padding-left:13px!important;margin-left:7px!important}
#coach-main.dcc-premium-clients .dcc-cl-training,#coach-main.dcc-premium-clients .dcc-cl-progress-label{color:#69717d!important;font-size:10.5px!important;font-weight:650!important}
#coach-main.dcc-premium-clients .dcc-cl-training svg,#coach-main.dcc-premium-clients .dcc-cl-training i{color:#d4a13a!important}
#coach-main.dcc-premium-clients .dcc-cl-progress,#coach-main.dcc-premium-clients .dcc-cl-bar{height:6px!important;margin-top:10px!important;border-radius:999px!important;background:#e2dcd1!important;overflow:hidden!important}
#coach-main.dcc-premium-clients .dcc-cl-progress>span,#coach-main.dcc-premium-clients .dcc-cl-bar>span{border-radius:999px!important;background:linear-gradient(90deg,#d9aa4a,#f0c96b)!important}
#coach-main.dcc-premium-clients .dcc-cl-percent{margin-left:7px!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;color:#555b64!important;font-size:10.5px!important;line-height:1!important}
#coach-main.dcc-premium-clients .dcc-cl-manage{min-width:101px!important;min-height:49px!important;padding:0 10px!important;border-radius:15px!important;background:#fffaf1!important;color:#895907!important;border:1px solid rgba(176,119,18,.29)!important;box-shadow:none!important;font-size:10.5px!important;line-height:1.1!important;font-weight:850!important}
/* Barra inferior estable: mismo acabado desde el primer frame, sin aro blanco. */
html.dcc-theme-light-premium body #coach-nav{background:linear-gradient(145deg,#26231d 0%,#141411 58%,#211e17 100%)!important;background-color:#181713!important;border:1px solid rgba(224,171,62,.82)!important;outline:0!important;box-shadow:0 12px 28px rgba(45,35,18,.24),inset 0 1px 0 rgba(255,224,145,.11)!important}
html.dcc-theme-light-premium body #coach-nav::before,html.dcc-theme-light-premium body #coach-nav::after{border-color:transparent!important;outline:0!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach-nav button{background:transparent!important;border-color:transparent!important;outline:0!important;box-shadow:none!important;color:#d9aa4a!important}
html.dcc-theme-light-premium body #coach-nav button.active{background:linear-gradient(145deg,#ffe7a0,#e8b442 72%,#cf9329)!important;border:1px solid #f5d578!important;outline:0!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.72),0 4px 12px rgba(181,121,20,.22)!important;color:#1d1608!important}
html.dcc-theme-light-premium body #coach-nav button.active *{color:#1d1608!important}
@media(max-width:430px){#coach-main.dcc-premium-clients .dcc-cl-head h1{font-size:29px!important}#coach-main.dcc-premium-clients .dcc-cl-card{min-height:105px!important;padding:14px!important}#coach-main.dcc-premium-clients .dcc-cl-manage{min-width:98px!important}}
`;(document.head||document.documentElement).appendChild(s);
}
function refresh(){document.documentElement.classList.add('dcc-theme-light-premium');inject()}
refresh();document.addEventListener('DOMContentLoaded',refresh,{once:true});window.addEventListener('pageshow',refresh);window.addEventListener('load',refresh,{once:true});
})();
