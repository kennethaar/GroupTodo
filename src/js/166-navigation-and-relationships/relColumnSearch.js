/* A search box and a state filter above one column. A parent that does not
   match stays, dimmed, when one of its children does. */
function relColumnSearch(col, key) {
  const input = el("input", {type: "search", placeholder: "Search this column", "aria-label": "Search " + key,
    value: REL_SEARCH[key] || "", oninput: e => { REL_SEARCH[key] = e.target.value; apply(); }});
  const select = el("select", {"aria-label": "Filter " + key,
    onchange: e => { REL_FILTER[key] = e.target.value; apply(); }});
  select.append(el("option", {value: ""}, "All states / types"));
  const values = [...new Set([...col.querySelectorAll("[data-rel-state]")].map(n => n.dataset.relState))].sort();
  for (const v of values) select.append(el("option", {value: v}, STATUS_LABEL[v] || v));
  select.value = REL_FILTER[key] || "";
  const apply = () => {
    const query = (REL_SEARCH[key] || "").toLowerCase(), filter = REL_FILTER[key] || "";
    const matches = card => (!query || card.dataset.relText.includes(query)) &&
                            (!filter || card.dataset.relState === filter);
    const walk = wrapper => {
      const card = wrapper.querySelector(":scope > .bcard");
      if (!card) return false;
      let descendant = false;
      for (const child of wrapper.querySelectorAll(":scope > .rel-children > .rel-card-wrap"))
        descendant = walk(child) || descendant;
      const match = matches(card);
      wrapper.hidden = !(match || descendant);
      card.classList.toggle("rel-ancestor", !match && descendant);
      return match || descendant;
    };
    for (const wrapper of col.querySelectorAll(".bcol-body > .rel-card-wrap")) walk(wrapper);
    for (const card of col.querySelectorAll(".bcol-body > .bcard")) card.hidden = !matches(card);
  };
  col.querySelector(".bcol-head").after(el("div", {class: "rel-search"}, input, select));
  apply();
}
