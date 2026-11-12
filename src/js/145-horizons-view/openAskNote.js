/* mailto: carries to, subject and body and nothing else, so the file is
   attached by hand either way. Teams takes a chat deep link with the message
   pre-typed; same bargain, the file goes in the same window. The Teams
   message is the update mail's lines with no links (#352): they reply in
   the chat, and you bring it back with Paste a reply.
   The dialog reads as the message it sends (#372): who it goes to under the
   title, the language beside it, the subject and the message, and the
   references that bring their answer home kept out of what you edit.
   sheetOf(items): the sheet's HTML for these lines. It is made on the way out,
   from the note as it then reads, and saved again only when the note changed.
   sent(edited, then, take): marks the lines asked, once, the first time the
   note goes; take says your rewording goes back to the tasks. */
function openAskNote(name, items, file, sheetOf = null, area = Spaces.active || "", next = null, sent = null, back = null) {
  const note = askNote(name, items, file);
  const saved = emailOf(name, area);
  const to = el("input", {type: "email", placeholder: "them@example.com", value: saved,
    "aria-label": "Their address in " + (area || "this area")});
  const subject = el("input", {value: note.subject});
  const split = askNoteSplit(note.body);
  const box = el("textarea", {rows: 12, "aria-label": "Message"});
  box.value = split.text;
  const refs = [...split.refs.values()].map(l => trim(l.replace(/^[^:]*:\s*/, "")));

  // Typed here once, kept on their page in this area for the next ask.
  const remember = () => setEmailOf(name, area, to.value);
  const bodyNow = () => askNoteJoin(box.value, split.refs);
  const subjNow = () => trim(subject.value);
  /* Rewording the message offers, ticked, to say the same on the tasks; it is
     there only once you have changed something. */
  const keep = el("input", {type: "checkbox", checked: true});
  const keepRow = el("label", {class: "askkeep field"}, keep, "Update the task text with my edits");
  const keepAt = el("div", {});
  const edited = () => box.value !== split.text;
  box.addEventListener("input", () => keepAt.replaceChildren(...(edited() ? [keepRow] : [])));
  let savedFrom = null;
  const saveSheet = (again = false) => {
    if (!sheetOf) return "";
    const edited = askItemsEdited(items, bodyNow(), name), key = JSON.stringify(edited);
    if (!again && key === savedFrom) return "";
    downloadText(file, sheetOf(edited), "text/html");
    savedFrom = key;
    return "Saved " + file + " to your downloads. ";
  };
  const going = () => {
    if (!sent) return;
    const once = sent;
    sent = null;
    once(askItemsEdited(items, bodyNow(), name), next ? () => next.run() : null, edited() && keep.checked);
  };
  // The update mail, from the lines as the note now has them, a reworded one included.
  const mailNow = () => {
    const w = mailWords();
    return updateMail({mode: "ask", them: name, subject: subjNow(), replyTo: emailOf(whoAmI(), area),
      greet: bodyNow().split("\n")[0],
      items: askItemsEdited(items, bodyNow(), name).map(it => {
        const parts = String(it.key || "").split("\u0001"), ref = (parts[0] || Spaces.active || "") + "-" + (parts[2] || "");
        const context = it.edit ? it.edit.c : it.context || [];
        if (it.q) {
          const q = it.edit ? {subject: it.edit.s, ask: it.edit.t} : askQuestionParts(it, name);
          return {ref, kind: "question", t: q.ask || q.subject, about: q.ask ? q.subject : "", word: w.question,
            color: MAIL_COLOR.question, context};
        }
        const project = trim(it.project || "");
        const t = it.edit ? trim(it.edit.t.replace(new RegExp("\\s*\\(" + askEsc(project) + "\\)\\s*$"), "")) : askLineTitle(it, name);
        return {ref, kind: "wait", t, word: w.waitingFor, color: MAIL_COLOR.wait, context, about: project,
          meta: it.days ? w.open(it.days) : ""};
      })});
  };
  const reopen = () => { remember(); closeModal(); openAskNote(name, items, file, sheetOf, area, next, sent, back); };

  /* Who it goes to, said under the title. The address is a field only when
     there is none yet, or you press Edit. */
  const toField = el("div", {class: "field", hidden: !!saved},
    el("label", {}, "Their address in " + (area || "this area") + ", for the email and the Teams chat"),
    to,
    el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
      saved ? "Saved on " + name + "'s page in " + area + " as email::."
            : "Saved on " + name + "'s page in " + (area || "this area") + " as email:: when you send, so you type it once."));
  const toSays = el("span", {}, "To: " + (saved || "no address yet"));
  const sub = el("span", {}, toSays,
    saved ? el("button", {class: "textbtn", onclick: e => { e.currentTarget.remove(); toField.hidden = false; to.focus(); }}, "Edit") : null);
  to.addEventListener("input", () => { toSays.textContent = "To: " + (trim(to.value) || "no address yet"); });

  // The language, and your own words, are one choice by the title.
  const lang = el("select", {"aria-label": "Language", onchange: () => {
    // Personalized text starts from the language you had, until you edit it.
    if (lang.value === "own" && !askOwn()) PREF.set("askLangBase", askLang());
    PREF.set("askLang", lang.value);
    reopen();
  }}, ...[...Object.entries(ASK_NOTE).map(([code, t]) => [code, t.label]), ["own", "Personalize text"]]
    .map(([code, label]) => el("option", {value: code}, label)));
  lang.value = askOwn() ? "own" : askLang();

  const track = refs.length ? el("div", {class: "asktrack"},
    el("span", {class: "ico", "aria-hidden": "true", html: SVG("icon-lock")}),
    el("span", {}, "Reply tracking ID" + (refs.length === 1 ? ":" : "s:")),
    ...refs.map(r => el("code", {}, r)),
    el("span", {class: "auto"}, "Appended automatically")) : null;

  const sendMail = () => {
    remember();
    /* With your address, the update mail: a link on each line that answers it.
       Without, the plain note, which they answer under each line. */
    if (looksLikeEmail(emailOf(whoAmI(), area))) {
      saveSheet();
      copyAndOpenMail(mailNow(), to.value, going);
      return;
    }
    const url = "mailto:" + encodeURIComponent(trim(to.value)) +
      "?subject=" + encodeURIComponent(subjNow()) + "&body=" + encodeURIComponent(bodyNow());
    if (url.length > 1800) {
      notify("That note is too long for an email link. Use Copy text and paste it instead.", "warn");
      return;
    }
    const said = saveSheet();
    // A moment for the download to start: leaving for mailto: at once can cancel it.
    setTimeout(() => { location.href = url; }, said ? 600 : 0);
    notify(said + (file ? "Your email is opening. Attach " + file + ", then send." : "Your email is opening with the note. Press Send."));
    going();
  };

  modal({
    center: true, title: "Ask " + name + " for an update",
    hint: file || null, sub, tools: lang,
    body: el("div", {class: "asknote"},
      toField,
      el("div", {class: "field"}, el("label", {}, "Subject", subject)),
      el("div", {class: "field"},
        el("div", {class: "msgrow"}, el("label", {}, "Message"), el("small", {}, "Edit the text freely")),
        box, track,
        askOwn() ? el("div", {style: "margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
          el("span", {style: "color:var(--fg3);font-size:12px"},
            "Your own words, from Update note in Settings" + (V.pages.has(ASK_OWN_PATH) ? "." : ": the standard text until you edit it.")),
          el("button", {class: "btn sm ghost", onclick: () => { remember(); closeModal(); openPage(ensureAskOwn()); }},
            "Edit the text")) : null,
        /* Where the file went, and a way to get it back. A browser puts it
           wherever it puts downloads and says so in its own bar, which is gone
           by the time you are writing the note. */
        sheetOf ? el("div", {style: "margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
          el("button", {class: "btn sm ghost", onclick: () => notify(saveSheet(true))}, "Save the file"),
          el("span", {style: "color:var(--fg3);font-size:12px"},
            "You attach " + file + " yourself. This saves it to your downloads now, as the note reads.")) : null),
      keepAt),
    foot: [
      // Back to the lines, the same ones ticked (#363).
      back ? el("button", {class: "btn ghost", onclick: () => { remember(); closeModal(); back(); }}, "◂ Back") : null,
      next ? el("button", {class: "btn ghost", onclick: () => { remember(); closeModal(); next.run(); }}, next.label)
           : back ? null : el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
      el("button", {class: "btn ghost", title: "The plain note, to paste wherever you like", onclick: () => {
        const said = saveSheet();
        copyText(subjNow() + "\n\n" + bodyNow(), said + "Note copied. Paste it wherever you like.");
        going();
      }}, "Copy text"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", title: "The same lines without links: they reply in the chat", onclick: () => {
        remember();
        const addr = trim(to.value);
        if (!addr) { toField.hidden = false; to.focus(); notify("Put their address in first - Teams needs it to open the chat.", "warn"); return; }
        const said = saveSheet();
        openTeamsChat([addr], mailNow().teams);
        notify(said + (file ? "Teams opens with the message ready. If the box is empty, press Ctrl+V. Drop " + file + " into the same window. " : "Teams opens with the message ready. If the box is empty, press Ctrl+V. Then press Send. ") +
          TEAMS_REPLY_SAID);
        going();
      }}, "Send in Teams"),
      el("button", {class: "btn primary", title: "Puts the mail on your clipboard, with a link on each line that answers it, and opens a new email",
        onclick: sendMail}, "Open in Email"),
    ],
  });
}
