/* A small ⓘ beside a control whose meaning is not on its face: the topic
   that explains it, read beside the view. */
const helpDot = (id, what) => el("button", {class: "helpdot", type: "button", title: what, "aria-label": what,
  onclick: e => { e.stopPropagation(); helpBeside(id); }}, "ⓘ");
