/* The words a link's site gives for it, or "" when it gives none, is offline
   or does not answer in time (#404). A post has no title, so it reads as its
   author and the start of what they wrote. */
async function linkTitleLookup(url) {
  const site = LINK_TITLE_SITES.find(([re]) => re.test(url));
  if (!site) return "";
  const ask = async src => {
    const stop = new AbortController(), t = setTimeout(() => stop.abort(), 8000);
    try {
      const r = await fetch(src, {signal: stop.signal});
      return r.ok ? await r.json() : null;
    } catch (e) { return null; } finally { clearTimeout(t); }
  };
  const first = site[1](url);
  let d = await ask(first);
  if ((!d || d.error) && !first.startsWith(NOEMBED(""))) d = await ask(NOEMBED(url));
  if (!d || d.error) return "";
  const plain = h => new DOMParser().parseFromString(h, "text/html").body.textContent;
  let words = plain(String(d.title || ""));
  if (!trim(words) && d.html) {
    const p = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(d.html);
    words = plain(p ? p[1] : d.html);
    if (d.author_name && trim(words)) words = d.author_name + ": " + words;
  }
  words = trim(words.replace(/\s+/g, " ")).replace(/\[/g, "(").replace(/\]/g, ")");
  return words.length > 90 ? trim(words.slice(0, 89)) + "…" : words;
}
