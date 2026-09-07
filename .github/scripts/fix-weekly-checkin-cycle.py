from pathlib import Path
import re

path=Path("index.html")
text=path.read_text(encoding="utf-8")
original=text

# 1) Load the dedicated server send timestamp.
text=text.replace(
    '.select("client_id,weight,diet,training,comment,reviewed,body_fat,updated_at");',
    '.select("client_id,weight,diet,training,comment,reviewed,body_fat,sent_at,updated_at");',
    1
)

text=text.replace(
    '        updatedAt:row.updated_at || previous.updatedAt || null\n',
    '        sentAt:row.sent_at || previous.sentAt || null,\n        updatedAt:row.updated_at || previous.updatedAt || null\n',
    1
)

# 2) Weekly home status must use sent_at, never review/update timestamps.
old_status='''  const serverCheckinSentThisWeek =
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
    );'''

new_status='''  const checkinSentThisWeek =
    !!(
      checkin.sentAt &&
      weekStart &&
      new Date(checkin.sentAt) >= weekStart
    );'''

if old_status in text:
    text=text.replace(old_status,new_status,1)
elif new_status not in text:
    raise RuntimeError("Weekly home status block not found")

# 3) Replace the old unused/local-only reset logic with a stable per-week preparation.
new_reset='''function resetWeeklyCheckinIfNeeded(){

  if(!data.checkins) return;

  const checkin=data.checkins[currentClientId];

  if(!checkin) return;

  const weekKey=getCurrentWeekKey();
  const weekStart=new Date(`${weekKey}T00:00:00`);

  const sentThisWeek=
    !!(
      checkin.sentAt &&
      new Date(checkin.sentAt) >= weekStart
    );

  if(sentThisWeek) return;

  if(checkin.preparedWeekKey===weekKey) return;

  checkin.diet="";
  checkin.training="";
  checkin.comment="";
  checkin.reviewed=false;
  checkin.preparedWeekKey=weekKey;

  saveData();
}
'''

pattern=r'function resetWeeklyCheckinIfNeeded\(\)\{.*?\n\}\nfunction loadData\(\)\{'
if new_reset not in text:
    text,count=re.subn(pattern,new_reset+'function loadData(){',text,count=1,flags=re.S)
    if count!=1:
        raise RuntimeError(f"Weekly reset function replacement count: {count}")

# 4) Prepare the new week's form before rendering it.
checkin_anchor='''if(screen==="checkin"){

const x=data.checkins[c.id]||{'''
checkin_replacement='''if(screen==="checkin"){

resetWeeklyCheckinIfNeeded();

const x=data.checkins[c.id]||{'''
if checkin_replacement not in text:
    if text.count(checkin_anchor)!=1:
        raise RuntimeError(f"Check-in screen anchor count: {text.count(checkin_anchor)}")
    text=text.replace(checkin_anchor,checkin_replacement,1)

# 5) Persist the dedicated send timestamp in Supabase.
upsert_anchor='''                body_fat:
                  checkin.bodyFat !== undefined &&
                  checkin.bodyFat !== null &&
                  checkin.bodyFat !== ""
                    ? Number(checkin.bodyFat)
                    : null,
                reviewed: false,
                updated_at: new Date().toISOString()'''
upsert_replacement='''                body_fat:
                  checkin.bodyFat !== undefined &&
                  checkin.bodyFat !== null &&
                  checkin.bodyFat !== ""
                    ? Number(checkin.bodyFat)
                    : null,
                sent_at: checkin.sentAt,
                reviewed: false,
                updated_at: checkin.sentAt'''
if upsert_replacement not in text:
    if text.count(upsert_anchor)!=1:
        raise RuntimeError(f"Check-in upsert anchor count: {text.count(upsert_anchor)}")
    text=text.replace(upsert_anchor,upsert_replacement,1)

# 6) Keep a typed comment when an option click causes a rerender.
select_anchor='''  data.checkins[currentClientId][type] = option;

  data.checkins[currentClientId].reviewed = false;'''
select_replacement='''  const commentBox=document.getElementById("checkin-comment");

  if(commentBox){
    data.checkins[currentClientId].comment=commentBox.value;
  }

  data.checkins[currentClientId][type] = option;

  data.checkins[currentClientId].reviewed = false;'''
if select_replacement not in text:
    if text.count(select_anchor)!=1:
        raise RuntimeError(f"Check-in option anchor count: {text.count(select_anchor)}")
    text=text.replace(select_anchor,select_replacement,1)

# 7) Refill the comment after the option-triggered rerender.
textarea_anchor='''  style="resize:none"
></textarea>'''
textarea_replacement='''  style="resize:none"
>${esc(x.comment || "")}</textarea>'''
if textarea_replacement not in text:
    if text.count(textarea_anchor)!=1:
        raise RuntimeError(f"Check-in textarea anchor count: {text.count(textarea_anchor)}")
    text=text.replace(textarea_anchor,textarea_replacement,1)

if text==original:
    raise RuntimeError("No changes made")

path.write_text(text,encoding="utf-8")
print("Weekly check-in cycle fixed")
