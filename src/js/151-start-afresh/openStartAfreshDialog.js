function openStartAfreshDialog() {
  const PHRASE = "start afresh";
  const spaces = (Spaces.list || []).length;
  const folders = (Spaces.list || []).filter(x => x.kind === "fs").length;

  const go = el("button", {class: "btn danger", onclick: () => run()},
    "Empty this browser and reload");
  go.disabled = true;

  const input = el("input", {
    placeholder: PHRASE, autocapitalize: "none", autocorrect: "off", spellcheck: "false",
    oninput: e => { go.disabled = trim(e.target.value).toLowerCase() !== PHRASE; },
  });

  let running = false;
  async function run() {
    if (running || go.disabled) return;
    running = true;
    go.disabled = true;
    go.textContent = "Emptying…";
    WIPING = true;                      // nothing may write after this line
    const notes = await wipeLocalState();
    if (notes.length) {
      WIPING = false;
      running = false;
      go.textContent = "Empty this browser and reload";
      go.disabled = trim(input.value).toLowerCase() !== PHRASE;
      notify(notes.join("; ") + ".", "warn");
      return;
    }
    location.reload();
  }

  modal({
    center: true, title: "Start afresh",
    hint: "cannot be undone",
    body: el("div", {},
      /* Not the .nudge pill: that one is a one-line chip for the nudge bar.
         Same palette, laid out as a paragraph. */
      el("div", {style: "background:rgba(255,107,107,.1);border:1px solid rgba(255,107,107,.32);" +
                        "border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:12.5px;" +
                        "color:var(--late);line-height:1.5"},
        el("div", {style: "font-weight:600"}, "This empties GroupToDo in this browser."),
        el("div", {style: "margin-top:4px;color:var(--fg2)"},
          (spaces === 1 ? "Your area" : "All " + spaces + " areas") + ", every page and journal " +
          "kept here, your name, your colours and timezone, the list of areas, the linked " +
          "vault file and server address, and the offline copy. Then the page reloads and " +
          "GroupToDo starts as it did the very first time.")),
      el("div", {style: "color:var(--fg2);font-size:13px;margin-bottom:10px"},
        "Not touched: the .md files in any vault folder on disk, any vault file you have " +
        "saved or sent, and anything already on a sync server. " +
        (folders
          ? "This browser does forget " + (folders === 1 ? "the folder it was writing into"
              : "the " + folders + " folders it was writing into") + ", so reconnect " +
            (folders === 1 ? "it" : "them") + " in Vault & sync afterwards to get those " +
            "area" + (folders === 1 ? "" : "s") + " back."
          : "If this browser is the only place your work lives, save the vault file first - " +
            "there is no undo and no copy left behind.")),
      el("div", {class: "field"},
        el("label", {}, "Type " + PHRASE + " to confirm"),
        input)),
    foot: [
      el("button", {class: "btn ghost", onclick: () => { closeModal(); openVaultDialog(); }}, "Cancel"),
      el("div", {style: "flex:1"}),
      go,
    ],
  });
  setTimeout(() => input.focus(), 30);
}
