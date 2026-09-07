from pathlib import Path

path=Path("index.html")
text=path.read_text(encoding="utf-8")

old='''  const previous=data.previousRoutines?.[id];

  if(!previous?.length){'''

new='''  const previousStored=data.previousRoutines?.[id];

  const previous=
    Array.isArray(previousStored)
      ? previousStored
      : (
          Array.isArray(previousStored?.routine)
            ? previousStored.routine
            : []
        );

  if(!previous.length){'''

if new in text:
    print("Previous-routine compatibility already applied")
elif old in text:
    if text.count(old) != 1:
        raise RuntimeError(f"Expected one active previous-routine block, found {text.count(old)}")
    text=text.replace(old,new,1)
    path.write_text(text,encoding="utf-8")
    print("Previous-routine compatibility applied")
else:
    raise RuntimeError("Active previous-routine block not found")
