function editHorizonText(key, h) {
  const ta = el("textarea", {placeholder: h.ask, style: "min-height:130px"});
  ta.value = getHorizon(key).join("\n");
  modal({
    center: true, title: h.h + " · " + h.name,
    body: el("div", {class: "field"}, el("label", {}, h.ask), ta),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: () => {
             setHorizon(key, ta.value.split("\n")); closeModal(); render();
           }}, "Save")],
  });
}
