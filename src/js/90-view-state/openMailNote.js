function openMailNote(path, how) {
  const mail = emailPageMail(path);
  const first = mail.name.includes("@") ? "" : mail.name.split(/\s+/)[0];
  const bare = mail.subject.replace(/^(?:(?:re|aw|sv|vs|fw|fwd|wg)\s*:\s*)+/i, "");
  const subject = (how === "forward" ? "Fwd: " : "Re: ") + bare;
  const wrote = "On " + (mail.sent || "an earlier day") + ", " + (mail.name || "you") + " wrote:";
  const quote = lines => lines.map(l => "> " + l).join("\n");
  const hi = "Hi" + (first ? " " + first : "") + ",\n\n";
  const sign = (whoAmI() ? "\n" + whoAmI() : "") + "\n\n";
  const text =
    how === "forward"
      ? "\n\n---------- Forwarded message ----------\nFrom: " + mail.name + (mail.email ? " <" + mail.email + ">" : "") +
        (mail.sent ? "\nDate: " + mail.sent : "") + "\nSubject: " + mail.subject + (mail.to ? "\nTo: " + mail.to : "") +
        "\n\n" + mail.body.join("\n\n")
    : how === "ask"
      ? hi + "Any news on this?\n\nThanks," + sign + wrote + "\n" + quote(mail.body.slice(0, 6))
      : hi + "\n" + sign + wrote + "\n" + quote(mail.body);

  const to = el("input", {type: "email", placeholder: "them@example.com", value: how === "forward" ? "" : mail.email});
  const box = el("textarea", {rows: 14, style: "font-size:12.5px;line-height:1.5"});
  box.value = subject + "\n\n" + text;
  const subjNow = () => box.value.split("\n")[0];
  const bodyNow = () => box.value.split("\n").slice(2).join("\n");
  const title = how === "forward" ? "Forward “" + bare + "”"
              : how === "ask" ? "Ask " + (mail.name || "them") + " for news"
              : "Reply to " + (mail.name || "them");

  modal({
    center: true, title,
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, how === "forward" ? "To" : "Their address"),
        to,
        how !== "forward" && !mail.email
          ? el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
              "The copied email did not carry it. It is saved on the page as email:: when you send, so you only type it once.")
          : null),
      el("div", {class: "field"},
        el("label", {}, "The email (first line is the subject). Edit it freely."),
        box,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "An email link carries only the words: attachments in the first email do not come along."))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
      el("button", {class: "btn ghost", onclick: () => copyText(box.value, "Copied. Paste it wherever you like.")}, "Copy"),
      el("button", {class: "btn primary", onclick: () => {
        const addr = trim(to.value);
        if (how !== "forward" && looksLikeEmail(addr) && addr !== mail.email) {
          const page = getPage(path);
          page.props[EMAIL_PROP] = addr;
          touch(path);
          if (mail.name && !mail.name.includes("@")) setEmailOf(mail.name, Spaces.active || "", addr);
        }
        let url = "mailto:" + encodeURIComponent(addr) + "?subject=" + encodeURIComponent(subjNow()) +
          "&body=" + encodeURIComponent(bodyNow());
        if (url.length > 1800) {
          // Too long for a link: the words go on the clipboard and the mail opens empty.
          url = "mailto:" + encodeURIComponent(addr) + "?subject=" + encodeURIComponent(subjNow());
          copyText(bodyNow(), "Too long for an email link: the text is on your clipboard. Paste it into the email.");
        } else notify("Your email is opening. Check it, then send.");
        closeModal();
        location.href = url;
      }}, "Open in email"),
    ],
  });
}
