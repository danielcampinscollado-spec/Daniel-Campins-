from pathlib import Path

path=Path("index.html")
text=path.read_text(encoding="utf-8")

# Small independent fixes discovered during the same mobile pass.
text=text.replace('document.getElementById("login").style.display="grid";','document.getElementById("login").style.display="flex";')
text=text.replace('l-3.6k 1.8v-7.2z','l-3.6 1.8v-7.2z')

css='''
/* =========================================================
   DCC — NAVEGACIÓN MÓVIL FINAL
   Cliente: 6 accesos · Entrenador: 7 accesos
   ========================================================= */
@media (max-width:700px){
  #client .nav,
  #client-nav{
    display:grid !important;
    grid-template-columns:repeat(6,minmax(0,1fr)) !important;
  }

  #coach .nav,
  #coach-nav{
    display:grid !important;
    grid-template-columns:repeat(7,minmax(0,1fr)) !important;
  }

  #coach .nav button,
  #coach-nav button{
    min-width:0 !important;
    width:100% !important;
    padding-left:0 !important;
    padding-right:0 !important;
  }

  #coach .nav button span,
  #coach-nav button span{
    width:100% !important;
    font-size:7.8px !important;
    line-height:1 !important;
    letter-spacing:-.35px !important;
    white-space:nowrap !important;
    overflow:visible !important;
    text-overflow:clip !important;
  }

  #coach .nav button svg,
  #coach-nav button svg{
    width:20px !important;
    height:20px !important;
    flex-basis:20px !important;
  }
}
'''

if css.strip() not in text:
    marker='</style>'
    if text.count(marker)!=1:
        raise RuntimeError(f"Expected one </style>, found {text.count(marker)}")
    text=text.replace(marker,css+'\n'+marker,1)

path.write_text(text,encoding="utf-8")
print("Coach mobile navigation and small UI fixes applied")
