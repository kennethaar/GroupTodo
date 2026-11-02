const helpKeys = keys => el("table", {class: "helpkeys"},
  ...keys.map(([k, what]) => el("tr", {}, el("td", {}, ...k.split(" ").map((x, i) => [i ? " " : null, el("kbd", {}, x)])), el("td", {}, what))));
const helpCode = rows => el("table", {class: "helpkeys"},
  ...rows.map(([code, what]) => el("tr", {}, el("td", {}, el("code", {}, code)), el("td", {}, what))));
const helpLink = (id, read) => el("button", {class: "textbtn", onclick: () => read(id)}, helpTitle(id));
const helpTitle = id => HELP[id] ? HELP[id].title : id;
