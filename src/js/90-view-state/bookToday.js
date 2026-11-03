function bookToday(book = bookPath()) {
  const key = "book.day." + (V.space || "") + (book === BOOK_PATH ? "" : "\u0000" + book), now = bookTotal(book);
  let day = null;
  try { day = JSON.parse(PREF.get(key, "") || "null"); } catch (_) {}
  if (!day || day.d !== todayISO()) { day = {d: todayISO(), w: now}; PREF.set(key, JSON.stringify(day)); }
  return Math.max(0, now - day.w);
}
