/* DCC — Progreso premium del cliente: renderer único y estable */
(function(){
  'use strict';

  if(window.__dccClientProgressV6StableLoaded) return;
  window.__dccClientProgressV6StableLoaded=true;

  const GOLD='#efbb4c';

  const num=value=>{
    const n=parseFloat(String(value??'').replace(',','.'));
    return Number.isFinite(n)?n:null;
  };

  const fmt=value=>{
    const n=Number(value);
    if(!Number.isFinite(n)) return '—';
    return n.toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1});
  };

  const escHtml=value=>String(value??'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');

  const WEIGHT_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="6" width="14" height="13" rx="3"/><path d="M9 9.5c1.9-1.5 4.1-1.5 6 0"/><path d="M12 9.5v3"/></svg>';
  const FORCE_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/></svg>';

  function injectStyles(){
    const old=document.getElementById('dcc-client-progress-v6-style');
    if(old) old.remove();

    const style=document.createElement('style');
    style.id='dcc-client-progress-v6-style';
    style.textContent=`
      #client-main .dcpr6{width:100%;max-width:860px;margin:0 auto;padding:2px 0 34px;color:#f7f6f1}
      #client-main .dcpr6 *{box-sizing:border-box}
      #client-main .dcpr6-head{margin:4px 2px 15px}
      #client-main .dcpr6-kicker{color:#e9b74d;font-size:11px;font-weight:850;letter-spacing:3px;text-transform:uppercase}
      #client-main .dcpr6-head p{margin:8px 0 0;color:#9ba5b1;font-size:14px;line-height:1.35}

      #client-main .dcpr6-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:10px}
      #client-main .dcpr6-metric{position:relative;min-height:122px;padding:12px 12px 10px;overflow:hidden;border:1px solid rgba(232,178,68,.76);border-radius:19px;background:radial-gradient(circle at 100% 0,rgba(232,178,68,.11),transparent 38%),linear-gradient(145deg,#141b23 0%,#091118 70%,#070b10 100%);box-shadow:0 15px 36px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.035)}
      #client-main .dcpr6-metric-top{display:flex;align-items:center;gap:8px}
      #client-main .dcpr6-icon{width:32px;height:32px;flex:none;display:grid;place-items:center;border:1px solid rgba(232,178,68,.40);border-radius:10px;background:linear-gradient(145deg,rgba(232,178,68,.10),rgba(232,178,68,.025));color:#f1c35d}
      #client-main .dcpr6-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      #client-main .dcpr6-percent{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Segoe UI",Arial,sans-serif;font-size:21px;font-weight:400;line-height:1;letter-spacing:-.04em}
      #client-main .dcpr6-metric-copy{min-width:0}
      #client-main .dcpr6-metric-title{color:#f5f4ef;font-size:12px;font-weight:780;line-height:1.1;white-space:nowrap}
      #client-main .dcpr6-metric-start{margin-top:2px;color:#919ca9;font-size:8.5px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #client-main .dcpr6-value{margin-top:10px;color:#fff;font-size:25px;font-weight:830;letter-spacing:-.8px;line-height:1;white-space:nowrap}
      #client-main .dcpr6-chip{display:inline-flex;align-items:center;min-height:24px;margin-top:8px;padding:4px 8px;border:1px solid rgba(70,218,154,.64);border-radius:999px;background:rgba(20,111,75,.18);color:#58e3a7;font-size:9px;font-weight:820;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
      #client-main .dcpr6-chip.neutral{border-color:#344351;background:#0b1219;color:#aab5c2}
      #client-main .dcpr6-spark{display:none!important}

      #client-main .dcpr6-switch{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:0 0 10px;padding:4px;border:1px solid #27333f;border-radius:18px;background:linear-gradient(145deg,#0b1219,#070c11);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      #client-main .dcpr6-switch button{min-height:42px;display:flex;align-items:center;justify-content:center;gap:6px;padding:6px 4px;border:1px solid transparent!important;border-radius:14px;background:transparent!important;color:#9ca8b5!important;font-size:10.5px;font-weight:800;box-shadow:none!important}
      #client-main .dcpr6-switch button.active{border-color:#e5b347!important;background:radial-gradient(circle at 50% 0,rgba(242,194,91,.21),transparent 78%),linear-gradient(145deg,#2a2418,#15130d)!important;color:#f1c45e!important;box-shadow:0 0 20px rgba(226,171,62,.14),inset 0 1px 0 rgba(255,255,255,.04)!important}
      #client-main .dcpr6-switch svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      #client-main .dcpr6-fat-switch-icon{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Segoe UI",Arial,sans-serif;font-size:18px;font-weight:400;line-height:1;letter-spacing:-.04em}

      #client-main .dcpr6-panel{position:relative;margin:0 0 10px;padding:13px 14px 11px;border:1px solid rgba(232,178,68,.74);border-radius:19px;background:radial-gradient(circle at 100% 0,rgba(232,178,68,.10),transparent 38%),linear-gradient(145deg,#111922,#071018);box-shadow:0 15px 38px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.03);overflow:hidden}
      #client-main .dcpr6-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;position:relative;z-index:1}
      #client-main .dcpr6-panel-title{display:flex;align-items:center;gap:6px;min-width:0}
      #client-main .dcpr6-panel-title .dcpr6-icon{width:28px;height:28px;border:0;background:transparent}
      #client-main .dcpr6-eyebrow{color:#e9b74d;font-size:10px;font-weight:850;letter-spacing:2.3px;text-transform:uppercase}
      #client-main .dcpr6-panel h2{margin:0!important;color:#f6f5f0!important;font-size:18px!important;line-height:1.1!important;letter-spacing:-.35px!important}
      #client-main .dcpr6-sub{margin:2px 0 0;color:#8f9aa7;font-size:9px;line-height:1.35}
      #client-main .dcpr6-chart-badge{flex:none;padding:6px 9px;border:1px solid rgba(232,178,68,.66);border-radius:12px;background:linear-gradient(145deg,rgba(232,178,68,.11),rgba(232,178,68,.03));color:#f1c45e;font-size:10px;font-weight:850;white-space:nowrap}
      #client-main .dcpr6-chart{height:175px;margin-top:4px}
      #client-main .dcpr6-chart svg{width:100%;height:100%;display:block;overflow:visible}
      #client-main .dcpr6-chart-empty{height:145px;display:grid;place-items:center;padding:14px;color:#7f8b97;font-size:10px;line-height:1.5;text-align:center}

      #client-main .dcpr6-force-panel{padding:0!important}
      #client-main .dcpr6-force-head{position:relative;display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:68px;margin:0;padding:13px 48px 13px 15px;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent}
      #client-main .dcpr6-force-head::after{content:'';position:absolute;right:18px;top:50%;width:9px;height:9px;border-right:2px solid #e7b64e;border-bottom:2px solid #e7b64e;transform:translateY(-65%) rotate(45deg);transition:transform .18s ease}
      #client-main .dcpr6-force-panel.is-open .dcpr6-force-head::after{transform:translateY(-35%) rotate(225deg)}
      #client-main .dcpr6-count{flex:none;padding:7px 10px;border:1px solid #2c3945;border-radius:999px;background:#081018;color:#9da9b5;font-size:9px;white-space:nowrap}
      #client-main .dcpr6-force-body{display:none}
      #client-main .dcpr6-force-panel.is-open .dcpr6-force-body{display:block;padding:0 13px 13px}
      #client-main .dcpr6-force-list{border:1px solid #202b35;border-radius:15px;overflow:hidden;background:#071018}
      #client-main .dcpr6-force-row{min-height:50px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;padding:9px 10px;border-top:1px solid #202b35}
      #client-main .dcpr6-force-row:first-child{border-top:0}
      #client-main .dcpr6-force-name{color:#f1f2ee;font-size:11px;font-weight:710;line-height:1.25}
      #client-main .dcpr6-force-change{padding:5px 9px;border:1px solid rgba(53,210,143,.52);border-radius:999px;background:rgba(16,96,65,.17);color:#59e2aa;font-size:10px;font-weight:850;white-space:nowrap}
      #client-main .dcpr6-force-empty{padding:20px 14px;text-align:center;color:#818c98;font-size:10px;line-height:1.45}
      #client-main .dcpr6-best{display:flex;align-items:center;gap:8px;margin-top:8px;padding:9px 11px;border:1px solid rgba(232,178,68,.70);border-radius:13px;background:linear-gradient(90deg,rgba(232,178,68,.18),rgba(232,178,68,.03));color:#f0c35d;font-size:10px;font-weight:820}

      #client-main .dcpr6-constancy{display:grid;grid-template-columns:38px minmax(0,1fr) auto;align-items:center;gap:10px}
      #client-main .dcpr6-constancy-copy{min-width:0}
      #client-main .dcpr6-constancy-copy p{margin:4px 0 8px;color:#a0aab5;font-size:9.5px;line-height:1.35}
      #client-main .dcpr6-constancy-pct{color:#f5f5ef;font-size:14px;font-weight:850;white-space:nowrap}
      #client-main .dcpr6-bar{height:8px;border:1px solid #283744;border-radius:999px;background:#0a1118;overflow:hidden}
      #client-main .dcpr6-bar span{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#e3a936,#f5ca64);box-shadow:0 0 16px rgba(240,190,76,.27)}

      @media(max-width:430px){
        #client-main .dcpr6-head{margin-bottom:14px}
        #client-main .dcpr6-head p{font-size:13px}
        #client-main .dcpr6-metrics{gap:6px}
        #client-main .dcpr6-metric{min-height:110px;padding:9px 8px 8px;border-radius:17px}
        #client-main .dcpr6-icon{width:29px;height:29px;border-radius:9px}
        #client-main .dcpr6-icon svg{width:16px;height:16px}
        #client-main .dcpr6-percent{font-size:19px}
        #client-main .dcpr6-metric-title{font-size:10.5px}
        #client-main .dcpr6-metric-start{font-size:7.6px}
        #client-main .dcpr6-value{margin-top:8px;font-size:20px;letter-spacing:-.45px}
        #client-main .dcpr6-chip{min-height:22px;margin-top:6px;padding:3px 6px;font-size:7.8px}
        #client-main .dcpr6-switch button{min-height:40px;font-size:9.5px;gap:5px}
        #client-main .dcpr6-switch svg{width:16px;height:16px}
        #client-main .dcpr6-panel{padding:11px 11px 9px}
        #client-main .dcpr6-panel h2{font-size:16px!important}
        #client-main .dcpr6-chart-badge{padding:5px 8px;font-size:9px}
        #client-main .dcpr6-chart{height:148px;margin-top:2px}
        #client-main .dcpr6-chart-empty{height:125px}
        #client-main .dcpr6-force-panel{padding:0!important}
        #client-main .dcpr6-force-head{min-height:64px;padding:12px 44px 12px 13px}
        #client-main .dcpr6-force-head::after{right:16px}
        #client-main .dcpr6-force-panel.is-open .dcpr6-force-body{padding:0 11px 11px}
        #client-main .dcpr6-count{font-size:8px;padding:6px 8px}
        #client-main .dcpr6-constancy{grid-template-columns:34px minmax(0,1fr) auto;gap:8px}
        #client-main .dcpr6-constancy .dcpr6-icon{width:34px;height:34px}
        #client-main .dcpr6-constancy-copy p{font-size:9px}
      }
    `;
    document.head.appendChild(style);
  }

  function bestEstimatedStrength(ex){
    const sets=Array.isArray(ex?.sets)?ex.sets:[];
    let best=null;
    sets.forEach(set=>{
      const kg=num(set?.kg??set?.weight??set?.peso);
      const reps=num(set?.reps??set?.repetitions??set?.repeticiones);
      if(kg==null || reps==null || kg<0 || reps<=0) return;
      const estimated=kg*(1+reps/30);
      if(!best || estimated>best.estimated) best={kg,reps,estimated};
    });
    return best;
  }

  function chart(dataSet){
    const points=(dataSet.values||[]).filter(item=>Number.isFinite(Number(item.v)));
    if(points.length<2){
      return `<div class="dcpr6-chart-empty">Necesitamos más registros para mostrar esta evolución.<br>En cuanto registres nuevos datos, aparecerá aquí automáticamente.</div>`;
    }

    const W=720,H=210,L=55,R=18,T=16,B=34;
    const vals=points.map(x=>Number(x.v));
    let min=Math.min(...vals),max=Math.max(...vals),span=max-min;
    if(!span){
      span=Math.max(Math.abs(max)*.08,1);
      min-=span;
      max+=span;
    }else{
      const pad=span*.16;
      min-=pad;
      max+=pad;
      span=max-min;
    }

    const coords=vals.map((v,i)=>({
      x:L+i*(W-L-R)/(vals.length-1),
      y:T+(max-v)/span*(H-T-B),
      v,
      label:points[i].label||`R${i+1}`
    }));

    const line=coords.map((pt,i)=>`${i?'L':'M'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
    const area=`${line} L${coords[coords.length-1].x.toFixed(1)},${H-B} L${coords[0].x.toFixed(1)},${H-B} Z`;
    const gid='dcpr6Area'+Date.now();
    const fid='dcpr6Glow'+Date.now();

    const horizontal=Array.from({length:5},(_,i)=>{
      const y=T+i*(H-T-B)/4;
      const val=max-i*span/4;
      const label=dataSet.unit==='%'?`${val>=0?'+':''}${val.toFixed(0)}%`:val.toFixed(0);
      return `<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="rgba(145,159,174,.18)" stroke-dasharray="4 5"/><text x="8" y="${y+4}" fill="#7f8b98" font-size="11">${label}</text>`;
    }).join('');

    const every=Math.max(1,Math.ceil(coords.length/10));
    const vertical=coords.map((pt,i)=>{
      const label=i%every===0||i===coords.length-1?`<text x="${pt.x}" y="${H-10}" text-anchor="middle" fill="#7f8b98" font-size="10">${escHtml(pt.label)}</text>`:'';
      return `<line x1="${pt.x}" y1="${T}" x2="${pt.x}" y2="${H-B}" stroke="rgba(145,159,174,.10)"/>${label}`;
    }).join('');

    const dots=coords.map(pt=>`<circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#f4c75c" stroke="#fff0bb" stroke-width="1.2"/>`).join('');

    return `<div class="dcpr6-chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GOLD}" stop-opacity=".28"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></linearGradient><filter id="${fid}"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${horizontal}${vertical}<path d="${area}" fill="url(#${gid})"/><path d="${line}" fill="none" stroke="${GOLD}" stroke-width="3" vector-effect="non-scaling-stroke" filter="url(#${fid})"/>${dots}</svg></div>`;
  }

  function getContext(){
    try{
      const cid=typeof currentClientId!=='undefined'?currentClientId:null;
      if(!cid) return null;
      const c=typeof client==='function'?client(cid):null;
      if(!c) return null;
      const d=typeof data!=='undefined'?data:(window.data||{});
      return {cid,c,d};
    }catch(error){
      console.error('DCC progreso: no se pudo obtener el contexto',error);
      return null;
    }
  }

  function render(){
    const main=document.getElementById('client-main');
    if(!main) return;
    const ctx=getContext();
    if(!ctx) return;
    const {cid,c,d}=ctx;

    injectStyles();

    const currentWeight=num(c.weight)??0;
    const initialWeight=num(c.initial??c.initial_weight)??currentWeight;

    let weightSeries=(d.weights?.[cid]||[])
      .map(value=>num(typeof value==='object'?(value.weight??value.value??value.peso):value))
      .filter(Number.isFinite);
    if(!weightSeries.length && initialWeight>0) weightSeries=[initialWeight];
    if(currentWeight>0 && (!weightSeries.length || Math.abs(weightSeries[weightSeries.length-1]-currentWeight)>.01)) weightSeries.push(currentWeight);

    const weightChange=currentWeight-initialWeight;

    let initialBodyFat=
      c.bodyFatInitial!=null?num(c.bodyFatInitial):
      c.initialBodyFat!=null?num(c.initialBodyFat):
      c.initial_body_fat!=null?num(c.initial_body_fat):null;
    if(initialBodyFat!=null && initialBodyFat<=0) initialBodyFat=null;

    const checkin=d.checkins?.[cid]||{};
    let currentBodyFat=
      checkin.bodyFat!==undefined && checkin.bodyFat!==null && checkin.bodyFat!=='' ? num(checkin.bodyFat) :
      checkin.body_fat!==undefined && checkin.body_fat!==null && checkin.body_fat!=='' ? num(checkin.body_fat) :
      c.bodyFat!==undefined && c.bodyFat!==null && c.bodyFat!=='' ? num(c.bodyFat) :
      c.body_fat!==undefined && c.body_fat!==null && c.body_fat!=='' ? num(c.body_fat) : null;
    if(currentBodyFat!=null && currentBodyFat<=0) currentBodyFat=null;

    const bodyFatChange=initialBodyFat!=null && currentBodyFat!=null?currentBodyFat-initialBodyFat:null;
    const fatSeries=[];
    if(initialBodyFat!=null) fatSeries.push(initialBodyFat);
    if(currentBodyFat!=null && (!fatSeries.length || Math.abs(fatSeries[fatSeries.length-1]-currentBodyFat)>.01)) fatSeries.push(currentBodyFat);

    const workouts=(d.workoutHistory?.[cid]||[])
      .slice()
      .filter(w=>w && w.date)
      .sort((a,b)=>new Date(a.date)-new Date(b.date));

    const keyOf=ex=>String(ex?.libraryId??ex?.id??ex?.name??ex?.nombre??'Ejercicio').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
    const nameOf=ex=>ex?.name??ex?.nombre??ex?.exerciseName??'Ejercicio';
    const strengthMap=new Map();
    const baselineMap=new Map();
    const strengthTimeline=[];

    workouts.forEach((session,sessionIndex)=>{
      const changes=[];
      (session.exercises||[]).forEach(ex=>{
        const best=bestEstimatedStrength(ex);
        if(!best) return;
        const key=keyOf(ex);
        const name=nameOf(ex);

        if(!strengthMap.has(key)) strengthMap.set(key,{name,first:best,last:best,count:1});
        else{
          const row=strengthMap.get(key);
          row.last=best;
          row.count+=1;
          if(!row.name) row.name=name;
        }

        if(!baselineMap.has(key)) baselineMap.set(key,best.estimated);
        const baseline=baselineMap.get(key);
        if(baseline>0) changes.push((best.estimated/baseline-1)*100);
      });
      if(changes.length){
        strengthTimeline.push({v:changes.reduce((a,b)=>a+b,0)/changes.length,label:`S${sessionIndex+1}`});
      }
    });

    const strengthRows=[...strengthMap.values()]
      .map(row=>({...row,change:row.count>=2&&row.first.estimated>0?(row.last.estimated/row.first.estimated-1)*100:null}))
      .filter(row=>Number.isFinite(row.change))
      .sort((a,b)=>b.change-a.change);

    const improvedRows=strengthRows.filter(row=>row.change>0);
    const allChanges=strengthRows.map(row=>row.change).filter(Number.isFinite);
    const averageStrength=allChanges.length?allChanges.reduce((a,b)=>a+b,0)/allChanges.length:null;

    const selected=window.dccClientProgressMetric||'weight';
    const forceOpen=!!window.dccForceProgressOpen;
    const metricData={
      weight:{label:'Peso',subtitle:'Tu peso registro a registro.',unit:' kg',values:weightSeries.map((v,i)=>({v,label:`R${i+1}`})),valueLabel:currentWeight>0?`${fmt(currentWeight)} kg`:'—'},
      fat:{label:'Grasa',subtitle:'Tu composición corporal a lo largo del proceso.',unit:'%',values:fatSeries.map((v,i)=>({v,label:`R${i+1}`})),valueLabel:currentBodyFat!=null?`${fmt(currentBodyFat)}%`:'—'},
      force:{label:'Fuerza',subtitle:'Tu fuerza entrenamiento a entrenamiento.',unit:'%',values:strengthTimeline,valueLabel:averageStrength!=null?`${averageStrength>=0?'+':''}${fmt(averageStrength)}%`:'—'}
    };
    const selectedData=metricData[selected]||metricData.weight;

    const now=new Date();
    const monthStart=new Date(now.getFullYear(),now.getMonth(),1);
    const nextMonth=new Date(now.getFullYear(),now.getMonth()+1,1);
    const monthWorkouts=workouts.filter(w=>{const dt=new Date(w.date);return dt>=monthStart&&dt<nextMonth;}).length;
    const routine=Array.isArray(d.routines?.[cid])?d.routines[cid]:[];
    const monthlyTarget=routine.length?routine.length*4:0;
    const constancyPct=monthlyTarget?Math.min(100,monthWorkouts/monthlyTarget*100):null;

    const weightChip=weightChange!==0?`${weightChange>0?'+':''}${fmt(weightChange)} kg ${weightChange<0?'↓':'↑'}`:'Sin cambios';
    const fatChip=bodyFatChange!=null?`${bodyFatChange>0?'+':''}${fmt(bodyFatChange)} % ${bodyFatChange<0?'↓':'↑'}`:'Sin datos';
    const forceChip=averageStrength!=null?`${improvedRows.length} ${improvedRows.length===1?'ejercicio mejorado':'ejercicios mejorados'}`:'Sin datos suficientes';
    const rows=(improvedRows.length?improvedRows:strengthRows).slice(0,4);
    const best=improvedRows[0]||null;

    main.innerHTML=`
      <div class="dcpr6">
        <div class="dcpr6-head">
          <div class="dcpr6-kicker">PROGRESO</div>
          <p>Así evoluciona tu cambio físico y tu fuerza.</p>
        </div>

        <div class="dcpr6-metrics">
          <div class="dcpr6-metric">
            <div class="dcpr6-metric-top"><div class="dcpr6-icon">${WEIGHT_SVG}</div><div class="dcpr6-metric-copy"><div class="dcpr6-metric-title">Peso</div><div class="dcpr6-metric-start">Inicio ${initialWeight>0?fmt(initialWeight)+' kg':'—'}</div></div></div>
            <div class="dcpr6-value">${currentWeight>0?fmt(currentWeight)+' kg':'—'}</div>
            <div class="dcpr6-chip ${weightChange===0?'neutral':''}">${weightChip}</div>
          </div>

          <div class="dcpr6-metric">
            <div class="dcpr6-metric-top"><div class="dcpr6-icon"><span class="dcpr6-percent">%</span></div><div class="dcpr6-metric-copy"><div class="dcpr6-metric-title">Grasa</div><div class="dcpr6-metric-start">Inicio ${initialBodyFat!=null?fmt(initialBodyFat)+'%':'Sin dato'}</div></div></div>
            <div class="dcpr6-value">${currentBodyFat!=null?fmt(currentBodyFat)+'%':'—'}</div>
            <div class="dcpr6-chip ${bodyFatChange==null?'neutral':''}">${fatChip}</div>
          </div>

          <div class="dcpr6-metric">
            <div class="dcpr6-metric-top"><div class="dcpr6-icon">${FORCE_SVG}</div><div class="dcpr6-metric-copy"><div class="dcpr6-metric-title">Fuerza</div><div class="dcpr6-metric-start">Desde el inicio</div></div></div>
            <div class="dcpr6-value">${averageStrength!=null?`${averageStrength>=0?'+':''}${fmt(averageStrength)}%`:'—'}</div>
            <div class="dcpr6-chip ${averageStrength==null?'neutral':''}">${forceChip}</div>
          </div>
        </div>

        <div class="dcpr6-switch">
          <button type="button" data-dcpr6-metric="weight" class="${selected==='weight'?'active':''}">${WEIGHT_SVG}<span>Peso</span></button>
          <button type="button" data-dcpr6-metric="fat" class="${selected==='fat'?'active':''}"><span class="dcpr6-fat-switch-icon">%</span><span>Grasa</span></button>
          <button type="button" data-dcpr6-metric="force" class="${selected==='force'?'active':''}">${FORCE_SVG}<span>Fuerza</span></button>
        </div>

        <div class="dcpr6-panel">
          <div class="dcpr6-panel-head">
            <div class="dcpr6-panel-title"><div class="dcpr6-icon"><svg viewBox="0 0 24 24"><path d="M5 18V13M10 18V9M15 18V5M4 19h16"/></svg></div><div><h2>Evolución</h2><p class="dcpr6-sub">${selectedData.subtitle}</p></div></div>
            <div class="dcpr6-chart-badge">${selectedData.valueLabel}</div>
          </div>
          ${chart(selectedData)}
        </div>

        <div class="dcpr6-panel dcpr6-force-panel ${forceOpen?'is-open':''}">
          <div class="dcpr6-force-head" role="button" tabindex="0" aria-expanded="${forceOpen?'true':'false'}">
            <div><div class="dcpr6-eyebrow">PROGRESO DE FUERZA</div><p class="dcpr6-sub">${forceOpen?'Variación desde el inicio.':'Pulsa para ver el detalle'}</p></div>
            <div class="dcpr6-count">${improvedRows.length} ${improvedRows.length===1?'ejercicio mejorado':'ejercicios mejorados'}</div>
          </div>
          <div class="dcpr6-force-body">
            <div class="dcpr6-force-list">
              ${rows.length?rows.map(row=>`<div class="dcpr6-force-row"><div class="dcpr6-force-name">${escHtml(row.name)}</div><div class="dcpr6-force-change">${row.change>=0?'+':''}${fmt(row.change)}%</div></div>`).join(''):`<div class="dcpr6-force-empty">Registra varios entrenamientos para empezar a comparar tu fuerza.</div>`}
            </div>
            ${best?`<div class="dcpr6-best"><span>★</span><span>Mejor progreso: ${escHtml(best.name)} · +${fmt(best.change)}%</span></div>`:''}
          </div>
        </div>

        <div class="dcpr6-panel">
          <div class="dcpr6-constancy">
            <div class="dcpr6-icon"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M4 9h16"/><path d="m9 14 2 2 4-5"/></svg></div>
            <div class="dcpr6-constancy-copy"><div class="dcpr6-eyebrow">CONSTANCIA</div><p>${monthlyTarget?`${monthWorkouts} de ${monthlyTarget} entrenamientos completados este mes`:`${monthWorkouts} entrenamientos completados este mes`}</p><div class="dcpr6-bar"><span style="width:${constancyPct!=null?constancyPct:0}%"></span></div></div>
            <div class="dcpr6-constancy-pct">${constancyPct!=null?Math.round(constancyPct)+'%':monthWorkouts}</div>
          </div>
        </div>
      </div>
    `;

    main.querySelectorAll('[data-dcpr6-metric]').forEach(button=>{
      button.addEventListener('click',()=>{
        const y=window.scrollY;
        window.dccClientProgressMetric=button.dataset.dcpr6Metric;
        window.dccForceProgressOpen=false;
        render();
        requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:'auto'}));
      });
    });

    const forceHead=main.querySelector('.dcpr6-force-head');
    if(forceHead){
      const toggle=()=>{
        const panel=forceHead.closest('.dcpr6-force-panel');
        if(!panel) return;
        const open=!panel.classList.contains('is-open');
        window.dccForceProgressOpen=open;
        panel.classList.toggle('is-open',open);
        forceHead.setAttribute('aria-expanded',String(open));
        const sub=forceHead.querySelector('.dcpr6-sub');
        if(sub) sub.textContent=open?'Variación desde el inicio.':'Pulsa para ver el detalle';
      };
      forceHead.addEventListener('click',toggle);
      forceHead.addEventListener('keydown',event=>{
        if(event.key!=='Enter'&&event.key!==' ') return;
        event.preventDefault();
        toggle();
      });
    }
  }

  function install(){
    if(window.__dccClientProgressV6Installed) return;
    if(typeof window.showClient!=='function'){
      setTimeout(install,80);
      return;
    }

    window.__dccClientProgressV6Installed=true;
    const original=window.showClient;

    window.showClient=function(screen){
      if(screen==='progress'){
        window.dccClientProgressMetric='weight';
        window.dccForceProgressOpen=false;
      }
      const result=original.apply(this,arguments);
      if(screen==='progress') requestAnimationFrame(render);
      return result;
    };

    window.dccRenderClientProgressV6=render;

    const nav=document.getElementById('client-nav');
    if(nav){
      const active=[...nav.querySelectorAll('button')].find(btn=>/progreso/i.test(btn.textContent||'')&&btn.classList.contains('active'));
      if(active){
        window.dccClientProgressMetric='weight';
        window.dccForceProgressOpen=false;
        requestAnimationFrame(render);
      }
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
