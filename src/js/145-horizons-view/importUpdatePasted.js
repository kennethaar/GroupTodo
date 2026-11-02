/* The reply usually arrives as the body of an email, not as a file: that is the
   whole point of the sheet sending it that way. Making somebody save the mail
   to disk first, so there is a file to import, would undo it. So the ordinary
   route is to select the message, copy it, and drop it in here. */
function importUpdatePasted() {
  const box = el("textarea", {rows: 12, placeholder:
    "Paste their reply here. The whole email is fine, extra lines and all.",
    style: "font-size:12.5px;font-family:var(--mono)"});
  const said = el("div", {style: "color:var(--fg3);font-size:12.5px;margin-top:6px"});
  const check = () => {
    const data = parseUpdateReply(box.value);
    said.textContent = !trim(box.value) ? ""
      : data ? "Found " + data.items.length + " answer" + (data.items.length === 1 ? "" : "s") + "."
             : "No GroupToDo answers in that yet. Paste the whole message, including the " +
               "lines at the bottom that look like machine noise: that is the part that says " +
               "which task is which.";
    said.style.color = data ? "var(--ok)" : "var(--fg3)";
  };
  box.addEventListener("input", check);

  modal({
    center: true, title: "Paste a reply",
    body: el("div", {}, el("div", {class: "field"}, box, said)),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn ghost", onclick: async () => {
        try { box.value = await navigator.clipboard.readText(); check(); }
        catch (_) { notify("This browser would not let the app read the clipboard. Paste into the box.", "warn"); }
      }}, "Paste from clipboard"),
      el("button", {class: "btn primary", onclick: () => {
        const data = parseUpdateReply(box.value);
        if (!data) { notify("No GroupToDo answers in that text.", "error"); return; }
        closeModal();
        openUpdateArrived(data);
      }}, "Read it"),
    ],
  });
  setTimeout(() => box.focus(), 50);
}
