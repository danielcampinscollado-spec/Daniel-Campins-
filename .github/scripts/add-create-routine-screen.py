from pathlib import Path

path=Path("index.html")
text=path.read_text(encoding="utf-8")

# Add a real plus icon to navButton's SVG dictionary.
icon_anchor='''"◌":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
<circle cx="12" cy="12" r="8"/>
<circle cx="12" cy="12" r="3"/>
</svg>`'''

icon_replacement='''"◌":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
<circle cx="12" cy="12" r="8"/>
<circle cx="12" cy="12" r="3"/>
</svg>`,

"＋":`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
<circle cx="12" cy="12" r="8.5"/>
<path d="M12 8v8M8 12h8"/>
</svg>`'''

if icon_replacement not in text:
    if text.count(icon_anchor) != 1:
        raise RuntimeError(f"Plus icon anchor count: {text.count(icon_anchor)}")
    text=text.replace(icon_anchor,icon_replacement,1)

screen_anchor='''if(screen==="clients"){
html=`'''

screen_block='''if(screen==="createRoutine"){

  const routineClients = data.clients || [];

  html=`

    <div style="padding:4px 4px 120px;">

      <div style="margin-bottom:24px;">

        <div style="
          color:#d9aa4a;
          font-size:12px;
          font-weight:700;
          letter-spacing:2px;
          margin-bottom:9px;
        ">
          CREAR RUTINA
        </div>

        <h1 style="margin:0;">
          Nueva rutina
        </h1>

        <p class="muted" style="margin:9px 0 0;">
          Selecciona el cliente para crear su nueva rutina de entrenamiento.
        </p>

      </div>

      <div class="card" style="padding:16px;">

        ${
          routineClients.length
          ? routineClients.map(clientItem=>{

              const currentRoutine =
                Array.isArray(data.routines?.[clientItem.id])
                  ? data.routines[clientItem.id]
                  : [];

              const initials =
                String(clientItem.name || "")
                  .split(" ")
                  .map(part=>part[0])
                  .join("")
                  .slice(0,2)
                  .toUpperCase();

              return `

                <button
                  type="button"
                  onclick="
                    window.selectedClient='${clientItem.id}';
                    startNewRoutine('${clientItem.id}');
                  "
                  style="
                    width:100%;
                    display:flex;
                    align-items:center;
                    gap:13px;
                    margin:0 0 10px;
                    padding:14px;
                    border:1px solid rgba(255,255,255,.10);
                    border-radius:15px;
                    background:rgba(255,255,255,.025);
                    color:#f5f5f2;
                    text-align:left;
                    cursor:pointer;
                  "
                >

                  <span style="
                    width:44px;
                    height:44px;
                    flex:none;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    border:1px solid rgba(217,170,74,.35);
                    border-radius:50%;
                    color:#f0c96b;
                    font-size:13px;
                    font-weight:800;
                  ">
                    ${esc(initials)}
                  </span>

                  <span style="flex:1;min-width:0;">

                    <b style="display:block;font-size:16px;">
                      ${esc(clientItem.name)}
                    </b>

                    <span class="muted" style="
                      display:block;
                      margin-top:4px;
                      font-size:12px;
                    ">
                      ${
                        currentRoutine.length
                          ? `${currentRoutine.length} días · la rutina actual se guardará como anterior`
                          : "Sin rutina actual"
                      }
                    </span>

                  </span>

                  <span style="
                    flex:none;
                    color:#d9aa4a;
                    font-size:24px;
                  ">
                    ›
                  </span>

                </button>

              `;

            }).join("")
          : `
              <div class="empty">
                Primero necesitas crear un cliente.
              </div>
            `
        }

      </div>

    </div>

  `;
}

'''

if 'if(screen==="createRoutine"){' not in text:
    if text.count(screen_anchor) != 1:
        raise RuntimeError(f"Create-routine screen anchor count: {text.count(screen_anchor)}")
    text=text.replace(screen_anchor,screen_block+screen_anchor,1)

path.write_text(text,encoding="utf-8")
print("Create-routine coach screen added")
