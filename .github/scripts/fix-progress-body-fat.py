from pathlib import Path

path=Path("index.html")
text=path.read_text(encoding="utf-8")

old='''  const currentBodyFat =
    c.bodyFat != null
      ? Number(c.bodyFat)
      : null;
'''

new='''  const progressCheckin =
    data.checkins?.[c.id] || {};

  const currentBodyFat =
    progressCheckin.bodyFat !== undefined &&
    progressCheckin.bodyFat !== null &&
    progressCheckin.bodyFat !== ""
      ? Number(progressCheckin.bodyFat)
      : null;
'''

if new in text:
    print("Progress body-fat source already fixed")
elif old in text:
    if text.count(old) != 1:
        raise RuntimeError(f"Expected one progress body-fat block, found {text.count(old)}")
    text=text.replace(old,new,1)
    path.write_text(text,encoding="utf-8")
    print("Progress body-fat source fixed")
else:
    raise RuntimeError("Progress body-fat block not found")
