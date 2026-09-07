from pathlib import Path

path = Path("index.html")
text = path.read_text(encoding="utf-8")

old = '''  const checkinSentThisWeek =
    checkin.weekKey &&
    currentWeekKey &&
    checkin.weekKey === currentWeekKey &&
    checkin.sentAt;

  if(!checkinSentThisWeek){'''

new = '''  const weekStart =
    currentWeekKey
      ? new Date(`${currentWeekKey}T00:00:00`)
      : null;

  const serverCheckinSentThisWeek =
    !!(
      checkin.updatedAt &&
      weekStart &&
      new Date(checkin.updatedAt) >= weekStart
    );

  const checkinSentThisWeek =
    !!(
      (
        checkin.weekKey &&
        currentWeekKey &&
        checkin.weekKey === currentWeekKey &&
        checkin.sentAt
      ) ||
      serverCheckinSentThisWeek
    );

  if(!checkinSentThisWeek){'''

if new in text:
    print("Weekly check-in synchronization already applied")
elif old in text:
    text = text.replace(old, new, 1)
    path.write_text(text, encoding="utf-8")
    print("Weekly check-in synchronization applied")
else:
    raise RuntimeError("Expected weekly check-in block not found")
