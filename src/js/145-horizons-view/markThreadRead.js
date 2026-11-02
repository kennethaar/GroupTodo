function markThreadRead(block) {
  const set = readSet();
  let hit = false;
  for (const m of messagesOf(block)) if (!set.has(msgKey(m))) { set.add(msgKey(m)); hit = true; }
  if (hit) saveReadSet(set);
}
