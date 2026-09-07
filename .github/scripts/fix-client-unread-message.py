from pathlib import Path

path = Path("index.html")
text = path.read_text(encoding="utf-8")

old = '''  const unreadMessages =
    lastMessage &&
    lastMessage[0] !== "Daniel" &&
    (
      !messageSeenAt ||'''

new = '''  const unreadMessages =
    lastMessage &&
    lastMessage[0] === "Daniel" &&
    (
      !messageSeenAt ||'''

if new in text:
    print("Client unread-message condition already fixed")
elif old in text:
    if text.count(old) != 1:
        raise RuntimeError(f"Expected one client unread block, found {text.count(old)}")
    text = text.replace(old, new, 1)
    path.write_text(text, encoding="utf-8")
    print("Client unread-message condition fixed")
else:
    raise RuntimeError("Client unread-message block not found")
