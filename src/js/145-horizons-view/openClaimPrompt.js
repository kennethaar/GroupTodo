function openClaimPrompt(items, me) {
  const picked = new Set(items.map((_, i) => i));
  const card = el("div", {class: "card"});
  items.forEach((it, i) => {
    const box = el("button", {class: "spacetoggle on", onclick: () => {
      if (picked.has(i)) { picked.delete(i); box.classList.remove("on"); box.textContent = ""; }
      else { picked.add(i); box.classList.add("on"); box.textContent = "\u2713"; }
    }}, "\u2713");
    card.append(el("div", {class: "dash-item", style: "cursor:default;gap:10px"},
      box,
      el("span", {style: "flex:1"}, it.block.title),
      el("span", {class: "chip"}, (it.by ? it.by : "somebody") + " \u2192 " + it.named)));
  });

  nudgeToast({
    center: true,
    title: items.length === 1 ? "Somebody is waiting on you" : items.length + " things are waiting on you",
    hint: "written before you joined",
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "font-size:13.5px"},
          "These were put down with your name on them while you were not here yet, so " +
          "they count as something your colleagues are waiting for. Take them on and they " +
          "become your tasks."),
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "They stay in your colleagues' Waiting for either way - they wrote them, " +
          "so they keep watching them.")),
      el("div", {class: "field"}, card)),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Not mine"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => {
        const take = items.filter((_, i) => picked.has(i));
        closeModal();
        if (take.length) claimThese(take, me);
      }}, "Take them on"),
    ],
  });
}
