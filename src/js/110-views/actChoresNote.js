// Chores on track are left out of every pass; this says where they are.
function actChoresNote() {
  const n = actChoresOut();
  return n ? el("p", {class: "solhow actchores"}, n + (n === 1 ? " chore on track is" : " chores on track are") + " left out: ",
    el("button", {class: "textbtn", onclick: () => go("chores")}, "see Chores")) : null;
}
