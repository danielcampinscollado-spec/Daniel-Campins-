from pathlib import Path

p = Path('coach-premium-core-v9.js')
s = p.read_text(encoding='utf-8')
old_nav = "function navHtml(){return `<button onclick=\"showCoach('dashboard')\">${icon('panel')}<span>Panel</span></button><button onclick=\"showCoach('clients')\">${icon('clients')}<span>Clientes</span></button><button onclick=\"showCoach('calendar')\">${icon('calendar')}<span>Calendario</span></button>`}"
new_nav = "function navHtml(){return `<button onclick=\"showCoach('dashboard')\">${icon('panel')}<span>Panel</span></button><button onclick=\"showCoach('clients')\">${icon('clients')}<span>Clientes</span></button><button onclick=\"showCoach('calendar')\">${icon('calendar')}<span>Calendario</span></button><button onclick=\"showCoach('checkins')\">${icon('check')}<span>Check-in</span></button><button onclick=\"showCoach('messages')\">${icon('msg')}<span>Mensajes</span></button>`}"
old_enforce = "function enforceNav(){const n=document.getElementById('coach-nav');if(!n)return;const wanted=['Panel','Clientes','Calendario'],labels=[...n.querySelectorAll('button span')].map(x=>x.textContent.trim());if(labels.length!==3||wanted.some((x,i)=>labels[i]!==x))n.innerHTML=navHtml();n.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important')}"
new_enforce = "function enforceNav(){const n=document.getElementById('coach-nav');if(!n)return;const wanted=['Panel','Clientes','Calendario','Check-in','Mensajes'],labels=[...n.querySelectorAll('button span')].map(x=>x.textContent.trim());if(labels.length!==5||wanted.some((x,i)=>labels[i]!==x))n.innerHTML=navHtml();n.style.setProperty('grid-template-columns','repeat(5,minmax(0,1fr))','important')}"
old_active = "function active(screen){const n=document.getElementById('coach-nav');if(!n)return;const map={dashboard:0,clients:1,calendar:2,checkins:1,messages:1};n.querySelectorAll('button').forEach(x=>x.classList.remove('active'));const i=map[screen];if(i!==undefined)n.querySelectorAll('button')[i]?.classList.add('active')}"
new_active = "function active(screen){const n=document.getElementById('coach-nav');if(!n)return;const map={dashboard:0,clients:1,calendar:2,checkins:3,messages:4};n.querySelectorAll('button').forEach(x=>x.classList.remove('active'));const i=map[screen];if(i!==undefined)n.querySelectorAll('button')[i]?.classList.add('active')}"
for old, new, label in [(old_nav,new_nav,'navHtml'),(old_enforce,new_enforce,'enforceNav'),(old_active,new_active,'active')]:
    if old not in s:
        raise SystemExit(f'Missing expected block: {label}')
    s = s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
print('Coach nav restored to five tabs')
