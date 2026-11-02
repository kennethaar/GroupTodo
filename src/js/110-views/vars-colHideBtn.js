const colHideBtn = (by, key) => el("button", {class: "iconbtn colhide", title: "Hide this column", "aria-label": "Hide this column",
  onclick: e => { e.stopPropagation(); const next = hiddenCols(by); next.add(key); setColsHidden(by, next); }}, "\u00D7");
