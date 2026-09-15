from pathlib import Path
import runpy
p=Path('.github/scripts/client_tabs_plan_fix_v42.py')
s=p.read_text()
s=s.replace("r'function trainingPane\\(id\\)\\{.*?\\}function trainingDay'", "r'function trainingPane\\(id\\)\\{.*?\\}\\s*function trainingDay'")
s=s.replace("r'function summaryPane\\(id,cl,m\\)\\{.*?\\}\\nfunction editPane'", "r'function summaryPane\\(id,cl,m\\)\\{.*?\\}\\s*function editPane'")
p.write_text(s)
runpy.run_path(str(p),run_name='__main__')
