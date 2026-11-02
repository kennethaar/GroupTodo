/* Their answer, pasted in: a dated line on the page with what they wrote
   under it, the quoted mail below their words left out. */
function openMailAnswer(path) {
  const box = el("textarea", {rows: 12, placeholder: "Paste their reply here", style: "font-size:12.5px;line-height:1.5"});
  modal({
    center: true, title: "Add their answer",
    body: el("div", {class: "field"},
      el("label", {}, "Copy the reply out of your mail and paste it here."), box),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: () => {
        const raw = box.value;
        if (!trim(raw)) { closeModal(); return; }
        const mail = parseEmailText(raw);
        const lines = [];
        for (const l of (mail ? mail.body : raw.split(/\r?\n/).map(trim))) {
          if (/^(?:On .+ wrote:|Am .+ schrieb .+:|Den .+ skrev .+:|-{2,}\s*Original Message|From:\s|Von:\s|Fra:\s|Från:\s)/i.test(l)) break;
          if (l.startsWith(">") || !l) continue;
          lines.push(l);
        }
        const when = mail && /^\d{4}-\d{2}-\d{2}$/.test(mail.sent || "") ? mail.sent : todayISO();
        const who = mail && mail.name ? mail.name : mailNameOf(path);
        const blk = newBlock({title: "[[" + when + "]] Answer" + (who ? " from " + who : "")}, false);
        blk.children = lines.map(l => newBlock({title: l}, false));
        getPage(path).blocks.push(blk);
        touch(path);
        closeModal(); render();
        notify("Their answer is on the page.");
      }}, "Add to the page"),
    ],
  });
  setTimeout(() => box.focus(), 0);
}
