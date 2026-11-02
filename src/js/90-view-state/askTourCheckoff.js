function askTourCheckoff(steps) {
  const list = steps || tourPending();
  if (!list.length) return;
  PREF.set("tour.asked", tourAskKey(list));

  // Every box starts empty: the app knows you went there, not that you are done. (#184)
  const picked = new Set();
  const body = el("div", {},
    el("div", {class: "field"},
      el("div", {style: "color:var(--fg2);font-size:13.5px;line-height:1.55"},
        list.length === 1 ? "You have been to " + tourLabel(list[0].dest) +
          ". Tick the step off if you are done with it - nothing is closed unless you say so."
          : "You have been to " + list.length + " of the places on " + TOUR_TITLE.toLowerCase() +
            ". Tick off the ones you are done with. Nothing is closed unless you say so.")));
  for (const s of list) {
    const row = el("label", {class: "coach-step", style: "cursor:pointer"});
    const box = el("input", {type: "checkbox"});
    box.addEventListener("change", () => {
      if (box.checked) picked.add(s.dest); else picked.delete(s.dest);
      okBtn.disabled = !picked.size;
    });
    row.append(box, el("div", {},
      el("div", {}, tourPlainTitle(s.block.title)),
      el("div", {style: "color:var(--fg3);font-size:12px"}, "you opened " + tourLabel(s.dest))));
    body.append(row);
  }

  const okBtn = el("button", {class: "btn primary", disabled: "", onclick: () => {
        closeModal();
        const chosen = list.filter(s => picked.has(s.dest));
        if (!chosen.length) { render(); return; }
        // The last one closed may finish the project, and that prompt is the
        // ordinary one -- the tour earns its ending the same way any project does.
        for (const s of chosen) setBlockState(s.path, s.block, "DONE");
        notify(chosen.length === 1 ? "Ticked off." : chosen.length + " ticked off.");
      }}, "Tick these off");

  nudgeToast({
    center: true, title: "Tick off what you have done", hint: "your call",
    body,
    foot: [
      el("button", {class: "btn ghost", onclick: () => { closeModal(); render(); }}, "Not yet"),
      el("div", {style: "flex:1"}),
      okBtn,
    ],
  });
}
