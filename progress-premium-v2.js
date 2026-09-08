/* DCC — Progreso premium v2, robusto ante el orden de carga */
(function(){
  const G='#f2c85f';
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const fmt=(v,d=1)=>v==null?'—':Number(v).toFixed(d).replace('.',',');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function css(){
    if(document.getElementById('dcc-progress-v2-css'))return;
    const s=document.createElement('style');s.id='dcc-progress-v2-css';s.textContent=`
    .dcc-p2-metric{position:relative;overflow:hidden}.dcc-p2-spark{height:26px;margin-top:7px}.dcc-p2-spark svg{width:100%;height:100%}
    .dcc-p2-section{margin-top:12px;padding:16px;border:1px solid rgba(224,173,76,.58);border-radius:20px;background:linear-gradient(145deg,#0f151a,#070b0e)}
    .dcc-p2-head,.dcc-p2-forcehead{display:flex;justify-content:space-between;align-items:center;gap:10px}.dcc-p2-head h2,.dcc-p2-forcehead h2{margin:0;font-size:20px}.dcc-p2-head p,.dcc-p2-forcehead p{margin:4px 0 0;color:#8e98a3;font-size:10px}
    .dcc-p2-tabs{display:flex;gap:5px}.dcc-p2-tabs button,.dcc-p2-all{border:1px solid #303942;border-radius:999px;background:#090e12;color:#a7afb9;padding:8px 13px;font-size:9px;font-weight:850}.dcc-p2-tabs button.active{border-color:${G};background:${G};color:#0a0906}.dcc-p2-all{border-color:#b8872c;color:${G}}
    .dcc-p2-chart{height:185px;margin-top:8px}.dcc-p2-chart svg{width:100%;height:100%}.dcc-p2-empty{min-height:120px;display:grid;place-items:center;color:#818b96;font-size:11px;text-align:center;padding:18px}
    .dcc-p2-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:11px}.dcc-p2-card{padding:9px;border:1px solid #29333b;border-radius:14px;background:#0a1014}.dcc-p2-card.more{display:none}.dcc-p2-grid.all .dcc-p2-card.more{display:block}.dcc-p2-top{display:flex;gap:8px;align-items:center}.dcc-p2-card img{width:44px;height:44px;object-fit:contain;border-radius:9px;background:#efefec}.dcc-p2-card b{font-size:10px;line-height:1.2}.dcc-p2-change{display:block;margin-top:7px;font-size:12px;font-weight:900;color:#52e39a}.dcc-p2-change.down{color:#ff5a62}.dcc-p2-detail{display:block;margin-top:5px;color:#c0c7cf;font-size:9px;line-height:1.45}.dcc-p2-mini{height:22px;margin-top:7px}.dcc-p2-mini svg{width:100%;height:100%}.dcc-p2-note{margin-top:8px;color:#76818c;font-size:8px}
    @media(max-width:650px){.dcc-p2-section{padding:13px}.dcc-p2-head{align-items:flex-start;flex-direction:column}.dcc-p2-tabs{width:100%}.dcc-p2-tabs button{flex:1;padding:8px 5px}.dcc-p2-chart{height:160px}.dcc-p2-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.dcc-p2-forcehead{align-items:flex-start}.dcc-p2-card img{width:40px;height:40px}}
    `;document.head.appendChild(s);
  }

  function client(id){return (window.data?.clients||[]).find(x=>String(x.id)===String(id))}
  function weights(id,cl){
    const a=Array.isArray(window.data?.weights?.[id])?window.data.weights[id]:[];
    let out=a.map((x,i)=>({v:num(typeof x==='object'?(x.weight??x.value??x.peso):x),i,date:typeof x==='object'?(x.date??x.created_at??x.fecha):null})).filter(x=>x.v!=null);
    if(!out.length){const v=num(cl?.initial??cl?.weight);if(v!=null)out=[{v,i:0,date:null}]}
    return out;
  }
  function fats(id,cl){
    const out=[],seen=new Set();
    const push=(v,date)=>{v=num(v);if(v==null||v<2||v>70)return;const k=(date||'')+'|'+v;if(seen.has(k))return;seen.add(k);out.push({v,date:date||null})};
    ['bodyFat','body_fat','fat','fatPct','fat_pct','grasa','porcentajeGrasa'].forEach(k=>push(cl?.[k],cl?.updated_at));
    const walk=(o,d=0)=>{if(!o||d>5)return;if(Array.isArray(o)){o.forEach(x=>walk(x,d+1));return}if(typeof o!=='object')return;const cid=o.client_id??o.clientId??o.client,ok=cid==null||String(cid)===String(id),date=o.date??o.created_at??o.createdAt??o.fecha;for(const [k,v] of Object.entries(o)){if(ok&&/fat|grasa/i.test(k)&&!/free/i.test(k))push(v,date);if(v&&typeof v==='object')walk(v,d+1)}};
    ['checkins','checkIns','checkinHistory','progress','measurements'].forEach(k=>walk(window.data?.[k]));return out;
  }
  function lib(ex){const L=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[],id=String(ex?.id??ex?.exerciseId??ex?.exercise_id??''),n=String(ex?.name??ex?.nombre??ex?.exerciseName??ex?.exercise??'').toLowerCase();return L.find(x=>id&&String(x.id)===id)||L.find(x=>String(x.name||'').toLowerCase()===n)}
  function name(ex){return ex?.name??ex?.nombre??ex?.exerciseName??ex?.exercise??lib(ex)?.name??'Ejercicio'}
  function key(ex){return String(ex?.id??ex?.exerciseId??ex?.exercise_id??name(ex)).toLowerCase()}
  function pairs(ex){let a=ex?.sets??ex?.series??ex?.completedSets??ex?.setData;if(!Array.isArray(a))a=[];let p=a.map(s=>({w:num(s?.weight??s?.kg??s?.peso??s?.load),r:num(s?.reps??s?.repetitions??s?.repeticiones)})).filter(x=>x.w!=null&&x.r!=null&&x.w>=0&&x.r>0);if(!p.length){const w=num(ex?.weight??ex?.kg??ex?.peso??ex?.load),r=num(ex?.reps??ex?.repetitions??ex?.repeticiones);if(w!=null&&r!=null&&r>0)p=[{w,r}]}return p}
  function collect(o,a=[],d=0){if(!o||d>6)return a;if(Array.isArray(o)){o.forEach(x=>collect(x,a,d+1));return a}if(typeof o!=='object')return a;if(pairs(o).length&&(o.name||o.nombre||o.exercise||o.exerciseName||o.exerciseId||o.exercise_id))a.push(o);for(const [k,v] of Object.entries(o))if(v&&typeof v==='object'&&!['client','user'].includes(k))collect(v,a,d+1);return a}
  function force(id){
    const sessions=Array.isArray(window.data?.workoutHistory?.[id])?window.data.workoutHistory[id]:[],map=new Map();
    sessions.forEach((s,si)=>{const seen=new Set(),date=s?.date??s?.created_at??s?.fecha??null;collect(s).forEach(ex=>{const k=key(ex);if(seen.has(k))return;seen.add(k);const ps=pairs(ex);if(!ps.length)return;const best=ps.reduce((a,x)=>{const e=x.w*(1+x.r/30);return e>a.e?{...x,e}:a},{e:-1});if(!map.has(k))map.set(k,{name:name(ex),image:lib(ex)?.image||'',points:[]});map.get(k).points.push({...best,si,date})})});
    return [...map.values()].map(x=>{x.points.sort((a,b)=>a.si-b.si);x.first=x.points[0];x.last=x.points.at(-1);x.change=x.points.length>1&&x.first.e>0?(x.last.e/x.first.e-1)*100:null;return x}).sort((a,b)=>Math.abs(b.change||0)-Math.abs(a.change||0));
  }
  function globalForce(fd){const a=fd.map(x=>x.change).filter(Number.isFinite).sort((a,b)=>a-b);if(!a.length)return null;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2}
  function path(vals,w=280,h=70,p=5){if(vals.length<2)return'';const lo=Math.min(...vals),hi=Math.max(...vals),sp=hi-lo||1;return vals.map((v,i)=>`${i?'L':'M'}${p+i*(w-2*p)/(vals.length-1)},${h-p-(v-lo)*(h-2*p)/sp}`).join(' ')}
  function spark(vals){if(vals.length<2)return'';const d=path(vals);return `<div class="dcc-p2-spark"><svg viewBox="0 0 280 70" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="${G}" stroke-width="3" vector-effect="non-scaling-stroke"/><path d="${d} L275,68 L5,68 Z" fill="rgba(242,200,95,.08)"/></svg></div>`}
  function chart(points,label){const vals=points.map(x=>x.v);if(vals.length<2)return `<div class="dcc-p2-empty">Todavía no hay suficientes registros de ${label.toLowerCase()} para dibujar una evolución.</div>`;const d=path(vals,800,180,12);return `<div class="dcc-p2-chart"><svg viewBox="0 0 800 180" preserveAspectRatio="none"><line x1="12" y1="168" x2="788" y2="168" stroke="#273039"/><path d="${d}" fill="none" stroke="${G}" stroke-width="3" vector-effect="non-scaling-stroke"/>${vals.map((v,i)=>{const lo=Math.min(...vals),hi=Math.max(...vals),sp=hi-lo||1,x=12+i*776/(vals.length-1),y=168-(v-lo)*156/sp;return `<circle cx="${x}" cy="${y}" r="4" fill="${G}"/><text x="${x}" y="${Math.max(12,y-9)}" text-anchor="middle" fill="#c9d0d6" font-size="10">${fmt(v)}</text>`}).join('')}</svg></div>`}
  function card(x,i){const ch=x.change,down=ch!=null&&ch<0,vals=x.points.map(p=>p.e);return `<article class="dcc-p2-card ${i>=4?'more':''}"><div class="dcc-p2-top">${x.image?`<img src="${esc(x.image)}" alt="">`:''}<b>${esc(x.name)}</b></div><span class="dcc-p2-change ${down?'down':''}">${ch==null?'Sin datos suficientes':`${ch>=0?'↗ +':'↘ '}${fmt(ch)} %`}</span><span class="dcc-p2-detail">${fmt(x.first?.w)} kg × ${fmt(x.first?.r,0)}<br>→ ${fmt(x.last?.w)} kg × ${fmt(x.last?.r,0)}</span>${vals.length>1?`<div class="dcc-p2-mini"><svg viewBox="0 0 280 70" preserveAspectRatio="none"><path d="${path(vals)}" fill="none" stroke="${down?'#ff5a62':G}" stroke-width="3" vector-effect="non-scaling-stroke"/></svg></div>`:''}</article>`}

  function render(){
    css();
    const root=document.querySelector('#coach-main .dcc-ca-wrap');if(!root)return;
    const active=[...root.querySelectorAll('.dcc-ca-tab')].find(b=>b.classList.contains('active'));
    if(!active||!/progreso/i.test(active.textContent))return;
    const id=window.selectedClient;if(id==null)return;const cl=client(id);if(!cl)return;
    const host=root.querySelector('.dcc-ca-tabs')?.nextElementSibling;if(!host)return;
    if(host.dataset.dccProgressV2==='1')return;
    const wp=weights(id,cl),fp=fats(id,cl),fd=force(id),gf=globalForce(fd),wi=wp[0]?.v,wc=wp.at(-1)?.v,fi=fp[0]?.v,fc=fp.at(-1)?.v;
    const delta=(cur,ini,u)=>cur==null||ini==null?'Sin histórico todavía':Math.abs(cur-ini)<.05?'Sin cambios desde el inicio':`${cur>ini?'↑':'↓'} ${fmt(Math.abs(cur-ini))} ${u} desde el inicio`;
    const metrics=root.querySelector('.dcc-ca-metrics');if(metrics)metrics.innerHTML=`<div class="dcc-ca-metric dcc-p2-metric"><small>Peso actual</small><b>${wc!=null?fmt(wc)+' kg':'—'}</b><span class="dcc-ca-trend ${wc!=null&&wi!=null&&wc<wi?'good':''}">${delta(wc,wi,'kg')}</span>${spark(wp.map(x=>x.v))}</div><div class="dcc-ca-metric dcc-p2-metric"><small>% de grasa</small><b>${fc!=null?fmt(fc)+' %':'—'}</b><span class="dcc-ca-trend ${fc!=null&&fi!=null&&fc<fi?'good':''}">${delta(fc,fi,'%')}</span>${spark(fp.map(x=>x.v))}</div><div class="dcc-ca-metric dcc-p2-metric"><small>Fuerza global</small><b>${gf==null?'—':`${gf>=0?'+':''}${fmt(gf)} %`}</b><span class="dcc-ca-trend ${gf!=null&&gf>=0?'good':''}">${gf==null?'Sin datos suficientes':'Evolución desde el inicio'}</span>${spark(fd.filter(x=>x.change!=null).map(x=>x.change))}</div>`;
    const metric=window.__dccP2Metric||'weight',pts=metric==='fat'?fp:metric==='force'?fd.filter(x=>x.change!=null).map(x=>({v:x.change})):wp,label=metric==='fat'?'% Grasa':metric==='force'?'Fuerza':'Peso';
    host.dataset.dccProgressV2='1';
    host.innerHTML=`<section class="dcc-p2-section"><div class="dcc-p2-head"><div><h2>Evolución</h2><p>Visualiza el progreso a lo largo del tiempo.</p></div><div class="dcc-p2-tabs"><button class="${metric==='weight'?'active':''}" data-m="weight">Peso</button><button class="${metric==='fat'?'active':''}" data-m="fat">% Grasa</button><button class="${metric==='force'?'active':''}" data-m="force">Fuerza</button></div></div>${chart(pts,label)}</section><section class="dcc-p2-section"><div class="dcc-p2-forcehead"><div><h2>Progreso de fuerza</h2><p>Evolución en sus ejercicios registrados.</p></div>${fd.length>4?'<button class="dcc-p2-all">Ver todos ›</button>':''}</div>${fd.length?`<div class="dcc-p2-grid">${fd.map(card).join('')}</div><div class="dcc-p2-note">La evolución combina carga y repeticiones mediante fuerza estimada. Solo se comparan ejercicios con registros disponibles.</div>`:'<div class="dcc-p2-empty">Cuando el cliente registre cargas y repeticiones, aquí aparecerá su progreso de fuerza.</div>'}</section>`;
    host.querySelectorAll('.dcc-p2-tabs button').forEach(b=>b.onclick=()=>{window.__dccP2Metric=b.dataset.m;host.dataset.dccProgressV2='';render()});
    const all=host.querySelector('.dcc-p2-all');if(all)all.onclick=()=>{const g=host.querySelector('.dcc-p2-grid');g.classList.toggle('all');all.textContent=g.classList.contains('all')?'Ver menos ‹':'Ver todos ›'};
  }

  const mo=new MutationObserver(()=>setTimeout(render,0));
  function start(){css();mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});render();setInterval(render,700)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();