function renderInline(text) {
  let h = esc(text || "");
  /* ![name](assets/x.png) and [name](assets/x.pdf) -- the markdown a dropped
     file leaves behind. First, because the target is a path into the folder
     and not a page in the vault, and set aside rather than left in the string:
     the rules below are looking for words, and an anchor they walked into
     would come out with its own href linked all over again. */
  const held = [];
  const hold = html => "\u0000" + (held.push(html) - 1) + "\u0000";
  /* {{embed ...}} and {{query ...}} read as a small label; what they show is
     drawn under the line (liveMacros). ((id)) reads as the line it names.
     Both held first, so the [[link]] inside an embed is not linked twice. */
  h = h.replace(/\{\{\s*(embed|query)\s+([\s\S]*?)\s*\}\}/gi, (all, kind, arg) =>
    hold(macroChipHTML(kind.toLowerCase(), unesc(arg))));
  h = h.replace(/\(\(([A-Za-z0-9_-]{4,64})\)\)/g, (all, id) => {
    const hit = blockById(id);
    return hit ? hold(blockRefHTML(id, hit)) : all;
  });
  h = h.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (all, alt, src) =>
    isAssetPath(src) || /^(blob|data|https?):/.test(src)
      ? hold(`<img class="asset" alt="${alt}" title="${alt}" ${isAssetPath(src) ? `data-asset="${src}"` : `src="${src}"`}>`)
      : all);
  h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (all, label, href) =>
    isAssetPath(href)
      ? hold(`<a class="asset-file" data-asset="${href}" href="#" contenteditable="false" title="Download attachment">\u{1F4CE} ${label}</a>`)
      : /^https?:/.test(href)
        ? hold(`<a class="asset-file" href="${href}" target="_blank" rel="noopener">${label}</a>`)
        : APP_LINK_RE.test(href)
          ? hold(appLinkHTML(href, label))
          : FILE_LINK_RE.test(href)
            ? hold(fileLinkHTML(href, label))
            : all);
  // A mark (#246): its words stay text, for the rules below; its brackets are held.
  h = h.replace(MARK_RE, (all, pre, words, kind) => pre +
    hold(`<span class="mk mk-${kind}" title="${BOOK_MARKS[kind]}">`) + words + hold("</span>"));
  // A price shows that it was read as one, before links are drawn round the words.
  h = h.replace(PRICE_SHOW_RE, all => /^(\[\[|https?:|`)/.test(all) ? all
    : hold(`<span class="price" title="A price: counts toward its project once the task is done">${all}</span>`));
  // file:///... written bare. Up to the first space, so a path with spaces in
  // it is written %20 or inside [name](...).
  h = h.replace(/(^|[\s(])(file:\/\/[^\s<]+)/gi, (all, sp, u) => {
    const tail = (/[.,;:!?)]+$/.exec(u) || [""])[0];
    const addr = tail ? u.slice(0, -tail.length) : u;
    return sp + hold(fileLinkHTML(addr, esc(filePathOf(unesc(addr))))) + tail;
  });
  /* mapto: is an address, and an address has spaces in it, so it runs on to
     the end of the line or to what is plainly something else: a [[link]], a
     #tag, a | or a ;. A full stop or bracket at the end is the sentence's. */
  h = h.replace(/(^|[\s(])mapto:(?:\/\/)?((?:&[a-z0-9#]+;|[^\s<|;\[\]#&\u0000])(?:&[a-z0-9#]+;|[^<|;\[\]#&\n\u0000])*)/gi, (all, sp, place) => {
    const shown = place.replace(/[\s.,:!?)]+$/, "");
    if (!shown) return all;
    return sp + hold(appLinkHTML("mapto:" + shown, "mapto:" + shown)) + place.slice(shown.length);
  });
  /* mailto:, tel:, sms:, geo:, msteams: and teams: written bare in a line. Held
     like the rest, so the #tag and *italic* rules cannot get into an address,
     and a trailing full stop or bracket stays part of the sentence. */
  // A phone number is usually written in groups, so tel: and sms: run on
  // through spaces as long as digits follow.
  h = h.replace(/(^|[\s(])((?:tel|telto|sms):(?:\/\/)?\+?\d[\d\s\-.()]*\d|(?:mailto|tel|telto|sms|geo|msteams|teams):[^\s<]+)/gi, (all, sp, u) => {
    const tail = (/[.,;:!?)]+$/.exec(u) || [""])[0];
    const addr = tail ? u.slice(0, -tail.length) : u;
    if (!/:./.test(addr)) return all;
    return sp + hold(appLinkHTML(addr, addr)) + tail;
  });
  h = h.replace(/\[\[([^\]]+(?:\]\[[^\]]*)?)\]\]/g, (all, t) => {
    // The line was escaped as a whole above, so the link is put back to what
    // was written and escaped once more on the way out -- or an apostrophe in
    // a page name shows as &#39; and the link points at a page that is not there.
    t = unesc(t);
    // [[target][label]], or Obsidian's [[target|label]].
    const pipe = t.includes("][") ? -1 : t.indexOf("|");
    const raw = trim(pipe < 0 ? t.split("][")[0] : t.slice(0, pipe));
    const given = t.includes("][") ? trim(t.split("][")[1]) : pipe < 0 ? null : trim(t.slice(pipe + 1));
    const target = esc(raw);
    const pfx = (/^([^/]+)\//.exec(raw) || [])[1];
    /* [[go/todos]] is not a page but a door into the app itself. That is what
       lets the first project be a tour you click through rather than a leaflet
       about one, and it stays a plain readable line in the markdown. */
    if (pfx === "go") {
      const id = raw.slice(3);
      const shown = esc(given != null ? given : tourLabel(id));
      return `<span class="wikilink go" data-link="${target}">${shown} ↗</span>`;
    }
    const known = pfx === "c" || pfx === "z" || pfx === "p" || pfx === "o" || (pfx && STATUS_DIRS[pfx]);
    let label = given != null ? given : (known || pfx === "m" ? raw.slice(pfx.length + 1) : raw);
    if (pfx === "c") label = "@" + label;
    // An email reads with an envelope, plain black and white, where the m/ was.
    const env = pfx === "m" ? `<span class="mailico" aria-label="Email">✉︎</span>` : "";
    // A person reads with where they work, so two Anna Bergs are never one.
    // Written by an alias it is only the alias, with the whole name on hover.
    let at = "", tip = "";
    const short = given != null && isAliasOf(raw, given);
    if (pfx === "p") {
      const who = raw.slice(2);
      if (given == null) label = personBareName(who);
      const orgs = personOrgs(who).filter(o => !label.toLowerCase().includes(o.toLowerCase()));
      if (short) tip = personNameAt(who);
      else if (orgs.length) at = `<span class="porg"> · ${esc(orgs.join(", "))}</span>`;
    } else if (short) tip = nameByRef(raw)?.title || raw.replace(/^[^/]+\//, "");
    const cls = pfx === "c" ? " ctx" : pfx === "z" ? " zet" : (pfx && STATUS_DIRS[pfx]) ? " proj" : "";
    return `<span class="wikilink${cls}" data-link="${target}"${tip ? ` title="${esc(tip)}"` : ""}>${env}${esc(label)}${at}</span>`;
  });
  h = h.replace(/(^|\s)#([\p{L}\p{N}_\-/]+)/gu, (all, sp, t) =>
    `${sp}<span class="tag" data-link="${esc(t)}">#${esc(t)}</span>`);
  h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
  h = h.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  h = h.replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1<i>$2</i>");
  h = h.replace(/\bhttps?:\/\/[^\s<]+/g, u => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
  return h.replace(/\u0000(\d+)\u0000/g, (all, i) => held[i]);
}
