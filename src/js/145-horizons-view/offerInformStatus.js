function offerInformStatus(changes) {
  const word = v => informStatusWord(v, Object.fromEntries(INFORM_STATES)) || "No status";
  modal({
    center: true, title: "Change the tasks too?",
    hint: changes.length + (changes.length === 1 ? " status" : " statuses") + " changed in the update",
    body: el("div", {class: "field"},
      ...changes.map(({r, to}) => el("div", {style: "margin:6px 0"},
        el("div", {}, plainTitle(r.a.title)),
        el("div", {style: "color:var(--fg3);font-size:12.5px"}, word(r.was) + " → " + word(to))))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Keep the tasks as they are"),
      el("button", {class: "btn primary", onclick: () => {
        closeModal();
        for (const {r, to} of changes) inSpace(r.a.space, () => {
          const ts = taskStage(r.a.block);
          if (to[0] === "\u0001" && ts) setTaskStage(r.a.path, r.a.block, ts.list, to.slice(1));
          else setBlockState(r.a.path, r.a.block, to);
        });
        noteTodoTouched();
        render();
      }}, "Change them"),
    ],
  });
}
