/* The note that carries the update, as the note that carries a question:
   their address kept on their page, the language shared with it, and the
   lines marked as told the first time it goes. */
function openInformNote(to, items, opts) {
  const {file, named, area, sheetOf} = opts;
  const name = to.name, me = whoAmI();
  const note = informNote(name, me, items, file, named);
  const saved = to.org ? orgProp(name, EMAIL_PROP) : emailOf(name, area);
  const addr = el("input", {type: "email", placeholder: "them@example.com", value: saved});
  const box = el("textarea", {rows: 16, style: "font-size:12.5px;line-height:1.5"});
  box.value = note.subject + "\n\n" + note.body;
  const remember = () => { if (!to.org) setEmailOf(name, area, addr.value); };
  const bodyNow = () => box.value.split("\n").slice(2).join("\n");
  let made = false;
  const saveSheet = (again = false) => {
    if (!sheetOf || (made && !again)) return "";
    downloadText(file, sheetOf(), "text/html");
    made = true;
    return "Saved " + file + " to your downloads. ";
  };
  const going = () => { if (!opts.sent) return; const once = opts.sent; opts.sent = null; once(); };
  /* The links in the update mail reply to you, so it needs your address: the
     one on your page in this area, asked for here only when there is none. */
  const myOwn = emailOf(me, area);
  const mine = el("input", {type: "email", placeholder: "you@example.com", value: myOwn});
  if (opts.ack == null) opts.ack = true;
  const ackBox = el("button", {class: "spacetoggle" + (opts.ack ? " on" : ""), style: "flex:0 0 auto", onclick: () => {
    opts.ack = !opts.ack;
    ackBox.className = "spacetoggle" + (opts.ack ? " on" : "");
    ackBox.replaceChildren(...(opts.ack ? [svgIcon(ICON_CHECK)] : []));
  }}, opts.ack ? svgIcon(ICON_CHECK) : null);
  const mailNow = () => {
    const t = informWords();
    return updateMail({mode: "inform", them: name, subject: box.value.split("\n")[0], replyTo: trim(mine.value),
      greet: bodyNow().split("\n")[0], ack: opts.ack,
      items: items.map(it => ({ref: it.ref, t: it.t, word: informWordOf(it, t), color: MAIL_COLOR[it.core] || MAIL_COLOR.TODO,
        struck: it.core === "CANCELLED", comment: it.comment,
        // What it is under, a responsibility or the project you chose to name.
        meta: it.head && it.head !== "\u0001other" ? it.head : named ? it.project || "" : "",
        context: (it.context || []).map(c => ({depth: c.depth, text: informLineText(c, t)}))}))});
  };
  modal({
    center: true, title: "Send it to " + name,
    hint: file || "",
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "Their address" + (to.org ? "" : " in " + (area || "this area"))),
        addr,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          saved ? "From email:: on " + name + "'s page."
                : to.org ? "No email:: on " + name + "'s page. Type one here, or put it on the page."
                         : "Not on " + name + "'s page yet. It is saved there as email:: when you send.")),
      myOwn ? null : el("div", {class: "field"},
        el("label", {}, "Your email in " + (area || "this area") + ", where their replies come back to"),
        mine,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "Not on your page yet. It is saved there as email:: when you send, so you are only asked once.")),
      el("div", {class: "field"},
        el("div", {style: "display:flex;gap:10px;align-items:center"}, ackBox,
          el("span", {}, "Ask them to confirm, with a Got it button in the email"))),
      el("div", {class: "field"},
        el("label", {}, "The note (first line is the subject). Edit it freely."),
        box,
        sheetOf ? el("div", {style: "margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
          el("button", {class: "btn sm ghost", onclick: () => notify(saveSheet(true))}, "Save the file"),
          el("span", {style: "color:var(--fg3);font-size:12px"},
            "You attach " + file + " yourself. It is saved to your downloads when you send.")) : null),
      el("div", {class: "field"},
        el("label", {}, "Language"),
        el("div", {class: "statefilter"},
          ...[...Object.entries(ASK_NOTE).map(([code, t]) => [code, t.label]), ["own", "Personalize text"]].map(([code, label]) => {
            const on = (askOwn() ? "own" : askLang()) === code;
            return el("button", {class: "chip filter" + (on ? " on" : ""),
              onclick: () => {
                remember();
                if (code === "own" && !askOwn()) PREF.set("askLangBase", askLang());
                PREF.set("askLang", code);
                closeModal(); openInformNote(to, items, opts);
              }}, (on ? "✓ " : "") + label);
          })),
        askOwn() ? el("div", {style: "margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
          el("button", {class: "btn sm ghost", onclick: () => { remember(); closeModal(); openPage(ensureInformOwn()); }},
            "Edit the text"),
          el("span", {style: "color:var(--fg3);font-size:12px"},
            "Inform note in Settings" + (V.pages.has(INFORM_OWN_PATH) ? "." : ", the standard text until you edit it."))) : null)),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
      el("button", {class: "btn ghost", onclick: () => {
        const said = saveSheet();
        copyText(box.value, said + "Note copied. Paste it wherever you like.");
        going();
      }}, "Copy text"),
      el("button", {class: "btn ghost", onclick: () => {
        remember();
        const a = trim(addr.value);
        if (!a) { notify("Put their address in first - Teams needs it to open the chat.", "warn"); return; }
        const said = saveSheet();
        window.open("https://teams.microsoft.com/l/chat/0/0?users=" + encodeURIComponent(a) +
          "&message=" + encodeURIComponent(mailNow().teams), "_blank", "noopener");
        notify(said + (file ? "Teams opens with the message ready. Drop " + file + " into the same window. " : "Teams opens with the message ready. Press Send. ") +
          TEAMS_REPLY_SAID);
        going();
      }}, "Send in Teams"),
      el("button", {class: "btn ghost", onclick: () => {
        remember();
        const url = "mailto:" + encodeURIComponent(trim(addr.value)) +
          "?subject=" + encodeURIComponent(box.value.split("\n")[0]) +
          "&body=" + encodeURIComponent(bodyNow());
        if (url.length > 1800) {
          notify("That note is too long for an email link. Use Copy text and paste it instead.", "warn");
          return;
        }
        const said = saveSheet();
        setTimeout(() => { location.href = url; }, said ? 600 : 0);
        notify(said + (file ? "Your email is opening. Attach " + file + ", then send." : "Your email is opening with the note. Press Send."));
        going();
      }}, "Plain-text mail"),
      el("button", {class: "btn primary", onclick: () => {
        remember();
        if (!looksLikeEmail(trim(mine.value))) {
          notify("Put your own email in first: the links in the mail reply to it.", "warn");
          mine.focus();
          return;
        }
        setEmailOf(me, area, trim(mine.value));
        saveSheet();
        copyAndOpenMail(mailNow(), addr.value, going);
      }}, "Copy and open email"),
    ],
  });
}
