/* A small dialog that resolves to whatever finish() is given, or to null when
   it is cancelled or closed. */
function askTransfer(title, body, collect) {
  return new Promise(resolve => {
    let answered = false;
    const finish = value => { if (answered) return; answered = true; closeModal(); resolve(value); };
    modal({
      title, body,
      foot: [
        el("button", {class: "btn ghost", onclick: () => finish(null)}, "Cancel"),
        el("button", {class: "btn primary", onclick: () => finish(collect())}, "Continue"),
      ],
      onClose: () => { if (!answered) { answered = true; resolve(null); } },
    });
  });
}
