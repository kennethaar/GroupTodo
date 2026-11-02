function wizChips(key, options) {
  const box = el("div", {class: "seg", style: "margin-top:8px"});
  for (const o of options) {
    box.append(el("button", {
      onclick: e => {
        const lines = WIZ[key].split("\n").map(trim).filter(Boolean);
        const i = lines.indexOf(o);
        if (i >= 0) lines.splice(i, 1); else lines.push(o);
        WIZ[key] = lines.join("\n");
        e.target.classList.toggle("on");
        const ta = $(".modal textarea");
        if (ta) ta.value = WIZ[key];
      },
      class: WIZ[key].split("\n").map(trim).includes(o) ? "on" : "",
    }, o));
  }
  return box;
}
