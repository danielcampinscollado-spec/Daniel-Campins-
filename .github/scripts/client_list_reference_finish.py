from pathlib import Path
p=Path('coach-premium-core-v9.js')
s=p.read_text()
anchor='      .dcc-cl-subtools{display:flex;justify-content:space-between;align-items:center;margin:11px 0 14px}.dcc-cl-tabs{display:flex;border:1px solid #292f36;border-radius:22px;overflow:hidden;background:#090c0f}.dcc-cl-tab{padding:9px 18px;border:0;background:none;color:#9aa1ac;font-size:11px}.dcc-cl-tab.active{border:1px solid ${GOLD2};border-radius:21px;background:radial-gradient(circle at 50% 50%,#d9aa4a35,#15100a);color:${GOLD2};box-shadow:0 0 18px #d9aa4a28}.dcc-cl-sort{padding:9px 13px;border:1px solid #343941;border-radius:15px;background:#0a0d10;color:#e8e8e8;font-size:11px}\n'
extra='      .dcc-cl-card-ref{grid-template-columns:minmax(0,1fr) auto 18px!important;cursor:pointer!important;min-height:92px!important;padding:15px 17px!important}.dcc-cl-card-ref .dcc-cl-training,.dcc-cl-card-ref .dcc-cl-manage{display:none!important}.dcc-cl-ref-meta{display:flex;gap:14px;align-items:center;margin-top:8px;color:#8d96a1;font-size:10px;font-weight:650}.dcc-cl-active{align-self:center;padding:7px 10px;border-radius:999px;background:rgba(57,185,130,.13);color:#47b987;font-size:9px;font-weight:850}.dcc-cl-chevron{align-self:center;color:${GOLD2};font-size:26px;line-height:1}\n'
if anchor not in s: raise SystemExit('client list style anchor missing')
if '.dcc-cl-card-ref{grid-template-columns' not in s:s=s.replace(anchor,anchor+extra,1)
p.write_text(s)
