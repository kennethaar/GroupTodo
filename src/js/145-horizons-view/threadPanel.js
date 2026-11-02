/* ---------- the thread, as it appears under a task ---------- */
function threadPanel(path, block) {
  const wrap = el("div", {});
  const list = el("div", {class: "thread"});
  const input = el("textarea", {rows: "2", placeholder: "Say something about this\u2026"});

  const draw = () => {
    list.textContent = "";
    const msgs = messagesOf(block);
    if (!msgs.length) {
      list.append(el("div", {class: "empty", style: "font-size:12.5px"},
        "Nothing said yet. Useful for \u201Cdone except the VAT bit\u201D."));
    }
    for (const row of threadRows(msgs)) {
      if (row.sep)     { list.append(el("div", {class: "msg-day"}, el("span", {}, row.sep))); continue; }
      if (row.newHere) { list.append(el("div", {class: "msg-new"}, el("span", {}, "New"))); continue; }
      const m = row.msg;
      const who = msgAuthor(m) || "Someone";
      const mine = samePerson(who, whoAmI());
      const others = msgFlags(m).filter(n => !samePerson(n, whoAmI()));
      // The name sits above the bubble, not inside it: a bubble holds what was
      // said, and mixing the speaker into it makes both harder to scan.
      const node = el("div", {class: "msg" + (mine ? " mine" : "") + (row.grouped ? " cont" : "")},
        // The spacer has to be the SAME size as a face, or every continuation
        // bubble sits a couple of pixels off from the one above it.
        row.grouped ? el("div", {class: "avatar ghost", style: "width:28px;height:28px"})
                    : avatarNode(who, 28),
        el("div", {class: "msg-main"},
          row.grouped ? null : el("div", {class: "msg-head"},
            el("span", {class: "who"}, mine ? "You" : who),
            el("span", {class: "when"}, chatTime(msgAt(m))),
            !mine && lastSeenOf(who) ? el("span", {class: "seen"}, "\u00B7 seen " + lastSeenOf(who)) : null),
          el("div", {class: "bubble"},
            el("div", {class: "msg-body", translate: "no", html: renderInline(m.title)}),
            el("button", {class: "flagbtn" + (flaggedByMe(m) ? " on" : ""),
              title: flaggedByMe(m) ? "Flagged - click to clear" : "Flag to come back to",
              onclick: () => { toggleMsgFlag(path, m); draw(); }}, "\u2691")),
          others.length ? el("div", {class: "msg-flags"}, "\u2691 " + others.join(", ")) : null));
      list.append(node);
    }
    markThreadRead(block);
    requestAnimationFrame(() => { list.scrollTop = list.scrollHeight; });
  };
  draw();

  /* A comment links the people, projects and organisations it names, the same
     as a line does: picked from the list as you type, or written out in full. */
  const send = () => {
    if (!trim(input.value)) return;
    postMessage(path, block, linkKnownNames(input.value));
    input.value = "";
    draw();
  };
  attachSuggest(input);
  input.addEventListener("keydown", e => {
    if (suggestKey(e)) return;
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); }
  });

  wrap.append(list, el("div", {style: "display:flex;gap:8px;align-items:flex-end;margin-top:8px"},
    input, el("button", {class: "btn sm primary", onclick: send}, "Send")));
  return wrap;
}
