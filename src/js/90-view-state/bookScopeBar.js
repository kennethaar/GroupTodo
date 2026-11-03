function bookScopeBar() {
  if (bookPaths().length < 2) return null;
  const set = k => { PREF.set("book.scope", k); clearMemo(); render(); };
  return el("div", {class: "vseg bookscope", role: "group", "aria-label": "Which books"},
    ...[["book", "This book", "Only " + bookName()], ["all", "All books", "Every book in this area, as one story"]].map(([k, label, title]) =>
      el("button", {"aria-pressed": String(bookScope() === k), title, onclick: () => set(k)}, label)));
}
