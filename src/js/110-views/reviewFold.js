function reviewFold(key, attrs, head, ...body) {
  return el("details", Object.assign({class: "rgroup", open: reviewOpened().has(key) || null,
    ontoggle: e => {
      const s = reviewOpened();
      if (e.currentTarget.open) s.add(key); else s.delete(key);
      PREF.set("review.open", [...s].join("\n"));
    }}, attrs), el("summary", {class: "group"}, ...head), ...body);
}
