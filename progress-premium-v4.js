/* DCC — Progreso premium v5 visualmente estable */
(function(){
  const G='#f2c85f';
  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const fmt=(v,d=1)=>v==null?'—':Number(v).toFixed(d).replace('.',',');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const ICONS={
    weight:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8.5V6a4 4 0 0 1 8 0v2.5"/><path d="M7 8.5h10l2.3 11.5H4.7L7 8.5Z"/></svg>`,
    fat:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/><path d="M18 5 6 19"/></svg>`,
    force:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="14" width="3" height="6" rx=".8"/><rect x="10.5" y="9.5" width="3" height="10.5" rx=".8"/><rect x="17" y="5" width="3" height="15" rx=".8"/></svg>`
  };

  function css(){
    if(document.getElementById('dcc-progress-v5-css'))return;
    const s=document.createElement('style');s.id='dcc-progress-v5-css';s.textContent=`
      #coach-main.dcc-ca .dcc-ca-metrics{display:none!important}
      #coach-main.dcc-ca.dcc-progress-active .dcc-ca-metrics{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px!important}
      #coach-main.dcc-ca.dcc-progress-active .dcc-ca-metric{position:relative!important;min-height:132px!important;padding:15px 13px 11px 58px!important;overflow:hidden!important;border:1px solid #2b343d!important;border-radius:20px!important;background:radial-gradient(circle at 84% 8%,rgba(242,200,95,.075),transparent 34%),linear-gradient(145deg,#11171d,#080c0f)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important}
      #coach-main.dcc-ca.dcc-progress-active .dcc-ca-metric::before{display:none!important;content:none!important}
      .dcc-p5-metric-icon{position:absolute;left:12px;top:13px;width:35px;height:35px;display:grid;place-items:center;border-radius:11px;border:1px solid rgba(242,200,95,.34);background:linear-gradient(145deg,rgba(242,200,95,.17),rgba(242,200,95,.07));box-shadow:inset 0 0 18px rgba(242,200,95,.04)}
      .dcc-p5-metric-icon svg{width:20px;height:20px;fill:none;stroke:${G};stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;display:block}
      #coach-main.dcc-ca.dcc-progress-active .dcc-ca-metric small{display:block!important;color:#9ca5af!important;font-size:10px!important;letter-spacing:.1px!important}
      #coach-main.dcc-ca.dcc-progress-active .dcc-ca-metric b{display:block!important;margin-top:4px!important;color:#f7f5f0!important;font-size:20px!important;line-height:1.05!important;letter-spacing:-.45px!important}
      #coach-main.dcc-ca.dcc-progress-active .dcc-ca-trend{display:block!important;min-height:24px!important;margin-top:7px!important;color:#9aa4af!important;font-size:9px!important;line-height:1.35!important}
      #coach-main.dcc-ca.dcc-progress-active .dcc-ca-trend.good{color:#55d9a0!important}
      #coach-main.dcc-ca.dcc-progress-active .dcc-ca-trend.bad{color:#ff656d!important}
      .dcc-p5-spark{height:29px;margin:4px -2px -2px -44px;opacity:.96}.dcc-p5-spark svg{width:100%;height:100%;display:block}

      .dcc-p4-section{margin-top:12px;padding:15px;border:1px solid rgba(224,173,76,.48);border-radius:20px;background:radial-gradient(circle at 100% 0%,rgba(224,173,76,.055),transparent 34%),linear-gradient(145deg,#10161b,#080c0f);box-shadow:inset 0 1px 0 rgba(255,255,255,.025);overflow-anchor:none}
      .dcc-p4-head,.dcc-p4-forcehead{display:flex;justify-content:space-between;align-items:center;gap:10px}.dcc-p4-head h2,.dcc-p4-forcehead h2{margin:0;color:#f7f5f0;font-size:20px;letter-spacing:-.55px}.dcc-p4-head p,.dcc-p4-forcehead p{margin:4px 0 0;color:#8e98a3;font-size:10px}
      .dcc-p4-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;width:min(100%,360px)}.dcc-p4-tabs button,.dcc-p4-all{min-height:38px;border:1px solid #323b44;border-radius:999px;background:#0a0f13!important;color:#aab2bc!important;padding:8px 12px;font-size:10px;font-weight:850;box-shadow:none}.dcc-p4-tabs button.active{border-color:#f0c661!important;background:linear-gradient(135deg,#f4d16f,#dda940)!important;color:#151006!important;box-shadow:0 5px 18px rgba(224,173,76,.16)}.dcc-p4-all{width:auto;min-height:auto;border-color:#b8872c!important;color:${G}!important;padding:9px 13px}
      .dcc-p4-chart-slot{height:175px;margin-top:10px;overflow:hidden}.dcc-p4-chart{height:175px;margin:0}.dcc-p4-chart svg,.dcc-p4-mini svg{width:100%;height:100%;display:block}.dcc-p4-empty{height:175px;min-height:175px;display:grid;place-items:center;color:#818b96;font-size:11px;text-align:center;padding:18px}
      .dcc-p4-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:11px}.dcc-p4-card{padding:9px;border:1px solid #29333b;border-radius:14px;background:linear-gradient(145deg,#0d1317,#090d10)}.dcc-p4-card.more{display:none}.dcc-p4-grid.all .dcc-p4-card.more{display:block}.dcc-p4-top{display:flex;gap:8px;align-items:center}.dcc-p4-card img{width:44px;height:44px;object-fit:contain;border-radius:9px;background:#efefec}.dcc-p4-card b{font-size:10px;line-height:1.2}.dcc-p4-change{display:block;margin-top:7px;font-size:12px;font-weight:900;color:#52e39a}.dcc-p4-change.down{color:#ff5a62}.dcc-p4-detail{display:block;margin-top:5px;color:#c0c7cf;font-size:9px;line-height:1.45}.dcc-p4-mini{height:22px;margin-top:7px}.dcc-p4-note{margin-top:8px;color:#76818c;font-size:8px}
      @media(max-width:650px){
        #coach-main.dcc-ca.dcc-progress-active .dcc-ca-metrics{gap:7px!important}
        #coach-main.dcc-ca.dcc-progress-active .dcc-ca-metric{min-height:126px!important;padding:12px 9px 9px 10px!important}
        .dcc-p5-metric-icon{position:static;width:29px;height:29px;margin-bottom:7px;border-radius:9px}.dcc-p5-metric-icon svg{width:17px;height:17px}
        #coach-main.dcc-ca.dcc-progress-active .dcc-ca-metric b{font-size:16px!important}
        #coach-main.dcc-ca.dcc-progress-active .dcc-ca-trend{font-size:8px!important;min-height:22px!important}
        .dcc-p5-spark{height:24px;margin:3px 0 -1px}
        .dcc-p4-section{padding:13px}.dcc-p4-head{align-items:flex-start;flex-direction:column}.dcc-p4-tabs{width:100%}.dcc-p4-tabs button{min-height:40px}.dcc-p4-chart-slot,.dcc-p4-chart,.dcc-p4-empty{height:155px;min-height:155px}.dcc-p4-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.dcc-p4-forcehead{align-items:flex-start}
      }
    `;document.head.appendChild(s)
  }

  function client(id){return(getData().clients||[]).find(x=>String(x.id)===String(id))}
  function weights(id,cl){const d=getData(),a=Array.isArray(d.weights?.[id])?d.weights[id]:[];let out=a.map((x,i)=>({v:num(typeof x==='object'?(x.weight??x.value??x.peso):x),i,date:typeof x==='object'?(x.date??x.created_at??x.fecha):null})).filter(x=>x.v!=null);if(!out.length){const v=num(cl?.initial??cl?.weight);if(v!=null)out=[{v,i:0,date:null}]}return out}
  function fats(id,cl){const d=getData(),out=[],seen=new Set(),push=(v,date)=>{v=num(v);if(v==null||v<2||v>70)return;const k=(date||'')+'|'+v;if(seen.has(k))return;seen.add(k);out.push({v,date:date||null})};['bodyFat','body_fat','fat','fatPct','fat_pct','grasa','porcentajeGrasa'].forEach(k=>push(cl?.[k],cl?.updated_at));const walk=(o,n=0)=>{if(!o||n>5)return;if(Array.isArray(o)){o.forEach(x=>walk(x,n+1));return}if(typeof o!=='object')return;const cid=o.client_id??o.clientId??o.client,ok=cid==null||String(cid)===String(id),date=o.date??o.created_at??o.createdAt??o.fecha;for(const[k,v]of Object.entries(o)){if(ok&&/fat|grasa/i.test(k)&&!/free/i.test(k))push(v,date);if(v&&typeof v==='object')walk(v,n+1)}};['checkins','checkIns','checkinHistory','progress','measurements'].forEach(k=>walk(d[k]));return out}
  function lib(ex){const L=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[],id=String(ex?.id??ex?.exerciseId??ex?.exercise_id??''),n=String(ex?.name??ex?.nombre??ex?.exerciseName??ex?.exercise??'').toLowerCase();return L.find(x=>id&&String(x.id)===id)||L.find(x=>String(x.name||'').toLowerCase()===n)}
  function exName(ex){return ex?.name??ex?.nombre??ex?.exerciseName??ex?.exercise??lib(ex)?.name??'Ejercicio'}
  function exKey(ex){return String(ex?.id??ex?.exerciseId??ex?.exercise_id??exName(ex)).toLowerCase()}
  function pairs(ex){let a=ex?.sets??ex?.series??ex?.completedSets??ex?.setData;if(!Array.isArray(a))a=[];let p=a.map(s=>({w:num(s?.weight??s?.kg??s?.peso??s?.load),r:num(s?.reps??s?.repetitions??s?.repeticiones)})).filter(x=>x.w!=null&&x.r!=null&&x.r>0);if(!p.length){const w=num(ex?.weight??ex?.kg??ex?.peso??ex?.load),r=num(ex?.reps??ex?.repetitions??ex?.repeticiones);if(w!=null&&r!=null&&r>0)p=[{w,r}]}return p}
  function collect(o,a=[],n=0){if(!o||n>6)return a;if(Array.isArray(o)){o.forEach(x=>collect(x,a,n+1));return a}if(typeof o!=='object')return a;if(pairs(o).length&&(o.name||o.nombre||o.exercise||o.exerciseName||o.exerciseId||o.exercise_id))a.push(o);for(const[k,v]of Object.entries(o))if(v&&typeof v==='object'&&!['client','user'].includes(k))collect(v,a,n+1);return a}
  function force(id){const d=getData(),sessions=Array.isArray(d.workoutHistory?.[id])?d.workoutHistory[id]:[],map=new Map();sessions.forEach((s,si)=>{const seen=new Set();collect(s).forEach(ex=>{const k=exKey(ex);if(seen.has(k))return;seen.add(k);const ps=pairs(ex);if(!ps.length)return;const best=ps.reduce((a,x)=>{const e=x.w*(1+x.r/30);return e>a.e?{...x,e}:a},{e:-1});if(!map.has(k))map.set(k,{name:exName(ex),image:lib(ex)?.image||'',points:[]});map.get(k).points.push({...best,si})})});return[...map.values()].map(x=>{x.points.sort((a,b)=>a.si-b.si);x.first=x.points[0];x.last=x.points.at(-1);x.change=x.points.length>1&&x.first.e>0?(x.last.e/x.first.e-1)*100:null;return x}).sort((a,b)=>Math.abs(b.change||0)-Math.abs(a.change||0))}
  function globalForce(fd){const a=fd.map(x=>x.change).filter(Number.isFinite).sort((a,b)=>a-b);if(!a.length)return null;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2}
  function path(vals,w=280,h=70,p=5){if(vals.length<2)return'';const lo=Math.min(...vals),hi=Math.max(...vals),sp=hi-lo||1;return vals.map((v,i)=>`${i?'L':'M'}${p+i*(w-2*p)/(vals.length-1)},${h-p-(v-lo)*(h-2*p)/sp}`).join(' ')}
  function chart(points,label){const vals=points.map(x=>x.v);if(vals.length<2)return`<div class="dcc-p4-empty">Todavía no hay suficientes registros de ${label.toLowerCase()} para dibujar una evolución.</div>`;const d=path(vals,800,180,12);return`<div class="dcc-p4-chart"><svg viewBox="0 0 800 180" preserveAspectRatio="none"><line x1="12" y1="168" x2="788" y2="168" stroke="#273039"/><path d="${d}" fill="none" stroke="${G}" stroke-width="3" vector-effect="non-scaling-stroke"/>${vals.map((v,i)=>{const lo=Math.min(...vals),hi=Math.max(...vals),sp=hi-lo||1,x=12+i*776/(vals.length-1),y=168-(v-lo)*156/sp;return`<circle cx="${x}" cy="${y}" r="4" fill="${G}"/><text x="${x}" y="${Math.max(12,y-9)}" text-anchor="middle" fill="#c9d0d6" font-size="10">${fmt(v)}</text>`}).join('')}</svg></div>`}
  function card(x,i){const ch=x.change,down=ch!=null&&ch<0,vals=x.points.map(p=>p.e);return`<article class="dcc-p4-card ${i>=4?'more':''}"><div class="dcc-p4-top">${x.image?`<img src="${esc(x.image)}" alt="">`:''}<b>${esc(x.name)}</b></div><span class="dcc-p4-change ${down?'down':''}">${ch==null?'Sin datos suficientes':`${ch>=0?'↗ +':'↘ '}${fmt(ch)} %`}</span><span class="dcc-p4-detail">${fmt(x.first?.w)} kg × ${fmt(x.first?.r,0)}<br>→ ${fmt(x.last?.w)} kg × ${fmt(x.last?.r,0)}</span>${vals.length>1?`<div class="dcc-p4-mini"><svg viewBox="0 0 280 70" preserveAspectRatio="none"><path d="${path(vals)}" fill="none" stroke="${down?'#ff5a62':G}" stroke-width="3"/></svg></div>`:''}</article>`}
  function spark(vals){if(vals.length<2)return'';const d=path(vals);return`<div class="dcc-p5-spark"><svg viewBox="0 0 280 70" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="${G}" stroke-width="2.5" vector-effect="non-scaling-stroke"/><path d="${d} L275,68 L5,68 Z" fill="rgba(242,200,95,.08)"/></svg></div>`}
  function updateChart(host,state){const metric=state.metric,pts=metric==='fat'?state.fp:metric==='force'?state.fd.filter(x=>x.change!=null).map(x=>({v:x.change})):state.wp,label=metric==='fat'?'% Grasa':metric==='force'?'Fuerza':'Peso';host.querySelector('.dcc-p4-chart-slot').innerHTML=chart(pts,label);host.querySelectorAll('.dcc-p4-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.m===metric))}

  function renderProgress(id){
    css();const cl=client(id);if(!cl)return;const main=document.getElementById('coach-main');const root=main?.querySelector('.dcc-ca-wrap');if(!root)return;main.classList.add('dcc-progress-active');
    const host=root.querySelector('.dcc-ca-tabs')?.nextElementSibling;if(!host)return;const wp=weights(id,cl),fp=fats(id,cl),fd=force(id),gf=globalForce(fd),wi=wp[0]?.v,wc=wp.at(-1)?.v,fi=fp[0]?.v,fc=fp.at(-1)?.v;const delta=(cur,ini,u)=>cur==null||ini==null?'Sin histórico todavía':Math.abs(cur-ini)<.05?'Sin cambios desde el inicio':`${cur>ini?'↑':'↓'} ${fmt(Math.abs(cur-ini))} ${u} desde el inicio`;
    const metrics=root.querySelector('.dcc-ca-metrics');
    if(metrics)metrics.innerHTML=`<div class="dcc-ca-metric"><span class="dcc-p5-metric-icon">${ICONS.weight}</span><small>Peso actual</small><b>${wc!=null?fmt(wc)+' kg':'—'}</b><span class="dcc-ca-trend ${wc!=null&&wi!=null&&wc<wi?'good':''}">${delta(wc,wi,'kg')}</span>${spark(wp.map(x=>x.v))}</div><div class="dcc-ca-metric"><span class="dcc-p5-metric-icon">${ICONS.fat}</span><small>% de grasa</small><b>${fc!=null?fmt(fc)+' %':'—'}</b><span class="dcc-ca-trend ${fc!=null&&fi!=null&&fc<fi?'good':''}">${delta(fc,fi,'%')}</span>${spark(fp.map(x=>x.v))}</div><div class="dcc-ca-metric"><span class="dcc-p5-metric-icon">${ICONS.force}</span><small>Fuerza global</small><b>${gf==null?'—':`${gf>=0?'+':''}${fmt(gf)} %`}</b><span class="dcc-ca-trend ${gf!=null&&gf>=0?'good':'bad'}">${gf==null?'Sin datos suficientes':'Evolución desde el inicio'}</span>${spark(fd.filter(x=>x.change!=null).map(x=>x.change))}</div>`;
    const state={wp,fp,fd,metric:window.__dccP4Metric||'weight'};
    host.innerHTML=`<section class="dcc-p4-section"><div class="dcc-p4-head"><div><h2>Evolución</h2><p>Visualiza el progreso a lo largo del tiempo.</p></div><div class="dcc-p4-tabs"><button data-m="weight">Peso</button><button data-m="fat">% Grasa</button><button data-m="force">Fuerza</button></div></div><div class="dcc-p4-chart-slot"></div></section><section class="dcc-p4-section"><div class="dcc-p4-forcehead"><div><h2>Progreso de fuerza</h2><p>Evolución en sus ejercicios registrados.</p></div>${fd.length>4?'<button class="dcc-p4-all">Ver todos ›</button>':''}</div>${fd.length?`<div class="dcc-p4-grid">${fd.map(card).join('')}</div><div class="dcc-p4-note">La evolución combina carga y repeticiones mediante fuerza estimada. Solo se comparan ejercicios con registros disponibles.</div>`:'<div class="dcc-p4-empty">Cuando el cliente registre cargas y repeticiones, aquí aparecerá su progreso de fuerza.</div>'}</section>`;
    updateChart(host,state);
    host.querySelectorAll('.dcc-p4-tabs button').forEach(b=>b.onclick=()=>{state.metric=b.dataset.m;window.__dccP4Metric=state.metric;updateChart(host,state)});
    const all=host.querySelector('.dcc-p4-all');if(all)all.onclick=()=>{const g=host.querySelector('.dcc-p4-grid');g.classList.toggle('all');all.textContent=g.classList.contains('all')?'Ver menos ‹':'Ver todos ›'};
  }

  function install(){
    const current=window.dccClientAdmin;
    if(typeof current!=='function')return setTimeout(install,60);
    if(current.__dccProgressV5)return;
    const wrapped=function(id,tab){
      const main=document.getElementById('coach-main');if(main)main.classList.remove('dcc-progress-active');
      current(id,tab);
      if(tab==='progress')renderProgress(id);
    };
    wrapped.__dccProgressV5=true;wrapped.__base=current;window.dccClientAdmin=wrapped;
  }
  css();install();
})();