/* Hand it to somebody who is not in the space: a name, and nothing more to it,
   because there is nobody on the other end to notify. */
function openAssignOther(path, block) {
  const input = el("input", {placeholder: "Name", value: assigneeOf(block)});
  modal({
    center: true, title: "Waiting on somebody",
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "Who"), input,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "They are not in this area, so this becomes something you are waiting " +
          "for rather than a task anybody here can tick off."))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: () => {
        const name = trim(input.value);
        closeModal();
        if (name) assignBlock(path, block, name);
      }}, "Waiting on them"),
    ],
  });
  setTimeout(() => input.focus(), 30);
}
