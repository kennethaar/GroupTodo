/* A link pasted on its own onto a line: ask its site for a title, and offer
   it at the end of the line (#404). Only when the setting is on, since the
   link goes to that site; the line keeps the link either way. */
function offerLinkTitle(path, b, raw) {
  const url = trim(raw || "");
  if (PREF.get("linktitles") !== "1" || !/^https?:\/\/\S+$/.test(url)) return;
  if (!LINK_TITLE_SITES.some(([re]) => re.test(url))) return;
  dropLinkTitle();
  const seq = LINK_TITLE.seq;
  linkTitleLookup(url).then(label => {
    if (!label || seq !== LINK_TITLE.seq) return;
    Object.assign(LINK_TITLE, {id: b.id, url, label});
    const line = document.querySelector('.blk[data-id="' + b.id + '"] > .line');
    const chip = line && !line.querySelector(":scope > .linktitle") && linkTitleButton(path, b);
    if (chip) line.querySelector(":scope > .linemenu").before(chip);
    LINK_TITLE.timer = setTimeout(dropLinkTitle, LINK_TITLE_WAIT);
  });
}
