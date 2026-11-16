/* A link pasted on its own onto a line: ask its site for a title, and offer
   it under the line, lined up with its words (#404, #415). Only when the
   setting is on, since the link goes to that site; the line keeps the link
   either way. In the line it took room from the words. */
function offerLinkTitle(path, b, raw) {
  const url = trim(raw || "");
  if (PREF.get("linktitles") === "0" ||!/^https?:\/\/\S+$/.test(url)) return;
  if (!LINK_TITLE_SITES.some(([re]) => re.test(url))) return;
  dropLinkTitle();
  const seq = LINK_TITLE.seq;
  linkTitleLookup(url).then(label => {
    if (!label || seq !== LINK_TITLE.seq) return;
    Object.assign(LINK_TITLE, {id: b.id, url, label});
    const line = document.querySelector('.blk[data-id="' + b.id + '"] > .line');
    const chip = line && !line.parentNode.querySelector(":scope > .linktitle") && linkTitleButton(path, b);
    if (chip) {
      line.after(chip);
      const words = line.querySelector(".txt");
      if (words) chip.style.marginLeft = (words.getBoundingClientRect().left - chip.getBoundingClientRect().left) + "px";
    }
    LINK_TITLE.timer = setTimeout(dropLinkTitle, LINK_TITLE_WAIT);
  });
}
