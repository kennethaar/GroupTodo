/* The room picked from a list, or a new one; the room the view is narrowed
   to is the one picked to start with. Every chore is at home: a new room is
   made inside @home, as @home is written. */
function choreRoomPick(roomKey) {
  const NEW = "\u0002";
  const rooms = ctxFolderOrder(allContextNames().filter(k => atHome(k) && k.includes("/")));
  const input = el("input", {placeholder: "kitchen", "aria-label": "New room"});
  input.hidden = true;
  const sel = fselect("Room", "", [...rooms.map(k => [k, roomLabel(k)]), ["", "No room"], [NEW, "New room…"]], v => {
    input.hidden = v !== NEW;
    if (!input.hidden) input.focus();
  });
  sel.value = roomKey && rooms.includes(roomKey.slice(1)) ? roomKey.slice(1) : "";
  const ctx = () => {
    const room = sel.value === NEW ? trim(input.value).replace(/^@/, "") : sel.value;
    return ctxSlug(!room ? CHORE_HOME : atHome(room) ? room : CHORE_HOME + "/" + room);
  };
  return {sel, input, ctx, set: c => { if (rooms.includes(c) || c === CHORE_HOME) { sel.value = c === CHORE_HOME ? "" : c; input.hidden = true; } }};
}
