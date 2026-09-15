from pathlib import Path
p=Path('auth-premium-v1.js')
s=p.read_text()
old="const {data:clientRow,error:clientError}=await db.from('clients').select('id').eq('auth_user_id',user.id).maybeSingle();if(clientError)throw clientError;if(clientRow?.id){setCurrentClient(clientRow.id);window.__dccSecureRole='client';sessionBadge('client');if(!(window.currentApp==='client'&&document.getElementById('client')?.style.display==='block')&&typeof window.openApp==='function')await window.openApp('client');return true}showPending(user);return false"
new="const {data:clientRow,error:clientError}=await db.from('clients').select('id').eq('auth_user_id',user.id).maybeSingle();if(clientError)throw clientError;let clientId=clientRow?.id||null;if(!clientId){const {data:claimedId,error:claimError}=await db.rpc('dcc_claim_client_access');if(claimError)throw claimError;clientId=claimedId||null}if(clientId){setCurrentClient(clientId);window.__dccSecureRole='client';sessionBadge('client');if(!(window.currentApp==='client'&&document.getElementById('client')?.style.display==='block')&&typeof window.openApp==='function')await window.openApp('client');return true}showPending(user);return false"
if old not in s: raise SystemExit('auth claim insertion point missing')
p.write_text(s.replace(old,new,1))
