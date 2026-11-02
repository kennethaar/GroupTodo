/* Copy and open email: the mail on the clipboard, then a new mail to them
   with the subject in and one line in the body saying where the paste goes,
   above their signature. */
function copyAndOpenMail(mail, to, then) {
  copyRich(mail.html, mail.text).then(ok => {
    if (!ok) { notify("The browser would not copy the mail. Use Copy text instead.", "warn"); return; }
    location.href = "mailto:" + encodeURIComponent(trim(to || "")).replace(/%40/g, "@") +
      "?subject=" + encodeURIComponent(mail.subject) + "&body=" + encodeURIComponent(mailWords().paste + "\r\n\r\n");
    notify("The update is on your clipboard. In the new mail, select the paste line and press Ctrl+V.");
    if (then) then();
  });
}
