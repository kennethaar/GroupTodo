/* mailto: carries to, subject and body and nothing else, so the file is
   attached by hand either way. Teams takes a chat deep link with the message
   pre-typed; same bargain, the file goes in the same window. The Teams
   message is the update mail's lines with no links (#352): they reply in
   the chat, and you bring it back with Paste a reply.
   sheetOf(items): the sheet's HTML for these lines. It is made on the way out,
   from the note as it then reads, and saved again only when the note changed.
   sent(edited, then): marks the lines asked, once, the first time the note
   goes, and offers what you reworded back to the tasks; then() carries on. */
function openAskNote(name, items, file, sheetOf = null, area = Spaces.active || "", next = null, sent = null) {
  const note = askNote(name, items, file);
  const saved = emailOf(name, area);
  const to = el("input", {type: "email", placeholder: "them@example.com", value: saved});
  const box = el("textarea", {rows: 16, style: "font-size:12.5px;line-height:1.5"});
  box.value = note.subject + "\n\n" + note.body;

  // Typed here once, kept on their page in this area for the next ask.
  const remember = () => setEmailOf(name, area, to.value);
  const bodyNow = () => box.value.split("\n").slice(2).join("\n");
  const subjNow = () => box.value.split("\n")[0];
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
    once(askItemsEdited(items, bodyNow(), name), next ? () => next.run() : null);
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

  modal({
    center: true, title: "Send it to " + name,
    hint: file,
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "Their address in " + (area || "this area") + ", for the email and the Teams chat"),
        to,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          saved ? "From email:: on " + name + "'s page in " + area + "."
                : "Not on " + name + "'s page in " + (area || "this area") + " yet. It is saved there " +
                  "as email:: when you send, so you only type it once.")),
      el("div", {class: "field"},
        el("label", {}, "The note (first line is the subject). Edit it freely."),
        box,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          (file ? "You attach " + file + " yourself: no link of any kind can do that for you. It is made " +
                  "from the note as it reads when you send it. " : "") +
          "Copy and open email puts the update mail on your clipboard, numbered, with a link on each line " +
          "that opens a short reply to you, and opens a new mail to paste it into. Send in Teams sends the same " +
          "lines without links: they reply in the chat. The note here is the plain " +
          "text, for Copy text and Plain-text mail. Reword a question or a line and you are asked, " +
          "once it is sent, whether the task should say the same."),
        /* Where the file went, and a way to get it back. A browser puts it
           wherever it puts downloads and says so in its own bar, which is gone
           by the time you are writing the note. */
        sheetOf ? el("div", {style: "margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
          el("button", {class: "btn sm ghost", onclick: () => notify(saveSheet(true))}, "Save the file"),
          el("span", {style: "color:var(--fg3);font-size:12px"},
            "Saves it to your downloads folder now, as the note reads.")) : null),
      el("div", {class: "field"},
        el("label", {}, "Language"),
        el("div", {class: "statefilter"},
          ...[...Object.entries(ASK_NOTE).map(([code, t]) => [code, t.label]), ["own", "Personalize text"]].map(([code, label]) => {
            const on = (askOwn() ? "own" : askLang()) === code;
            return el("button", {class: "chip filter" + (on ? " on" : ""),
              onclick: () => {
                remember();
                // Personalized text starts from the language you had, until you edit it.
                if (code === "own" && !askOwn()) PREF.set("askLangBase", askLang());
                PREF.set("askLang", code);
                closeModal(); openAskNote(name, items, file, sheetOf, area, next, sent);
              }}, on ? [svgIcon(ICON_CHECK), " " + label] : label);
          })),
        askOwn() ? el("div", {style: "margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
          el("button", {class: "btn sm ghost", onclick: () => { remember(); closeModal(); openPage(ensureAskOwn()); }},
            "Edit the text"),
          el("span", {style: "color:var(--fg3);font-size:12px"},
            "Update note in Settings" + (V.pages.has(ASK_OWN_PATH) ? "." : ", the standard text until you edit it."))) : null)),
    foot: [
      next ? el("button", {class: "btn ghost", onclick: () => { remember(); closeModal(); next.run(); }}, next.label)
           : el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
      el("button", {class: "btn ghost", onclick: () => {
        const said = saveSheet();
        copyText(box.value, said + "Note copied. Paste it wherever you like.");
        going();
      }}, "Copy text"),
      el("button", {class: "btn ghost", onclick: () => {
        remember();
        const addr = trim(to.value);
        if (!addr) { notify("Put their address in first - Teams needs it to open the chat.", "warn"); return; }
        const said = saveSheet();
        openTeamsChat([addr], mailNow().teams);
        notify(said + (file ? "Teams opens with the message ready. If the box is empty, press Ctrl+V. Drop " + file + " into the same window. " : "Teams opens with the message ready. If the box is empty, press Ctrl+V. Then press Send. ") +
          TEAMS_REPLY_SAID);
        going();
      }}, "Send in Teams"),
      el("button", {class: "btn ghost", onclick: () => {
        remember();
        const url = "mailto:" + encodeURIComponent(trim(to.value)) +
          "?subject=" + encodeURIComponent(subjNow()) +
          "&body=" + encodeURIComponent(bodyNow());
        if (url.length > 1800) {
          notify("That note is too long for an email link. Use Copy and paste it instead.", "warn");
          return;
        }
        const said = saveSheet();
        // A moment for the download to start: leaving for mailto: at once can cancel it.
        setTimeout(() => { location.href = url; }, said ? 600 : 0);
        notify(said + (file ? "Your email is opening. Attach " + file + ", then send." : "Your email is opening with the note. Press Send."));
        going();
      }}, "Plain-text mail"),
      el("button", {class: "btn primary", onclick: () => {
        remember();
        if (!looksLikeEmail(emailOf(whoAmI(), area))) {
          notify("Put your own email on your page in " + (area || "this area") + " first: the links in the mail reply to it.", "warn");
          return;
        }
        saveSheet();
        copyAndOpenMail(mailNow(), to.value, going);
      }}, "Copy and open email"),
    ],
  });
}
